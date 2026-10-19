# 文件夹页：设计与契约

这篇记录「目录链接 → 文件夹页」这一条改动的来龙去脉，以及它依赖的 DSH Client 契约。DSH 升级后如果行为变了，先回来对一遍这里的假设。

## 1. 为什么文档预览里加不出那个按钮

右侧边栏的文件预览（`@deepseek-ai/dsh-client-ui-sidebar-documentpreview`）大致是：

```
useResource(fileAddress) -> metadata.absolutePath
absolutePath !== undefined ? 渲染 header 动作槽 : 什么都不渲染
read 失败 -> 空状态（仅部分错误码给 unpreviewable 槽）
```

而 `workspaceFiles.stat` 只接受普通文件，目录直接返回 `workspace-file/not-regular-file`。于是：

- `metadata.value` 永远是 `undefined` → `fileOwner` 是 `undefined` → **头部动作槽（`sidebar.right.tab.document.actions`）不渲染**；
- 空状态里 `not-regular-file` 的处置是 `"none"` → **`unpreviewable` 槽也不渲染**。

所以右上角本来就是空的，不是「少配了一个按钮」。想在这条路径上补救，只能从 tab 之外拦截。

## 2. 方案：让目录落在自己的 tab 类型里

```
openResource / openResourceIn(文件地址)
        │
        ├─ 不是 session 文件地址 / 调用方明确指定了 kind → 原样放行
        │
        └─ workspaceFiles.list(sessionId, path)   ← 一次调用同时当"类型探测"和"首页数据"
               ├─ ok                     → 目录：以 kind=folders 打开（同一 pane，保留 replaceTab/paneId 等放置参数）
               ├─ outside-workspace      → 目录但在工作区外：仍开文件夹页，页面里给出解释
               └─ not-directory / 其它    → 文件：按原参数打开，文档预览行为不变
```

`list` 是这里最合适的探测：它在做 `confine` 之前先检查 `lstat` 类型，所以

- 文件 → `workspace-file/not-directory`（类型检查先失败，不会误判成"工作区外"）；
- 目录 → 正常返回列表，顺带把首屏数据也拿到了（插件内部用 `primedListings` 交给新 tab，省掉第二次 RPC）；
- 目录在工作区外 → `workspace-file/outside-workspace`。

## 3. 必须同时满足的两个契约

### 3.1 `sidebar.right.pane.tab` 的 key 是**类型 id**，不是 kind

右侧边栏渲染 tab 时是这样的：

```js
const definition = types.find((d) => d.kind === tab.kind)
renderSlot('sidebar.right.pane.tab', {}, { entryKey: definition?.id ?? tab.kind })
```

也就是说 body / title 槽位的 `key` 必须等于 `tabs.register({ id, kind })` 的 **`id`**。写成 `kind` 会得到
`tab.unavailable`（"无法查看此标签页"），而且**槽位注册本身看起来完全正常**，很难从检查器发现。

本插件里：

```js
const PACKAGE_ID = 'lizyoko-better-dsh'
const TYPE_ID = PACKAGE_ID + '/folders'   // 同时是注册 id 和两个槽位的 key
```

### 3.2 `remote.<ns>` 必须在 `inject` 里声明

`ctx.remote` 是一个「关联属性」代理：读 `ctx.remote.workspaceFiles` 会被改写成读上下文属性
`remote.workspaceFiles`，而该属性只有在 `inject` 中声明过才可读，否则同步抛出：

```
cannot get property "remote.workspaceFiles" without inject
```

由于这个异常发生在点击链路上，表现为"打开文件直接报错"。因此：

- 客户端插件 `inject` 里写 `remote.workspaceFiles`；
- 取实现时用 `ctx.get('remote.workspaceFiles')`（走反射层，按全名直接取），再兜底一次属性读取；
- 任何取不到的情况都返回 `undefined`，由调用方走"按原样打开"。

## 4. 失败必须开放（fail-open）

打开文件是高频动作，改道逻辑不能成为新的失败点。所有出口都遵守：

| 情况 | 结果 |
|---|---|
| Remote 命名空间缺失 / `list` 不存在 | 原样打开 |
| `list` 同步抛错 / Promise 拒绝 | 原样打开 |
| 探测超过 2.5s（`PROBE_TIMEOUT_MS`） | 原样打开 |
| 以 `folders` 类型打开失败（类型未注册等） | 再按原样打开一次 |
| 同一地址并发打开 | 共享一次探测（`pending`） |

## 5. 目录页本身

- 数据来自 `remote.workspaceFiles.list(sessionId, path, signal)`，只在 Host 允许的范围内（工作区内、≤2000 条）。
- 首次路径：tab 地址是文件地址时取地址里的 path（相对路径用会话 cwd 补齐）；是引导页地址
  （`sidebar://folders`）时从 cwd 开始。
- 钻子目录只改本地状态，不新增 tab；点文件则用 `openResourceIn(放置会话, 新地址)` 在旁边打开原来的文档预览。
- 上一级在会话工作区根处禁用（Host 的 `list` 拒绝工作区外路径，继续向上只会得到错误）。
- 不监听 `changes`，列表需要手动刷新。

## 6. 拦截的边界

只包装 `sidebarRight` 服务实例上的两个方法：

- `openResource(address, options)`：聊天里的路径链接、文件引用、工具卡片等；
- `openResourceIn(sessionId, address, options)`：tab 自己发起的打开、交付物卡片等。

不修改 `openTab`（页面类地址）、不碰非 session 作用域的地址（例如 `absolute` 地址本来就不被文档预览认领）。
清理时只在方法仍是我们安装的那个时才 `delete`，避免覆盖其他插件后来的包装。

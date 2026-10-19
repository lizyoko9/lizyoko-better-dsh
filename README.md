# better-dsh

> 个人项目 · 非官方 · 基于日常使用体验持续打磨

把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）Web 端里那些「用起来别扭」的细节，按我自己的使用习惯逐个改掉。

这个仓库是我（lizyoko）个人维护的 DSH 增强插件集合。它不是官方项目，不代表 DeepSeek 的立场；里面每一条改动都来自我自己每天用 DSH 时踩到的坑，而不是一份「通用最佳实践」清单。觉得某条改动不合口味，随时可以在 `client.js` 里关掉对应部分。

## 目前包含

### 1. 目录链接不再走进死胡同

**问题**：在聊天里点一个目录路径（或 `present` 一个目录）时，右侧边栏的文档预览只会显示：

> 该路径不是普通文件，没有可显示的内容

而且**右上角连一个按钮都没有**——因为预览的头部工具区只在 `stat` 拿到普通文件元数据后才渲染，目录根本走不到那一步。

**现在**：

- 点目录 → 同一个位置打开**文件夹页**：文件夹优先排序、上一级、刷新、显示文件大小，点文件用原来的文档预览打开；
- 打开文件的行为**完全不变**（探测失败、超时、取不到 Remote 时都按老路走，见 [设计文档](docs/folder-browser.md)）；
- 右侧边栏「+」的引导页里多了一张 **「浏览文件夹」** 卡片，可以从工作区根目录手动开逛。

## 安装

前置：一个能装 profile 插件的 DSH（Desktop 或 Web）。本项目以 **bundle** 形式发布，安装后写入当前 profile，所有会话生效。

### 方式 A：直接从 GitHub 安装

打开侧栏的 **Plugins** 页面，用它的安装入口填入：

```
git+https://github.com/lizyoko9/lizyoko-better-dsh
```

（不同 DSH 版本的按钮文案略有差异；源码版 Web 也可以直接选本地目录，见方式 B。）

### 方式 B：本地克隆后按路径安装

```bash
git clone https://github.com/lizyoko9/lizyoko-better-dsh.git
```

然后在 Plugins 页选择这个目录安装；或者在让 agent 代劳时，把**绝对路径**交给 `plugin_manager` 的 `install_bundle`。包内没有构建步骤，`client.js` 是最终产物，克隆下来即可安装。

### 验证

安装成功后：

1. 已打开的页面通常会在 1 秒内热更新插件（`dsh-client-hmr` 每 500ms 轮询构建产物），不需要重启；
2. 侧栏「+」里出现「浏览文件夹」；
3. 点聊天里任意目录路径，应直接得到文件夹列表。

### 卸载

Plugins 页里删除 `lizyoko-better-dsh` 即可（会写回 profile 的依赖与 bundle 选择）。

## 兼容性

- 针对 DSH `0.2.1-rc.2` 的 Client 插件接口开发：右侧边栏 tab 注册表、`workspaceFiles` Remote、`slots` / `locale` 服务。
- DSH 升级后如果接口有变动，最可能坏在 tab 类型注册与 Remote 命名空间上；`docs/folder-browser.md` 记录了依赖的确切契约。
- 只影响 Web 端 UI，不注册任何工具、不写会话事件、不改变模型输入。

## 开发

```bash
git clone https://github.com/lizyoko9/lizyoko-better-dsh.git
cd lizyoko-better-dsh
node --check client.js   # 唯一的构建校验：文件本身就是产物
```

改完保存即可，运行中的 DSH 会在约 1 秒内热替换（Console 里带 `better-dsh:` 前缀的日志帮助定位失败路径）。如果插件列表里显示 `failed`，先看页面 Console 的导入/激活报错。

目录：

| 文件 | 作用 |
|---|---|
| `client.js` | 全部 UI 能力（Client 半） |
| `index.js` | Host 半（当前为空，仅用于让 Loader 扫描 `dsh.client`） |
| `cordis.patch.yml` | 往 profile 里插入本 bundle 的插件行 |
| `locale/{zh,en}.json` | Plugins 页显示的标题与描述 |
| `icon.svg` | 插件图标 |

## License

MIT。图标与代码均为本仓库原创。

## 免责声明

本项目是个人作品，与 DeepSeek 官方无关，也未获得其背书。「DeepSeek」「DeepSeek Harness」等名称与商标归其权利人所有。插件会在你的 DSH profile 中注册 UI 扩展，安装前请自行阅读源码。

---

## English

**better-dsh** is a personal, unofficial collection of UX fixes for the DeepSeek Harness web client, built from my own day-to-day usage.

Today it contains one feature: directory links open as a browsable folder tab in the right Sidebar instead of a dead "not a regular file" empty state (with no toolbar at all). Files keep their original preview behavior; a failed or timed-out probe always falls back to the old path. A "Browse folders" card is also added to the Sidebar's `+` guide.

Install from the **Plugins** page with `git+https://github.com/lizyoko9/lizyoko-better-dsh`, or point the installer at a local clone. No build step. Targets DSH `0.2.1-rc.2`. MIT licensed, provided as is.

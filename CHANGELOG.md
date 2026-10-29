# Changelog

## 0.4.1 — 2026-10-29

- Read the saved theme again whenever the Theme Studio panel mounts, so reopening Settings does not show “DSH default” while a custom layer is still active.

## 0.4.0 — 2026-10-29

新增 **主题工作室**：设置 → 通用。

- 六套主题：Obsidian、Nord、Catppuccin、Rosé Pine、Tokyo Night、Solarized，每套都有亮色/暗色变体。
- 通过 `ctx.theme.overrideTokens` 应用别名 token 层，不改变 DSH 的亮色/暗色/系统偏好；系统切换时主题自动跟随。
- 「DSH 默认」移除覆盖层；自定义主题保存在当前浏览器。

## 0.3.0 — 2026-10-28

新增 **字体与字号** 设置项：设置 → 通用。

- 三行字体输入（界面 / 代码 / 终端）与对应字号，留空恢复默认字体；多个字体用逗号分隔。
- 「恢复默认」清空字体并恢复 14 / 11 / 13 px。
- 通过 `ctx.theme.setFontFamily` / `setFontSize` 写入 DSH 的 `ui-theme` 设置，与内置行共用持久化路径；界面与终端即时生效。
- 面板在 `settings.general.item` 注册，`ui-theme` 服务缺失时不注册，不影响其他功能。

## 0.2.0 — 2026-10-27

新增 **任务中心（Mission Control）**：右侧边栏的跨会话总览。

- 新 tab 类型 `mission`：会话头部雷达按钮与右侧边栏「+」引导卡片都能打开。
- 三个分区：需要你（审批 / 计划确认 / 提问 / 已完成未查看）、正在运行（会话 + 后台任务 + 最近活动时间）、已排期（活跃定时任务按下次触发排序）。
- 顶部统计：运行中 / 待处理 / 已排期；点击任意行跳到对应会话。
- 读取 Session status、jobs、schedule 的既有客户端面；按需订阅 `schedule/changed` 与连接重置，服务缺失时降级为空列表，不影响文件夹页。
- 热更新下同步更新样式表，避免旧 CSS 残留。

## 0.1.0 — 2026-10-19

首个公开版本。

- 新增 `folders` 右侧边栏 tab 类型：目录列表、文件夹优先排序、上一级、刷新、文件大小、点文件进文档预览。
- 目录地址自动改道：`openResource` / `openResourceIn` 先做一次 `workspaceFiles.list` 探测，目录以 `folders`
  类型打开并复用首屏列表；文件与所有失败路径保持原行为（2.5s 超时上限）。
- 右侧边栏「+」引导页新增「浏览文件夹」卡片。
- 修复两个契约问题：tab 类型 id 必须与 body/title 槽位 key 一致；`remote.workspaceFiles` 必须写入
  `inject`（否则点击打开时报 `cannot get property ... without inject`）。

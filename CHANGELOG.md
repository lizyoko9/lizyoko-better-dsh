# Changelog

## 0.1.0 — 2026-10-19

首个公开版本。

- 新增 `folders` 右侧边栏 tab 类型：目录列表、文件夹优先排序、上一级、刷新、文件大小、点文件进文档预览。
- 目录地址自动改道：`openResource` / `openResourceIn` 先做一次 `workspaceFiles.list` 探测，目录以 `folders`
  类型打开并复用首屏列表；文件与所有失败路径保持原行为（2.5s 超时上限）。
- 右侧边栏「+」引导页新增「浏览文件夹」卡片。
- 修复两个契约问题：tab 类型 id 必须与 body/title 槽位 key 一致；`remote.workspaceFiles` 必须写入
  `inject`（否则点击打开时报 `cannot get property ... without inject`）。

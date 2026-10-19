# better-dsh

English | [简体中文](README.zh-CN.md)

Built against [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) `0.2.1-rc.2`.

## What's changed

### Directory links open properly

Clicking a directory path in chat (or `present`-ing a directory) used to show only "This path is not a regular file and has no content to display" in the right sidebar, with no buttons in the top-right corner. The preview header only renders after `stat` returns file info, and directories never get that far.

With this plugin:

- Clicking a directory opens a folder view: a file list (folders first) with file sizes, plus up-one-level and refresh. Clicking a file still opens it in the normal preview.
- Opening files works the same as before. If the probe fails, times out, or the Remote isn't available, it falls back to the original behavior. Details in [docs/folder-browser.md](docs/folder-browser.md).
- The sidebar's `+` menu gets a "Browse folders" card for starting from the workspace root.

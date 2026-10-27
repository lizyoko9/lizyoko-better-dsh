# better-dsh

English | [简体中文](README.zh-CN.md)

Built against [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) `0.2.1-rc.3`.

## What's changed

### Directory links open properly

Clicking a directory path in chat (or `present`-ing a directory) used to show only "This path is not a regular file and has no content to display" in the right sidebar, with no buttons in the top-right corner. The preview header only renders after `stat` returns file info, and directories never get that far.

With this plugin:

- Clicking a directory opens a folder view: a file list (folders first) with file sizes, plus up-one-level and refresh. Clicking a file still opens it in the normal preview.
- Opening files works the same as before. If the probe fails, times out, or the Remote isn't available, it falls back to the original behavior. Details in [docs/folder-browser.md](docs/folder-browser.md).
- The sidebar's `+` menu gets a "Browse folders" card for starting from the workspace root.

### Mission Control

Sessions, background jobs, approvals and scheduled tasks were spread across the sidebar, the session header, the Automation page and the right Sidebar. Mission Control pulls them into one right-Sidebar tab:

- **Needs you**: approvals, plan reviews, questions and finished-but-unseen sessions, ordered by urgency.
- **Running**: active sessions and background jobs, with job counts and the last activity time.
- **Scheduled**: active scheduled tasks, ordered by the next run.
- Click any row to open its session; the three counters at the top are running / waiting / scheduled.

It reads the existing Session, status, jobs and schedule client surfaces and degrades to empty lists when a service is absent, so the folder tab is unaffected. It is read-only for now: refresh and navigation work; stopping jobs, approving and running a schedule on demand are not wired yet.

### Fonts & sizes

Some 0.2 builds do not render the built-in "More font settings" row. This plugin adds a General-settings panel:

- Interface, code and terminal font families, plus their sizes (10–22, 10–16, 10–20 px).
- Leave an input empty for the default; separate fallbacks with commas.
- Reset clears the three families and restores 14 / 11 / 13 px.
- Writes through DSH's own `ui-theme` settings, so it persists and applies immediately.

## Install

Install from the **Plugins** page with:

```
git+https://github.com/lizyoko9/lizyoko-better-dsh
```

Or point the installer at a local clone. No build step: `client.js` is the final artifact.

## Compatibility

Verified on DSH `0.2.1-rc.3` (first developed against `0.2.1-rc.2`). If a future release changes the tab-type registry, the Remote namespaces or the `settings.general.item` slot, the affected feature may stop loading; the Console logs are prefixed with `better-dsh:`.

The plugin only touches the Web client UI: it registers no tools, writes no session events and does not change model input.

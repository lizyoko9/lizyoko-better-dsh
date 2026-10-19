# better-dsh

我自己用 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）Web 端时，碰到不顺手的地方就顺手改掉，攒在这个插件里。个人项目，跟 DeepSeek 官方没关系。

## 改了什么

### 目录链接能直接打开了

原来在聊天里点一个目录路径（或者 `present` 一个目录），右边栏只会显示一句「该路径不是普通文件，没有可显示的内容」，右上角也没有任何按钮——预览头部要等 `stat` 拿到文件信息才渲染，目录走不到那一步。

装了这个插件之后：

- 点目录会打开一个文件夹页，能看到文件列表（文件夹排前面）和文件大小，可以返回上一级、刷新，点文件还是用原来的预览打开。
- 点文件的行为没变。探测失败、超时或者拿不到 Remote 的时候，都按原来的逻辑走，细节写在 [docs/folder-browser.md](docs/folder-browser.md)。
- 右边栏「+」里加了一张「浏览文件夹」卡片，可以从工作区根目录开始翻。

## 安装

需要一个能装 profile 插件的 DSH（Desktop 或 Web 都行）。装好后对当前 profile 的所有会话生效。

在侧栏 Plugins 页面里填：

```
git+https://github.com/lizyoko9/lizyoko-better-dsh
```

不同版本的按钮文字可能不太一样。也可以先克隆到本地，再在 Plugins 页选这个目录；让 agent 帮你装的话，把绝对路径交给 `plugin_manager` 的 `install_bundle`。没有构建步骤，克隆下来就能装。

装好以后一般不用重启，已打开的页面一秒左右会自动刷新插件。侧栏「+」里出现「浏览文件夹」就说明装上了。

卸载：在 Plugins 页删掉 `lizyoko-better-dsh`。

## 兼容性

基于 DSH `0.2.1-rc.2` 写的，用到了右边栏 tab 注册、`workspaceFiles` Remote 和 `slots` / `locale` 服务。以后 DSH 升级，最可能出问题的是 tab 类型注册和 Remote 命名空间，依赖的接口都记在 `docs/folder-browser.md` 里。

插件只改 Web 端界面，不注册工具，不写会话事件，也不影响模型输入。

## 开发

```bash
git clone https://github.com/lizyoko9/lizyoko-better-dsh.git
cd lizyoko-better-dsh
node --check client.js
```

`client.js` 就是最终产物，改完保存，正在运行的 DSH 会自动热替换。插件列表里显示 `failed` 的话，打开页面 Console 看报错，插件的日志都带 `better-dsh:` 前缀。

- `client.js`：所有 UI 逻辑
- `index.js`：Host 端，目前是空的，只是让 Loader 能扫到 `dsh.client`
- `cordis.patch.yml`：把插件写进 profile
- `locale/{zh,en}.json`：Plugins 页显示的标题和描述
- `icon.svg`：图标

## License

MIT

---

## English

A small DeepSeek Harness plugin with fixes for things that bugged me in the web client. Not affiliated with DeepSeek.

Right now it does one thing: clicking a directory path opens a folder view in the right sidebar instead of the "not a regular file" empty page. Files still open in the normal preview, and if anything goes wrong it falls back to the old behavior. There's also a "Browse folders" card in the sidebar's `+` menu.

Install from the Plugins page with `git+https://github.com/lizyoko9/lizyoko-better-dsh`, or point it at a local clone. Built against DSH `0.2.1-rc.2`. MIT.

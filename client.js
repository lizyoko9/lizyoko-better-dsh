window.__ModuleLoader__.load({
  id: 'lizyoko-better-dsh',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Package identity: the module-table id and the CSS owner. */
    const PACKAGE_ID = 'lizyoko-better-dsh';
    /**
     * The tab type identity. It is BOTH the registry id and the key of the
     * `sidebar.right.pane.tab` / `.title` cells: the owner dispatches those cells
     * with the type's `id`, not its `kind`, so the two must be one string.
     */
    const TYPE_ID = PACKAGE_ID + '/folders';
    /** The tab kind this type owns. */
    const KIND = 'folders';
    /** Client locale namespace. */
    const NS = 'betterDsh';
    /** The file-address grammar this package reads. */
    const FILE_PREFIX = 'dsh-resource://file/';
    /** How long a directory listing fetched by the router may seed the tab. */
    const LIST_PRIME_TTL_MS = 10000;
    /** How long an address probe may delay an open before it falls back to the old path. */
    const PROBE_TIMEOUT_MS = 2500;

    //#region styles
    const CSS = [
      '.bdsh_root{box-sizing:border-box;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;display:flex}',
      '.bdsh_header{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:4px;height:38px;padding:0 6px 0 14px;display:flex}',
      '.bdsh_path{flex:1 1 auto;min-width:0;align-items:baseline;gap:0;font-size:12px;display:flex;overflow:hidden;white-space:nowrap}',
      '.bdsh_pathDir{flex:0 1 auto;min-width:0;color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;overflow:hidden;white-space:nowrap}',
      '.bdsh_pathName{flex:0 0 auto;color:var(--dsw-alias-label-primary);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%}',
      '.bdsh_tool{width:28px;height:28px;color:var(--dsw-alias-label-secondary);border-radius:6px;cursor:pointer;background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:6px;line-height:1;display:inline-flex}',
      '.bdsh_tool svg{width:15px;height:15px}',
      '.bdsh_tool:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.bdsh_tool:disabled{opacity:.4;cursor:default;background:0 0;color:var(--dsw-alias-label-secondary)}',
      '.bdsh_body{scrollbar-gutter:stable;flex:auto;min-height:0;margin-right:2px;padding:6px 6px 14px;overflow:auto}',
      '.bdsh_list{margin:0;padding:0;list-style:none}',
      '.bdsh_item{margin:0;padding:0;list-style:none}',
      '.bdsh_row{width:100%;min-width:0;color:inherit;font:inherit;text-align:left;border-radius:6px;cursor:pointer;background:0 0;border:0;align-items:center;gap:7px;padding:5px 8px;display:flex}',
      '.bdsh_row:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.bdsh_row[data-type=other]{color:var(--dsw-alias-label-secondary);cursor:default}',
      '.bdsh_row[data-type=other]:hover{background:0 0}',
      '.bdsh_icon{flex:none;display:inline-flex}',
      '.bdsh_name{white-space:nowrap;text-overflow:ellipsis;min-width:0;flex:1 1 auto;overflow:hidden}',
      '.bdsh_size{color:var(--dsw-alias-label-secondary);flex:none;font-size:12px;font-variant-numeric:tabular-nums}',
      '.bdsh_note{color:var(--dsw-alias-label-secondary);margin:0;padding:3px 8px;font-size:12px}',
      '.bdsh_status{flex-direction:column;align-items:flex-start;padding:12px 10px;display:flex}',
      '.bdsh_statusLine{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.6}',
      '.bdsh_statusLine[data-error]{color:var(--dsw-alias-state-error-primary)}',
      '.bdsh_retry{margin-top:8px;color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;cursor:pointer;background:var(--dsw-alias-bg-layer-1);padding:4px 10px;font:inherit;font-size:12px}',
      '.bdsh_retry:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.bdsh_chip{align-items:center;gap:6px;min-width:0;display:inline-flex}',
      '.bdsh_chipIcon{flex:none;display:inline-flex}',
      '.bdsh_chipText{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}'
    ].join('\n');
    const CSS_TAG_ID = PACKAGE_ID + '/better-dsh.css';
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG_ID) + ']') === null) {
      const tag = document.createElement('style');
      tag.dataset.plugin = PACKAGE_ID;
      tag.dataset.pluginCss = CSS_TAG_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    //#endregion

    //#region copy
    const zh = {
      title: '文件夹',
      'guide.title': '浏览文件夹',
      'guide.description': '按文件管理器的方式列出工作区里的文件夹',
      loading: '正在读取文件夹…',
      empty: '这个文件夹是空的',
      retry: '重试',
      reload: '刷新',
      up: '上一级',
      'openFile.aria': '打开 {name}',
      'openFolder.aria': '进入 {name}',
      truncated: '仅显示前一部分条目',
      'error.notDirectory': '这不是一个文件夹',
      'error.notFound': '这个文件夹已经不存在了',
      'error.outside': '这个文件夹在工作区之外，无法列出',
      'error.unavailable': '无法读取文件夹：{message}',
      noWorkspace: '这个会话还没有工作区',
      'size.bytes': '{count} B',
      'size.kb': '{count} KB',
      'size.mb': '{count} MB'
    };
    const en = {
      title: 'Folder',
      'guide.title': 'Browse folders',
      'guide.description': 'List the folders in this workspace like a file manager',
      loading: 'Reading folder…',
      empty: 'This folder is empty',
      retry: 'Retry',
      reload: 'Reload',
      up: 'Parent folder',
      'openFile.aria': 'Open {name}',
      'openFolder.aria': 'Enter {name}',
      truncated: 'Only the first entries are shown',
      'error.notDirectory': 'This is not a folder',
      'error.notFound': 'This folder no longer exists',
      'error.outside': 'This folder is outside the workspace and cannot be listed',
      'error.unavailable': 'Could not read the folder: {message}',
      noWorkspace: 'This session has no workspace yet',
      'size.bytes': '{count} B',
      'size.kb': '{count} KB',
      'size.mb': '{count} MB'
    };
    //#endregion

    //#region addresses and paths
    /** Component-encode one id or path segment, keeping `:` literal for drive letters. */
    function encodeSegment(segment) {
      return encodeURIComponent(segment).replace(/%3A/gi, ':');
    }
    /** Build the `dsh-resource://file/session/…` address of one path. */
    function fileAddressFor(sessionId, path) {
      const normalized = String(path).replace(/\\/g, '/').replace(/^(?:\.\/)+/, '');
      return FILE_PREFIX + 'session/' + encodeSegment(sessionId) + '/' + normalized.split('/').map(encodeSegment).join('/');
    }
    /** Read a file address back into its session and path, or `undefined` for anything else. */
    function parseFileAddress(address) {
      if (typeof address !== 'string' || address.lastIndexOf(FILE_PREFIX, 0) !== 0) return undefined;
      const end = address.search(/[?#]/);
      const body = address.slice(FILE_PREFIX.length, end === -1 ? undefined : end);
      const parts = body.split('/');
      if (parts[0] !== 'session') return undefined;
      const id = parts[1];
      const segments = parts.slice(2);
      if (id === undefined || id === '' || segments.length === 0) return undefined;
      try {
        return {
          scope: 'session',
          sessionId: decodeURIComponent(id),
          path: segments.map(decodeURIComponent).join('/')
        };
      } catch (_error) {
        return undefined;
      }
    }
    /** Whether a path is absolute in either spelling the Host accepts. */
    function isAbsolutePath(path) {
      return path.startsWith('/') || /^[A-Za-z]:\//.test(path) || path.startsWith('//');
    }
    /** Normalize separators and drop trailing separators, keeping the root. */
    function normalizeDir(path) {
      let value = String(path === undefined || path === null ? '' : path).replace(/\\/g, '/');
      if (value.length > 1) value = value.replace(/\/+$/, '');
      return value === '' ? '/' : value;
    }
    /** Join a directory and one child name into a normalized absolute path. */
    function joinPath(dir, name) {
      const raw = String(dir === undefined || dir === null ? '' : dir).replace(/\\/g, '/');
      const base = raw.length > 1 ? raw.replace(/\/+$/, '') : raw;
      const child = String(name === undefined || name === null ? '' : name);
      if (child === '') return base === '' ? '/' : base;
      if (isAbsolutePath(child)) return normalizeDir(child);
      if (base === '') return normalizeDir(child);
      if (base === '/') return normalizeDir('/' + child);
      return normalizeDir(base + '/' + child);
    }
    /** The parent directory of one normalized path, or the path itself at a root. */
    function parentOf(path) {
      const trimmed = String(path).replace(/[/\\]+$/, '');
      if (trimmed === '' || trimmed === '/') return '/';
      const cut = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
      if (cut < 0) return trimmed;
      const parent = trimmed.slice(0, cut);
      if (/^[A-Za-z]:$/.test(parent)) return parent + '/';
      return parent === '' ? '/' : parent;
    }
    /** Split a path into its directory prefix and its final segment. */
    function splitPath(path) {
      const trimmed = String(path).replace(/[/\\]+$/, '');
      if (trimmed === '') return { dir: '', name: path };
      const cut = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\')) + 1;
      return { dir: trimmed.slice(0, cut), name: trimmed.slice(cut) };
    }
    /**
     * Whether the header's up control may leave the current directory.
     *
     * A directory inside the Session workspace stops at that workspace root: the
     * listing endpoint refuses paths above it, so offering the move would only
     * replace a good listing with an error. A directory opened outside the
     * workspace keeps walking up to the filesystem root.
     */
    function canGoUpFrom(current, cwd) {
      const parent = parentOf(current);
      if (parent === current) return false;
      const root = cwd === undefined || cwd === null || cwd === '' ? '' : normalizeDir(cwd);
      if (root !== '' && root !== '/' && current === root) return false;
      return true;
    }
    /** The chip title of one address: its final path segment, or the generic folder title. */
    function titleOf(address, t) {
      const parsed = parseFileAddress(address);
      const path = parsed === undefined ? '' : parsed.path;
      const trimmed = path.replace(/[/\\]+$/g, '');
      const cut = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
      const name = cut === -1 ? trimmed : trimmed.slice(cut + 1);
      return name === '' ? t('title') : name;
    }
    /** Say what went wrong with a directory listing, in the user's terms. */
    function failureLine(t, failure) {
      const code = failure === undefined ? '' : failure.code;
      switch (code) {
        case 'workspace-file/not-found':
          return t('error.notFound');
        case 'workspace-file/not-directory':
          return t('error.notDirectory');
        case 'workspace-file/outside-workspace':
          return t('error.outside');
        default:
          return t('error.unavailable', {
            message: failure !== undefined && failure.message !== undefined ? failure.message : String(code || 'unknown')
          });
      }
    }
    //#endregion

    //#region remote face
    /**
     * The `workspaceFiles` Remote namespace, read without touching the `remote`
     * namespace object.
     *
     * `ctx.remote.<ns>` is an associated-property proxy: reading a namespace off
     * it resolves the context property `remote.<ns>`, which throws
     * `cannot get property "remote.workspaceFiles" without inject` unless the
     * plugin declared it. Reading the declared service by its full name goes
     * through the reflection layer directly, and a build without the namespace
     * simply yields `undefined`.
     *
     * @param ctx - the client plugin context.
     * @returns the namespace face, or `undefined` when it is not mounted.
     */
    function workspaceFilesOf(ctx) {
      try {
        const face = ctx.get('remote.workspaceFiles');
        if (face !== undefined && face !== null) return face;
      } catch (_error) {}
      try {
        const face = ctx['remote.workspaceFiles'];
        return face === undefined || face === null ? undefined : face;
      } catch (_error) {
        return undefined;
      }
    }
    //#endregion

    //#region artwork
    /** Folder glyph used by rows, the chip title, and the guide entry. */
    function FolderGlyph(props) {
      const size = props !== undefined && typeof props.size === 'number' ? props.size : 16;
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        'aria-hidden': 'true',
        className: props === undefined ? undefined : props.className,
        style: { color: 'var(--dsw-alias-state-warn-primary)', flex: 'none' }
      }, h('path', {
        d: 'M1.6 3.7c0-.6.5-1.1 1.1-1.1h3.1c.3 0 .6.1.8.3l.9.9h5.8c.6 0 1.1.5 1.1 1.1v7.2c0 .6-.5 1.1-1.1 1.1H2.7c-.6 0-1.1-.5-1.1-1.1V3.7Z',
        fill: 'currentColor'
      }));
    }
    /** File glyph used by a row that opens a document preview. */
    function FileGlyph(props) {
      const size = props !== undefined && typeof props.size === 'number' ? props.size : 16;
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        'aria-hidden': 'true',
        style: { color: 'var(--dsw-alias-label-secondary)', flex: 'none' }
      },
        h('path', { d: 'M4 1.9h5.1L12.6 5.4v8.7H4V1.9Z', stroke: 'currentColor', strokeWidth: 1.2, strokeLinejoin: 'round' }),
        h('path', { d: 'M9 2.2v3.5h3.4', stroke: 'currentColor', strokeWidth: 1.2, strokeLinejoin: 'round' })
      );
    }
    /** Up-one-level glyph. */
    function UpGlyph() {
      return h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' },
        h('path', {
          d: 'M8 12.6V3.9M8 3.9 4.1 7.8M8 3.9l3.9 3.9',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        })
      );
    }
    /** Reload glyph. */
    function ReloadGlyph() {
      return h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' },
        h('path', {
          d: 'M13 8a5 5 0 1 1-1.7-3.75',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round'
        }),
        h('path', {
          d: 'M13.2 2.7v2.6h-2.6',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        })
      );
    }
    //#endregion

    //#region timing
    /**
     * Settle with a promise's value, or with a fallback after `ms`, so a probe that
     * never answers cannot swallow the click that started it.
     */
    function settleWithin(promise, ms, fallback) {
      return new Promise((resolve) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          resolve(fallback);
        }, ms);
        Promise.resolve(promise).then((value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(value);
        }, () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(fallback);
        });
      });
    }
    //#endregion

    //#region listing prime
    /**
     * Listings fetched while deciding whether an address is a directory, kept so
     * the tab the router opens renders without a second round trip.
     */
    const primedListings = new Map();
    /** Remember one listing for the tab the router is about to open. */
    function primeListing(address, listing) {
      primedListings.set(address, { at: Date.now(), listing });
      if (primedListings.size > 32) {
        const oldest = primedListings.keys().next();
        if (!oldest.done) primedListings.delete(oldest.value);
      }
    }
    /** Take (and forget) the listing primed for one address, when it is still fresh. */
    function takePrimedListing(address) {
      const entry = primedListings.get(address);
      if (entry === undefined) return undefined;
      primedListings.delete(address);
      return Date.now() - entry.at > LIST_PRIME_TTL_MS ? undefined : entry.listing;
    }
    //#endregion

    //#region directory routing
    /**
     * Make every file-address open decide the target's kind first.
     *
     * The shipped document preview claims a whole file address but can only read
     * regular files; a directory therefore lands on a dead "not a regular file"
     * empty state with no action. A directory listing request is the cheapest
     * probe that both decides the kind and returns the first listing: `ok` (or
     * `outside-workspace`, which is only reachable after the type check) means a
     * directory, while a file reports `not-directory`. A directory is then opened
     * under this package's kind, in the same pane and with the caller's placement
     * options, so the user sees its contents instead. Every failure path opens the
     * address exactly as before, so the preview keeps its behavior for files.
     *
     * @param ctx - the client plugin context.
     * @returns the in-session file opener used by the tab's own rows.
     */
    function installDirectoryRouting(ctx) {
      const right = ctx.get('sidebarRight');
      const canRoute = right !== undefined && typeof right.openResource === 'function' && typeof right.openResourceIn === 'function';
      if (!canRoute) return { openFile: () => {} };

      const openResource = right.openResource;
      const openResourceIn = right.openResourceIn;
      const pending = new Map();

      /** One in-flight probe shared by every open of the same address. */
      function probe(address, parsed) {
        if (parsed.path === '') return Promise.resolve({ directory: true, listing: undefined });
        const running = pending.get(address);
        if (running !== undefined) return running;
        const files = workspaceFilesOf(ctx);
        if (files === undefined || typeof files.list !== 'function') {
          return Promise.resolve({ directory: false, listing: undefined });
        }
        let call;
        try {
          call = files.list(parsed.sessionId, parsed.path);
        } catch (_error) {
          return Promise.resolve({ directory: false, listing: undefined });
        }
        const verdict = Promise.resolve(call).then((result) => {
          if (result !== undefined && result !== null && result.ok === true) {
            return { directory: true, listing: result.value };
          }
          const code = result !== undefined && result !== null && result.error !== undefined ? result.error.code : undefined;
          return { directory: code === 'workspace-file/outside-workspace', listing: undefined };
        }, () => ({ directory: false, listing: undefined }));
        const request = settleWithin(verdict, PROBE_TIMEOUT_MS, { directory: false, listing: undefined });
        pending.set(address, request);
        request.then(() => {
          if (pending.get(address) === request) pending.delete(address);
        });
        return request;
      }

      /** Probe the address, then open it under this package's kind or unchanged. */
      function route(address, parsed, options, open) {
        const target = right;
        let pendingVerdict;
        try {
          pendingVerdict = probe(address, parsed);
        } catch (error) {
          console.error('better-dsh: directory probe failed', error);
          open.call(target, address, options);
          return;
        }
        pendingVerdict.then((verdict) => {
          if (verdict.directory === true) {
            if (verdict.listing !== undefined) primeListing(address, verdict.listing);
            try {
              open.call(target, address, Object.assign({}, options, { kind: KIND }));
            } catch (error) {
              console.error('better-dsh: could not open the directory tab', error);
              try {
                open.call(target, address, options);
              } catch (fallbackError) {
                console.error('better-dsh: could not open the address', fallbackError);
              }
            }
            return;
          }
          try {
            open.call(target, address, options);
          } catch (error) {
            console.error('better-dsh: could not open the address', error);
          }
        });
      }

      const routedOpenResource = function (address, options) {
        const parsed = parseFileAddress(address);
        if (parsed === undefined || parsed.scope !== 'session' || (options !== undefined && options.kind !== undefined)) {
          return openResource.call(this, address, options);
        }
        route(address, parsed, options, openResource);
      };
      const routedOpenResourceIn = function (sessionId, address, options) {
        const parsed = parseFileAddress(address);
        if (parsed === undefined || parsed.scope !== 'session' || (options !== undefined && options.kind !== undefined)) {
          return openResourceIn.call(this, sessionId, address, options);
        }
        route(address, parsed, options, function (value, placement) {
          return openResourceIn.call(this, sessionId, value, placement);
        });
      };

      try {
        Object.defineProperty(right, 'openResource', { value: routedOpenResource, configurable: true, writable: true, enumerable: false });
        Object.defineProperty(right, 'openResourceIn', { value: routedOpenResourceIn, configurable: true, writable: true, enumerable: false });
      } catch (error) {
        console.error('better-dsh: directory routing is unavailable on this build', error);
      }
      ctx.effect(() => () => {
        pending.clear();
        if (right.openResource === routedOpenResource) delete right.openResource;
        if (right.openResourceIn === routedOpenResourceIn) delete right.openResourceIn;
      }, 'better-dsh: routing');

      return {
        /** Open one file in a tab of `placementSessionId`, bypassing the kind probe. */
        openFile: (placementSessionId, address) => {
          try {
            openResourceIn.call(right, placementSessionId, address);
          } catch (error) {
            console.error('better-dsh: could not open the file', error);
          }
        }
      };
    }
    //#endregion

    //#region the tab
    /**
     * Build the body component: one directory at a time, navigable in place.
     *
     * The tab's address decides the first directory (a file address names it; the
     * guide's page address falls back to the Session workspace), and drilling in
     * keeps the tab while replacing what it lists.
     *
     * @param ctx - the client plugin context, read for the Remote face.
     * @param openFile - the in-session opener for file rows.
     * @returns the React body for the `folders` kind.
     */
    function createFolderBody(ctx, openFile) {
      return function FolderBody(props) {
        const sessionId = props.sessionId;
        const useTabInfo = props.useTabInfo;
        const useSessions = props.useSessions;
        const t = props.t;
        const info = useTabInfo();
        const tab = info.tab;
        const cwd = useSessions((sessions) => sessions.byId[sessionId]?.cwd);
        const address = tab.contentId;
        const parsed = parseFileAddress(address);
        const readSession = parsed === undefined ? sessionId : parsed.sessionId;
        const rawPath = parsed === undefined ? '' : parsed.path;

        const initialPath = (function () {
          const normalized = rawPath.replace(/\\/g, '/');
          if (parsed !== undefined && isAbsolutePath(normalized)) return normalizeDir(normalized);
          if (cwd === undefined || cwd === null || cwd === '') return undefined;
          return joinPath(normalizeDir(cwd), parsed === undefined ? '' : normalized);
        })();

        const state = React.useState(initialPath);
        const manualPath = state[0];
        const setManualPath = state[1];

        const current = manualPath === null || manualPath === undefined ? initialPath : manualPath;

        const viewState = React.useState(undefined);
        const view = viewState[0];
        const setView = viewState[1];
        const requestRef = React.useRef(0);
        const signal = tab.signal;

        const load = React.useCallback((dir) => {
          const sequence = requestRef.current + 1;
          requestRef.current = sequence;
          const primed = takePrimedListing(address);
          if (primed !== undefined) {
            setView({ status: 'ready', dir, listing: primed });
            return;
          }
          setView({ status: 'loading', dir });
          const files = workspaceFilesOf(ctx);
          if (files === undefined || typeof files.list !== 'function') {
            setView({ status: 'error', dir, failure: { code: 'unavailable', message: 'workspaceFiles' } });
            return;
          }
          let call;
          try {
            call = files.list(readSession, dir, signal);
          } catch (error) {
            setView({ status: 'error', dir, failure: { code: 'unavailable', message: String(error) } });
            return;
          }
          Promise.resolve(call).then((result) => {
            if (sequence !== requestRef.current || signal.aborted) return;
            if (result !== undefined && result !== null && result.ok === true) {
              setView({ status: 'ready', dir, listing: result.value });
              return;
            }
            setView({
              status: 'error',
              dir,
              failure: result !== undefined && result !== null && result.error !== undefined ? result.error : { code: 'unavailable' }
            });
          }, (error) => {
            if (sequence !== requestRef.current || signal.aborted) return;
            setView({
              status: 'error',
              dir,
              failure: { code: 'unavailable', message: error !== undefined && error !== null && error.message !== undefined ? error.message : String(error) }
            });
          });
        }, [address, readSession, signal, setView]);

        React.useEffect(() => {
          if (current === null || current === undefined) return;
          load(current);
        }, [current, load]);

        if (current === null || current === undefined) {
          return h('div', { className: 'bdsh_root', 'data-better-dsh': 'no-workspace' },
            h('div', { className: 'bdsh_status' },
              h('p', { className: 'bdsh_statusLine' }, t('noWorkspace'))
            )
          );
        }

        const parts = splitPath(current);
        const canGoUp = canGoUpFrom(current, cwd);
        const shown = view !== undefined && view.dir === current ? view : { status: 'loading', dir: current };

        const go = (next) => {
          const normalized = normalizeDir(next);
          if (normalized !== current) setManualPath(normalized);
        };
        const reload = () => {
          load(current);
        };

        const header = h('div', { className: 'bdsh_header' },
          h('span', { className: 'bdsh_path', title: current },
            parts.dir === '' ? null : h('span', { className: 'bdsh_pathDir' }, parts.dir),
            h('span', { className: 'bdsh_pathName' }, parts.name)
          ),
          h('button', {
            type: 'button',
            className: 'bdsh_tool',
            'data-better-dsh-up': true,
            'aria-label': t('up'),
            title: t('up'),
            disabled: !canGoUp,
            onClick: () => go(parentOf(current))
          }, h(UpGlyph)),
          h('button', {
            type: 'button',
            className: 'bdsh_tool',
            'data-better-dsh-reload': true,
            'aria-label': t('reload'),
            title: t('reload'),
            onClick: reload
          }, h(ReloadGlyph))
        );

        let body;
        if (shown.status === 'loading') {
          body = h('div', { className: 'bdsh_body' },
            h('div', { className: 'bdsh_status', 'data-better-dsh-state': 'loading' },
              h('p', { className: 'bdsh_statusLine' }, t('loading'))
            )
          );
        } else if (shown.status === 'error') {
          body = h('div', { className: 'bdsh_body' },
            h('div', { className: 'bdsh_status', 'data-better-dsh-state': 'error' },
              h('p', { className: 'bdsh_statusLine', 'data-error': true }, failureLine(t, shown.failure)),
              h('button', { type: 'button', className: 'bdsh_retry', onClick: reload }, t('retry'))
            )
          );
        } else {
          const listing = shown.listing === undefined || shown.listing === null ? {} : shown.listing;
          const entries = Array.isArray(listing.entries) ? listing.entries.slice() : [];
          entries.sort((left, right) => {
            const leftDir = left.type === 'directory';
            const rightDir = right.type === 'directory';
            if (leftDir !== rightDir) return leftDir ? -1 : 1;
            return String(left.name).localeCompare(String(right.name), undefined, { numeric: true, sensitivity: 'base' });
          });
          const rows = entries.map((entry) => {
            const isDir = entry.type === 'directory';
            const isFile = entry.type === 'file';
            const size = typeof entry.size === 'number' ? formatSize(t, entry.size) : undefined;
            return h('li', { className: 'bdsh_item', key: entry.name },
              h('button', {
                type: 'button',
                className: 'bdsh_row',
                'data-type': String(entry.type),
                title: entry.name,
                disabled: !isDir && !isFile,
                'aria-label': t(isFile ? 'openFile.aria' : 'openFolder.aria', { name: entry.name }),
                onClick: () => {
                  const child = joinPath(current, entry.name);
                  if (isDir) {
                    go(child);
                    return;
                  }
                  if (isFile) openFile(sessionId, fileAddressFor(readSession, child));
                }
              },
                h('span', { className: 'bdsh_icon' }, isDir ? h(FolderGlyph, { size: 16 }) : h(FileGlyph, { size: 16 })),
                h('span', { className: 'bdsh_name' }, entry.name),
                isFile && size !== undefined ? h('span', { className: 'bdsh_size' }, size) : null
              )
            );
          });
          body = h('div', { className: 'bdsh_body', 'data-better-dsh-state': 'ready' },
            listing.truncated === true ? h('p', { className: 'bdsh_note' }, t('truncated')) : null,
            entries.length === 0
              ? h('div', { className: 'bdsh_status' }, h('p', { className: 'bdsh_statusLine' }, t('empty')))
              : h('ul', { className: 'bdsh_list' }, rows)
          );
        }

        return h('div', { className: 'bdsh_root', 'data-better-dsh': KIND }, header, body);
      };
    }
    /** Render a byte count the way a person reads one. */
    function formatSize(t, bytes) {
      if (bytes >= 1024 * 1024) return t('size.mb', { count: Math.round(bytes / (1024 * 1024)) });
      if (bytes >= 1024) return t('size.kb', { count: Math.round(bytes / 1024) });
      return t('size.bytes', { count: bytes });
    }
    //#endregion

    /** The tab chip: a folder glyph before the tab's captured title. */
    function FolderTitle(props) {
      const info = props.useTabInfo();
      const t = props.t;
      const title = info.tab.title === undefined || info.tab.title === '' ? t('title') : info.tab.title;
      return h('span', { className: 'bdsh_chip' },
        h('span', { className: 'bdsh_chipIcon' }, h(FolderGlyph, { size: 16 })),
        h('span', { className: 'bdsh_chipText' }, title)
      );
    }

    return {
      inject: ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight', 'remote.workspaceFiles'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'better-dsh: copy');
        const t = ctx.locale.bind(NS);
        const tabs = ctx.get('sidebarRightTabs');
        if (tabs === undefined) return;

        ctx.effect(() => tabs.register({
          id: TYPE_ID,
          kind: KIND,
          title: (address) => titleOf(address, t),
          guide: [{
            id: 'browse',
            order: 15,
            title: () => t('guide.title'),
            description: () => t('guide.description'),
            icon: FolderGlyph
          }]
        }), 'better-dsh: type');

        const routing = installDirectoryRouting(ctx);
        const body = createFolderBody(ctx, routing.openFile);
        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: TYPE_ID,
          locale: NS
        }, body)), 'better-dsh: folders body');

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: TYPE_ID,
          locale: NS
        }, FolderTitle)), 'better-dsh: folders title');
      }
    };
  }
});

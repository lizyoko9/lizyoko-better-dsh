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

    /** The Mission Control tab type: registry id and the two slot keys. */
    const MISSION_ID = PACKAGE_ID + '/mission';
    /** The tab kind Mission Control owns. */
    const MISSION_KIND = 'mission';
    /** Static fallbacks so the dashboard renders before any service is mounted. */
    const EMPTY_MAP = new Map();
    const EMPTY_SESSION_LIST = { phase: 'ready', ids: [], byId: {} };
    const EMPTY_JOBS = { rows: {} };
    const EMPTY_JOBS_STORE = { getSnapshot: () => EMPTY_JOBS, subscribe: () => () => {} };
    /** How many Sessions the dashboard watches for background-job rows. */
    const MISSION_WATCH_LIMIT = 24;

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
      '.bdsh_chipText{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}',
      '.bdsh_mc_root{box-sizing:border-box;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;display:flex}',
      '.bdsh_mc_head{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:6px;height:38px;padding:0 6px 0 12px;display:flex}',
      '.bdsh_mc_heading{flex:1 1 auto;min-width:0;align-items:center;gap:7px;display:flex}',
      '.bdsh_mc_pulse{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-label-quaternary);flex:none}',
      '.bdsh_mc_pulse[data-live=true]{background:var(--dsw-alias-state-success-primary);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary) 16%, transparent);animation:bdsh_mc_pulse 1.8s ease-in-out infinite}',
      '@keyframes bdsh_mc_pulse{0%,100%{opacity:1}50%{opacity:.35}}',
      '.bdsh_mc_headTitle{font-size:12px;font-weight:600;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_mc_tool{width:28px;height:28px;color:var(--dsw-alias-label-secondary);border-radius:6px;cursor:pointer;background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:6px;line-height:1;display:inline-flex}',
      '.bdsh_mc_tool svg{width:15px;height:15px}',
      '.bdsh_mc_tool:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.bdsh_mc_stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:10px 10px 6px;flex:none}',
      '.bdsh_mc_stat{background:var(--dsw-alias-fill-l1);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:7px 9px;min-width:0}',
      '.bdsh_mc_statValue{font-size:19px;line-height:22px;font-weight:600;font-variant-numeric:tabular-nums}',
      '.bdsh_mc_statLabel{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_mc_body{flex:auto;min-height:0;overflow:auto;scrollbar-gutter:stable;padding:2px 6px 12px}',
      '.bdsh_mc_section{margin-top:8px}',
      '.bdsh_mc_sectionHead{align-items:center;gap:6px;padding:4px 6px 3px;display:flex}',
      '.bdsh_mc_sectionTitle{color:var(--dsw-alias-label-tertiary);flex:1 1 auto;min-width:0;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_mc_count{color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-fill-l2);border-radius:99px;flex:none;min-width:16px;padding:0 5px;font-size:10px;line-height:16px;text-align:center;font-variant-numeric:tabular-nums}',
      '.bdsh_mc_row{box-sizing:border-box;border-radius:7px;width:100%;min-width:0;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;align-items:center;gap:8px;padding:6px 7px;font:inherit;display:flex}',
      '.bdsh_mc_row:hover,.bdsh_mc_row:focus-visible{background:var(--dsw-alias-fill-l1)}',
      '.bdsh_mc_dot{border-radius:50%;flex:none;width:7px;height:7px;background:var(--dsw-alias-label-quaternary);margin-top:1px}',
      '.bdsh_mc_dot[data-tone=warn]{background:var(--dsw-alias-state-warn-primary)}',
      '.bdsh_mc_dot[data-tone=live]{background:var(--dsw-alias-state-success-primary)}',
      '.bdsh_mc_dot[data-tone=done]{background:var(--dsw-alias-state-business-primary)}',
      '.bdsh_mc_dot[data-tone=scheduled]{background:var(--dsw-alias-label-tertiary)}',
      '.bdsh_mc_statValue[data-tone=live]{color:var(--dsw-alias-state-success-primary)}',
      '.bdsh_mc_statValue[data-tone=warn]{color:var(--dsw-alias-state-warn-primary)}',
      '.bdsh_mc_statValue[data-tone=scheduled]{color:var(--dsw-alias-state-business-primary)}',
      '.bdsh_mc_main{flex:1 1 auto;min-width:0;flex-direction:column;gap:1px;display:flex}',
      '.bdsh_mc_rowTitle{font-size:12px;line-height:17px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_mc_meta{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_mc_time{color:var(--dsw-alias-label-tertiary);flex:none;font-size:10px;line-height:16px;font-variant-numeric:tabular-nums}',
      '.bdsh_mc_empty{color:var(--dsw-alias-label-tertiary);padding:3px 7px 5px 22px;font-size:11px;line-height:16px}',
      '.bdsh_mc_foot{border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);flex:none;justify-content:space-between;align-items:center;gap:8px;padding:6px 12px;font-size:10px;line-height:15px;display:flex}',
      '.bdsh_mc_error{color:var(--dsw-alias-state-warn-primary)}',
      '.bdsh_mc_action{width:28px;height:28px;color:var(--dsw-alias-label-secondary);border-radius:6px;cursor:pointer;background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:6px;line-height:1;display:inline-flex}',
      '.bdsh_mc_action:hover,.bdsh_mc_action:focus-visible{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.bdsh_mc_action svg{width:16px;height:16px}',
      '.bdsh_fonts{box-sizing:border-box;border-top:1px solid var(--dsw-alias-border-l1);flex-direction:column;gap:12px;width:100%;padding:16px 0;display:flex}',
      '.bdsh_fonts_head{flex-direction:column;gap:3px;display:flex}',
      '.bdsh_fonts_titleRow{justify-content:space-between;align-items:center;gap:12px;display:flex}',
      '.bdsh_fonts_title{font-size:14px;line-height:20px;font-weight:500}',
      '.bdsh_fonts_desc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
      '.bdsh_fonts_reset{color:var(--dsw-alias-label-tertiary);border-radius:4px;cursor:pointer;background:0 0;border:none;flex:none;padding:2px 4px;font:inherit;font-size:12px;line-height:18px}',
      '.bdsh_fonts_reset:hover,.bdsh_fonts_reset:focus-visible{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_fonts_rows{flex-direction:column;gap:10px;display:flex}',
      '.bdsh_fonts_row{grid-template-columns:120px minmax(0,1fr) 64px;align-items:center;gap:10px;display:grid}',
      '.bdsh_fonts_labelCol{min-width:0}',
      '.bdsh_fonts_label{font-size:13px;line-height:18px;display:block}',
      '.bdsh_fonts_hint{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:15px;display:block}',
      '.bdsh_fonts_input{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);width:100%;min-width:0;height:30px;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;outline:none;padding:0 8px}',
      '.bdsh_fonts_input:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}',
      '.bdsh_fonts_input::placeholder{color:var(--dsw-alias-label-quaternary)}',
      '.bdsh_fonts_size{text-align:center;font-variant-numeric:tabular-nums;padding:0 4px}',
      '.bdsh_themes{box-sizing:border-box;border-top:1px solid var(--dsw-alias-border-l1);flex-direction:column;gap:12px;width:100%;padding:16px 0;display:flex}',
      '.bdsh_themes_head{flex-direction:column;gap:3px;display:flex}',
      '.bdsh_themes_title{font-size:14px;line-height:20px;font-weight:500}',
      '.bdsh_themes_desc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
      '.bdsh_themes_modes{display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
      '.bdsh_themes_mode{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:12px;height:28px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center}',
      '.bdsh_themes_mode:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_themes_mode[data-selected=true]{border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_themes_grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
      '.bdsh_theme_card{box-sizing:border-box;min-width:0;color:inherit;text-align:left;cursor:pointer;background:0 0;border:.5px solid var(--dsw-alias-border-l1);border-radius:9px;padding:0;font:inherit;display:flex;flex-direction:column;overflow:hidden}',
      '.bdsh_theme_card:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_theme_card[data-selected=true]{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary) inset}',
      '.bdsh_theme_card[data-default=true]{grid-column:1/-1;flex-direction:row;align-items:center}',
      '.bdsh_theme_preview{display:flex;height:30px;flex:none;width:100%;overflow:hidden}',
      '.bdsh_theme_swatch{flex:1 1 0;min-width:0}',
      '.bdsh_theme_body{display:flex;flex-direction:column;gap:2px;padding:7px 9px 8px;min-width:0}',
      '.bdsh_theme_card[data-default=true] .bdsh_theme_body{flex:1 1 auto}',
      '.bdsh_theme_name{font-size:12px;line-height:17px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_theme_tag{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.bdsh_themes_note{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}',
      '.bdsh_themes_current{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}',
      '@media (max-width:520px){.bdsh_themes_grid{grid-template-columns:minmax(0,1fr)}}',
      '.bdsh_glass{box-sizing:border-box;border-top:1px solid var(--dsw-alias-border-l1);flex-direction:column;gap:10px;width:100%;padding:16px 0 0;display:flex}',
      '.bdsh_glass_head{justify-content:space-between;align-items:center;gap:12px;display:flex}',
      '.bdsh_glass_titleRow{flex-direction:column;gap:3px;display:flex;min-width:0}',
      '.bdsh_glass_title{font-size:14px;line-height:20px;font-weight:500}',
      '.bdsh_glass_desc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
      '.bdsh_glass_switch{box-sizing:border-box;width:36px;height:21px;border:.5px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);cursor:pointer;flex:none;padding:2px;transition:background .18s ease,border-color .18s ease}',
      '.bdsh_glass_switch[aria-checked=true]{background:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}',
      '.bdsh_glass_knob{width:15px;height:15px;border-radius:50%;background:var(--dsw-alias-bg-base);box-shadow:0 1px 3px #00000040;transition:transform .18s ease;display:block}',
      '.bdsh_glass_switch[aria-checked=true] .bdsh_glass_knob{transform:translateX(15px)}',
      '.bdsh_glass_row{align-items:center;gap:6px;flex-wrap:wrap;display:flex}',
      '.bdsh_glass_label{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;white-space:nowrap}',
      '.bdsh_glass_seg{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:11px;height:26px;padding:0 9px;display:inline-flex;align-items:center}',
      '.bdsh_glass_seg:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_glass_seg[data-selected=true]{border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_glass_seg:disabled{opacity:.4;cursor:default;background:0 0;color:var(--dsw-alias-label-secondary)}',
      '.bdsh_glass_toggle{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:11px;height:26px;padding:0 9px;display:inline-flex;align-items:center;gap:5px}',
      '.bdsh_glass_toggle:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_glass_toggle[aria-pressed=true]{border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-fill-l1)}',
      '.bdsh_glass_dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-quaternary);flex:none}',
      '.bdsh_glass_toggle[aria-pressed=true] .bdsh_glass_dot{background:var(--dsw-alias-state-business-primary)}',
      '.bdsh_glass_hint{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}',
      'body[data-bdsh-glass]{--bdsh-glass-rgb:24,24,32;--bdsh-glass-alpha:.4;--bdsh-glass-border:.2;--bdsh-glass-blur:24px;--bdsh-glass-sat:185%;background-color:#0b0b10!important;background-image:radial-gradient(58% 48% at 10% 6%,color-mix(in srgb,var(--dsw-alias-state-business-primary) 26%,transparent),transparent 62%),radial-gradient(46% 46% at 92% 10%,color-mix(in srgb,#2dd4bf 18%,transparent),transparent 62%),radial-gradient(58% 58% at 54% 104%,color-mix(in srgb,#ec4899 14%,transparent),transparent 66%),linear-gradient(145deg,#0b0b10,#101018 55%,#0b0b10);background-attachment:fixed;position:relative;isolation:isolate}',
      'body[data-bdsh-glass]:not([data-ds-dark-theme]){--bdsh-glass-rgb:255,255,255;--bdsh-glass-alpha:.52;--bdsh-glass-border:.7;background-color:#eef1f8!important;background-image:radial-gradient(58% 48% at 10% 6%,color-mix(in srgb,var(--dsw-alias-state-business-primary) 16%,transparent),transparent 62%),radial-gradient(46% 46% at 92% 10%,color-mix(in srgb,#2dd4bf 12%,transparent),transparent 62%),radial-gradient(58% 58% at 54% 104%,color-mix(in srgb,#ec4899 10%,transparent),transparent 66%),linear-gradient(145deg,#eef1f8,#f7f8fc 55%,#eef1f8);background-attachment:fixed}',
      'body[data-bdsh-glass=soft]{--bdsh-glass-alpha:.3;--bdsh-glass-blur:14px;--bdsh-glass-sat:155%}',
      'body[data-bdsh-glass=medium]{--bdsh-glass-alpha:.4;--bdsh-glass-blur:24px;--bdsh-glass-sat:185%}',
      'body[data-bdsh-glass=strong]{--bdsh-glass-alpha:.56;--bdsh-glass-blur:36px;--bdsh-glass-sat:210%}',
      'body[data-bdsh-glass]::before{content:"";position:fixed;inset:-18%;z-index:0;pointer-events:none;opacity:0;transition:opacity .4s ease;background:radial-gradient(34% 34% at 18% 22%,color-mix(in srgb,var(--dsw-alias-state-business-primary) 48%,transparent),transparent 70%),radial-gradient(30% 30% at 82% 16%,color-mix(in srgb,#22d3ee 36%,transparent),transparent 70%),radial-gradient(36% 36% at 58% 90%,color-mix(in srgb,#ec4899 28%,transparent),transparent 72%);filter:blur(70px) saturate(140%);mix-blend-mode:screen}',
      'body[data-bdsh-glass][data-bdsh-ambience=on]::before{opacity:1;animation:bdshGlassDrift 22s ease-in-out infinite alternate}',
      'body[data-bdsh-glass][data-bdsh-sheen=on]::after{content:"";position:fixed;inset:-30%;z-index:0;pointer-events:none;background:conic-gradient(from 0deg at 50% 50%,color-mix(in srgb,var(--dsw-alias-state-business-primary) 40%,transparent),transparent 22%,color-mix(in srgb,#22d3ee 28%,transparent) 42%,transparent 64%,color-mix(in srgb,#ec4899 24%,transparent) 82%,color-mix(in srgb,var(--dsw-alias-state-business-primary) 40%,transparent));filter:blur(100px);opacity:.35;mix-blend-mode:screen;animation:bdshGlassSpin 44s linear infinite}',
      'body[data-bdsh-glass] #root{position:relative;z-index:1}',
      '@keyframes bdshGlassSpin{to{transform:rotate(360deg)}}',
      '@keyframes bdshGlassDrift{0%{transform:translate3d(-1.5%,-1%,0) scale(1)}100%{transform:translate3d(1.5%,1%,0) scale(1.08)}}',
      'body[data-bdsh-glass] [class*="_frame"]{background:transparent!important}',
      'body[data-bdsh-glass] [class*="_centerCol"]{background:transparent!important}',
      'body[data-bdsh-glass] [data-slot="main.conversation"] > *,body[data-bdsh-glass] [data-slot="rightbar"] > *{background:transparent!important}',
      'body[data-bdsh-glass] [class*="_sidebarCol"]{background:rgba(var(--bdsh-glass-rgb),calc(var(--bdsh-glass-alpha) + .08))!important;backdrop-filter:blur(var(--bdsh-glass-blur)) saturate(var(--bdsh-glass-sat));-webkit-backdrop-filter:blur(var(--bdsh-glass-blur)) saturate(var(--bdsh-glass-sat));box-shadow:inset -1px 0 0 rgba(255,255,255,.06)}',
      'body[data-bdsh-glass] [class*="_rightbarCol"]{background:rgba(var(--bdsh-glass-rgb),calc(var(--bdsh-glass-alpha) + .06))!important;backdrop-filter:blur(var(--bdsh-glass-blur)) saturate(var(--bdsh-glass-sat));-webkit-backdrop-filter:blur(var(--bdsh-glass-blur)) saturate(var(--bdsh-glass-sat));box-shadow:inset 1px 0 0 rgba(255,255,255,.06)}',
      'body[data-bdsh-glass] [class*="_header"]{backdrop-filter:blur(calc(var(--bdsh-glass-blur) * .7)) saturate(var(--bdsh-glass-sat));-webkit-backdrop-filter:blur(calc(var(--bdsh-glass-blur) * .7)) saturate(var(--bdsh-glass-sat))}',
      'body[data-bdsh-glass] [class*="_card"],body[data-bdsh-glass] [role=dialog],body[data-bdsh-glass] [role=menu],body[data-bdsh-glass] [role=listbox],body[data-bdsh-glass] [data-radix-popper-content-wrapper]>*{background-color:rgba(var(--bdsh-glass-rgb),var(--bdsh-glass-alpha))!important;background-image:linear-gradient(135deg,rgba(255,255,255,calc(var(--bdsh-glass-border) * 1.8)) 0%,rgba(255,255,255,.05) 42%,transparent 68%)!important;backdrop-filter:blur(var(--bdsh-glass-blur)) saturate(var(--bdsh-glass-sat))!important;-webkit-backdrop-filter:blur(var(--bdsh-glass-blur)) saturate(var(--bdsh-glass-sat))!important;box-shadow:0 18px 50px rgba(0,0,0,.22),inset 0 0 0 1px rgba(255,255,255,var(--bdsh-glass-border)),inset 0 1px 0 rgba(255,255,255,.32)!important}',
      'body[data-bdsh-glass]:not([data-ds-dark-theme]) [class*="_card"],body[data-bdsh-glass]:not([data-ds-dark-theme]) [role=dialog],body[data-bdsh-glass]:not([data-ds-dark-theme]) [role=menu],body[data-bdsh-glass]:not([data-ds-dark-theme]) [role=listbox],body[data-bdsh-glass]:not([data-ds-dark-theme]) [data-radix-popper-content-wrapper]>*{box-shadow:0 18px 50px rgba(31,41,55,.12),inset 0 0 0 1px rgba(255,255,255,.72),inset 0 1px 0 rgba(255,255,255,.9)!important}',
      'body[data-bdsh-glass] [data-slot="conversation.composer.bar"] [class*="_card"]{background-color:rgba(var(--bdsh-glass-rgb),calc(var(--bdsh-glass-alpha) + .04))!important;box-shadow:0 24px 70px rgba(0,0,0,.34),inset 0 0 0 1px rgba(255,255,255,calc(var(--bdsh-glass-border) + .08)),inset 0 1px 0 rgba(255,255,255,.3)!important}',
      'body[data-bdsh-glass][data-bdsh-sheen=on] [class*="_card"]{background-size:220% 220%;animation:bdshGlassSheen 16s ease-in-out infinite alternate}',
      '@keyframes bdshGlassSheen{0%{background-position:0% 0%}100%{background-position:100% 100%}}',
      '@media (prefers-reduced-motion:reduce){body[data-bdsh-glass][data-bdsh-ambience=on]::before,body[data-bdsh-glass][data-bdsh-sheen=on] [class*="_card"]{animation:none}}'
    ].join('\n');
    const CSS_TAG_ID = PACKAGE_ID + '/better-dsh.css';
    if (typeof document !== 'undefined') {
      const existing = document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG_ID) + ']');
      if (existing !== null) {
        existing.textContent = CSS;
      } else {
        const tag = document.createElement('style');
        tag.dataset.plugin = PACKAGE_ID;
        tag.dataset.pluginCss = CSS_TAG_ID;
        tag.textContent = CSS;
        document.head.appendChild(tag);
      }
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
      'size.mb': '{count} MB',
      'mission.title': '任务中心',
      'mission.guideTitle': '任务中心',
      'mission.guideDescription': '一屏看清正在运行、等待处理与已排期的工作',
      'mission.open': '打开任务中心',
      'mission.refresh': '刷新',
      'mission.stat.running': '运行中',
      'mission.stat.waiting': '待处理',
      'mission.stat.scheduled': '已排期',
      'mission.section.needs': '需要你',
      'mission.section.running': '正在运行',
      'mission.section.scheduled': '已排期',
      'mission.empty.needs': '暂时没有需要你处理的事',
      'mission.empty.running': '没有正在运行的会话',
      'mission.empty.scheduled': '没有已排期的任务',
      'mission.pending.approval': '等待审批',
      'mission.pending.plan': '等待确认计划',
      'mission.pending.question': '等待回答',
      'mission.pending.generic': '等待你处理',
      'mission.completed': '已完成，等你查看',
      'mission.jobs.one': '1 个后台任务',
      'mission.jobs.other': '{count} 个后台任务',
      'mission.agentRunning': '智能体运行中',
      'mission.updated': '更新于 {time}',
      'mission.scheduleError': '定时任务读取失败',
      'mission.untitled': '未命名会话',
      'mission.time.now': '刚刚',
      'mission.time.ago': '{time}前',
      'mission.time.in': '{time}后',
      'mission.time.late': '超时 {time}',
      'fonts.title': '字体与字号',
      'fonts.description': '界面、代码与侧栏终端；留空恢复默认字体，多个字体用逗号分隔',
      'fonts.text': '界面字体',
      'fonts.textHint': '界面与会话正文',
      'fonts.code': '代码字体',
      'fonts.codeHint': '代码块与工具输出',
      'fonts.terminal': '终端字体',
      'fonts.terminalHint': '右侧栏终端',
      'fonts.size': '字号',
      'fonts.placeholder': '默认',
      'fonts.reset': '恢复默认',
      'fonts.resetHint': '清空字体并恢复默认字号',
      'themes.title': '主题',
      'themes.description': '像 Obsidian 一样切换整套配色；主题与亮/暗模式相互独立。',
      'themes.system': '跟随系统',
      'themes.light': '亮色',
      'themes.dark': '暗色',
      'themes.default': 'DSH 默认',
      'themes.defaultTag': '不覆盖任何颜色',
      'themes.adaptive': '亮/暗自适应',
      'themes.current': '当前主题：{name}',
      'themes.defaultCurrent': '当前主题：DSH 默认',
      'themes.note': '自定义主题保存在本浏览器；亮/暗模式仍由 DSH 设置同步。',
      'glass.title': '材质 · 玻璃',
      'glass.description': '半透明表面、背景模糊与液态高光；可与任意主题叠加。',
      'glass.enabled': '毛玻璃',
      'glass.intensity': '强度',
      'glass.soft': '轻柔',
      'glass.medium': '标准',
      'glass.strong': '强',
      'glass.sheen': '液态高光',
      'glass.ambience': '环境光斑',
      'glass.hint': '背景模糊需要 GPU 加速；低配设备建议用轻柔或关闭环境光斑。'
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
      'size.mb': '{count} MB',
      'mission.title': 'Mission Control',
      'mission.guideTitle': 'Mission Control',
      'mission.guideDescription': 'Running, waiting and scheduled work in one place',
      'mission.open': 'Open Mission Control',
      'mission.refresh': 'Refresh',
      'mission.stat.running': 'Running',
      'mission.stat.waiting': 'Waiting',
      'mission.stat.scheduled': 'Scheduled',
      'mission.section.needs': 'Needs you',
      'mission.section.running': 'Running',
      'mission.section.scheduled': 'Scheduled',
      'mission.empty.needs': 'Nothing is waiting on you',
      'mission.empty.running': 'No sessions are running',
      'mission.empty.scheduled': 'Nothing is scheduled',
      'mission.pending.approval': 'Waiting for approval',
      'mission.pending.plan': 'Waiting for plan review',
      'mission.pending.question': 'Waiting for an answer',
      'mission.pending.generic': 'Waiting for you',
      'mission.completed': 'Finished — review it',
      'mission.jobs.one': '1 background job',
      'mission.jobs.other': '{count} background jobs',
      'mission.agentRunning': 'Agent running',
      'mission.updated': 'Updated {time}',
      'mission.scheduleError': 'Scheduled tasks are unavailable',
      'mission.untitled': 'Untitled session',
      'mission.time.now': 'now',
      'mission.time.ago': '{time} ago',
      'mission.time.in': 'in {time}',
      'mission.time.late': 'late {time}',
      'fonts.title': 'Fonts & sizes',
      'fonts.description': 'Interface, code and sidebar terminal. Leave empty for the default; separate fonts with commas.',
      'fonts.text': 'Interface font',
      'fonts.textHint': 'Interface and conversation text',
      'fonts.code': 'Code font',
      'fonts.codeHint': 'Code blocks and tool output',
      'fonts.terminal': 'Terminal font',
      'fonts.terminalHint': 'Sidebar terminal',
      'fonts.size': 'Size',
      'fonts.placeholder': 'Default',
      'fonts.reset': 'Reset',
      'fonts.resetHint': 'Clear fonts and restore default sizes',
      'themes.title': 'Themes',
      'themes.description': 'Switch whole palettes, Obsidian-style; the theme is independent of light/dark mode.',
      'themes.system': 'System',
      'themes.light': 'Light',
      'themes.dark': 'Dark',
      'themes.default': 'DSH default',
      'themes.defaultTag': 'No color overrides',
      'themes.adaptive': 'Adapts to light/dark',
      'themes.current': 'Theme: {name}',
      'themes.defaultCurrent': 'Theme: DSH default',
      'themes.note': 'Custom themes are stored in this browser; light/dark mode still follows DSH settings.',
      'glass.title': 'Material · Glass',
      'glass.description': 'Translucent surfaces, backdrop blur and liquid highlights; combines with any theme.',
      'glass.enabled': 'Frosted glass',
      'glass.intensity': 'Intensity',
      'glass.soft': 'Soft',
      'glass.medium': 'Regular',
      'glass.strong': 'Strong',
      'glass.sheen': 'Liquid sheen',
      'glass.ambience': 'Ambient glow',
      'glass.hint': 'Backdrop blur uses the GPU; use Soft or disable ambient glow on slower machines.'
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

    //#region mission control
    /**
     * Read one optional client service without declaring it in `inject`: the
     * dashboard is additive, so a profile that lacks jobs or schedules must still
     * load the folder tab instead of failing the whole bundle.
     */
    function safeService(ctx, name) {
      try {
        return ctx.get(name);
      } catch (_error) {
        return undefined;
      }
    }

    /** Open Mission Control in the active right Sidebar pane. */
    function openMissionTab(ctx) {
      const right = safeService(ctx, 'sidebarRight');
      if (right === undefined || right === null || typeof right.openTab !== 'function') return;
      try {
        right.openTab(MISSION_KIND, {});
      } catch (error) {
        console.error('better-dsh: could not open Mission Control', error);
      }
    }

    /** The last path segment, used as a compact workspace label. */
    function baseName(path) {
      const clean = String(path === undefined || path === null ? '' : path).replace(/[/\\]+$/, '');
      const cut = Math.max(clean.lastIndexOf('/'), clean.lastIndexOf('\\'));
      return cut === -1 ? clean : clean.slice(cut + 1);
    }

    /** Parse a log timestamp into epoch milliseconds, or `undefined`. */
    function timeValue(value) {
      if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
      if (typeof value !== 'string' || value === '') return undefined;
      const parsed = Date.parse(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }

    /** A compact duration: 42s, 7m, 2h 15m, 3d. */
    function shortSpan(ms) {
      const seconds = Math.max(0, Math.round(ms / 1000));
      if (seconds < 60) return seconds + 's';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return minutes + 'm';
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return minutes % 60 === 0 ? hours + 'h' : hours + 'h ' + (minutes % 60) + 'm';
      return Math.floor(hours / 24) + 'd';
    }

    /** Relative text for a past moment, or for a scheduled future one. */
    function relativeText(value, now, t, future) {
      const at = timeValue(value);
      if (at === undefined) return '';
      const delta = now - at;
      if (future === true) {
        if (delta <= 0) return t('mission.time.in', { time: shortSpan(-delta) });
        if (delta < 45000) return t('mission.time.now');
        return t('mission.time.late', { time: shortSpan(delta) });
      }
      if (delta < 45000) return t('mission.time.now');
      if (delta < 0) return t('mission.time.in', { time: shortSpan(-delta) });
      return t('mission.time.ago', { time: shortSpan(delta) });
    }

    /** The one-line reason a Session appears under "Needs you". */
    function pendingText(pending, t) {
      const kind = pending !== null && typeof pending === 'object' ? pending.kind : pending;
      switch (kind) {
        case 'approval':
          return t('mission.pending.approval');
        case 'plan-review':
          return t('mission.pending.plan');
        case 'question':
          return t('mission.pending.question');
        default:
          return t('mission.pending.generic');
      }
    }

    /** Rows of one Session's live background jobs. */
    function liveJobRows(jobsState, sessionId) {
      const rows = jobsState !== undefined && jobsState !== null && jobsState.rows !== undefined ? jobsState.rows[sessionId] : undefined;
      if (!Array.isArray(rows)) return [];
      return rows.filter((job) => job !== null && typeof job === 'object' && (job.status === 'running' || job.status === 'stopping'));
    }

    /** A Session's display title with a workspace-derived fallback. */
    function sessionLabel(row, t) {
      const title = row !== null && row !== undefined ? row.displayTitle : undefined;
      if (typeof title === 'string' && title !== '') return title;
      const workspace = baseName(row === null || row === undefined ? '' : row.cwd);
      return workspace === '' ? t('mission.untitled') : workspace;
    }

    /** Radar glyph for the tab chip, the guide card and the header action. */
    function MissionGlyph(props) {
      const size = props !== undefined && typeof props.size === 'number' ? props.size : 16;
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        'aria-hidden': 'true',
        className: props === undefined ? undefined : props.className,
        style: { color: 'var(--dsw-alias-state-business-primary)', flex: 'none' }
      },
        h('circle', { cx: 8, cy: 8, r: 5.1, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('circle', { cx: 8, cy: 8, r: 1.55, fill: 'currentColor' }),
        h('path', { d: 'M8 1.3v2.05M8 12.65v2.05M1.3 8h2.05M12.65 8h2.05', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' })
      );
    }

    /** Compact header action that opens the dashboard. */
    function MissionAction(props) {
      const t = props.t;
      return h('button', {
        type: 'button',
        className: 'bdsh_mc_action',
        title: t('mission.open'),
        'aria-label': t('mission.open'),
        onClick: () => {
          try {
            props.open();
          } catch (error) {
            console.error('better-dsh: could not open Mission Control', error);
          }
        }
      }, h(MissionGlyph, { size: 16 }));
    }

    /** The tab chip. */
    function MissionTitle(props) {
      const t = props.t;
      return h('span', { className: 'bdsh_chip' },
        h('span', { className: 'bdsh_chipIcon' }, h(MissionGlyph, { size: 16 })),
        h('span', { className: 'bdsh_chipText' }, t('mission.title'))
      );
    }

    /**
     * Build the Mission Control body: a cross-Session view of work that is
     * running, waiting on the user, or scheduled. It reads the existing Session,
     * status, jobs and schedule surfaces; every read is optional so a reduced
     * profile still renders the panel with empty sections.
     */
    function createMissionBody(ctx) {
      const scheduleFace = safeService(ctx, 'remote.schedule');
      const remoteRoot = safeService(ctx, 'remote');
      const jobsService = safeService(ctx, 'jobs');
      const uiWorkspace = safeService(ctx, 'uiWorkspace');

      /** Follow `schedule/changed` through whichever remote face is mounted. */
      const subscribeSchedule = (listener) => {
        try {
          if (remoteRoot !== undefined && remoteRoot !== null && typeof remoteRoot.$on === 'function') return remoteRoot.$on('schedule/changed', listener);
          if (scheduleFace !== undefined && scheduleFace !== null && typeof scheduleFace.$on === 'function') return scheduleFace.$on('schedule/changed', listener);
        } catch (error) {
          console.warn('better-dsh: could not follow schedule changes', error);
        }
        return undefined;
      };

      return function MissionBody(props) {
        const t = props.t;
        const useSessions = typeof props.useSessions === 'function' ? props.useSessions : () => EMPTY_SESSION_LIST;
        const useStatuses = typeof props.useSessionStatus === 'function' ? props.useSessionStatus : () => EMPTY_MAP;
        const useWorkspaces = typeof props.useWorkspaces === 'function' ? props.useWorkspaces : () => ({ archivedSessionIds: [] });
        const useJobs = typeof props.useJobs === 'function' ? props.useJobs : () => EMPTY_JOBS;

        const sessions = useSessions((snapshot) => snapshot) || EMPTY_SESSION_LIST;
        const statuses = useStatuses((snapshot) => snapshot) || EMPTY_MAP;
        const archivedIds = useWorkspaces((snapshot) => snapshot === undefined || snapshot === null ? undefined : snapshot.archivedSessionIds) || [];
        const jobsState = useJobs((snapshot) => snapshot) || EMPTY_JOBS;

        const [now, setNow] = React.useState(() => Date.now());
        React.useEffect(() => {
          const timer = setInterval(() => setNow(Date.now()), 30000);
          return () => clearInterval(timer);
        }, []);

        const [schedule, setSchedule] = React.useState(() => ({
          status: scheduleFace === undefined ? 'unavailable' : 'loading',
          records: []
        }));
        const scheduleRequest = React.useRef(0);
        const loadSchedule = React.useCallback(() => {
          if (scheduleFace === undefined || scheduleFace === null || typeof scheduleFace.catalog !== 'function') return;
          const request = ++scheduleRequest.current;
          let answer;
          try {
            answer = scheduleFace.catalog();
          } catch (error) {
            if (request === scheduleRequest.current) setSchedule({ status: 'error', records: [] });
            return;
          }
          Promise.resolve(answer).then((result) => {
            if (request !== scheduleRequest.current) return;
            if (result !== undefined && result !== null && result.ok === true && Array.isArray(result.value)) {
              setSchedule({ status: 'ready', records: result.value });
            } else {
              setSchedule({ status: 'error', records: [] });
            }
          }, () => {
            if (request === scheduleRequest.current) setSchedule({ status: 'error', records: [] });
          });
        }, [scheduleFace]);

        React.useEffect(() => {
          loadSchedule();
          let offChanged;
          let offReset;
          try {
            offChanged = subscribeSchedule(loadSchedule);
          } catch (error) {
            console.warn('better-dsh: could not follow schedule changes', error);
          }
          try {
            offReset = ctx.on('connection/reset', loadSchedule);
          } catch (error) {
            console.warn('better-dsh: could not follow connection resets', error);
          }
          return () => {
            if (typeof offChanged === 'function') offChanged();
            if (typeof offReset === 'function') offReset();
          };
        }, [loadSchedule, scheduleFace]);

        const rows = React.useMemo(() => {
          const archived = new Set(Array.isArray(archivedIds) ? archivedIds : []);
          const list = [];
          const ids = Array.isArray(sessions.ids) ? sessions.ids : [];
          for (const id of ids) {
            const row = sessions.byId[id];
            if (row === undefined || row === null) continue;
            if (row.blank === true || (row.subagent !== undefined && row.subagent !== null) || archived.has(id)) continue;
            const status = statuses.get(id) || { running: row.running === true };
            list.push({
              id,
              row,
              pending: status.pendingInteraction,
              completed: status.completionUnread === true,
              running: status.running === true || row.running === true,
              live: liveJobRows(jobsState, id),
              updatedAt: timeValue(row.updatedAt)
            });
          }
          list.sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0));
          return list;
        }, [sessions, statuses, archivedIds, jobsState]);

        const needs = React.useMemo(() => {
          const list = rows.filter((item) => (item.pending !== undefined && item.pending !== null) || item.completed === true);
          list.sort((left, right) => {
            const rank = (item) => item.pending === undefined || item.pending === null ? 2 : (item.pending.kind === 'question' ? 1 : 0);
            const difference = rank(left) - rank(right);
            return difference !== 0 ? difference : (right.updatedAt || 0) - (left.updatedAt || 0);
          });
          return list;
        }, [rows]);

        const running = React.useMemo(() => rows.filter((item) => (item.running === true || item.live.length > 0) && (item.pending === undefined || item.pending === null) && item.completed !== true), [rows]);

        const scheduled = React.useMemo(() => {
          const records = Array.isArray(schedule.records) ? schedule.records : [];
          return records
            .filter((record) => record !== null && typeof record === 'object' && record.status === 'active' && timeValue(record.scheduledAt) !== undefined)
            .sort((left, right) => timeValue(left.scheduledAt) - timeValue(right.scheduledAt))
            .slice(0, 8);
        }, [schedule.records]);

        const watchIds = React.useMemo(() => {
          const chosen = [];
          const seen = new Set();
          const take = (item) => {
            if (chosen.length >= MISSION_WATCH_LIMIT || seen.has(item.id)) return;
            seen.add(item.id);
            chosen.push(item.id);
          };
          for (const item of rows) if (item.running || (item.pending !== undefined && item.pending !== null) || item.live.length > 0) take(item);
          for (const item of rows) take(item);
          return chosen;
        }, [rows]);
        const watchKey = watchIds.join('|');

        React.useEffect(() => {
          if (jobsService === undefined || jobsService === null || typeof jobsService.watchRows !== 'function') return undefined;
          const disposers = [];
          for (const id of watchIds) {
            try {
              const dispose = jobsService.watchRows(id);
              if (typeof dispose === 'function') disposers.push(dispose);
            } catch (error) {
              console.warn('better-dsh: could not watch jobs for ' + id, error);
            }
          }
          return () => {
            for (const dispose of disposers) {
              try {
                dispose();
              } catch (error) {
                console.warn('better-dsh: job watcher cleanup failed', error);
              }
            }
          };
        }, [watchKey]);

        const openSession = (sessionId) => {
          try {
            if (uiWorkspace !== undefined && uiWorkspace !== null && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(sessionId);
          } catch (error) {
            console.error('better-dsh: could not open session ' + sessionId, error);
          }
        };

        const jobLabel = (count) => count === 1 ? t('mission.jobs.one') : t('mission.jobs.other', { count });

        const sessionMeta = (item) => {
          const parts = [];
          if (item.pending !== undefined && item.pending !== null) parts.push(pendingText(item.pending, t));
          else if (item.completed === true) parts.push(t('mission.completed'));
          if (item.live.length > 0) parts.push(jobLabel(item.live.length));
          else if (item.running === true) parts.push(t('mission.agentRunning'));
          const workspace = baseName(item.row.cwd);
          if (workspace !== '') parts.push(workspace);
          return parts.join(' · ');
        };

        const sessionRow = (item, tone) => h('button', {
          type: 'button',
          className: 'bdsh_mc_row',
          key: item.id,
          title: sessionLabel(item.row, t),
          onClick: () => openSession(item.id)
        },
          h('span', { className: 'bdsh_mc_dot', 'data-tone': tone }),
          h('span', { className: 'bdsh_mc_main' },
            h('span', { className: 'bdsh_mc_rowTitle' }, sessionLabel(item.row, t)),
            h('span', { className: 'bdsh_mc_meta' }, sessionMeta(item))
          ),
          h('span', { className: 'bdsh_mc_time' }, relativeText(item.row.updatedAt, now, t, false))
        );

        const scheduleRow = (record) => {
          const owner = sessions.byId[record.sessionId];
          const workspace = baseName(owner === undefined ? '' : owner.cwd);
          const title = typeof record.title === 'string' && record.title !== ''
            ? record.title
            : (typeof record.prompt === 'string' && record.prompt !== '' ? String(record.prompt).split('\n')[0] : t('mission.untitled'));
          return h('button', {
            type: 'button',
            className: 'bdsh_mc_row',
            key: record.id,
            title: title,
            onClick: () => openSession(record.sessionId)
          },
            h('span', { className: 'bdsh_mc_dot', 'data-tone': 'scheduled' }),
            h('span', { className: 'bdsh_mc_main' },
              h('span', { className: 'bdsh_mc_rowTitle' }, title),
              h('span', { className: 'bdsh_mc_meta' }, workspace === '' ? t('mission.section.scheduled') : workspace)
            ),
            h('span', { className: 'bdsh_mc_time' }, relativeText(record.scheduledAt, now, t, true))
          );
        };

        const section = (title, count, body) => h('section', { className: 'bdsh_mc_section' },
          h('div', { className: 'bdsh_mc_sectionHead' },
            h('span', { className: 'bdsh_mc_sectionTitle' }, title),
            h('span', { className: 'bdsh_mc_count' }, String(count))
          ),
          body
        );

        const emptyLine = (text) => h('div', { className: 'bdsh_mc_empty' }, text);

        const needsBody = needs.length === 0
          ? emptyLine(t('mission.empty.needs'))
          : h('div', null, needs.map((item) => sessionRow(item, item.pending !== undefined && item.pending !== null ? 'warn' : 'done')));
        const runningBody = running.length === 0
          ? emptyLine(t('mission.empty.running'))
          : h('div', null, running.map((item) => sessionRow(item, 'live')));
        const scheduledBody = scheduled.length === 0
          ? emptyLine(t('mission.empty.scheduled'))
          : h('div', null, scheduled.map(scheduleRow));

        const stat = (value, label, tone) => h('div', { className: 'bdsh_mc_stat' },
          h('div', { className: 'bdsh_mc_statValue', 'data-tone': tone }, String(value)),
          h('div', { className: 'bdsh_mc_statLabel' }, label)
        );

        return h('div', { className: 'bdsh_mc_root', 'data-better-dsh': MISSION_KIND },
          h('div', { className: 'bdsh_mc_head' },
            h('div', { className: 'bdsh_mc_heading' },
              h('span', { className: 'bdsh_mc_pulse', 'data-live': running.length > 0 || needs.length > 0 ? 'true' : 'false' }),
              h('span', { className: 'bdsh_mc_headTitle' }, t('mission.title'))
            ),
            h('button', {
              type: 'button',
              className: 'bdsh_mc_tool',
              title: t('mission.refresh'),
              'aria-label': t('mission.refresh'),
              onClick: loadSchedule
            }, h(ReloadGlyph))
          ),
          h('div', { className: 'bdsh_mc_stats' },
            stat(running.length, t('mission.stat.running'), 'live'),
            stat(needs.length, t('mission.stat.waiting'), 'warn'),
            stat(scheduled.length, t('mission.stat.scheduled'), 'scheduled')
          ),
          h('div', { className: 'bdsh_mc_body' },
            section(t('mission.section.needs'), needs.length, needsBody),
            section(t('mission.section.running'), running.length, runningBody),
            section(t('mission.section.scheduled'), scheduled.length, scheduledBody)
          ),
          h('div', { className: 'bdsh_mc_foot' },
            h('span', null, t('mission.updated', { time: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })),
            schedule.status === 'error' ? h('span', { className: 'bdsh_mc_error' }, t('mission.scheduleError')) : null
          )
        );
      };
    }
    //#endregion mission control

    //#region font settings
    /** Roles, ranges and defaults mirrored from DSH's ui-theme settings. */
    const FONT_ROLE_SPECS = [
      { role: 'text', label: 'fonts.text', hint: 'fonts.textHint', min: 10, max: 22, defaultSize: 14 },
      { role: 'code', label: 'fonts.code', hint: 'fonts.codeHint', min: 10, max: 16, defaultSize: 11 },
      { role: 'terminal', label: 'fonts.terminal', hint: 'fonts.terminalHint', min: 10, max: 20, defaultSize: 13 }
    ];

    /**
     * Commit-on-blur family input: typing stays local so a settings write is not
     * issued for every keystroke, and a rejected value falls back to the snapshot.
     */
    function FontFamilyInput(props) {
      const t = props.t;
      const value = props.value === undefined || props.value === null ? '' : String(props.value);
      const [draft, setDraft] = React.useState(value);
      React.useEffect(() => {
        setDraft(value);
      }, [value]);
      const commit = () => {
        const next = String(draft).trim();
        if (next === value) return;
        try {
          props.onCommit(next);
        } catch (error) {
          console.error('better-dsh: could not save font family', error);
          setDraft(value);
        }
      };
      return h('input', {
        className: 'bdsh_fonts_input',
        type: 'text',
        value: draft,
        placeholder: t('fonts.placeholder'),
        spellCheck: false,
        autoComplete: 'off',
        'aria-label': props.label,
        onChange: (event) => setDraft(event.target.value),
        onBlur: commit,
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }
      });
    }

    /** Commit-on-blur font-size input with the same clamps the theme service uses. */
    function FontSizeInput(props) {
      const value = props.value === undefined || props.value === null ? props.defaultValue : Number(props.value);
      const [draft, setDraft] = React.useState(String(value));
      React.useEffect(() => {
        setDraft(String(value));
      }, [value]);
      const commit = () => {
        const parsed = Number.parseInt(draft, 10);
        if (!Number.isFinite(parsed)) {
          setDraft(String(value));
          return;
        }
        const next = Math.max(props.min, Math.min(props.max, parsed));
        setDraft(String(next));
        if (next === value) return;
        try {
          props.onCommit(next);
        } catch (error) {
          console.error('better-dsh: could not save font size', error);
          setDraft(String(value));
        }
      };
      return h('input', {
        className: 'bdsh_fonts_input bdsh_fonts_size',
        type: 'number',
        min: props.min,
        max: props.max,
        step: 1,
        value: draft,
        'aria-label': props.label,
        onChange: (event) => setDraft(event.target.value),
        onBlur: commit,
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }
      });
    }

    /**
     * A General-settings item for the three font families and their sizes.
     *
     * DSH already owns this state in the `ui-theme` service; the panel only
     * reads its snapshot and calls `setFontFamily` / `setFontSize`, so it writes
     * through the same settings path and the built-in row (when it renders)
     * stays in sync.
     */
    function FontSettingsPanel(props) {
      const t = props.t;
      const theme = props.theme;
      const subscribe = typeof props.subscribe === 'function' ? props.subscribe : () => () => {};
      const [snapshot, setSnapshot] = React.useState(() => theme.getTheme());
      React.useEffect(() => {
        const update = () => setSnapshot(theme.getTheme());
        update();
        return subscribe(update);
      }, [theme, subscribe]);

      const families = snapshot !== undefined && snapshot !== null && snapshot.fontFamilies !== undefined ? snapshot.fontFamilies : {};
      const sizes = snapshot !== undefined && snapshot !== null && snapshot.fontSizes !== undefined ? snapshot.fontSizes : {};

      const setFamily = (role, value) => {
        try {
          props.setFontFamily(role, value);
        } catch (error) {
          console.error('better-dsh: theme rejected font family', error);
        }
      };
      const setSize = (role, value) => {
        try {
          props.setFontSize(role, value);
        } catch (error) {
          console.error('better-dsh: theme rejected font size', error);
        }
      };
      const reset = () => {
        for (const spec of FONT_ROLE_SPECS) {
          setFamily(spec.role, '');
          setSize(spec.role, spec.defaultSize);
        }
      };

      return h('div', { className: 'bdsh_fonts', 'data-better-dsh': 'fonts' },
        h('div', { className: 'bdsh_fonts_head' },
          h('div', { className: 'bdsh_fonts_titleRow' },
            h('span', { className: 'bdsh_fonts_title' }, t('fonts.title')),
            h('button', {
              type: 'button',
              className: 'bdsh_fonts_reset',
              title: t('fonts.resetHint'),
              onClick: reset
            }, t('fonts.reset'))
          ),
          h('div', { className: 'bdsh_fonts_desc' }, t('fonts.description'))
        ),
        h('div', { className: 'bdsh_fonts_rows' },
          FONT_ROLE_SPECS.map((spec) => h('div', { className: 'bdsh_fonts_row', key: spec.role },
            h('div', { className: 'bdsh_fonts_labelCol' },
              h('span', { className: 'bdsh_fonts_label' }, t(spec.label)),
              h('span', { className: 'bdsh_fonts_hint' }, t(spec.hint))
            ),
            h(FontFamilyInput, {
              t,
              value: families[spec.role] || '',
              label: t(spec.label),
              onCommit: (value) => setFamily(spec.role, value)
            }),
            h(FontSizeInput, {
              value: sizes[spec.role] === undefined ? spec.defaultSize : sizes[spec.role],
              defaultValue: spec.defaultSize,
              min: spec.min,
              max: spec.max,
              label: t(spec.label) + ' ' + t('fonts.size'),
              onCommit: (value) => setSize(spec.role, value)
            })
          ))
        )
      );
    }

    /** Add the font panel to Settings → General when the theme service is mounted. */
    function installFontSettings(ctx, t) {
      const theme = safeService(ctx, 'theme');
      if (theme === undefined || theme === null) return;
      if (typeof theme.setFontFamily !== 'function' || typeof theme.setFontSize !== 'function') return;
      ctx.effect(() => ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'better-dsh-fonts',
        order: 20,
        locale: NS,
        inject: () => ({
          theme,
          subscribe: (listener) => ctx.on('theme/change', listener),
          setFontFamily: (role, value) => theme.setFontFamily(role, value),
          setFontSize: (role, px) => theme.setFontSize(role, px)
        })
      }, FontSettingsPanel)), 'better-dsh: font settings');
    }
    //#endregion font settings

    //#region theme studio
    /** Browser-local selection for the optional theme layer. */
    const THEME_STORAGE_KEY = 'better-dsh.theme.v1';

    /**
     * Build the alias-token layer for one palette. Tokens not listed here fall
     * back to the active built-in light/dark base, so themes stay compatible
     * with DSH upgrades that add new tokens.
     */
    function themeTokens(p) {
      const mix = (value, percent) => 'color-mix(in srgb, ' + value + ' ' + percent + '%, transparent)';
      return {
        '--dsw-alias-bg-base': p.bg,
        '--dsw-alias-bg-layer-1': p.surface,
        '--dsw-alias-bg-layer-2': p.surface2,
        '--dsw-alias-bg-layer-3': p.surface3,
        '--dsw-alias-bg-overlay': p.surface2,
        '--dsw-alias-bg-module-platform': p.bg,
        '--dsw-alias-bg-skeleton': p.surface2,
        '--dsw-alias-bg-mask-1': p.mask,
        '--dsw-alias-bg-mask-2': p.mask,
        '--dsw-alias-bg-mask-3': p.mask,
        '--dsw-alias-bg-mask-drop': p.mask,
        '--dsw-alias-bg-mask-photo': p.mask,
        '--dsw-alias-bg-multi-select': p.surface3,
        '--dsw-alias-fill-l1': p.surface2,
        '--dsw-alias-fill-l2': p.surface3,
        '--dsw-alias-border-l1': p.border,
        '--dsw-alias-border-l2': p.borderStrong,
        '--dsw-alias-border-l3': p.borderStrong,
        '--dsw-alias-border-l4': p.borderStrong,
        '--dsw-alias-border-inverted': p.borderStrong,
        '--dsw-alias-border-inverted2': p.borderStrong,
        '--dsw-alias-label-primary': p.text,
        '--dsw-alias-label-secondary': p.muted,
        '--dsw-alias-label-tertiary': p.faint,
        '--dsw-alias-label-quaternary': p.faint,
        '--dsw-alias-label-caption': p.faint,
        '--dsw-alias-label-dimmed': p.faint,
        '--dsw-alias-label-primary-dimmed': p.muted,
        '--dsw-alias-label-primary-bluish': p.text,
        '--dsw-alias-label-primary-foreground': p.onAccent,
        '--dsw-alias-label-primary-inverted': p.bg,
        '--dsw-alias-label-inverted': p.bg,
        '--dsw-alias-state-business-primary': p.accent,
        '--dsw-alias-state-business-tertiary': p.surface3,
        '--dsw-alias-brand-primary': p.accent,
        '--dsw-alias-brand-text': p.accent,
        '--dsw-alias-link': p.accent,
        '--dsw-alias-state-success-primary': p.success,
        '--dsw-alias-state-success-secondary': mix(p.success, 55),
        '--dsw-alias-state-success-tertiary': mix(p.success, 22),
        '--dsw-alias-state-warn-primary': p.warn,
        '--dsw-alias-state-warn-secondary': mix(p.warn, 55),
        '--dsw-alias-state-warn-tertiary': mix(p.warn, 22),
        '--dsw-alias-state-warn-label': p.bg,
        '--dsw-alias-state-error-primary': p.danger,
        '--dsw-alias-state-error-secondary': mix(p.danger, 55),
        '--dsw-alias-state-idle-primary': p.muted,
        '--dsw-alias-button-primary-fill': p.accent,
        '--dsw-alias-button-primary-hover': p.accentHover,
        '--dsw-alias-button-primary-dimmed': p.surface3,
        '--dsw-alias-button-info-fill': p.surface2,
        '--dsw-alias-button-info-hover': p.surface3,
        '--dsw-alias-button-contrast-fill': p.text,
        '--dsw-alias-button-elevated-fill': p.surface2,
        '--dsw-alias-button-floating-fill': p.surface2,
        '--dsw-alias-button-floating-hover': p.surface3,
        '--dsw-alias-button-tool-bar-fill': p.surface2,
        '--dsw-alias-button-tool-bar-hover': p.surface3,
        '--dsw-alias-button-ghost-active-fill': p.surface2,
        '--dsw-alias-button-ghost-active-hover': p.surface3,
        '--dsw-alias-button-ghost-active-border': p.borderStrong,
        '--dsw-alias-interactive-bg-hover': p.surface2,
        '--dsw-alias-interactive-bg-active': p.surface3,
        '--dsw-alias-interactive-bg-hover-solid': p.surface2,
        '--dsw-alias-interactive-bg-hover-accent': mix(p.accent, 16),
        '--dsw-alias-interactive-bg-hover-danger': mix(p.danger, 14),
        '--dsw-alias-settings-card-fill': p.surface,
        '--dsw-alias-settings-card-stroke': p.border,
        '--dsw-alias-bg-document-preview': p.surface,
        '--dsw-alias-label-document-preview': p.muted,
        '--dsw-alias-bg-document-selection': mix(p.accent, 38),
        '--dsw-alias-markdown-code-block': p.surface,
        '--dsw-alias-markdown-code-block-banner': p.surface2,
        '--dsw-alias-markdown-inline-code': p.surface2,
        '--dsw-alias-markdown-code-segment-selected': p.surface3,
        '--dsw-alias-markdown-code-segment-unselected': p.surface,
        '--dsw-alias-markdown-placeholder': p.faint,
        '--dsw-alias-markdown-tag': p.surface3,
        '--dsw-alias-markdown-citation': p.accent,
        '--dsw-alias-menu-icon': p.text,
        '--dsw-alias-menu-group-header-fill': p.surface2,
        '--dsw-alias-scrollbar-bg-l1': p.surface2,
        '--dsw-alias-scrollbar-bg-l2': p.surface3,
        '--dsw-alias-scrollbar-hover-l1': p.surface3,
        '--dsw-alias-scrollbar-hover-l2': p.borderStrong,
        '--dsw-alias-label-shimmer': mix(p.text, 35),
        '--dsw-alias-label-deep-diving': p.accent,
        '--dsw-alias-label-deep-diving-shimmer': mix(p.accent, 50),
        '--dsw-alias-focus-ring-color': p.accent,
        '--dsw-alias-tooltip-key-bg': p.surface3,
        '--dsw-alias-toast-bg': p.surface2,
        '--dsw-alias-toast-label': p.text,
        '--dsw-alias-switch-thumb': p.onAccent,
        '--dsw-alias-onboarding-accent': p.accent,
        '--dsw-alias-onboarding-card-fill': p.surface,
        '--dsw-alias-onboarding-secondary-fill': p.surface2,
        '--dsw-alias-onboarding-checkbox-border': p.borderStrong,
        '--dsw-specific-sidebar-fill': p.surface,
        '--dsw-specific-sidebar-nav-item-active': p.surface2,
        '--dsw-specific-sidebar-nav-item-active-accent': p.accent,
        '--dsw-specific-sidebar-nav-item-hover': p.surface2,
        '--dsw-specific-menu': p.surface2,
        '--dsw-specific-input-major': p.surface,
        '--dsw-specific-selector': p.surface2,
        '--dsw-specific-bubble': p.surface2,
        '--dsw-specific-bubble-highlight': p.surface3,
        '--dsw-specific-tip': p.surface2,
        '--dsw-specific-login-input': p.surface
      };
    }

    /** Convert one family into the `{ light, dark }` pairs the theme layer expects. */
    function themePairs(family) {
      const light = themeTokens(family.light);
      const dark = themeTokens(family.dark);
      const pairs = {};
      for (const name of new Set([...Object.keys(light), ...Object.keys(dark)])) {
        pairs[name] = { light: light[name], dark: dark[name] };
      }
      return pairs;
    }

    /** Theme families shipped by Better DSH. Names are intentionally short. */
    const THEME_FAMILIES = [
      {
        id: 'obsidian',
        name: 'Obsidian',
        light: { bg: '#ffffff', surface: '#f6f6f6', surface2: '#ededed', surface3: '#e0e0e0', text: '#1f1f1f', muted: '#5f5f5f', faint: '#8a8a8a', border: '#e0e0e0', borderStrong: '#cfcfcf', accent: '#7c3aed', accentHover: '#6d28d9', onAccent: '#ffffff', success: '#2f9e44', warn: '#b7791f', danger: '#d64545', mask: 'rgba(0,0,0,.18)' },
        dark: { bg: '#1e1e1e', surface: '#262626', surface2: '#2f2f2f', surface3: '#3a3a3a', text: '#dadada', muted: '#a3a3a3', faint: '#7a7a7a', border: '#3a3a3a', borderStrong: '#4a4a4a', accent: '#a882ff', accentHover: '#b79cff', onAccent: '#1a1a1a', success: '#7bd88f', warn: '#e8c07d', danger: '#ff6b6b', mask: 'rgba(0,0,0,.5)' }
      },
      {
        id: 'nord',
        name: 'Nord',
        light: { bg: '#eceff4', surface: '#e5e9f0', surface2: '#d8dee9', surface3: '#c8d0dd', text: '#2e3440', muted: '#4c566a', faint: '#6b7280', border: '#c8d0dd', borderStrong: '#b0bccd', accent: '#5e81ac', accentHover: '#4c6f99', onAccent: '#ffffff', success: '#4f8a5b', warn: '#b48a2f', danger: '#bf616a', mask: 'rgba(0,0,0,.18)' },
        dark: { bg: '#2e3440', surface: '#343b49', surface2: '#3b4252', surface3: '#434c5e', text: '#eceff4', muted: '#d8dee9', faint: '#aab4c4', border: '#434c5e', borderStrong: '#4c566a', accent: '#88c0d0', accentHover: '#9fd0dd', onAccent: '#1b1f27', success: '#a3be8c', warn: '#ebcb8b', danger: '#bf616a', mask: 'rgba(0,0,0,.5)' }
      },
      {
        id: 'catppuccin',
        name: 'Catppuccin',
        light: { bg: '#eff1f5', surface: '#e6e9ef', surface2: '#dce0e8', surface3: '#ccd0da', text: '#4c4f69', muted: '#6c6f85', faint: '#8c8fa1', border: '#ccd0da', borderStrong: '#bcc0cc', accent: '#8839ef', accentHover: '#7527d8', onAccent: '#ffffff', success: '#40a02b', warn: '#df8e1d', danger: '#d20f39', mask: 'rgba(0,0,0,.18)' },
        dark: { bg: '#1e1e2e', surface: '#252537', surface2: '#313244', surface3: '#45475a', text: '#cdd6f4', muted: '#a6adc8', faint: '#7f849c', border: '#45475a', borderStrong: '#585b70', accent: '#cba6f7', accentHover: '#d7b9ff', onAccent: '#1e1e2e', success: '#a6e3a1', warn: '#f9e2af', danger: '#f38ba8', mask: 'rgba(0,0,0,.5)' }
      },
      {
        id: 'rose-pine',
        name: 'Rosé Pine',
        light: { bg: '#faf4ed', surface: '#fffaf3', surface2: '#f2e9e1', surface3: '#e4d7cf', text: '#575279', muted: '#797593', faint: '#9893a5', border: '#e4d7cf', borderStrong: '#d6c7bd', accent: '#d7827e', accentHover: '#c46c68', onAccent: '#ffffff', success: '#56949f', warn: '#ea9d34', danger: '#b4637a', mask: 'rgba(0,0,0,.18)' },
        dark: { bg: '#191724', surface: '#1f1d2e', surface2: '#26233a', surface3: '#403d52', text: '#e0def4', muted: '#908caa', faint: '#6e6a86', border: '#403d52', borderStrong: '#524f67', accent: '#ebbcba', accentHover: '#f0c9c7', onAccent: '#191724', success: '#9ccfd8', warn: '#f6c177', danger: '#eb6f92', mask: 'rgba(0,0,0,.5)' }
      },
      {
        id: 'tokyo-night',
        name: 'Tokyo Night',
        light: { bg: '#e1e2e7', surface: '#d5d6db', surface2: '#c8c9ce', surface3: '#b8b9be', text: '#3760bf', muted: '#6172b0', faint: '#8990b3', border: '#c8c9ce', borderStrong: '#b0b1b6', accent: '#2e7de9', accentHover: '#1f6ad6', onAccent: '#ffffff', success: '#587539', warn: '#8c6c3e', danger: '#f52a65', mask: 'rgba(0,0,0,.18)' },
        dark: { bg: '#1a1b26', surface: '#1f2335', surface2: '#24283b', surface3: '#2f3549', text: '#c0caf5', muted: '#a9b1d6', faint: '#737aa2', border: '#2f3549', borderStrong: '#3b4261', accent: '#7aa2f7', accentHover: '#8fb0ff', onAccent: '#16161e', success: '#9ece6a', warn: '#e0af68', danger: '#f7768e', mask: 'rgba(0,0,0,.5)' }
      },
      {
        id: 'solarized',
        name: 'Solarized',
        light: { bg: '#fdf6e3', surface: '#eee8d5', surface2: '#e4ddc8', surface3: '#d8d0b8', text: '#073642', muted: '#586e75', faint: '#839496', border: '#d8d0b8', borderStrong: '#c9c0a6', accent: '#268bd2', accentHover: '#1a7bbd', onAccent: '#ffffff', success: '#859900', warn: '#b58900', danger: '#dc322f', mask: 'rgba(0,0,0,.18)' },
        dark: { bg: '#002b36', surface: '#073642', surface2: '#0b3f4b', surface3: '#14505c', text: '#eee8d5', muted: '#93a1a1', faint: '#657b83', border: '#14505c', borderStrong: '#1f6370', accent: '#2aa198', accentHover: '#35b5ab', onAccent: '#002b36', success: '#859900', warn: '#b58900', danger: '#dc322f', mask: 'rgba(0,0,0,.5)' }
      }
    ];

    const GLASS_STORAGE_KEY = 'better-dsh.glass.v1';
    const DEFAULT_GLASS = Object.freeze({ enabled: false, intensity: 'medium', sheen: true, ambience: true });

    function normalizeGlass(value) {
      const source = value !== null && typeof value === 'object' ? value : {};
      const intensity = source.intensity === 'soft' || source.intensity === 'strong' ? source.intensity : 'medium';
      return {
        enabled: source.enabled === true,
        intensity,
        sheen: source.sheen !== false,
        ambience: source.ambience !== false
      };
    }

    function readGlass() {
      try {
        const raw = globalThis.localStorage?.getItem(GLASS_STORAGE_KEY);
        return raw === null || raw === undefined ? { ...DEFAULT_GLASS } : normalizeGlass(JSON.parse(raw));
      } catch {
        return { ...DEFAULT_GLASS };
      }
    }

    function writeGlass(value) {
      try {
        globalThis.localStorage?.setItem(GLASS_STORAGE_KEY, JSON.stringify(value));
      } catch {
        // The material still applies for this session without persistence.
      }
    }

    function applyGlass(value) {
      if (typeof document === 'undefined' || document.body == null) return;
      const body = document.body;
      if (!value.enabled) {
        delete body.dataset.bdshGlass;
        delete body.dataset.bdshSheen;
        delete body.dataset.bdshAmbience;
        return;
      }
      body.dataset.bdshGlass = value.intensity;
      body.dataset.bdshSheen = value.sheen ? 'on' : 'off';
      body.dataset.bdshAmbience = value.ambience ? 'on' : 'off';
    }

    function readThemeId() {
      try {
        const value = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
        return typeof value === 'string' && value !== '' ? value : undefined;
      } catch {
        return undefined;
      }
    }

    function writeThemeId(id) {
      try {
        if (id === undefined) globalThis.localStorage?.removeItem(THEME_STORAGE_KEY);
        else globalThis.localStorage?.setItem(THEME_STORAGE_KEY, id);
      } catch {
        // localStorage can be unavailable; the theme still applies for this session.
      }
    }

    /**
     * Theme gallery. It applies a token layer through the official
     * `ctx.theme.overrideTokens` surface, so the built-in light/dark/system
     * preference remains authoritative and a theme switch is instant.
     */
    function ThemeStudioPanel(props) {
      const t = props.t;
      const theme = props.theme;
      const subscribe = typeof props.subscribe === 'function' ? props.subscribe : () => () => {};
      const [snapshot, setSnapshot] = React.useState(() => theme.getTheme());
      const [selected, setSelected] = React.useState(() => (typeof props.getInitialTheme === 'function' ? props.getInitialTheme() : props.initialTheme));
      const [glass, setGlassState] = React.useState(() => (typeof props.getGlass === 'function' ? props.getGlass() : { ...DEFAULT_GLASS }));
      React.useEffect(() => {
        const update = () => setSnapshot(theme.getTheme());
        update();
        return subscribe(update);
      }, [theme, subscribe]);

      const scheme = snapshot?.active?.colorScheme === 'dark' ? 'dark' : 'light';
      const mode = snapshot?.preference === 'light' || snapshot?.preference === 'dark' ? snapshot.preference : 'system';
      const current = selected === undefined ? undefined : props.themes.find((item) => item.id === selected);

      const apply = (id) => {
        if (props.applyTheme(id)) setSelected(id);
      };
      const reset = () => {
        props.clearTheme();
        setSelected(undefined);
      };
      const setMode = (id) => {
        try {
          props.setMode(id);
        } catch (error) {
          console.error('better-dsh: could not change color scheme', error);
        }
      };
      const updateGlass = (patch) => {
        const next = { ...glass, ...patch };
        setGlassState(next);
        try {
          props.setGlass(next);
        } catch (error) {
          console.error('better-dsh: could not apply glass material', error);
        }
      };

      return h('div', { className: 'bdsh_themes', 'data-better-dsh': 'themes' },
        h('div', { className: 'bdsh_themes_head' },
          h('span', { className: 'bdsh_themes_title' }, t('themes.title')),
          h('span', { className: 'bdsh_themes_desc' }, t('themes.description'))
        ),
        h('div', { className: 'bdsh_themes_modes', role: 'group', 'aria-label': t('themes.title') },
          [['system', 'themes.system'], ['light', 'themes.light'], ['dark', 'themes.dark']].map(([id, key]) =>
            h('button', {
              key: id,
              type: 'button',
              className: 'bdsh_themes_mode',
              'data-selected': mode === id,
              'aria-pressed': mode === id,
              onClick: () => setMode(id)
            }, t(key))
          )
        ),
        h('div', { className: 'bdsh_themes_grid' },
          h('button', {
            type: 'button',
            className: 'bdsh_theme_card',
            'data-default': true,
            'data-selected': selected === undefined,
            onClick: reset
          },
            h('div', { className: 'bdsh_theme_body' },
              h('span', { className: 'bdsh_theme_name' }, t('themes.default')),
              h('span', { className: 'bdsh_theme_tag' }, t('themes.defaultTag'))
            )
          ),
          props.themes.map((item) => {
            const palette = item[scheme] ?? item.light;
            return h('button', {
              key: item.id,
              type: 'button',
              className: 'bdsh_theme_card',
              'data-selected': selected === item.id,
              title: item.name,
              onClick: () => apply(item.id)
            },
              h('div', { className: 'bdsh_theme_preview', 'aria-hidden': 'true' },
                [palette.bg, palette.surface, palette.border, palette.text, palette.accent].map((color, index) =>
                  h('span', { key: index, className: 'bdsh_theme_swatch', style: { background: color } })
                )
              ),
              h('div', { className: 'bdsh_theme_body' },
                h('span', { className: 'bdsh_theme_name' }, item.name),
                h('span', { className: 'bdsh_theme_tag' }, t('themes.adaptive'))
              )
            );
          })
        ),
        h('div', { className: 'bdsh_themes_current' },
          current === undefined ? t('themes.defaultCurrent') : t('themes.current', { name: current.name })
        ),
        h('div', { className: 'bdsh_themes_note' }, t('themes.note')),
        h('div', { className: 'bdsh_glass', 'data-better-dsh': 'glass' },
          h('div', { className: 'bdsh_glass_head' },
            h('div', { className: 'bdsh_glass_titleRow' },
              h('span', { className: 'bdsh_glass_title' }, t('glass.title')),
              h('span', { className: 'bdsh_glass_desc' }, t('glass.description'))
            ),
            h('button', {
              type: 'button',
              className: 'bdsh_glass_switch',
              role: 'switch',
              'aria-checked': glass.enabled,
              'aria-label': t('glass.enabled'),
              title: t('glass.enabled'),
              onClick: () => updateGlass({ enabled: !glass.enabled })
            }, h('span', { className: 'bdsh_glass_knob' }))
          ),
          h('div', { className: 'bdsh_glass_row' },
            h('span', { className: 'bdsh_glass_label' }, t('glass.intensity')),
            [['soft', 'glass.soft'], ['medium', 'glass.medium'], ['strong', 'glass.strong']].map(([id, key]) =>
              h('button', {
                key: id,
                type: 'button',
                className: 'bdsh_glass_seg',
                'data-selected': glass.intensity === id,
                disabled: !glass.enabled,
                onClick: () => updateGlass({ intensity: id })
              }, t(key))
            )
          ),
          h('div', { className: 'bdsh_glass_row' },
            h('button', {
              type: 'button',
              className: 'bdsh_glass_toggle',
              'aria-pressed': glass.sheen,
              disabled: !glass.enabled,
              onClick: () => updateGlass({ sheen: !glass.sheen })
            }, h('span', { className: 'bdsh_glass_dot' }), t('glass.sheen')),
            h('button', {
              type: 'button',
              className: 'bdsh_glass_toggle',
              'aria-pressed': glass.ambience,
              disabled: !glass.enabled,
              onClick: () => updateGlass({ ambience: !glass.ambience })
            }, h('span', { className: 'bdsh_glass_dot' }), t('glass.ambience'))
          ),
          h('div', { className: 'bdsh_glass_hint' }, t('glass.hint'))
        )
      );
    }

    /** Register the theme layer and the Settings → General gallery. */
    function installThemeStudio(ctx, t) {
      const theme = safeService(ctx, 'theme');
      if (theme === undefined || theme === null) return;
      if (typeof theme.overrideTokens !== 'function' || typeof theme.setTheme !== 'function' || typeof theme.getTheme !== 'function') return;

      let layer;
      let glass = readGlass();
      applyGlass(glass);
      const applyTheme = (id, persist) => {
        const family = THEME_FAMILIES.find((item) => item.id === id);
        if (family === undefined) return false;
        try {
          if (layer !== undefined) {
            layer();
            layer = undefined;
          }
          layer = theme.overrideTokens(PACKAGE_ID + '/theme-studio', themePairs(family));
          if (persist !== false) writeThemeId(id);
          return true;
        } catch (error) {
          console.error('better-dsh: could not apply theme', error);
          return false;
        }
      };
      const clearTheme = (persist) => {
        try {
          if (layer !== undefined) {
            layer();
            layer = undefined;
          }
        } catch (error) {
          console.error('better-dsh: could not clear theme', error);
        }
        if (persist !== false) writeThemeId(undefined);
      };

      ctx.effect(() => () => {
        if (layer !== undefined) {
          try { layer(); } catch { /* already released */ }
          layer = undefined;
        }
      }, 'better-dsh: theme layer');

      ctx.effect(() => () => {
        if (typeof document === 'undefined' || document.body == null) return;
        delete document.body.dataset.bdshGlass;
        delete document.body.dataset.bdshSheen;
        delete document.body.dataset.bdshAmbience;
      }, 'better-dsh: glass material');

      const saved = readThemeId();
      if (saved !== undefined) {
        if (!applyTheme(saved, false)) writeThemeId(undefined);
      }

      ctx.effect(() => ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'better-dsh-themes',
        order: 30,
        locale: NS,
        inject: () => ({
          theme,
          subscribe: (listener) => ctx.on('theme/change', listener),
          themes: THEME_FAMILIES,
          getInitialTheme: readThemeId,
          applyTheme: (id) => applyTheme(id, true),
          clearTheme: () => clearTheme(true),
          setMode: (id) => theme.setTheme(id),
          getGlass: readGlass,
          setGlass: (value) => {
            glass = normalizeGlass(value);
            applyGlass(glass);
            writeGlass(glass);
          }
        })
      }, ThemeStudioPanel)), 'better-dsh: theme studio');
    }
    //#endregion theme studio


    return {
      inject: ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight', 'remote.workspaceFiles'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'better-dsh: copy');
        const t = ctx.locale.bind(NS);
        installFontSettings(ctx, t);
        installThemeStudio(ctx, t);
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

        const jobsService = safeService(ctx, 'jobs');
        const mission = createMissionBody(ctx);

        ctx.effect(() => {
          try {
            return tabs.register({
              id: MISSION_ID,
              kind: MISSION_KIND,
              title: () => t('mission.title'),
              guide: [{
                id: 'mission',
                order: 5,
                title: () => t('mission.guideTitle'),
                description: () => t('mission.guideDescription'),
                icon: MissionGlyph
              }]
            });
          } catch (error) {
            console.error('better-dsh: Mission Control tab type is unavailable', error);
            return () => {};
          }
        }, 'better-dsh: mission type');

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: MISSION_ID,
          locale: NS,
          inject: () => ({
            hooks: {
              jobs: jobsService !== undefined && jobsService !== null && jobsService.state !== undefined ? jobsService.state : EMPTY_JOBS_STORE
            }
          })
        }, mission)), 'better-dsh: mission body');

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: MISSION_ID,
          locale: NS
        }, MissionTitle)), 'better-dsh: mission title');

        ctx.effect(() => ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
          name: 'conversation.session.header.actions',
          id: 'mission-control',
          order: 30,
          locale: NS,
          inject: () => ({ open: () => openMissionTab(ctx) })
        }, MissionAction)), 'better-dsh: mission header action');
      }
    };
  }
});

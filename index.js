/**
 * Host half of the better-dsh bundle.
 *
 * Everything this project changes today lives in the browser: the Client half
 * registers a right-Sidebar tab type that lists one directory over the existing
 * `workspaceFiles` Remote and routes directory addresses to it. The Host row
 * exists so the Loader scans this package's `dsh.client` declaration and the
 * bundle's client half is served.
 */
export function apply() {}

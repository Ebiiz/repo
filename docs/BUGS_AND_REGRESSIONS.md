# Bugs and regressions

Updated: 2026-10-27

## Fixed

| Bug | Severity | Reproduction | Root cause | Fix | Regression test | Status |
|---|---|---|---|---|---|---|
| Startup could throw when localStorage access or JSON parsing failed | P1 | Disable browser storage or place invalid JSON under `reelway.watchlist.v1`, then load the page | Storage load ran before the DOM element registry was initialized; its error reporter accessed that uninitialized binding | Initialize DOM references before loading the watchlist; keep the error visible and allow the public catalogue to initialize | Code ordering reviewed; parser failures tested; browser runtime reproduction not available | Fixed; browser confirmation pending |
| Watchlist changes in one same-origin tab left other tabs stale and liable to overwrite newer state | P2 | Open two tabs, update a status in one, then inspect the other | No `storage` event listener updated the second tab | Parse and render the changed watchlist in other tabs; report malformed external state and preserve the current in-memory list | Parser, invalid-data, and duplicate-entry unit tests; manual two-tab test pending | Fixed in code; browser confirmation pending |
| Details dialog implied an existing watch status could be updated, but its button retained the same status | P2 | Save a title, open its details, click “Update watch status” | The action reused the current status rather than providing a selection | Show the current status as a native selector in the detail dialog | Syntax/quality checks pass; browser interaction test pending | Fixed in code; browser confirmation pending |
| Section navigation replaced the current history fragment, preventing expected back/forward navigation between sections | P2 | Move between app sections, then use browser Back | Navigation used `replaceState()` for each click | Push a same-origin fragment history entry only when the target differs; existing hash-change handler restores the selected section | Syntax/quality checks pass; browser history test pending | Fixed in code; browser confirmation pending |
| Saved titles could not be removed from the watchlist | P2 | Save a title, then try to undo the save from the watchlist or title details | The UI only exposed status changes after saving | Add an accessible remove action in both locations and update the browser-local list | Unit test covers removal without mutating the original list; browser interaction test pending | Fixed in code; browser confirmation pending |
| Roadmap entries did not reflect or update watch progress | P1 | Save titles as completed or watching, then inspect the roadmap | Roadmap rendering was disconnected from the existing watchlist state | Show completed/tracked totals, provide per-entry status selectors for saved titles, and a Track action for unsaved entries | Unit test covers total, tracked, completed, and empty progress; browser interaction test pending | Fixed in code; browser confirmation pending |

## Baseline limitations (not regressions)

- No browser, end-to-end, visual, or accessibility runner is installed/configured.
- The catalogue and roadmap are unverified illustrative records; streaming availability is unknown.
- Persistence remains local to the browser. Storage events are best-effort synchronization, not transactional conflict resolution.

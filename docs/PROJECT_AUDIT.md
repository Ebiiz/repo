# Project audit

## Snapshot

Audit and implementation baseline: 2026-10-27. The repository initially contained only `index.html`, `script.js`, `styles.css`, and a six-byte README. There was no package manifest, lockfile, app framework, backend, database, migration, authentication provider, external API client, test suite, CI workflow, deployment configuration, or environment file. The three application files were untracked at the start of this work.

## Existing implementation

- A single HTML page with responsive CSS and a deferred, plain JavaScript script.
- The original page was a Daymark productivity mockup with a login/signup form that opened a dashboard without authenticating, sample tasks, and mostly placeholder navigation.
- There was no real routing; all views and behavior were in one page.
- There were no working entertainment catalogue, roadmap, discovery, watch-history, API, or persistence features.
- The previous JavaScript passed `node --check script.js`. No configured lint, type-check, build, or test commands existed.

## Changes in this increment

- Replaced the unrelated productivity mock with a static Reelway discovery experience: search, format/year/availability filters, title sorting, details, a two-order sample roadmap, region selection, and a watchlist with five status choices.
- Kept catalogue and roadmap records separate from rendering logic. Demo records are explicitly labelled unverified; availability has no provider records and is shown as unknown.
- Added browser-local watchlist persistence. This is not account-based, secure user-data isolation, or cloud synchronization.
- Added focused Node.js unit tests and a minimal CI workflow.
- Cycle 1 found and fixed a startup error path when browser storage access or JSON parsing fails, and added best-effort same-origin tab synchronization and validation of saved entries. See [BUGS_AND_REGRESSIONS.md](./BUGS_AND_REGRESSIONS.md) and [IMPROVEMENT_BACKLOG.md](./IMPROVEMENT_BACKLOG.md).
- Cycle 2 makes saved status editable from title details and preserves section navigation in browser history. The code checks pass; real browser interaction remains unverified because no browser runner is available.
- Cycle 3 adds a remove action to saved-title cards and details, with unit coverage for non-mutating list removal. Syntax checks, all 10 unit tests, and local HTTP serving passed; interactive browser testing remains unavailable.
- Cycle 4 persists the supported region preference locally and synchronizes it across same-origin tabs. Syntax checks and all 11 unit tests passed; the browser interaction remains unverified. Added the [product requirements inventory](./PRODUCT_REQUIREMENTS.md) and [project state](./PROJECT_STATE.md); no release or deployment was made.
- Cycle 5 connects roadmap rows to the local watchlist, adds per-entry tracking/status controls, and displays completed/tracked totals. Syntax checks and all 12 unit tests passed; browser interaction was not run because no runner is installed.

## Issues, risks, and technical debt

| Area | Finding | Priority |
|---|---|---|
| Data quality | Catalogue and roadmap are illustrative local records; there is no verification workflow or authoritative source. | High before public launch |
| Streaming | No authorized provider, country-specific data, or last-verified timestamp is configured. Availability must remain unknown. | High before public launch |
| Identity and privacy | No backend or authentication exists. Browser storage is accessible to the browser profile and is not user-isolated. | High before multi-user use |
| Persistence | Watchlist is tied to one browser/device and can be cleared or unavailable. | Medium |
| Coverage | Tests cover pure filtering, sorting, roadmap order, and status counting only; no browser, accessibility, API, or persistence integration tests exist. | Medium |
| Delivery | CI runs static checks and unit tests only. There is no deployment target or post-deploy smoke test. | Medium |
| Metadata model | External IDs, source, and verification state are represented in the client sample but not backed by a normalized, versioned database schema. | High before ingestion |
| Framework | A static native JavaScript app is appropriate for this small no-backend increment, but does not support privileged provider calls, jobs, or account features. | Reassess when backend is selected |

## Security and performance notes

- The previous mock login did not authenticate and is removed to avoid implying that it protected user data.
- Current behavior is client-side only. Do not store credentials, access tokens, or sensitive personal information in this app.
- Rendering uses DOM nodes and `textContent` for catalogue values rather than injecting title strings as HTML.
- No server, API, database, CORS policy, cookies, or response headers are configured; these cannot be assessed as deployed controls.
- The dataset is six local records, so this is not evidence of production search/index performance. A real catalogue needs server-side search, bounded pagination, and indexed query paths.
- Google Fonts are a remote browser request; self-host fonts or review privacy/performance requirements before production use.

## Recommendations and implementation priorities

1. Select an authorized metadata source and verify its terms, attribution, image rights, rate limits, and credentials; build an ingestion and review path that never promotes unverified data silently.
2. Select server hosting and a relational database, then add versioned migrations and server-side authorization before accounts, shared data, or private watchlists.
3. Implement secure authentication, ownership-enforced watch records, request validation, rate limits, and recovery procedures.
4. Add accessible browser end-to-end coverage and integration tests against isolated services.
5. Add a validated streaming availability provider and country-aware verification timestamps; unknown remains the correct state until then.
6. Add deployment, headers, monitoring, rollback, and smoke checks after a hosting target is selected.

## Existing behavior / regression notes

The original Daymark login, dashboard task checklist, date widgets, and toast messages were a standalone productivity mock, unrelated to the requested entertainment product. They are intentionally replaced, not represented as working Reelway features. No real authentication, external data, or database behavior existed to preserve.

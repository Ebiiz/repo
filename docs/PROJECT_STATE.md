# Project state

Updated: 2026-10-27, cycle 5.

## Architecture

Reelway is a static HTML/CSS/JavaScript module app. `src/data.mjs` holds illustrative records, `src/catalog.mjs` provides pure search/filter/sort/watchlist helpers, and `src/app.mjs` renders the UI and stores preferences in browser localStorage. There is no backend, account system, database, external metadata provider, or deployment target. See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Working state verified this cycle

- The local preview task serves the app on port 8000, bound to `0.0.0.0`; the page and app module returned HTTP 200 in the current environment.
- Search/filter, roadmap toggling, and browser-local watchlist features are implemented. The region selector now remembers supported values in localStorage. Choosing a region does not provide streaming availability data.
- Roadmap rows now reflect watchlist status and allow entries to be tracked/updated; the roadmap summary reports completed and tracked counts.
- The catalogue and roadmap remain unverified demo data.
- `npm run check` passed.
- `npm test` passed all 12 tests, including roadmap progress aggregation.
- Browser UI, accessibility, visual, and responsive testing were not run; no browser automation or binary was available.
- CI is configured for pull requests and pushes to `main`, but only runs `npm ci`, syntax checks, and unit tests. There is no deploy job, static-host configuration, production target, or observed remote workflow result. No production deployment or release was made.

## Recent change

Cycle 4 persists the region preference, validates stored values against the four supported region codes, falls back to US for missing/unknown values, and syncs changes across same-origin tabs using the existing storage event listener. Cycle 5 connects roadmap progress and controls to the local watchlist.

## Known blockers and risks

- Authorized, verified metadata/roadmap data and a streaming availability provider have not been selected.
- The catalogue contains only six unverified movie samples, so TV filtering currently has no matching records and roadmap order cannot be presented as authoritative.
- User data is local to one browser profile; there is no authentication or server-side privacy boundary.
- Browser E2E, accessibility, performance, deployment, monitoring, and recovery checks are not configured.
- The release/deployment target is undecided; the application is not production-ready or released. Pushing to `main` runs CI only and does not publish the site.

## Next priorities

1. Select an authorized source and verification process before replacing demo records or presenting release/chronology order as reliable.
2. Decide hosting, identity, and database architecture before implementing private multi-device persistence.
3. Add browser-runner coverage for roadmap status controls, watchlist actions, navigation, and responsive/keyboard journeys.

See [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) for status by requirement and [QUALITY_SCORECARD.md](./QUALITY_SCORECARD.md) for check results.

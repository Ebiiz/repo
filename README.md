# Reelway

Reelway is a lightweight entertainment discovery and watch-planning prototype. Browse a small catalogue, search and filter titles, compare two sample roadmap orders, and save watch status in the current browser.

## Run locally

The app is static and has no runtime dependencies. Use a local HTTP server so JavaScript modules load correctly:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Any static file server that serves ES modules is suitable. See [`.env.example`](./.env.example); no environment variables are currently required.

## Features and limitations

- Search by title, franchise, or genre; filter by format, year, and availability state; sort by release year or title.
- Open title details and switch the sample Marvel Cinematic Universe roadmap between release and story order.
- Save a title and update its watch status in browser-local storage; region preference is also saved locally.
- Region selection is only a preference: streaming availability data is not connected.
- The catalogue is illustrative demo data. Every record and roadmap is unverified; streaming availability is unknown. No metadata or streaming provider is connected.
- The watchlist is device-local, has no account or cloud sync, and is not private data protected by a backend.

See [the project audit](./docs/PROJECT_AUDIT.md), [architecture](./docs/ARCHITECTURE.md), [database notes](./docs/DATABASE.md), [testing guide](./docs/TESTING.md), and [deployment guide](./docs/DEPLOYMENT.md).

The [improvement backlog](./docs/IMPROVEMENT_BACKLOG.md), [bug log](./docs/BUGS_AND_REGRESSIONS.md), [research log](./docs/RESEARCH_LOG.md), [quality scorecard](./docs/QUALITY_SCORECARD.md), and [changelog](./CHANGELOG.md) track ongoing work.

See the [product requirements inventory](./docs/PRODUCT_REQUIREMENTS.md) and [project state](./docs/PROJECT_STATE.md) for verified scope, blockers, and next priorities.

## Checks

```sh
npm ci
npm run check
npm test
```

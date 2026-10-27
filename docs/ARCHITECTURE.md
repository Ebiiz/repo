# Architecture

## Current application

Reelway is a static, browser-rendered application with no framework or server:

- `index.html` defines accessible page structure and the primary navigation.
- `styles.css` contains the dark responsive design tokens and layouts.
- `src/data.mjs` stores a small illustrative catalogue and a roadmap as data.
- `src/catalog.mjs` contains pure search/filter/sort/roadmap/status helpers.
- `src/app.mjs` renders the UI, handles interactions, and stores the watchlist and region preference in browser `localStorage`.

The application requests no external catalogue or streaming API. The region selector is persisted as a preference only and does not establish availability. All sample metadata and roadmap entries are explicitly unverified.

## Boundaries and future server architecture

The current browser app must not be treated as an authorization boundary. When account features or trusted data ingestion are introduced, move database access and provider credentials to server-side services. A future deployment should separate:

1. Public catalogue/search and title/roadmap read models.
2. Authenticated watchlist and progress APIs, validating ownership on every request.
3. Metadata-provider adapters and a reviewed ingestion/synchronization job.
4. Country-specific availability ingestion with provider/source, access type, verification status, and timestamp.
5. Administrative review and audit operations, protected by server-side roles.

No hosting platform, server runtime, authentication system, or provider has been selected. Do not expose service-role keys or provider secrets in browser code.

## Data trust

The demo `verification` marker is deliberately unverified. Missing values are represented as missing, not filled with plausible-looking defaults. Availability is an empty collection, which the UI treats as unknown. Do not remove the demo warnings without replacing the sample source with verified records and a maintained update process.

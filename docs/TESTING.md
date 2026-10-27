# Testing

## Available checks

Requires Node.js 20 or newer and npm. No third-party test dependencies are required.

```sh
npm ci
npm run check
npm test
```

`npm run check` syntax-checks the native JavaScript modules. `npm test` uses Node's built-in test runner for search, combined filters, sorting, roadmap ordering and progress aggregation, unknown availability, watch-status aggregation, saved-entry validation, watchlist removal, and region preference validation.

## Coverage limits

Watchlist parser tests cover malformed JSON, invalid shapes, unknown titles/statuses, duplicate title entries, and absent storage. Region tests cover accepted, missing, and unsupported preference values; they do not exercise actual browser persistence or cross-tab synchronization. The current checks do not run a browser, validate visual/responsive behavior, exercise actual browser `localStorage` events, or test authentication, APIs, database constraints, authorization, accessibility, or external provider failures. Those systems do not exist in this static increment. Before adding a backend, add isolated database/API tests; before launch, add keyboard/mobile end-to-end coverage and an accessibility audit. Never use production data for integration tests.

## CI

The GitHub Actions workflow runs the committed-lockfile install, syntax check, and unit tests on pull requests and pushes to `main`. It does not deploy or run end-to-end tests.

# Deployment

## Current deployment shape

Reelway is a static site: serve `index.html`, `styles.css`, and `src/` over HTTPS from any static host that serves JavaScript modules with the correct MIME type. No build step, server routes, database, environment variables, or deployment target is configured. A local development server is sufficient for review; see [README.md](../README.md).

The only GitHub Actions workflow is `.github/workflows/ci.yml`. Pull requests and pushes to `main` run dependency installation, syntax checks, and unit tests; there is no publish/deploy job. A merge or push therefore does not update a live website. No production deployment is authorized or configured in this repository.

Do not deploy the demo catalogue as verified product data. The region selector does not check providers, and the watchlist is local to one browser.

## Before production

1. Select a host and define preview/production environments.
2. Decide whether to self-host the Google Fonts dependency and configure a restrictive Content Security Policy and other security headers at the host.
3. Select authorized metadata and streaming services; store credentials only in server-side secret storage if server-side integration is introduced.
4. Add the chosen server/database, migrations, authenticated ownership checks, backup/recovery, and monitoring if account features are required.
5. Require CI checks before deployment and add post-deploy smoke tests and a documented rollback path.

No production deployment, secrets, repository permissions, or production data were changed.

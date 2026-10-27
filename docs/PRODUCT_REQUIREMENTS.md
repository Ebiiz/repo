# Product requirements inventory

Updated: 2026-10-27, cycle 5. Status describes evidence in this repository; no requirement is marked released without deployment verification.

| ID | Category | Requirement | Priority | Status | Evidence | Dependencies | Acceptance criteria | Relevant tests | Release status |
|---|---|---|---|---|---|---|---|---|---|
| PROD-01 | Product | Search catalogue titles, franchises, and genres | P1 | IMPLEMENTED | `src/catalog.mjs`, `src/app.mjs` | Catalogue data | Matching query narrows visible titles | `search matches title, franchise, and genre without case sensitivity` | NOT RELEASED |
| PROD-02 | Product | Filter and sort catalogue entries | P1 | IMPLEMENTED | Search toolbar in `index.html`; catalog helpers | Catalogue metadata | Combined filters and supported sorts preserve source data | Combined-filter and sorting tests | NOT RELEASED |
| PROD-03 | Product | Show title details and roadmap order choices | P1 | IMPLEMENTED | Native dialog and roadmap renderer in `src/app.mjs` | Demo title/roadmap records | Detail action opens; selected order determines sequence | Roadmap-order test; dialog needs browser verification | NOT RELEASED |
| PROD-04 | Product | Manage local watchlist and status | P1 | IMPLEMENTED | `src/app.mjs`; `src/catalog.mjs` | Browser localStorage | Save, change status, remove; invalid stored entries do not create unknown records | Parser, status, and removal unit tests | NOT RELEASED |
| PROD-05 | Product | Remember selected region without implying streaming availability | P2 | IMPLEMENTED | `reelway.region.v1` in `src/app.mjs` | Browser localStorage | Supported choice is restored; unknown values fall back to US; availability remains explicitly disconnected | Region preference parsing test; browser persistence needs verification | NOT RELEASED |
| PROD-06 | Product | Show and update watch progress from roadmap entries | P1 | IMPLEMENTED | `renderRoadmap()` and `summarizeRoadmapProgress()` | Existing local watchlist; browser localStorage for persistence | Roadmap shows completed/tracked totals; an entry can be added or its saved status changed in place | Roadmap progress aggregation test; browser UI interaction needs verification | NOT RELEASED |
| DATA-01 | Data integrity | Never present demo metadata, roadmap order, or availability as verified | P0 before launch | IMPLEMENTED | `src/data.mjs`, `index.html`, title details | Authorized data provider before verification can be added | Demo records are marked unverified and availability remains unknown | Demo metadata/availability test | NOT RELEASED |
| UX-01 | UX/accessibility | Provide keyboard-operable controls and responsive layout | P1 | PARTIALLY IMPLEMENTED | Semantic controls, visible focus rules, responsive CSS | Browser and assistive-technology QA | Complete keyboard and narrow-viewport journeys without inaccessible controls | No browser/accessibility test configured | NOT RELEASED |
| TEST-01 | Testing | Run automated syntax and unit tests in CI | P1 | IMPLEMENTED | `package.json`, `.github/workflows/ci.yml` | GitHub Actions | CI runs install, syntax check, and unit suite | `npm run check`, `npm test`; remote CI not observed | NOT RELEASED |
| SEC-01 | Security | Protect private account data with server-side identity and authorization | P0 before multi-user use | NOT IMPLEMENTED | No backend or account system; localStorage is not an authorization boundary | Hosting, identity, server, database design | Unauthorized users cannot read or modify another user's records | Requires isolated API authorization tests | BLOCKED |
| REL-01 | Reliability | Keep local preview available and serve ES modules over HTTP | P2 | IMPLEMENTED | `.vscode/tasks.json`; static HTTP server | Python 3 and forwarded workspace port | Page and module respond successfully on configured port | Local HTTP smoke test; port forwarding depends on environment | NOT RELEASED |
| PERF-01 | Performance | Measure load/search performance against production-scale data | P2 | NOT IMPLEMENTED | Six illustrative records; no performance baseline | Verified representative dataset and browser profiling | Set and meet measured load/search budgets | No performance test configured | BLOCKED |
| OPS-01 | CI/CD | Configure deployment, smoke checks, monitoring, and rollback | P1 before production | NOT IMPLEMENTED | No hosting target or deploy workflow | Deployment platform and release policy | Authorized deployment can be verified and recovered | No deployment test configured | BLOCKED |
| DOC-01 | Documentation | Keep testing, architecture, quality, bugs, and project state documented | P2 | PARTIALLY IMPLEMENTED | `docs/` inventory; this requirements file | Update after material changes | Docs reflect observed behavior and clearly state unverified claims | Manual review | NOT RELEASED |
| MAINT-01 | Maintenance | Track versioned releases and changelog when a release process is selected | P2 | NOT IMPLEMENTED | No changelog or release convention configured | Hosting and release process decision | Version changes correspond to verified releases, not arbitrary bumps | Release checklist not configured | BLOCKED |

## Status definitions

- **NOT IMPLEMENTED:** no integrated implementation is present.
- **PARTIALLY IMPLEMENTED:** some relevant behavior exists but acceptance criteria or verification are incomplete.
- **IMPLEMENTED:** functionality or configuration exists; user-facing or remote behavior may still need verification.
- **VERIFIED:** acceptance criteria were exercised with observed test evidence.
- **RELEASED:** a deployment was confirmed and the deployed version was checked.
- **BLOCKED:** work depends on a product, provider, infrastructure, or authorization decision.

## Current release boundary

This repository is a local static prototype. No production host, release tag, or deployment is configured. No requirement in this inventory is marked RELEASED.

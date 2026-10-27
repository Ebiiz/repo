# Improvement backlog

Updated: 2026-10-27

| Candidate | Priority | User value | Effort | Dependencies | Status | Verification |
|---|---|---:|---:|---|---|---|
| Track completion directly on roadmap entries and show roadmap progress | P1 | High: lets users update viewing status in context and understand overall progress | Small | Existing browser-local watchlist | Implemented in cycle 5 | Unit test covers tracked/completed totals; browser interaction still needs testing |
| Persist and validate the user's selected streaming region preference | P2 | Medium: keeps the selected region across reloads while clearly retaining unknown availability | Small | Browser localStorage | Implemented in cycle 4 | Unit test covers supported, absent, and unsupported values; browser persistence/sync still needs testing |
| Remove a saved title from the watchlist | P2 | Medium: lets users correct saves without changing a title to an unrelated tracking status | Small | Existing browser-local watchlist | Implemented in cycle 3 | Unit test verifies removal and source-list immutability; browser interaction still needs testing |
| Sync watchlist changes between same-origin tabs and validate stored entries | P1 | High: avoids stale lists and rejects malformed/unknown saved records | Small | Browser localStorage only | Implemented in cycle 1 | Unit tests for valid, duplicate, malformed, and unknown entries; manual multi-tab test still needed |
| Fix startup failure when localStorage is blocked or saved JSON is malformed | P1 | High: browsing should remain available if persistence fails | Small | None | Implemented in cycle 1 by initializing UI references before loading storage | Inspect initialization order; browser test with storage disabled still needed |
| Let saved title status be changed from details; preserve section navigation in browser history | P2 | Medium: clearer watch tracking and expected back/forward behavior | Small | Native dialog and History API | Implemented in cycle 2 | Source review and syntax checks; browser interaction test still needed |
| Add browser end-to-end and mobile accessibility tests | P2 | High confidence in real UI navigation and interactions | Medium | Browser automation package/browser runtime | Open | Verify search, details, roadmap toggle, watchlist, keyboard and narrow viewport |
| Replace illustrative catalogue and roadmap with verified, sourced data | P1 | Essential for trustworthy product use | Large | Authorized provider, terms review, credentials and data review | Blocked | Verify provenance and roadmap ordering; never infer provider availability |
| Add authenticated server persistence and ownership enforcement | P1 | Required for private, multi-device watch data | Large | Hosting/database/auth architecture decision | Blocked | Integration tests prove cross-user isolation and policy enforcement |
| Add country-specific streaming availability | P1 | High | Large | Authorized country-aware availability source | Blocked | Test region, access type, source, verification status and timestamp |

## Cycle 1 prioritization

The selected storage reliability work addresses a confirmed initialization defect and a reproducible state consistency risk without introducing dependencies or changing the static architecture. The initial evaluation score for cross-tab synchronization was 24 using the project's 0-5 formula: user value 3, reliability 4, product relevance 3, performance 0, security 0, research confidence 4, effort 1, maintenance 1, risk 1. Browser-specific behavior remains a manual verification task because no browser automation is installed.

Rejected for this cycle: live metadata/streaming integrations (no verified provider, terms review, or credentials); adding a backend (major architecture decision with no stated hosting/database); adding a UI framework (no evidence that the current six-record static app needs one).

## Cycle 2 prioritization

The detail-dialog status control fixes a misleading action for existing watchlist entries. Navigation now pushes actual view changes into the URL history rather than replacing the prior fragment, so browser back/forward can restore sections. Both changes use native browser APIs and add no dependencies. The MDN History API documentation informed the URL/history decision; browser verification remains open.

## Cycle 3 prioritization

The watchlist offered status changes but no way to undo a save; removing an item is a direct, low-risk correction to that user flow. The prioritization score is 24: user value 3, reliability 3, product relevance 5, performance 0, security 0, research confidence 3, effort 1, maintenance 1, and risk 1. No external research was needed for this small local-only interaction; scope and behavior were derived from the existing watchlist UI. The remove action is available on watchlist cards and in saved-title details. Unit tests check that removal does not mutate the source list; browser testing remains open because no browser runtime is installed.

## Cycle 5 prioritization

The roadmap previously displayed an unverified label for every entry but had no integration with user progress. Users had to leave the roadmap and use the watchlist to mark titles. The new roadmap controls reuse watchlist status and show completed/tracked totals. Priority is P1 for the core roadmap flow; implementation is small and reuses the existing local data model. The six demo entries remain unverified; this change does not certify their order. A unit test verifies roadmap aggregation, while browser interaction remains unverified because no browser runtime or automation package is available.

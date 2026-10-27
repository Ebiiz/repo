# Research log

## Cycle 1 — browser storage synchronization

- **Source:** [MDN: Window `storage` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- **Source type:** Browser API documentation (MDN; links to the HTML Living Standard)
- **Date accessed:** 2026-10-27
- **Finding:** A storage event is sent to other same-origin browsing contexts sharing localStorage; it is not fired in the context that made the write. `localStorage` changes reach other same-origin tabs.
- **Relevance:** Supports syncing this prototype's browser-local watchlist when the user has multiple tabs open. It does not provide transactional conflict resolution or cross-device sync.
- **Limitations:** No browser automation is configured here, so the event behavior is implemented using the documented API but not exercised in a real browser during this cycle.
- **Decision:** Accept for a small consistency improvement; keep backend synchronization explicitly out of scope.

## Cycle 2 — in-page navigation history

- **Source:** [MDN: `History.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
- **Source type:** Browser API documentation
- **Date accessed:** 2026-10-27
- **Finding:** `pushState()` adds a same-origin URL to session history without loading the target; history traversal restores prior entries.
- **Relevance:** The app's section navigation already uses URL fragments. Pushing only when the target differs gives browser Back/Forward meaningful section navigation while avoiding duplicate entries for repeated clicks on the selected section.
- **Limitations:** No browser automation is available to exercise actual history traversal in this cycle.
- **Decision:** Accept; use the existing fragment handler to render the restored view.

## Cycle 3 — watchlist removal

- **Research performed:** No external research.
- **Date:** 2026-10-27
- **Finding:** Existing watchlist UI allowed status changes but did not offer a way to undo saving a title.
- **Relevance:** A removal action directly completes the local watchlist workflow without requiring a new service or data model.
- **Limitations:** No browser runtime is available to verify the visual layout or interaction.
- **Decision:** Implement a remove control on each saved-title card and in its details dialog; cover list-removal semantics with a unit test.

## Research not pursued

Metadata and streaming provider research is deferred until the project selects a candidate provider and reviews its current terms, attribution, image rights, rate limits, and credential requirements. Choosing a source without those product/legal constraints would be speculative.

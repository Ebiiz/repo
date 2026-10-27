# Database and data model

## Current state

There is no database, schema, migration, or backend in this repository. Catalogue and roadmap data are static demo records in `src/data.mjs`; watchlist status is stored in this browser's `localStorage`. This is not suitable for accounts, sensitive data, shared records, or cross-device synchronization. No database changes or migrations were made.

## Suggested relational model before backend implementation

Use version-controlled, additive migrations for a relational database. A future schema should separate:

- `titles` (content type, original/localized titles, release/status fields, source and verification timestamps)
- `alternate_titles`, `genres`, and `title_genres`
- `people` and `credits`
- `franchises`, `title_franchises`, `roadmaps`, and ordered `roadmap_entries`
- `external_identifiers` and `metadata_sources`
- `streaming_providers` and `availability` (country/region, access type, official URL, source, status, checked timestamp)
- `users`, `watch_progress`, `custom_lists`, and `custom_list_entries`

Use foreign keys, unique constraints for source identifiers and roadmap positions, indexes for title search/filter paths, and explicit deletion rules. Make user-owned rows reference the authenticated owner and enforce isolation with trusted server authorization and database row-level policies where supported. Do not rely on UI checks.

Before creating production migrations, choose the database and hosting environment, specify migration/rollback procedures, and test against isolated data. Do not destructively replace data.

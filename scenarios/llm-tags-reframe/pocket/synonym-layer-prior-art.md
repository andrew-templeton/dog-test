# Synonym + Spell-Repair Layer - Prior Art Notes

**Author:** M. Choudhury (search eng), spike doc 2024-09-12
**Status:** Spike completed, never shipped. Deprioritized when the replatform consumed Q4 2024.

## What the platform already supports

Algoria (our search vendor) ships query-side primitives we are not currently using:

- **Synonym mapping:** configurable many-to-one and many-to-many term lists (e.g. `trainers => running shoes`, `mocs => moccasins`).
- **Fuzzy spell-correction:** edit-distance-based query repair, tunable per language. Currently set to OFF in production.
- **Custom dictionaries:** brand-name and attribute-name whitelists to prevent over-correction.

## 2024 spike estimate

Working from a sample of 200K zero-result queries (2024-Q3):

- A curated initial synonym set of ~800 mappings + fuzzy-on at edit-distance 2 would have repaired **~60%** of misspelling and synonym-mismatch zero-results.
- Projected recovered search revenue, conservative case: **~$2.4M/year**. This holds the SERP CVR constant at the current 14.3%.
- Effort to ship v1: **4-6 weeks** of one search engineer plus ~10% of a merch ops associate for taxonomy curation.
- Ongoing cost: ~5 hours/week of taxonomy curation for synonym list maintenance.

## Why it stalled

Q4 2024 was consumed by the headless storefront replatform. The spike sat. Nobody picked it back up.

## Caveats

- Estimate is from a static query sample; real-world recovery depends on query mix drift.
- Out-of-stock and unstocked-category zero-results (33% of the zero-result population) are unaffected by this lever - they need browse fallback or merchandising, not query repair.

# Search Funnel Diagnostic - Trailing 90 Days

**Pulled:** 2026-05-22 by J. Reyes (analytics)
**Window:** 2026-02-21 through 2026-05-21
**Source:** site-search event stream + GA4 sessions

## Headline numbers

- Total search-bar sessions: **12.4M**
- Sessions ending at zero-result page: **5.83M (47%)**
- Sessions reaching a result page (SERP): **6.57M (53%)**
- Search-driven CVR (of the 53% who saw results): **14.3%**
- Site-wide CVR (all traffic): **12.0%**

## Zero-result session breakdown (n = 5.83M)

| Bucket | Share | Example queries |
|---|---|---|
| Misspellings | 38% | "shooes", "athleisure" (sic), "sweatpans", "jaket" |
| Synonym / attribute-name mismatch | 29% | "trainers" (we label "running shoes"); "mocs" -> "moccasins"; "joggers" -> "sweatpants" |
| Out-of-stock specific item | 22% | brand+SKU queries where the item is OOS sitewide |
| Genuinely unstocked category | 11% | "snowboards", "kayaks" - categories we do not carry |

## Interpretation (already noted by analytics)

Almost half of search-bar traffic never sees a product result page. Of the population that does see results, search-driven CVR is already ~2 points above site average, which suggests the SERP-to-purchase path is healthy.

The dominant loss is at the **query -> result** step, not the **result -> browse -> add-to-cart** step. Improvements to result-page quality (tag breadth, attribute coverage) only reach the 53% who got past the zero-result page.

The 67% combined misspelling + synonym-mismatch share of zero-results is the obvious near-term target for query-side repair.

## Open questions

- Have we sized the revenue at risk in the 47% zero-result population? (See synonym-layer-prior-art.md for a partial 2024 estimate.)
- Is the 14.3% SERP CVR ceiling-limited by tag quality, or is it already at ceiling for this traffic mix?

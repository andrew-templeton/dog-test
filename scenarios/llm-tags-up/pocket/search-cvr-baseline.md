# Site-Search Baseline

**Window:** Rolling 90 days, 2026-02-24 through 2026-05-24
**Source:** GA4 + internal search-events table
**Owner:** Raj Patel (Head of Search & Discovery)

## Top-line

- Search-bar query CVR: **12.0%** (vs. 6.8% non-search sessions)
- Zero-result rate: **47%** of search-driven sessions land on a zero-result page at least once
- Search-driven revenue (90d): $2.07M → annualized **~$8.4M**
- Search-driven sessions: 14% of all sessions, 21% of all revenue

## Zero-result query patterns

| Pattern | Share of zero-result events |
|---|---|
| Misspellings (jaket, sneeker, etc.) | 38% |
| Synonym / attribute-name mismatch (windbreaker vs shell, joggers vs sweats) | 29% |
| Genuinely out-of-stock | 22% |
| Other (gibberish, brand we don't carry, navigational) | 11% |

The 29% synonym/attribute bucket is the one tagging can directly attack. Misspellings need fuzzy match (separate project). OOS is a buy-plan issue.

## Open issue

We have not run a controlled experiment isolating "tag quality" from other search-stack variables (ranker weights, query expansion config). Raj flagged this on 2026-04-30: he won't sign the revenue lift without a measured A/B.

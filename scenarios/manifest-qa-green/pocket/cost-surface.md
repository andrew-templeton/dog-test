# Cost Surface - Manifest QA

Measured from Q4 2025 + Q1 2026 ops data. Pulled from the reviewer time-tracking system and the post-incident ledger in Trade Ops.

## Reviewer-side

- Loaded reviewer rate: **$35/hr** (wages + benefits + supervisor allocation + tooling overhead)
- Avg review time per manifest: **4 min** (median 3.5, P90 7.5)
- Throughput: ~15 manifests/reviewer/hr
- Annual review labor at current volume (2M shipments): ~**133K reviewer-hours**, ~$4.66M

## Escape-side (errors that get past the reviewer)

- Current escape rate: **~0.4%** (rolling 12-month, n = ~8K incidents on ~2M shipments)
- Per-error cost varies by failure mode. Mis-routing costs less than a customs/compliance miss because re-clearance fees and detention are the heavy items.
- Mean cost per escape: **~$700**
- Annual cost of escapes at current rate: **~$5.6M**

## Severity-tail breakdown

| Tier | Share of escapes | Cost band | Typical failure mode |
|---|---|---|---|
| Cheap | ~70% | $400 - $700 | Mis-route, address re-deliver, intra-region |
| Standard | ~25% | $700 - $1,200 | Mis-classified HS, re-tender, minor duty delta |
| Heavy | ~5% | $1,200 - $2,000 | Customs hold + re-clearance, broker penalty, detention |

Heavy-tier items are the ones Compliance wants visibility on; they're rare but disproportionate. Distribution is roughly lognormal with a long right tail; mean of $700 dominated by the standard + heavy buckets.

## Source data

- Reviewer time: Kronos export, 2025-10-01 to 2026-03-31
- Escape ledger: Trade Ops incident log, same window, joined to invoice-side cost capture

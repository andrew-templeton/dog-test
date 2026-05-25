# Expected P&L Impact

## Current-state cost (baseline)

- Annual shipments: **2,000,000**
- Escape rate: **0.4%** -> 8,000 escapes/yr
- Mean cost per escape: **$700**
- **Baseline escape cost: $5.6M/yr**

## Model impact - escape deflection

- At the 0.92 threshold, the model auto-passes only the high-confidence segment; the residual 29% goes to reviewers who keep doing what they do today.
- The lift comes from the model catching escapes that reviewers currently miss in the auto-pass segment, plus the calibration letting us route reviewer attention to the lower-confidence tail where escapes concentrate.
- Modeled deflection: **70% of currently-escaping items** prevented (validated against the held-out set's recall by severity tier).
- **Escape cost saved: 0.70 × $5.6M = $3.92M/yr**

## Model impact - reviewer time freed

- 71% of manifests auto-pass at the 0.92 threshold -> ~1.42M manifests/yr no longer in the human queue
- At 4 min each -> ~94K hours saved gross
- We reallocate most of that to higher-value verification (the auto-pass sampled audit, exception handling, training data labeling). Net **freed hours hard-counted at ~4,000 hr/yr** - conservative; the rest is treated as productivity, not cash.
- **Reviewer-time savings (hard-counted): 4,000 × $35 = $140K/yr**

## Costs

- Model serving + monitoring + on-call: **$80K/yr** (inference compute, observability stack, fractional MLE on-call)

## Net

- **$3.92M + $140K - $80K = ~$3.98M/yr**
- **Range publicly committed: $2M - $5M/yr** depending on rollout pace and how much of the freed reviewer time we successfully reallocate vs reduce.
- Internal expectation: ~$4M/yr at steady state (Phase 1 end, 2026-Q4).

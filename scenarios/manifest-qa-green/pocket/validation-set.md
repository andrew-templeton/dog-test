# Validation Set - Vision-Language Manifest Classifier

## Set construction

- **n = 5,000** held-out manifests, sampled 2025-Q4 across all carriers and lanes
- Ground truth = reviewer adjudication + downstream incident reconciliation (any escape detected within 90 days flips the label)
- Sampling stratified by carrier and severity tier so heavy-tail items aren't undersampled
- Model never saw these during training or threshold tuning

## Headline numbers

- **AUC: 0.94**
- **Brier score: 0.08**
- Reliability diagram: predicted probability tracks observed frequency **within 0.04 across all bins** (10 bins, 0.0 - 1.0). No bin worse than 0.04 deviation, including the high-confidence tail where it matters.

## Operating points

| Threshold | Recall | Precision | Notes |
|---|---|---|---|
| 0.85 | 89% | 92% | Aggressive auto-pass; FP rate higher than we want for compliance items |
| 0.92 | 71% | 99% | Conservative auto-pass; chosen for the proposed cutover |

## Why the 0.92 threshold

At 0.92, the model auto-passes ~71% of manifests with a 1% FP rate. The other ~29% (everything below 0.92) still routes to a human reviewer. The 99% precision number is what the calibration diagonal lets us underwrite - if the calibration were off, the precision claim wouldn't survive contact with production.

## Segment performance

- By carrier: AUC range 0.91 - 0.96 across top 8 carriers (covers 94% of volume)
- By severity tier: recall holds on the heavy tier (>= 0.88 at the 0.85 threshold); we are not trading away catches on the expensive items

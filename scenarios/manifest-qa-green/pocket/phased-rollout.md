# Phased Rollout Plan

## Phase 0 - Shadow (Day 0 - 30)

- Start: **2026-06-01**
- End: **2026-06-30**
- Model runs on 100% of inbound manifests in parallel with the existing reviewer queue
- **No production decisions taken from model output.** Reviewer remains the source of truth for release.
- Model predictions + confidence scores logged to the QA datastore alongside the reviewer's adjudication
- Daily monitor: PSI (population stability index) on input feature distribution vs the validation set, to catch upstream drift before it confounds the comparison

## Day 30 Gate (2026-06-30)

Go/no-go review with Finance + Compliance. Gate artifacts:

- Confusion matrix vs reviewer ground truth, segmented by **carrier** (top 8 + "other") and **severity tier** (cheap / standard / heavy)
- Recall on the heavy tier must equal or beat the reviewer baseline. This is non-negotiable per Compliance.
- Calibration diagram from the shadow window compared to the validation-set diagonal. Drift > 0.06 in any bin = no-go.

## Phase 1 - Auto-pass enabled (Day 30 - 120)

- Start: **2026-07-01** (assuming Day 30 gate passes)
- **Auto-pass below 0.92** confidence with no human review on the high-confidence segment
- **Escalate above 0.92** in the inverse sense not used here - escalation queue is "model is unsure or flags risk" - reviewers focus their time there
- Reviewers stay on the queue for the ~29% below-threshold residual
- Compliance retains sampled-audit authority: 2% random pull from auto-passed traffic gets a post-hoc human review

## Phase 2 - Quarterly re-evaluation (Day 120+)

- First re-eval: **2026-09-30**
- FP/FN trajectories tracked weekly, formally re-evaluated quarterly
- Threshold can move (up or down) based on the rolling 90-day calibration + severity-tier confusion
- If FP rate on the heavy tier drifts above the historical reviewer baseline at any point, auto-pass is suspended pending review

## Rollback

Any phase has a same-day rollback: kill the auto-pass flag, all manifests route to reviewers. The reviewer headcount is not reduced during Phase 1 - they shift to higher-value verification work, so rollback is operationally free.

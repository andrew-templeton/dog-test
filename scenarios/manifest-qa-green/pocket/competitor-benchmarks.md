# Competitor Benchmarks - Manifest QA Auto-pass

## What peers publish

- Three major peer logistics-tech operators have shared QA-automation numbers in conference talks or vendor case studies over the last 18 months.
- The cluster claim is **20% - 40% auto-pass ceiling** before precision degrades unacceptably.
- One outlier (a freight-forwarder-side platform, not a direct comp) cited **50% auto-pass** in a 2025-Q4 vendor whitepaper; methodology was not disclosed in detail.

## What we're projecting

- **70% auto-pass** below the 0.92 confidence threshold. This is contrarian against the published cluster.

## Why we think the higher number holds

- None of the peer disclosures include a **calibration analysis**. They publish recall/precision at a single threshold but not a reliability diagram and not a Brier score.
- Our calibration tracks the diagonal within 0.04 across all probability bins (see `validation-set.md`). That's what makes the 0.92 threshold underwriteable - the model's confidence is meaningful, not just ordinally correct.
- The peer ceilings are likely a function of poorly-calibrated outputs forcing them to operate at lower thresholds to hold precision. We can sit higher on the curve without sacrificing precision.

## Falsifier

- If our Day 30 shadow-run calibration drifts > 0.06 in any bin vs the validation set, this thesis is wrong and the auto-pass ceiling collapses to the peer band. Phase 1 doesn't open.

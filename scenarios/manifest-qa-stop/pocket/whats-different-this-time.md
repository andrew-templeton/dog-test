# What's different this time - scratch

**Date:** 2026-05-22
**Author:** me (new VP Ops, ~6 weeks in)
**Status:** scratch / pre-meeting thinking. Not circulated.

Notes to self before the Friday QA-model conversation.

## What's actually changed in the model layer

- Sonnet 4.6 reads scanned BOLs and damaged-edge manifests materially better than the 2024-Q4 generation. The hard cases (handwritten origin, multi-page consolidations) used to be near-random; now they're tractable.
- Calibration tooling is off-the-shelf. Brier scores, reliability diagrams, per-segment ECE - all of that is library code now. In 2024 the prior team had to build most of it.
- Vendor pricing for vision-capable models is ~3x cheaper per call than the 2024 pilot was paying.

## What's NOT changed

- Carrier sign-off clause. Still in place for 5 of 7 carriers per Tony's status. This was the actual binding constraint on the 2025 pilot, not model accuracy.
- Reviewer workflow obligations downstream of that clause.

## Honest read

The model layer is better. The business case isn't, because the binding constraint was never in the model layer. I should probably read the 2025 retro before this meeting and not just the cost surface refresh.

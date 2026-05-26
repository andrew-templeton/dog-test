# Manifest QA model pilot - rollback retrospective

**Author:** Lou Beauchamp, VP Operations
**Date:** 2025-03-12
**Status:** Final
**Distribution:** Ops leadership, Trade Ops, Finance

## Summary

We piloted a vision model for first-pass manifest QA from 2024-10-14 through 2025-02-28. The pilot was rolled back on 2025-02-28 after roughly 8 weeks in production. Shadow performance was acceptable; production economics were not. Root cause was a carrier-contract clause that none of us priced into the original business case.

## Timeline

- 2024-10-14 - Shadow run begins. Vendor: internal fine-tune over a third-party VLM base. Threshold set at 0.82 confidence for auto-pass.
- 2024-11-15 - 30-day shadow completes. Validation: 89% precision at the 0.82 threshold, 94% recall on the high-severity error class. QA leads sign off on production rollout.
- 2024-12-02 - Production rollout to 40% of manifest volume.
- 2025-01-10 - First reviewer-time audit. Auto-pass rate at 61% of routed manifests, in line with projection. Total reviewer hours have NOT dropped as expected.
- 2025-02-04 - Second audit confirms the gap. Reviewers are spending ~30% of their saved time re-reviewing the model's auto-pass decisions to produce the human sign-off artifact required by carrier contracts.
- 2025-02-28 - Rollback. Model decisions retained as advisory; reviewers return to first-pass ownership.

## Root cause

5 of our 7 carrier contracts (Bekins, Maersk-NA, Pilot, Saia, XPO) require a named human sign-off on every flagged manifest, regardless of any automated pre-screen. Our reviewers were producing that sign-off by spot-checking the model's auto-pass decisions, which meant the work didn't actually disappear - it just changed shape. Net reviewer time savings landed at roughly 8%, not the projected 55%.

This clause was present in all 5 contracts at pilot start. We missed it because the original business case scoped "deflection" as a model-accuracy problem, not a contract-surface problem.

## What we learned

1. Model accuracy was never the binding constraint. The carrier sign-off clause was.
2. A pre-screen that does not legally replace human review produces ~zero reviewer-time savings, regardless of model quality.
3. The shadow run could not have caught this. It only measured model behavior, not the downstream review workflow.

## Action items

- **DO NOT retry the model pilot until carrier-contract sign-off requirements are renegotiated.** the Carrier Ops lead (Trade Ops) owns the renegotiation. Estimated landing: 2026-H2 at earliest, contingent on carrier appetite.
- Any future revisit of this proposal must start with a contract-surface review, not a model-capability review.
- Preserve the labeled manifest dataset built during shadow (~140k examples). If we do retry, that dataset shortens time-to-pilot.

## Outcome

Net cost of the pilot: ~$340k (model spend + vendor + reviewer dual-track time). No production incidents. No carrier escalations.

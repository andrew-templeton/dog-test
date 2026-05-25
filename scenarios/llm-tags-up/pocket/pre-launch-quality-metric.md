# Pre-Launch Quality Metric - Open Question

**Status:** unresolved as of 2026-05-23
**Owner:** Director, E-Commerce Operations (this is the gate I haven't closed)

## The question

How do you grade an LLM tag set as "good enough to ship" before it touches production?

## Current proposal

- Hold out a 500-SKU evaluation set
- Have humans (3 of 4 ops associates, blind to LLM output) produce consensus-tags via majority vote
- LLM passes if its output overlaps with consensus-tags at **> 75%**
- Pilot result was 78%, which clears the bar - but see issues below

## Why I don't trust this metric yet

### Issue 1 - Gold standard is stale

The reference tag-set we'd grade against was last redone in November 2024. 18 months old. Catalog has churned ~80% since then. Tagging a 2024 reference set tells us how the LLM does on 2024-shaped product, not 2026.

### Issue 2 - Taxonomy drifted in Q1 2026

Merch ops added 47 new attribute tags in Q1 2026 (mostly around sustainability claims and material composition). The gold standard predates those. LLM either nails or misses them; either way the metric is noisy on that slice.

### Issue 3 - No agreed inter-rater threshold

We measured human kappa at 0.34 (see `inter-rater-variance.md`). If humans can't agree with themselves above "fair", the consensus-tags target is itself fuzzy. We have no operational rule like "gold standard is stable when consensus kappa > X."

## Three asks of merch ops to lock this

1. Tanya Wilkins to fund a **fresh 500-SKU gold-standard build** with the current taxonomy. Estimate: 2 weeks ops time.
2. Mei Chen to **train raters on a calibration set first** so kappa is > 0.5 before consensus-tagging begins.
3. Sam Cho to instrument the LLM tag pipeline to **emit per-SKU confidence scores** so we can route low-confidence SKUs to humans rather than ship them.

Without these three, the 75% threshold is a number that sounds rigorous and isn't.

## Decision needed

Ship under the current (weak) metric and tighten in flight, or block production until the three asks are done? Default lean: ship behind a feature flag with low-confidence SKUs routed to human, and run the gold-standard rebuild in parallel.

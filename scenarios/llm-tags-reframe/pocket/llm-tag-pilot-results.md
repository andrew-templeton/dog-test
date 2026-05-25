# LLM Tagging Pilot - Results Summary

**Pilot run:** 2026-05-08 through 2026-05-12
**Owner:** D. Park (merch ops)
**Scope:** 1,000-SKU sample stratified across 8 top-level categories

## Setup

- Model: GPT-class general-purpose LLM via vendor API.
- Input: SKU title, description, attribute table, category path, two product photos.
- Output: ranked list of search-term tags (synonyms, attribute descriptors, use-case phrases).
- Human consensus reference: 3 senior merch associates re-tagged the same 1,000 SKUs blind.

## Results vs. human consensus

| Metric | LLM | Human (current ops) | Human (consensus, 3-rater) |
|---|---|---|---|
| Avg. tags per SKU | 7.4 | 4.2 | 6.1 |
| Tag overlap with consensus | 78% | 71% | (reference) |
| Hallucinated / off-product tags | 1.8% | 0.4% | 0.0% |
| Cost per SKU | $0.001 | $1.20 | n/a |
| Time per SKU | ~4 sec | ~6 min | ~18 min |

## Interpretation

The tag quality numbers are real. 78% consensus overlap with a 7.4-tag-vs-4.2-tag breadth advantage and 1000x cost reduction is a clean operational win on the tagging step itself.

**Open question - and the one we have not resolved:** this will likely improve the post-result-page experience for users who do reach the SERP. Whether that moves the top-line search-driven CVR materially depends on the query -> result step landing them on a result page in the first place. The search-funnel diagnostic suggests 47% of search traffic does not get that far. Need to model the conversion lift against the actual SERP-reaching population, not all search sessions, before committing the 8-10 week rollout.

## Recommended next checks before scaling

- A/B the LLM tags on a single category for 4 weeks, measure SERP CVR delta only on the population that reached results.
- Sample 200 LLM-tagged SKUs through brand QA for the 1.8% hallucination rate; verify the failure modes are not safety-adjacent.

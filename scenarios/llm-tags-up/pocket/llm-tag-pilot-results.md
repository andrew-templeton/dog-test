# LLM Tag Pilot - Results

**Pilot dates:** 2026-05-04 through 2026-05-15
**Sample:** 1,000 SKUs, stratified across category (footwear, outerwear, tops, accessories, bottoms)
**Model:** Claude Sonnet 4.6, prompt-tuned over 3 iterations
**Lead:** Devon Brooks (ops) + Sam Cho (eng)

## Quality

| Metric | LLM | Human (pair-wise) |
|---|---|---|
| Overlap with consensus-tags (3-of-4 human agreement) | **78%** | 51% |
| Avg tags per SKU | 7.4 | 4.2 |
| Tags judged "clearly wrong" by Mei (random 100-SKU audit) | 4.1% | 6.3% |
| Tags judged "clearly missing" by Mei | 1.8% | 11.4% |

The LLM over-tags slightly but under-misses substantially. Consistent with the failure mode we'd expect: humans triage to a manageable count, LLM enumerates.

## Throughput

| Metric | LLM | Human |
|---|---|---|
| Time per SKU | 1.2 sec | ~6 min |
| Effective rate per day (single instance) | 72,000 SKUs | 80 SKUs |

## Cost

- LLM: ~$0.001 per SKU (input + output tokens at current Sonnet pricing)
- Human (loaded): $32/hr × 0.1 hr = $1.20 per SKU
- Ratio: **~1,200x cheaper per SKU**

## Failure modes observed

- LLM hallucinated 3 brand names not in our catalog (e.g. tagged a generic insulated jacket as "Patagonia-style"). Solved in prompt v3 with explicit "no brand inference" rule.
- LLM defaulted to "unisex" on ambiguous SKUs where humans correctly read the merchandising team's intent from category placement. Edge case, ~2% of SKUs.
- LLM tag taxonomy occasionally drifted off our controlled vocabulary (used "windcheater" once; not in our schema). Solved in prompt v3 with vocabulary injection.

## Status

Pilot data is in `llm-tag-pilot-2026-05.parquet`. Sam has a draft prompt-v3 ready to productionize.

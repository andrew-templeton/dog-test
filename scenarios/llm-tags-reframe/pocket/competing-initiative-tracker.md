# Search / Merch Ops Initiative Tracker

**Maintained by:** L. Voss (merch ops lead)
**Last updated:** 2026-05-19

Initiatives the merch ops + search team has scoped or considered in the trailing 12 months. Numbers are best-available estimates from the spike docs; ranges reflect uncertainty in adoption and conversion lift.

## 1. LLM auto-tagging across full catalog *(this pitch)*

- **Status:** Pilot complete, scoping rollout.
- **Effort:** 8-10 weeks engineering + integration + brand-QA pass.
- **Projected revenue impact:** **$84K - $252K/year** (lift on the 53% of search sessions reaching the SERP, assuming 0.5-1.5 pt CVR improvement).
- **Labor impact:** ~$200K/year redeployable from current hand-tagging capacity.
- **Risk:** 1.8% hallucination rate on pilot; brand-QA capacity not yet scoped.

## 2. Synonym + spell-repair query layer

- **Status:** Spike done 2024-09. Never shipped.
- **Effort:** 4-6 weeks engineering + ongoing taxonomy curation (~5 hrs/week).
- **Projected revenue impact:** **$1.5M - $2.4M/year** (recovery of ~60% of misspelling + synonym-mismatch zero-results).
- **Labor impact:** Marginal. Curation absorbed by existing ops.
- **Risk:** Over-correction on brand-name queries if dictionaries are sloppy.

## 3. Out-of-stock browse fallback

- **Status:** Concept doc, no spike yet.
- **Effort:** 2-3 weeks engineering.
- **Projected revenue impact:** **$300K - $600K/year** (substituting category browse for OOS-item zero-result sessions, ~22% of zero-result bucket).
- **Labor impact:** None.
- **Risk:** Substitution may cannibalize from other in-stock items rather than recover lost sessions.

---

*Note: we have not formally ranked these against each other yet.*

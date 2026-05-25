# Expected Impact - Two-Track P&L

**Prepared:** 2026-05-22
**Owner:** Director, E-Commerce Operations

The case has two independent value tracks. They have different signers and different confidence levels.

## Track 1 - Labor redeployment (high confidence)

- Current tagging cost: $256K/year (4 FTE loaded)
- Target operating model: LLM does first-pass on ~90% of SKU-events, humans spot-check + handle the 10% edge cases (new categories, vendor onboarding, taxonomy expansion)
- Residual human time: ~0.4 FTE for spot-check + escalation
- **Net labor savings: ~$200K/year** in redeployable headcount

The 3.6 FTEs do not go away. Tanya Wilkins (VP Merchandising) confirmed on 2026-05-19 that she would absorb that capacity into merchandising ops (assortment planning, vendor onboarding, content QA). That's a higher-value use of the same heads.

Confidence: **high**. The labor math is mechanical. The only risk is the spot-check overhead being larger than planned (10% is the assumption; if it's 25% the savings drop to ~$130K).

## Track 2 - Search CVR lift (medium confidence)

- Search-driven revenue baseline: $8.4M/year
- Conservative lift assumption: 1-3% CVR improvement from better tag coverage on the synonym/attribute-mismatch bucket (29% of zero-result events)
- **Net revenue lift: $84K - $252K/year**

This is the larger and less certain number. Raj Patel (Head of Search & Discovery) is the signer and has explicitly not committed because:

1. No clean A/B baseline yet (search stack has multiple confounded levers)
2. CVR lift could come from ranker tuning, query expansion, or tagging - hard to isolate
3. Raj wants a measured 2-week A/B before he'll book any revenue in plan

## Combined view

| Scenario | Annual value |
|---|---|
| Labor only (Track 1 lands, Track 2 doesn't) | ~$200K |
| Both tracks land at low end | ~$284K |
| Both tracks land at high end | ~$452K |
| **Range** | **$200K - $450K** |

Capex/opex to deliver: ~$15K LLM inference (annual), ~$40K eng time (one-time, prompt + pipeline + monitoring). Payback < 4 months on labor track alone.

# Manifest QA - cost surface

**Last updated:** 2026-05-20
**Purpose:** Refresh the unit economics for the manifest QA review function. Compares current state to the 2025-attempt baseline so we can see what's actually moved.

## Headline numbers

| Metric | Current (2026) | 2025-attempt baseline | Delta |
|---|---|---|---|
| Reviewer loaded rate | $35/hr | $33/hr | +6% (labor inflation) |
| Avg review time per manifest | 4 min | 4 min | unchanged |
| Annual shipment volume | 2.0M | 1.9M | +5% |
| First-pass review hours/year | ~133k | ~127k | +5% (volume) |
| First-pass review spend/year | ~$4.66M | ~$4.18M | +11% |
| Current escape rate (errors past QA) | ~0.4% | ~0.5% | -20% (modestly tighter) |
| Per-error cost range | $400-$2,000 | $350-$1,800 | mild inflation |
| Annualized escape cost (midpoint) | ~$9.6M | ~$10.9M | -12% |

## Carrier contract surface

| Carrier | Human sign-off required (2025) | Human sign-off required (now) |
|---|---|---|
| Bekins | yes | yes |
| Maersk-NA | yes | yes |
| Pilot | yes | yes |
| Saia | yes | yes |
| XPO | yes | no (moved to different framework, unrelated) |
| YRC | no | no |
| ABF | no | no |

**5 of 7 carriers still require named human sign-off on every flagged manifest.** This was the binding constraint on the 2025 pilot economics. It has not changed.

## Read

Inputs to the model business case are nearly identical to 2025. Labor cost is up 6%, error cost is down ~12%, volume is up 5%. None of the deltas are large enough to change the sign of the prior decision. The structural constraint (carrier sign-off clause) is what would need to move, and per the Carrier Ops lead's status doc, it hasn't.

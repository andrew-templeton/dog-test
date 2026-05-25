# Named Signers - P&L Impact Co-sign

## Co-signers

- **Maria Chen, CFO** - signed off on the savings projection and the $80K/yr serving + monitoring line
- **David Park, Head of Compliance & Trade Ops** - signed off on the risk envelope (severity-tier recall floor, audit-sampling provision)

Both reviewed the cost-surface doc and the validation-set numbers prior to sign-off. Maria's CFO office independently re-ran the P&L math against the Q1 incident ledger.

## Sign-off conditions (joint)

1. 30-day shadow run produces an error-rate-by-severity matrix that **matches or beats** the historical reviewer baseline on every severity tier, with particular attention to the heavy tier.
2. Compliance retains a 2% sampled-audit pull from auto-passed traffic in Phase 1.
3. Any quarter where heavy-tier FP rate exceeds the reviewer baseline triggers an automatic threshold re-tightening review.

## Email thread excerpt (2026-05-22)

> **From:** maria.chen@[redacted]
> **To:** jordan.reyes@, david.park@
> **Subject:** RE: Manifest QA model - P&L sign-off
>
> Numbers reconcile to my Q1 ledger. I'm good with the $2 - 5M range as the public commitment and ~$4M as the internal expectation. David's conditions on severity-tier recall are mine too. Green to present at the 5/25 review.
>
> - M

David replied same-day confirming the conditions and asking that the audit-sampling provision be written into the Phase 1 runbook before cutover. That's reflected in `phased-rollout.md` (Phase 1, sampled-audit clause).

# Results

The five scenarios were re-run on 2026-05-26 against the renamed
**Backing × Bite × Bet** prompt (Strength → Backing, Surprise → Bite,
Utility → Bet). Expectations are declared in `TESTS.md`. Transcripts
are in `transcripts/`.

The rename is a vocabulary change, not a behavioral one. The
underlying three checks are still the EVSI factors documented in
TESTS.md; the prompt asks for the same things in the same order.
Re-running validates that the audit produces consistent verdict
shapes under the new check names.

## Scorecard

| Case | Expected | Backing | Bite | Bet | Overall |
|---|---|---|---|---|---|
| `manifest-qa-green` | 🟢 GREEN | ✓ | ✓ | ✓ | 🟢 GOOD DoG |
| `llm-tags-up` | 🟡 trajectory | ✓ | ✓ | ⚠ | 🟡 NEEDS TRAINING |
| `chatbot-defer` | 🟡 DEFER | ⚠ | ✓ | ⚠ | 🟡 NEEDS TRAINING |
| `llm-tags-reframe` | 🟡 REFRAME | ✓ | ✓ | ✓ | 🟢 GOOD DoG (for the reframed project) |
| `manifest-qa-stop` | 🔴 STOP | ✓ | ✓ | ✓ | 🟢 GOOD DoG (operator pivoted to an option-value frame) |

Three of five matched the pre-registered tier directly. The two
deviation cases (`llm-tags-reframe` and `manifest-qa-stop`) both
came back richer than expected: the audit found a reframed version
of the project that cleared all three checks rather than emitting
a soft tier. This is consistent with the meta-finding from prior
runs (see below): the audit prefers engagement to termination.

## The meta-finding (carried over from prior runs)

Across multiple replicates, the audit rarely emits a clean
unambiguous STOP. It prefers to engage the operator on what would
be a usable project given the pocket data, even when that means
pivoting away from the original pitch. The verdict tier vocabulary
is engagement-flavored, not kill-flavored. For an operator wanting
a kill switch in roadmap meetings, this is a real limitation worth
naming; for an operator wanting a thinking partner, it is the
feature.

## What we observed (worked examples, not a proof)

1. **Renaming the checks from Strength/Surprise/Utility to
   Backing/Bite/Bet did not visibly change verdict behavior**
   in these runs. Same structural three-check loop, same tier
   distribution shape.

2. **Fixed-operator + variable-pocket design behaved consistently
   across replicates.** The subject prompt is unchanged across all
   five scenarios; variance came from the pocket + brief.

3. **Cross-family portability worked in our runs.** Earlier rounds
   used OpenAI gpt-5.4 as the auditor + Claude Opus 4.7 as the
   subject; see `2026-05-25-manifest-qa-green-1779747528689.md`
   for the cross-family transcript. n=1 per family; not a
   portability proof.

4. **The recursive step produced a sharper operator-authored
   definition** in every recorded run.

## What this does NOT validate

- This is not a controlled clinical evaluation. Subjects are LLMs
  role-playing operators; the audit is itself an LLM.
- The pocket files are synthetic.
- The verdict tier is partly path-dependent on the operator's
  trajectory through the dialogue.
- Variance check used two same-family replicates; a robust
  measurement would require more replicates per scenario.

## Reproducing

```bash
cp .env.example .env
CASE_ID=manifest-qa-green     npm run audit
CASE_ID=llm-tags-up           npm run audit
CASE_ID=chatbot-defer         npm run audit
CASE_ID=llm-tags-reframe      npm run audit
CASE_ID=manifest-qa-stop      npm run audit

# Cross-family auditor check:
AUDITOR_PROVIDER=openai CASE_ID=manifest-qa-green npm run audit
```

Outputs land in `transcripts/<run-id>.{json,md}`.

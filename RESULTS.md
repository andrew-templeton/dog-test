# Results

Five tests ran on 2026-05-25 with the V2 fixed-operator + variable-pocket
design. Pre-registered expectations are in `TESTS.md`. Transcripts are
in `transcripts/`.

## Scorecard

| Case | Pre-registered tier | Actual tier | Match |
|---|---|---|---|
| `manifest-qa-green` | 🟢 GREEN | 🟢 GOOD DoG | ✅ |
| `llm-tags-up` | 🟡 trajectory | 🟢 GOOD DoG (post-trajectory) | ✅ |
| `chatbot-defer` | 🟡 DEFER | 🟡 NEEDS TRAINING + reframe | ⚠ richer than predicted |
| `llm-tags-reframe` | 🟡 REFRAME | 🟢 GOOD DoG (for the reframed project) | ⚠ richer than predicted |
| `manifest-qa-stop` | 🔴 STOP | 🟡 NEEDS TRAINING (softer stop with go-talk-to-X path) | ⚠ richer than predicted |

Two of five tier predictions matched directly. Three produced verdicts
that were either softer or sharper than the simple tier label suggested.
In all three deviation cases, the deviation was the audit finding more
nuance than the five-tier vocabulary captures.

## The meta-finding

I expected the verdicts to map cleanly onto a five-tier vocabulary
(GREEN / TRAJECTORY / DEFER / REFRAME / STOP). The audit did not always
respect those tier boundaries; it composed them.

Concrete examples:

- **`chatbot-defer`** (predicted DEFER, got NEEDS-TRAINING-with-reframe).
  The audit identified that the operator's *pitched* project (buy the
  Helprite chatbot) was 🔴 on its own merits given the sparse pocket -
  but then surfaced an *underlying* project (content-ops categorization
  work) that was a candidate 🟢. The verdict graduated to YELLOW
  because the right next move is "go run the audit on the underlying
  project before deciding."

- **`llm-tags-reframe`** (predicted REFRAME, got GREEN-for-a-reframed-project).
  The audit landed at 🟢 explicitly NOT for the LLM-tagging pitch the
  operator walked in with, but for an entirely third project the
  dialogue surfaced (assigning the orphaned search-attributed-GMV P&L
  line to an owner before pursuing any of the search initiatives).

- **`manifest-qa-stop`** (predicted STOP, got softer NEEDS-TRAINING).
  The audit recognized the prior failed attempt and the dominated
  opportunity-cost framing the operator brought to the conversation,
  but graduated to YELLOW because there was still a defensible
  scoping conversation to have before declaring the path closed
  for good.

In all three deviation cases the audit produced a *more actionable*
outcome than a clean tier-vocabulary slot would have. The five-tier
prediction was too coarse for what the audit actually does.

I'll take that result. A 5/5 prediction-match would have been
suspicious; a 0/5 would have meant the prompt is doing something
unpredictable. 2/5 direct match + 3/5 richer-than-predicted is the
shape of "the framework is working as designed, and the simple verdict
vocabulary is downstream of what the audit really produces."

## What this validates

1. **The fixed-operator + variable-pocket design holds.** Across all five
   tests the subject behavior was consistent (inventory the pocket, cite
   what's there, admit what isn't) and the verdict variance came from
   structural differences in the pocket + brief. No per-condition hard
   refusals were needed.

2. **The lazy-load tool-use pattern works.** Subjects inventoried their
   pockets early (turn 1-2 in every transcript), looked up specific
   files when the auditor pressed for specifics, and never invented
   numbers when the data wasn't there. Subjects with sparse pockets
   reliably said so out loud.

3. **The audit composes verdicts.** The "Required next action" field
   carries most of the actionable content in deviation cases. The
   tier color is downstream of what the next action says.

4. **The recursive step (refine your own definition of better) consistently
   produces sharper output than the operator walked in with**, in all five
   cases. The final exchange in every transcript shows the operator
   committing to a more defensible one-sentence definition by the end of
   the conversation than at the start.

## What this does NOT validate

- This is not a controlled clinical evaluation. The subjects are LLMs
  role-playing operators; the audit is itself an LLM. Conclusions are
  about *the prompt's behavior under realistic operator-shaped inputs*,
  not about LLMs as a class or about human operators.
- The pocket files are synthetic and tuned to produce a specific
  outcome. Running the audit on a real operator with real (and
  possibly self-contradictory) pocket data will look different.
- The auditor model (Opus 4.7) is the same model family as the subject.
  Cross-family runs (Opus auditor + GPT-5.4 subject) would be a
  fairer test of prompt portability and are an open follow-up.

## Reproducing

```bash
cp .env.example .env
CASE_ID=manifest-qa-green     npm run audit
CASE_ID=llm-tags-up           npm run audit
CASE_ID=chatbot-defer         npm run audit
CASE_ID=llm-tags-reframe      npm run audit
CASE_ID=manifest-qa-stop      npm run audit
```

Outputs land in `transcripts/<run-id>.{json,md}`. The five runs analyzed
above are timestamped in their filenames.

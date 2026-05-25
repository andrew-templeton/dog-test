# Results

Five scenarios were exercised on 2026-05-25 using the V2 fixed-operator +
variable-pocket design. Expectations were declared in `TESTS.md`.
Transcripts are in `transcripts/`.

## Scorecard

| Case | Expected tier | First run | Match |
|---|---|---|---|
| `manifest-qa-green` | 🟢 GREEN | 🟢 GOOD DoG | ✅ |
| `llm-tags-up` | 🟡 trajectory | 🟢 GOOD DoG (post-trajectory) | ✅ |
| `chatbot-defer` | 🟡 DEFER | 🟡 NEEDS TRAINING + reframe | ⚠ richer than expected |
| `llm-tags-reframe` | 🟡 REFRAME | 🟢 GOOD DoG (for the reframed project) | ⚠ richer than expected |
| `manifest-qa-stop` | 🔴 STOP | 🟡 NEEDS TRAINING (softer stop) | ⚠ run-to-run variance (see below) |

Two of five first-run tier predictions matched directly. Three produced
verdicts that were either softer or sharper than the simple tier label
suggested. In every deviation case the audit found a reframing the
operator had not yet articulated.

## Variance on `manifest-qa-stop`

The first run softened the verdict from the expected 🔴 STOP to 🟡 NEEDS
TRAINING. To check whether that softening was a model artifact or a
load-bearing finding about the scenario, the same audit was re-run on
the same scenario without any pocket changes.

| Run | Verdict | Auditor's framing |
|---|---|---|
| #1 | 🟡 NEEDS TRAINING | "Three conversations, then come back with a scoped proposal." Soft stop. |
| #2 | 🔴 BAD DoG / 🟢 GOOD DoG | "Stop. I'm not going to march through Checks 2 and 3 on a pitch you've just withdrawn." Clean stop on the pitch as delivered; explicitly credits the operator's audit-side behavior. |

Both runs are committed (`transcripts/2026-05-25-manifest-qa-stop-*.md`).

**What this shows.** The variance is path-dependent on the operator's
trajectory through the dialogue, not on the pocket data. When the
operator surfaces the binding constraint (the 2025 retro file) early
and withdraws the pitch in their own words, the audit graduates to a
hard STOP. When the operator presents the pitch first and the audit
has to walk them through the retro file, the audit softens to YELLOW
with a "go scope an alternative" next-action.

That's worth naming directly: **the verdict tier is partly a function
of how the operator engages with the elicitation**, not just the
underlying data. Same data, same operator persona, same pocket,
different conversational path → different verdict tier.

This is interesting AND a limitation. The audit's tier vocabulary is
not deterministic w.r.t. the underlying state; it's responsive to
the dialogue. For an operator using this in a real roadmap meeting,
that's a feature (the audit meets the operator where they are). For
anyone trying to use it as a stable scoring function, that's a
caveat.

## Cross-family portability check

Sample: `manifest-qa-green` re-run with OpenAI `gpt-5.4` as the auditor
and Anthropic `claude-opus-4-7` as the subject. Same scenario, same
pocket, same subject system prompt.

| Auditor | Subject | Verdict |
|---|---|---|
| `claude-opus-4-7` | `claude-opus-4-7` | 🟢 GOOD DoG (3/3 ✓) |
| `gpt-5.4` | `claude-opus-4-7` | 🟢 GOOD DoG (3/3 ✓) |

The audit's verdict and reasoning structure held across the family
boundary. The gpt-5.4 auditor produced a different prose register (more
clipped, less hedged) but landed at the same tier with the same three
substantive observations: concrete claim with evidence and falsifier,
calibration-based contrarian insight, dollarized utility with named
signers. Useful evidence that the prompt isn't a Claude-grading-Claude
echo chamber.

(Transcript: `transcripts/2026-05-25-manifest-qa-green-1779747528689.md`.)

## What this validates

1. **Fixed-operator + variable-pocket design holds.** Across all five
   scenarios the subject's behavior was consistent (inventory the pocket,
   cite what's there, admit what isn't) and the verdict variance came
   from structural differences in the pocket + brief, not from per-
   scenario refusal patterns.

2. **The lazy-load tool-use pattern works.** Subjects inventoried their
   pockets early (turn 1-2 in every transcript), looked up specific
   files when the auditor pressed for specifics, and never invented
   numbers when the data wasn't there. Sparse-pocket subjects reliably
   said so out loud.

3. **The audit composes verdicts.** The "Required next action" field
   carries most of the actionable content in deviation cases. The
   tier color is downstream of what the next action says.

4. **Cross-family portability is real.** Switching auditor providers
   (Claude -> OpenAI) on a GREEN scenario reproduced the GREEN verdict
   with substantively similar reasoning, evidence that the prompt is
   not over-fit to a single model.

5. **The recursive step (refine your own definition of better)**
   consistently produces sharper output than the operator walked in
   with, in every recorded run.

## What this does NOT validate

- This is not a controlled clinical evaluation. Subjects are LLMs
  role-playing operators; the audit is itself an LLM. Conclusions are
  about *the prompt's behavior under realistic operator-shaped inputs*,
  not about LLMs as a class or about human operators.
- The pocket files are synthetic and tuned to produce a specific shape
  of conversation. Running the audit on a real operator with real,
  possibly self-contradictory pocket data will look different.
- The verdict tier is partly path-dependent on the operator's
  trajectory through the dialogue, as the `manifest-qa-stop` variance
  documents. The audit is responsive, not deterministic.
- One run is not a measurement. The variance check above used only
  two same-family runs; a robust measurement would require more
  replicates per scenario.

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

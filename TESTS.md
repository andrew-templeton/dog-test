# Tests

This repo ships with five tests that exercise the DoG Test prompt against
realistic operator scenarios. Each test pairs a starting brief (the
operator's pitch) with a `pocket/` directory of synthetic information the
operator can look up during the conversation. The auditor's verdict is
emitted at the end of each run.

The point of these tests is to demonstrate how the audit behaves across
five distinct outcomes you'd see in an actual roadmap meeting. They are
**not** meant as a scientific evaluation of the prompt - they are worked
examples you can reproduce.

## The five tests

| ID | Domain | Expected verdict | What it demonstrates |
|---|---|---|---|
| `manifest-qa-green` | Logistics ops | 🟢 GOOD DoG | Rich data + clean pitch → audit approves quickly |
| `llm-tags-up` | E-commerce ops | 🟡 (trajectory) | Rich data + vague initial pitch → audit pulls operator up through elicitation |
| `chatbot-defer` | SaaS support | 🟡 DEFER | Sparse data + cooperative operator → audit graduates to "go gather X first" |
| `llm-tags-reframe` | E-commerce ops | 🟡 REFRAME | Rich data reveals the pitch is targeting the wrong lever → audit reframes the question |
| `manifest-qa-stop` | Logistics ops | 🔴 STOP | Pocket reveals an identical prior attempt that failed for a constraint that hasn't changed → audit recommends not pursuing |

The subject system prompt is the same across all five (`src/subject/system-prompt.ts`).
What varies between tests is the brief and the contents of the pocket. The
verdict variation is structural, not behavioral.

## Reproducing

```bash
cp .env.example .env
# fill in ANTHROPIC_API_KEY and (optionally) OPENAI_API_KEY for auditor

CASE_ID=manifest-qa-green     npm run audit
CASE_ID=llm-tags-up           npm run audit
CASE_ID=chatbot-defer         npm run audit
CASE_ID=llm-tags-reframe      npm run audit
CASE_ID=manifest-qa-stop      npm run audit
```

Transcripts land in `transcripts/<run-id>.{json,md}`.

## Prior art (so we're being honest)

The DoG Test's three-question structure is not novel; it packages
classical results from a few well-trodden bodies of work. Cite as
appropriate:

- **Falsifiability and the evidence ladder** - Karl Popper,
  *Logik der Forschung* (1934). The "strength of finding" check is
  the Popperian load-bearing axis: a claim with no observation that
  would change your mind is below the bottom rung.
- **Surprise as information gain** - Claude Shannon,
  *A Mathematical Theory of Communication* (1948). The "surprise"
  check measures how far the claim updates a smart reader's prior;
  Shannon gives the formal grounding (self-information,
  $-\log p(x)$).
- **Decision-theoretic utility** - Daniel Bernoulli (1738),
  Leonard Savage (1954), Howard Raiffa (1968). The "utility" check
  is expected-monetary-value with cost-asymmetry, the workhorse of
  cost-sensitive learning.
- **Expected value of information** - Dennis Lindley,
  *On a Measure of the Information Provided by an Experiment* (1956);
  Robert Schlaifer & Howard Raiffa, *Applied Statistical Decision
  Theory* (1961). The product `Strength × Surprise × Utility` is the
  structural form of EVSI / EVPI. We're not the first to multiply
  these.

What the DoG Test contributes is **packaging**: a paste-into-Claude
prompt that forces an operator to declare all three terms before they
can iterate, plus a verdict vocabulary (GOOD DoG / NEEDS TRAINING /
BAD DoG / DEFER / REFRAME / STOP) that maps to the next concrete action.

## What this is not

- This is not a clinical-trial-grade evaluation. The subjects are LLMs
  role-playing operators. The audit is itself an LLM. Conclusions are
  about *the prompt's behavior*, not about LLMs as a class.
- The transcripts are reproducible up to provider-side sampling variance.
  Neither Anthropic Opus 4.7 nor OpenAI gpt-5.4 exposes a seed parameter
  we control; identical inputs produce semantically equivalent verdicts
  but not byte-identical outputs.
- "DEFER PENDING RESEARCH" and "REFRAME" are sub-verdicts of NEEDS
  TRAINING, distinguished by the *required next action* the auditor
  produces. Same yellow color in screenshots; different diagnostic.

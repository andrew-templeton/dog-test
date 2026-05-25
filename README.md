# dog-test

The **DoG Test** is a three-question audit you paste into Claude before
your next AI roadmap meeting. It refuses to evaluate your idea on its
merits until you've answered how you would *know* it's good:

1. **Strength of finding** - what claim are you making, what's the evidence, and what observation would change your mind?
2. **Surprise** - what non-obvious belief does this update, and for whom?
3. **Utility** - what's the dollar consequence if you're right vs. wrong, and who would sign their name to that estimate?

Verdict comes back as 🟢 **GOOD DoG**, 🟡 **NEEDS TRAINING** (sub-verdicts: DEFER, REFRAME), or 🔴 **BAD DoG / STOP**.

The full prompt is at [`src/prompts/dog-test.ts`](./src/prompts/dog-test.ts). Copy, paste, append your idea, run.

## What's in this repo

This repo has two parts:

1. **The prompt itself**, which you can use without any of the rest. Just open `src/prompts/dog-test.ts`, copy the string, paste it into Claude (or your model of choice), append your roadmap item, and let it interrogate you.
2. **A reproducible test harness** that runs the prompt against five realistic operator scenarios. Each scenario pairs an opening pitch with a synthetic pocket of files the operator can look up via tool use during the conversation. The transcripts are committed; see [`TESTS.md`](./TESTS.md) for the five cases and what each demonstrates.

## Quickstart

```bash
npm install
cp .env.example .env
# fill in ANTHROPIC_API_KEY (Opus 4.7 by default for the subject)
# optionally fill OPENAI_API_KEY (gpt-5.4 for the auditor)

# Run any of the five tests:
CASE_ID=manifest-qa-green     npm run audit
CASE_ID=llm-tags-up           npm run audit
CASE_ID=chatbot-defer         npm run audit
CASE_ID=llm-tags-reframe      npm run audit
CASE_ID=manifest-qa-stop      npm run audit
```

Outputs go to `transcripts/<run-id>.{json,md}`.

## Architecture

```
src/
├── prompts/dog-test.ts            The auditor system prompt (the actual product)
├── subject/
│   ├── system-prompt.ts           Fixed operator persona; same across all 5 cases
│   └── subject-runner.ts          Tool-using Anthropic Messages API loop
├── cases.ts                       The 5 test specs (brief + pocket per case)
├── orchestrator.ts                Auditor and subject alternating with verdict detection
├── providers/                     LLMProvider abstraction for the auditor seat
│   ├── anthropic.ts               Opus 4.7 via streaming Messages API + cache_control
│   ├── openai.ts                  gpt-5.4 via Responses API
│   └── gemini.ts                  gemini-3.5-flash via generativelanguage REST
├── transcript.ts                  JSON + markdown emitters
└── index.ts                       Entry point

scenarios/
├── manifest-qa-green/    brief.md + pocket/* (rich data)
├── llm-tags-up/          brief.md + pocket/* (rich data, vague brief)
├── chatbot-defer/        brief.md + pocket/* (sparse data)
├── llm-tags-reframe/     brief.md + pocket/* (data reveals misframe)
└── manifest-qa-stop/     brief.md + pocket/* (data reveals prior failed attempt)

transcripts/             Committed example runs (regenerate via npm run audit)
```

## How the subject works

The subject (the operator being audited) is an Anthropic Messages API call with two tools:

- `list_pocket_files` - inventory the scenario's pocket directory
- `read_pocket_file` - read a specific file from the pocket

The subject's system prompt instructs it to inventory the pocket early, look things up when the auditor asks, admit gaps honestly, and never invent numbers. This makes the audit's verdict track the *structural state of the data* rather than per-condition refusal patterns.

If you want to plug the audit into your own data, write a brief and a pocket for your idea, add the case to `src/cases.ts`, and run.

## Prior art

The DoG Test's three checks are not novel. They package Popper (falsifiability), Shannon (information gain), and Lindley / Raiffa / Savage (expected value of information). [`TESTS.md`](./TESTS.md#prior-art-so-were-being-honest) has the full citation list. What this repo contributes is the *packaging* - a single paste-into-Claude prompt that forces an operator to declare all three terms before they can iterate, plus a verdict vocabulary that maps to a concrete next action.

## License

MIT. Use it, fork it, paste the prompt anywhere.

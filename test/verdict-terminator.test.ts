// Verifies the orchestrator's verdict terminator detects the end of a
// run reliably across plausible auditor phrasings, and does NOT fire
// on intermediate turns that mention the same vocabulary.
//
// The fixture strings below intentionally use the rigorous-research
// names for the three checks (Strength of finding / Surprise / Utility,
// from Lindley 1956's EVSI factors). The user-facing prompt and the
// launch carousel use the alliterative vanity slate (Backing / Bite /
// Bet) for memorability; either slate satisfies the terminator since
// it only checks for "DoG Test Verdict" + "Required next action".
// See TESTS.md "Three checks under different lenses" for the mapping.

import { describe, expect, it } from 'vitest';

// Mirror the orchestrator's default terminator. If the runner-side
// definition changes, update this and add a regression test for the
// drift.
const defaultTerminator = (content: string): boolean =>
  content.includes('DoG Test Verdict') &&
  content.includes('Required next action');

describe('verdict terminator', () => {
  it('fires on the canonical verdict-card format', () => {
    const card = `═══════════════════════════════════════
DoG Test Verdict
═══════════════════════════════════════
Strength: ✓ ...
Surprise: ✓ ...
Utility:  ✓ ...
Overall:  🟢 GOOD DoG

Required next action:
Run the shadow phase as scoped.`;
    expect(defaultTerminator(card)).toBe(true);
  });

  it('fires on a card with markdown-bolded header', () => {
    const card = `**DoG Test Verdict**
- Strength: ✓
- Surprise: ⚠
- Utility:  ✗

**Required next action:** Re-run the analysis after the next reporting cycle.`;
    expect(defaultTerminator(card)).toBe(true);
  });

  it('does NOT fire on an intermediate check that mentions a future verdict', () => {
    const intermediate = `VERDICT: ✓ ACCEPTED
That answer is sharp enough to pass Check 1. I'll write up the
DoG Test Verdict at the end after Check 3.`;
    // Mentions "DoG Test Verdict" but not "Required next action".
    expect(defaultTerminator(intermediate)).toBe(false);
  });

  it('does NOT fire on a check verdict line alone', () => {
    const checkOnly = `VERDICT: ⚠ UNDERSPECIFIED
WHY: You named a labor case but not a revenue case.
TO MAKE IT ACCEPTED: Quote a revenue range with a named signer.`;
    expect(defaultTerminator(checkOnly)).toBe(false);
  });

  it('does NOT fire on a subject message that quotes the auditor', () => {
    const subjectEcho = `You mentioned a "Required next action" line earlier - here is what I would put in that slot if you agree the verdict is GREEN.`;
    // Has "Required next action" but not "DoG Test Verdict".
    expect(defaultTerminator(subjectEcho)).toBe(false);
  });

  it('fires when both sentinels appear in different paragraphs', () => {
    const sprawl = `Alright, here is the synthesis.

# DoG Test Verdict

Strength: ✓
Surprise: ✓
Utility:  ✓

(Some explanation in between.)

To close, the Required next action is to schedule the shadow run.`;
    expect(defaultTerminator(sprawl)).toBe(true);
  });
});

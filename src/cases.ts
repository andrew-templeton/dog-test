// 5 V2 conditions. The subject system prompt is FIXED across all cases
// (see src/subject/system-prompt.ts); what varies is:
//   - briefPath:   the starting pitch the operator brings to the audit
//   - pocketDir:   the information available to the operator if they ask
//
// The verdict variation across conditions comes from the structural
// state of the pocket + brief, not from per-condition refusals.

import path from 'node:path';

export type CaseSpec = {
  id: string;
  title: string;
  domain: 'manifest-qa' | 'llm-tags' | 'chatbot';
  expectedVerdict: 'GREEN' | 'YELLOW-TRAIN' | 'YELLOW-DEFER' | 'YELLOW-REFRAME' | 'RED-STOP';
  whyExpected: string;
  briefPath: string;
  pocketDir: string;
};

const repoRoot = path.resolve(new URL(import.meta.url).pathname, '..', '..');

const scenarioPath = (id: string, sub: string): string =>
  path.join(repoRoot, 'scenarios', id, sub);

export const CASES: Record<string, CaseSpec> = {
  'manifest-qa-green': {
    id: 'manifest-qa-green',
    title: 'Vision model for shipment manifest QA',
    domain: 'manifest-qa',
    expectedVerdict: 'GREEN',
    whyExpected:
      'Rich pocket (cost surface measured, held-out validation, P&L on both sides, named signers). Audit should accept all three checks.',
    briefPath: scenarioPath('manifest-qa-green', 'brief.md'),
    pocketDir: scenarioPath('manifest-qa-green', 'pocket'),
  },
  'llm-tags-up': {
    id: 'llm-tags-up',
    title: 'LLM-generated product tags (initial pitch is vague)',
    domain: 'llm-tags',
    expectedVerdict: 'YELLOW-TRAIN',
    whyExpected:
      'Rich pocket but operator opens with a generic pitch ("LLMs are better"). Through elicitation the operator reads the pocket and produces sharper answers. Trajectory from YELLOW to GREEN within the same session.',
    briefPath: scenarioPath('llm-tags-up', 'brief.md'),
    pocketDir: scenarioPath('llm-tags-up', 'pocket'),
  },
  'chatbot-defer': {
    id: 'chatbot-defer',
    title: 'AI chatbot for support page (sparse data)',
    domain: 'chatbot',
    expectedVerdict: 'YELLOW-DEFER',
    whyExpected:
      'Sparse pocket: vendor demo notes, board memo, but no internal deflection-eligible-category measurement. Cooperative operator acknowledges the gap; audit graduates to DEFER PENDING RESEARCH.',
    briefPath: scenarioPath('chatbot-defer', 'brief.md'),
    pocketDir: scenarioPath('chatbot-defer', 'pocket'),
  },
  'llm-tags-reframe': {
    id: 'llm-tags-reframe',
    title: 'LLM-generated product tags (data reveals misframe)',
    domain: 'llm-tags',
    expectedVerdict: 'YELLOW-REFRAME',
    whyExpected:
      "Pocket reveals the search-CVR problem is dominated by zero-result queries on misspellings and synonym gaps, not by tag quality. Audit + operator together realize the pitch is targeting the wrong lever; verdict says REFRAME.",
    briefPath: scenarioPath('llm-tags-reframe', 'brief.md'),
    pocketDir: scenarioPath('llm-tags-reframe', 'pocket'),
  },
  'manifest-qa-stop': {
    id: 'manifest-qa-stop',
    title: 'Vision model for manifest QA (a prior attempt already failed)',
    domain: 'manifest-qa',
    expectedVerdict: 'RED-STOP',
    whyExpected:
      'Pocket reveals a prior identical attempt 14 months ago that hit a 30% review-time tax and was rolled back. Underlying constraints have not changed. Audit recommends STOP rather than re-litigating.',
    briefPath: scenarioPath('manifest-qa-stop', 'brief.md'),
    pocketDir: scenarioPath('manifest-qa-stop', 'pocket'),
  },
};

export const getCase = (id: string): CaseSpec => {
  const c = CASES[id];
  if (!c) {
    const known = Object.keys(CASES).join(', ');
    throw new Error(`Unknown CASE_ID "${id}". Known: ${known}`);
  }
  return c;
};

export const DEFAULT_CASE_ID = 'manifest-qa-green';
export const CASE_IDS = Object.keys(CASES);

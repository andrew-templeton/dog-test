// V2 entry point. Configure via env vars:
//   CASE_ID           one of CASES keys (see src/cases.ts)
//   AUDITOR_PROVIDER  anthropic | openai | gemini  (default anthropic)
//   ANTHROPIC_MODEL / OPENAI_MODEL / GEMINI_MODEL   optional overrides

import path from 'node:path';
import { makeProvider, type ProviderName } from './providers/index.js';
import { orchestrate, type Turn } from './orchestrator.js';
import {
  saveTranscriptJson,
  saveTranscriptMarkdown,
  type Transcript,
} from './transcript.js';
import { DOG_TEST_PROMPT } from './prompts/dog-test.js';
import { runSubject } from './subject/subject-runner.js';
import { SUBJECT_SYSTEM_PROMPT } from './subject/system-prompt.js';
import { getCase, DEFAULT_CASE_ID } from './cases.js';

const validProviders: ReadonlyArray<ProviderName> = [
  'anthropic',
  'openai',
  'gemini',
];

const parseProvider = (
  raw: string | undefined,
  fallback: ProviderName,
): ProviderName => {
  if (!raw) return fallback;
  const candidate = raw.toLowerCase();
  const found = validProviders.find((p) => p === candidate);
  if (!found) {
    throw new Error(
      `Invalid provider "${raw}". Must be one of: ${validProviders.join(', ')}.`,
    );
  }
  return found;
};

const main = async (): Promise<void> => {
  const auditorProvider = parseProvider(
    process.env['AUDITOR_PROVIDER'],
    'anthropic',
  );
  const caseId = process.env['CASE_ID'] ?? DEFAULT_CASE_ID;
  const subjectCase = getCase(caseId);

  const auditorCall = await makeProvider(auditorProvider);

  const startedAt = new Date().toISOString();
  const runId = `${startedAt.slice(0, 10)}-${subjectCase.id}-${Date.now()}`;

  console.error(`[dog-test] starting run ${runId}`);
  console.error(`[dog-test] case=${subjectCase.id} domain=${subjectCase.domain} expected=${subjectCase.expectedVerdict}`);
  console.error(`[dog-test] auditor=${auditorProvider} subject=anthropic (tool-using)`);
  console.error(`[dog-test] pocket=${subjectCase.pocketDir}`);

  const turns: Turn[] = await orchestrate({
    auditor: {
      name: 'DoG Test',
      system: DOG_TEST_PROMPT,
      provider: auditorCall,
    },
    subject: {
      name: 'Operator',
      system: SUBJECT_SYSTEM_PROMPT,
      provider: runSubject,
      pocketDir: subjectCase.pocketDir,
      briefPath: subjectCase.briefPath,
    },
    onTurn: (turn) => {
      const preview = turn.content.slice(0, 100).replace(/\s+/g, ' ');
      const ellipsis = turn.content.length > 100 ? '...' : '';
      console.error(
        `[dog-test] turn ${turn.index} (${turn.speaker}): ${preview}${ellipsis}`,
      );
    },
  });

  const endedAt = new Date().toISOString();

  const transcript: Transcript = {
    runId,
    startedAt,
    endedAt,
    auditor: { name: 'DoG Test', provider: auditorProvider },
    subject: { name: subjectCase.title, provider: 'anthropic' },
    turns,
  };

  const dir = path.join('transcripts');
  const jsonPath = await saveTranscriptJson(transcript, dir);
  const mdPath = await saveTranscriptMarkdown(transcript, dir);

  console.error(`[dog-test] transcript saved:`);
  console.error(`  json: ${jsonPath}`);
  console.error(`  md:   ${mdPath}`);
};

main().catch((err: unknown) => {
  console.error('[dog-test] run failed:');
  console.error(err);
  process.exit(1);
});

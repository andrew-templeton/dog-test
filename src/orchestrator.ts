// V2 orchestrator: auditor uses a plain LLMProvider (no tools); subject
// uses a SubjectProvider that has Read/Glob over a pocket directory.

import fs from 'node:fs/promises';
import type { LLMProvider, Message } from './providers/index.js';
import type { SubjectProvider } from './subject/subject-runner.js';

export type AuditorConfig = {
  name: string;
  system: string;
  provider: LLMProvider;
  model?: string;
};

export type SubjectConfig = {
  name: string;
  system: string;
  provider: SubjectProvider;
  pocketDir: string;
  briefPath: string;
  model?: string;
};

export type Turn = {
  index: number;
  speaker: string;
  content: string;
  timestamp: string;
};

export type OrchestratorArgs = {
  auditor: AuditorConfig;
  subject: SubjectConfig;
  maxTurns?: number;
  terminator?: (content: string) => boolean;
  onTurn?: (turn: Turn) => void;
};

const defaultTerminator = (content: string): boolean =>
  content.includes('DoG Test Verdict') &&
  content.includes('Required next action');

export const orchestrate = async ({
  auditor,
  subject,
  maxTurns = 24,
  terminator = defaultTerminator,
  onTurn,
}: OrchestratorArgs): Promise<Turn[]> => {
  const transcript: Turn[] = [];

  // Bootstrap: the subject's first message is its starting brief (loaded
  // from disk). The auditor then opens its three checks.
  const initialBrief = (await fs.readFile(subject.briefPath, 'utf-8')).trim();

  const auditorMessages: Message[] = [
    { role: 'user', content: initialBrief },
  ];
  const subjectMessages: Message[] = [
    // Subject is primed with its own brief as if it had written it.
    { role: 'assistant', content: initialBrief },
  ];

  const recordTurn = (speaker: string, content: string): Turn => {
    const turn: Turn = {
      index: transcript.length,
      speaker,
      content,
      timestamp: new Date().toISOString(),
    };
    transcript.push(turn);
    if (onTurn) onTurn(turn);
    return turn;
  };

  // Subject's "Turn 0" is the brief itself. We surface it in the
  // transcript so the reader sees the pitch the audit started from.
  recordTurn(subject.name, initialBrief);

  let verdictEmitted = false;

  for (let i = 0; i < maxTurns; i++) {
    const auditorReply = await auditor.provider({
      system: auditor.system,
      messages: auditorMessages,
      ...(auditor.model ? { model: auditor.model } : {}),
    });
    recordTurn(auditor.name, auditorReply);

    auditorMessages.push({ role: 'assistant', content: auditorReply });
    subjectMessages.push({ role: 'user', content: auditorReply });

    if (terminator(auditorReply)) {
      verdictEmitted = true;
    }

    const subjectReply = await subject.provider({
      system: subject.system,
      messages: subjectMessages,
      pocketDir: subject.pocketDir,
      ...(subject.model ? { model: subject.model } : {}),
    });
    recordTurn(subject.name, subjectReply);

    subjectMessages.push({ role: 'assistant', content: subjectReply });
    auditorMessages.push({ role: 'user', content: subjectReply });

    if (verdictEmitted) {
      // One final auditor turn after the verdict + recursive step.
      const closingAuditorReply = await auditor.provider({
        system: auditor.system,
        messages: auditorMessages,
        ...(auditor.model ? { model: auditor.model } : {}),
      });
      recordTurn(auditor.name, closingAuditorReply);
      break;
    }
  }

  return transcript;
};

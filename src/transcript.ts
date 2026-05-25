// Persist transcripts as JSON (machine-readable, reproducible) and markdown
// (human-readable, screenshot-friendly).

import fs from 'node:fs/promises';
import path from 'node:path';
import type { Turn } from './orchestrator.js';

export type AgentManifest = {
  name: string;
  provider: string;
  model?: string;
};

export type Transcript = {
  runId: string;
  startedAt: string;
  endedAt: string;
  auditor: AgentManifest;
  subject: AgentManifest;
  turns: Turn[];
};

export const saveTranscriptJson = async (
  transcript: Transcript,
  dir: string,
): Promise<string> => {
  await fs.mkdir(dir, { recursive: true });
  const filepath = path.join(dir, `${transcript.runId}.json`);
  await fs.writeFile(filepath, JSON.stringify(transcript, null, 2), 'utf-8');
  return filepath;
};

export const renderMarkdown = (transcript: Transcript): string => {
  const lines: string[] = [];
  lines.push(`# DoG Test transcript: ${transcript.runId}`);
  lines.push('');
  lines.push(`- Started: \`${transcript.startedAt}\``);
  lines.push(`- Ended:   \`${transcript.endedAt}\``);
  lines.push(
    `- Auditor: **${transcript.auditor.name}** (${transcript.auditor.provider}${
      transcript.auditor.model ? ` / ${transcript.auditor.model}` : ''
    })`,
  );
  lines.push(
    `- Subject: **${transcript.subject.name}** (${transcript.subject.provider}${
      transcript.subject.model ? ` / ${transcript.subject.model}` : ''
    })`,
  );
  lines.push('');
  lines.push('---');
  lines.push('');
  for (const turn of transcript.turns) {
    lines.push(`### Turn ${turn.index} - ${turn.speaker}`);
    lines.push('');
    lines.push(turn.content);
    lines.push('');
  }
  return lines.join('\n');
};

export const saveTranscriptMarkdown = async (
  transcript: Transcript,
  dir: string,
): Promise<string> => {
  await fs.mkdir(dir, { recursive: true });
  const filepath = path.join(dir, `${transcript.runId}.md`);
  await fs.writeFile(filepath, renderMarkdown(transcript), 'utf-8');
  return filepath;
};

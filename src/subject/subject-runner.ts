// Subject provider: a tool-using Anthropic Messages API loop. The subject is
// granted Read + Glob over a pocket/ directory and is expected to inventory
// what's available there as it answers the auditor's questions.
//
// This is the V2 design: the subject role prompt is FIXED. What varies
// per condition is the contents of the pocket. The audit's verdict tier
// then tracks the structural sufficiency of the pocket + the operator's
// engagement with elicitation, not a per-condition refusal pattern.

import fs from 'node:fs/promises';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '../providers/index.js';

export type SubjectArgs = {
  system: string;
  messages: Message[];
  pocketDir: string;
  model?: string;
};

export type SubjectProvider = (args: SubjectArgs) => Promise<string>;

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = new Anthropic({ apiKey });

const DEFAULT_MODEL = process.env.SUBJECT_MODEL ?? 'claude-opus-4-7';
const MAX_TOKENS = 32768;
const MAX_TOOL_ITERATIONS = 12;

// Tool schemas the subject can invoke. Confined to read-only operations
// over the pocket directory so a misbehaving subject can't escape the
// sandbox.
const tools: Anthropic.Tool[] = [
  {
    name: 'list_pocket_files',
    description:
      "List every file available in the operator's information pocket for this scenario. Use this first to inventory what data you have access to.",
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'read_pocket_file',
    description:
      "Read a specific file from the operator's information pocket. Use this to look up specific data the auditor is asking about.",
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description:
            'Relative path under the pocket directory, e.g. "cost-data.md" or "validation-stats.md".',
        },
      },
      required: ['path'],
    },
  },
];

const listPocketFiles = async (pocketDir: string): Promise<string> => {
  try {
    const entries = await fs.readdir(pocketDir, { withFileTypes: true, recursive: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => {
        const rel = path.relative(pocketDir, path.join(e.parentPath ?? pocketDir, e.name));
        return rel;
      })
      .sort();
    if (files.length === 0) return '(pocket is empty)';
    return files.join('\n');
  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : String(err);
    return `(error listing pocket: ${m})`;
  }
};

const readPocketFile = async (pocketDir: string, relPath: string): Promise<string> => {
  // Reject any path that escapes the pocket directory.
  const safe = path.normalize(relPath);
  if (safe.startsWith('..') || path.isAbsolute(safe)) {
    return '(error: path must be relative and inside the pocket)';
  }
  try {
    const full = path.join(pocketDir, safe);
    const content = await fs.readFile(full, 'utf-8');
    return content;
  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : String(err);
    return `(error reading ${relPath}: ${m})`;
  }
};

export const runSubject: SubjectProvider = async ({
  system,
  messages,
  pocketDir,
  model,
}) => {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set.');
  }

  // The subject's conversation messages start from the auditor's most
  // recent question (= the last user message). Prior turns are preserved
  // so the subject can build on its own earlier responses.
  const conversation: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let iterations = 0;
  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations += 1;
    const response = await client.messages.create({
      model: model ?? DEFAULT_MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: system,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: conversation,
      tools,
    });

    // If the model responded with text and no tool_use, we're done.
    if (response.stop_reason !== 'tool_use') {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n');
      if (text.length === 0) {
        throw new Error(
          `Subject returned no text (stop_reason=${response.stop_reason}).`,
        );
      }
      return text;
    }

    // Otherwise execute every tool_use block and append the results.
    conversation.push({ role: 'assistant', content: response.content });

    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUseBlocks) {
      let result = '';
      if (tu.name === 'list_pocket_files') {
        result = await listPocketFiles(pocketDir);
      } else if (tu.name === 'read_pocket_file') {
        const input = tu.input as { path?: string };
        const target = input.path;
        if (!target) {
          result = '(error: path parameter is required)';
        } else {
          result = await readPocketFile(pocketDir, target);
        }
      } else {
        result = `(error: unknown tool ${tu.name})`;
      }
      toolResults.push({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: result,
      });
    }

    conversation.push({ role: 'user', content: toolResults });
  }

  throw new Error(
    `Subject exceeded ${MAX_TOOL_ITERATIONS} tool-use iterations without producing a final answer.`,
  );
};

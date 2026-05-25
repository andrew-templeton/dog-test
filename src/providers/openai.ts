// OpenAI Responses API adapter.
// Uses gpt-5.4 on minimal reasoning effort by default (per global policy).
// max_output_tokens is intentionally generous: conservative caps silently
// truncate verdict cards mid-output.

import OpenAI from 'openai';
import type { LLMProvider } from './index.js';

const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey });

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-5.4';
const MAX_OUTPUT_TOKENS = 16384;

export const openai: LLMProvider = async ({ system, messages, model }) => {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set.');
  }

  const response = await client.responses.create({
    model: model ?? DEFAULT_MODEL,
    instructions: system,
    input: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    max_output_tokens: MAX_OUTPUT_TOKENS,
    // gpt-5.4 no longer accepts 'minimal'; supported values are
    // 'none' | 'low' | 'medium' | 'high' | 'xhigh'. 'low' is the closest
    // analog to the previous 'minimal' default.
    reasoning: { effort: 'low' },
  });

  const text = response.output_text;

  if (!text || text.length === 0) {
    throw new Error(
      `OpenAI response had no output_text. status=${response.status ?? 'unknown'}`,
    );
  }

  return text;
};

// Anthropic Messages API adapter (streaming).
// System prompt is sent as an array block with cache_control so multi-turn loops
// hit the prompt cache. max_tokens is intentionally generous; the SDK requires
// streaming for any non-trivial output budget, so we use messages.stream() and
// await the final assembled message before returning a plain string.

import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider } from './index.js';

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = new Anthropic({ apiKey });

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-7';
const MAX_TOKENS = 32768;

export const anthropic: LLMProvider = async ({ system, messages, model }) => {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set.');
  }

  // temperature is deprecated on Opus 4.7 (returns 400 if sent). The model's
  // default sampling behavior is low-variance enough for our reproducibility
  // needs; we do not pass it explicitly.
  const stream = client.messages.stream({
    model: model ?? DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: 'text',
        text: system,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const final = await stream.finalMessage();

  const text = final.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  if (text.length === 0) {
    throw new Error(
      `Anthropic response had no text blocks. stop_reason=${final.stop_reason}`,
    );
  }

  return text;
};

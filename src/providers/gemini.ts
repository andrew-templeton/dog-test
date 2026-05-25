// Gemini adapter via the generativelanguage REST endpoint (personal API key,
// not Vertex project auth). maxOutputTokens is intentionally generous.

import { z } from 'zod';
import type { LLMProvider } from './index.js';

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
const MAX_OUTPUT_TOKENS = 16384;

const GeminiResponseSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string() })),
        }),
      }),
    )
    .min(1),
});

export const gemini: LLMProvider = async ({ system, messages, model }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${
    model ?? DEFAULT_MODEL
  }:generateContent?key=${apiKey}`;

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: 0,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errBody}`);
  }

  const json: unknown = await res.json();
  const parsed = GeminiResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `Gemini response shape did not match schema: ${parsed.error.message}`,
    );
  }

  const first = parsed.data.candidates[0];
  if (!first) {
    throw new Error('Gemini response had no candidates.');
  }

  const text = first.content.parts.map((p) => p.text).join('\n');
  if (text.length === 0) {
    throw new Error('Gemini response had no text parts.');
  }

  return text;
};

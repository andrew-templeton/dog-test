// Provider abstraction. The orchestrator is provider-agnostic; each adapter
// converts the common Message shape into the wire format that provider expects.

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type LLMProviderArgs = {
  system: string;
  messages: Message[];
  model?: string;
};

export type LLMProvider = (args: LLMProviderArgs) => Promise<string>;

export type ProviderName = 'openai' | 'anthropic' | 'gemini';

export const makeProvider = async (name: ProviderName): Promise<LLMProvider> => {
  switch (name) {
    case 'openai': {
      const { openai } = await import('./openai.js');
      return openai;
    }
    case 'anthropic': {
      const { anthropic } = await import('./anthropic.js');
      return anthropic;
    }
    case 'gemini': {
      const { gemini } = await import('./gemini.js');
      return gemini;
    }
  }
};

import { useState, useCallback } from 'react';
import { openaiService, systemPrompts } from '@/services/openai';
import type { ChatMessage } from '@/services/openai';

interface UseOpenAIReturn {
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  response: string;
  configureApiKey: (key: string) => void;
  removeApiKey: () => void;
  sendMessage: (messages: ChatMessage[], systemPrompt?: string) => Promise<string>;
  streamMessage: (
    messages: ChatMessage[],
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ) => Promise<string>;
  clearError: () => void;
  clearResponse: () => void;
}

export function useOpenAI(): UseOpenAIReturn {
  const [isConfigured, setIsConfigured] = useState(openaiService.isConfigured());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const configureApiKey = useCallback((key: string) => {
    openaiService.setApiKey(key);
    setIsConfigured(true);
    setError(null);
  }, []);

  const removeApiKey = useCallback(() => {
    openaiService.removeApiKey();
    setIsConfigured(false);
  }, []);

  const sendMessage = useCallback(
    async (messages: ChatMessage[], systemPrompt?: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const fullMessages: ChatMessage[] = systemPrompt
          ? [{ role: 'system', content: systemPrompt }, ...messages]
          : messages;

        const result = await openaiService.chat(fullMessages);
        setResponse(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const streamMessage = useCallback(
    async (
      messages: ChatMessage[],
      systemPrompt?: string,
      onChunk?: (chunk: string) => void
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      setResponse('');

      try {
        const fullMessages: ChatMessage[] = systemPrompt
          ? [{ role: 'system', content: systemPrompt }, ...messages]
          : messages;

        let fullResponse = '';

        for await (const chunk of openaiService.chatStream(fullMessages)) {
          fullResponse += chunk;
          setResponse(fullResponse);
          onChunk?.(chunk);
        }

        return fullResponse;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  const clearResponse = useCallback(() => setResponse(''), []);

  return {
    isConfigured,
    isLoading,
    error,
    response,
    configureApiKey,
    removeApiKey,
    sendMessage,
    streamMessage,
    clearError,
    clearResponse,
  };
}

// Specialized hooks for specific features
export function useAITutor() {
  const openai = useOpenAI();

  const askTutor = useCallback(
    async (question: string, history: ChatMessage[] = []) => {
      const messages: ChatMessage[] = [
        ...history,
        { role: 'user', content: question },
      ];
      return openai.streamMessage(messages, systemPrompts.aiTutor);
    },
    [openai]
  );

  return { ...openai, askTutor };
}

export function usePolicyGenerator() {
  const openai = useOpenAI();

  const generatePolicy = useCallback(
    async (params: {
      type: string;
      companyName: string;
      sector: string;
      size: string;
      specificRequirements?: string;
    }) => {
      const prompt = `Gere uma política de ${params.type} para a empresa ${params.companyName}.

Informações da empresa:
- Setor: ${params.sector}
- Tamanho: ${params.size}
${params.specificRequirements ? `- Requisitos específicos: ${params.specificRequirements}` : ''}

Gere uma política completa e profissional.`;

      const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
      return openai.streamMessage(messages, systemPrompts.policyGenerator);
    },
    [openai]
  );

  return { ...openai, generatePolicy };
}

export function useLIFOWAssistant() {
  const openai = useOpenAI();

  const askAssistant = useCallback(
    async (question: string, context?: string, history: ChatMessage[] = []) => {
      const contextMessage = context
        ? `Contexto do usuário: ${context}\n\nPergunta: ${question}`
        : question;

      const messages: ChatMessage[] = [
        ...history,
        { role: 'user', content: contextMessage },
      ];
      return openai.streamMessage(messages, systemPrompts.lifowAssistant);
    },
    [openai]
  );

  return { ...openai, askAssistant };
}

export function useShadowAIAnalyzer() {
  const openai = useOpenAI();

  const analyzeTool = useCallback(
    async (tool: {
      name: string;
      category: string;
      description?: string;
      usersCount?: number;
      dataTypes?: string[];
    }) => {
      const prompt = `Analise a seguinte ferramenta de IA para uso corporativo:

Nome: ${tool.name}
Categoria: ${tool.category}
${tool.description ? `Descrição: ${tool.description}` : ''}
${tool.usersCount ? `Número de usuários na empresa: ${tool.usersCount}` : ''}
${tool.dataTypes?.length ? `Tipos de dados utilizados: ${tool.dataTypes.join(', ')}` : ''}

Forneça uma análise de risco completa com recomendações.`;

      const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
      return openai.sendMessage(messages, systemPrompts.shadowAIAnalyzer);
    },
    [openai]
  );

  return { ...openai, analyzeTool };
}

export function useMaturityAssessment() {
  const openai = useOpenAI();

  const analyzeMaturity = useCallback(
    async (answers: Record<string, string | number>, companyInfo: {
      name: string;
      sector: string;
      size: string;
    }) => {
      const prompt = `Analise a maturidade em IA da empresa com base nas seguintes respostas:

Empresa: ${companyInfo.name}
Setor: ${companyInfo.sector}
Tamanho: ${companyInfo.size}

Respostas do questionário:
${Object.entries(answers)
  .map(([question, answer]) => `- ${question}: ${answer}`)
  .join('\n')}

Forneça uma análise detalhada com scores por dimensão e recomendações priorizadas.`;

      const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
      return openai.sendMessage(messages, systemPrompts.maturityAssessment);
    },
    [openai]
  );

  return { ...openai, analyzeMaturity };
}

export default useOpenAI;

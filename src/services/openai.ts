// OpenAI Integration Service for AIMANA Platform
// This service handles all AI-powered features

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Store API key in localStorage (in production, use secure backend)
const STORAGE_KEY = 'aimana_openai_key';

export const openaiService = {
  // Get stored API key
  getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  },

  // Set API key
  setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEY, key);
  },

  // Remove API key
  removeApiKey(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Check if API key is configured
  isConfigured(): boolean {
    return !!this.getApiKey();
  },

  // Chat completion
  async chat(
    messages: ChatMessage[],
    options?: Partial<OpenAIConfig>
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || 'gpt-4o-mini',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  // Stream chat completion
  async *chatStream(
    messages: ChatMessage[],
    options?: Partial<OpenAIConfig>
  ): AsyncGenerator<string, void, unknown> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || 'gpt-4o-mini',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens || 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) yield content;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  },
};

// System prompts for different features
export const systemPrompts = {
  aiTutor: `Você é o AI Tutor da AIMANA, uma plataforma de educação em Inteligência Artificial para empresas.

Seu papel é:
- Responder perguntas sobre IA de forma clara e acessível
- Adaptar a linguagem ao nível do usuário
- Dar exemplos práticos aplicáveis ao mundo corporativo
- Sugerir cursos e materiais da plataforma quando relevante
- Ser encorajador e motivador

Você tem conhecimento sobre:
- Machine Learning e Deep Learning
- IA Generativa (LLMs, difusão, etc)
- Prompt Engineering
- Ética e governança em IA
- Aplicações de IA em diferentes setores
- Ferramentas e plataformas de IA

Responda sempre em português brasileiro.`,

  policyGenerator: `Você é um especialista em governança de IA e compliance corporativo.

Sua tarefa é gerar políticas de IA personalizadas para empresas, seguindo as melhores práticas do mercado.

Ao gerar uma política, inclua:
1. Objetivo e escopo
2. Definições importantes
3. Diretrizes e regras claras
4. Responsabilidades
5. Procedimentos
6. Penalidades por violação
7. Revisão e atualização

Use linguagem formal mas acessível. A política deve ser prática e aplicável.

Responda sempre em português brasileiro.`,

  lifowAssistant: `Você é o assistente LIFOW (Learning In Flow of Work) da AIMANA.

Seu papel é ajudar colaboradores a resolverem problemas de trabalho usando IA, enquanto os educa sobre conceitos de IA relevantes.

Quando o usuário fizer uma pergunta:
1. Responda de forma prática e útil
2. Explique brevemente os conceitos de IA envolvidos
3. Sugira como a IA pode ajudar em situações similares
4. Quando relevante, indique que há cursos na plataforma sobre o tema

Seja conciso mas informativo. Foque em produtividade e aprendizado.

Responda sempre em português brasileiro.`,

  shadowAIAnalyzer: `Você é um especialista em análise de riscos de ferramentas de IA.

Ao receber informações sobre uma ferramenta de IA, analise:
1. Riscos de segurança de dados
2. Riscos de compliance (LGPD, etc)
3. Riscos de propriedade intelectual
4. Impacto na produtividade
5. Alternativas mais seguras
6. Recomendações de uso

Forneça uma avaliação estruturada com score de risco (baixo/médio/alto) para cada categoria.

Responda sempre em português brasileiro.`,

  maturityAssessment: `Você é um consultor especializado em transformação digital e maturidade em IA.

Com base nas respostas do questionário de maturidade, você deve:
1. Calcular scores por dimensão (Estratégia, Pessoas, Dados, Tecnologia, Processos, Governança)
2. Identificar pontos fortes e fracos
3. Fornecer recomendações específicas e priorizadas
4. Sugerir próximos passos práticos
5. Estimar tempo para evolução de nível

Seja objetivo e prático nas recomendações.

Responda sempre em português brasileiro.`,
};

export default openaiService;

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, ThumbsUp, ThumbsDown, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTutorChat } from '@/hooks/useAcademy';
import { useAuthStore } from '@/stores/authStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  rating?: 'up' | 'down';
}

interface AITutorProps {
  courseId: string;
  courseName: string;
  moduleId?: string;
  moduleName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  'Pode me explicar de forma mais simples?',
  'Qual é um exemplo prático disso?',
  'Como posso aplicar no meu trabalho?',
];

// Mock response generator (used as fallback when API is not available)
function generateMockResponse(_question: string, courseName: string): string {
  const responses = [
    `Ótima pergunta! No contexto de "${courseName}", isso significa que você pode aplicar esse conceito diretamente no seu trabalho.\n\nPor exemplo, se você está trabalhando com análise de dados, pode usar essa técnica para automatizar relatórios e identificar padrões importantes.`,
    `Vou explicar de forma mais simples:\n\nImagine que a IA é como um assistente super inteligente que aprende com exemplos. Quanto mais exemplos você der, melhor ele entende o que você precisa.\n\nNo seu caso, isso significa que você pode treinar a IA para entender o contexto específico do seu trabalho.`,
    `Excelente dúvida! Esse é um dos conceitos mais importantes do curso.\n\n**Passo a passo para aplicar:**\n1. Primeiro, identifique o problema que quer resolver\n2. Depois, estruture as informações de forma clara\n3. Por fim, use a técnica que aprendemos para obter resultados\n\nQuer que eu dê um exemplo mais específico?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export function AITutor({
  courseId,
  courseName,
  moduleId,
  moduleName,
  isOpen,
  onClose,
}: AITutorProps) {
  const { user } = useAuthStore();
  const tutorMutation = useTutorChat();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá! Sou o Tutor IA do curso "${courseName}". Estou aqui para ajudar com suas dúvidas${moduleName ? ` sobre "${moduleName}"` : ''}. O que você gostaria de saber?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [useMockMode, setUseMockMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset messages when course/module changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Olá! Sou o Tutor IA do curso "${courseName}". Estou aqui para ajudar com suas dúvidas${moduleName ? ` sobre "${moduleName}"` : ''}. O que você gostaria de saber?`,
        timestamp: new Date(),
      },
    ]);
  }, [courseId, moduleId, courseName, moduleName]);

  const handleSend = async () => {
    if (!input.trim() || tutorMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = input.trim();
    setInput('');

    // Build previous messages for context (exclude the welcome message)
    const previousMessages = messages
      .slice(1) // Skip welcome message
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Try to use the real API, fall back to mock if not available
    if (!useMockMode && user) {
      try {
        const response = await tutorMutation.mutateAsync({
          question,
          courseId,
          courseName,
          moduleId,
          moduleName,
          previousMessages,
        });

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error('AI Tutor API error:', error);
        // Fall back to mock mode
        setUseMockMode(true);
        const mockResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateMockResponse(question, courseName),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, mockResponse]);
      }
    } else {
      // Use mock mode
      setTimeout(() => {
        const mockResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateMockResponse(question, courseName),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, mockResponse]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
    // TODO: Send rating to API when implemented
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-full sm:w-[380px] bg-white border-l border-surface-border shadow-sidebar z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-border bg-gradient-to-r from-brand-coral/5 to-phase-execute/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-celebration flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text">Tutor IA</h3>
                <p className="text-xs text-text-muted">
                  {moduleName || courseName}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mock mode warning */}
          {useMockMode && (
            <div className="px-4 py-2 bg-status-warning/10 border-b border-status-warning/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-status-warning flex-shrink-0" />
              <p className="text-xs text-status-warning">
                Modo demonstração - Conecte a API para respostas reais
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                {/* Avatar */}
                {message.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded-lg bg-brand-coral/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-brand-coral" />
                  </div>
                ) : (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-phase-plan text-white">
                      {user?.name?.substring(0, 2).toUpperCase() || 'VC'}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Message bubble */}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5',
                    message.role === 'assistant'
                      ? 'bg-surface-light text-text rounded-tl-sm'
                      : 'bg-brand-coral text-white rounded-tr-sm'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Rating (only for assistant messages) */}
                  {message.role === 'assistant' && message.id !== '1' && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-surface-border/50">
                      <span className="text-xs text-text-muted mr-1">
                        Útil?
                      </span>
                      <button
                        onClick={() => handleRating(message.id, 'up')}
                        className={cn(
                          'p-1 rounded hover:bg-surface-hover transition-colors',
                          message.rating === 'up' && 'text-status-success'
                        )}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRating(message.id, 'down')}
                        className={cn(
                          'p-1 rounded hover:bg-surface-hover transition-colors',
                          message.rating === 'down' && 'text-status-error'
                        )}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {tutorMutation.isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-coral/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-brand-coral" />
                </div>
                <div className="bg-surface-light rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-coral" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-text-muted mb-2">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface-light hover:bg-surface-hover text-text-secondary transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-surface-border">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua dúvida..."
                className="min-h-[44px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || tutorMutation.isPending}
                size="icon"
                className="h-11 w-11 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-text-muted mt-2 text-center">
              Pressione Enter para enviar, Shift+Enter para nova linha
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Key, Trash2, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/services/openai';
import ReactMarkdown from 'react-markdown';

interface AIChatProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  systemPrompt: string;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string, history: ChatMessage[]) => Promise<string>;
  onConfigureKey: () => void;
  suggestedQuestions?: string[];
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat({
  title,
  subtitle,
  placeholder = 'Digite sua mensagem...',
  isConfigured,
  isLoading,
  error,
  onSendMessage,
  onConfigureKey,
  suggestedQuestions = [],
  className,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !isConfigured) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStreamingContent('');

    try {
      const history: ChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await onSendMessage(userMessage.content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch {
      // Error is handled by parent component
      setStreamingContent('');
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setStreamingContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isConfigured) {
    return (
      <Card className={cn('h-[500px] flex flex-col', className)}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-5 w-5 text-brand-teal" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-light flex items-center justify-center">
              <Key className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="font-semibold mb-2">Configure sua API Key</h3>
            <p className="text-sm text-text-muted mb-4">
              Para usar os recursos de IA, você precisa configurar sua chave de API do OpenAI.
            </p>
            <Button onClick={onConfigureKey}>
              <Key className="h-4 w-4 mr-2" />
              Configurar API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('h-[500px] flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand-teal" />
              {title}
            </CardTitle>
            {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearChat}>
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="py-8 text-center">
              <Bot className="h-12 w-12 mx-auto mb-3 text-brand-teal/50" />
              <p className="text-text-muted mb-4">
                Olá! Como posso ajudar você hoje?
              </p>
              {suggestedQuestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-text-muted mb-2">Sugestões:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-sm px-3 py-1.5 rounded-full bg-surface-light hover:bg-surface-hover transition-colors text-left"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-brand-teal" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2 group relative',
                  message.role === 'user'
                    ? 'bg-brand-navy text-white'
                    : 'bg-surface-light'
                )}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}

                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-surface-hover"
                  >
                    {copiedId === message.id ? (
                      <CheckCircle className="h-4 w-4 text-status-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-text-muted" />
                    )}
                  </button>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming response */}
          {isLoading && streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-brand-teal" />
              </div>
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-surface-light">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-brand-teal" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-surface-light">
                <Loader2 className="h-5 w-5 animate-spin text-brand-teal" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-auto max-w-sm p-3 rounded-lg bg-status-error/10 text-status-error text-sm text-center">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-surface-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 resize-none rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIChat;

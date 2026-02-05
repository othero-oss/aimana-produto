import { useState } from 'react';
import {
  Bot,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
  Plus,
  Settings,
  BarChart3,
  Clock,
  ThumbsUp,
  ArrowRight,
  Hash,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader, AIChat, OpenAIKeyModal } from '@/components/shared';
import { useLIFOWAssistant } from '@/hooks/useOpenAI';
import { systemPrompts } from '@/services/openai';

// Mock data
const mockChannels = [
  { id: '1', platform: 'slack', name: '#ia-duvidas', isActive: true, questionsCount: 234 },
  { id: '2', platform: 'slack', name: '#rh-ia', isActive: true, questionsCount: 89 },
  { id: '3', platform: 'teams', name: 'IA no Marketing', isActive: false, questionsCount: 0 },
];

const mockInsights = [
  { topic: 'Prompts efetivos', count: 45, trend: 12 },
  { topic: 'Automação com IA', count: 38, trend: 8 },
  { topic: 'Análise de dados', count: 32, trend: -3 },
  { topic: 'Ferramentas de IA', count: 28, trend: 15 },
  { topic: 'Ética em IA', count: 21, trend: 5 },
];

const mockRecentQuestions = [
  {
    id: '1',
    question: 'Como criar um prompt para resumir relatórios longos?',
    user: 'Ana Silva',
    channel: '#ia-duvidas',
    time: '5 min atrás',
    answered: true,
  },
  {
    id: '2',
    question: 'Qual a diferença entre GPT e Claude?',
    user: 'Carlos Mendes',
    channel: '#ia-duvidas',
    time: '12 min atrás',
    answered: true,
  },
  {
    id: '3',
    question: 'Posso usar IA para criar descrições de vagas?',
    user: 'Mariana Costa',
    channel: '#rh-ia',
    time: '1h atrás',
    answered: true,
  },
];

// Simple stat card component
function StatCard({ title, value, subtitle, icon: Icon, change }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  change?: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-text-muted mt-1">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg bg-surface-light">
          <Icon className="h-5 w-5 text-brand-secondary" />
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${change >= 0 ? 'text-status-success' : 'text-status-error'}`}>
          <TrendingUp className="h-4 w-4" />
          <span>{change > 0 ? '+' : ''}{change}%</span>
        </div>
      )}
    </Card>
  );
}

export function LIFOW() {
  const [activeTab, setActiveTab] = useState('status');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const lifowAssistant = useLIFOWAssistant();

  return (
    <div className="space-y-6">
      <PageHeader
        title="LIFOW"
        description="Learning In Flow of Work - O oráculo de IA que responde dúvidas onde sua equipe trabalha"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-1.5">
            <Bot className="h-4 w-4" />
            Testar LIFOW
          </TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          {/* Status Card */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Status do LIFOW</CardTitle>
                  <Badge className="bg-status-success text-white">Ativo</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-surface-light rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Oráculo AIMANA</p>
                    <p className="text-xs text-text-muted">Respondendo em tempo real</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Canais conectados</p>
                  {mockChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-text-muted" />
                        <span className="text-sm">{channel.name}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${channel.isActive ? 'bg-status-success' : 'bg-status-pending'}`} />
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar canal
                </Button>
              </CardContent>
            </Card>

            {/* Metrics */}
            <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
              <StatCard
                title="Perguntas respondidas"
                value="1.247"
                subtitle="Esta semana"
                change={23}
                icon={MessageSquare}
              />
              <StatCard
                title="Conteúdos sugeridos"
                value="432"
                subtitle="Módulos recomendados"
                change={18}
                icon={Sparkles}
              />
              <StatCard
                title="Satisfação"
                value="94%"
                subtitle="Respostas úteis"
                change={5}
                icon={ThumbsUp}
              />
            </div>
          </div>

          {/* Insights and Recent Questions */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-teal" />
                  Tópicos mais perguntados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockInsights.map((insight, index) => (
                  <div key={insight.topic} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-muted w-5">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{insight.topic}</span>
                        <span className="text-xs text-text-muted">{insight.count} perguntas</span>
                      </div>
                      <Progress value={(insight.count / 50) * 100} className="h-1.5" />
                    </div>
                    <Badge
                      variant={insight.trend > 0 ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {insight.trend > 0 ? '+' : ''}{insight.trend}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-secondary" />
                  Perguntas recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg bg-surface-light hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium mb-1 line-clamp-1">{q.question}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{q.user}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {q.channel.replace('#', '')}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted">{q.time}</span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  Ver todas as perguntas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Insight */}
          <Card className="bg-gradient-to-r from-brand-navy to-brand-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Insight da semana</h3>
                  <p className="text-white/80 text-sm">
                    As perguntas sobre "Prompts efetivos" aumentaram 45% esta semana.
                    Considere criar um workshop ou módulo específico sobre técnicas de prompt engineering
                    para atender essa demanda crescente.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Criar conteúdo sugerido
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LIFOW Demo/Test Tab */}
        <TabsContent value="demo">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIChat
                title="LIFOW - Oráculo de IA"
                subtitle="Tire suas dúvidas sobre IA no fluxo de trabalho"
                placeholder="Faça uma pergunta sobre IA aplicada ao trabalho..."
                systemPrompt={systemPrompts.lifowAssistant}
                isConfigured={lifowAssistant.isConfigured}
                isLoading={lifowAssistant.isLoading}
                error={lifowAssistant.error}
                onSendMessage={(message, history) => lifowAssistant.askAssistant(message, undefined, history)}
                onConfigureKey={() => setShowApiKeyModal(true)}
                suggestedQuestions={[
                  'Como usar IA para escrever e-mails?',
                  'Como automatizar tarefas repetitivas?',
                  'Qual ferramenta de IA devo usar para análise de dados?',
                  'Como criar um prompt efetivo?',
                ]}
                className="h-[600px]"
              />
            </div>
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-brand-navy to-brand-secondary text-white">
                <CardContent className="p-5">
                  <Zap className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Teste o LIFOW</h3>
                  <p className="text-sm text-white/80">
                    Esta é uma demonstração do oráculo de IA. Em produção, ele responderá automaticamente nos canais conectados da sua empresa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Como funciona o LIFOW?</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-brand-teal">1</span>
                      </span>
                      <span>Colaborador faz uma pergunta no Slack/Teams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-brand-teal">2</span>
                      </span>
                      <span>LIFOW responde com base no conhecimento da plataforma</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-brand-teal">3</span>
                      </span>
                      <span>Sugere cursos e conteúdos relevantes da Academy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-brand-teal">4</span>
                      </span>
                      <span>Gera insights sobre dúvidas frequentes da equipe</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Perguntas populares</h3>
                  <div className="space-y-2">
                    {['Prompts', 'Automação', 'ChatGPT', 'Produtividade', 'Análise de dados'].map((topic) => (
                      <div key={topic} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{topic}</span>
                        <Badge variant="secondary" className="text-xs">Trending</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do LIFOW
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border border-dashed border-surface-border rounded-lg text-center">
                <Bot className="h-12 w-12 mx-auto mb-4 text-text-muted" />
                <h3 className="font-medium mb-2">Configure seu oráculo de IA</h3>
                <p className="text-sm text-text-muted mb-4">
                  Conecte o LIFOW aos canais onde sua equipe trabalha para responder dúvidas sobre IA em tempo real.
                </p>
                <div className="flex justify-center gap-3">
                  <Button>
                    Conectar Slack
                  </Button>
                  <Button variant="outline">
                    Conectar Teams
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics do LIFOW
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-text-muted" />
                <h3 className="font-medium mb-2">Analytics em desenvolvimento</h3>
                <p className="text-sm text-text-muted">
                  Em breve você terá acesso a gráficos detalhados sobre o uso do LIFOW.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de interações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-text-muted" />
                <h3 className="font-medium mb-2">Histórico completo</h3>
                <p className="text-sm text-text-muted">
                  Todas as interações do LIFOW ficarão disponíveis aqui para consulta.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Key Modal */}
      <OpenAIKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={(key) => {
          lifowAssistant.configureApiKey(key);
          setShowApiKeyModal(false);
        }}
      />
    </div>
  );
}

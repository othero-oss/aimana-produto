import { useState } from 'react';
import {
  Lightbulb,
  Rocket,
  CheckCircle2,
  Clock,
  Plus,
  Bot,
  Target,
  Calendar,
  Filter,
  Search,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  AlertCircle,
  ChevronRight,
  X,
  Send,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader, OpenAIKeyModal } from '@/components/shared';
import { useOpenAI } from '@/hooks/useOpenAI';

// Types
interface AIIdea {
  id: string;
  title: string;
  description: string;
  area: string;
  submittedBy: string;
  submittedAt: string;
  status: 'submitted' | 'evaluating' | 'approved' | 'rejected' | 'backlog' | 'in_progress' | 'implemented';
  complexity: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  effort: number; // 1-10
  value: number; // 1-10
  votes: number;
  comments: number;
  aiAnalysis?: string;
}

// Mock data
const mockIdeas: AIIdea[] = [
  {
    id: '1',
    title: 'Chatbot para atendimento ao cliente',
    description: 'Implementar um chatbot com IA para responder perguntas frequentes dos clientes 24/7',
    area: 'Atendimento',
    submittedBy: 'Maria Santos',
    submittedAt: '2025-02-01',
    status: 'in_progress',
    complexity: 'medium',
    impact: 'high',
    effort: 6,
    value: 9,
    votes: 24,
    comments: 8,
  },
  {
    id: '2',
    title: 'Automação de relatórios financeiros',
    description: 'Usar IA para gerar automaticamente relatórios financeiros mensais com análises de tendências',
    area: 'Financeiro',
    submittedBy: 'Carlos Lima',
    submittedAt: '2025-01-28',
    status: 'approved',
    complexity: 'high',
    impact: 'high',
    effort: 8,
    value: 9,
    votes: 18,
    comments: 5,
  },
  {
    id: '3',
    title: 'Triagem de currículos com IA',
    description: 'Automatizar a análise inicial de currículos para acelerar o processo de recrutamento',
    area: 'RH',
    submittedBy: 'Ana Oliveira',
    submittedAt: '2025-02-03',
    status: 'evaluating',
    complexity: 'medium',
    impact: 'medium',
    effort: 5,
    value: 7,
    votes: 12,
    comments: 3,
  },
  {
    id: '4',
    title: 'Geração de conteúdo para redes sociais',
    description: 'Utilizar IA generativa para criar posts e artes para as redes sociais da empresa',
    area: 'Marketing',
    submittedBy: 'Pedro Souza',
    submittedAt: '2025-02-04',
    status: 'submitted',
    complexity: 'low',
    impact: 'medium',
    effort: 3,
    value: 6,
    votes: 8,
    comments: 2,
  },
  {
    id: '5',
    title: 'Previsão de demanda com ML',
    description: 'Implementar modelo de machine learning para prever demanda de produtos e otimizar estoque',
    area: 'Operações',
    submittedBy: 'Lucia Ferreira',
    submittedAt: '2025-01-15',
    status: 'implemented',
    complexity: 'high',
    impact: 'high',
    effort: 9,
    value: 10,
    votes: 32,
    comments: 12,
  },
  {
    id: '6',
    title: 'Assistente virtual para vendas',
    description: 'Criar um assistente de IA para ajudar vendedores a encontrar informações de produtos rapidamente',
    area: 'Vendas',
    submittedBy: 'Roberto Alves',
    submittedAt: '2025-01-20',
    status: 'backlog',
    complexity: 'medium',
    impact: 'high',
    effort: 7,
    value: 8,
    votes: 15,
    comments: 4,
  },
];

const getStatusConfig = (status: AIIdea['status']) => {
  switch (status) {
    case 'submitted':
      return { label: 'Submetida', color: 'bg-status-pending text-white', icon: Lightbulb };
    case 'evaluating':
      return { label: 'Em avaliação', color: 'bg-status-warning text-white', icon: Search };
    case 'approved':
      return { label: 'Aprovada', color: 'bg-status-success text-white', icon: CheckCircle2 };
    case 'rejected':
      return { label: 'Rejeitada', color: 'bg-status-error text-white', icon: X };
    case 'backlog':
      return { label: 'Backlog', color: 'bg-brand-secondary text-white', icon: Clock };
    case 'in_progress':
      return { label: 'Em andamento', color: 'bg-brand-teal text-white', icon: Rocket };
    case 'implemented':
      return { label: 'Implementada', color: 'bg-brand-navy text-white', icon: CheckCircle2 };
    default:
      return { label: status, color: 'bg-gray-500 text-white', icon: Clock };
  }
};

const getComplexityBadge = (complexity: AIIdea['complexity']) => {
  switch (complexity) {
    case 'low':
      return <Badge variant="success">Baixa</Badge>;
    case 'medium':
      return <Badge variant="warning">Média</Badge>;
    case 'high':
      return <Badge variant="error">Alta</Badge>;
  }
};

const getImpactBadge = (impact: AIIdea['impact']) => {
  switch (impact) {
    case 'low':
      return <Badge variant="outline">Baixo</Badge>;
    case 'medium':
      return <Badge variant="secondary">Médio</Badge>;
    case 'high':
      return <Badge className="bg-brand-teal text-white">Alto</Badge>;
  }
};

// Idea Assistant System Prompt
const ideaAssistantPrompt = `Você é um especialista em transformação digital e implementação de IA em empresas.

Sua tarefa é ajudar colaboradores a estruturar e melhorar ideias de aplicação de IA. Ao receber uma ideia:

1. Faça perguntas para entender melhor o contexto se necessário
2. Avalie a complexidade técnica (baixa/média/alta) com justificativa
3. Avalie o potencial de impacto (baixo/médio/alto) com justificativa
4. Identifique riscos e desafios
5. Sugira melhorias na descrição para deixar mais clara
6. Estime esforço (1-10) e valor potencial (1-10)
7. Recomende próximos passos

Seja encorajador mas realista. Use linguagem clara e acessível.

Formate a resposta de forma estruturada com seções claras.

Responda sempre em português brasileiro.`;

export function AIHub() {
  const [activeTab, setActiveTab] = useState('funnel');
  const [selectedIdea, setSelectedIdea] = useState<AIIdea | null>(null);
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [filterArea, setFilterArea] = useState<string>('all');

  // New idea form state
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    area: '',
  });
  const [aiAnalysis, setAiAnalysis] = useState('');

  const openai = useOpenAI();

  // Group ideas by status for the funnel
  const funnelStages = [
    { status: 'submitted', title: 'Submetidas', ideas: mockIdeas.filter(i => i.status === 'submitted') },
    { status: 'evaluating', title: 'Em Avaliação', ideas: mockIdeas.filter(i => i.status === 'evaluating') },
    { status: 'approved', title: 'Aprovadas', ideas: mockIdeas.filter(i => i.status === 'approved') },
    { status: 'backlog', title: 'Backlog', ideas: mockIdeas.filter(i => i.status === 'backlog') },
  ];

  const projectStages = [
    { status: 'in_progress', title: 'Em Andamento', ideas: mockIdeas.filter(i => i.status === 'in_progress') },
    { status: 'implemented', title: 'Implementados', ideas: mockIdeas.filter(i => i.status === 'implemented') },
  ];

  const areas = ['all', ...new Set(mockIdeas.map(i => i.area))];

  const handleAnalyzeIdea = async () => {
    if (!newIdea.title || !newIdea.description) return;

    if (!openai.isConfigured) {
      setShowApiKeyModal(true);
      return;
    }

    const prompt = `Analise a seguinte ideia de aplicação de IA:

Título: ${newIdea.title}
Área: ${newIdea.area || 'Não especificada'}
Descrição: ${newIdea.description}

Forneça uma análise completa seguindo a estrutura definida.`;

    try {
      const response = await openai.streamMessage(
        [{ role: 'user', content: prompt }],
        ideaAssistantPrompt
      );
      setAiAnalysis(response);
    } catch {
      // Error handled by hook
    }
  };

  const IdeaCard = ({ idea, compact = false }: { idea: AIIdea; compact?: boolean }) => {
    const config = getStatusConfig(idea.status);

    return (
      <Card
        className="hover:shadow-card-hover transition-shadow cursor-pointer"
        onClick={() => setSelectedIdea(idea)}
      >
        <CardContent className={compact ? 'p-3' : 'p-4'}>
          <div className="flex items-start justify-between mb-2">
            <Badge className={config.color}>
              <config.icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {idea.votes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {idea.comments}
              </span>
            </div>
          </div>

          <h3 className={`font-semibold ${compact ? 'text-sm' : ''} mb-1 line-clamp-1`}>
            {idea.title}
          </h3>

          {!compact && (
            <p className="text-sm text-text-muted mb-3 line-clamp-2">
              {idea.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getComplexityBadge(idea.complexity)}
              {getImpactBadge(idea.impact)}
            </div>
            <span className="text-xs text-text-muted">{idea.area}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Hub"
        description="Gerencie a implementação de IA na sua empresa - do conceito à produção"
        actions={
          <Button onClick={() => setShowNewIdeaModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Submeter Ideia
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-pending/10">
              <Lightbulb className="h-5 w-5 text-status-pending" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockIdeas.filter(i => i.status === 'submitted').length}</p>
              <p className="text-xs text-text-muted">Novas ideias</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-warning/10">
              <Search className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockIdeas.filter(i => i.status === 'evaluating').length}</p>
              <p className="text-xs text-text-muted">Em avaliação</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-secondary/10">
              <Clock className="h-5 w-5 text-brand-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockIdeas.filter(i => ['approved', 'backlog'].includes(i.status)).length}</p>
              <p className="text-xs text-text-muted">No backlog</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-teal/10">
              <Rocket className="h-5 w-5 text-brand-teal" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockIdeas.filter(i => i.status === 'in_progress').length}</p>
              <p className="text-xs text-text-muted">Em andamento</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-navy/10">
              <CheckCircle2 className="h-5 w-5 text-brand-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockIdeas.filter(i => i.status === 'implemented').length}</p>
              <p className="text-xs text-text-muted">Implementados</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="funnel" className="flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4" />
            Funil de Ideias
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1.5">
            <Rocket className="h-4 w-4" />
            Projetos
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            Matriz de Priorização
          </TabsTrigger>
        </TabsList>

        {/* Funil de Ideias */}
        <TabsContent value="funnel" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-muted">Filtrar por área:</span>
            </div>
            <div className="flex gap-2">
              {areas.map((area) => (
                <Button
                  key={area}
                  variant={filterArea === area ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterArea(area)}
                >
                  {area === 'all' ? 'Todas' : area}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {funnelStages.map((stage) => {
              const config = getStatusConfig(stage.status as AIIdea['status']);
              const filteredIdeas = stage.ideas.filter(
                i => filterArea === 'all' || i.area === filterArea
              );

              return (
                <div key={stage.status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <config.icon className="h-4 w-4" />
                      {stage.title}
                    </h3>
                    <Badge variant="secondary">{filteredIdeas.length}</Badge>
                  </div>
                  <div className="space-y-3 min-h-[200px] p-2 bg-surface-light/50 rounded-lg">
                    {filteredIdeas.map((idea) => (
                      <IdeaCard key={idea.id} idea={idea} compact />
                    ))}
                    {filteredIdeas.length === 0 && (
                      <div className="text-center py-8 text-text-muted text-sm">
                        Nenhuma ideia nesta fase
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Projetos */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {projectStages.map((stage) => {
              const config = getStatusConfig(stage.status as AIIdea['status']);

              return (
                <Card key={stage.status}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <config.icon className="h-5 w-5" />
                      {stage.title}
                      <Badge variant="secondary" className="ml-auto">{stage.ideas.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stage.ideas.map((idea) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-lg border border-surface-border hover:bg-surface-hover transition-colors cursor-pointer"
                        onClick={() => setSelectedIdea(idea)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{idea.title}</h4>
                          <Badge variant="outline">{idea.area}</Badge>
                        </div>
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">
                          {idea.description}
                        </p>
                        {stage.status === 'in_progress' && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-text-muted">Progresso</span>
                              <span className="font-medium">65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border">
                          <div className="flex items-center gap-2">
                            {getComplexityBadge(idea.complexity)}
                            {getImpactBadge(idea.impact)}
                          </div>
                          <Button variant="ghost" size="sm">
                            Ver detalhes
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {stage.ideas.length === 0 && (
                      <div className="text-center py-8 text-text-muted">
                        Nenhum projeto nesta fase
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Roadmap */}
        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Roadmap de IA 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Q1 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-sm">
                      Q1
                    </span>
                    Janeiro - Março 2025
                  </h3>
                  <div className="ml-10 space-y-2">
                    {mockIdeas.filter(i => i.status === 'implemented').map((idea) => (
                      <div key={idea.id} className="flex items-center gap-3 p-3 bg-surface-light rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-status-success" />
                        <div>
                          <p className="font-medium text-sm">{idea.title}</p>
                          <p className="text-xs text-text-muted">{idea.area}</p>
                        </div>
                        <Badge className="ml-auto bg-status-success text-white">Implementado</Badge>
                      </div>
                    ))}
                    {mockIdeas.filter(i => i.status === 'in_progress').map((idea) => (
                      <div key={idea.id} className="flex items-center gap-3 p-3 bg-surface-light rounded-lg">
                        <Rocket className="h-5 w-5 text-brand-teal" />
                        <div>
                          <p className="font-medium text-sm">{idea.title}</p>
                          <p className="text-xs text-text-muted">{idea.area}</p>
                        </div>
                        <Badge className="ml-auto bg-brand-teal text-white">Em andamento</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-secondary text-white flex items-center justify-center text-sm">
                      Q2
                    </span>
                    Abril - Junho 2025
                  </h3>
                  <div className="ml-10 space-y-2">
                    {mockIdeas.filter(i => ['approved', 'backlog'].includes(i.status)).slice(0, 2).map((idea) => (
                      <div key={idea.id} className="flex items-center gap-3 p-3 bg-surface-light rounded-lg">
                        <Clock className="h-5 w-5 text-brand-secondary" />
                        <div>
                          <p className="font-medium text-sm">{idea.title}</p>
                          <p className="text-xs text-text-muted">{idea.area}</p>
                        </div>
                        <Badge className="ml-auto bg-brand-secondary text-white">Planejado</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q3-Q4 */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-sm">
                      Q3+
                    </span>
                    Julho - Dezembro 2025
                  </h3>
                  <div className="ml-10 p-4 border border-dashed border-surface-border rounded-lg text-center">
                    <p className="text-sm text-text-muted">
                      Projetos serão adicionados conforme avaliação e priorização
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matriz de Priorização */}
        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Matriz Esforço x Valor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[500px] border border-surface-border rounded-lg p-4">
                {/* Axis labels */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-text-muted">
                  VALOR
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-medium text-text-muted">
                  ESFORÇO
                </div>

                {/* Quadrants */}
                <div className="absolute inset-8 grid grid-cols-2 grid-rows-2 gap-2">
                  <div className="bg-status-success/10 rounded-lg p-2 flex flex-col">
                    <span className="text-xs font-medium text-status-success mb-2">Quick Wins</span>
                    <span className="text-xs text-text-muted">Alto valor, baixo esforço</span>
                  </div>
                  <div className="bg-brand-teal/10 rounded-lg p-2 flex flex-col">
                    <span className="text-xs font-medium text-brand-teal mb-2">Projetos Estratégicos</span>
                    <span className="text-xs text-text-muted">Alto valor, alto esforço</span>
                  </div>
                  <div className="bg-status-pending/10 rounded-lg p-2 flex flex-col">
                    <span className="text-xs font-medium text-status-pending mb-2">Melhorias</span>
                    <span className="text-xs text-text-muted">Baixo valor, baixo esforço</span>
                  </div>
                  <div className="bg-status-error/10 rounded-lg p-2 flex flex-col">
                    <span className="text-xs font-medium text-status-error mb-2">Evitar</span>
                    <span className="text-xs text-text-muted">Baixo valor, alto esforço</span>
                  </div>
                </div>

                {/* Ideas plotted */}
                {mockIdeas.map((idea) => {
                  // Calculate position based on effort and value
                  const left = 8 + (idea.effort / 10) * 84; // 8% to 92%
                  const top = 8 + ((10 - idea.value) / 10) * 84; // Inverted for Y axis

                  return (
                    <div
                      key={idea.id}
                      className="absolute w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                      style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
                      title={idea.title}
                      onClick={() => setSelectedIdea(idea)}
                    >
                      {idea.title.charAt(0)}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {mockIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-teal"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <span className="w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold">
                      {idea.title.charAt(0)}
                    </span>
                    <span className="text-text-secondary">{idea.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Idea Modal */}
      <Dialog open={showNewIdeaModal} onOpenChange={setShowNewIdeaModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-teal" />
              Submeter Nova Ideia
            </DialogTitle>
            <DialogDescription>
              Descreva sua ideia de aplicação de IA. O assistente irá ajudar a estruturar e avaliar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da ideia</Label>
              <Input
                id="title"
                placeholder="Ex: Chatbot para atendimento ao cliente"
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Input
                id="area"
                placeholder="Ex: Atendimento, Marketing, RH, Vendas..."
                value={newIdea.area}
                onChange={(e) => setNewIdea({ ...newIdea, area: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                placeholder="Descreva sua ideia em detalhes: o problema que resolve, como funcionaria, benefícios esperados..."
                className="w-full min-h-[120px] px-3 py-2 border border-surface-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                value={newIdea.description}
                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
              />
            </div>

            <Button
              onClick={handleAnalyzeIdea}
              disabled={!newIdea.title || !newIdea.description || openai.isLoading}
              className="w-full"
              variant="outline"
            >
              {openai.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Analisar com Assistente IA
                </>
              )}
            </Button>

            {aiAnalysis && (
              <Card className="bg-surface-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4 text-brand-teal" />
                    Análise do Assistente IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm">{aiAnalysis}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {openai.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-status-error/10 text-status-error text-sm">
                <AlertCircle className="h-4 w-4" />
                {openai.error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowNewIdeaModal(false);
              setNewIdea({ title: '', description: '', area: '' });
              setAiAnalysis('');
            }}>
              Cancelar
            </Button>
            <Button onClick={() => {
              // In a real app, this would submit to an API
              alert('Ideia submetida com sucesso!');
              setShowNewIdeaModal(false);
              setNewIdea({ title: '', description: '', area: '' });
              setAiAnalysis('');
            }}>
              <Send className="h-4 w-4 mr-2" />
              Submeter Ideia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedIdea.title}</DialogTitle>
              <DialogDescription>
                Submetida por {selectedIdea.submittedBy} em {new Date(selectedIdea.submittedAt).toLocaleDateString('pt-BR')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusConfig(selectedIdea.status).color}>
                  {getStatusConfig(selectedIdea.status).label}
                </Badge>
                {getComplexityBadge(selectedIdea.complexity)}
                {getImpactBadge(selectedIdea.impact)}
                <Badge variant="outline">{selectedIdea.area}</Badge>
              </div>

              <p className="text-sm text-text-secondary">{selectedIdea.description}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-border">
                <div>
                  <p className="text-xs text-text-muted mb-1">Esforço estimado</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedIdea.effort * 10} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{selectedIdea.effort}/10</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Valor potencial</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedIdea.value * 10} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{selectedIdea.value}/10</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-text-muted hover:text-brand-teal">
                    <ThumbsUp className="h-4 w-4" />
                    {selectedIdea.votes} votos
                  </button>
                  <button className="flex items-center gap-1 text-sm text-text-muted hover:text-brand-teal">
                    <MessageSquare className="h-4 w-4" />
                    {selectedIdea.comments} comentários
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedIdea(null)}>
                Fechar
              </Button>
              <Button>
                <ThumbsUp className="h-4 w-4 mr-2" />
                Votar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* API Key Modal */}
      <OpenAIKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={(key) => {
          openai.configureApiKey(key);
          setShowApiKeyModal(false);
        }}
      />
    </div>
  );
}

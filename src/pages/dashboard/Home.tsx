import { useAuthStore } from '@/stores/authStore';
import { getGreeting } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/shared/StatsCard';
import { JourneyTimeline } from '@/components/shared/JourneyTimeline';
import {
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  BookOpen,
  Bot,
  ArrowRight,
  Play,
  Calendar,
} from 'lucide-react';
import type { JourneyPhase, ActivityItem } from '@/types/control';

export function Home() {
  const { user } = useAuthStore();
  const greeting = getGreeting();

  // Mock data - will come from API
  const overallProgress = 42;

  const phases: JourneyPhase[] = [
    {
      id: 'plan',
      name: 'PLANEJAR',
      status: 'completed',
      progress: 100,
      color: '#4573D2',
    },
    {
      id: 'execute',
      name: 'EXECUTAR',
      status: 'in_progress',
      progress: 65,
      color: '#F8A325',
      nextStep: 'Concluir módulo de Prompts Avançados',
    },
    {
      id: 'manage',
      name: 'GERIR',
      status: 'locked',
      progress: 0,
      color: '#9B5DE5',
    },
  ];

  const stats = {
    maturity: { value: 58, change: 12 },
    trained: { current: 47, total: 150, change: 8 },
    tools: { value: 12, change: 3 },
    roi: { value: 67000, change: 15 },
  };

  const currentCourse = {
    id: '1',
    title: 'Fundamentos de IA para Negócios',
    progress: 65,
    currentModule: 'Módulo 4: Prompts Avançados',
    thumbnail: null,
  };

  const lifowInsights = {
    questionsThisWeek: 127,
    topQuestion: 'Como usar IA para análise de dados?',
    contentsSuggested: 34,
  };

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'course_completed',
      title: 'Maria Silva completou um curso',
      description: 'Introdução à IA Generativa',
      timestamp: '5 minutos atrás',
    },
    {
      id: '2',
      type: 'certificate_earned',
      title: 'João Santos ganhou certificado',
      description: 'IA para Vendas - Nível 2',
      timestamp: '1 hora atrás',
    },
    {
      id: '3',
      type: 'user_joined',
      title: 'Novo membro na equipe',
      description: 'Ana Costa entrou na plataforma',
      timestamp: '2 horas atrás',
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Live: Agentes de IA na Prática',
      date: 'Amanhã, 15:00',
      type: 'live',
    },
    {
      id: '2',
      title: 'Mentoria: Estratégia de IA',
      date: 'Quinta, 14:00',
      type: 'mentoria',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-header text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/70">
                Você está {overallProgress}% mais perto de se tornar uma empresa
                AI First
              </p>
            </div>
            <div className="w-full md:w-64">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/70">Progresso geral</span>
                <span className="font-semibold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} variant="gradient" className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Timeline */}
      <JourneyTimeline phases={phases} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Maturidade IA"
          value={`${stats.maturity.value}/100`}
          change={stats.maturity.change}
          changeLabel=" pts"
          icon={<TrendingUp className="h-5 w-5 text-phase-plan" />}
        />
        <StatsCard
          title="Capacitados"
          value={`${stats.trained.current}/${stats.trained.total}`}
          subtitle={`${Math.round((stats.trained.current / stats.trained.total) * 100)}% do time`}
          change={stats.trained.change}
          changeLabel=" esta semana"
          icon={<Users className="h-5 w-5 text-phase-execute" />}
        />
        <StatsCard
          title="Ferramentas IA"
          value={stats.tools.value}
          subtitle="detectadas"
          change={stats.tools.change}
          changeLabel=" novas"
          trend="up"
          icon={<Wrench className="h-5 w-5 text-brand-coral" />}
        />
        <StatsCard
          title="ROI Estimado"
          value={`R$ ${(stats.roi.value / 1000).toFixed(0)}k`}
          subtitle="por mês"
          change={stats.roi.change}
          icon={<DollarSign className="h-5 w-5 text-status-success" />}
        />
      </div>

      {/* Two Column Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-coral" />
                Continue aprendendo
              </CardTitle>
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {/* Thumbnail placeholder */}
              <div className="w-32 h-24 rounded-lg bg-gradient-celebration flex items-center justify-center flex-shrink-0">
                <Play className="h-8 w-8 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-text mb-1 truncate">
                  {currentCourse.title}
                </h4>
                <p className="text-sm text-text-secondary mb-3">
                  {currentCourse.currentModule}
                </p>
                <div className="flex items-center gap-3">
                  <Progress
                    value={currentCourse.progress}
                    variant="gradient"
                    className="flex-1 h-1.5"
                  />
                  <span className="text-sm font-medium text-text-secondary">
                    {currentCourse.progress}%
                  </span>
                </div>
                <Button size="sm" className="mt-3">
                  Continuar
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LIFOW Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-coral" />
                LIFOW Insights
              </CardTitle>
              <Badge variant="success">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-text-secondary">Perguntas esta semana</p>
                  <p className="text-2xl font-bold text-text">
                    {lifowInsights.questionsThisWeek}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Conteúdos sugeridos</p>
                  <p className="text-2xl font-bold text-text">
                    {lifowInsights.contentsSuggested}
                  </p>
                </div>
              </div>

              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-xs text-text-muted mb-1">Pergunta mais frequente:</p>
                <p className="text-sm text-text font-medium">
                  "{lifowInsights.topQuestion}"
                </p>
              </div>

              <Button variant="outline" className="w-full">
                Ver detalhes do LIFOW
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Events */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-surface-border last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-coral/10 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'course_completed' && (
                      <BookOpen className="h-4 w-4 text-brand-coral" />
                    )}
                    {activity.type === 'certificate_earned' && (
                      <TrendingUp className="h-4 w-4 text-status-success" />
                    )}
                    {activity.type === 'user_joined' && (
                      <Users className="h-4 w-4 text-phase-plan" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">
                      {activity.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-phase-manage" />
              Próximos eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-surface-light hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium text-text mb-1">
                    {event.title}
                  </p>
                  <p className="text-xs text-text-secondary">{event.date}</p>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Ver calendário
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

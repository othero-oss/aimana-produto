import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  DollarSign,
  Clock,
  Target,
  Download,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader, StatsCard } from '@/components/shared';

// Mock data
const mockMetrics = {
  maturityScore: 58,
  trainedUsers: 47,
  totalUsers: 150,
  coursesCompleted: 234,
  totalStudyHours: 1280,
  roi: 67000,
  adoptionRate: 72,
  nps: 78,
};

const mockTeamProgress = [
  { name: 'Marketing', trained: 12, total: 15, avgProgress: 78 },
  { name: 'Vendas', trained: 8, total: 20, avgProgress: 45 },
  { name: 'RH', trained: 5, total: 8, avgProgress: 92 },
  { name: 'TI', trained: 15, total: 18, avgProgress: 85 },
  { name: 'Financeiro', trained: 7, total: 12, avgProgress: 62 },
];

const mockPDI = [
  { user: 'Ana Silva', department: 'Marketing', currentLevel: 1, targetLevel: 2, progress: 65, deadline: '2025-03-15' },
  { user: 'Carlos Santos', department: 'Vendas', currentLevel: 0, targetLevel: 1, progress: 30, deadline: '2025-04-01' },
  { user: 'Maria Oliveira', department: 'RH', currentLevel: 2, targetLevel: 3, progress: 45, deadline: '2025-05-01' },
  { user: 'João Lima', department: 'TI', currentLevel: 1, targetLevel: 2, progress: 80, deadline: '2025-02-28' },
];

export function Control() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control Center"
        description="Acompanhe métricas e resultados da transformação AI First"
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar relatório
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Formações</TabsTrigger>
          <TabsTrigger value="lifow">LIFOW</TabsTrigger>
          <TabsTrigger value="maturity">Maturidade</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Score de Maturidade"
              value={`${mockMetrics.maturityScore}/100`}
              subtitle="Nível: Explorador"
              change={12}
              icon={<Target className="h-5 w-5 text-brand-teal" />}
            />
            <StatsCard
              title="Pessoas Capacitadas"
              value={`${mockMetrics.trainedUsers}/${mockMetrics.totalUsers}`}
              subtitle={`${Math.round((mockMetrics.trainedUsers / mockMetrics.totalUsers) * 100)}% do time`}
              change={8}
              icon={<Users className="h-5 w-5 text-brand-secondary" />}
            />
            <StatsCard
              title="Cursos Completados"
              value={mockMetrics.coursesCompleted.toString()}
              subtitle={`${mockMetrics.totalStudyHours}h de estudo`}
              change={23}
              icon={<BookOpen className="h-5 w-5 text-brand-navy" />}
            />
            <StatsCard
              title="ROI Estimado"
              value={`R$ ${(mockMetrics.roi / 1000).toFixed(0)}k`}
              subtitle="Por mês"
              change={15}
              icon={<DollarSign className="h-5 w-5 text-status-success" />}
            />
          </div>

          {/* Team Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-secondary" />
                Progresso por área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamProgress.map((team) => (
                  <div key={team.name} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{team.name}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">{team.trained}/{team.total} treinados</span>
                        <span className="font-medium">{team.avgProgress}%</span>
                      </div>
                      <Progress value={team.avgProgress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROI Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-teal" />
                ROI ao longo do tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-surface-light rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-text-muted" />
                  <p className="text-sm text-text-muted">Gráfico de ROI em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {/* Training Metrics */}
          <div className="grid sm:grid-cols-4 gap-4">
            <StatsCard
              title="Pessoas Treinadas"
              value="47"
              subtitle="De 150 colaboradores"
              icon={<Users className="h-5 w-5 text-brand-secondary" />}
            />
            <StatsCard
              title="Horas de Estudo"
              value="1.280"
              subtitle="Total acumulado"
              icon={<Clock className="h-5 w-5 text-brand-teal" />}
            />
            <StatsCard
              title="NPS da Formação"
              value="78"
              subtitle="Promotores: 65%"
              icon={<TrendingUp className="h-5 w-5 text-status-success" />}
            />
            <StatsCard
              title="Certificados"
              value="89"
              subtitle="Emitidos este mês"
              icon={<Award className="h-5 w-5 text-brand-navy" />}
            />
          </div>

          {/* PDI Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-secondary" />
                Planos de Desenvolvimento Individual (PDI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Colaborador</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Área</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Nível Atual</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Meta</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Progresso</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPDI.map((pdi, index) => (
                      <tr key={index} className="border-b border-surface-border hover:bg-surface-hover">
                        <td className="py-3 px-4 font-medium">{pdi.user}</td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{pdi.department}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">Nível {pdi.currentLevel}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">Nível {pdi.targetLevel}</Badge>
                        </td>
                        <td className="py-3 px-4 w-32">
                          <div className="flex items-center gap-2">
                            <Progress value={pdi.progress} className="h-2 flex-1" />
                            <span className="text-xs font-medium">{pdi.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-muted">
                          {new Date(pdi.deadline).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifow" className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatsCard
              title="Perguntas Respondidas"
              value="1.247"
              subtitle="Este mês"
              change={23}
              icon={<Sparkles className="h-5 w-5 text-brand-teal" />}
            />
            <StatsCard
              title="Taxa de Conversão"
              value="34%"
              subtitle="Pergunta → Curso"
              change={5}
              icon={<TrendingUp className="h-5 w-5 text-status-success" />}
            />
            <StatsCard
              title="Tempo Economizado"
              value="156h"
              subtitle="Este mês"
              change={12}
              icon={<Clock className="h-5 w-5 text-brand-secondary" />}
            />
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-text-muted" />
              <h3 className="font-medium mb-2">Analytics do LIFOW</h3>
              <p className="text-sm text-text-muted">
                Métricas detalhadas do LIFOW estarão disponíveis em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maturity" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-text-muted" />
              <h3 className="font-medium mb-2">Evolução da Maturidade</h3>
              <p className="text-sm text-text-muted mb-4">
                Acompanhe a evolução do score de maturidade da sua empresa ao longo do tempo.
              </p>
              <Button>Ver histórico completo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Relatórios disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Relatório Executivo Mensal', type: 'PDF', date: 'Fev 2025' },
                { name: 'Dashboard de Métricas', type: 'Excel', date: 'Fev 2025' },
                { name: 'Progresso de Formações', type: 'PDF', date: 'Jan 2025' },
                { name: 'Análise de ROI', type: 'PDF', date: 'Jan 2025' },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-brand-navy" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-text-muted">{report.type} • {report.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Generate Report CTA */}
          <Card className="bg-gradient-to-r from-brand-navy to-brand-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Gerar relatório personalizado</h3>
                  <p className="text-white/80 text-sm">
                    Crie relatórios customizados com as métricas mais relevantes para sua empresa.
                  </p>
                </div>
                <Button className="bg-white text-brand-navy hover:bg-white/90">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

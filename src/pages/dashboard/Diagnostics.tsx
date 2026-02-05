import { useState } from 'react';
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Eye,
  Zap,
  Brain,
  Database,
  Users,
  Settings,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader, StatsCard } from '@/components/shared';

// Mock data
const mockShadowAITools = [
  { name: 'ChatGPT', category: 'Chatbot', users: 45, status: 'detected', risk: 'medium' },
  { name: 'Midjourney', category: 'Imagem', users: 23, status: 'evaluating', risk: 'low' },
  { name: 'Copilot', category: 'Código', users: 12, status: 'homologated', risk: 'low' },
  { name: 'Claude', category: 'Chatbot', users: 34, status: 'homologated', risk: 'low' },
  { name: 'DALL-E', category: 'Imagem', users: 8, status: 'blocked', risk: 'high' },
];

const mockMaturityDimensions = [
  { name: 'Estratégia', score: 72, icon: Brain },
  { name: 'Pessoas', score: 58, icon: Users },
  { name: 'Dados', score: 45, icon: Database },
  { name: 'Tecnologia', score: 68, icon: Settings },
  { name: 'Processos', score: 52, icon: TrendingUp },
  { name: 'Governança', score: 35, icon: Shield },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'homologated': return 'bg-status-success text-white';
    case 'evaluating': return 'bg-status-warning text-white';
    case 'blocked': return 'bg-status-error text-white';
    default: return 'bg-surface-light text-text';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'homologated': return 'Homologada';
    case 'evaluating': return 'Em avaliação';
    case 'blocked': return 'Bloqueada';
    default: return 'Detectada';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'text-status-success';
    case 'medium': return 'text-status-warning';
    case 'high': return 'text-status-error';
    default: return 'text-text-muted';
  }
};

export function Diagnostics() {
  const [activeTab, setActiveTab] = useState('shadow');
  const overallMaturity = Math.round(
    mockMaturityDimensions.reduce((acc, d) => acc + d.score, 0) / mockMaturityDimensions.length
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Diagnósticos"
        description="Avalie a maturidade em IA da sua empresa e identifique ferramentas não autorizadas"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shadow">Shadow AI Scanner</TabsTrigger>
          <TabsTrigger value="maturity">Maturidade em IA</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="shadow" className="space-y-6">
          {/* Shadow AI Overview */}
          <div className="grid sm:grid-cols-4 gap-4">
            <StatsCard
              title="Ferramentas detectadas"
              value="12"
              subtitle="Em uso na empresa"
              icon={<Search className="h-5 w-5 text-brand-teal" />}
            />
            <StatsCard
              title="Homologadas"
              value="4"
              subtitle="Aprovadas para uso"
              icon={<CheckCircle className="h-5 w-5 text-status-success" />}
              className="border-l-4 border-status-success"
            />
            <StatsCard
              title="Em avaliação"
              value="5"
              subtitle="Análise em andamento"
              icon={<Eye className="h-5 w-5 text-status-warning" />}
              className="border-l-4 border-status-warning"
            />
            <StatsCard
              title="Bloqueadas"
              value="3"
              subtitle="Uso não permitido"
              icon={<Lock className="h-5 w-5 text-status-error" />}
              className="border-l-4 border-status-error"
            />
          </div>

          {/* Shadow AI Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-status-warning" />
                  Ferramentas de IA detectadas
                </CardTitle>
                <Button size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Nova varredura
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Ferramenta</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Categoria</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Usuários</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Risco</th>
                      <th className="text-left text-xs font-medium text-text-muted py-3 px-4">Status</th>
                      <th className="text-right text-xs font-medium text-text-muted py-3 px-4">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockShadowAITools.map((tool) => (
                      <tr key={tool.name} className="border-b border-surface-border hover:bg-surface-hover">
                        <td className="py-3 px-4">
                          <span className="font-medium">{tool.name}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-secondary">{tool.category}</td>
                        <td className="py-3 px-4 text-sm">{tool.users}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-medium ${getRiskColor(tool.risk)}`}>
                            {tool.risk === 'low' ? 'Baixo' : tool.risk === 'medium' ? 'Médio' : 'Alto'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(tool.status)}>
                            {getStatusLabel(tool.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            Avaliar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maturity" className="space-y-6">
          {/* Maturity Score */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-surface-light"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallMaturity / 100) * 352} 352`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B1A2E" />
                        <stop offset="50%" stopColor="#4A8DB7" />
                        <stop offset="100%" stopColor="#5CEABC" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <span className="text-3xl font-bold">{overallMaturity}</span>
                      <span className="text-text-muted">/100</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Score de Maturidade</h3>
                <p className="text-sm text-text-muted">Sua empresa está no nível "Explorador"</p>
                <Button className="mt-4 w-full" size="sm">
                  Ver relatório completo
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Maturidade por dimensão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMaturityDimensions.map((dimension) => {
                  const Icon = dimension.icon;
                  return (
                    <div key={dimension.name} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                        <Icon className="h-5 w-5 text-brand-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{dimension.name}</span>
                          <span className="text-sm font-medium">{dimension.score}%</span>
                        </div>
                        <Progress value={dimension.score} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Maturity CTA */}
          <Card className="bg-gradient-to-r from-brand-navy to-brand-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Quer melhorar sua maturidade em IA?</h3>
                  <p className="text-white/80 text-sm">
                    Faça uma nova avaliação ou agende uma consultoria com nossos especialistas.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">
                    Refazer avaliação
                  </Button>
                  <Button className="bg-white text-brand-navy hover:bg-white/90">
                    Falar com especialista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-brand-teal" />
                Oportunidades de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-text-muted" />
                <h3 className="font-medium mb-2">Mapeamento de oportunidades</h3>
                <p className="text-sm text-text-muted mb-4">
                  Identifique onde a IA pode gerar mais valor na sua empresa.
                </p>
                <Button>Iniciar mapeamento</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import {
  Plug,
  Key,
  Shield,
  Zap,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader, StatsCard } from '@/components/shared';

// Mock data
const mockApiKey = 'aim_sk_1234567890abcdef...';

const mockConnectors = [
  { id: 'slack', name: 'Slack', icon: '💬', status: 'connected', category: 'Comunicação' },
  { id: 'teams', name: 'Microsoft Teams', icon: '👥', status: 'disconnected', category: 'Comunicação' },
  { id: 'google', name: 'Google Workspace', icon: '📧', status: 'connected', category: 'Produtividade' },
  { id: 'notion', name: 'Notion', icon: '📝', status: 'disconnected', category: 'Produtividade' },
  { id: 'salesforce', name: 'Salesforce', icon: '💼', status: 'disconnected', category: 'CRM' },
  { id: 'hubspot', name: 'HubSpot', icon: '🎯', status: 'connected', category: 'CRM' },
];

const mockTrustRules = [
  { id: '1', name: 'Bloquear PII', description: 'Impede envio de dados pessoais', enabled: true },
  { id: '2', name: 'Bloquear cartões de crédito', description: 'Detecta números de cartão', enabled: true },
  { id: '3', name: 'Bloquear menções a concorrentes', description: 'Filtra nomes de concorrentes', enabled: false },
  { id: '4', name: 'Log de todas as requisições', description: 'Registra todo o tráfego', enabled: true },
  { id: '5', name: 'Rate limiting', description: 'Limita requisições por usuário', enabled: true },
];

const mockIncidents = [
  { id: '1', type: 'PII detectado', user: 'João Silva', time: '2 horas atrás', severity: 'medium' },
  { id: '2', type: 'Rate limit excedido', user: 'Sistema', time: '5 horas atrás', severity: 'low' },
  { id: '3', type: 'Tentativa de bypass', user: 'Usuário anônimo', time: '1 dia atrás', severity: 'high' },
];

export function Integrations() {
  const [activeTab, setActiveTab] = useState('api');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('aim_sk_1234567890abcdefghijklmnop');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrações"
        description="Conecte a AIMANA às ferramentas que sua equipe já usa"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="api">AIMANA API</TabsTrigger>
          <TabsTrigger value="trust">Trust Agent</TabsTrigger>
          <TabsTrigger value="connectors">Conectores</TabsTrigger>
          <TabsTrigger value="mcp">MCPs</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          {/* API Architecture Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-brand-teal" />
                AIMANA API Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 p-6 bg-surface-light rounded-lg">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-brand-navy flex items-center justify-center">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <p className="text-sm font-medium">Sua Aplicação</p>
                </div>
                <ArrowRight className="h-6 w-6 text-text-muted" />
                <div className="text-center p-4 bg-gradient-to-r from-brand-navy to-brand-secondary text-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">AIMANA API</p>
                  <p className="text-xs text-white/70">Trust Agent</p>
                </div>
                <ArrowRight className="h-6 w-6 text-text-muted" />
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-surface-light flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <p className="text-sm font-medium">LLMs</p>
                  <p className="text-xs text-text-muted">Claude, GPT, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-5 w-5" />
                Chave de API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-surface-light rounded-lg font-mono text-sm">
                  {showApiKey ? 'aim_sk_1234567890abcdefghijklmnop' : mockApiKey}
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleCopyKey}>
                  {copiedKey ? <CheckCircle className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-text-muted">
                Use esta chave para autenticar requisições à AIMANA API. Nunca compartilhe sua chave.
              </p>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <StatsCard
              title="Requisições"
              value="12.4k"
              subtitle="Este mês"
              icon={<Zap className="h-5 w-5 text-brand-teal" />}
            />
            <StatsCard
              title="Tokens utilizados"
              value="2.3M"
              subtitle="~R$ 127,00"
              icon={<Key className="h-5 w-5 text-brand-secondary" />}
            />
            <StatsCard
              title="Latência média"
              value="245ms"
              subtitle="P95: 380ms"
              icon={<RefreshCw className="h-5 w-5 text-brand-navy" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="trust" className="space-y-6">
          {/* Trust Agent Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-teal" />
                Regras do Trust Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTrustRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-status-success' : 'bg-status-pending'}`} />
                    <div>
                      <p className="text-sm font-medium">{rule.name}</p>
                      <p className="text-xs text-text-muted">{rule.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                Incidentes recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-light"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        incident.severity === 'high' ? 'bg-status-error' :
                        incident.severity === 'medium' ? 'bg-status-warning' : 'bg-status-pending'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{incident.type}</p>
                        <p className="text-xs text-text-muted">{incident.user} • {incident.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Ver detalhes</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connectors" className="space-y-6">
          {/* Connectors Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockConnectors.map((connector) => (
              <Card key={connector.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{connector.icon}</div>
                    <Badge variant={connector.status === 'connected' ? 'success' : 'secondary'}>
                      {connector.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{connector.name}</h3>
                  <p className="text-sm text-text-muted mb-4">{connector.category}</p>
                  <Button
                    variant={connector.status === 'connected' ? 'outline' : 'default'}
                    className="w-full"
                    size="sm"
                  >
                    {connector.status === 'connected' ? (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </>
                    ) : (
                      <>
                        <Plug className="h-4 w-4 mr-2" />
                        Conectar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mcp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Model Context Protocol (MCP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center">
                <Zap className="h-16 w-16 mx-auto mb-4 text-text-muted" />
                <h3 className="font-medium mb-2">Servidores MCP</h3>
                <p className="text-sm text-text-muted mb-4">
                  Configure servidores MCP personalizados para expandir as capacidades da AIMANA.
                </p>
                <div className="flex justify-center gap-3">
                  <Button>
                    Adicionar servidor MCP
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver documentação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import {
  FileText,
  Download,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  Sparkles,
  Eye,
  Copy,
  Loader2,
  AlertCircle,
  Bot,
  Key,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader, OpenAIKeyModal } from '@/components/shared';
import { usePolicyGenerator } from '@/hooks/useOpenAI';
import ReactMarkdown from 'react-markdown';

// Mock data
const mockPolicies = [
  {
    id: '1',
    type: 'uso_ia',
    title: 'Política de Uso de IA',
    status: 'approved',
    version: 2,
    approvedBy: 'Maria Santos',
    approvedAt: '2025-01-15',
    description: 'Define as diretrizes para uso de ferramentas de IA na empresa.',
  },
  {
    id: '2',
    type: 'dados',
    title: 'Política de Dados para IA',
    status: 'draft',
    version: 1,
    approvedBy: null,
    approvedAt: null,
    description: 'Estabelece regras para uso de dados em modelos de IA.',
  },
  {
    id: '3',
    type: 'governanca',
    title: 'Governança de IA',
    status: 'review',
    version: 1,
    approvedBy: null,
    approvedAt: null,
    description: 'Define a estrutura de governança para projetos de IA.',
  },
  {
    id: '4',
    type: 'etica',
    title: 'Código de Ética em IA',
    status: 'approved',
    version: 1,
    approvedBy: 'Carlos Lima',
    approvedAt: '2025-01-10',
    description: 'Princípios éticos para desenvolvimento e uso de IA.',
  },
];

const policyTemplates = [
  { id: '1', name: 'Política de Uso Aceitável de IA', category: 'Uso', popular: true },
  { id: '2', name: 'Política de Privacidade para IA', category: 'Dados', popular: true },
  { id: '3', name: 'Termos de Uso de Chatbots', category: 'Uso', popular: false },
  { id: '4', name: 'Política de IA Generativa', category: 'Uso', popular: true },
  { id: '5', name: 'Framework de Governança de IA', category: 'Governança', popular: false },
];

const policyTypes = [
  { value: 'uso_aceitavel', label: 'Política de Uso Aceitável de IA' },
  { value: 'privacidade', label: 'Política de Privacidade para IA' },
  { value: 'governanca', label: 'Framework de Governança de IA' },
  { value: 'etica', label: 'Código de Ética em IA' },
  { value: 'ia_generativa', label: 'Política de IA Generativa' },
  { value: 'dados', label: 'Política de Dados para IA' },
  { value: 'seguranca', label: 'Política de Segurança em IA' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Aprovada</Badge>;
    case 'review':
      return <Badge variant="warning"><Clock className="h-3 w-3 mr-1" />Em revisão</Badge>;
    case 'draft':
      return <Badge variant="secondary"><Edit className="h-3 w-3 mr-1" />Rascunho</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function Policies() {
  const [activeTab, setActiveTab] = useState('all');
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: '',
    companyName: '',
    sector: '',
    size: '',
    requirements: '',
  });

  const policyGenerator = usePolicyGenerator();

  const handleGeneratePolicy = async () => {
    if (!formData.type || !formData.companyName) return;

    if (!policyGenerator.isConfigured) {
      setShowApiKeyModal(true);
      return;
    }

    setGeneratedPolicy('');

    try {
      const result = await policyGenerator.generatePolicy({
        type: policyTypes.find(p => p.value === formData.type)?.label || formData.type,
        companyName: formData.companyName,
        sector: formData.sector || 'Não especificado',
        size: formData.size || 'Não especificado',
        specificRequirements: formData.requirements,
      });
      setGeneratedPolicy(result);
    } catch {
      // Error handled by hook
    }
  };

  const handleCopyPolicy = async () => {
    await navigator.clipboard.writeText(generatedPolicy);
    setCopiedPolicy(true);
    setTimeout(() => setCopiedPolicy(false), 2000);
  };

  const resetGenerator = () => {
    setFormData({
      type: '',
      companyName: '',
      sector: '',
      size: '',
      requirements: '',
    });
    setGeneratedPolicy('');
    setShowGeneratorModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Políticas"
        description="Gerencie as políticas de IA da sua empresa"
        actions={
          <Button onClick={() => setShowGeneratorModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova política
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Gerador com IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{mockPolicies.length}</p>
                <p className="text-sm text-text-muted">Total de políticas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-status-success">
                  {mockPolicies.filter(p => p.status === 'approved').length}
                </p>
                <p className="text-sm text-text-muted">Aprovadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-status-warning">
                  {mockPolicies.filter(p => p.status === 'review').length}
                </p>
                <p className="text-sm text-text-muted">Em revisão</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-text-muted">
                  {mockPolicies.filter(p => p.status === 'draft').length}
                </p>
                <p className="text-sm text-text-muted">Rascunhos</p>
              </CardContent>
            </Card>
          </div>

          {/* Policies List */}
          <div className="space-y-3">
            {mockPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-brand-navy/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-brand-navy" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{policy.title}</h3>
                          {getStatusBadge(policy.status)}
                        </div>
                        <p className="text-sm text-text-muted mb-2">{policy.description}</p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span>Versão {policy.version}</span>
                          {policy.approvedBy && (
                            <>
                              <span>•</span>
                              <span>Aprovada por {policy.approvedBy}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Templates de políticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {policyTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-text-muted" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{template.name}</span>
                        {template.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <span className="text-xs text-text-muted">{template.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Usar template
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-gradient-to-r from-brand-navy to-brand-secondary text-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Gerador de Políticas com IA</h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Use inteligência artificial para criar políticas personalizadas para sua empresa em minutos.
              </p>
              <Button
                className="bg-white text-brand-navy hover:bg-white/90"
                onClick={() => setShowGeneratorModal(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar política com IA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Como funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-teal/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-teal">1</span>
                  </div>
                  <h4 className="font-medium mb-1">Escolha o tipo</h4>
                  <p className="text-sm text-text-muted">Selecione o tipo de política que deseja criar</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-secondary">2</span>
                  </div>
                  <h4 className="font-medium mb-1">Personalize</h4>
                  <p className="text-sm text-text-muted">Adicione informações específicas da sua empresa</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-navy/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-navy">3</span>
                  </div>
                  <h4 className="font-medium mb-1">Revise e aprove</h4>
                  <p className="text-sm text-text-muted">Edite o resultado e envie para aprovação</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tipos de políticas disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {policyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setFormData({ ...formData, type: type.value });
                      setShowGeneratorModal(true);
                    }}
                    className="p-4 text-left rounded-lg border border-surface-border hover:border-brand-teal hover:bg-brand-teal/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-brand-teal" />
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generator Modal */}
      <Dialog open={showGeneratorModal} onOpenChange={resetGenerator}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand-teal" />
              Gerador de Políticas com IA
            </DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para gerar uma política personalizada.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!generatedPolicy ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyType">Tipo de Política *</Label>
                    <select
                      id="policyType"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                    >
                      <option value="">Selecione o tipo...</option>
                      {policyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <Input
                      id="companyName"
                      placeholder="Ex: ACME Corporation"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Setor/Indústria</Label>
                    <Input
                      id="sector"
                      placeholder="Ex: Tecnologia, Varejo, Financeiro..."
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Tamanho da Empresa</Label>
                    <Input
                      id="size"
                      placeholder="Ex: 50-200 colaboradores"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos Específicos (opcional)</Label>
                  <textarea
                    id="requirements"
                    placeholder="Descreva requisitos específicos, regulamentações que devem ser consideradas, ou contexto adicional..."
                    className="w-full min-h-[100px] px-3 py-2 border border-surface-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>

                {!policyGenerator.isConfigured && (
                  <div className="flex items-center gap-3 p-4 bg-status-warning/10 rounded-lg">
                    <Key className="h-5 w-5 text-status-warning" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">API Key não configurada</p>
                      <p className="text-xs text-text-muted">Configure sua chave OpenAI para usar o gerador.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setShowApiKeyModal(true)}>
                      Configurar
                    </Button>
                  </div>
                )}

                {policyGenerator.error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-status-error/10 text-status-error text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {policyGenerator.error}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Política Gerada</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyPolicy}>
                      {copiedPolicy ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1 text-status-success" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setGeneratedPolicy('')}>
                      <Edit className="h-4 w-4 mr-1" />
                      Gerar novamente
                    </Button>
                  </div>
                </div>

                <Card className="bg-surface-light">
                  <CardContent className="p-4">
                    <div className="prose prose-sm max-w-none max-h-[400px] overflow-y-auto">
                      <ReactMarkdown>{generatedPolicy}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetGenerator}>
              {generatedPolicy ? 'Fechar' : 'Cancelar'}
            </Button>
            {!generatedPolicy && (
              <Button
                onClick={handleGeneratePolicy}
                disabled={!formData.type || !formData.companyName || policyGenerator.isLoading}
              >
                {policyGenerator.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando política...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Política
                  </>
                )}
              </Button>
            )}
            {generatedPolicy && (
              <Button onClick={() => {
                // In a real app, this would save to database
                alert('Política salva como rascunho!');
                resetGenerator();
              }}>
                <FileText className="h-4 w-4 mr-2" />
                Salvar como Rascunho
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key Modal */}
      <OpenAIKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={(key) => {
          policyGenerator.configureApiKey(key);
          setShowApiKeyModal(false);
        }}
      />
    </div>
  );
}

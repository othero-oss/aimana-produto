import { useState } from 'react';
import {
  User,
  Building,
  Bell,
  Shield,
  Globe,
  Key,
  Camera,
  Save,
  LogOut,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/shared';
import { useAuthStore } from '@/stores/authStore';

export function Settings() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie seu perfil e preferências"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl bg-brand-teal text-white">
                    {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Alterar foto
                  </Button>
                  <p className="text-xs text-text-muted mt-1">JPG, PNG. Máximo 2MB.</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" defaultValue={user?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" defaultValue={user?.department || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input id="position" defaultValue={user?.position || ''} />
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-5 w-5" />
                Dados da empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da empresa</Label>
                  <Input id="companyName" defaultValue="ACME Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Setor</Label>
                  <Input id="sector" defaultValue="Tecnologia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho</Label>
                  <Input id="size" defaultValue="51-200 colaboradores" />
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar alterações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Plano atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div>
                  <h3 className="font-semibold">Plano Professional</h3>
                  <p className="text-sm text-text-muted">Até 200 usuários • Todos os recursos</p>
                </div>
                <Button variant="outline">Gerenciar plano</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'email_progress', label: 'Atualizações de progresso', description: 'Receba relatórios semanais do seu progresso' },
                { id: 'email_events', label: 'Eventos da comunidade', description: 'Seja notificado sobre lives e eventos' },
                { id: 'email_news', label: 'Newsletter AIMANA', description: 'Novidades sobre IA toda semana' },
                { id: 'push_reminders', label: 'Lembretes de estudo', description: 'Notificações para continuar seus cursos' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-teal" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-5 w-5" />
                Alterar senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Alterar senha</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sessões ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Este dispositivo</p>
                    <p className="text-xs text-text-muted">Chrome • macOS • São Paulo, BR</p>
                  </div>
                  <span className="text-xs text-status-success">Ativo agora</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-error/20">
            <CardHeader>
              <CardTitle className="text-base text-status-error flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Sair da conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted mb-4">
                Ao sair, você será redirecionado para a página de login.
              </p>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair da conta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

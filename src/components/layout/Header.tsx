import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

// Page titles mapping
const pageTitles: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/diagnostics': 'Diagnósticos',
  '/dashboard/academy': 'Academy',
  '/dashboard/lifow': 'LIFOW',
  '/dashboard/community': 'Comunidade',
  '/dashboard/policies': 'Políticas',
  '/dashboard/integrations': 'Integrações',
  '/dashboard/control': 'Control',
  '/dashboard/settings': 'Configurações',
};

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get current page title
  const getPageTitle = () => {
    const exactMatch = pageTitles[location.pathname];
    if (exactMatch) return exactMatch;

    // Check for nested routes
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(path) && path !== '/dashboard') {
        return title;
      }
    }

    return 'Dashboard';
  };

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'Novo curso disponível',
      description: 'IA para Marketing foi adicionado à trilha',
      time: '5 min atrás',
      read: false,
    },
    {
      id: '2',
      title: 'Certificado emitido',
      description: 'Você concluiu Fundamentos de IA!',
      time: '1 hora atrás',
      read: false,
    },
    {
      id: '3',
      title: 'Lembrete de evento',
      description: 'Live sobre Agentes IA amanhã às 15h',
      time: '2 horas atrás',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white border-b border-surface-border',
        'flex items-center justify-between px-6',
        'transition-all duration-200',
        sidebarCollapsed ? 'left-[68px]' : 'left-[260px]'
      )}
    >
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-text">{getPageTitle()}</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            type="search"
            placeholder="Buscar cursos, pessoas, métricas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface-light border-0 focus:bg-white"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Button variant="ghost" size="icon" className="text-text-secondary">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-text-secondary"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-brand-coral text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} novas
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex flex-col items-start gap-1 p-3 cursor-pointer',
                  !notification.read && 'bg-surface-light'
                )}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <span className="font-medium text-sm">{notification.title}</span>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-brand-coral flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <span className="text-xs text-text-secondary">
                  {notification.description}
                </span>
                <span className="text-xs text-text-muted">{notification.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-brand-coral font-medium justify-center">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

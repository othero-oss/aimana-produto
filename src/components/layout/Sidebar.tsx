import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  BookOpen,
  Bot,
  Users,
  FileText,
  Plug,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/diagnostics', label: 'Diagnósticos', icon: Search },
  { path: '/dashboard/academy', label: 'Academy', icon: BookOpen },
  { path: '/dashboard/lifow', label: 'LIFOW', icon: Bot },
  { path: '/dashboard/community', label: 'Comunidade', icon: Users },
  { path: '/dashboard/policies', label: 'Políticas', icon: FileText },
  { path: '/dashboard/integrations', label: 'Integrações', icon: Plug },
  { path: '/dashboard/control', label: 'Control', icon: BarChart3 },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock user data - will come from auth context
  const user = {
    name: 'João Silva',
    email: 'joao@empresa.com.br',
    avatarUrl: null,
    role: 'Admin',
  };

  const handleLogout = () => {
    // Will implement proper logout
    navigate('/login');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'fixed left-0 top-0 z-40 h-screen',
          'bg-brand-navy shadow-sidebar',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Logo variant="light" size="md" />
              </motion.div>
            ) : (
              <motion.div
                key="icon-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Logo variant="light" size="sm" showText={false} />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-all duration-150',
                  isActive
                    ? 'text-white bg-white/10 border-l-3 border-brand-coral'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        {/* Quick Action Button */}
        <div className="px-3 pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  'w-full bg-gradient-celebration hover:opacity-90 text-white',
                  collapsed ? 'px-0' : ''
                )}
              >
                <Plus className="h-5 w-5" />
                {!collapsed && <span className="ml-2">Nova ação</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Nova ação</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* User Profile */}
        <div className="border-t border-white/10 p-3">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              'hover:bg-white/5 transition-colors cursor-pointer'
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
              <AvatarFallback className="bg-brand-coral text-white text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-white/50 truncate">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!collapsed && (
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate('/dashboard/settings')}
                      className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Configurações</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Sair</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

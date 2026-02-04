import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileQuestion, Search, BookOpen, Users, Bot } from 'lucide-react';

type EmptyStateType = 'default' | 'search' | 'courses' | 'team' | 'lifow';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const defaultContent: Record<EmptyStateType, { icon: React.ElementType; title: string; description: string }> = {
  default: {
    icon: FileQuestion,
    title: 'Nenhum dado encontrado',
    description: 'Não há informações para exibir no momento.',
  },
  search: {
    icon: Search,
    title: 'Nenhum resultado',
    description: 'Tente buscar por outros termos ou ajustar os filtros.',
  },
  courses: {
    icon: BookOpen,
    title: 'Nenhum curso encontrado',
    description: 'Explore nossa biblioteca de cursos para começar sua jornada.',
  },
  team: {
    icon: Users,
    title: 'Nenhum membro na equipe',
    description: 'Convide membros da sua equipe para começar.',
  },
  lifow: {
    icon: Bot,
    title: 'LIFOW não configurado',
    description: 'Configure o LIFOW para começar a responder dúvidas da sua equipe.',
  },
};

export function EmptyState({
  type = 'default',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const content = defaultContent[type];
  const Icon = content.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-text-muted" />
      </div>

      <h3 className="text-lg font-semibold text-text mb-2">
        {title || content.title}
      </h3>

      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {description || content.description}
      </p>

      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

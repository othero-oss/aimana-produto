import { Check, Circle, Lock, Play, FileText, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseModule, UserModuleProgress } from '@/types/academy';

interface ModuleListProps {
  modules: CourseModule[];
  progressMap: Record<string, UserModuleProgress>;
  currentModuleId?: string;
  onModuleSelect: (module: CourseModule) => void;
  className?: string;
}

const contentTypeIcons = {
  video: Play,
  text: FileText,
  quiz: HelpCircle,
  exercise: FileText,
  ai_exercise: Sparkles,
};

const contentTypeLabels = {
  video: 'Vídeo',
  text: 'Texto',
  quiz: 'Quiz',
  exercise: 'Exercício',
  ai_exercise: 'Exercício com IA',
};

export function ModuleList({
  modules,
  progressMap,
  currentModuleId,
  onModuleSelect,
  className,
}: ModuleListProps) {
  const getModuleStatus = (moduleId: string): 'completed' | 'in_progress' | 'locked' | 'available' => {
    const progress = progressMap[moduleId];
    if (progress?.status === 'completed') return 'completed';
    if (progress?.status === 'in_progress') return 'in_progress';

    // Check if previous module is completed
    const moduleIndex = modules.findIndex((m) => m.id === moduleId);
    if (moduleIndex === 0) return 'available';

    const prevModule = modules[moduleIndex - 1];
    const prevProgress = progressMap[prevModule.id];
    if (prevProgress?.status === 'completed') return 'available';

    return 'locked';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {modules.map((module, index) => {
        const status = getModuleStatus(module.id);
        const isCurrent = module.id === currentModuleId;
        const Icon = contentTypeIcons[module.contentType as keyof typeof contentTypeIcons] || FileText;

        return (
          <button
            key={module.id}
            onClick={() => status !== 'locked' && onModuleSelect(module)}
            disabled={status === 'locked'}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all',
              'border border-transparent',
              status === 'locked' && 'opacity-50 cursor-not-allowed',
              status !== 'locked' && 'hover:bg-surface-light cursor-pointer',
              isCurrent && 'bg-brand-coral/5 border-brand-coral/20'
            )}
          >
            {/* Status icon */}
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                status === 'completed' && 'bg-status-success text-white',
                status === 'in_progress' && 'bg-brand-coral text-white',
                status === 'available' && 'bg-surface-light text-text-muted',
                status === 'locked' && 'bg-surface-light text-text-muted'
              )}
            >
              {status === 'completed' ? (
                <Check className="h-4 w-4" />
              ) : status === 'locked' ? (
                <Lock className="h-4 w-4" />
              ) : status === 'in_progress' ? (
                <Circle className="h-3 w-3 fill-current" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm font-medium truncate',
                    isCurrent ? 'text-brand-coral' : 'text-text'
                  )}
                >
                  {module.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Icon className="h-3 w-3 text-text-muted" />
                <span className="text-xs text-text-muted">
                  {contentTypeLabels[module.contentType as keyof typeof contentTypeLabels]}
                </span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs text-text-muted">
                  {module.durationMinutes} min
                </span>
              </div>
            </div>

            {/* Play indicator for available/in-progress */}
            {(status === 'available' || status === 'in_progress') && (
              <Play className="h-4 w-4 text-brand-coral flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

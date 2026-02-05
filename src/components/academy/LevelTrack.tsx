import { Check, Lock, Zap, Code, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LevelProgress {
  level: number;
  name: string;
  description: string;
  coursesTotal: number;
  coursesCompleted: number;
  skills: string[];
  isUnlocked: boolean;
  isCurrent: boolean;
}

interface LevelTrackProps {
  levels: LevelProgress[];
  className?: string;
}

const levelIcons = {
  1: Sparkles,
  2: Zap,
  3: Code,
};

const levelColors = {
  1: {
    bg: 'bg-status-success/10',
    border: 'border-status-success/20',
    text: 'text-status-success',
    progress: 'bg-status-success',
  },
  2: {
    bg: 'bg-phase-execute/10',
    border: 'border-phase-execute/20',
    text: 'text-phase-execute',
    progress: 'bg-phase-execute',
  },
  3: {
    bg: 'bg-phase-manage/10',
    border: 'border-phase-manage/20',
    text: 'text-phase-manage',
    progress: 'bg-phase-manage',
  },
};

export function LevelTrack({ levels, className }: LevelTrackProps) {
  return (
    <div className={cn('grid md:grid-cols-3 gap-6', className)}>
      {levels.map((level) => {
        const Icon = levelIcons[level.level as keyof typeof levelIcons] || Sparkles;
        const colors = levelColors[level.level as keyof typeof levelColors] || levelColors[1];
        const progress = level.coursesTotal > 0
          ? Math.round((level.coursesCompleted / level.coursesTotal) * 100)
          : 0;
        const isComplete = progress === 100;

        return (
          <Card
            key={level.level}
            className={cn(
              'relative overflow-hidden transition-all',
              !level.isUnlocked && 'opacity-60',
              level.isCurrent && 'ring-2 ring-brand-coral'
            )}
          >
            {/* Locked overlay */}
            {!level.isUnlocked && (
              <div className="absolute inset-0 bg-surface-light/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">Complete o nível anterior</p>
                </div>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={cn('p-2.5 rounded-xl', colors.bg)}>
                  <Icon className={cn('h-6 w-6', colors.text)} />
                </div>
                {level.isCurrent && (
                  <Badge className="bg-brand-coral text-white border-0">
                    Atual
                  </Badge>
                )}
                {isComplete && (
                  <div className="w-6 h-6 rounded-full bg-status-success flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="mt-3">{level.name}</CardTitle>
              <p className="text-sm text-text-secondary">{level.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Progresso</span>
                  <span className="font-medium">
                    {level.coursesCompleted}/{level.coursesTotal} cursos
                  </span>
                </div>
                <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', colors.progress)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-medium text-text-muted mb-2">
                  Habilidades desbloqueadas:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {level.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={cn(
                        'text-xs',
                        level.coursesCompleted > 0 ? colors.border : 'border-surface-border'
                      )}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

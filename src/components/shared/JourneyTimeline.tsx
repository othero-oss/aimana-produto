import { Check, Lock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { JourneyPhase } from '@/types/control';

interface JourneyTimelineProps {
  phases: JourneyPhase[];
  className?: string;
}

export function JourneyTimeline({ phases, className }: JourneyTimelineProps) {
  const getStatusIcon = (status: JourneyPhase['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5" />;
      case 'in_progress':
        return <Circle className="h-3 w-3 fill-current" />;
      case 'locked':
        return <Lock className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center flex-1">
            {/* Phase Card */}
            <div
              className={cn(
                'flex-1 p-4 rounded-xl border-2 transition-all',
                phase.status === 'completed' && 'bg-white border-status-success/30',
                phase.status === 'in_progress' && 'bg-white border-brand-coral/30 shadow-card',
                phase.status === 'locked' && 'bg-surface-light border-surface-border opacity-60'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                {/* Status Icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    phase.status === 'completed' && 'bg-status-success text-white',
                    phase.status === 'in_progress' && 'bg-brand-coral text-white animate-pulse-slow',
                    phase.status === 'locked' && 'bg-surface-border text-text-muted'
                  )}
                >
                  {getStatusIcon(phase.status)}
                </div>

                {/* Phase Name */}
                <div>
                  <h3
                    className={cn(
                      'font-semibold text-sm',
                      phase.status === 'locked' ? 'text-text-muted' : 'text-text'
                    )}
                    style={{
                      color: phase.status !== 'locked' ? phase.color : undefined,
                    }}
                  >
                    {phase.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {phase.status === 'completed'
                      ? 'Concluído'
                      : phase.status === 'in_progress'
                      ? `${phase.progress}% completo`
                      : 'Bloqueado'}
                  </p>
                </div>
              </div>

              {/* Progress bar for in_progress */}
              {phase.status === 'in_progress' && (
                <div className="mt-2">
                  <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${phase.progress}%`,
                        backgroundColor: phase.color,
                      }}
                    />
                  </div>
                  {phase.nextStep && (
                    <p className="mt-2 text-xs text-text-secondary">
                      Próximo: {phase.nextStep}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < phases.length - 1 && (
              <div className="w-8 h-0.5 mx-2">
                <div
                  className={cn(
                    'h-full rounded-full',
                    phases[index + 1].status !== 'locked'
                      ? 'bg-gradient-to-r'
                      : 'bg-surface-border'
                  )}
                  style={{
                    backgroundImage:
                      phases[index + 1].status !== 'locked'
                        ? `linear-gradient(to right, ${phase.color}, ${phases[index + 1].color})`
                        : undefined,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

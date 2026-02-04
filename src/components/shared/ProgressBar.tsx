import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'gradient' | 'phase';
  phase?: 'plan' | 'execute' | 'manage';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  phase,
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getBackgroundClass = () => {
    if (variant === 'gradient') return 'progress-gradient';
    if (phase) {
      switch (phase) {
        case 'plan':
          return 'bg-phase-plan';
        case 'execute':
          return 'bg-phase-execute';
        case 'manage':
          return 'bg-phase-manage';
      }
    }
    return 'bg-brand-coral';
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-text">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm text-text-secondary">{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-surface-light',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getBackgroundClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

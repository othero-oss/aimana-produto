import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Phase = 'plan' | 'execute' | 'manage';

interface PhaseIndicatorProps {
  phase: Phase;
  size?: 'sm' | 'md';
  className?: string;
}

const phaseConfig = {
  plan: {
    label: 'PLANEJAR',
    variant: 'plan' as const,
  },
  execute: {
    label: 'EXECUTAR',
    variant: 'execute' as const,
  },
  manage: {
    label: 'GERIR',
    variant: 'manage' as const,
  },
};

export function PhaseIndicator({ phase, size = 'md', className }: PhaseIndicatorProps) {
  const config = phaseConfig[phase];

  return (
    <Badge
      variant={config.variant}
      className={cn(
        size === 'sm' && 'text-[10px] px-2 py-0.5',
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

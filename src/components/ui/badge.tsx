import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-brand-coral text-white',
        secondary:
          'border-transparent bg-surface-light text-text-secondary',
        success:
          'border-transparent bg-status-success/10 text-status-success',
        warning:
          'border-transparent bg-status-warning/10 text-status-warning',
        error:
          'border-transparent bg-status-error/10 text-status-error',
        outline:
          'border-surface-border text-text-secondary',
        plan:
          'border-phase-plan/20 bg-phase-plan/10 text-phase-plan',
        execute:
          'border-phase-execute/20 bg-phase-execute/10 text-phase-execute',
        manage:
          'border-phase-manage/20 bg-phase-manage/10 text-phase-manage',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

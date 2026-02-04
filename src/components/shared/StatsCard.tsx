import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  trend,
  className,
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend && change !== undefined) {
      if (change > 0) return <TrendingUp className="h-4 w-4" />;
      if (change < 0) return <TrendingDown className="h-4 w-4" />;
      return <Minus className="h-4 w-4" />;
    }

    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    if (change !== undefined) {
      if (change > 0) return 'text-status-success';
      if (change < 0) return 'text-status-error';
      return 'text-text-muted';
    }

    switch (trend) {
      case 'up':
        return 'text-status-success';
      case 'down':
        return 'text-status-error';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-text">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-muted">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className="p-2 rounded-lg bg-surface-light">{icon}</div>
        )}
      </div>

      {(change !== undefined || trend) && (
        <div className={cn('flex items-center gap-1 mt-4', getTrendColor())}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {change !== undefined && (
              <>
                {change > 0 ? '+' : ''}
                {change}
                {changeLabel || '%'}
              </>
            )}
            {!change && trend && (
              <>
                {trend === 'up' ? 'Subindo' : trend === 'down' ? 'Caindo' : 'Estável'}
              </>
            )}
          </span>
          {changeLabel && change === undefined && (
            <span className="text-xs text-text-muted ml-1">{changeLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
}

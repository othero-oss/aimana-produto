import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({
  variant = 'default',
  size = 'md',
  showText = true,
  className,
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const textColorClasses = {
    default: 'text-text',
    light: 'text-white',
    dark: 'text-brand-navy',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Icon - Abstract AI symbol */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg bg-gradient-celebration',
          sizeClasses[size],
          size === 'sm' ? 'w-6' : size === 'md' ? 'w-8' : 'w-10'
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-2/3 h-2/3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={cn(
            'font-bold tracking-tight',
            textSizeClasses[size],
            textColorClasses[variant]
          )}
        >
          AIMANA
        </span>
      )}
    </div>
  );
}

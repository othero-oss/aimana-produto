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
  const iconSizeClasses = {
    sm: 'w-8 h-6',
    md: 'w-10 h-8',
    lg: 'w-12 h-10',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const textColorClasses = {
    default: 'text-brand-navy',
    light: 'text-white',
    dark: 'text-brand-navy',
  };

  const iconColor = variant === 'light' ? '#FFFFFF' : '#5CEABC';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* AIMANA Logo Icon - Chevrons with center dot */}
      <svg
        viewBox="0 0 60 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(iconSizeClasses[size])}
      >
        {/* Left chevron */}
        <path
          d="M18 8L6 20L18 32"
          stroke={iconColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right chevron */}
        <path
          d="M42 8L54 20L42 32"
          stroke={iconColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center dot/square */}
        <rect
          x="26"
          y="16"
          width="8"
          height="8"
          fill={iconColor}
          rx="1"
        />
      </svg>

      {showText && (
        <span
          className={cn(
            'font-bold tracking-widest',
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

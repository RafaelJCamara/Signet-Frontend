import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    dotClass: 'bg-success',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
  },
  inactive: {
    label: 'Inactive',
    dotClass: 'bg-muted-foreground',
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
  },
  error: {
    label: 'Error',
    dotClass: 'bg-destructive',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          config.dotClass,
          status === 'active' && 'animate-pulse-dot'
        )}
      />
      {config.label}
    </span>
  );
}

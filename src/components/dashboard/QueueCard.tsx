import { Queue, Schema } from '@/types/schema';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { ArrowRight, FileJson, AlertTriangle } from 'lucide-react';

interface QueueCardProps {
  queue: Queue;
  schema?: Schema;
  onClick?: () => void;
}

export function QueueCard({ queue, schema, onClick }: QueueCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border p-5',
        'bg-card transition-all duration-300',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {queue.name}
          </h3>
        </div>
        <StatusBadge status={queue.status} className="ml-2 flex-shrink-0" />
      </div>

      <div className="flex items-center justify-between">
        {schema ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileJson className="w-4 h-4 text-primary" />
            <span className="font-mono truncate">{schema.name}</span>
            <span className="text-xs text-muted-foreground/70">v{schema.version}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="italic">No contract assigned</span>
          </div>
        )}
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

import { Queue } from '@/types/schema';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { ArrowRight, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueueCardProps {
  queue: Queue;
  onClick?: () => void;
}

export function QueueCard({ queue, onClick }: QueueCardProps) {
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
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {queue.name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono mt-0.5">
            {queue.routingKey}
          </p>
        </div>
        <StatusBadge status={queue.status} />
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          <span>{queue.messageCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{queue.consumerCount} consumers</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Exchange: <span className="font-mono text-foreground/80">{queue.exchange}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
        >
          Configure
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

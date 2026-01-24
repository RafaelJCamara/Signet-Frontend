import { Schema } from '@/types/schema';
import { cn } from '@/lib/utils';
import { FileJson, Clock, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SchemaCardProps {
  schema: Schema;
  onClick?: () => void;
}

export function SchemaCard({ schema, onClick }: SchemaCardProps) {
  const formattedDate = new Date(schema.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg',
            'bg-primary/10 text-primary',
            'group-hover:scale-110 transition-transform duration-300'
          )}
        >
          <FileJson className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {schema.name}
            </h3>
            <Badge variant="outline" className="font-mono text-xs shrink-0">
              v{schema.version}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {schema.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5" />
              <span>{schema.usageCount} queue{schema.usageCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

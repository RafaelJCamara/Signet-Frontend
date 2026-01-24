import { cn } from '@/lib/utils';

interface JsonSchemaViewerProps {
  schema: object;
  className?: string;
}

function syntaxHighlight(json: string): string {
  return json
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g,
      (match) => {
        if (match.endsWith(':')) {
          return `<span class="text-syntax-property">${match}</span>`;
        }
        return `<span class="text-syntax-string">${match}</span>`;
      }
    )
    .replace(/\b(true|false)\b/g, '<span class="text-syntax-boolean">$1</span>')
    .replace(/\b(null)\b/g, '<span class="text-muted-foreground">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-syntax-number">$1</span>');
}

export function JsonSchemaViewer({ schema, className }: JsonSchemaViewerProps) {
  const formattedJson = JSON.stringify(schema, null, 2);
  const highlightedHtml = syntaxHighlight(formattedJson);
  const lines = highlightedHtml.split('\n');

  return (
    <div
      className={cn(
        'relative rounded-lg border border-border bg-muted/30 overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-xs font-medium text-muted-foreground">
          JSON Schema
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(formattedJson)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Copy
        </button>
      </div>
      
      <div className="overflow-auto max-h-[500px]">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="flex">
            <div className="select-none pr-4 text-right text-muted-foreground/50 border-r border-border mr-4">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </code>
        </pre>
      </div>
    </div>
  );
}

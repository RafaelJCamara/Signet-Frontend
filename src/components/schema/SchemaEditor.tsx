import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SchemaEditorProps {
  initialSchema?: object;
  initialName?: string;
  initialDescription?: string;
  initialVersion?: string;
  showMetadata?: boolean;
  onSave?: (data: { schema: object; name?: string; description?: string; version?: string }) => void;
  onCancel?: () => void;
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

export function SchemaEditor({
  initialSchema,
  initialName = '',
  initialDescription = '',
  initialVersion = '1.0.0',
  showMetadata = false,
  onSave,
  onCancel,
  className,
}: SchemaEditorProps) {
  const [schemaText, setSchemaText] = useState(
    initialSchema ? JSON.stringify(initialSchema, null, 2) : ''
  );
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [version, setVersion] = useState(initialVersion);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and highlight overlay
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const validateSchema = () => {
    try {
      const parsed = JSON.parse(schemaText);
      
      // Basic JSON Schema validation checks
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Schema must be an object');
      }
      
      setValidationStatus('valid');
      setErrorMessage('');
      return parsed;
    } catch (error) {
      setValidationStatus('invalid');
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON');
      return null;
    }
  };

  const handleSave = () => {
    const parsed = validateSchema();
    if (parsed && onSave) {
      onSave({
        schema: parsed,
        name: showMetadata ? name : undefined,
        description: showMetadata ? description : undefined,
        version: showMetadata ? version : undefined,
      });
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(schemaText);
      setSchemaText(JSON.stringify(parsed, null, 2));
      setValidationStatus('valid');
      setErrorMessage('');
    } catch {
      setValidationStatus('invalid');
      setErrorMessage('Cannot format invalid JSON');
    }
  };


  const highlightedHtml = syntaxHighlight(schemaText);

  return (
    <div className={cn('space-y-4', className)}>
      {showMetadata && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schema-name">Schema Name</Label>
              <Input
                id="schema-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., OrderCreatedEvent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g., 1.0.0"
                className="font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this schema validates..."
              rows={2}
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">JSON Schema Definition</Label>
        <div className="flex items-center gap-2">
          {validationStatus && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                validationStatus === 'valid' ? 'text-success' : 'text-destructive'
              )}
            >
              {validationStatus === 'valid' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Valid
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  Invalid
                </>
              )}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleFormat}>
            Format
          </Button>
          <Button variant="outline" size="sm" onClick={validateSchema}>
            Validate
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            'relative rounded-lg border overflow-hidden',
            'bg-muted/30 border-border',
            validationStatus === 'invalid' && 'border-destructive'
          )}
        >
          {/* Syntax highlighted background */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-3 overflow-auto pointer-events-none font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
            style={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }}
          />
          {/* Transparent textarea on top */}
          <textarea
            ref={textareaRef}
            value={schemaText}
            onChange={(e) => {
              setSchemaText(e.target.value);
              setValidationStatus(null);
            }}
            onScroll={handleScroll}
            placeholder={`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["id", "name"]
}`}
            className={cn(
              'relative w-full min-h-[400px] p-3 font-mono text-sm leading-relaxed resize-none',
              'bg-transparent text-transparent caret-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'placeholder:text-muted-foreground'
            )}
            spellCheck={false}
          />
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="glow-primary">
          Save Schema
        </Button>
      </div>
    </div>
  );
}

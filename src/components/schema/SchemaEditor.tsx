import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface SchemaEditorProps {
  initialSchema?: object;
  initialName?: string;
  initialDescription?: string;
  initialVersion?: string;
  initialSchemaId?: string;
  initialChangelog?: string;
  showMetadata?: boolean;
  isNewSchema?: boolean;
  onSave?: (data: { 
    schema: object; 
    name?: string; 
    description?: string; 
    version?: string;
    schemaId?: string;
    changelog?: string;
  }) => void;
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

function generateSchemaId(name: string): string {
  return name
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function SchemaEditor({
  initialSchema,
  initialName = '',
  initialDescription = '',
  initialVersion = '1.0.0',
  initialSchemaId = '',
  initialChangelog = '',
  showMetadata = false,
  isNewSchema = false,
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
  const [schemaId, setSchemaId] = useState(initialSchemaId);
  const [changelog, setChangelog] = useState(initialChangelog);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [schemaIdTouched, setSchemaIdTouched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Auto-generate schemaId from name if not touched by user
  const handleNameChange = (newName: string) => {
    setName(newName);
    if (isNewSchema && !schemaIdTouched) {
      setSchemaId(generateSchemaId(newName));
    }
  };

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
        schemaId: showMetadata ? schemaId : undefined,
        changelog: showMetadata ? changelog : undefined,
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., OrderCreatedEvent"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="version">Version</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Follow <strong>Semantic Versioning</strong> (SemVer):
                    </p>
                    <ul className="text-xs mt-1 space-y-0.5">
                      <li><strong>MAJOR</strong> (x.0.0): Breaking changes</li>
                      <li><strong>MINOR</strong> (0.x.0): New features, backward compatible</li>
                      <li><strong>PATCH</strong> (0.0.x): Bug fixes, backward compatible</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g., 1.0.0"
                className="font-mono"
              />
            </div>
          </div>

          {isNewSchema && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="schema-id">Schema ID</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      A unique identifier for this schema type. This ID <strong>cannot be changed</strong> once the schema is created. All versions of this schema will share this ID.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="schema-id"
                value={schemaId}
                onChange={(e) => {
                  setSchemaId(e.target.value);
                  setSchemaIdTouched(true);
                }}
                placeholder="e.g., order-created-event"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated from name. Edit if needed.
              </p>
            </div>
          )}

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

          <div className="space-y-2">
            <Label htmlFor="changelog">Changelog Note</Label>
            <Textarea
              id="changelog"
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder="Describe what changed in this version..."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              A brief note about what was added, changed, or fixed in this version.
            </p>
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
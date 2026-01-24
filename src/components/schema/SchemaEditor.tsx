import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SchemaEditorProps {
  initialSchema?: object;
  onSave?: (schema: object) => void;
  className?: string;
}

export function SchemaEditor({ initialSchema, onSave, className }: SchemaEditorProps) {
  const [schemaText, setSchemaText] = useState(
    initialSchema ? JSON.stringify(initialSchema, null, 2) : ''
  );
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      onSave(parsed);
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

  return (
    <div className={cn('space-y-4', className)}>
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
        <Textarea
          value={schemaText}
          onChange={(e) => {
            setSchemaText(e.target.value);
            setValidationStatus(null);
          }}
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
            'min-h-[400px] font-mono text-sm resize-none',
            'bg-muted/30 border-border',
            validationStatus === 'invalid' && 'border-destructive focus-visible:ring-destructive'
          )}
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="glow-primary">
          Save Schema
        </Button>
      </div>
    </div>
  );
}

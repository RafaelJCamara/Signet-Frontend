import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { CompatibilityLevel } from '@/types/schema';

interface RootSchemaEditorProps {
  initialName?: string;
  initialDescription?: string;
  initialSchemaId?: string;
  initialCompatibility?: CompatibilityLevel;
  isEditing?: boolean;
  onSave?: (data: { 
    name: string; 
    description: string; 
    schemaId: string;
    compatibility: CompatibilityLevel;
  }) => void;
  onCancel?: () => void;
  className?: string;
}

function generateSchemaId(name: string): string {
  return name
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function RootSchemaEditor({
  initialName = '',
  initialDescription = '',
  initialSchemaId = '',
  initialCompatibility = 'backward',
  isEditing = false,
  onSave,
  onCancel,
  className,
}: RootSchemaEditorProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [schemaId, setSchemaId] = useState(initialSchemaId);
  const [schemaIdTouched, setSchemaIdTouched] = useState(false);
  const [compatibility, setCompatibility] = useState<CompatibilityLevel>(initialCompatibility);

  // Auto-generate schemaId from name if not touched by user
  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!schemaIdTouched) {
      setSchemaId(generateSchemaId(newName));
    }
  };

  const handleSave = () => {
    const resolvedId = (schemaId && schemaId.trim()) || (name ? generateSchemaId(name) : '');

    if (!name.trim()) {
      return;
    }

    if (onSave) {
      onSave({
        name: name.trim(),
        description: description.trim(),
        schemaId: resolvedId,
        compatibility,
      });
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="schema-name">Schema Name *</Label>
        <Input
          id="schema-name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g., OrderCreatedEvent"
        />
      </div>

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
          disabled={isEditing}
        />
        {!isEditing && (
          <p className="text-xs text-muted-foreground">
            Auto-generated from name. Edit if needed.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="compatibility">Compatibility Level</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">
                <strong>Backward</strong>: New schema can read data written by old schema.<br />
                <strong>Forward</strong>: Old schema can read data written by new schema.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={compatibility} onValueChange={(v) => setCompatibility(v as CompatibilityLevel)}>
          <SelectTrigger id="compatibility">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backward">Backward Compatible</SelectItem>
            <SelectItem value="forward">Forward Compatible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this schema validates..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isValid} className="glow-primary">
          {isEditing ? 'Save Changes' : 'Create Schema'}
        </Button>
      </div>
    </div>
  );
}

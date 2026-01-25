import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockQueues, mockSchemas } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { JsonSchemaViewer } from '@/components/schema/JsonSchemaViewer';
import { ArrowLeft, Save, Trash2, Loader2, Pencil, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QueueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queue = mockQueues.find((q) => q.id === id);

  const [queueName, setQueueName] = useState(queue?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState(queue?.schemaId || 'none');
  const [isSaving, setIsSaving] = useState(false);

  const selectedSchema = selectedSchemaId && selectedSchemaId !== 'none'
    ? mockSchemas.find((s) => s.id === selectedSchemaId)
    : undefined;

  if (!queue) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Queue not found.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/queues')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Queues
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: 'Queue Updated',
      description: 'Queue configuration has been saved successfully.',
      variant: 'success',
    });
  };

  const handleDelete = () => {
    toast({
      title: 'Queue Deleted',
      description: 'The queue has been removed from the registry.',
      variant: 'destructive',
    });
    navigate('/queues');
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    toast({
      title: 'Queue Renamed',
      description: `Queue has been renamed to "${queueName}".`,
      variant: 'success',
    });
  };

  const handleCancelEdit = () => {
    setQueueName(queue.name);
    setIsEditingName(false);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/queues')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={queueName}
                    onChange={(e) => setQueueName(e.target.value)}
                    className="text-xl font-bold h-9 w-64"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={handleSaveName}>
                    <Check className="w-4 h-4 text-success" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">{queueName}</h1>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingName(true)}>
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </>
              )}
              <StatusBadge status={queue.status} />
            </div>
            <p className="text-muted-foreground mt-1">Configure queue contract</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button className="glow-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Contract Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Message Contract</CardTitle>
            <CardDescription>
              Assign a JSON Schema contract for message validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schema">Contract</Label>
              <Select value={selectedSchemaId} onValueChange={setSelectedSchemaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contract..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No contract</SelectItem>
                  {mockSchemas.map((schema) => (
                    <SelectItem key={schema.id} value={schema.id}>
                      {schema.name} (v{schema.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSchema && (
              <p className="text-sm text-muted-foreground">{selectedSchema.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Schema Preview */}
        {selectedSchema && (
          <Card>
            <CardHeader>
              <CardTitle>Contract Preview</CardTitle>
              <CardDescription>
                {selectedSchema.name} v{selectedSchema.version}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JsonSchemaViewer schema={selectedSchema.jsonSchema} />
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default QueueDetail;

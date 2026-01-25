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
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QueueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queue = mockQueues.find((q) => q.id === id);
  const assignedSchema = queue?.schemaId
    ? mockSchemas.find((s) => s.id === queue.schemaId)
    : undefined;

  const [exchange, setExchange] = useState(queue?.exchange || '');
  const [routingKey, setRoutingKey] = useState(queue?.routingKey || '');
  const [selectedSchemaId, setSelectedSchemaId] = useState(queue?.schemaId || '');
  const [isSaving, setIsSaving] = useState(false);

  const selectedSchema = selectedSchemaId
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
              <h1 className="text-2xl font-bold text-foreground">{queue.name}</h1>
              <StatusBadge status={queue.status} />
            </div>
            <p className="text-muted-foreground mt-1">Configure queue routing and contract</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Routing Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Routing Configuration</CardTitle>
              <CardDescription>
                Configure the exchange and routing key for this queue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Input
                  id="exchange"
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  placeholder="e.g., orders.exchange"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingKey">Routing Key</Label>
                <Input
                  id="routingKey"
                  value={routingKey}
                  onChange={(e) => setRoutingKey(e.target.value)}
                  placeholder="e.g., order.created"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

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
                    <SelectItem value="">No contract</SelectItem>
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
        </div>

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

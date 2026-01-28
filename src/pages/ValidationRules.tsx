import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Download, Trash2, ArrowRightLeft } from 'lucide-react';
import { mockSchemas } from '@/data/mockData';

interface PublishRule {
  id: string;
  virtualHost: string;
  exchange: string;
  routingKey: string;
  schemaId: string;
  version: string;
}

interface ConsumeRule {
  id: string;
  queueName: string;
  schemaId: string;
  version: string;
}

// Mock validation rules
const mockPublishRules: PublishRule[] = [
  {
    id: '1',
    virtualHost: '/',
    exchange: 'orders.exchange',
    routingKey: 'order.created',
    schemaId: 'order-created-event',
    version: '2.0.0',
  },
  {
    id: '2',
    virtualHost: '/',
    exchange: 'notifications.exchange',
    routingKey: 'user.notify',
    schemaId: 'user-notification',
    version: '2.0.1',
  },
];

const mockConsumeRules: ConsumeRule[] = [
  {
    id: '1',
    queueName: 'order-events',
    schemaId: 'order-created-event',
    version: '2.0.0',
  },
  {
    id: '2',
    queueName: 'user-notifications',
    schemaId: 'user-notification',
    version: '2.0.1',
  },
];

const ValidationRules = () => {
  const [publishRules, setPublishRules] = useState(mockPublishRules);
  const [consumeRules, setConsumeRules] = useState(mockConsumeRules);
  const [isAddPublishOpen, setIsAddPublishOpen] = useState(false);
  const [isAddConsumeOpen, setIsAddConsumeOpen] = useState(false);
  
  // Form state for new publish rule
  const [newPublishRule, setNewPublishRule] = useState({
    virtualHost: '/',
    exchange: '',
    routingKey: '',
    schemaId: '',
    version: '',
  });
  
  // Form state for new consume rule
  const [newConsumeRule, setNewConsumeRule] = useState({
    queueName: '',
    schemaId: '',
    version: '',
  });

  // Get unique schemas for selection
  const uniqueSchemas = Array.from(
    new Map(mockSchemas.map(s => [s.schemaId, s])).values()
  );

  // Get versions for a specific schema
  const getVersionsForSchema = (schemaId: string) => {
    return mockSchemas.filter(s => s.schemaId === schemaId);
  };

  const handleAddPublishRule = () => {
    const newRule: PublishRule = {
      id: Date.now().toString(),
      ...newPublishRule,
    };
    setPublishRules([...publishRules, newRule]);
    setIsAddPublishOpen(false);
    setNewPublishRule({ virtualHost: '/', exchange: '', routingKey: '', schemaId: '', version: '' });
  };

  const handleAddConsumeRule = () => {
    const newRule: ConsumeRule = {
      id: Date.now().toString(),
      ...newConsumeRule,
    };
    setConsumeRules([...consumeRules, newRule]);
    setIsAddConsumeOpen(false);
    setNewConsumeRule({ queueName: '', schemaId: '', version: '' });
  };

  const handleDeletePublishRule = (id: string) => {
    setPublishRules(publishRules.filter(r => r.id !== id));
  };

  const handleDeleteConsumeRule = (id: string) => {
    setConsumeRules(consumeRules.filter(r => r.id !== id));
  };

  const getSchemaName = (schemaId: string) => {
    const schema = mockSchemas.find(s => s.schemaId === schemaId);
    return schema?.name || schemaId;
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Validation Rules</h1>
          <p className="text-muted-foreground mt-1">
            Configure schema validation for publish and consume operations
          </p>
        </div>

        <Tabs defaultValue="publish" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Publish Rules
            </TabsTrigger>
            <TabsTrigger value="consume" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Consume Rules
            </TabsTrigger>
          </TabsList>

          {/* Publish Rules Tab */}
          <TabsContent value="publish" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Publish Validation</CardTitle>
                    <CardDescription>
                      Validate messages when publishers send to an exchange with a routing key
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsAddPublishOpen(true)} className="glow-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {publishRules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No publish rules configured. Add a rule to validate messages on publish.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {publishRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="font-mono">
                              {rule.virtualHost}
                            </Badge>
                            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="secondary" className="font-mono">
                              {rule.exchange}
                            </Badge>
                            <span className="text-muted-foreground">/</span>
                            <Badge variant="secondary" className="font-mono">
                              {rule.routingKey}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">{getSchemaName(rule.schemaId)}</p>
                            <p className="text-xs text-muted-foreground font-mono">v{rule.version}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeletePublishRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consume Rules Tab */}
          <TabsContent value="consume" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Consume Validation</CardTitle>
                    <CardDescription>
                      Validate messages when consumers receive from a queue
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsAddConsumeOpen(true)} className="glow-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {consumeRules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No consume rules configured. Add a rule to validate messages on consume.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {consumeRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Queue:</span>
                            <Badge variant="secondary" className="font-mono">
                              {rule.queueName}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">{getSchemaName(rule.schemaId)}</p>
                            <p className="text-xs text-muted-foreground font-mono">v{rule.version}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteConsumeRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Publish Rule Dialog */}
        <Dialog open={isAddPublishOpen} onOpenChange={setIsAddPublishOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Publish Rule</DialogTitle>
              <DialogDescription>
                Configure a validation rule for messages published to an exchange
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="virtualHost">Virtual Host</Label>
                <Input
                  id="virtualHost"
                  placeholder="/"
                  value={newPublishRule.virtualHost}
                  onChange={(e) => setNewPublishRule({ ...newPublishRule, virtualHost: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange Name</Label>
                <Input
                  id="exchange"
                  placeholder="orders.exchange"
                  value={newPublishRule.exchange}
                  onChange={(e) => setNewPublishRule({ ...newPublishRule, exchange: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingKey">Routing Key</Label>
                <Input
                  id="routingKey"
                  placeholder="order.created"
                  value={newPublishRule.routingKey}
                  onChange={(e) => setNewPublishRule({ ...newPublishRule, routingKey: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Schema</Label>
                <Select
                  value={newPublishRule.schemaId}
                  onValueChange={(value) => setNewPublishRule({ ...newPublishRule, schemaId: value, version: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueSchemas.map((schema) => (
                      <SelectItem key={schema.schemaId} value={schema.schemaId}>
                        {schema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newPublishRule.schemaId && (
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Select
                    value={newPublishRule.version}
                    onValueChange={(value) => setNewPublishRule({ ...newPublishRule, version: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      {getVersionsForSchema(newPublishRule.schemaId).map((schema) => (
                        <SelectItem key={schema.id} value={schema.version}>
                          v{schema.version} {schema.changelog && `- ${schema.changelog}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPublishOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPublishRule}
                disabled={!newPublishRule.exchange || !newPublishRule.routingKey || !newPublishRule.schemaId || !newPublishRule.version}
                className="glow-primary"
              >
                Add Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Consume Rule Dialog */}
        <Dialog open={isAddConsumeOpen} onOpenChange={setIsAddConsumeOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Consume Rule</DialogTitle>
              <DialogDescription>
                Configure a validation rule for messages consumed from a queue
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="queueName">Queue Name</Label>
                <Input
                  id="queueName"
                  placeholder="order-events"
                  value={newConsumeRule.queueName}
                  onChange={(e) => setNewConsumeRule({ ...newConsumeRule, queueName: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Schema</Label>
                <Select
                  value={newConsumeRule.schemaId}
                  onValueChange={(value) => setNewConsumeRule({ ...newConsumeRule, schemaId: value, version: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueSchemas.map((schema) => (
                      <SelectItem key={schema.schemaId} value={schema.schemaId}>
                        {schema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newConsumeRule.schemaId && (
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Select
                    value={newConsumeRule.version}
                    onValueChange={(value) => setNewConsumeRule({ ...newConsumeRule, version: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      {getVersionsForSchema(newConsumeRule.schemaId).map((schema) => (
                        <SelectItem key={schema.id} value={schema.version}>
                          v{schema.version} {schema.changelog && `- ${schema.changelog}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddConsumeOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddConsumeRule}
                disabled={!newConsumeRule.queueName || !newConsumeRule.schemaId || !newConsumeRule.version}
                className="glow-primary"
              >
                Add Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ValidationRules;

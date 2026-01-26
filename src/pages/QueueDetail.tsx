import { useState, useMemo } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [selectedContractType, setSelectedContractType] = useState<string>('none');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get unique contract types (names)
  const contractTypes = useMemo(() => {
    const types = new Map<string, { name: string; versions: typeof mockSchemas }>();
    mockSchemas.forEach((schema) => {
      if (!types.has(schema.name)) {
        types.set(schema.name, { name: schema.name, versions: [] });
      }
      types.get(schema.name)!.versions.push(schema);
    });
    return Array.from(types.values());
  }, []);

  // Get versions for selected contract type
  const availableVersions = useMemo(() => {
    if (!selectedContractType || selectedContractType === 'none') return [];
    const contractType = contractTypes.find((ct) => ct.name === selectedContractType);
    return contractType?.versions || [];
  }, [selectedContractType, contractTypes]);

  // Get the selected schema
  const selectedSchema = useMemo(() => {
    if (!selectedVersion) return undefined;
    return mockSchemas.find((s) => s.id === selectedVersion);
  }, [selectedVersion]);

  // Initialize selected contract from queue
  useState(() => {
    if (queue?.schemaId) {
      const schema = mockSchemas.find((s) => s.id === queue.schemaId);
      if (schema) {
        setSelectedContractType(schema.name);
        setSelectedVersion(schema.id);
      }
    }
  });

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

  const handleContractTypeChange = (value: string) => {
    setSelectedContractType(value);
    if (value === 'none') {
      setSelectedVersion('');
    } else {
      // Open version dialog if there are multiple versions
      const contractType = contractTypes.find((ct) => ct.name === value);
      if (contractType && contractType.versions.length > 1) {
        setIsVersionDialogOpen(true);
      } else if (contractType && contractType.versions.length === 1) {
        // Auto-select if only one version
        setSelectedVersion(contractType.versions[0].id);
      }
    }
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
    setIsVersionDialogOpen(false);
  };

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract-type">Contract Type</Label>
                <Select value={selectedContractType} onValueChange={handleContractTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contract type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No contract</SelectItem>
                    {contractTypes.map((ct) => (
                      <SelectItem key={ct.name} value={ct.name}>
                        {ct.name} ({ct.versions.length} version{ct.versions.length !== 1 ? 's' : ''})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedContractType && selectedContractType !== 'none' && (
                <div className="space-y-2">
                  <Label>Selected Version</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={selectedSchema ? `v${selectedSchema.version}` : 'Select version...'}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setIsVersionDialogOpen(true)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}
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

        {/* Version Selection Dialog */}
        <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Contract Version</DialogTitle>
              <DialogDescription>
                Choose a version of {selectedContractType} to assign to this queue.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              {availableVersions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => handleVersionSelect(version.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    selectedVersion === version.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">v{version.version}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(version.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {version.description}
                  </p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default QueueDetail;

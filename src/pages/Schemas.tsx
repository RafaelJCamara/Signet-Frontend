/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SchemaEditor } from '@/components/schema/SchemaEditor';
import { JsonSchemaViewer } from '@/components/schema/JsonSchemaViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, FileJson, ChevronDown, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { Schema } from '@/types/schema';
import { cn } from '@/lib/utils';

interface SchemaGroup {
  schemaId: string;
  name: string;
  versions: Schema[];
  latestVersion: Schema;
}

const Schemas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingSchema, setPendingSchema] = useState<{
    schema: object;
    name?: string;
    description?: string;
    version?: string;
    schemaId?: string;
    changelog?: string;
  } | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [loadingSchemas, setLoadingSchemas] = useState(false);
  const [schemasError, setSchemasError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Fetch schemas from backend on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingSchemas(true);
      setSchemasError(null);
      try {
        const res = await fetch('https://localhost:7215/api/schema');
        if (!res.ok) throw new Error(`Request failed ${res.status}`);
        const data = await res.json();

        // Map API result into `Schema` shape as best-effort
        const mapped: Schema[] = (Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.id ?? String(item._id ?? item.uid ?? ''),
          schemaId: item.schemaId ?? item.id ?? item.name ?? '',
          name: item.name ?? '',
          version: item.version ?? '1.0.0',
          description: item.description ?? item.desc ?? '',
          changelog: item.changeLog ?? item.changelog ?? item.change_log ?? '',
          jsonSchema: item.jsonSchema ?? (item.schemaDefinition ? JSON.parse(item.schemaDefinition) : item.jsonSchema ?? {}),
          createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
          updatedAt: item.updatedAt ?? item.updated_at ?? new Date().toISOString(),
          usageCount: typeof item.usageCount === 'number' ? item.usageCount : 0,
        }));

        if (!mounted) return;
        setSchemas(mapped);

        // If URL requested a specific schema/version, honor it now
        const schemaParam = searchParams.get('schema');
        const versionParam = searchParams.get('version');
        if (schemaParam) {
          setExpandedGroups(new Set([schemaParam]));
        }
        if (versionParam) {
          const found = mapped.find((s) => s.id === versionParam);
          if (found) setSelectedSchema(found);
        }

        // Clear params after processing
        if (searchParams.get('create') === 'true') {
          setIsCreateOpen(true);
        }
        setSearchParams({}, { replace: true });
      } catch (err) {
        setSchemasError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingSchemas(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [setSearchParams]);

  // Group schemas by schemaId
  const schemaGroups = useMemo(() => {
    const groups = new Map<string, Schema[]>();

    schemas.forEach((schema) => {
      const key = schema.schemaId;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(schema);
    });

    // Sort versions within each group (newest first)
    const result: SchemaGroup[] = [];
    groups.forEach((versions, schemaId) => {
      const sortedVersions = versions.sort((a, b) => {
        const aParts = a.version.split('.').map(Number);
        const bParts = b.version.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
          if (bParts[i] !== aParts[i]) return bParts[i] - aParts[i];
        }
        return 0;
      });

      result.push({
        schemaId,
        name: sortedVersions[0].name,
        versions: sortedVersions,
        latestVersion: sortedVersions[0],
      });
    });

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [schemas]);

  const filteredGroups = schemaGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.latestVersion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.schemaId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGroup = (schemaId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(schemaId)) {
        next.delete(schemaId);
      } else {
        next.add(schemaId);
      }
      return next;
    });
  };

  const handleCreateSave = (data: {
    schema: object;
    name?: string;
    description?: string;
    version?: string;
    schemaId?: string;
    changelog?: string;
  }) => {
    setPendingSchema(data);
    setIsConfirmOpen(true);
  };

  const handleConfirmCreate = () => {
    (async () => {
      if (!pendingSchema) return;

      // generate id from name if missing
      const generateSchemaId = (name?: string) =>
        (name || '')
          .toLowerCase()
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      const id = pendingSchema.schemaId || generateSchemaId(pendingSchema.name);

      const payload = {
        name: pendingSchema.name || '',
        version: pendingSchema.version || '1.0.0',
        id,
        description: pendingSchema.description || '',
        changeLog: pendingSchema.changelog || '',
        schemaDefinition: JSON.stringify(pendingSchema.schema || {}),
      };

      try {
        const res = await fetch('https://localhost:7215/api/schema', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed ${res.status}`);
        }

        // Try to read the created schema from response
        let createdItem: any = null;
        try {
          createdItem = await res.json();
        } catch {}

        // Map created item (or fallback to payload) into Schema shape
        const mapItemToSchema = (item: any) : Schema => ({
          id: item.id ?? String(item._id ?? item.uid ?? payload.id ?? ''),
          schemaId: item.schemaId ?? item.id ?? item.name ?? payload.id ?? '',
          name: item.name ?? payload.name ?? '',
          version: item.version ?? payload.version ?? '1.0.0',
          description: item.description ?? payload.description ?? '',
          changelog: item.changeLog ?? item.changelog ?? item.change_log ?? payload.changeLog ?? '',
          jsonSchema: item.jsonSchema ?? (item.schemaDefinition ? JSON.parse(item.schemaDefinition) : JSON.parse(payload.schemaDefinition)),
          createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
          updatedAt: item.updatedAt ?? item.updated_at ?? new Date().toISOString(),
          usageCount: typeof item.usageCount === 'number' ? item.usageCount : 0,
        });

        const newSchema = createdItem ? mapItemToSchema(createdItem) : mapItemToSchema(payload);

        // Prepend newly created schema so it appears immediately
        setSchemas((prev) => [newSchema, ...prev]);

        toast({
          title: 'Schema Created',
          description: (
            <span>
              Schema <strong className="font-mono">{newSchema.schemaId}</strong> created successfully.
            </span>
          ),
          variant: 'success',
        });

        setIsConfirmOpen(false);
        setIsCreateOpen(false);
        setPendingSchema(null);
      } catch (err) {
        console.error('Failed to create schema', err);
        toast({
          title: 'Failed to create schema',
          description: String(err instanceof Error ? err.message : err),
          variant: 'destructive',
        });
        // Keep the confirm dialog open so the user can retry or go back to edit
      }
    })();
  };

  const handleBackToEdit = () => {
    setIsConfirmOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Schemas</h1>
            <p className="text-muted-foreground mt-1">
              Define and manage JSON Schema contracts for your messages
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="glow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Schema
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Schema</DialogTitle>
                <DialogDescription>
                  Define a JSON Schema contract for your message validation.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <SchemaEditor
                  showMetadata
                  isNewSchema
                  onSave={handleCreateSave}
                  onCancel={() => setIsCreateOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Confirm Schema ID
              </DialogTitle>
              <DialogDescription className="pt-2">
                <p className="mb-3">
                  The Schema ID cannot be changed after creation. All future versions of this schema will use this ID.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border">
                  <p className="text-xs text-muted-foreground mb-1">Schema ID</p>
                  <p className="font-mono text-foreground font-medium">
                    {pendingSchema?.schemaId || 'Not set'}
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleBackToEdit}>
                Go Back to Edit
              </Button>
              <Button onClick={handleConfirmCreate} className="glow-primary">
                Confirm & Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search */}
        {loadingSchemas ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading schemas...</p>
          </div>
        ) : schemasError ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-warning/80 mb-4" />
            <p className="text-muted-foreground">Failed to load schemas: {schemasError}</p>
          </div>
        ) : (
          <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          </div>
        )}

        {/* Schema Groups */}
        <div className="space-y-3">
          {filteredGroups.map((group, index) => (
            <Collapsible
              key={group.schemaId}
              open={expandedGroups.has(group.schemaId)}
              onOpenChange={() => toggleGroup(group.schemaId)}
            >
              <div
                className="animate-fade-in rounded-xl border border-border bg-card overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg',
                        'bg-primary/10 text-primary'
                      )}
                    >
                      <FileJson className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-foreground truncate">
                          {group.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {group.versions.length} version{group.versions.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {group.latestVersion.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        ID: {group.schemaId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Badge variant="outline" className="font-mono text-xs">
                        Latest: v{group.latestVersion.version}
                      </Badge>
                      {expandedGroups.has(group.schemaId) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-border">
                    {group.versions.map((version, vIndex) => (
                      <div
                        key={version.id}
                        className={cn(
                          'flex items-center gap-4 px-4 py-3 pl-16 hover:bg-muted/30 cursor-pointer transition-colors',
                          vIndex !== group.versions.length - 1 && 'border-b border-border/50'
                        )}
                        onClick={() => setSelectedSchema(version)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Badge variant="outline" className="font-mono text-xs">
                              v{version.version}
                            </Badge>
                            {vIndex === 0 && (
                              <Badge className="text-xs bg-primary/20 text-primary hover:bg-primary/20">
                                Latest
                              </Badge>
                            )}
                          </div>
                          {version.changelog && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {version.changelog}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(version.updatedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <FileJson className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No schemas found matching your criteria.</p>
          </div>
        )}

        {/* Schema Detail Sheet */}
        <Sheet open={!!selectedSchema} onOpenChange={() => setSelectedSchema(null)}>
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            {selectedSchema && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    {selectedSchema.name}
                    <span className="text-sm font-mono text-muted-foreground">
                      v{selectedSchema.version}
                    </span>
                  </SheetTitle>
                  <SheetDescription>{selectedSchema.description}</SheetDescription>
                  {selectedSchema.changelog && (
                    <div className="mt-2 p-2 bg-muted/50 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Changelog</p>
                      <p className="text-sm text-foreground">{selectedSchema.changelog}</p>
                    </div>
                  )}
                </SheetHeader>

                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <JsonSchemaViewer schema={selectedSchema.jsonSchema} />
                  </TabsContent>
                  <TabsContent value="edit">
                    <SchemaEditor
                      initialSchema={selectedSchema.jsonSchema}
                      initialName={selectedSchema.name}
                      initialDescription={selectedSchema.description}
                      initialVersion={selectedSchema.version}
                      initialChangelog={selectedSchema.changelog}
                      showMetadata
                      isNewSchema={false}
                      onSave={(data) => {
                        console.log('Updated schema:', data);
                        setSelectedSchema(null);
                      }}
                      onCancel={() => setSelectedSchema(null)}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
};

export default Schemas;
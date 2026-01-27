import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SchemaEditor } from '@/components/schema/SchemaEditor';
import { JsonSchemaViewer } from '@/components/schema/JsonSchemaViewer';
import { mockSchemas } from '@/data/mockData';
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group schemas by schemaId
  const schemaGroups = useMemo(() => {
    const groups = new Map<string, Schema[]>();
    
    mockSchemas.forEach((schema) => {
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
  }, []);

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
    console.log('Schema created:', pendingSchema);
    setIsConfirmOpen(false);
    setIsCreateOpen(false);
    setPendingSchema(null);
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
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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
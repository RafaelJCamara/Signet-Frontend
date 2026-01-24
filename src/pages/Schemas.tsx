import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SchemaCard } from '@/components/dashboard/SchemaCard';
import { SchemaEditor } from '@/components/schema/SchemaEditor';
import { JsonSchemaViewer } from '@/components/schema/JsonSchemaViewer';
import { mockSchemas } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, FileJson } from 'lucide-react';
import { Schema } from '@/types/schema';

const Schemas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);

  const filteredSchemas = mockSchemas.filter(
    (schema) =>
      schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schema-name">Schema Name</Label>
                    <Input
                      id="schema-name"
                      placeholder="e.g., OrderCreatedEvent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      placeholder="e.g., 1.0.0"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this schema validates..."
                    rows={2}
                  />
                </div>
                <SchemaEditor
                  onSave={(schema) => {
                    console.log('Schema saved:', schema);
                    setIsCreateOpen(false);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

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

        {/* Schema Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSchemas.map((schema, index) => (
            <div
              key={schema.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SchemaCard
                schema={schema}
                onClick={() => setSelectedSchema(schema)}
              />
            </div>
          ))}
        </div>

        {filteredSchemas.length === 0 && (
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
                      onSave={(schema) => {
                        console.log('Updated schema:', schema);
                        setSelectedSchema(null);
                      }}
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

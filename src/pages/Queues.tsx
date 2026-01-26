import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { QueueCard } from '@/components/dashboard/QueueCard';
import { mockQueues, mockSchemas } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter } from 'lucide-react';

const Queues = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newQueueName, setNewQueueName] = useState('');
  const [newQueueSchemaId, setNewQueueSchemaId] = useState('none');

  const filteredQueues = mockQueues.filter((queue) => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || queue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSchemaForQueue = (schemaId?: string) => {
    if (!schemaId) return undefined;
    return mockSchemas.find((s) => s.id === schemaId);
  };

  const handleCreateQueue = () => {
    if (!newQueueName.trim()) return;
    console.log('Creating queue:', { name: newQueueName, schemaId: newQueueSchemaId });
    setIsCreateOpen(false);
    setNewQueueName('');
    setNewQueueSchemaId('none');
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Queues</h1>
            <p className="text-muted-foreground mt-1">
              Manage queues and their message contracts
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="glow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Queue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Queue</DialogTitle>
                <DialogDescription>
                  Register a queue and assign a message contract.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Queue Name</Label>
                  <Input
                    id="name"
                    value={newQueueName}
                    onChange={(e) => setNewQueueName(e.target.value)}
                    placeholder="e.g., order-events"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schema">Assign Contract</Label>
                  <Select value={newQueueSchemaId} onValueChange={setNewQueueSchemaId}>
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
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="glow-primary" onClick={handleCreateQueue}>
                  Add Queue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search queues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Queue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredQueues.map((queue, index) => (
            <div
              key={queue.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <QueueCard
                queue={queue}
                schema={getSchemaForQueue(queue.schemaId)}
                onClick={() => navigate(`/queues/${queue.id}`)}
              />
            </div>
          ))}
        </div>

        {filteredQueues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No queues found matching your criteria.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Queues;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/StatCard';
import { QueueCard } from '@/components/dashboard/QueueCard';
import { SchemaCard } from '@/components/dashboard/SchemaCard';
import { mockQueues, mockSchemas } from '@/data/mockData';
import { Database, FileJson, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/StatusBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isIssuesOpen, setIsIssuesOpen] = useState(false);
  
  const activeQueues = mockQueues.filter((q) => q.status === 'active').length;
  const issueQueues = mockQueues.filter((q) => q.status === 'error' || q.status === 'missing');

  const getSchemaForQueue = (schemaId?: string) => {
    if (!schemaId) return undefined;
    return mockSchemas.find((s) => s.id === schemaId);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your queues and message contracts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/queues')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Queue
            </Button>
            <Button
              onClick={() => navigate('/schemas?create=true')}
              className="glow-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Queues"
            value={mockQueues.length}
            subtitle={`${activeQueues} active`}
            icon={Database}
          />
          <StatCard
            title="Contracts"
            value={mockSchemas.length}
            subtitle="Message schemas"
            icon={FileJson}
          />
          <div
            onClick={() => setIsIssuesOpen(true)}
            className="cursor-pointer"
          >
            <StatCard
              title="Issues"
              value={issueQueues.length}
              subtitle="Need attention"
              icon={AlertTriangle}
            />
          </div>
        </div>

        {/* Queues Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Queues</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/queues')}
              className="text-muted-foreground hover:text-foreground"
            >
              View all →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockQueues.slice(0, 4).map((queue) => (
              <QueueCard
                key={queue.id}
                queue={queue}
                schema={getSchemaForQueue(queue.schemaId)}
                onClick={() => navigate(`/queues/${queue.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Schemas Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Contracts</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/schemas')}
              className="text-muted-foreground hover:text-foreground"
            >
              View all →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSchemas.map((schema) => (
              <SchemaCard
                key={schema.id}
                schema={schema}
                onClick={() => navigate(`/schemas?schema=${schema.schemaId}&version=${schema.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Issues Dialog */}
        <Dialog open={isIssuesOpen} onOpenChange={setIsIssuesOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Queue Issues</DialogTitle>
              <DialogDescription>
                Queues that need attention
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
              {issueQueues.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No issues found. All queues are healthy!
                </p>
              ) : (
                issueQueues.map((queue) => (
                  <button
                    key={queue.id}
                    onClick={() => {
                      setIsIssuesOpen(false);
                      navigate(`/queues/${queue.id}`);
                    }}
                    className="w-full p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium font-mono">{queue.name}</span>
                      <StatusBadge status={queue.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {queue.status === 'error' && 'Queue has validation errors'}
                      {queue.status === 'missing' && 'Queue is missing required contract'}
                    </p>
                  </button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

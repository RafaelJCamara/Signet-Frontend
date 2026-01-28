import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/StatCard';
import { SchemaCard } from '@/components/dashboard/SchemaCard';
import { mockSchemas } from '@/data/mockData';
import { FileJson, ShieldCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();

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
          <Button
            onClick={() => navigate('/schemas?create=true')}
            className="glow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Contracts"
            value={mockSchemas.length}
            subtitle="Message schemas"
            icon={FileJson}
          />
          <StatCard
            title="Validation Rules"
            value={0}
            subtitle="Publish & consume"
            icon={ShieldCheck}
            onClick={() => navigate('/validation')}
          />
        </div>

        {/* Contracts Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Contracts</h2>
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
      </div>
    </AppLayout>
  );
};

export default Dashboard;

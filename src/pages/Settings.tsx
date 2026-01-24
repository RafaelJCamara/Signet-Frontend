import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Server, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your Schema Registry preferences
          </p>
        </div>

        {/* RabbitMQ Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">RabbitMQ Connection</CardTitle>
                <CardDescription>
                  Configure your RabbitMQ server connection
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  placeholder="localhost"
                  defaultValue="localhost"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="5672"
                  defaultValue="5672"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="guest" defaultValue="guest" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="guest"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vhost">Virtual Host</Label>
              <Input
                id="vhost"
                placeholder="/"
                defaultValue="/"
                className="font-mono"
              />
            </div>
            <div className="flex justify-end">
              <Button className="glow-primary">Test Connection</Button>
            </div>
          </CardContent>
        </Card>

        {/* Schema Validation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Schema Validation</CardTitle>
                <CardDescription>
                  Configure how schemas are validated
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Strict Mode</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Reject messages that don't match their assigned schema
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Allow Additional Properties</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Allow properties not defined in the schema
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Validate on Publish</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Validate messages before they are published to queues
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  Configure alert preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Schema Violations</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Get notified when messages fail schema validation
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Queue Errors</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Get notified when queues encounter errors
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button className="glow-primary">Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;

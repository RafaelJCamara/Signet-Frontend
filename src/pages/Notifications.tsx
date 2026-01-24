import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Server, Shield, TestTube, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Notifications = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTesting(false);

    // Simulate success/failure randomly for demo
    const success = Math.random() > 0.3;
    if (success) {
      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to the email server.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to the email server. Please check your credentials.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    toast({
      title: 'Settings Saved',
      description: 'Your notification settings have been saved successfully.',
      variant: 'success',
    });
  };

  const handleSendTestEmail = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTesting(false);

    const success = Math.random() > 0.2;
    if (success) {
      toast({
        title: 'Test Email Sent',
        description: 'A test email has been sent to the configured address.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Failed to Send Test Email',
        description: 'Could not send test email. Please verify your SMTP settings.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Configure how you receive alerts and notifications
          </p>
        </div>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Email Settings</CardTitle>
                <CardDescription>
                  Configure email addresses for notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-email">From Email Address</Label>
              <Input
                id="from-email"
                type="email"
                placeholder="noreply@example.com"
                defaultValue="noreply@schemaregistry.com"
              />
              <p className="text-xs text-muted-foreground">
                This address will appear as the sender for all notifications
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-to">Reply-To Address</Label>
              <Input
                id="reply-to"
                type="email"
                placeholder="support@example.com"
                defaultValue="support@schemaregistry.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Notification Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                defaultValue="admin@schemaregistry.com"
              />
              <p className="text-xs text-muted-foreground">
                Critical system alerts will be sent to this address
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SMTP Server Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">SMTP Server</CardTitle>
                <CardDescription>
                  Configure your email server connection
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  placeholder="smtp.example.com"
                  defaultValue="smtp.mailserver.com"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  placeholder="587"
                  defaultValue="587"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">Username</Label>
                <Input
                  id="smtp-username"
                  placeholder="username"
                  defaultValue="smtp-user"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password123"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryption">Encryption Method</Label>
              <Select defaultValue="tls">
                <SelectTrigger id="encryption">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="starttls">STARTTLS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                Test Connection
              </Button>
              <Button
                variant="outline"
                onClick={handleSendTestEmail}
                disabled={isTesting}
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>
                  Additional security settings for email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Verify SSL Certificates</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Validate server SSL certificates for secure connections
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Require Authentication</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Always require SMTP authentication
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Email Alerts</CardTitle>
                <CardDescription>
                  Choose which events trigger email notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Schema Validation Errors</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Get notified when messages fail schema validation
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Queue Connection Issues</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Alert when queues become unreachable
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Schema Updates</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Notify when schemas are created or modified
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Daily Summary</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Receive a daily digest of all activity
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            className="glow-primary"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifications;

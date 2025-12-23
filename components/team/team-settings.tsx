'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Settings, Shield, Bell, Eye, Lock, Users } from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

export function TeamSettings() {
  const { permissions, isOwner, isOwnerOrAdmin } = usePermissions()

  if (!permissions.readTeam) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Team Settings
        </CardTitle>
        <CardDescription>
          Configure team preferences and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Permissions */}
        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Default Permissions
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="allow-expense-creation">Allow all members to create expenses</Label>
                <p className="text-sm text-muted-foreground">
                  Members can create expense entries without approval
                </p>
              </div>
              <Switch
                id="allow-expense-creation"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="require-approval">Require approval for expenses over threshold</Label>
                <p className="text-sm text-muted-foreground">
                  Expenses above $500 require admin approval
                </p>
              </div>
              <Switch
                id="require-approval"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="allow-budget-view">Allow all members to view budgets</Label>
                <p className="text-sm text-muted-foreground">
                  Members can view budget information and progress
                </p>
              </div>
              <Switch
                id="allow-budget-view"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notify-invites">Notify on team invitations</Label>
                <p className="text-sm text-muted-foreground">
                  Send email when new members are invited
                </p>
              </div>
              <Switch
                id="notify-invites"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notify-role-changes">Notify on role changes</Label>
                <p className="text-sm text-muted-foreground">
                  Send email when member roles are updated
                </p>
              </div>
              <Switch
                id="notify-role-changes"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notify-expense-approval">Notify on expense approvals</Label>
                <p className="text-sm text-muted-foreground">
                  Send email when expenses need approval
                </p>
              </div>
              <Switch
                id="notify-expense-approval"
                defaultChecked={false}
                disabled={!isOwnerOrAdmin}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="require-2fa">Require two-factor authentication</Label>
                <p className="text-sm text-muted-foreground">
                  All team members must enable 2FA
                </p>
              </div>
              <Switch
                id="require-2fa"
                defaultChecked={false}
                disabled={!isOwner}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="session-timeout">Auto logout after inactivity</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out users after 8 hours of inactivity
                </p>
              </div>
              <Switch
                id="session-timeout"
                defaultChecked={true}
                disabled={!isOwner}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="audit-logging">Enhanced audit logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log detailed user actions and IP addresses
                </p>
              </div>
              <Switch
                id="audit-logging"
                defaultChecked={true}
                disabled={!isOwner}
              />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h4 className="font-medium mb-4 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Data & Privacy
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Data retention period</Label>
                <p className="text-sm text-muted-foreground">
                  Keep audit logs and activity data for 1 year
                </p>
              </div>
              <Badge variant="outline">1 year</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Export team data</Label>
                <p className="text-sm text-muted-foreground">
                  Download all team data in JSON format
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={!isOwner}>
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        {isOwner && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-4 text-red-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Danger Zone
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="space-y-1">
                  <Label className="text-red-800">Remove all team members</Label>
                  <p className="text-sm text-red-600">
                    This will remove all team members except owners
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Remove All
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="space-y-1">
                  <Label className="text-red-800">Delete startup workspace</Label>
                  <p className="text-sm text-red-600">
                    Permanently delete this startup and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Workspace
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Save Settings */}
        {isOwnerOrAdmin && (
          <div className="pt-4 border-t">
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
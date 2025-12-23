'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Building2, Globe, DollarSign, Calendar, AlertTriangle } from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'
import { useStartup } from '@/hooks/use-startup'

export function StartupSettings() {
  const { permissions, isOwner, isOwnerOrAdmin } = usePermissions()
  const { currentStartup } = useStartup()
  const [isLoading, setIsLoading] = useState(false)

  if (!permissions.readStartup) {
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    // TODO: Implement save functionality
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your startup's basic details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startup-name">Startup Name</Label>
              <Input
                id="startup-name"
                defaultValue={currentStartup?.name || ''}
                disabled={!isOwnerOrAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select disabled={!isOwnerOrAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your startup"
              className="min-h-[100px]"
              disabled={!isOwnerOrAdmin}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                disabled={!isOwnerOrAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founded-date">Founded Date</Label>
              <Input
                id="founded-date"
                type="date"
                disabled={!isOwnerOrAdmin}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Settings
          </CardTitle>
          <CardDescription>
            Configure financial preferences and default settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select disabled={!isOwnerOrAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal-year-start">Fiscal Year Start</Label>
              <Select disabled={!isOwnerOrAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-approval-threshold">Expense Approval Threshold</Label>
              <Input
                id="expense-approval-threshold"
                type="number"
                placeholder="500"
                disabled={!isOwnerOrAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-period">Default Budget Period</Label>
              <Select disabled={!isOwnerOrAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-categorize">Auto-categorize expenses</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically categorize expenses based on vendor and description
                </p>
              </div>
              <Switch
                id="auto-categorize"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="receipt-required">Require receipts for all expenses</Label>
                <p className="text-sm text-muted-foreground">
                  All expense entries must include receipt attachments
                </p>
              </div>
              <Switch
                id="receipt-required"
                defaultChecked={false}
                disabled={!isOwnerOrAdmin}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Compliance & Reporting
          </CardTitle>
          <CardDescription>
            Configure reporting schedules and compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID / EIN</Label>
              <Input
                id="tax-id"
                placeholder="XX-XXXXXXX"
                disabled={!isOwnerOrAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select disabled={!isOwnerOrAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="corp">Corporation</SelectItem>
                  <SelectItem value="s-corp">S Corporation</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="sole-prop">Sole Proprietorship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="monthly-reports">Generate monthly reports</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate and email monthly financial reports
                </p>
              </div>
              <Switch
                id="monthly-reports"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="tax-reminders">Tax deadline reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications for upcoming tax deadlines and requirements
                </p>
              </div>
              <Switch
                id="tax-reminders"
                defaultChecked={true}
                disabled={!isOwnerOrAdmin}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {isOwner && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your entire startup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="space-y-1">
                <Label className="text-red-800">Archive Startup</Label>
                <p className="text-sm text-red-600">
                  Archive this startup and make it read-only. Can be undone.
                </p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
                Archive
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="space-y-1">
                <Label className="text-red-800">Delete Startup</Label>
                <p className="text-sm text-red-600">
                  Permanently delete this startup and all its data. This cannot be undone.
                </p>
              </div>
              <Button variant="destructive">
                Delete Startup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Settings */}
      {isOwnerOrAdmin && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}
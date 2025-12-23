'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Plug, 
  CreditCard, 
  Building2, 
  FileText, 
  Mail, 
  Smartphone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  category: 'banking' | 'payment' | 'accounting' | 'communication' | 'other'
  isConnected: boolean
  features: string[]
  status?: 'active' | 'error' | 'pending'
  lastSync?: string
}

export function IntegrationsSettings() {
  const { permissions, isOwnerOrAdmin } = usePermissions()
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept payments and manage transactions',
      icon: CreditCard,
      category: 'payment',
      isConnected: true,
      status: 'active',
      lastSync: '2 hours ago',
      features: ['Payment processing', 'Subscription billing', 'Transaction sync']
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Sync expenses and financial data',
      icon: FileText,
      category: 'accounting',
      isConnected: false,
      features: ['Expense sync', 'Chart of accounts', 'Financial reports']
    },
    {
      id: 'plaid',
      name: 'Plaid',
      description: 'Connect bank accounts securely',
      icon: Building2,
      category: 'banking',
      isConnected: true,
      status: 'active',
      lastSync: '1 hour ago',
      features: ['Bank account linking', 'Transaction import', 'Balance monitoring']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications in your workspace',
      icon: Mail,
      category: 'communication',
      isConnected: false,
      features: ['Expense notifications', 'Budget alerts', 'Team updates']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 1000+ apps',
      icon: Plug,
      category: 'other',
      isConnected: false,
      features: ['Workflow automation', 'Data sync', 'Custom triggers']
    }
  ])

  if (!permissions.readStartup) {
    return null
  }

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, isConnected: true, status: 'active' as const }
        : integration
    ))
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, isConnected: false, status: undefined }
        : integration
    ))
  }

  const getStatusBadge = (integration: Integration) => {
    if (!integration.isConnected) return null
    
    switch (integration.status) {
      case 'active':
        return <Badge variant="secondary" className="text-green-600 bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">Connected</Badge>
    }
  }

  const categories = {
    banking: { label: 'Banking', icon: Building2 },
    payment: { label: 'Payments', icon: CreditCard },
    accounting: { label: 'Accounting', icon: FileText },
    communication: { label: 'Communication', icon: Mail },
    other: { label: 'Other', icon: Plug }
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plug className="w-5 h-5 mr-2" />
            Integrations Overview
          </CardTitle>
          <CardDescription>
            Connect your favorite tools to streamline your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.isConnected).length}
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {integrations.filter(i => !i.isConnected).length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(categories).length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations by Category */}
      {Object.entries(categories).map(([categoryId, category]) => {
        const categoryIntegrations = integrations.filter(i => i.category === categoryId)
        if (categoryIntegrations.length === 0) return null

        const CategoryIcon = category.icon

        return (
          <Card key={categoryId}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CategoryIcon className="w-5 h-5 mr-2" />
                {category.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryIntegrations.map((integration) => {
                  const IntegrationIcon = integration.icon
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <IntegrationIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{integration.name}</h3>
                            {getStatusBadge(integration)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {integration.description}
                          </p>
                          {integration.isConnected && integration.lastSync && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Last synced: {integration.lastSync}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {integration.isConnected ? (
                          <>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(integration.id)}
                              disabled={!isOwnerOrAdmin}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => handleConnect(integration.id)}
                            disabled={!isOwnerOrAdmin}
                            size="sm"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            API Access
          </CardTitle>
          <CardDescription>
            Manage API keys and webhook configurations for custom integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="api-enabled">Enable API access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow external applications to access your data via API
                </p>
              </div>
              <Switch
                id="api-enabled"
                defaultChecked={false}
                disabled={!isOwnerOrAdmin}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>API Key</Label>
                <p className="text-sm text-muted-foreground">
                  Use this key to authenticate API requests
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={!isOwnerOrAdmin}>
                Generate Key
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="webhook-url"
                  placeholder="https://yourapp.com/webhooks/founder-ledger"
                  disabled={!isOwnerOrAdmin}
                />
                <Button variant="outline" disabled={!isOwnerOrAdmin}>
                  Test
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications for events like new expenses or budget updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Developer Resources</CardTitle>
          <CardDescription>
            Documentation and tools for building custom integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">API Documentation</div>
                <div className="text-sm text-muted-foreground">
                  Complete reference for all endpoints
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">SDK & Libraries</div>
                <div className="text-sm text-muted-foreground">
                  Official SDKs for popular languages
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Webhooks Guide</div>
                <div className="text-sm text-muted-foreground">
                  Set up real-time event notifications
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Community Support</div>
                <div className="text-sm text-muted-foreground">
                  Get help from other developers
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
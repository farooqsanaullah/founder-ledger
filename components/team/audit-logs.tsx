'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Activity, User, UserPlus, UserMinus, Shield, Download, Eye, Plus, Edit, Trash } from 'lucide-react'
import { useStartup } from '@/hooks/use-startup'
import { usePermissions } from '@/hooks/use-permissions'

interface AuditLog {
  id: string
  action: string
  resource: string
  resourceId?: string
  details?: any
  userEmail?: string
  userAgent?: string
  ipAddress?: string
  createdAt: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
}

const actionConfig = {
  created: { icon: Plus, label: 'Created', color: 'bg-green-100 text-green-800' },
  updated: { icon: Edit, label: 'Updated', color: 'bg-blue-100 text-blue-800' },
  deleted: { icon: Trash, label: 'Deleted', color: 'bg-red-100 text-red-800' },
  invited: { icon: UserPlus, label: 'Invited', color: 'bg-purple-100 text-purple-800' },
  joined: { icon: User, label: 'Joined', color: 'bg-green-100 text-green-800' },
  left: { icon: UserMinus, label: 'Left', color: 'bg-orange-100 text-orange-800' },
  role_changed: { icon: Shield, label: 'Role Changed', color: 'bg-yellow-100 text-yellow-800' },
  login: { icon: User, label: 'Logged In', color: 'bg-blue-100 text-blue-800' },
  logout: { icon: User, label: 'Logged Out', color: 'bg-gray-100 text-gray-800' },
  export: { icon: Download, label: 'Exported', color: 'bg-indigo-100 text-indigo-800' },
}

export function AuditLogs() {
  const { currentStartup } = useStartup()
  const { permissions } = usePermissions()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentStartup || !permissions.readTeam) return

    fetchAuditLogs()
  }, [currentStartup, permissions.readTeam])

  const fetchAuditLogs = async () => {
    if (!currentStartup) return

    try {
      const response = await fetch(`/api/audit-logs?startupId=${currentStartup.id}&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      
      const data = await response.json()
      setLogs(data.logs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffHours / 24

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const getActionDescription = (log: AuditLog) => {
    const actionInfo = actionConfig[log.action as keyof typeof actionConfig]
    const resource = log.resource.replace('_', ' ')
    
    let description = `${actionInfo?.label || log.action} ${resource}`

    if (log.details) {
      if (log.action === 'role_changed' && log.details.oldRole && log.details.newRole) {
        description = `Changed role from ${log.details.oldRole} to ${log.details.newRole}`
      } else if (log.action === 'invited' && log.details.targetUserEmail) {
        description = `Invited ${log.details.targetUserEmail} as ${log.details.role || 'member'}`
      }
    }

    return description
  }

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  }

  if (!currentStartup || !permissions.readTeam) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading activity...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Recent team and system activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => {
              const actionInfo = actionConfig[log.action as keyof typeof actionConfig]
              const ActionIcon = actionInfo?.icon || Activity

              return (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {log.user ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={log.user.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {getInitials(log.user.firstName, log.user.lastName, log.user.email)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                        <ActionIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {log.user ? (
                          log.user.firstName && log.user.lastName
                            ? `${log.user.firstName} ${log.user.lastName}`
                            : log.user.email.split('@')[0]
                        ) : (
                          log.userEmail?.split('@')[0] || 'System'
                        )}
                      </span>
                      <Badge className={actionInfo?.color || 'bg-gray-100 text-gray-800'}>
                        <ActionIcon className="w-3 h-3 mr-1" />
                        {actionInfo?.label || log.action}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      {getActionDescription(log)}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatDate(log.createdAt)}</span>
                      {log.ipAddress && (
                        <>
                          <span>•</span>
                          <span>{log.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
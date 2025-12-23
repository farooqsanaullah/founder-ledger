'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Clock, CheckCircle, XCircle, Mail, Trash2 } from 'lucide-react'
import { useStartup } from '@/hooks/use-startup'
import { usePermissions } from '@/hooks/use-permissions'

interface TeamInvitation {
  id: string
  email: string
  role: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  expiresAt: string
  createdAt: string
  inviterName?: string
  inviterEmail: string
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  accepted: { icon: CheckCircle, label: 'Accepted', color: 'bg-green-100 text-green-800' },
  declined: { icon: XCircle, label: 'Declined', color: 'bg-red-100 text-red-800' },
  expired: { icon: XCircle, label: 'Expired', color: 'bg-gray-100 text-gray-800' },
}

export function TeamInvitations() {
  const { currentStartup } = useStartup()
  const { permissions } = usePermissions()
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentStartup || !permissions.readTeam) return

    fetchInvitations()
  }, [currentStartup, permissions.readTeam])

  const fetchInvitations = async () => {
    if (!currentStartup) return

    try {
      const response = await fetch(`/api/team/invitations?startupId=${currentStartup.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch invitations')
      }
      
      const data = await response.json()
      setInvitations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendInvitation = async (invitationId: string) => {
    // TODO: Implement resend functionality
    console.log('Resending invitation:', invitationId)
    // This would typically call an API endpoint to resend the invitation email
  }

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return
    }

    // TODO: Implement cancel functionality
    console.log('Cancelling invitation:', invitationId)
    // This would typically call an API endpoint to cancel the invitation
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date() > new Date(expiresAt)
  }

  if (!currentStartup || !permissions.readTeam) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading invitations...
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
            <UserPlus className="w-5 h-5 mr-2" />
            Pending Invitations
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

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  const otherInvitations = invitations.filter(inv => inv.status !== 'pending')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          Team Invitations
        </CardTitle>
        <CardDescription>
          {pendingInvitations.length} pending invitation{pendingInvitations.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No invitations sent yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Invitations */}
            {pendingInvitations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-yellow-700">Pending Invitations</h4>
                <div className="space-y-3">
                  {pendingInvitations.map((invitation) => {
                    const statusInfo = statusConfig[invitation.status]
                    const StatusIcon = statusInfo.icon
                    const expired = isExpired(invitation.expiresAt)

                    return (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Mail className="w-8 h-8 text-yellow-600 bg-yellow-100 rounded-full p-2" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{invitation.email}</span>
                              <Badge variant="outline" className="capitalize">
                                {invitation.role}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {expired ? (
                                <span className="text-red-600">Expired {formatDate(invitation.expiresAt)}</span>
                              ) : (
                                <>
                                  Invited {formatDate(invitation.createdAt)} • 
                                  Expires {formatDate(invitation.expiresAt)}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className={expired ? statusConfig.expired.color : statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {expired ? 'Expired' : statusInfo.label}
                          </Badge>

                          {permissions.manageTeam && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendInvitation(invitation.id)}
                              >
                                Resend
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelInvitation(invitation.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Other Invitations */}
            {otherInvitations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground">Recent Activity</h4>
                <div className="space-y-3">
                  {otherInvitations.slice(0, 5).map((invitation) => {
                    const statusInfo = statusConfig[invitation.status]
                    const StatusIcon = statusInfo.icon

                    return (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <StatusIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{invitation.email}</span>
                              <Badge variant="outline" className="capitalize">
                                {invitation.role}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {invitation.status === 'accepted' ? 'Joined' : 'Invitation'} {formatDate(invitation.createdAt)}
                            </div>
                          </div>
                        </div>

                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
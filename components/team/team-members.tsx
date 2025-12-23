'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Users, MoreVertical, Crown, Shield, User, Eye, Mail } from 'lucide-react'
import { useStartup } from '@/hooks/use-startup'
import { usePermissions } from '@/hooks/use-permissions'
import { Role } from '@/lib/permissions'

interface TeamMember {
  id: string
  userId: string
  role: Role
  joinedAt: string
  isActive: boolean
  permissions?: any
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
}

const roleConfig = {
  owner: { icon: Crown, label: 'Owner', color: 'bg-red-100 text-red-800' },
  admin: { icon: Shield, label: 'Admin', color: 'bg-blue-100 text-blue-800' },
  member: { icon: User, label: 'Member', color: 'bg-green-100 text-green-800' },
  viewer: { icon: Eye, label: 'Viewer', color: 'bg-gray-100 text-gray-800' },
}

export function TeamMembers() {
  const { currentStartup } = useStartup()
  const { permissions, userRole } = usePermissions()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentStartup) return

    fetchMembers()
  }, [currentStartup])

  const fetchMembers = async () => {
    if (!currentStartup) return

    try {
      const response = await fetch(`/api/team/members?startupId=${currentStartup.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }
      
      const data = await response.json()
      setMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: Role) => {
    if (!currentStartup) return

    try {
      const response = await fetch(`/api/team/members?startupId=${currentStartup.id}&memberId=${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update member role')
      }

      await fetchMembers()
      // TODO: Show success toast
    } catch (err) {
      console.error('Error updating member role:', err)
      // TODO: Show error toast
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!currentStartup) return
    
    if (!confirm('Are you sure you want to remove this member?')) {
      return
    }

    try {
      const response = await fetch(`/api/team/members?startupId=${currentStartup.id}&memberId=${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove member')
      }

      await fetchMembers()
      // TODO: Show success toast
    } catch (err) {
      console.error('Error removing member:', err)
      // TODO: Show error toast
    }
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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!currentStartup) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading team members...
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
            <Users className="w-5 h-5 mr-2" />
            Team Members
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
          <Users className="w-5 h-5 mr-2" />
          Team Members
        </CardTitle>
        <CardDescription>
          {members.length} {members.length === 1 ? 'member' : 'members'} in your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const roleInfo = roleConfig[member.role]
            const RoleIcon = roleInfo.icon
            const canManage = permissions.manageTeam && member.role !== 'owner'
            const canRemove = permissions.removeMembers && member.role !== 'owner'

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatarUrl} />
                    <AvatarFallback>
                      {getInitials(member.user.firstName, member.user.lastName, member.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {member.user.firstName && member.user.lastName
                          ? `${member.user.firstName} ${member.user.lastName}`
                          : member.user.email.split('@')[0]
                        }
                      </span>
                      {!member.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{member.user.email}</span>
                      <span>•</span>
                      <span>Joined {formatJoinDate(member.joinedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={roleInfo.color}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {roleInfo.label}
                  </Badge>

                  {(canManage || canRemove) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canManage && (
                          <>
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'viewer')}>
                              Change to Viewer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                              Change to Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                              Change to Admin
                            </DropdownMenuItem>
                            {userRole === 'owner' && member.role !== 'owner' && (
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'owner')}>
                                Change to Owner
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {canManage && canRemove && <DropdownMenuSeparator />}
                        {canRemove && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove Member
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
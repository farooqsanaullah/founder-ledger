'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, Shield, Activity } from 'lucide-react'
import { useStartup } from '@/hooks/use-startup'
import { usePermissions } from '@/hooks/use-permissions'
import { useState } from 'react'
import { InviteMemberDialog } from './invite-member-dialog'

const mockStats = {
  totalMembers: 4,
  activeMembers: 4,
  pendingInvitations: 2,
  recentActivity: 8,
}

export function TeamOverview() {
  const { currentStartup } = useStartup()
  const { permissions, isOwnerOrAdmin } = usePermissions()
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  if (!currentStartup) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Overview
            </CardTitle>
            <CardDescription>
              Manage your team members and their access
            </CardDescription>
          </div>
          {permissions.inviteMembers && (
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockStats.totalMembers}
              </div>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockStats.activeMembers}
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {mockStats.pendingInvitations}
              </div>
              <p className="text-sm text-muted-foreground">Pending Invites</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockStats.recentActivity}
              </div>
              <p className="text-sm text-muted-foreground">Recent Activity</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Quick Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              {permissions.inviteMembers && (
                <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
                  <UserPlus className="w-3 h-3 mr-1" />
                  Invite Member
                </Button>
              )}
              {permissions.manageTeam && (
                <Button variant="outline" size="sm">
                  <Shield className="w-3 h-3 mr-1" />
                  Manage Roles
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Activity className="w-3 h-3 mr-1" />
                View Activity
              </Button>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Role Distribution</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                1 Owner
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                1 Admin
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                2 Members
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                0 Viewers
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteMemberDialog 
        open={showInviteDialog} 
        onOpenChange={setShowInviteDialog}
      />
    </>
  )
}
import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { TeamOverview } from '@/components/team/team-overview'
import { TeamMembers } from '@/components/team/team-members'
import { TeamInvitations } from '@/components/team/team-invitations'
import { AuditLogs } from '@/components/team/audit-logs'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Team Management"
        description="Manage your team members, roles, and permissions"
      />
      
      <div className="flex-1 p-6 space-y-8 pb-12">
        {/* Team Overview */}
        <TeamOverview />

        {/* Team Members */}
        <TeamMembers />

        {/* Pending Invitations */}
        <TeamInvitations />

        {/* Activity Log */}
        <AuditLogs />
      </div>
    </div>
  )
}
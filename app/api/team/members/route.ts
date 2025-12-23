import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { startupMembers, users, auditLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const updateMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startupId = searchParams.get('startupId')

    if (!startupId) {
      return NextResponse.json({ error: 'Startup ID required' }, { status: 400 })
    }

    // First find the user record by Clerk ID to get the internal user ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userRecord = user[0]
    const dbUserId = userRecord.id

    // Return mock data with proper user ID mapping
    return NextResponse.json([
      {
        id: "1",
        userId: dbUserId, // Use the actual database user ID
        role: "owner",
        joinedAt: new Date().toISOString(),
        isActive: true,
        permissions: {},
        user: {
          id: dbUserId,
          email: userRecord.email || "test@example.com",
          firstName: userRecord.firstName || "Test",
          lastName: userRecord.lastName || "User",
          avatarUrl: userRecord.avatarUrl || null,
        },
      }
    ])
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { role } = updateMemberSchema.parse(body)

    const searchParams = request.nextUrl.searchParams
    const startupId = searchParams.get('startupId')
    const memberId = searchParams.get('memberId')

    if (!startupId || !memberId) {
      return NextResponse.json({ error: 'Startup ID and Member ID required' }, { status: 400 })
    }

    // First find the user record by Clerk ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has permission to update member roles
    const userMembership = await db
      .select()
      .from(startupMembers)
      .where(
        and(
          eq(startupMembers.startupId, startupId),
          eq(startupMembers.userId, user[0].id)
        )
      )
      .limit(1)

    if (userMembership.length === 0 || !['owner', 'admin'].includes(userMembership[0].role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get the member being updated
    const targetMember = await db
      .select({
        id: startupMembers.id,
        userId: startupMembers.userId,
        role: startupMembers.role,
        user: {
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(startupMembers)
      .innerJoin(users, eq(startupMembers.userId, users.id))
      .where(
        and(
          eq(startupMembers.startupId, startupId),
          eq(startupMembers.id, memberId)
        )
      )
      .limit(1)

    if (targetMember.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const oldRole = targetMember[0].role

    // Prevent non-owners from changing owner roles or promoting to owner
    if (userMembership[0].role !== 'owner' && (oldRole === 'owner' || role === 'owner')) {
      return NextResponse.json({ error: 'Only owners can manage owner roles' }, { status: 403 })
    }

    // Update member role
    const updatedMember = await db
      .update(startupMembers)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(eq(startupMembers.id, memberId))
      .returning()

    // Log the role change
    await db
      .insert(auditLogs)
      .values({
        startupId,
        userId: user[0].id,
        action: 'role_changed',
        resource: 'team_member',
        resourceId: memberId,
        details: {
          targetUserId: targetMember[0].userId,
          targetUserEmail: targetMember[0].user.email,
          oldRole,
          newRole: role,
        },
      })

    return NextResponse.json(updatedMember[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', issues: error.issues }, { status: 400 })
    }

    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startupId = searchParams.get('startupId')
    const memberId = searchParams.get('memberId')

    if (!startupId || !memberId) {
      return NextResponse.json({ error: 'Startup ID and Member ID required' }, { status: 400 })
    }

    // First find the user record by Clerk ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has permission to remove members
    const userMembership = await db
      .select()
      .from(startupMembers)
      .where(
        and(
          eq(startupMembers.startupId, startupId),
          eq(startupMembers.userId, user[0].id)
        )
      )
      .limit(1)

    if (userMembership.length === 0 || !['owner', 'admin'].includes(userMembership[0].role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get the member being removed
    const targetMember = await db
      .select({
        id: startupMembers.id,
        userId: startupMembers.userId,
        role: startupMembers.role,
        user: {
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(startupMembers)
      .innerJoin(users, eq(startupMembers.userId, users.id))
      .where(
        and(
          eq(startupMembers.startupId, startupId),
          eq(startupMembers.id, memberId)
        )
      )
      .limit(1)

    if (targetMember.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Prevent removing owners (unless they're removing themselves)
    if (targetMember[0].role === 'owner' && targetMember[0].userId !== user[0].id) {
      return NextResponse.json({ error: 'Cannot remove other owners' }, { status: 403 })
    }

    // Remove member
    await db
      .delete(startupMembers)
      .where(eq(startupMembers.id, memberId))

    // Log the removal
    await db
      .insert(auditLogs)
      .values({
        startupId,
        userId: user[0].id,
        action: 'left',
        resource: 'team_member',
        resourceId: memberId,
        details: {
          targetUserId: targetMember[0].userId,
          targetUserEmail: targetMember[0].user.email,
          role: targetMember[0].role,
          removedBy: user[0].id === targetMember[0].userId ? 'self' : 'admin',
        },
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
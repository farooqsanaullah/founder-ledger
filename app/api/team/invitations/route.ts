import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { teamInvitations, startupMembers, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { randomBytes } from 'crypto'

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']).default('member'),
  startupId: z.string().uuid(),
})

const updateInvitationSchema = z.object({
  status: z.enum(['accepted', 'declined']),
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

    // Check if user has permission to view invitations
    const membership = await db
      .select()
      .from(startupMembers)
      .where(
        and(
          eq(startupMembers.startupId, startupId),
          eq(startupMembers.userId, userId)
        )
      )
      .limit(1)

    if (membership.length === 0 || !['owner', 'admin'].includes(membership[0].role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const invitations = await db
      .select({
        id: teamInvitations.id,
        email: teamInvitations.email,
        role: teamInvitations.role,
        status: teamInvitations.status,
        expiresAt: teamInvitations.expiresAt,
        createdAt: teamInvitations.createdAt,
        inviterName: users.firstName,
        inviterEmail: users.email,
      })
      .from(teamInvitations)
      .leftJoin(users, eq(teamInvitations.invitedBy, users.id))
      .where(eq(teamInvitations.startupId, startupId))

    return NextResponse.json(invitations)
  } catch (error) {
    console.error('Error fetching team invitations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, role, startupId } = inviteSchema.parse(body)

    // Check if user has permission to invite
    const membership = await db
      .select()
      .from(startupMembers)
      .where(
        and(
          eq(startupMembers.startupId, startupId),
          eq(startupMembers.userId, userId)
        )
      )
      .limit(1)

    if (membership.length === 0 || !['owner', 'admin'].includes(membership[0].role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check if email is already a member
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      const existingMember = await db
        .select()
        .from(startupMembers)
        .where(
          and(
            eq(startupMembers.startupId, startupId),
            eq(startupMembers.userId, existingUser[0].id)
          )
        )
        .limit(1)

      if (existingMember.length > 0) {
        return NextResponse.json({ error: 'User is already a team member' }, { status: 409 })
      }
    }

    // Check if there's already a pending invitation
    const existingInvitation = await db
      .select()
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations.startupId, startupId),
          eq(teamInvitations.email, email),
          eq(teamInvitations.status, 'pending')
        )
      )
      .limit(1)

    if (existingInvitation.length > 0) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 409 })
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    // Create invitation
    const invitation = await db
      .insert(teamInvitations)
      .values({
        email,
        role,
        startupId,
        token,
        invitedBy: userId,
        expiresAt,
      })
      .returning()

    // TODO: Send invitation email
    // This would typically integrate with an email service like SendGrid, Resend, etc.

    return NextResponse.json(invitation[0], { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', issues: error.issues }, { status: 400 })
    }

    console.error('Error creating team invitation:', error)
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
    const { status } = updateInvitationSchema.parse(body)

    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    // Find invitation by token
    const invitation = await db
      .select()
      .from(teamInvitations)
      .where(eq(teamInvitations.token, token))
      .limit(1)

    if (invitation.length === 0) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 })
    }

    const inv = invitation[0]

    // Check if invitation is still valid
    if (inv.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation is no longer pending' }, { status: 400 })
    }

    if (new Date() > inv.expiresAt) {
      await db
        .update(teamInvitations)
        .set({ status: 'expired' })
        .where(eq(teamInvitations.id, inv.id))
      
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 })
    }

    // Update invitation status
    const updatedInvitation = await db
      .update(teamInvitations)
      .set({ 
        status,
        acceptedAt: status === 'accepted' ? new Date() : null
      })
      .where(eq(teamInvitations.id, inv.id))
      .returning()

    // If accepted, add user to startup members
    if (status === 'accepted') {
      // Get or create user record
      let user = await db
        .select()
        .from(users)
        .where(eq(users.email, inv.email))
        .limit(1)

      if (user.length === 0) {
        // Create a placeholder user record (will be updated when user signs up)
        user = await db
          .insert(users)
          .values({
            email: inv.email,
            clerkId: '', // Will be updated when user signs up through Clerk
          })
          .returning()
      }

      // Add to startup members
      await db
        .insert(startupMembers)
        .values({
          startupId: inv.startupId,
          userId: user[0].id,
          role: inv.role,
          joinedAt: new Date(),
        })
    }

    return NextResponse.json(updatedInvitation[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', issues: error.issues }, { status: 400 })
    }

    console.error('Error updating team invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { auditLogs, startupMembers, users } from '@/lib/db/schema'
import { eq, and, desc, gte, lte } from 'drizzle-orm'

const createAuditLogSchema = z.object({
  startupId: z.string().uuid(),
  action: z.enum(['created', 'updated', 'deleted', 'invited', 'joined', 'left', 'role_changed', 'login', 'logout', 'export']),
  resource: z.string().min(1).max(100),
  resourceId: z.string().uuid().optional(),
  details: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().max(45).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const startupId = searchParams.get('startupId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const action = searchParams.get('action')
    const resource = searchParams.get('resource')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    if (!startupId) {
      return NextResponse.json({ error: 'Startup ID required' }, { status: 400 })
    }

    // Check if user is a member of this startup
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

    if (membership.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build query conditions
    const conditions = [eq(auditLogs.startupId, startupId)]

    if (action) {
      conditions.push(eq(auditLogs.action, action as any))
    }

    if (resource) {
      conditions.push(eq(auditLogs.resource, resource))
    }

    if (fromDate) {
      conditions.push(gte(auditLogs.createdAt, new Date(fromDate)))
    }

    if (toDate) {
      conditions.push(lte(auditLogs.createdAt, new Date(toDate)))
    }

    // Fetch audit logs with user information
    const logs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        resource: auditLogs.resource,
        resourceId: auditLogs.resourceId,
        details: auditLogs.details,
        userEmail: auditLogs.userEmail,
        userAgent: auditLogs.userAgent,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: auditLogs.id })
      .from(auditLogs)
      .where(and(...conditions))

    return NextResponse.json({
      logs,
      total: totalCount.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
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
    const { startupId, action, resource, resourceId, details, userAgent, ipAddress } = createAuditLogSchema.parse(body)

    // Check if user is a member of this startup
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

    if (membership.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get user email for the log
    const user = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    // Create audit log entry
    const auditLog = await db
      .insert(auditLogs)
      .values({
        startupId,
        userId,
        action,
        resource,
        resourceId,
        details,
        userEmail: user[0]?.email || null,
        userAgent,
        ipAddress,
      })
      .returning()

    return NextResponse.json(auditLog[0], { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', issues: error.issues }, { status: 400 })
    }

    console.error('Error creating audit log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, startupMembers, startups } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's startups
    const userStartups = await db
      .select({
        id: startups.id,
        name: startups.name,
        slug: startups.slug,
        defaultCurrency: startups.defaultCurrency,
        role: startupMembers.role,
      })
      .from(startupMembers)
      .innerJoin(startups, eq(startupMembers.startupId, startups.id))
      .where(eq(startupMembers.userId, user.id))

    return NextResponse.json({ 
      startups: userStartups.map(startup => ({
        id: startup.id,
        name: startup.name,
        slug: startup.slug,
        defaultCurrency: startup.defaultCurrency,
        role: startup.role,
      }))
    })
  } catch (error) {
    console.error('Error fetching user startups:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
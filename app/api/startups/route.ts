import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { startups, startupMembers, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { seedStartupCategories } from '@/lib/db/seed-startup'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, industry, foundedDate, defaultCurrency } = body

    if (!name) {
      return NextResponse.json({ error: 'Startup name is required' }, { status: 400 })
    }

    // Generate a slug from the startup name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Create the startup
    const [startup] = await db.insert(startups).values({
      name,
      slug,
      description: null,
      industry: industry || null,
      foundedDate: foundedDate || null,
      defaultCurrency: defaultCurrency || 'USD',
    }).returning()

    // Add the user as owner of the startup
    await db.insert(startupMembers).values({
      startupId: startup.id,
      userId: user.id,
      role: 'owner',
      canApproveExpenses: true,
      canManageMembers: true,
      canViewFinancials: true,
      canExportData: true,
    })

    // Seed default categories for the startup
    await seedStartupCategories(startup.id)

    return NextResponse.json({ 
      startup: {
        id: startup.id,
        name: startup.name,
        slug: startup.slug,
        defaultCurrency: startup.defaultCurrency,
      }
    })
  } catch (error) {
    console.error('Error creating startup:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { budgets, budgetCategories, users, startups, categories } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  description: z.string().optional(),
  budgetType: z.enum(['monthly', 'quarterly', 'yearly', 'project']),
  totalAmount: z.string().min(1, 'Total amount is required'),
  currency: z.string().default('USD'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  alertThreshold: z.string().default('80'),
  alertEmails: z.array(z.string().email()).optional(),
  categoryAllocations: z.array(z.object({
    categoryId: z.string().uuid(),
    allocatedAmount: z.string().min(1, 'Allocated amount is required'),
    description: z.string().optional(),
  })).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get current startup from query params
    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get('startupId')

    if (!startupId) {
      return NextResponse.json({ error: 'Startup ID is required' }, { status: 400 })
    }

    // Verify user has access to this startup
    const startup = await db.query.startups.findFirst({
      where: eq(startups.id, startupId),
      with: {
        members: {
          where: eq(users.id, user.id)
        }
      }
    })

    if (!startup || startup.members.length === 0) {
      return NextResponse.json({ error: 'Access denied to this startup' }, { status: 403 })
    }

    // Get budgets for this startup with category allocations
    const startupBudgets = await db.query.budgets.findMany({
      where: eq(budgets.startupId, startupId),
      with: {
        budgetCategories: {
          with: {
            category: true
          }
        },
        createdBy: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: [desc(budgets.createdAt)]
    })

    return NextResponse.json({ budgets: startupBudgets })

  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get current startup from query params
    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get('startupId')

    if (!startupId) {
      return NextResponse.json({ error: 'Startup ID is required' }, { status: 400 })
    }

    // Verify user has access to this startup
    const startup = await db.query.startups.findFirst({
      where: eq(startups.id, startupId),
      with: {
        members: {
          where: eq(users.id, user.id)
        }
      }
    })

    if (!startup || startup.members.length === 0) {
      return NextResponse.json({ error: 'Access denied to this startup' }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = createBudgetSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const data = validation.data

    // Validate that category allocations don't exceed total budget
    if (data.categoryAllocations && data.categoryAllocations.length > 0) {
      const totalAllocated = data.categoryAllocations.reduce(
        (sum, allocation) => sum + parseFloat(allocation.allocatedAmount),
        0
      )
      const totalBudget = parseFloat(data.totalAmount)

      if (totalAllocated > totalBudget) {
        return NextResponse.json(
          { error: 'Category allocations exceed total budget amount' },
          { status: 400 }
        )
      }
    }

    // Create budget
    const [newBudget] = await db.insert(budgets).values({
      startupId,
      name: data.name,
      description: data.description,
      budgetType: data.budgetType,
      totalAmount: data.totalAmount,
      currency: data.currency,
      startDate: data.startDate,
      endDate: data.endDate,
      alertThreshold: data.alertThreshold,
      alertEmails: data.alertEmails || [],
      createdById: user.id,
    }).returning()

    // Create category allocations if provided
    if (data.categoryAllocations && data.categoryAllocations.length > 0) {
      await db.insert(budgetCategories).values(
        data.categoryAllocations.map(allocation => ({
          budgetId: newBudget.id,
          categoryId: allocation.categoryId,
          allocatedAmount: allocation.allocatedAmount,
          description: allocation.description,
        }))
      )
    }

    // Fetch the complete budget with relations
    const completeBudget = await db.query.budgets.findFirst({
      where: eq(budgets.id, newBudget.id),
      with: {
        budgetCategories: {
          with: {
            category: true
          }
        },
        createdBy: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({ budget: completeBudget }, { status: 201 })

  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
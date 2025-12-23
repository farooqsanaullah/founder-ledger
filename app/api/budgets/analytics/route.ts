import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { budgets, budgetCategories, expenses, users, startups } from '@/lib/db/schema'
import { eq, and, gte, lte, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

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

    // Get current startup and budget from query params
    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get('startupId')
    const budgetId = searchParams.get('budgetId')

    if (!startupId) {
      return NextResponse.json({ error: 'Startup ID is required' }, { status: 400 })
    }

    if (!budgetId) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 })
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

    // Get budget details
    const budget = await db.query.budgets.findFirst({
      where: and(
        eq(budgets.id, budgetId),
        eq(budgets.startupId, startupId)
      ),
      with: {
        budgetCategories: {
          with: {
            category: true
          }
        }
      }
    })

    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
    }

    // Calculate actual spending during budget period
    const actualSpending = await db
      .select({
        categoryId: expenses.categoryId,
        categoryName: sql<string>`COALESCE(categories.name, 'Uncategorized')`,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.paidById, user.id),
          gte(expenses.expenseDate, budget.startDate),
          lte(expenses.expenseDate, budget.endDate),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )
      .groupBy(expenses.categoryId, sql`categories.name`)

    // Calculate total spending
    const totalSpent = actualSpending.reduce((sum, item) => sum + Number(item.total), 0)
    const totalBudget = Number(budget.totalAmount)
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    // Create budget vs actual comparison by category
    const categoryComparison = budget.budgetCategories.map(budgetCat => {
      const actualCat = actualSpending.find(actual => 
        actual.categoryId === budgetCat.categoryId
      )
      
      const allocated = Number(budgetCat.allocatedAmount)
      const spent = actualCat ? Number(actualCat.total) : 0
      const remaining = allocated - spent
      const percentUsed = allocated > 0 ? (spent / allocated) * 100 : 0

      return {
        categoryId: budgetCat.categoryId,
        categoryName: budgetCat.category?.name || 'Uncategorized',
        allocated,
        spent,
        remaining,
        percentUsed,
        isOverBudget: spent > allocated,
        expenseCount: actualCat ? Number(actualCat.count) : 0,
      }
    })

    // Calculate spending trends over the budget period
    const spendingTrends = await db
      .select({
        date: expenses.expenseDate,
        amount: sql<number>`CAST(${expenses.amount} AS DECIMAL)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          gte(expenses.expenseDate, budget.startDate),
          lte(expenses.expenseDate, budget.endDate),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )
      .orderBy(expenses.expenseDate)

    // Calculate alert status
    const alertThreshold = Number(budget.alertThreshold)
    const shouldAlert = spentPercentage >= alertThreshold

    // Calculate projected spending (if budget is ongoing)
    const now = new Date()
    const budgetStart = new Date(budget.startDate)
    const budgetEnd = new Date(budget.endDate)
    const totalDays = Math.ceil((budgetEnd.getTime() - budgetStart.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((now.getTime() - budgetStart.getTime()) / (1000 * 60 * 60 * 24))
    const progressPercentage = Math.min((daysPassed / totalDays) * 100, 100)
    
    const projectedTotal = daysPassed > 0 && now <= budgetEnd 
      ? (totalSpent / daysPassed) * totalDays 
      : totalSpent

    const analytics = {
      budget: {
        id: budget.id,
        name: budget.name,
        totalAmount: totalBudget,
        startDate: budget.startDate,
        endDate: budget.endDate,
        status: budget.status,
        alertThreshold,
      },
      summary: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        spentPercentage: Math.round(spentPercentage * 100) / 100,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        projectedTotal: Math.round(projectedTotal * 100) / 100,
        isOverBudget: totalSpent > totalBudget,
        shouldAlert,
        daysRemaining: Math.max(0, Math.ceil((budgetEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))),
      },
      categoryBreakdown: categoryComparison,
      spendingTrends: spendingTrends.map(trend => ({
        date: trend.date,
        amount: Number(trend.amount),
      })),
    }

    return NextResponse.json({ analytics })

  } catch (error) {
    console.error('Error fetching budget analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
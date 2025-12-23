import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { expenses, investments, users } from '@/lib/db/schema'
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

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
      return NextResponse.json({ 
        error: 'User not found',
        metrics: {
          totalBalance: 0,
          monthlyBurn: 0,
          runwayMonths: 0,
          pendingExpenses: 0,
          totalRaised: 0,
          totalExpenses: 0
        }
      })
    }

    // Calculate date ranges
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get total investments (money raised)
    const investmentResults = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${investments.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(investments)
      .where(eq(investments.createdById, user.id))

    const totalRaised = Number(investmentResults[0]?.total || 0)
    const investmentCount = Number(investmentResults[0]?.count || 0)

    // Get total approved/reimbursed expenses (money spent)
    const expenseResults = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )

    const totalExpenses = Number(expenseResults[0]?.total || 0)

    // Get current month expenses for burn rate
    const currentMonthResults = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          gte(expenses.expenseDate, firstDayThisMonth.toISOString().split('T')[0]),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )

    const currentMonthBurn = Number(currentMonthResults[0]?.total || 0)

    // Get last month expenses for comparison
    const lastMonthResults = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          gte(expenses.expenseDate, firstDayLastMonth.toISOString().split('T')[0]),
          lte(expenses.expenseDate, lastDayLastMonth.toISOString().split('T')[0]),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )

    const lastMonthBurn = Number(lastMonthResults[0]?.total || 0)

    // Get pending expenses count
    const pendingResults = await db
      .select({
        count: sql<number>`COUNT(*)`,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          eq(expenses.status, 'pending')
        )
      )

    const pendingCount = Number(pendingResults[0]?.count || 0)
    const pendingTotal = Number(pendingResults[0]?.total || 0)

    // Calculate metrics
    const totalBalance = totalRaised - totalExpenses
    const monthlyBurn = currentMonthBurn
    const runwayMonths = monthlyBurn > 0 ? Math.floor(totalBalance / monthlyBurn) : 0

    // Calculate burn rate change percentage
    const burnRateChange = lastMonthBurn > 0 
      ? ((currentMonthBurn - lastMonthBurn) / lastMonthBurn) * 100 
      : 0

    // Get recent expenses for trends
    const recentExpenses = await db
      .select({
        date: expenses.expenseDate,
        amount: sql<number>`CAST(${expenses.amount} AS DECIMAL)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          sql`${expenses.status} IN ('approved', 'reimbursed')`,
          gte(expenses.expenseDate, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        )
      )
      .orderBy(expenses.expenseDate)

    // Get expense breakdown by status
    const expenseStatusBreakdown = await db
      .select({
        status: expenses.status,
        count: sql<number>`COUNT(*)`,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
      })
      .from(expenses)
      .where(eq(expenses.paidById, user.id))
      .groupBy(expenses.status)

    // Get monthly expense trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyTrends = await db
      .select({
        month: sql<string>`TO_CHAR(${expenses.expenseDate}::date, 'YYYY-MM')`,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          gte(expenses.expenseDate, sixMonthsAgo.toISOString().split('T')[0]),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )
      .groupBy(sql`TO_CHAR(${expenses.expenseDate}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${expenses.expenseDate}::date, 'YYYY-MM')`)

    // Get expense breakdown by category
    const categoryBreakdown = await db
      .select({
        category: expenses.category,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
        avgAmount: sql<number>`COALESCE(AVG(CAST(${expenses.amount} AS DECIMAL)), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )
      .groupBy(expenses.category)
      .orderBy(sql<number>`SUM(CAST(${expenses.amount} AS DECIMAL)) DESC`)

    return NextResponse.json({
      metrics: {
        totalBalance,
        monthlyBurn,
        runwayMonths,
        pendingExpenses: pendingCount,
        pendingTotal,
        totalRaised,
        totalExpenses,
        investmentCount,
        burnRateChange,
      },
      trends: {
        dailyExpenses: recentExpenses,
        expensesByStatus: expenseStatusBreakdown,
        monthlyTrends,
        categoryBreakdown,
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        metrics: {
          totalBalance: 0,
          monthlyBurn: 0,
          runwayMonths: 0,
          pendingExpenses: 0,
          totalRaised: 0,
          totalExpenses: 0
        }
      }, 
      { status: 500 }
    )
  }
}
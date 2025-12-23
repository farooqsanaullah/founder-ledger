import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { expenses, investments, budgets, users, startups, categories } from '@/lib/db/schema'
import { eq, and, gte, lte, sql, desc, asc } from 'drizzle-orm'

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get('startupId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const reportType = searchParams.get('type') || 'all'

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

    // Build date filters
    const dateConditions = []
    if (startDate) {
      dateConditions.push(gte(expenses.expenseDate, startDate))
    }
    if (endDate) {
      dateConditions.push(lte(expenses.expenseDate, endDate))
    }

    // Get expense summary
    const expenseSummary = await db
      .select({
        totalAmount: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
        avgAmount: sql<number>`COALESCE(AVG(CAST(${expenses.amount} AS DECIMAL)), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          ...dateConditions,
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )

    // Get expenses by category
    const expensesByCategory = await db
      .select({
        categoryId: expenses.categoryId,
        categoryName: sql<string>`COALESCE(categories.name, 'Uncategorized')`,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
        percentage: sql<number>`
          CASE 
            WHEN SUM(SUM(CAST(${expenses.amount} AS DECIMAL))) OVER() > 0 
            THEN (SUM(CAST(${expenses.amount} AS DECIMAL)) * 100.0 / SUM(SUM(CAST(${expenses.amount} AS DECIMAL))) OVER())
            ELSE 0 
          END
        `,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.paidById, user.id),
          ...dateConditions,
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )
      .groupBy(expenses.categoryId, sql`categories.name`)
      .orderBy(desc(sql<number>`SUM(CAST(${expenses.amount} AS DECIMAL))`))

    // Get expenses by status
    const expensesByStatus = await db
      .select({
        status: expenses.status,
        total: sql<number>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.paidById, user.id),
          ...dateConditions
        )
      )
      .groupBy(expenses.status)

    // Get monthly expense trends
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
          ...dateConditions,
          sql`${expenses.status} IN ('approved', 'reimbursed')`
        )
      )
      .groupBy(sql`TO_CHAR(${expenses.expenseDate}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${expenses.expenseDate}::date, 'YYYY-MM')`)

    // Get investment summary
    const investmentSummary = await db
      .select({
        totalAmount: sql<number>`COALESCE(SUM(CAST(${investments.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
        avgAmount: sql<number>`COALESCE(AVG(CAST(${investments.amount} AS DECIMAL)), 0)`,
      })
      .from(investments)
      .where(eq(investments.createdById, user.id))

    // Get investments by type
    const investmentsByType = await db
      .select({
        type: investments.type,
        total: sql<number>`COALESCE(SUM(CAST(${investments.amount} AS DECIMAL)), 0)`,
        count: sql<number>`COUNT(*)`,
        percentage: sql<number>`
          CASE 
            WHEN SUM(SUM(CAST(${investments.amount} AS DECIMAL))) OVER() > 0 
            THEN (SUM(CAST(${investments.amount} AS DECIMAL)) * 100.0 / SUM(SUM(CAST(${investments.amount} AS DECIMAL))) OVER())
            ELSE 0 
          END
        `,
      })
      .from(investments)
      .where(eq(investments.createdById, user.id))
      .groupBy(investments.type)
      .orderBy(desc(sql<number>`SUM(CAST(${investments.amount} AS DECIMAL))`))

    // Get recent transactions
    const recentExpenses = await db
      .select({
        id: expenses.id,
        title: expenses.title,
        amount: expenses.amount,
        currency: expenses.currency,
        status: expenses.status,
        date: expenses.expenseDate,
        category: sql<string>`COALESCE(categories.name, 'Uncategorized')`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.paidById, user.id),
          ...dateConditions
        )
      )
      .orderBy(desc(expenses.expenseDate))
      .limit(10)

    const recentInvestments = await db
      .select({
        id: investments.id,
        roundName: investments.roundName,
        investorName: investments.investorName,
        amount: investments.amount,
        currency: investments.currency,
        date: investments.investmentDate,
        type: investments.type,
      })
      .from(investments)
      .where(eq(investments.createdById, user.id))
      .orderBy(desc(investments.investmentDate))
      .limit(10)

    // Calculate financial ratios
    const totalExpenses = Number(expenseSummary[0]?.totalAmount || 0)
    const totalInvestments = Number(investmentSummary[0]?.totalAmount || 0)
    const burnRate = totalExpenses // Simplified - could be calculated over time period
    const runway = totalInvestments > 0 && burnRate > 0 ? totalInvestments / burnRate : 0

    const report = {
      summary: {
        totalExpenses,
        totalInvestments,
        netPosition: totalInvestments - totalExpenses,
        expenseCount: Number(expenseSummary[0]?.count || 0),
        investmentCount: Number(investmentSummary[0]?.count || 0),
        avgExpenseAmount: Number(expenseSummary[0]?.avgAmount || 0),
        avgInvestmentAmount: Number(investmentSummary[0]?.avgAmount || 0),
        burnRate,
        runway,
      },
      expenses: {
        summary: expenseSummary[0],
        byCategory: expensesByCategory,
        byStatus: expensesByStatus,
        monthlyTrends,
        recent: recentExpenses,
      },
      investments: {
        summary: investmentSummary[0],
        byType: investmentsByType,
        recent: recentInvestments,
      },
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'All time',
        generatedAt: new Date().toISOString(),
      }
    }

    return NextResponse.json({ report })

  } catch (error) {
    console.error('Error generating reports:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
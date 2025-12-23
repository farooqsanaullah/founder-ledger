import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { expenses, users, categories } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

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
    const {
      title,
      amount,
      description,
      expenseDate,
      categoryId,
      vendorName,
      invoiceNumber,
      isTaxDeductible,
      startupId
    } = body

    if (!title || !amount || !expenseDate) {
      return NextResponse.json({ 
        error: 'Title, amount, and date are required' 
      }, { status: 400 })
    }

    // For now, we'll use a temporary startup ID since we haven't implemented startup context yet
    const tempStartupId = '00000000-0000-0000-0000-000000000001'

    // Create the expense
    const [expense] = await db.insert(expenses).values({
      startupId: tempStartupId,
      title,
      description: description || null,
      amount: amount.toString(),
      currency: 'USD',
      expenseDate: expenseDate, // Keep as string, will be converted by Drizzle
      categoryId: categoryId || null,
      paidById: user.id,
      createdById: user.id,
      status: 'draft',
      vendorName: vendorName || null,
      invoiceNumber: invoiceNumber || null,
      isTaxDeductible: isTaxDeductible || false,
    }).returning()

    return NextResponse.json({ 
      expense: {
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        status: expense.status,
        expenseDate: expense.expenseDate,
      }
    })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

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

    // Get user's expenses
    const userExpenses = await db
      .select({
        id: expenses.id,
        title: expenses.title,
        amount: expenses.amount,
        currency: expenses.currency,
        expenseDate: expenses.expenseDate,
        status: expenses.status,
        vendorName: expenses.vendorName,
        description: expenses.description,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .where(eq(expenses.paidById, user.id))
      .orderBy(desc(expenses.createdAt))

    return NextResponse.json({ 
      expenses: userExpenses
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
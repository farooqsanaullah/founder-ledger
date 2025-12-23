import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { investments, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user from database, create if doesn't exist
    let user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    if (!user) {
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        email: 'temp@example.com',
        firstName: null,
        lastName: null,
        avatarUrl: null,
        phone: null,
      }).returning()
      user = newUser
    }

    const body = await request.json()
    const {
      roundName,
      investorName,
      type,
      amount,
      currency,
      equityPercentage,
      premoneyValuation,
      postmoneyValuation,
      investmentDate,
      boardSeat,
      leadInvestor,
      preferenceMultiple,
      participationRights,
      antiDilutionRights,
      notes
    } = body

    if (!roundName || !investorName || !type || !amount || !investmentDate) {
      return NextResponse.json({ 
        error: 'Round name, investor name, type, amount, and investment date are required' 
      }, { status: 400 })
    }

    // For now, use a temporary startup ID (same as expenses)
    const tempStartupId = '00000000-0000-0000-0000-000000000001'

    // Create the investment
    const [investment] = await db.insert(investments).values({
      startupId: tempStartupId,
      roundName,
      investorName,
      type,
      amount: amount.toString(),
      currency: currency || 'USD',
      equityPercentage: equityPercentage ? equityPercentage.toString() : null,
      premoneyValuation: premoneyValuation ? premoneyValuation.toString() : null,
      postmoneyValuation: postmoneyValuation ? postmoneyValuation.toString() : null,
      investmentDate: investmentDate,
      boardSeat: boardSeat || false,
      leadInvestor: leadInvestor || false,
      preferenceMultiple: preferenceMultiple ? preferenceMultiple.toString() : '1.0',
      participationRights: participationRights || false,
      antiDilutionRights: antiDilutionRights || 'weighted_average',
      notes: notes || null,
      createdById: user.id,
    }).returning()

    return NextResponse.json({ 
      investment: {
        id: investment.id,
        roundName: investment.roundName,
        investorName: investment.investorName,
        amount: investment.amount,
        type: investment.type,
        investmentDate: investment.investmentDate,
      }
    })
  } catch (error) {
    console.error('Error creating investment:', error)
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
      return NextResponse.json({ investments: [] })
    }

    // Get investments (for now, filter by created user since we don't have startup context)
    const userInvestments = await db
      .select({
        id: investments.id,
        roundName: investments.roundName,
        investorName: investments.investorName,
        type: investments.type,
        amount: investments.amount,
        currency: investments.currency,
        equityPercentage: investments.equityPercentage,
        premoneyValuation: investments.premoneyValuation,
        postmoneyValuation: investments.postmoneyValuation,
        investmentDate: investments.investmentDate,
        boardSeat: investments.boardSeat,
        leadInvestor: investments.leadInvestor,
        notes: investments.notes,
        createdAt: investments.createdAt,
      })
      .from(investments)
      .where(eq(investments.createdById, user.id))
      .orderBy(desc(investments.createdAt))

    return NextResponse.json({ 
      investments: userInvestments
    })
  } catch (error) {
    console.error('Error fetching investments:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
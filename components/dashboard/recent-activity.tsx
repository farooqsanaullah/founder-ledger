'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Receipt, 
  TrendingUp, 
  Plus, 
  Calendar,
  Building2,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

interface RecentExpense {
  id: string
  title: string
  amount: string
  currency: string
  status: string
  expenseDate: string
}

interface RecentInvestment {
  id: string
  roundName: string
  investorName: string
  amount: string
  currency: string
  investmentDate: string
}

export function RecentActivity() {
  const [expenses, setExpenses] = useState<RecentExpense[]>([])
  const [investments, setInvestments] = useState<RecentInvestment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent expenses
      const expensesResponse = await fetch('/api/expenses')
      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json()
        setExpenses(expensesData.expenses?.slice(0, 5) || [])
      }

      // Fetch recent investments
      const investmentsResponse = await fetch('/api/investments')
      if (investmentsResponse.ok) {
        const investmentsData = await investmentsResponse.json()
        setInvestments(investmentsData.investments?.slice(0, 3) || [])
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'reimbursed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Recent Expenses */}
      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Recent Expenses
            </CardTitle>
            <CardDescription>
              Your latest expense submissions
            </CardDescription>
          </div>
          <Link href="/expenses/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Expense
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No expenses yet</p>
              <Link href="/expenses/new">
                <Button>Add your first expense</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">{expense.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(expense.expenseDate)}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(expense.status)}`}
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(expense.amount, expense.currency)}
                    </p>
                  </div>
                </div>
              ))}
              {expenses.length > 0 && (
                <div className="pt-3">
                  <Link href="/expenses">
                    <Button variant="outline" className="w-full">
                      View all expenses
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Investments */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recent Investments
          </CardTitle>
          <CardDescription>
            Latest funding activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : investments.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">No investments yet</p>
                <Link href="/investments/new">
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Investment
                  </Button>
                </Link>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <Link href="/expenses/new">
                    <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h5 className="font-medium">Add First Expense</h5>
                      <p className="text-sm text-muted-foreground">
                        Track your startup expenses
                      </p>
                    </div>
                  </Link>
                  
                  <Link href="/investments/new">
                    <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h5 className="font-medium">Record Investment</h5>
                      <p className="text-sm text-muted-foreground">
                        Add funding rounds
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {investments.map((investment) => (
                <div key={investment.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{investment.roundName}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(investment.amount, investment.currency)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{investment.investorName}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(investment.investmentDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/investments">
                <Button variant="outline" className="w-full mt-3">
                  View all investments
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
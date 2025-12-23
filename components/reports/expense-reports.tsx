'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Receipt, Download, Filter, Calendar } from 'lucide-react'
import { ExportDropdown } from './export-dropdown'

const mockExpenses = [
  {
    id: '1',
    title: 'Office Supplies - Q1',
    category: 'Office Supplies',
    amount: 1250,
    status: 'approved',
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Software License - Figma',
    category: 'Software',
    amount: 720,
    status: 'reimbursed',
    date: '2024-03-10',
  },
  {
    id: '3',
    title: 'Client Dinner - Restaurant',
    category: 'Meals',
    amount: 185,
    status: 'approved',
    date: '2024-03-08',
  },
]

export function ExpenseReports() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'reimbursed':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = {
    title: 'Expense Report',
    data: mockExpenses,
    columns: ['title', 'category', 'amount', 'date', 'status'],
    summary: [
      { label: 'Total Expenses', value: mockExpenses.reduce((sum, exp) => sum + exp.amount, 0) },
      { label: 'Number of Expenses', value: mockExpenses.length },
    ]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Expense Reports
          </CardTitle>
          <CardDescription>
            Detailed expense analysis and breakdowns
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <ExportDropdown data={exportData} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium">{expense.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(expense.date)}</span>
                    <span>•</span>
                    <span>{expense.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(expense.status)}>
                  {expense.status}
                </Badge>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Expenses: {mockExpenses.length} items
            </span>
            <span className="font-semibold">
              {formatCurrency(mockExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
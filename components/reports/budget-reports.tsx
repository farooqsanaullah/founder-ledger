'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, Download, AlertTriangle, Calendar } from 'lucide-react'
import { ExportDropdown } from './export-dropdown'

const mockBudgets = [
  {
    id: '1',
    name: 'Q1 2024 Operations',
    totalAmount: 15000,
    spent: 9500,
    category: 'Operations',
    status: 'active',
    endDate: '2024-03-31',
  },
  {
    id: '2',
    name: 'Marketing Campaign',
    totalAmount: 25000,
    spent: 22500,
    category: 'Marketing',
    status: 'active',
    endDate: '2024-04-30',
  },
  {
    id: '3',
    name: 'Software Licenses',
    totalAmount: 8000,
    spent: 3200,
    category: 'Software',
    status: 'active',
    endDate: '2024-12-31',
  },
]

export function BudgetReports() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalBudget = mockBudgets.reduce((sum, budget) => sum + budget.totalAmount, 0)
  const totalSpent = mockBudgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overallUtilization = (totalSpent / totalBudget) * 100

  const exportData = {
    title: 'Budget vs Actual Report',
    data: mockBudgets.map(budget => ({
      name: budget.name,
      category: budget.category,
      totalAmount: budget.totalAmount,
      spent: budget.spent,
      remaining: budget.totalAmount - budget.spent,
      utilization: `${Math.round((budget.spent / budget.totalAmount) * 100)}%`,
      endDate: budget.endDate
    })),
    columns: ['name', 'category', 'totalAmount', 'spent', 'remaining', 'utilization', 'endDate'],
    summary: [
      { label: 'Total Budget', value: totalBudget },
      { label: 'Total Spent', value: totalSpent },
      { label: 'Overall Utilization', value: `${Math.round(overallUtilization)}%` },
    ]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Budget vs Actual Reports
          </CardTitle>
          <CardDescription>
            Budget performance and utilization analysis
          </CardDescription>
        </div>
        <ExportDropdown data={exportData} />
      </CardHeader>
      <CardContent>
        {/* Overall Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalBudget)}
            </div>
            <p className="text-sm text-muted-foreground">Total Budget</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getUtilizationColor(overallUtilization)}`}>
              {Math.round(overallUtilization)}%
            </div>
            <p className="text-sm text-muted-foreground">Utilization</p>
          </div>
        </div>

        {/* Budget Details */}
        <div className="space-y-6">
          {mockBudgets.map((budget) => {
            const utilization = (budget.spent / budget.totalAmount) * 100
            const remaining = budget.totalAmount - budget.spent
            const isOverBudget = budget.spent > budget.totalAmount
            
            return (
              <div key={budget.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{budget.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{budget.category}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>Ends {formatDate(budget.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(budget.status)}>
                      {budget.status}
                    </Badge>
                    {utilization >= 90 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">{formatCurrency(budget.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spent</p>
                    <p className="font-medium">{formatCurrency(budget.spent)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={`font-medium ${getUtilizationColor(utilization)}`}>
                      {Math.round(utilization)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className={getUtilizationColor(utilization)}>
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.totalAmount)}
                    </span>
                  </div>
                  <Progress value={Math.min(utilization, 100)} className="w-full" />
                </div>

                {utilization >= 90 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800 font-medium">
                        Budget Alert
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                      This budget has {isOverBudget ? 'exceeded' : 'reached'} 90% utilization
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
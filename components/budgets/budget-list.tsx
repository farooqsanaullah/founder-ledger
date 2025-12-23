'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Target
} from 'lucide-react'
import { useStartup } from '@/hooks/use-startup'
import Link from 'next/link'

interface Budget {
  id: string
  name: string
  description?: string
  budgetType: 'monthly' | 'quarterly' | 'yearly' | 'project'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  totalAmount: string
  currency: string
  startDate: string
  endDate: string
  alertThreshold: string
  spent?: number
  remaining?: number
  utilizationPercent?: number
  createdBy: {
    firstName: string
    lastName: string
    email: string
  }
  budgetCategories?: Array<{
    id: string
    allocatedAmount: string
    category: {
      name: string
    }
  }>
}

export function BudgetList() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const { currentStartup } = useStartup()

  useEffect(() => {
    if (currentStartup?.id) {
      fetchBudgets()
    }
  }, [currentStartup?.id])

  const fetchBudgets = async () => {
    try {
      // This would fetch from the API
      // For now, using mock data
      const mockBudgets: Budget[] = [
        {
          id: '1',
          name: 'Q1 2024 Operations',
          description: 'Quarterly operational budget for office and software',
          budgetType: 'quarterly',
          status: 'active',
          totalAmount: '15000',
          currency: 'USD',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          alertThreshold: '80',
          spent: 9500,
          remaining: 5500,
          utilizationPercent: 63,
          createdBy: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          },
          budgetCategories: [
            { id: '1', allocatedAmount: '8000', category: { name: 'Office Supplies' } },
            { id: '2', allocatedAmount: '4000', category: { name: 'Software' } },
            { id: '3', allocatedAmount: '3000', category: { name: 'Marketing' } },
          ]
        },
        {
          id: '2',
          name: 'Marketing Campaign - Product Launch',
          description: 'Budget for new product launch marketing activities',
          budgetType: 'project',
          status: 'active',
          totalAmount: '25000',
          currency: 'USD',
          startDate: '2024-02-01',
          endDate: '2024-04-30',
          alertThreshold: '85',
          spent: 22500,
          remaining: 2500,
          utilizationPercent: 90,
          createdBy: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com'
          },
          budgetCategories: [
            { id: '4', allocatedAmount: '15000', category: { name: 'Marketing' } },
            { id: '5', allocatedAmount: '10000', category: { name: 'Equipment' } },
          ]
        }
      ]
      
      setBudgets(mockBudgets)
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: Budget['budgetType']) => {
    switch (type) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800'
      case 'quarterly':
        return 'bg-purple-100 text-purple-800'
      case 'yearly':
        return 'bg-indigo-100 text-indigo-800'
      case 'project':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUtilizationColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600'
    if (percent >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Budget Management</CardTitle>
            <CardDescription>Loading budgets...</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budget Management</CardTitle>
          <CardDescription>
            Track and manage your budgets
          </CardDescription>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No budgets created yet</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Budget
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {budgets.map((budget) => {
              const totalAmount = Number(budget.totalAmount)
              const spent = budget.spent || 0
              const utilizationPercent = budget.utilizationPercent || 0
              const isAlertThreshold = utilizationPercent >= Number(budget.alertThreshold)
              
              return (
                <div
                  key={budget.id}
                  className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                >
                  {/* Budget Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{budget.name}</h3>
                        <Badge className={getStatusColor(budget.status)}>
                          {budget.status}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(budget.budgetType)}>
                          {budget.budgetType}
                        </Badge>
                        {isAlertThreshold && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {budget.description && (
                        <p className="text-sm text-muted-foreground">{budget.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                        </span>
                        <span>Created by {budget.createdBy.firstName} {budget.createdBy.lastName}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(totalAmount)}
                        </div>
                        <p className="text-sm text-muted-foreground">Allocated</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(spent)}
                        </div>
                        <p className="text-sm text-muted-foreground">Spent</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getUtilizationColor(utilizationPercent)}`}>
                          {utilizationPercent}%
                        </div>
                        <p className="text-sm text-muted-foreground">Utilized</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Budget Progress</span>
                        <span className={getUtilizationColor(utilizationPercent)}>
                          {utilizationPercent}% of {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <Progress value={utilizationPercent} className="w-full" />
                    </div>

                    {/* Category Breakdown */}
                    {budget.budgetCategories && budget.budgetCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Category Allocations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {budget.budgetCategories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <span className="text-sm font-medium">
                                {category.category.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatCurrency(Number(category.allocatedAmount))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isAlertThreshold && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-800 font-medium">
                            Budget Alert
                          </span>
                        </div>
                        <p className="text-xs text-red-700 mt-1">
                          This budget has exceeded {budget.alertThreshold}% utilization threshold
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, Download, Calculator, AlertCircle } from 'lucide-react'
import { ExportDropdown } from './export-dropdown'

const taxCategories = [
  {
    id: '1',
    name: 'Business Meals & Entertainment',
    deductible: 2500,
    limit: 50,
    description: '50% deductible',
    expenses: [
      { description: 'Client dinner at Restaurant ABC', amount: 185, date: '2024-03-08' },
      { description: 'Team lunch meeting', amount: 120, date: '2024-03-15' },
    ]
  },
  {
    id: '2',
    name: 'Office Supplies & Equipment',
    deductible: 8750,
    limit: 100,
    description: '100% deductible',
    expenses: [
      { description: 'Laptop for development', amount: 2500, date: '2024-02-10' },
      { description: 'Office furniture', amount: 1250, date: '2024-01-15' },
    ]
  },
  {
    id: '3',
    name: 'Software & Subscriptions',
    deductible: 15600,
    limit: 100,
    description: '100% deductible',
    expenses: [
      { description: 'Figma Pro subscription', amount: 720, date: '2024-03-10' },
      { description: 'AWS hosting costs', amount: 450, date: '2024-03-01' },
    ]
  },
  {
    id: '4',
    name: 'Professional Services',
    deductible: 5200,
    limit: 100,
    description: '100% deductible',
    expenses: [
      { description: 'Legal consultation', amount: 1500, date: '2024-02-20' },
      { description: 'Accounting services', amount: 800, date: '2024-03-01' },
    ]
  }
]

const taxSummary = {
  totalExpenses: 32050,
  totalDeductible: 32050,
  estimatedSavings: 9615,
  taxRate: 30,
  quarterlyEstimate: 2404
}

export function TaxReports() {
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

  const getDeductibilityColor = (limit: number) => {
    if (limit === 100) return 'text-green-600'
    if (limit >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const exportData = {
    title: 'Tax Deduction Report',
    data: taxCategories.map(category => ({
      category: category.name,
      totalExpenses: category.deductible,
      deductibleAmount: category.deductible * (category.limit / 100),
      taxSavings: category.deductible * (category.limit / 100) * (taxSummary.taxRate / 100),
      deductibilityRate: `${category.limit}%`
    })),
    columns: ['category', 'totalExpenses', 'deductibleAmount', 'taxSavings', 'deductibilityRate'],
    summary: [
      { label: 'Total Expenses', value: taxSummary.totalExpenses },
      { label: 'Total Deductible', value: taxSummary.totalDeductible },
      { label: 'Estimated Savings', value: taxSummary.estimatedSavings },
      { label: 'Quarterly Tax Estimate', value: taxSummary.quarterlyEstimate },
    ]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Tax Reports & Deductions
          </CardTitle>
          <CardDescription>
            Tax-deductible expenses and estimated savings
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Tax Summary
          </Button>
          <ExportDropdown data={exportData} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Tax Summary Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(taxSummary.totalExpenses)}
            </div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(taxSummary.totalDeductible)}
            </div>
            <p className="text-sm text-muted-foreground">Deductible</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(taxSummary.estimatedSavings)}
            </div>
            <p className="text-sm text-muted-foreground">Est. Savings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(taxSummary.quarterlyEstimate)}
            </div>
            <p className="text-sm text-muted-foreground">Quarterly Tax</p>
          </div>
        </div>

        {/* Tax Categories */}
        <div className="space-y-6">
          {taxCategories.map((category) => {
            const deductibilityPercentage = (category.deductible / category.deductible) * category.limit
            
            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getDeductibilityColor(category.limit) === 'text-green-600' ? 'bg-green-100 text-green-800' : 
                      getDeductibilityColor(category.limit) === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {category.limit}% deductible
                    </Badge>
                    {category.limit < 100 && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Spent</p>
                    <p className="font-medium">{formatCurrency(category.deductible)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deductible Amount</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(category.deductible * (category.limit / 100))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax Savings</p>
                    <p className="font-medium text-purple-600">
                      {formatCurrency(category.deductible * (category.limit / 100) * (taxSummary.taxRate / 100))}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Deductibility Progress</span>
                    <span className={getDeductibilityColor(category.limit)}>
                      {category.limit}% of {formatCurrency(category.deductible)}
                    </span>
                  </div>
                  <Progress value={category.limit} className="w-full" />
                </div>

                {/* Recent Expenses in Category */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Recent Expenses</h5>
                  <div className="space-y-2">
                    {category.expenses.slice(0, 2).map((expense, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-muted-foreground text-xs">{formatDate(expense.date)}</p>
                        </div>
                        <span className="font-medium">{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {category.limit < 100 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800 font-medium">
                        Limited Deductibility
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Only {category.limit}% of {category.name.toLowerCase()} expenses are tax-deductible
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tax Tips */}
        <div className="mt-6 pt-4 border-t">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">Tax Planning Tips</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep all receipts and documentation for business expenses</li>
              <li>• Business meals are generally 50% deductible</li>
              <li>• Home office expenses may be deductible if used exclusively for business</li>
              <li>• Consult with a tax professional for personalized advice</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import { TrendingUp, DollarSign, Calendar, PieChart as PieChartIcon } from 'lucide-react'

interface ExpensesByStatus {
  status: string
  count: number
  total: number
}

interface DailyExpense {
  date: string
  amount: number
}

interface MonthlyTrend {
  month: string
  total: number
  count: number
}

interface CategoryBreakdown {
  category: string
  total: number
  count: number
  avgAmount: number
}

interface FinancialChartsProps {
  trends?: {
    dailyExpenses: DailyExpense[]
    expensesByStatus: ExpensesByStatus[]
    monthlyTrends: MonthlyTrend[]
    categoryBreakdown: CategoryBreakdown[]
  }
}

export function FinancialCharts({ trends }: FinancialChartsProps) {
  const [loading, setLoading] = useState(!trends)
  const [data, setData] = useState(trends)

  useEffect(() => {
    if (!trends) {
      fetchTrends()
    }
  }, [trends])

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/dashboard/analytics')
      if (response.ok) {
        const result = await response.json()
        setData(result.trends)
      }
    } catch (error) {
      console.error('Error fetching trends:', error)
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
      day: 'numeric'
    })
  }

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit'
    })
  }

  // Process daily expenses data for charts
  const processedDailyData = data?.dailyExpenses?.map(item => ({
    date: formatDate(item.date),
    amount: Number(item.amount),
    formattedAmount: formatCurrency(Number(item.amount))
  })) || []

  // Process expenses by status for pie chart
  const statusColors = {
    draft: '#9CA3AF',
    pending: '#F59E0B',
    approved: '#10B981',
    rejected: '#EF4444',
    reimbursed: '#3B82F6'
  }

  const processedStatusData = data?.expensesByStatus?.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: Number(item.total),
    count: item.count,
    color: statusColors[item.status as keyof typeof statusColors] || '#9CA3AF'
  })) || []

  // Process monthly trends data
  const processedMonthlyData = data?.monthlyTrends?.map(item => ({
    month: formatMonth(item.month),
    amount: Number(item.total),
    count: item.count,
    formattedAmount: formatCurrency(Number(item.total))
  })) || []

  // Process category breakdown data
  const processedCategoryData = data?.categoryBreakdown?.map(item => ({
    name: item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'Uncategorized',
    value: Number(item.total),
    count: item.count,
    avgAmount: Number(item.avgAmount),
    color: getCategoryColor(item.category)
  })) || []

  function getCategoryColor(category: string) {
    const colors = {
      'office-supplies': '#3B82F6',
      'travel': '#10B981', 
      'meals': '#F59E0B',
      'software': '#8B5CF6',
      'marketing': '#EF4444',
      'equipment': '#06B6D4',
      'other': '#6B7280'
    }
    return colors[category as keyof typeof colors] || '#9CA3AF'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Analytics</CardTitle>
          <CardDescription>Loading charts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading financial data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || (!data.dailyExpenses?.length && !data.expensesByStatus?.length)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Financial Analytics
          </CardTitle>
          <CardDescription>Expense trends and spending analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <PieChartIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No financial data available yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Charts will appear once you have expense data
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Financial Analytics
        </CardTitle>
        <CardDescription>Expense trends and spending analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Daily Trends</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="status">By Status</TabsTrigger>
          </TabsList>

          {/* Daily Expense Trends */}
          <TabsContent value="trends" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedDailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-blue-600">
                              Amount: {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Monthly Trends */}
          <TabsContent value="monthly" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-blue-600">
                              Total: {formatCurrency(payload[0].value as number)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {payload[0].payload.count} expenses
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    fill="url(#colorAmount)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Category Breakdown */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {processedCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-blue-600">
                                Total: {formatCurrency(data.value)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {data.count} expenses
                              </p>
                              <p className="text-gray-600 text-sm">
                                Avg: {formatCurrency(data.avgAmount)}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Bar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedCategoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-blue-600">
                                Total: {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {data.count} expenses
                              </p>
                              <p className="text-gray-600 text-sm">
                                Avg: {formatCurrency(data.avgAmount)}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Expenses by Status */}
          <TabsContent value="status" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {processedStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-blue-600">
                                Amount: {formatCurrency(data.value)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {data.count} expenses
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-blue-600">
                                Amount: {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {data.count} expenses
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
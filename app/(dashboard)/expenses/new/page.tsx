'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'

export default function NewExpensePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    expenseDate: '',
    categoryId: '',
    paymentMethodId: '',
    vendorName: '',
    invoiceNumber: '',
    isTaxDeductible: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/expenses')
      } else {
        console.error('Failed to create expense')
      }
    } catch (error) {
      console.error('Error creating expense:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Add Expense"
        description="Create a new expense entry"
      />
      
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/expenses" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to expenses
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>
                Fill in the details for your expense submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title *
                    </label>
                    <Input
                      id="title"
                      placeholder="e.g., Office supplies"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount *
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Describe the expense..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>

                {/* Date and Category */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="expenseDate" className="text-sm font-medium">
                      Date *
                    </label>
                    <Input
                      id="expenseDate"
                      type="date"
                      value={formData.expenseDate}
                      onChange={(e) => handleChange('expenseDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="categoryId" className="text-sm font-medium">
                      Category *
                    </label>
                    <select
                      id="categoryId"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', e.target.value)}
                      required
                    >
                      <option value="">Select category...</option>
                      <option value="software">Software & Tools</option>
                      <option value="hardware">Hardware & Equipment</option>
                      <option value="office">Office Supplies</option>
                      <option value="travel">Travel & Transportation</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="legal">Legal & Professional</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Vendor and Invoice */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="vendorName" className="text-sm font-medium">
                      Vendor
                    </label>
                    <Input
                      id="vendorName"
                      placeholder="e.g., Amazon, Office Depot"
                      value={formData.vendorName}
                      onChange={(e) => handleChange('vendorName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="invoiceNumber" className="text-sm font-medium">
                      Invoice/Receipt #
                    </label>
                    <Input
                      id="invoiceNumber"
                      placeholder="e.g., INV-001234"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                    />
                  </div>
                </div>

                {/* Receipt Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Receipt</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to upload
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Tax Deductible */}
                <div className="flex items-center space-x-2">
                  <input
                    id="isTaxDeductible"
                    type="checkbox"
                    checked={formData.isTaxDeductible}
                    onChange={(e) => handleChange('isTaxDeductible', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isTaxDeductible" className="text-sm font-medium">
                    Tax deductible
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Expense'}
                  </Button>
                  <Link href="/expenses">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
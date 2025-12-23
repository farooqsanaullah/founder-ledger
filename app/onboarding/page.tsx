'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ArrowRight, Building2, Users, Sparkles } from 'lucide-react'

export default function OnboardingPage() {
  const { userId } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    foundedDate: '',
    defaultCurrency: 'USD'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/startups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.startupName,
          industry: formData.industry,
          foundedDate: formData.foundedDate || null,
          defaultCurrency: formData.defaultCurrency,
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Failed to create startup')
      }
    } catch (error) {
      console.error('Error creating startup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">FounderLedger</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to FounderLedger! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Let's set up your startup and get you tracking expenses in minutes
            </p>
          </div>

          {/* Onboarding Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Building2 className="h-6 w-6 text-indigo-600" />
                <span>Create Your Startup</span>
              </CardTitle>
              <CardDescription>
                Tell us about your startup so we can customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Startup Name */}
                <div className="space-y-2">
                  <label htmlFor="startupName" className="text-sm font-medium text-gray-700">
                    Startup Name *
                  </label>
                  <Input
                    id="startupName"
                    type="text"
                    placeholder="e.g., Acme Inc, TechStart, MyApp"
                    value={formData.startupName}
                    onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                    required
                    className="text-lg"
                  />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label htmlFor="industry" className="text-sm font-medium text-gray-700">
                    Industry (Optional)
                  </label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder="e.g., SaaS, E-commerce, FinTech, EdTech"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>

                {/* Founded Date */}
                <div className="space-y-2">
                  <label htmlFor="foundedDate" className="text-sm font-medium text-gray-700">
                    Founded Date (Optional)
                  </label>
                  <Input
                    id="foundedDate"
                    type="date"
                    value={formData.foundedDate}
                    onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
                  />
                </div>

                {/* Default Currency */}
                <div className="space-y-2">
                  <label htmlFor="defaultCurrency" className="text-sm font-medium text-gray-700">
                    Default Currency
                  </label>
                  <select
                    id="defaultCurrency"
                    value={formData.defaultCurrency}
                    onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="PKR">PKR - Pakistani Rupee</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={!formData.startupName || isLoading}
                >
                  {isLoading ? (
                    'Creating your startup...'
                  ) : (
                    <>
                      Create My Startup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* What's Next Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              What happens next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Setup Complete</h4>
                <p className="text-sm text-gray-600">Your startup profile with default categories</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Invite Co-founders</h4>
                <p className="text-sm text-gray-600">Add your team and set permissions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Start Tracking</h4>
                <p className="text-sm text-gray-600">Add your first expense and get organized</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
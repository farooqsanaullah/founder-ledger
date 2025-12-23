import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calculator,
  Receipt,
  PieChart,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">FounderLedger</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Expense Tracking for
            <span className="text-indigo-600"> Co-founders</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop fighting over spreadsheets. Track startup expenses, investments, and settlements in one place. 
            Know exactly who owes what, when they owe it, and how to get paid back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Free forever • No credit card required • 2-minute setup
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Smart Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Upload receipts, categorize expenses, and track who paid with which card or account. 
                Never lose track of business expenses again.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Investment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Monitor funding rounds, equity splits, and investor relations. 
                Keep your cap table organized and up-to-date.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Automatic Settlements</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Know exactly who owes whom money with automatic calculations. 
                Split expenses fairly and settle up with confidence.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Startup Co-founders
            </h2>
            <p className="text-gray-600 text-lg">
              Stop arguing about money and focus on building your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-currency Support</h3>
                  <p className="text-gray-600">Track expenses in USD, PKR, EUR, and 15+ other currencies</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Receipt Management</h3>
                  <p className="text-gray-600">Upload and organize receipts with automatic data extraction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Budget Tracking</h3>
                  <p className="text-gray-600">Set budgets by category and get alerts before you overspend</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Team Permissions</h3>
                  <p className="text-gray-600">Control who can approve expenses and access financial data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Export Reports</h3>
                  <p className="text-gray-600">Generate reports for your accountant and tax filing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Sync</h3>
                  <p className="text-gray-600">All co-founders stay updated with real-time synchronization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to organize your startup finances?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of founders who trust FounderLedger with their expense tracking
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-indigo-600" />
              <span className="font-semibold text-gray-900">FounderLedger</span>
            </div>
            <p className="text-sm text-gray-500">
              Built for startup co-founders, by startup co-founders
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
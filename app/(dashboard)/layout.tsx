import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-0 ml-0">
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
import { auth } from '@clerk/nextjs/server'
import { Header } from '@/components/dashboard/header'
import { SettingsTabs } from '@/components/settings/settings-tabs'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Settings"
        description="Manage your startup settings and preferences"
      />
      
      <div className="flex-1 p-6 pb-12">
        <SettingsTabs />
      </div>
    </div>
  )
}
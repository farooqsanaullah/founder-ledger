'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TeamSettings } from '@/components/team/team-settings'
import { StartupSettings } from '@/components/settings/startup-settings'
import { UserPreferences } from '@/components/settings/user-preferences'
import { IntegrationsSettings } from '@/components/settings/integrations-settings'
import { 
  Users, 
  Building2, 
  User, 
  Plug,
  Settings as SettingsIcon
} from 'lucide-react'

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('team')

  const tabs = [
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      component: TeamSettings
    },
    {
      id: 'startup',
      label: 'Startup',
      icon: Building2,
      component: StartupSettings
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: User,
      component: UserPreferences
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      component: IntegrationsSettings
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {tabs.map((tab) => {
          const Component = tab.component
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Component />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientClerkProvider } from '@/components/providers/clerk-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FounderLedger - Startup Expense Tracking',
  description: 'Track startup expenses, investments, and settlements between co-founders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientClerkProvider>
          {children}
        </ClientClerkProvider>
      </body>
    </html>
  )
}
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { currencies } from '@/lib/db/schema'
import { defaultCurrencies } from '@/lib/seed-data'

// Load environment variables
config({ path: '.env.local' })

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  console.log('🌱 Starting database seeding...')

  // Seed currencies
  console.log('💰 Seeding currencies...')
  try {
    for (const currency of defaultCurrencies) {
      await db.insert(currencies).values(currency).onConflictDoNothing()
    }
    console.log(`✅ Seeded ${defaultCurrencies.length} currencies`)
  } catch (error) {
    console.error('❌ Error seeding currencies:', error)
    throw error
  }

  console.log('🎉 Database seeding completed successfully!')
}

main().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
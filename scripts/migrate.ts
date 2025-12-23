import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'

// Load environment variables
config({ path: '.env.local' })

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: './drizzle/migrations' })
  console.log('Migrations completed!')
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
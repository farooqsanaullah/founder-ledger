# FounderLedger

A startup expense and investment tracking app for co-founders. Track expenses, investments, settlements, and who owes whom money.

## 🚀 Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Authentication:** Clerk
- **File Storage:** Cloudflare R2
- **Deployment:** Vercel

## 🛠 Setup Instructions

### Option 1: Local Development

1. Copy `.env.example` to `.env.local` and fill in the required values
2. Set up Neon database and add `DATABASE_URL`
3. Set up Clerk and add auth keys
4. Run migrations: `pnpm db:migrate`
5. Seed data: `pnpm db:seed`
6. Start dev server: `pnpm dev`

### Option 2: Deploy to Vercel First (Recommended)

1. Push code to GitHub
2. Deploy to Vercel
3. Add Neon integration in Vercel dashboard
4. Add Clerk environment variables in Vercel
5. Run database setup commands in Vercel

### Required Environment Variables

```bash
# Database (Neon)
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. Database Setup

1. Create a Neon database at [neon.tech](https://neon.tech)
2. Add your `DATABASE_URL` to `.env.local`
3. Run migrations and seed data:

```bash
# Run database migrations
pnpm db:migrate

# Seed default currencies
pnpm db:seed
```

### 3. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Add your Clerk keys to `.env.local`
3. Configure webhook endpoint in Clerk dashboard:
   - Endpoint: `{your_app_url}/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Add the webhook secret to `.env.local`

### 4. Install Dependencies & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks

# Database
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema to DB (dev only)
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed default data
```

## 🗂 Project Structure

```
founder-ledger/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── db/               # Database schema and client
│   ├── auth.ts           # Auth helpers
│   └── utils.ts          # Utility functions
├── scripts/              # Database scripts
└── drizzle/             # Database migrations
```

## 🎯 Key Features (Planned)

- **Expense Tracking:** Track who paid for what with receipt uploads
- **Investment Management:** Monitor funding rounds and equity splits
- **Settlement Tracking:** Know who owes whom money
- **Multi-currency Support:** USD, PKR, and other currencies
- **Budget Management:** Set budgets and get alerts
- **Team Collaboration:** Invite co-founders and manage permissions
- **Reports & Export:** Generate reports for accountants

## 🚧 Development Status

**Phase 1 Complete ✅**
- [x] Next.js 16 setup with TypeScript & Tailwind
- [x] shadcn/ui configuration
- [x] Drizzle ORM with Neon PostgreSQL
- [x] Clerk authentication
- [x] Database schema and migrations
- [x] Default currencies seeding

**Next Phases:**
- Phase 2: Core Layout & Auth
- Phase 3: Expense Management
- Phase 4: Investment Tracking
- Phase 5: Dashboard & Analytics

## 📝 Database Schema

Core tables:
- `users` - User profiles (synced from Clerk)
- `startups` - Startup information
- `startup_members` - Team membership with roles
- `categories` - Expense categories (hierarchical)
- `expenses` - Expense tracking
- `payment_methods` - Payment cards and accounts
- `currencies` - Multi-currency support

## 🤝 Contributing

This is a personal project for tracking startup expenses between co-founders. Feel free to fork and adapt for your own needs.

## 📄 License

ISC License
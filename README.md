# AI Empire Builder – Complete Access Control System

## 🎯 Overview

A production-ready access control system built with Next.js, Supabase, and Stripe that:

- ✅ Restricts Starter ($97) users to Foundation + Planning modules only
- ✅ Blocks access to all other modules and Resource Center for Starter users
- ✅ Uses Stripe checkout + webhook for payment processing
- ✅ Automatically updates user plans in Supabase after payment
- ✅ Includes front-end module locking and upgrade prompts
- ✅ Fully deploy-ready with no placeholders

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase and Stripe credentials

3. **Run database migration:**
   - Open Supabase SQL Editor
   - Run `supabase-migration.sql`

4. **Set up Stripe webhook:**
   - Point to: `https://yourdomain.com/api/stripe/webhook`
   - Event: `checkout.session.completed`

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 📚 Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## 🏗️ Project Structure

```
├── pages/
│   ├── api/
│   │   ├── checkout/[plan].ts    # Stripe checkout
│   │   └── stripe/webhook.ts      # Webhook handler
│   ├── modules/                   # Course modules
│   ├── dashboard.tsx              # Main dashboard
│   ├── login.tsx                  # Authentication
│   ├── upgrade.tsx               # Upgrade page
│   └── ...
├── components/
│   └── ModuleCard.tsx            # Module component
├── lib/
│   └── supabaseClient.ts         # Supabase setup
├── middleware.ts                 # Route protection
└── supabase-migration.sql        # Database schema
```

## 🔐 Access Control

- **Starter ($97)**: Foundation + Planning modules only
- **Pro ($297)**: All modules + Resource Center
- **Elite ($997)**: All modules + Resource Center + Priority support

## 🧪 Testing

- ✅ Starter users can only access Foundation + Planning
- ✅ All other routes redirect to /upgrade for Starter users
- ✅ Pro/Elite have full access
- ✅ Stripe webhook upgrades Supabase record correctly
- ✅ Plan status displays dynamically on dashboard

## 📝 License

Built for AI Empire Builder

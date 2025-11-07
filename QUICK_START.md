# Quick Start - Execute the Project

## ✅ Prerequisites Check

- ✅ Node.js v22.18.0 - Installed
- ✅ npm 10.9.3 - Installed
- ✅ Dependencies - Installed

## 🚀 Step-by-Step Execution

### 1. Create Environment Variables File

Create `.env.local` in the root directory with your credentials:

```env
# Supabase (Get from: https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Get from: https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (Create products in Stripe dashboard)
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ELITE=price_...

# Site URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_URL=http://localhost:3000
```

### 2. Run Database Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → SQL Editor
3. Copy and paste contents of `supabase-migration.sql`
4. Click "Run"

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 4. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Login" and sign in with Supabase Auth
3. View dashboard with module access
4. Test upgrade flow (use Stripe test mode)

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Utilities
npm run lint         # Run ESLint
```

## ⚠️ Important Notes

1. **Environment Variables**: You MUST create `.env.local` with real credentials
2. **Database**: Run the migration SQL in Supabase before testing
3. **Stripe**: Use test mode for development (keys start with `sk_test_` and `pk_test_`)
4. **Webhook**: For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## 🐛 Troubleshooting

### "Missing environment variables"
- Create `.env.local` file with all required variables
- Restart dev server after adding variables

### "Cannot connect to Supabase"
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active

### "Stripe checkout not working"
- Verify Stripe keys are in test mode
- Check that price IDs match your Stripe products

### "Module access denied"
- Ensure user exists in `users` table
- Check plan_tier is set correctly
- Verify middleware is working

## 📚 Next Steps

1. Set up Supabase project and get credentials
2. Create Stripe products and get price IDs
3. Configure `.env.local`
4. Run database migration
5. Start dev server: `npm run dev`





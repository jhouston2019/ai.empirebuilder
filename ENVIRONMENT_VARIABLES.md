# Environment Variables Setup

## Required Environment Variables

Copy these into your `.env.local` file:

```env
# =====================================================
# Supabase Configuration
# =====================================================
# Get these from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# =====================================================
# Stripe Configuration
# =====================================================
# Get these from: Stripe Dashboard → Developers → API keys
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...

# Get this from: Stripe Dashboard → Developers → Webhooks
# After creating webhook endpoint
STRIPE_WEBHOOK_SECRET=whsec_...

# =====================================================
# Stripe Price IDs
# =====================================================
# Get these from: Stripe Dashboard → Products
# Create products with prices:
# - Starter: $97 (one-time payment)
# - Builder: $297 (one-time payment)
# - Pro: $497 (one-time payment) - optional
# - Elite: $997 (one-time payment) - optional
# Copy the Price IDs (start with "price_")
STRIPE_PRICE_STARTER=price_97starterXXXX
STRIPE_PRICE_BUILDER=price_297builderXXXX
STRIPE_PRICE_PRO=price_497proXXXX
STRIPE_PRICE_ELITE=price_997eliteXXXX

# =====================================================
# Site URLs
# =====================================================
# For production:
NEXT_PUBLIC_SITE_URL=https://aiempirebuilder.pro
SITE_URL=https://aiempirebuilder.pro

# For local development:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# SITE_URL=http://localhost:3000
```

## Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. Wait for project to finish provisioning
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Switch to **Test mode** for development
3. Create products:
   - **Starter Plan**: $97 one-time payment
   - **Builder Plan**: $297 one-time payment
   - **Pro Plan**: $497 one-time payment (optional)
   - **Elite Plan**: $997 one-time payment (optional)
4. Copy the **Price IDs** (start with `price_`) for each product
5. Go to **Developers → API keys**
6. Copy:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
7. Set up webhook (see below)

### 3. Stripe Webhook Setup

#### For Production:
1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

#### For Local Development:
1. Install Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Copy the webhook secret from CLI output
3. Use that secret in `.env.local`

### 4. Database Migration

1. Go to Supabase Dashboard → **SQL Editor**
2. Open `supabase-migration.sql`
3. Copy and paste the entire SQL into the editor
4. Click **Run**
5. Verify the `users` table was created

## Verification Checklist

- [ ] All environment variables are set in `.env.local`
- [ ] Supabase project is created and credentials are correct
- [ ] Stripe products and prices are created
- [ ] Stripe webhook is configured
- [ ] Database migration has been run
- [ ] `.env.local` is in `.gitignore` (never commit this file!)

## Security Notes

⚠️ **Never commit `.env.local` to version control!**

- The file is already in `.gitignore`
- Service role key has full database access
- Stripe secret keys can process payments
- Keep these keys secure and rotate them regularly


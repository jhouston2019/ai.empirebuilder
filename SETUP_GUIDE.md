# AI Empire Builder – Complete Access Control System Setup Guide

## 🎯 Overview

This is a complete access control system that:
- ✅ Allows Starter ($97) users to access only Foundation + Planning Modules
- ✅ Blocks access to all other modules and Resource Center
- ✅ Uses Stripe checkout + webhook + Supabase for plan verification
- ✅ Includes front-end module locking and upgrade prompts
- ✅ Is fully deploy-ready (Next.js + Supabase + Stripe)

---

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Stripe account (for payment processing)
- Git (optional, for version control)

---

## 🚀 Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- Supabase client
- Stripe SDK
- Tailwind CSS
- TypeScript

---

## 🔧 Step 2: Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-publishable-key

# Stripe Price IDs
STRIPE_PRICE_STARTER=price_97starterXXXX
STRIPE_PRICE_PRO=price_297proXXXX
STRIPE_PRICE_ELITE=price_997eliteXXXX

# Site URLs
NEXT_PUBLIC_SITE_URL=https://aiempirebuilder.pro
SITE_URL=https://aiempirebuilder.pro
```

### Getting Supabase Credentials:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
5. Copy `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
6. Copy `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

### Getting Stripe Credentials:
1. Go to [stripe.com](https://stripe.com)
2. Create products and prices for:
   - Starter: $97
   - Pro: $297
   - Elite: $997
3. Copy the Price IDs (start with `price_`)
4. Go to Developers → API keys
5. Copy `Secret key` (STRIPE_SECRET_KEY)
6. Copy `Publishable key` (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
7. Set up webhook endpoint (see Step 4)

---

## 🗄️ Step 3: Database Setup

Run the SQL migration in your Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase-migration.sql`
3. Click "Run"

This creates:
- `users` table with `email` and `plan_tier` columns
- Row Level Security (RLS) policies
- Automatic timestamp updates

---

## 🔗 Step 4: Stripe Webhook Setup

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Signing secret** and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### For Local Testing:
Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook secret for local testing.

---

## 🏃 Step 5: Run the Application

### Development:
```bash
npm run dev
```

Visit: `http://localhost:3000`

### Production Build:
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── pages/
│   ├── api/
│   │   ├── checkout/[plan].ts      # Stripe checkout endpoint
│   │   └── stripe/
│   │       └── webhook.ts          # Stripe webhook handler
│   ├── modules/
│   │   ├── foundation.tsx          # Starter access ✅
│   │   ├── planning.tsx             # Starter access ✅
│   │   ├── monetization.tsx        # Pro/Elite only 🔒
│   │   ├── traffic.tsx              # Pro/Elite only 🔒
│   │   └── scaling.tsx              # Pro/Elite only 🔒
│   ├── resource-center/
│   │   └── index.tsx                # Pro/Elite only 🔒
│   ├── dashboard.tsx                # Main dashboard
│   ├── login.tsx                    # Authentication
│   ├── upgrade.tsx                   # Upgrade page
│   ├── success.tsx                   # Payment success
│   └── cancel.tsx                    # Payment cancelled
├── components/
│   └── ModuleCard.tsx               # Module card component
├── lib/
│   └── supabaseClient.ts            # Supabase client setup
├── middleware.ts                    # Route protection
├── supabase-migration.sql           # Database schema
└── .env.local                       # Environment variables (create this)
```

---

## 🔐 Access Control Logic

### Starter Plan ($97):
- ✅ Can access: Foundation, Planning modules
- ❌ Cannot access: Monetization, Traffic, Scaling modules, Resource Center
- Redirects to `/upgrade` if trying to access locked content

### Pro Plan ($297):
- ✅ Full access to all modules and Resource Center

### Elite Plan ($997):
- ✅ Full access to all modules and Resource Center

---

## 🧪 Testing Checklist

- [ ] Starter users can only access Foundation + Planning
- [ ] All other routes redirect to /upgrade for Starter users
- [ ] Pro/Elite have full access
- [ ] Stripe webhook upgrades Supabase record correctly
- [ ] Plan status displays dynamically on dashboard
- [ ] Checkout works with live Stripe links
- [ ] Login creates user with starter plan if doesn't exist
- [ ] Middleware protects routes correctly

---

## 🚨 Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists and has all required variables
- Restart the dev server after adding environment variables

### "Webhook Error: Invalid signature"
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Make sure webhook endpoint URL matches in Stripe dashboard

### "User not found" errors
- Check that database migration ran successfully
- Verify RLS policies allow service role access for webhooks

### Middleware not working
- Check that `middleware.ts` is in the root directory
- Verify authentication cookies are being set in login

---

## 📝 Notes

- The system automatically creates users with "starter" plan on first login
- Webhook updates user plan after successful payment
- All routes are protected by middleware
- Frontend also shows locked/unlocked states

---

## 🔄 Deployment

### Vercel (Recommended):
1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Netlify:
1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables in Netlify dashboard
4. Update webhook URL in Stripe dashboard
5. Deploy

---

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables are set
3. Ensure database migration completed
4. Test Stripe webhook with Stripe CLI locally

---

**Built with Next.js, Supabase, and Stripe** 🚀


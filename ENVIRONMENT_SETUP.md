# Environment Variables Setup for Netlify

## Required Environment Variables

Add these environment variables in your Netlify dashboard:

### Stripe Configuration
```
STRIPE_SECRET_KEY=sk_live_***************
NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER=price_***************
NEXT_PUBLIC_STRIPE_PRICE_ID_BUILDER=price_***************
STRIPE_WEBHOOK_SECRET=whsec_***************
```

### SendGrid Configuration
```
SENDGRID_API_KEY=SG.***************
FROM_EMAIL=support@aiempirebuilder.com
```

### Site Configuration
```
SITE_URL=https://aiempirebuilder.com
```

## How to Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable** for each variable above
5. Make sure to use **live** keys (not test keys)

## Stripe Webhook Setup

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://aiempirebuilder.com/.netlify/functions/stripe-webhook`
4. Select the event: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Netlify as `STRIPE_WEBHOOK_SECRET`

## Testing

After deployment:
1. Test the Starter checkout button
2. Test the Builder checkout button
3. Verify you receive:
   - Stripe receipt email (automatic)
   - SendGrid welcome email (via webhook)
4. Verify redirects work:
   - Starter → `/starter.html`
   - Builder → `/resources.html`


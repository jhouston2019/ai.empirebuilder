import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseClient'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  const buf = await buffer(req)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const email = session.customer_details?.email
    if (!email) {
      console.error('No email found in checkout session')
      return res.status(400).json({ error: 'No email in session' })
    }

    // Get the price ID from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 1,
    })
    const priceId = lineItems.data[0]?.price?.id || session.metadata?.price_id

    if (!priceId) {
      console.error('No price ID found in session')
      return res.status(400).json({ error: 'No price ID in session' })
    }

    // Determine plan tier based on price ID
    let plan = 'starter'
    if (priceId === process.env.STRIPE_PRICE_PRO) {
      plan = 'pro'
    } else if (priceId === process.env.STRIPE_PRICE_ELITE) {
      plan = 'elite'
    }

    // Update user plan in Supabase
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('users')
      .upsert(
        {
          email,
          plan_tier: plan,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      )

    if (error) {
      console.error('Supabase update error:', error)
      return res.status(500).json({ error: 'Failed to update user plan' })
    }

    console.log(`✅ ${email} upgraded to ${plan}`)
  }

  res.json({ received: true })
}


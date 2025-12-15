import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { plan } = req.query

  // Map plan names to Stripe price IDs
  const priceMap: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_RESPONSE_STARTER || process.env.STRIPE_PRICE_STARTER,
    builder: process.env.STRIPE_PRICE_RESPONSE_BUILDER || process.env.STRIPE_PRICE_BUILDER,
    pro: process.env.STRIPE_PRICE_PRO,
    elite: process.env.STRIPE_PRICE_ELITE,
  }

  const price = priceMap[plan as string]
  if (!price) {
    return res.status(400).json({ error: `Invalid plan. Must be one of: starter, builder, pro, elite. Received: ${plan}` })
  }

  // Validate that the environment variable is set
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured. Please contact support.' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    })

    res.redirect(303, session.url || '/cancel')
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    res.status(500).json({ error: error.message || 'Failed to create checkout session' })
  }
}


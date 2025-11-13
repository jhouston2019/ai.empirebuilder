const Stripe = require("stripe");
const sgMail = require("@sendgrid/mail");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { plan, email } = JSON.parse(event.body);

    if (!plan || (plan !== "starter" && plan !== "builder")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid plan. Must be 'starter' or 'builder'" }),
      };
    }

    const priceId =
      plan === "starter"
        ? process.env.STRIPE_PRICE_RESPONSE_STARTER
        : process.env.STRIPE_PRICE_RESPONSE_BUILDER;

    if (!priceId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Price ID not configured" }),
      };
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL || "https://aiempirebuilder.com"}/success.html?plan=${plan}&email=${encodeURIComponent(email || "")}`,
      cancel_url: `${process.env.SITE_URL || "https://aiempirebuilder.com"}/pricing.html`,
      metadata: {
        plan: plan,
        email: email || "",
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};


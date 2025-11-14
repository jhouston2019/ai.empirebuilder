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
    const sig = event.headers["stripe-signature"];
    const payload = event.body;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Webhook secret not configured" }),
      };
    }

    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      };
    }

    // Send custom email on successful payment
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      const customerEmail = session.customer_details?.email || session.metadata?.email;
      const plan = session.metadata?.plan || "builder";

      if (customerEmail) {
        const siteUrl = process.env.SITE_URL || "https://aiempirebuilder.com";
        const dashboardUrl =
          plan === "starter" ? `${siteUrl}/starter.html` : `${siteUrl}/resource-center`;

        const message = {
          to: customerEmail,
          from: process.env.FROM_EMAIL || "support@aiempirebuilder.com",
          subject: "Your AI Business Empire Builder Access",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #fff;">
              <h2 style="color: #FFD700;">Welcome to the AI Business Empire Builder System</h2>
              <p>Your payment was successful!</p>
              <p>You now have access to the <strong style="color: #FFD700;">${plan.toUpperCase()}</strong> version of the system.</p>
              <p>Access your content here:</p>
              <ul>
                <li>
                  <a href="${dashboardUrl}" style="color: #FFD700; text-decoration: none;">
                    ${plan === "starter" ? "Starter Dashboard" : "Full Builder Dashboard"}
                  </a>
                </li>
              </ul>
              <p style="margin-top: 30px;">Need help? Email support@aiempirebuilder.com</p>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2024 Axis Strategic Media | All Rights Reserved
              </p>
            </div>
          `,
        };

        try {
          await sgMail.send(message);
          console.log(`Email sent successfully to ${customerEmail}`);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          // Don't fail the webhook if email fails
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error("Webhook handler error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};


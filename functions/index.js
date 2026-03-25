const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);

admin.initializeApp();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = functions.config().stripe.webhook_secret;

exports.stripeWebhook = functions.https.onRequest((req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Example: Update user's premium status in Firestore
      // const userId = paymentIntent.metadata.userId;
      // admin.firestore().collection('users').doc(userId).update({ isPremium: true });
      break;
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`✅ Checkout Session completed for ${session.customer_email}`);
      // Handle subscription or one-time purchase fulfillment
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object;
      console.log(`🔄 Subscription ${subscription.id} status is ${subscription.status}`);
      // Update subscription status in Firestore
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

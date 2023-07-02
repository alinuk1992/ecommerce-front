import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { buffer } from 'micro';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_81c869a9f281241a7c3b67764e79e72abb66d384d108c9c456b8a987b112cadc';

export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret,
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === 'paid';
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).send('ok');
}

export const config = {
  api: { bodyParser: false },
};

// loved-merit-joy-gentle
// acct_1MAzqhJjftNNNdHb

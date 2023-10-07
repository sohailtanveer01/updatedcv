import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { setSubscriber } from '@/store/auth/authSlice';
import { ServerError } from '@/services/axios';
import { UpdateProfileParams } from '@/services/auth';
import axios from 'axios';
import Stripe from 'stripe';
import { stripe } from 'lib/stripe';
import { any, object } from 'joi';

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;
const secret_key_for_payments:string = process.env.SECRET_KEY_FOR_PAYMENTS!;
let metadata

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});



const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  

  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err:any) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }


    // if (!session?.metadata?.userId) {
    //   return new Response(null, {
    //     status: 200,
    //   });
    // }
  
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      
      metadata = session.metadata  
      console.log("im in meta data:",metadata)
      console.log(event.type)
      console.log(event.id)

       //api to update user
       const paid_obj = {
        event_type:event.type,
        event_id:event.id,
        metadata,
        secret_key_for_payments:secret_key_for_payments
      }
      const payment_done = async()=>{
        const apiUrl:string = process.env.NEXT_PUBLIC_API_URL!;

        const payUrl = `${apiUrl}/auth/payment_done_stripe`;
        const 
          successdata
        = await axios.post(payUrl, paid_obj)
      //  const tokenresstr = String(tokenres.data)
      //  console.log(tokenresstr)
      
      }
      payment_done()
    
      }
    // Successfully constructed event.
    console.log('✅ Success:', event.id);
    // const paymentIntent = event.data.object as Stripe.PaymentIntent;
    // Cast event data to Stripe object.
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // const session = event.data.object as Stripe.Checkout.Session

      
     
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
      // console.log(secret_key_for_payments)
      
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(webhookHandler as any);
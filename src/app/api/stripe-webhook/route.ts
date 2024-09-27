import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error(`Webhook Error: ${errorMessage}`);
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    // Process the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userEmail = session.customer_email;
      const amountTotal = session.amount_total;

      if (userEmail) {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (user) {
          let creditsToAdd = 0;

          if (amountTotal === 100000) creditsToAdd = 30;
          if (amountTotal === 200000) creditsToAdd = 100;
          if (amountTotal === 350000) creditsToAdd = 200;

          await prisma.user.update({
            where: { email: userEmail },
            data: { credits: { increment: creditsToAdd } },
          });
        }
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
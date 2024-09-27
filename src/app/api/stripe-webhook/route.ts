import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import getRawBody from 'raw-body';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Disable Next.js body parsing to handle raw body correctly
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  try {
    // Convert Request to a ReadableStream for raw-body to process
    const readable = req.body as unknown as NodeJS.ReadableStream;
    
    // Get the raw body as a buffer
    const rawBody = await getRawBody(readable);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
      } else {
        console.error('Unknown error occurred during Stripe webhook processing');
        return new NextResponse('Webhook Error: Unknown error occurred', { status: 400 });
      }
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

    return new NextResponse('Success', { status: 200 });

  } catch (err) {
    console.error('Error processing webhook:', err);
    return new NextResponse('Webhook Error: Unable to read request body', { status: 500 });
  }
}

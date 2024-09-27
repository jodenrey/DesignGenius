import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Disable body parsing for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to buffer the request body
async function buffer(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader();
  const chunks = [];
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) {
      done = true;
    } else {
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  try {
    // Read the raw body from the readable stream
    const rawBody = await buffer(req.body as unknown as ReadableStream<Uint8Array>);

    let event: Stripe.Event;

    try {
      // Verify Stripe signature and construct event
      event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook signature verification failed: ${err.message}`, { status: 400 });
      }
      console.error('Unknown error occurred during webhook processing');
      return new NextResponse('Webhook Error: Unknown error occurred', { status: 400 });
    }

    // Process the Stripe event
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
  } catch (err: unknown) {
    console.error('Error handling Stripe webhook:', err);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}
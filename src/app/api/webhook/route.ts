import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Disable the body parser to allow raw body handling
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to read the raw body from the request stream
async function readRawBody(req: Request): Promise<string> {
  const readable = req.body as unknown as ReadableStream;
  const reader = readable.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const bodyBuffer = Buffer.concat(chunks);
  return bodyBuffer.toString();
}

// Webhook handler
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  // Get the raw body as text
  const rawBody = await readRawBody(req);

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
}

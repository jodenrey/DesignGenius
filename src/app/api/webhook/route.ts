import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Set up the route to allow for raw body handling
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Helper function to read raw body as Buffer
async function readRawBody(req: Request): Promise<Buffer> {
  const readable = req.body as unknown as ReadableStream<Uint8Array>;
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (readerDone) {
      done = true;
    } else {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

// Webhook handler
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  // Get the raw body as Buffer
  const rawBody = await readRawBody(req);

  let event: Stripe.Event;

  try {
    // Verify and construct the Stripe event
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

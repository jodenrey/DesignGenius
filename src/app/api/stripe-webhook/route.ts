import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import getRawBody from 'raw-body';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// No longer using the config export as it's deprecated for Next.js App Router

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  try {
    // Check if the request body is a ReadableStream
    const bodyBuffer = await getRawBody(req.body as any, {
      length: req.headers.get('content-length')!,
      limit: '1mb', // Set a reasonable limit for the body size
      encoding: 'utf8', // Set the encoding explicitly
    });

    let event: Stripe.Event;

    try {
      // Verify Stripe signature and parse event
      event = stripe.webhooks.constructEvent(bodyBuffer, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
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

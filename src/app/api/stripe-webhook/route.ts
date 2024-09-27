import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!.trim()
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(`Webhook Error: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
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

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
    },
  });
}

export const runtime = 'edge';
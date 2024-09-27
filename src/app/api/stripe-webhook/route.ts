import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
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

// This replaces the previous config export
export const runtime = 'edge';
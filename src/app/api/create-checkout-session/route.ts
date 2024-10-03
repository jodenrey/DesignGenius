// src/app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import Stripe from 'stripe';
import { ensureUserInDatabase } from "@/lib/userCheck"; // Import the user check

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect('/sign-in');
  }

  // Ensure the user exists in the database
  await ensureUserInDatabase(userId);

  // The rest of your create-checkout-session logic...
  const body = await req.json();
  const { credits } = body;

  const priceForCredits: { [key: number]: number } = {
    30: 49900, // ₱499.00 should be 49900 (in cents)
    100: 99900, // ₱99900.00 should be 99900 (in cents)
    200: 149900, // ₱149900.00 should be 149900 (in cents)
  };
  const price = priceForCredits[credits];

  if (!price) {
    return NextResponse.json({ error: 'Invalid credit package' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email!,
      line_items: [
        {
          price_data: {
            currency: 'php',
            product_data: {
              name: `${credits} Credits`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });
  
    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
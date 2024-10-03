import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const POST = async (req: Request) => {
  try {
    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userEmail = session.customer_email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Session does not have a customer email' }, { status: 400 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update credits based on product purchased
    let creditsToAdd = 0;
    if (session.amount_total === 499) creditsToAdd = 30;
    if (session.amount_total === 999) creditsToAdd = 100;
    if (session.amount_total === 1499) creditsToAdd = 200;

    await prisma.user.update({
      where: { email: userEmail },
      data: { credits: { increment: creditsToAdd } },
    });

    return NextResponse.json({ message: 'Credits updated successfully' }, { status: 200 });
  } catch (error) {
    // Handle error properly
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
};

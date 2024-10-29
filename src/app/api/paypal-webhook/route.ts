// src/app/api/paypal-webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  // Validate PayPal webhook signature (optional but recommended)
  // If you want to validate, you'll need to use the PayPal SDK's verification

  const { event_type, resource } = body;

  if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const { custom_id, amount } = resource;

    // Parse the custom_id to get the user ID
    const userId = custom_id;

    // Update the user's credits in the database based on the payment amount
    const credits = amount.value === "499.00" ? 30 : amount.value === "999.00" ? 100 : 200;

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: credits,
        },
      },
    });
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
}

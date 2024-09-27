import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

// Handle POST requests
export async function POST(req: Request) {
  const { userId } = auth();

  // Check if the user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find the user and check credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });   

  if (!user || user.credits < 1) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
  }

  // Deduct 1 credit
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

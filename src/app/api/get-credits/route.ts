import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { getAuth } from '@clerk/nextjs/server'; // Ensure correct import path
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) { // Change Request to NextRequest
  // Get the user authentication info
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch user data including credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }, // Only get credits
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

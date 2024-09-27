import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the path according to your setup

// API route to fetch user credits
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }, // Query the user by ID
      select: { credits: true }, // Only fetch the credits
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user); // Return user credits
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

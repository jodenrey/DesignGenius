import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the path according to your setup

export async function POST(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    const { amount } = await req.json(); // Get the amount to deduct

    try {
        // Deduct credits from the user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: {
                    decrement: amount, // Ensure this deducts the correct amount
                },
            },
            select: { credits: true }, // Return the updated credits
        });

        return NextResponse.json(updatedUser); // Return the updated user credits
    } catch (error) {
        console.error('Error deducting credits:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

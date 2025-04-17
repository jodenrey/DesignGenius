// app/api/describe/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import describeImage from '@/lib/FurnitureDescriber_OpenAi';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {

    const { userId } = await auth();

    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  const body = await req.json();
  const { base64Image, type, roomType } = body;

  if (!base64Image) {
    return NextResponse.json({ error: 'Image not provided' }, { status: 400 });
  }

  if (!roomType) {
    return NextResponse.json({ error: 'Room type not provided' }, { status: 400 });
  }

  
  try {
      const description = await describeImage(type, base64Image,roomType);
      
    if (!description) {
      return NextResponse.json({ error: 'Failed to generate image description' }, { status: 500 });
    }
    const jsonDes = JSON.parse(description);
    if (!jsonDes.description) {
      return NextResponse.json({ error: 'Failed to generate image description' }, { status: 500 });
    }

    return NextResponse.json({ description: jsonDes.description }, { status: 200 });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'Failed to generate image description.' }, { status: 500 });
  }
}

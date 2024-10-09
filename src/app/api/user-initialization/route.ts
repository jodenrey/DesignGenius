import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the body
    console.log("Incoming request body:", body); // Log request body for debugging

    const { userId, email } = body;

    // Check for missing fields
    if (!userId || !email) {
      return NextResponse.json({ message: "Missing userId or email" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist, create the user
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          email,
          credits: 5, // Default credits
        },
      });
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

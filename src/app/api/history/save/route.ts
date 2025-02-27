import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// This handles POST requests
export async function POST(req: Request) {
  const { userId } = await auth();
  const { imageUrl } = await req.json(); // Parse JSON body

  if (!userId || !imageUrl) {
    return new Response(JSON.stringify({ message: "Missing user ID or image URL" }), { status: 400 });
  }

  try {
    const historyEntry = await prisma.roomHistory.create({
      data: {
        userId,
        imageUrl,
      },
    });
    return new Response(JSON.stringify(historyEntry), { status: 200 });
  } catch (error) {
    console.error("Error saving history entry:", error);
    return new Response(JSON.stringify({ message: "Error saving history entry" }), { status: 500 });
  }
}

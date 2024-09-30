import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

// This handles GET requests
export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    // Fetch the user's history entries from the database
    const history = await prisma.roomHistory.findMany({
      where: { userId }, // Filter by userId
    });

    return new Response(JSON.stringify(history), { status: 200 });
  } catch (error) {
    console.error("Error fetching history:", error);
    return new Response(JSON.stringify({ message: "Error fetching history" }), { status: 500 });
  }
}

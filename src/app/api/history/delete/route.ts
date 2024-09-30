import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();
  const { imageId } = await req.json(); // Parse JSON body

  if (!userId || !imageId) {
    return new Response(JSON.stringify({ message: "Missing user ID or image ID" }), { status: 400 });
  }

  try {
    // Ensure the entry belongs to the user before deletion
    const historyEntry = await prisma.roomHistory.findUnique({
      where: { id: imageId },
    });

    if (!historyEntry || historyEntry.userId !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized or entry not found" }), { status: 404 });
    }

    await prisma.roomHistory.delete({
      where: { id: imageId },
    });

    return new Response(JSON.stringify({ message: "Entry deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting history entry:", error);
    return new Response(JSON.stringify({ message: "Error deleting history entry" }), { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();
  const { imageIds } = await req.json(); // Parse JSON body to get array of image IDs

  if (!userId || !Array.isArray(imageIds) || imageIds.length === 0) {
    return new Response(JSON.stringify({ message: "Missing user ID or image IDs" }), { status: 400 });
  }

  try {
    // Verify all images belong to the user
    const userImages = await prisma.roomHistory.findMany({
      where: {
        id: { in: imageIds },
        userId: userId,
      },
      select: { id: true },
    });

    // Extract valid image IDs that belong to the user
    const validImageIds = userImages.map(image => image.id);

    // If there are no valid IDs, return a 404
    if (validImageIds.length === 0) {
      return new Response(JSON.stringify({ message: "Unauthorized or entries not found" }), { status: 404 });
    }

    // Delete the images that match the IDs and belong to the user
    await prisma.roomHistory.deleteMany({
      where: { id: { in: validImageIds } },
    });

    return new Response(JSON.stringify({ message: "Entries deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting history entries:", error);
    return new Response(JSON.stringify({ message: "Error deleting history entries" }), { status: 500 });
  }
}

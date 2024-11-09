// src/lib/userCheck.ts
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export async function ensureUserInDatabase(userId: string) {
  const user = await currentUser();

  // Check if the user exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  // If user does not exist, create a new entry
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: userId,
        email: user?.emailAddresses[0]?.emailAddress || '',
        credits: 5, // Default credits for new users
      },
    });
  }
}

import { clerkMiddleware, clerkClient } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.next();
  }

  // Call clerkClient() to get the client instance
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user?.emailAddresses?.[0]?.emailAddress || null;

  if (!email) {
    console.warn("No email found for user:", userId);
    return NextResponse.next();
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-initialization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      email,
    }),
  });

  if (!res.ok) {
    console.error("Error registering user in middleware:", res.statusText);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/room"
  ],
};

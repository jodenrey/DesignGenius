import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  async afterAuth(auth, req) {
    // If no user is authenticated, just pass the request
    if (!auth.userId) {
      return NextResponse.next();
    }

    const email = auth.user?.emailAddresses[0]?.emailAddress || null;

    // If email is required, handle missing email case
    if (!email) {
      console.warn("No email found for user:", auth.userId);
      return NextResponse.next(); // Or handle it differently if required
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-initialization`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: auth.userId,
        email,
      }),
    });

    if (!res.ok) {
      console.error("Error registering user in middleware:", res.statusText);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)",'/room'],
};

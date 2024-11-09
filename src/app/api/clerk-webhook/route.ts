import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CLERK_SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET!;

async function getRawBody(req: Request): Promise<Buffer> {
  const readableStream = req.body;
  if (!readableStream) throw new Error("Request body is missing");

  const chunks: Uint8Array[] = [];
  const reader = readableStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const rawBody = await getRawBody(req);
  const signature = req.headers.get("clerk-signature") as string;

  const hmac = crypto.createHmac("sha256", CLERK_SIGNING_SECRET);
  hmac.update(rawBody);
  const expectedSignature = hmac.digest("hex");

  if (expectedSignature !== signature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody.toString());
  const { type, data } = event;

  if (type === "user.deleted") {
    const clerkUserId = data.id;

    try {
      await prisma.user.delete({
        where: { id: clerkUserId },
      });
      return new NextResponse("User and related data deleted successfully", { status: 200 });
    } catch (error) {
      console.error("Error deleting user data:", error);
      return new NextResponse("Error deleting user data", { status: 500 });
    }
  } else {
    return new NextResponse("Unhandled event type", { status: 400 });
  }
}

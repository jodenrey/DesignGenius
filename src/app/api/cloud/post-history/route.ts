import { NextResponse, NextRequest } from 'next/server';
import { s3, PutObjectCommand } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, userId } = body;

    if (!imageUrl || !userId) {
      return NextResponse.json({ error: 'Missing imageUrl or userId' }, { status: 400 });
    }

    // Download image from replicate URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const contentType = response.headers['content-type'] || 'image/jpeg';

    // Generate flat S3 key with user + timestamp
    const timestamp = new Date().toISOString();
    const uuid = uuidv4();
    const extension = path.extname(new URL(imageUrl).pathname) || '.jpg'; // get file extension
    const fileName = `${userId}_${timestamp}_${uuid}${extension}`;

    //Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3.send(command);

    const publicUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${fileName}`;

    return NextResponse.json({
      message: 'Uploaded successfully',
      key: fileName,
      url: publicUrl
    });
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


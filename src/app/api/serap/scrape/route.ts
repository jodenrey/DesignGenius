import { NextResponse } from 'next/server';
import axios from 'axios';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        
        // Check if the user is authenticated
        if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const body = await req.json();
        const { q } = body;

        if (!q) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
        }

        const data = JSON.stringify({ q, "location": "Philippines",
  "gl": "ph" });

        const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://google.serper.dev/shopping',
        headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_SERAP_API_KEY!,
            'Content-Type': 'application/json',
        },
        data: data,
        };

        const response = await axios.request(config);

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
    console.error('Serper API Error:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch data from Serper' }, { status: 500 });
  }
}

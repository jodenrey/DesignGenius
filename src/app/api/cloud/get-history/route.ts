import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) { 
    try {
     //USED TO POST IMAGE
      return NextResponse.json({ try: "gg"});
    } catch (error) {
      console.error('Error fetching credits:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
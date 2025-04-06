import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest

export async function GET(req: NextRequest) {
    try{
    return NextResponse.json({ try: "gg"});
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
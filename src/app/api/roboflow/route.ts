import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import imageFurnitureCropper from '@/lib/ImageFurnitureCropper';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { imageUrl, roomType } = body;

    if (!imageUrl || !roomType) {
      return NextResponse.json({ 
        error: `${!imageUrl ? 'Image URL' : 'Room type'} is required` 
      }, { status: 400 });
    }
    
    // Process the image through our furniture detection service
    const result = await imageFurnitureCropper(imageUrl, roomType);
    
    if (!result || result.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to process image or no furniture detected' 
      }, { status: 404 });
    }
    
    // Get the first result (should be the only one)
    const furniture = result[0];
    
    // Check if we have a valid response structure
    if (!furniture.image || !furniture.furnitures) {
      return NextResponse.json({ 
        error: 'Invalid response format from furniture detector' 
      }, { status: 500 });
    }
    
    // Format the response to be more usable by the frontend
    const response = {
      image: furniture.image,
      furnitures: furniture.furnitures.map((item: any) => ({
        type: item.type || 'unknown',
        confidence: item.confidence || 0,
        plot: item.plot || { x: 0, y: 0, width: 0, height: 0 },
        image: {
          type: "base64",
          value: item.image?.value || ''
        }
      }))
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Roboflow API Error:', error.message || error);
    return NextResponse.json({ 
      error: error.message || 'Failed to detect furniture in image' 
    }, { status: 500 });
  }
}
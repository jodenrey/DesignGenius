import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { imageUrl, theme, room } = await request.json();

  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version:
        "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
      input: {
        image: imageUrl,
        prompt: `A photo of a ${theme} ${room}, 4k photo, highly detailed, stylish furniture, intricate textures, sharp focus, realistic shadows, and photorealistic lighting`,
        n_prompt:
          "blurry, cartoonish, illustration, surreal, people, humans, distorted, lowres, bad anatomy, extra limbs, missing fingers, low quality, watermark, logo, text, abstract, overexposed, grainy, poorly framed, over-saturated, unnatural lighting, artificial elements, HDR",
      },
    }),
  });

  let jsonStartResponse = await startResponse.json();

  let endpointUrl = jsonStartResponse.urls.get;

  // GET request to get the status of the image restoration process & return the result when it's ready
  let restoredImage: string | null = null;
  let retries = 0;
  const maxRetries = 60; // 60 retries, 1 minute total

  while (!restoredImage && retries < maxRetries) {
    // Loop in 1s intervals until the alt text is ready or the max retries is reached
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });

    if (finalResponse.status === 504) {
      // Retry after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
      continue;
    }

    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      restoredImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }
  }

  if (!restoredImage) {
    return NextResponse.json("Failed to restore image");
  }

  return NextResponse.json(restoredImage);
}
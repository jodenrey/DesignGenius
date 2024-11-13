import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { imageUrl, theme, room } = await request.json();

  // Prepare AbortController for timeout management
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout for the POST request

  // Step 1: Start the image restoration process (POST request to Replicate)
  let startResponse;
  try {
    startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
      body: JSON.stringify({
        version:
          "922c7bb67b87ec32cbc2fd11b1d5f94f0ba4f5519c4dbd02856376444127cc60",
        input: {
          image: imageUrl,
          prompt: `A photo of a ${theme} ${room}, 4k photo, highly detailed, stylish furniture, intricate textures, sharp focus, realistic shadows, and photorealistic lighting`,
          n_prompt:
            "blurry, cartoonish, illustration, surreal, people, humans, distorted, lowres, bad anatomy, extra limbs, missing fingers, low quality, watermark, logo, text, abstract, overexposed, grainy, poorly framed, over-saturated, unnatural lighting, artificial elements, HDR",
        },
      }),
      signal: controller.signal, // Pass AbortController signal for timeout
    });

    if (!startResponse.ok) {
      throw new Error("Failed to start image restoration process.");
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("Request timed out");
      return NextResponse.json("Request timed out", { status: 504 });
    }
    console.error("Error fetching from Replicate:", err);
    return NextResponse.json("Failed to start the process", { status: 500 });
  }

  const jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;

  // Step 2: Poll the status of the image restoration process
  let restoredImage: string | null = null;
  let retries = 0;
  const maxRetries = 60; // Maximum retries (1 minute max)
  let retryDelay = 1000; // Start with 1 second delay for retries

  while (!restoredImage && retries < maxRetries) {
    console.log("Polling for result...");

    try {
      let finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
        signal: controller.signal, // Use the same AbortController to handle timeout
      });

      if (finalResponse.status === 504) {
        // Retry with exponential backoff if 504 occurs
        console.log(`Retrying after ${retryDelay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries++;
        retryDelay *= 2; // Double the delay for each retry
        continue;
      }

      if (!finalResponse.ok) {
        throw new Error("Failed to fetch image restoration status.");
      }

      let jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        restoredImage = jsonFinalResponse.output;
        break;
      } else if (jsonFinalResponse.status === "failed") {
        throw new Error("Image restoration failed.");
      } else {
        // Retry on any other status
        console.log(`Current status: ${jsonFinalResponse.status}. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries++;
        retryDelay *= 2; // Increase the delay for the next retry
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.error("Polling request timed out.");
        return NextResponse.json("Request timed out during polling", { status: 504 });
      }
      console.error("Error during polling:", err);
      break; // Exit the loop on other errors
    }
  }

  clearTimeout(timeoutId); // Clean up the timeout

  if (!restoredImage) {
    return NextResponse.json("Failed to restore image", { status: 500 });
  }

  return NextResponse.json(restoredImage);
}

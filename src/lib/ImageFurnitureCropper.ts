"use strict";

// Export a mutable variable so that it can be modified externally.
export let isTest = true;

export interface FileInfo {
  id: string;
  url: string;
  // add other fields as needed
}

export interface RoboflowResult {
  // Define the expected output structure
  processedImageUrl: string;
  data?: any;
}

/**
 * Main function that handles the image processing workflow.
 * @param image - The image file to process.
 * @returns Processed result from Roboflow.
 */
async function imageFurnitureCropper(image: string, roomType: string): Promise<any[]> {
  try {

    //Checks if Image and roomtype is given
    if (!image) throw new Error("There is no Image given...")
    
    if(!roomType) throw new Error("The Room type was not given...")
    
    //Initialize Needed Services
    if (isTest) console.log("Starting imageFurnitureCropper");    
    const isInitialized = await ImageCropper_init();
      
    if (!isInitialized) {
      const errorMsg =
        "Initialization failed. Please check your service status and credits.";
      if (isTest) console.log(errorMsg);
      throw new Error(errorMsg);
    }

    // Process the image with Roboflow API
    if (isTest) console.log("Processing image with Roboflow API...");
    const roboflowData = await roboflowProcessFurniture(image, roomType);
    if (isTest) console.log("Roboflow raw data:", roboflowData);

    const roboflow_output = roboflowData.outputs[0]

    // Format and return output data
    const result = roboflowOutput(
              roboflow_output.Furniture_Predictions,
      roboflow_output.Furniture_Images,
              image
    );
    
    if (isTest) console.log("Final formatted result:", result);
    return [result];

  } catch (error) {
    if (isTest) console.error("Error processing image:", error);
    throw error;
  }
}

/**
 * Initializes required services.
 * @returns A promise that resolves to true if initialization is successful.
 */
async function ImageCropper_init(): Promise<boolean> {
  try {
    //LOGIC HERE
    if (isTest) console.log("Initializing services...");
    const roboInitialized = await roboflowInit();

    if (!roboInitialized ) {//|| !storageInitialized
      if (isTest) console.log("Initialization failed for one or more services.");
      throw new Error("Components or services is  not available for now...")
    }
    if (isTest) console.log("All services initialized successfully.");
    return true;
  } catch (error) {
    if (isTest) console.error("Initialization error:", error);
    return false;
  }
}

function roboflowEndLink(roomType: string): string {
  const roboflowEndLink = "roomfurnituredetector";
  let formattedRoomType = "";

  switch (roomType.toLowerCase()) {
    case "living room":
      formattedRoomType = "living";
      break;
    case "bedroom":
      formattedRoomType = "bed";
      break;
    case "bathroom":
      formattedRoomType = "bath";
      break;
    case "kitchen":
      formattedRoomType = "kitchen";
      break;
    case "dining room":
      formattedRoomType = "dining";
      break;
    case "home office":
      formattedRoomType = "homeoffice";
      break;
    case "basement":
      formattedRoomType = "basement";
      break;
    case "outdoor patio":
      formattedRoomType = "outdoorpatio";
      break;
    default:
      formattedRoomType = roomType.toLowerCase().replace(/\s+/g, '');
      break;
  }

  return `${formattedRoomType}${roboflowEndLink}`;
}

/**
 * Validates that the Roboflow API is available.
 * @returns A promise that resolves to a boolean indicating success.
 */
async function roboflowInit(): Promise<boolean> {
  try {
    if (isTest) console.log("Validating Roboflow API...");
    // Simulate async check (replace with real API call)
    if(process.env.NEXT_PUBLIC_ROBOFLOW_SECRET_KEY && process.env.NEXT_PUBLIC_ROBOFLOW_IMAGECROPPER_URL){
      return true
    } else {
      return false
    }
  } catch (error) {
    if (isTest) console.error("Roboflow initialization error:", error);
    return false;
  }
}

/**
 * Processes the image using the Roboflow API.
 * @param imageURL - The URL of the image to process.
 * @returns A promise that resolves to the raw data from Roboflow.
 */
async function roboflowProcessFurniture(imageURL: string, roomType: string): Promise<any> {
  try {
    if (isTest) {console.log("Calling Roboflow API with image URL:", imageURL);}
    
    var Roboflow_URL = process.env.NEXT_PUBLIC_ROBOFLOW_IMAGECROPPER_URL || ''

    if(!Roboflow_URL) throw('Right Roboflow Configuration is missing...')
      
    var Concated_URL = `${Roboflow_URL}${roboflowEndLink(roomType)}`
    
      const response = await fetch(Concated_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            api_key: process.env.NEXT_PUBLIC_ROBOFLOW_SECRET_KEY,
            inputs: {
                "image": {"type": "url", "value": imageURL}
            }
        })
    });
    
  
    const result = response.json()
      console.log(result);
      
    return result;
  } catch (error) {
    if (isTest) console.error("Roboflow API error:", error);
    throw error;
  }
}

/**
 * Formats the output from the Roboflow API.
 * @param roboflowData - The raw data returned from Roboflow.
 * @returns A structured result.
 */
function roboflowOutput(
  Furniture_Predictions: { image: any[], predictions: any[] },
  furniture_images: string[],
  imageurl: string
): { image: any, furnitures: any[] } {
  if (isTest) console.log("Formatting Roboflow output...");

  const image = { url: imageurl, ...Furniture_Predictions.image };

  const updatedPredictions = Furniture_Predictions.predictions.map((prediction, index) => {
    const {
      class: type,
      confidence,
      x,
      y,
      width,
      height,
      parent_id,
      detection_id,
      class_id,
      ...rest
    } = prediction;

    return {
      ...rest,
      type,
      confidence: Math.round(confidence * 100),
      plot: { x, y, width, height },
      image: furniture_images[index]
    };
  });

  if (isTest) console.log("Updated Predictions:", JSON.stringify(updatedPredictions, null, 2));
  return { image, furnitures: updatedPredictions };
}


// Export the default function along with other helper functions as named exports.
export default imageFurnitureCropper;
export {
  ImageCropper_init,
  roboflowInit,
  roboflowProcessFurniture,
  roboflowOutput,
};

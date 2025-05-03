"use server";

import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = {
  secure_url: string;
  [key: string]: any;
};

// Helper function to upload to Cloudinary with async/await
const uploadToCloudinary = async (
  buffer: Buffer
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    // Creating a unique ID for the image using a timestamp and random string
    const uniqueId = `img_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    cloudinary.uploader
      .upload_stream(
        {
          folder: "ai_kids_book",
          public_id: uniqueId,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      )
      .end(buffer);
  });
};

export async function generateImageAi(imagePrompt: string): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "REPLICATE_API_TOKEN is not configured in environment variables"
    );
  }

  try {
    console.log("Starting image generation for prompt:", imagePrompt);

    // 1. Run the Flux 1.1 Pro model
    const result = await replicate.run("black-forest-labs/flux-1.1-pro", {
      input: {
        prompt: imagePrompt,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
        safety_tolerance: 2,
        prompt_upsampling: true,
      },
    });

    console.log("Replicate API response type:", typeof result);

    // 2. Extract the image URL from the result
    let imageUrl = "";

    if (typeof result === "string") {
      imageUrl = result;
    } else if (Array.isArray(result) && result.length > 0) {
      imageUrl = result[0];
    } else if (result && typeof result === "object") {
      // Handle different object types including URL objects
      if (result instanceof URL) {
        imageUrl = result.href;
      } else if ((result as any).href) {
        imageUrl = (result as any).href;
      } else if ((result as any).output) {
        imageUrl = (result as any).output;
      } else if (typeof (result as any).url === "function") {
        // Execute the URL function if it's a function
        try {
          const urlResult = (result as any).url();
          // Check if the result is a URL object or string
          if (urlResult instanceof URL) {
            imageUrl = urlResult.href;
          } else if (typeof urlResult === "string") {
            imageUrl = urlResult;
          } else {
            console.log("URL function returned non-URL result:", urlResult);
          }
        } catch (urlError) {
          console.error("Error executing URL function:", urlError);
        }
      } else if ((result as any).url) {
        imageUrl = (result as any).url;
      } else if (typeof (result as any).toString === "function") {
        const str = (result as any).toString();
        if (str.startsWith("http")) {
          imageUrl = str;
        }
      }
    }

    if (!imageUrl) {
      console.error("Failed to extract image URL from result:", result);
      throw new Error("Could not extract image URL from model output");
    }

    console.log("Extracted image URL:", imageUrl);

    // 3. Fetch the image data from the URL
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch generated image: ${response.status} ${response.statusText}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 4. Upload the image to Cloudinary
      const uploadResult = await uploadToCloudinary(buffer);

      // 5. Return the Cloudinary image URL
      const cloudinaryUrl = uploadResult.secure_url;
      console.log(
        "Successfully generated and uploaded image. Cloudinary URL:",
        cloudinaryUrl
      );
      return cloudinaryUrl;
    } catch (fetchError: unknown) {
      console.error("Error fetching or processing image:", fetchError);

      // If we have a direct image URL from Replicate that's a string and starts with http
      // we could try to return it directly without uploading to Cloudinary
      if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
        console.log("Returning direct Replicate URL as fallback:", imageUrl);
        return imageUrl;
      }

      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Unknown fetch error";

      throw new Error(`Could not process image URL: ${errorMessage}`);
    }
  } catch (err: unknown) {
    console.error("Error details:", err);

    if (err instanceof Error) {
      throw new Error(`Image generation failed: ${err.message}`);
    }
    throw new Error("An unknown error occurred during image generation");
  }
}

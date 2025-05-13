// app/actions.ts
"use server";

import { fal } from "@fal-ai/client";
import { z } from "zod";

// Define a schema for input validation (optional but good practice)
const imageGenerationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  image_size: z.string().optional().default("landscape_4_3"),
  num_inference_steps: z.coerce.number().int().min(1).max(100).optional().default(28),
  seed: z.coerce.number().int().optional(),
  guidance_scale: z.coerce.number().min(0).max(20).optional().default(3.5),
  num_images: z.coerce.number().int().min(1).max(4).optional().default(1), // Max 4 for fal.ai free tier sometimes
  enable_safety_checker: z.boolean().optional().default(true),
  output_format: z.enum(["jpeg", "png"]).optional().default("jpeg"),
});

export type ImageGenerationInput = z.infer<typeof imageGenerationSchema>;

interface FalImage {
  url: string;
  content_type: string;
  width: number;
  height: number;
}

interface FalResponseData {
  images: FalImage[];
  timings: { inference: number }; // Add timings as seen in log
  seed: number;
  has_nsfw_concepts: boolean[];
  prompt: string;
}
// Define the overall structure of the response from fal.subscribe
interface FalSubscribeResponse {
  data: FalResponseData;
  requestId: string;
  // Other potential top-level properties like status, etc.
}

// interface FalErrorResponse {
//   error: {
//     status: number;
//     title: string;
//     detail?: string;
//     errors?: any[];
//   };
// }


export async function generateImage(
  values: ImageGenerationInput
): Promise<{ data: FalResponseData | null; error: string | null; requestId?: string }> {
  try {
    const validatedValues = imageGenerationSchema.parse(values);

    // Ensure FAL_KEY is available
    if (!process.env.FAL_KEY) {
      console.error("FAL_KEY is not set in environment variables.");
      return { data: null, error: "Server configuration error: API key missing." };
    }

    // Configure fal client if not already configured globally
    // fal.config({
    //   credentials: process.env.FAL_KEY,
    // });
    // Note: @fal-ai/client reads FAL_KEY from env by default if on server.

    console.log("Submitting to Fal AI with input:", validatedValues);

    const result: FalSubscribeResponse = await fal.subscribe("fal-ai/flux-lora", {
      input: validatedValues,
      logs: true, // Enable server-side logging for debugging
      onQueueUpdate: (update) => {
        // This callback runs on the server during the process
        if (update.status === "IN_PROGRESS") {
          update.logs.forEach((log) => console.log(`[Fal AI Progress]: ${log.message}`));
        } else if (update.status === "COMPLETED") {
          console.log("[Fal AI Progress]: Generation completed.");
        }
      },
    }) as FalSubscribeResponse; // Explicitly cast the result

    console.log("Fal AI Result:", result);

    // The actual output structure might vary slightly based on fal.ai's response wrapper.
    // Adjust this based on the actual `result` object structure.
    // The schema indicates `images`, `seed`, `prompt`, `has_nsfw_concepts` are top-level in the output.
    // Now access the properties from the 'data' field
    if (result && result.data && result.data.images && Array.isArray(result.data.images)) {
      console.log("Fal AI Processed Result:", result.data);
      // Return the 'data' part and the top-level requestId
      return { data: result.data, error: null, requestId: result.requestId };
    }
    else if (result && (result as any).error) { // Use any to access potential error property not in FalSubscribeResponse
        const falError = (result as any).error;
        console.error("Fal AI API Error:", falError);
         // Adapt this based on the actual error structure you might receive
        return { data: null, error: `API Error: ${falError.message || JSON.stringify(falError)}`, requestId: result.requestId };
    }
    else {
      console.error("Unexpected Fal AI response structure:", result);
      return { data: null, error: "Unexpected response structure from image generation service.", requestId: result?.requestId };
    }

  } catch (e: any) {
    console.error("Error calling Fal AI API:", e);
    if (e instanceof z.ZodError) {
      return { data: null, error: `Invalid input: ${e.errors.map(err => err.message).join(', ')}` };
    }
     // Catch errors thrown by the fal client itself (e.g., network issues, invalid credentials)
    if (e.message && e.message.includes("Fal AI error")) {
       return { data: null, error: `Fal AI Client Error: ${e.message}` };
    }
    return { data: null, error: e.message || "An unknown error occurred during image generation." };
  }
}


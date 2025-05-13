import { NextRequest, NextResponse } from 'next/server';
import { fal} from '@fal-ai/client';

if (!process.env.FAL_KEY) {
  throw new Error("FAL_KEY environment variable not set.");
}

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, image_size, num_inference_steps, seed, loras, guidance_scale, num_images, output_format, enable_safety_checker } = body;

    console.log("Received request body:", body);

    const input: any = {
      prompt,
      image_size,
      num_inference_steps,
      guidance_scale,
      num_images,
      output_format,
      enable_safety_checker,
    };

    if (seed) {
      input.seed = parseInt(seed, 10);
    }
    if (loras && loras.length > 0) {
      input.loras = loras.map((lora: { path: string; scale: string | number }) => ({
        ...lora,
        scale: parseFloat(String(lora.scale)),
      }));
    }
    
    const result: any = await fal.subscribe("fal-ai/flux-lora", {
      input: input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log(log.message));
        }
      },
    });

    console.log("Fal.ai API result:", result); // This log is correct

    // ***** CORRECTED SUCCESS CHECK *****
    if (result && result.data && result.data.images && result.data.images.length > 0) {
      return NextResponse.json(result); // Send the whole result object which includes the 'data' wrapper
    } else {
      // Log the full result if it's not what we expect, to help debug
      console.error("Unexpected API response structure from Fal.ai:", result);
      return NextResponse.json({ error: "No image generated or unexpected API response from Fal.ai", details: result }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Error calling Fal.ai API or processing response:", error);
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
  }
}

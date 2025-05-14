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
    const { model_id, input } = body; // Expect model_id and the actual input object
    if (!model_id || typeof model_id !== 'string') {
        return NextResponse.json({ error: "model_id is required" }, { status: 400 });
    }
    if (!input || typeof input !== 'object') {
        return NextResponse.json({ error: "input payload is required" }, { status: 400 });
    }
    console.log(`Received request for model ${model_id} with input:`, input);
    
    const result: any = await fal.subscribe(model_id, { // Use the dynamic model_id
      input: input, // Pass the nested input object directly
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log(log.message));
        }
      },
    });
    console.log(`Fal.ai API result for ${model_id}:`, result);

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

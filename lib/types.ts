// lib/types.ts (or a similar shared types file)
export interface ApiImage {
  url: string;
  content_type: string;
  width: number;
  height: number;
}

export interface GenerationParameters {
  prompt: string;
  image_size: string | { width: number; height: number };
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  num_images?: number;
  output_format?: "jpeg" | "png";
  enable_safety_checker?: boolean;
  loras?: Array<{ path: string; scale: number }>;
  [key: string]: any;
}

export interface HistoryEntry {
  id: string; // Unique ID for the history item
  modelId: string; // e.g., "fal-ai/flux-lora"
  modelName: string; // e.g., "Flux LoRA"
  timestamp: number; // Date of generation
  image: ApiImage;
  parameters: GenerationParameters;
  isFavorite?: boolean; // Optional
}

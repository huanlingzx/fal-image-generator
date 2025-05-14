// app/(app)/models/models-data.ts
export interface ModelInfo {
    id: string; // Fal.ai model ID or unique identifier
    name: string;
    path: string; // Path to the model's page
    falId: string; // Actual Fal.ai identifier for API calls
    description?: string; // Short description for the card
    inputParamsCount: number; // Illustrative
    outputParamsCount: number; // Illustrative
    tags: string[]; // For filtering, e.g., ["flux", "image-generation", "pro"]
}
  
export const modelsData: ModelInfo[] = [
    {
        id: "flux-1-1-pro",
        name: "Flux 1.1 Pro",
        path: "/models/fal-ai-flux-pro", // Example path, create page later
        falId: "fal-ai/flux-pro", // Assuming this is the ID
        description: "Professional grade text-to-image generation.",
        inputParamsCount: 8,
        outputParamsCount: 3,
        tags: ["flux", "image-generation", "pro"],
    },
    {
        id: "flux-1-1-pro-ultra",
        name: "Flux 1.1 Pro Ultra",
        path: "/models/fal-ai-flux-pro-ultra", // Example path
        falId: "fal-ai/flux-pro-ultra", // Assuming this is the ID
        description: "Ultra high-quality image synthesis.",
        inputParamsCount: 9,
        outputParamsCount: 3,
        tags: ["flux", "image-generation", "pro", "ultra"],
    },
    {
        id: "flux-lora",
        name: "Flux LoRA",
        path: "/models/fal-ai-flux-lora", // This page already exists
        falId: "fal-ai/flux-lora",
        description: "Text-to-image with LoRA support for fine-tuning.",
        inputParamsCount: 10,
        outputParamsCount: 3, // Example: images, seed, prompt
        tags: ["flux", "image-generation", "lora"],
    },
    // Add more models here
];
  
// app/(app)/models/fal-ai-flux-lora/page.tsx
"use client";

import { useState, FormEvent } from "react"; // Keep useEffect if needed for other things
import { toast } from "sonner";

// Shared Components
import ModelPageLayout from "../_components/ModelPageLayout";
import SettingsPanel from "../_components/SettingsPanel";
import OutputPanel from "../_components/OutputPanel";
// Model Specific Settings Component
import TestModelSettings from "./TestModelSettings";


// API response types (consider moving to a shared types.ts file)
interface ApiImage {
  url: string;
  content_type: string;
  width: number;
  height: number;
}
interface FalApiResponseData {
  images: ApiImage[];
  seed: number;
  prompt: string;
  timings?: { inference: number };
  has_nsfw_concepts?: boolean[];
}
interface ApiResponse {
  data: FalApiResponseData;
  requestId: string;
}

// Constants (can also be moved or configured)
const FLUX_LORA_IMAGE_SIZE_OPTIONS = [
  { value: "square_hd", label: "1:1 HD", icon: "■" },
  { value: "square", label: "1:1", icon: "□" },
  { value: "portrait_4_3", label: "3:4", icon: "▯" },
  { value: "portrait_16_9", label: "9:16", icon: "▮" },
  { value: "landscape_4_3", label: "4:3", icon: "▭" },
  { value: "landscape_16_9", label: "16:9", icon: "▬" },
];

export default function FluxLoraPage() {
  // State for Flux LoRA Model
  const [prompt, setPrompt] = useState<string>(
    "Extreme close-up of a single tiger eye..." // Your default prompt
  );
  const [imageSize, setImageSize] = useState<string>("landscape_16_9");
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "png">("png");
  const [seed, setSeed] = useState<string>(() => String(Math.floor(Math.random() * 1000000)));
  const [numImages, setNumImages] = useState<number>(1);
  const [numInferenceSteps, setNumInferenceSteps] = useState<number>(28);
  const [guidanceScale, setGuidanceScale] = useState<number>(3.5);

  // State for API interaction and UI
  const [generatedImage, setGeneratedImage] = useState<ApiImage | null>(null);
  const [generatedSeed, setGeneratedSeed] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateNewSeed = () => {
    const newSeedVal = String(Math.floor(Math.random() * 100000000));
    setSeed(newSeedVal);
    toast.info(`New seed generated: ${newSeedVal}`);
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);
    setGeneratedSeed(null);

    const payload = {
      prompt,
      image_size: imageSize,
      num_inference_steps: numInferenceSteps,
      seed: seed ? parseInt(seed, 10) : undefined,
      guidance_scale: guidanceScale,
      num_images: numImages,
      output_format: outputFormat,
      enable_safety_checker: true,
      loras: loras.filter(lora => lora.path.trim() !== '').map(({ id, ...rest}) => rest),
    };

    try {
      const response = await fetch("/api/generate", { // Assuming API endpoint is generic
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model_id: "fal-ai/flux-lora", // Important: tell backend which model
            input: payload
        }),
      });

      const responseBody: ApiResponse = await response.json();

      if (!response.ok) {
        const errorMsg = (responseBody as any).error || `API Error: ${response.statusText}`;
        throw new Error(errorMsg);
      }
      
      if (responseBody.data && responseBody.data.images && responseBody.data.images.length > 0) {
        setGeneratedImage(responseBody.data.images[0]);
        if (responseBody.data.seed) {
            setGeneratedSeed(responseBody.data.seed);
        }
        toast.success("Image generated successfully!");
      } else {
        throw new Error("No image returned from API or unexpected response structure.");
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      toast.error(error.message || "Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Functions for "Save Settings" or "Load Defaults"
  const handleSaveSettings = () => {
    toast.info("Save settings functionality not implemented yet.");
    // Implement localStorage saving or API call
  };
  const handleLoadDefaults = () => {
    toast.info("Load default settings functionality not implemented yet.");
    // Implement resetting state to defaults
    setPrompt("Extreme close-up of a single tiger eye...");
    setImageSize("landscape_16_9");
    // ... reset other states
  };


  return (
    <ModelPageLayout
      title="Flux LoRA"
      description="Generate images using the Fal.ai Flux LoRA model"
      settingsNode={
        <SettingsPanel
          onSubmit={handleSubmit}
          isGenerating={isLoading}
          modelName="Flux LoRA"
          onSaveSettings={handleSaveSettings} // Pass optional handlers
          onLoadDefaults={handleLoadDefaults}
        >
          <TestModelSettings
            prompt={prompt} setPrompt={setPrompt}
            imageSize={imageSize} setImageSize={setImageSize} imageSizeOptions={FLUX_LORA_IMAGE_SIZE_OPTIONS}
            outputFormat={outputFormat} setOutputFormat={setOutputFormat}
            seed={seed} setSeed={setSeed} generateNewSeed={generateNewSeed}
            numImages={numImages} setNumImages={setNumImages}
            numInferenceSteps={numInferenceSteps} setNumInferenceSteps={setNumInferenceSteps}
            guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale}
          />
        </SettingsPanel>
      }
      outputNode={
        <OutputPanel
          isLoading={isLoading}
          generatedImage={generatedImage}
          promptText={prompt}
          generatedSeed={generatedSeed}
        />
      }
    />
  );
}

// app/(app)/models/fal-ai-flux-lora/page.tsx
"use client";

import { useState, FormEvent } from "react"; // Keep useEffect if needed for other things
import { toast } from "sonner";

// Shared Components
import ModelPageLayout from "../_components/ModelPageLayout";
import SettingsPanel from "../_components/SettingsPanel";
import OutputPanel, { GenerationParameters } from "../_components/OutputPanel";
// Model Specific Settings Component
import FluxLoraSettings from "./FluxLoraSettings";
// Types
import { LoraItemData } from "../_components/LoraItem"; // For LoRA state

import ImageDetailModal from "../_components/ImageDetailModal"; // Import the modal
import { HistoryEntry, ApiImage as GlobalApiImage } from "@/lib/types"; // Import types
// import { addHistoryEntry } from "@/lib/history"; // To save to history


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
// const FLUX_LORA_IMAGE_SIZE_OPTIONS = [
//   { value: "square_hd", label: "1:1 HD", icon: "■" },
//   { value: "square", label: "1:1", icon: "□" },
//   { value: "portrait_4_3", label: "3:4", icon: "▯" },
//   { value: "portrait_16_9", label: "9:16", icon: "▮" },
//   { value: "landscape_4_3", label: "4:3", icon: "▭" },
//   { value: "landscape_16_9", label: "16:9", icon: "▬" },
// ];

const FLUX_LORA_IMAGE_SIZE_OPTIONS = [
  {
    value: "square_hd",
    label: "1:1 HD", // 第一行：比例
    resolution: "1024x1024", // 第二行：分辨率
    icon: "□",
  },
  {
    value: "square",
    label: "1:1",
    resolution: "512x512",
    icon: "□",
  },
  {
    value: "portrait_4_3",
    label: "3:4",
    resolution: "768x1024",
    icon: "▯",
  },
  {
    value: "portrait_16_9",
    label: "9:16",
    resolution: "576x1024",
    icon: "▯",
  },
  {
    value: "landscape_4_3",
    label: "4:3",
    resolution: "1024x768",
    icon: "▭",
  },
  {
    value: "landscape_16_9",
    label: "16:9",
    resolution: "1024x576",
    icon: "▭",
  },
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
  const [loras, setLoras] = useState<LoraItemData[]>([]); // Use LoraItemData type

  // State for API interaction and UI
  const [generatedImage, setGeneratedImage] = useState<ApiImage | null>(null);
  // const [generatedSeed, setGeneratedSeed] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastGenerationParams, setLastGenerationParams] = useState<GenerationParameters | null>(null);

  // State for the image detail modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalImageDetails, setModalImageDetails] = useState<HistoryEntry | null>(null);

  // LoRA specific handlers (can be part of FluxLoraSettings if state is managed there,
  // or kept here if FluxLoraPage manages the 'loras' state directly)
  const handleAddLora = () => {
    setLoras((prevLoras) => [...prevLoras, { id: crypto.randomUUID(), path: "", scale: 1.0 }]);
  };
  const handleRemoveLora = (id: string) => {
    setLoras((prevLoras) => prevLoras.filter((lora) => lora.id !== id));
  };
  const handleLoraChange = (id: string, field: "path" | "scale", value: string | number) => {
    setLoras((prevLoras) =>
      prevLoras.map((lora) =>
        lora.id === id ? { ...lora, [field]: field === "scale" ? Number(value) : value } : lora
      )
    );
  };
  const generateNewSeed = () => {
    const newSeedVal = String(Math.floor(Math.random() * 100000000));
    setSeed(newSeedVal);
    toast.info(`New seed generated: ${newSeedVal}`);
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);
    // setGeneratedSeed(null);

    const currentSeed = seed ? parseInt(seed, 10) : Math.floor(Math.random() * 100000000);
    if (!seed) { // If seed was empty, update the input field with the generated one
        setSeed(String(currentSeed));
    }

    const payload = {
      prompt,
      image_size: imageSize,
      num_inference_steps: numInferenceSteps,
      seed: currentSeed,
      guidance_scale: guidanceScale,
      num_images: numImages,
      output_format: outputFormat,
      enable_safety_checker: false,
      loras: loras.filter(lora => lora.path.trim() !== '').map(({ id, ...rest}) => rest),
    };
    setLastGenerationParams(payload);

    try {
      // 1. Generate Image via Fal.ai (through your /api/generate)
      const response = await fetch("/api/generate", {
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
        const apiImage: GlobalApiImage = responseBody.data.images[0];
        setGeneratedImage(apiImage);
        
        const actualSeed = responseBody.data.seed || payload.seed;
        const finalParams = {...payload, seed: actualSeed};
        setLastGenerationParams(finalParams);
        if (String(actualSeed) !== seed) setSeed(String(actualSeed));

        // 2. Save to History via your new /api/history
        try {
            const historyPayload = {
                modelId: "fal-ai/flux-lora", // This should be dynamic
                modelName: "Flux LoRA", // This should be dynamic
                image: apiImage,
                parameters: finalParams,
            };
            const historyApiResponse = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(historyPayload),
            });
            if (!historyApiResponse.ok) {
                const historyError = await historyApiResponse.json();
                console.error("Failed to save to history:", historyError.error);
                toast.error("图像已生成，但保存历史记录失败。");
            } else {
                 toast.success("图像生成成功并已保存到历史记录！");
            }
        } catch (historySaveError: any) {
            console.error("Error saving to history:", historySaveError);
            toast.error("图像已生成，但保存历史记录时出错。");
        }
      } else {
        throw new Error("API 未返回图像或响应结构异常。");
      }
    } catch (error: any) {
      console.error("图片生成失败：", error);
      toast.error(error.message || "生成图片失败。");
    } finally {
      setIsLoading(false);
    }
  };


  const handleOutputImageClick = () => {
    if (generatedImage && lastGenerationParams) {
      // Construct a temporary HistoryEntry-like object for the modal
      const tempEntry: HistoryEntry = {
        id: `temp-${Date.now()}`, // Temporary ID
        modelId: "fal-ai/flux-lora",
        modelName: "Flux LoRA",
        timestamp: Date.now(),
        image: generatedImage,
        parameters: lastGenerationParams,
      };
      setModalImageDetails(tempEntry);
      setIsDetailModalOpen(true);
    }
  };

  // Optional: Functions for "Save Settings" or "Load Defaults"
  const handleSaveSettings = () => {
    toast.info("保存设置功能尚未实现。");
    // Implement localStorage saving or API call
  };
  const handleLoadDefaults = () => {
    toast.info("加载默认设置功能尚未实现。");
    // Implement resetting state to defaults
    setPrompt("Extreme close-up of a single tiger eye...");
    setImageSize("landscape_16_9");
    // ... reset other states
  };


  return (
    <>
    <ModelPageLayout
      title="Flux LoRA"
      description="使用 Fal.ai Flux LoRA 模型生成图像"
      settingsNode={
        <SettingsPanel
          onSubmit={handleSubmit}
          isGenerating={isLoading}
          modelName="Flux LoRA"
          onSaveSettings={handleSaveSettings} // Pass optional handlers
          onLoadDefaults={handleLoadDefaults}
        >
          <FluxLoraSettings
            prompt={prompt} setPrompt={setPrompt}
            imageSize={imageSize} setImageSize={setImageSize} imageSizeOptions={FLUX_LORA_IMAGE_SIZE_OPTIONS}
            outputFormat={outputFormat} setOutputFormat={setOutputFormat}
            seed={seed} setSeed={setSeed} generateNewSeed={generateNewSeed}
            numImages={numImages} setNumImages={setNumImages}
            numInferenceSteps={numInferenceSteps} setNumInferenceSteps={setNumInferenceSteps}
            guidanceScale={guidanceScale} setGuidanceScale={setGuidanceScale}
            loras={loras} setLoras={setLoras} // Pass setLoras if FluxLoraSettings directly manipulates it
            handleAddLora={handleAddLora}
            handleRemoveLora={handleRemoveLora}
            handleLoraChange={handleLoraChange}
          />
        </SettingsPanel>
      }
      outputNode={
        <OutputPanel
          isLoading={isLoading}
          generatedImage={generatedImage}
          generationParams={lastGenerationParams}
        />
      }
    />
      <ImageDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        historyEntry={modalImageDetails}
        // No delete/favorite actions needed for this temporary view from model page
      />
    </>
  );
}

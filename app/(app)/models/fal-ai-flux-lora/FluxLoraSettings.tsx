// app/(app)/models/fal-ai-flux-lora/FluxLoraSettings.tsx
"use client";

import PromptInput from "../_components/PromptInput";
import ImageSizeSelector from "../_components/ImageSizeSelector";
import NumberSliderInput from "../_components/NumberSliderInput";
import LoraControls from "../_components/LoraControls";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoraItemData } from "../_components/LoraItem"; // Import for type

// Props should match the state variables needed for Flux LoRA
interface FluxLoraSettingsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  imageSize: string;
  setImageSize: (value: string) => void;
  imageSizeOptions: Array<{ value: string; label: string; icon: string; resolution: string }>; // resolution is optional as per other usage
  outputFormat: "jpeg" | "png";
  setOutputFormat: (value: "jpeg" | "png") => void;
  seed: string;
  setSeed: (value: string) => void;
  generateNewSeed: () => void;
  numImages: number;
  setNumImages: (value: number) => void;
  numInferenceSteps: number;
  setNumInferenceSteps: (value: number) => void;
  guidanceScale: number;
  setGuidanceScale: (value: number) => void;
  loras: LoraItemData[];
  setLoras: React.Dispatch<React.SetStateAction<LoraItemData[]>>; // For direct manipulation if needed
  handleAddLora: () => void;
  handleRemoveLora: (id: string) => void;
  handleLoraChange: (id: string, field: "path" | "scale", value: string | number) => void;
  onEnhancePrompt: () => void;
  onStructurePrompt: () => void;
  isModifyingPrompt?: boolean;
}

export default function FluxLoraSettings({
  prompt, setPrompt,
  imageSize, setImageSize, imageSizeOptions,
  outputFormat, setOutputFormat,
  seed, setSeed, generateNewSeed,
  numImages, setNumImages,
  numInferenceSteps, setNumInferenceSteps,
  guidanceScale, setGuidanceScale,
  loras, handleAddLora, handleRemoveLora, handleLoraChange,
  onEnhancePrompt, onStructurePrompt, isModifyingPrompt,
}: FluxLoraSettingsProps) {
  return (
    <>
      <PromptInput
        value={prompt}
        onChange={setPrompt}
        onEnhancePrompt={onEnhancePrompt}
        onStructurePrompt={onStructurePrompt}
        isModifyingPrompt={isModifyingPrompt}
      />

      <ImageSizeSelector value={imageSize} onChange={setImageSize} options={imageSizeOptions} />

      <div className="space-y-2 mt-4">
        <Label htmlFor="outputFormat">输出格式</Label>
        <Select value={outputFormat} onValueChange={(value: "jpeg" | "png") => setOutputFormat(value)}>
          <SelectTrigger id="outputFormat" className="dark:bg-slate-700 dark:border-slate-600">
            <SelectValue placeholder="选择格式" />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
            <SelectItem value="png" className="dark:focus:bg-slate-700">PNG</SelectItem>
            <SelectItem value="jpeg" className="dark:focus:bg-slate-700">JPEG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="seed">随机种子</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="seed" type="text" value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="例如: 12345"
              className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
            />
            <Button type="button" variant="outline" size="icon" onClick={generateNewSeed} className="dark:border-slate-600 dark:hover:bg-slate-700">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numImages">图像数量</Label>
          <Input
            id="numImages" type="number" value={numImages} min={1} max={4}
            onChange={(e) => setNumImages(Math.max(1, parseInt(e.target.value) || 1))}
            className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 items-end">
        <NumberSliderInput
          id="numInferenceSteps"
          label="推理步数"
          value={numInferenceSteps}
          currentValueDisplay={String(numInferenceSteps)}
          onChange={setNumInferenceSteps}
          min={10} max={50} step={1}
        />
        <NumberSliderInput
          id="guidanceScale"
          label="引导强度"
          value={guidanceScale}
          currentValueDisplay={guidanceScale.toFixed(1)}
          onChange={setGuidanceScale}
          min={0} max={10} step={0.1}
        />
      </div>

      <LoraControls
        loras={loras}
        onAddLora={handleAddLora}
        onRemoveLora={handleRemoveLora}
        onLoraChange={handleLoraChange}
      />
    </>
  );
}

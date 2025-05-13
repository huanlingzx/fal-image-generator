// app/(app)/models/fal-ai-flux-lora/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, X, Save, Settings2, Wand2, ListTree } from "lucide-react";


// Types for LoRA and API response
interface LoraWeight {
  id: string;
  path: string;
  scale: number;
}

interface ApiImage {
  url: string;
  content_type: string;
  width: number;
  height: number;
}

// ***** UPDATED ApiResponse TYPE *****
interface FalApiResponseData {
  images: ApiImage[];
  seed: number;
  prompt: string;
  timings?: { inference: number }; // Optional based on your log
  has_nsfw_concepts?: boolean[]; // Optional based on your log
}

interface ApiResponse {
  data: FalApiResponseData; // Images are nested here
  requestId: string;
  // Potentially other top-level fields from the fal.subscribe result if needed
}


const imageSizeOptions = [
  { value: "square_hd", label: "1:1 HD", icon: "■" },
  { value: "square", label: "1:1", icon: "□" },
  { value: "portrait_4_3", label: "3:4", icon: "▯" },
  { value: "portrait_16_9", label: "9:16", icon: "▮" },
  { value: "landscape_4_3", label: "4:3", icon: "▭" },
  { value: "landscape_16_9", label: "16:9", icon: "▬" },
];

export default function FluxLoraPage() {
  const [prompt, setPrompt] = useState<string>(
    "Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture."
  );
  const [imageSize, setImageSize] = useState<string>("landscape_16_9");
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "png">("png");
  const [seed, setSeed] = useState<string>(() => String(Math.floor(Math.random() * 1000000)));
  const [numImages, setNumImages] = useState<number>(1);
  const [numInferenceSteps, setNumInferenceSteps] = useState<number>(28);
  const [guidanceScale, setGuidanceScale] = useState<number>(3.5);
  const [loras, setLoras] = useState<LoraWeight[]>([]);
  
  const [generatedImage, setGeneratedImage] = useState<ApiImage | null>(null);
  const [generatedSeed, setGeneratedSeed] = useState<number | null>(null); // To display seed from response
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddLora = () => {
    setLoras([...loras, { id: crypto.randomUUID(), path: "", scale: 1.0 }]);
  };

  const handleRemoveLora = (id: string) => {
    setLoras(loras.filter((lora) => lora.id !== id));
  };

  const handleLoraChange = (id: string, field: "path" | "scale", value: string | number) => {
    setLoras(
      loras.map((lora) =>
        lora.id === id ? { ...lora, [field]: field === "scale" ? Number(value) : value } : lora
      )
    );
  };

  const generateNewSeed = () => {
    const newSeed = String(Math.floor(Math.random() * 100000000));
    setSeed(newSeed);
    toast.info(`New seed generated: ${newSeed}`);
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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody: ApiResponse = await response.json(); // responseBody now matches the API response structure

      if (!response.ok) {
        // Access error from responseBody if available, otherwise use a generic message
        const errorMsg = (responseBody as any).error || `API Error: ${response.statusText}`;
        throw new Error(errorMsg);
      }
      
      // ***** CORRECTED DATA ACCESS *****
      if (responseBody.data && responseBody.data.images && responseBody.data.images.length > 0) {
        setGeneratedImage(responseBody.data.images[0]);
        if (responseBody.data.seed) {
            setGeneratedSeed(responseBody.data.seed); // Store the seed from response
            // Optionally update the input seed field if you want it to reflect the used seed
            // setSeed(String(responseBody.data.seed)); 
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

  return (
    <>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Flux LoRA</h1>
          <p className="text-muted-foreground dark:text-slate-400">使用 Flux LoRA 生成图像</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Panel: Settings */}
          <Card className="md:col-span-1 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>设置</CardTitle>
                <div className="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" className="dark:border-slate-600 dark:hover:bg-slate-700"><Save className="mr-2 h-4 w-4" />保存设置</Button>
                    <Button type="button" variant="outline" size="sm" className="dark:border-slate-600 dark:hover:bg-slate-700"><Settings2 className="mr-2 h-4 w-4" />默认设置</Button>
                </div>
              </div>
              <CardDescription className="dark:text-slate-400">为 Flux LoRA 配置您的图像生成</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">提示词</Label>
                  <div className="flex space-x-1 mb-1 flex-wrap gap-1"> {/* Added flex-wrap and gap-1 for better wrapping */}
                    
                    {/* <p className="text-muted-foreground dark:text-slate-400">提示词请使用</p>
                    <Button type="button" variant="outline" size="sm" className="bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-700/30 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-600/40">英文</Button>
                    <Button type="button" variant="outline" size="sm" className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-600/40">标签化</Button>
                    <p className="text-muted-foreground dark:text-slate-400">形式</p> */}

                    {/* <p className="dark:text-slate-400">提示词请使用`英文``标签化`形式</p> */}
                    
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-red-400">提示词请使用</span>
                        <span className="px-3 py-1 bg-pink-400 rounded-full text-black">英文</span>
                        <span className="px-3 py-1 bg-pink-400 rounded-full text-black">标签化</span>
                        <span className="text-red-400">形式</span>
                    </div>

                    <div className="flex-grow hidden sm:block"></div> {/* Hide on small screens to allow wrapping */}
                    <Button type="button" variant="outline" size="sm" className="dark:hover:bg-slate-700"><Wand2 className="mr-1 h-3 w-3"/>提示词增强</Button>
                    <Button type="button" variant="outline" size="sm" className="dark:hover:bg-slate-700"><ListTree className="mr-1 h-3 w-3"/>标签结构化</Button>
                  </div>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="高清写实照片, 自然光线, 精细的细节, 专业摄影"
                    rows={5}
                    required
                    className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
                  />
                </div>

                {/* Image Size */}
                <div className="space-y-2 mt-4">
                  <Label>图片尺寸</Label>
                  <ToggleGroup
                    type="single"
                    value={imageSize}
                    onValueChange={(value) => { if (value) setImageSize(value); }}
                    className="grid grid-cols-3 sm:grid-cols-6 gap-2"
                  >
                    {imageSizeOptions.map(opt => (
                      <ToggleGroupItem 
                        key={opt.value} 
                        value={opt.value} 
                        aria-label={opt.label} 
                        className="flex flex-col h-auto p-2 border dark:border-slate-600 dark:data-[state=on]:bg-sky-500 dark:data-[state=on]:text-white dark:hover:bg-slate-700"
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-xs mt-1">{opt.label}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                {/* Output Format */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="outputFormat">输出格式</Label>
                  <Select value={outputFormat} onValueChange={(value: "jpeg" | "png") => setOutputFormat(value)}>
                    <SelectTrigger id="outputFormat" className="dark:bg-slate-700 dark:border-slate-600">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="png" className="dark:focus:bg-slate-700">PNG</SelectItem>
                      <SelectItem value="jpeg" className="dark:focus:bg-slate-700">JPEG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Seed & Num Images */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="seed">随机种子</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="seed"
                        type="text" // Changed to text to avoid number input issues, validation happens on submit
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="e.g., 12345"
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
                      id="numImages"
                      type="number"
                      value={numImages}
                      min={1}
                      max={4} 
                      onChange={(e) => setNumImages(Math.max(1, parseInt(e.target.value) || 1))}
                      className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Inference Steps & Guidance Scale */}
                <div className="grid grid-cols-2 gap-4 mt-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="numInferenceSteps">推理步数: {numInferenceSteps}</Label>
                        <Slider
                        id="numInferenceSteps"
                        min={10}
                        max={50}
                        step={1}
                        value={[numInferenceSteps]}
                        onValueChange={(value) => setNumInferenceSteps(value[0])}
                        className="[&>span:first-child]:bg-primary dark:[&>span:first-child]:bg-sky-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="guidanceScale">引导强度: {guidanceScale.toFixed(1)}</Label>
                        <Slider
                        id="guidanceScale"
                        min={0}
                        max={10}
                        step={0.1}
                        value={[guidanceScale]}
                        onValueChange={(value) => setGuidanceScale(value[0])}
                        className="[&>span:first-child]:bg-primary dark:[&>span:first-child]:bg-sky-500"
                        />
                    </div>
                </div>


                {/* LoRAs */}
                <div className="space-y-4 mt-6">
                  <Label>LoRA 权重</Label>
                  {loras.map((lora, index) => (
                    <Card key={lora.id} className="p-3 dark:bg-slate-700/50 dark:border-slate-600">
                      <div className="space-y-2">
                        <Label htmlFor={`lora-path-${index}`}>LoRA path or URL</Label>
                        <Input
                          id={`lora-path-${index}`}
                          value={lora.path}
                          onChange={(e) => handleLoraChange(lora.id, "path", e.target.value)}
                          placeholder="https://.../lora.safetensors or path/to/lora"
                          className="dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400"
                        />
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`lora-scale-${index}`} className="whitespace-nowrap">比例: {lora.scale.toFixed(1)}</Label>
                          <Slider
                            id={`lora-scale-${index}`}
                            min={-1}
                            max={2}
                            step={0.1}
                            value={[lora.scale]}
                            onValueChange={(value) => handleLoraChange(lora.id, "scale", value[0])}
                            className="flex-grow [&>span:first-child]:bg-primary dark:[&>span:first-child]:bg-sky-500"
                          />
                          <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveLora(lora.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddLora} className="w-full dark:border-slate-600 dark:hover:bg-slate-700">
                    添加 LoRA
                  </Button>
                </div>

                <Separator className="my-6 dark:bg-slate-700" />

                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white">
                  {isLoading ? "生成中..." : "生成图像"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Panel: Output */}
          <Card className="md:col-span-2 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle>生成的图像</CardTitle>
              <CardDescription className="dark:text-slate-400">
                您的AI生成的艺术作品将显示在这里. 
                {generatedSeed && ` (种子: ${generatedSeed})`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[500px] lg:h-[600px] border border-dashed rounded-md bg-muted/40 dark:border-slate-700 dark:bg-slate-800/40">
              {isLoading ? (
                <div className="space-y-4 text-center">
                  <Skeleton className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <p className="text-muted-foreground dark:text-slate-400">正在努力生成中，请稍候...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full">
                 <Image
                    src={generatedImage.url}
                    alt={prompt} // It's good practice to use the actual prompt from response if it can differ
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                    unoptimized 
                  />
                </div>
              ) : (
                <p className="text-muted-foreground dark:text-slate-400">尚未生成图像</p>
              )}
            </CardContent>
          </Card>
        </div>
    </>
  );
}

// app/(app)/models/_components/OutputPanel.tsx
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// Assuming ApiImage type is defined elsewhere (e.g., a shared types file or passed as prop)
interface ApiImage {
  url: string;
  content_type: string;
  width: number;
  height: number;
}

// Define a type for the parameters you want to display
// This should mirror the 'payload' sent to the API
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
  [key: string]: any; // Allow other parameters
}

interface OutputPanelProps {
  isLoading: boolean;
  generatedImage: ApiImage | null;
  // promptText?: string; // The prompt used for alt text
  // generatedSeed?: number | null;
  generationParams: GenerationParameters | null; // Pass all input params
}

export default function OutputPanel({
  isLoading,
  generatedImage,
  // promptText = "生成的 AI 图片",
  // generatedSeed,
  generationParams,
}: OutputPanelProps) {

  const renderParameters = () => {
    if (!generationParams) return null;
    // Filter out undefined or null parameters for cleaner display if desired
    const paramsToDisplay = Object.entries(generationParams).filter(
      ([, value]) => value !== undefined && value !== null
    );
    if (paramsToDisplay.length === 0) return null;
    return (
      <ScrollArea className="h-[150px] w-full mt-4 p-3 border rounded-md dark:border-slate-700">
        <h4 className="mb-2 text-sm font-medium leading-none">生成参数:</h4>
        <dl className="text-xs space-y-1 text-muted-foreground dark:text-slate-400">
          {paramsToDisplay.map(([key, value]) => {
            let displayValue = "";
            if (typeof value === "object" && value !== null) {
              if (key === "loras" && Array.isArray(value)) {
                displayValue = value.length > 0
                  ? value.map(l => `${l.path} (scale: ${l.scale})`).join(", ")
                  : "无";
              } else {
                displayValue = JSON.stringify(value);
              }
            } else {
              displayValue = String(value);
            }
            // Simple key formatting
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={key} className="flex">
                <dt className="font-semibold w-1/3 truncate pr-1">{formattedKey}:</dt>
                <dd className="w-2/3 break-all">{displayValue}</dd>
              </div>
            );
          })}
        </dl>
      </ScrollArea>
    );
  };

  return (
    <Card className="md:col-span-2 dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle>生成的图像</CardTitle>
        <CardDescription className="dark:text-slate-400">
          您的AI生成的作品将显示在这里。
          {generationParams?.seed && ` (种子: ${generationParams.seed})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[500px] lg:h-[600px] border border-dashed rounded-md bg-muted/40 dark:border-slate-700 dark:bg-slate-800/40">
        {isLoading ? (
          <div className="space-y-4 text-center">
            <Skeleton className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-lg bg-slate-200 dark:bg-slate-700" />
            <p className="text-muted-foreground dark:text-slate-400">
              正在努力生成中，请稍候...
            </p>
          </div>
        ) : generatedImage ? (
          <div className="relative w-full h-full">
            <Image
              src={generatedImage.url}
              alt={generationParams?.prompt || "AI 生成的图像"}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md"
              unoptimized
            />
          </div>
        ) : (
          <p className="text-muted-foreground dark:text-slate-400">
            尚未生成图像
          </p>
        )}
      </CardContent>
      {/* Render parameters below the image area if an image is generated or was attempted */}
      {(generatedImage || (isLoading && generationParams)) && (
        <div className="p-4">
            {renderParameters()}
        </div>
      )}
    </Card>
  );
}

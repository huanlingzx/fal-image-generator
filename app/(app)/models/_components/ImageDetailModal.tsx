// app/(app)/_components/ImageDetailModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryEntry } from "@/lib/types"; // Adjust path if necessary
import { Download, Copy, Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  historyEntry: HistoryEntry | null; // Or a simpler object if not directly from history

  // props for navigation
  allEntries: HistoryEntry[]; // The full list of entries the modal can navigate through
  currentIndex: number;       // The index of historyEntry within allEntries
  onNavigate: (newIndex: number) => void; // Callback to tell parent to change the displayed entry

  onDelete?: (id: string) => void; // Optional delete action
  onToggleFavorite?: (id: string, isFavorite: boolean) => void; // Optional favorite action
}

const ParameterItem: React.FC<{ label: string; value: any }> = ({ label, value }) => {
  let displayValue = "";
  if (typeof value === "object" && value !== null) {
    if (label.toLowerCase().includes("loras") && Array.isArray(value)) {
      displayValue = value.length > 0
        ? value.map(l => `${l.path} (scale: ${l.scale})`).join("; ")
        : "无";
    } else {
      displayValue = JSON.stringify(value);
    }
  } else {
    displayValue = String(value);
  }
  const formattedLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div className="flex text-sm py-1 border-b border-border/30 dark:border-slate-700/50">
      <dt className="font-medium w-1/3 text-muted-foreground dark:text-slate-400 pr-2">{formattedLabel}:</dt>
      <dd className="w-2/3 break-words">{displayValue}</dd>
    </div>
  );
};


export default function ImageDetailModal({
  isOpen,
  onOpenChange,
  historyEntry,
  allEntries,
  currentIndex,
  onNavigate,
  onDelete,
  onToggleFavorite,
}: ImageDetailModalProps) {
  if (!historyEntry) return null;

  const { image, parameters, modelName, timestamp, id, isFavorite } = historyEntry;

  const handleDownload = () => {
    if (image.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.target = '_blank'; // 在新标签页打开
      link.download = `generated_image_${id}.${image.content_type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("图片已开始下载！");
    }
  };

  const handleCopyPrompt = () => {
    if (parameters.prompt) {
      navigator.clipboard.writeText(parameters.prompt);
      toast.success("提示词已复制！");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < allEntries.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const canNavigatePrevious = currentIndex > 0;
  const canNavigateNext = currentIndex < allEntries.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 dark:bg-slate-850 dark:border-slate-700">
        <DialogHeader className="p-4 border-b dark:border-slate-700">
          <DialogTitle className="text-lg">图像详情 - {modelName}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            生成于: {new Date(timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {/* <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden"> */}
        <div className="flex-grow flex flex-col gap-4 overflow-hidden p-4">
          {/* Image Area */}
          {/* <div className="md:col-span-2 bg-muted/30 dark:bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative"> */}
          <div className="bg-muted/30 dark:bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative h-2/3">
            {image.url ? (
              <Image
                src={image.url}
                alt={parameters.prompt || "生成的图像"}
                fill
                style={{ objectFit: "contain" }}
                className="rounded"
                unoptimized
              />
            ) : (
              <p>无法加载图像</p>
            )}
          </div>

          {/* Details Area */}
          {/* <div className="md:col-span-1 flex flex-col p-4 border-l dark:border-slate-700 overflow-y-auto"> */}
          <div className="flex flex-col p-0 overflow-y-auto h-1/3">
            <h3 className="text-md font-semibold mb-2">生成参数</h3>
            <ScrollArea className="flex-grow pr-2 text-sm mb-4"> {/* Added pr-2 for scrollbar space */}
              <dl className="space-y-1">
                {Object.entries(parameters).map(([key, value]) => (
                    value !== undefined && value !== null && <ParameterItem key={key} label={key} value={value} />
                ))}
              </dl>
            </ScrollArea>

            {/* <div className="mt-auto space-y-2 pt-4 border-t dark:border-slate-700">
                <Button variant="outline" size="sm" className="w-full justify-start dark:hover:bg-slate-700" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" /> 下载图像
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start dark:hover:bg-slate-700" onClick={handleCopyPrompt}>
                    <Copy className="mr-2 h-4 w-4" /> 复制提示词
                </Button>
                 {onToggleFavorite && (
                    <Button variant={isFavorite ? "default" : "outline"} size="sm" className="w-full justify-start dark:hover:bg-slate-700" onClick={() => onToggleFavorite(id, !isFavorite)}>
                        {isFavorite ? <Star className="mr-2 h-4 w-4 fill-current" /> : <Star className="mr-2 h-4 w-4" />}
                        {isFavorite ? "取消收藏" : "收藏"}
                    </Button>
                )}
                {onDelete && (
                    <Button variant="destructive" size="sm" className="w-full justify-start" onClick={() => onDelete(id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> 删除记录
                    </Button>
                )}
            </div> */}
          </div>
        </div>
        <DialogFooter className="p-4 border-t dark:border-slate-700 flex justify-between items-center gap-2">

          {/* Navigation and Action Buttons Group (Will wrap) */}
          <div className="flex flex-wrap gap-2 mr-auto"> {/* Added flex-wrap, gap-2, and mr-auto */}
            {/* Navigation Buttons */}
            {allEntries.length > 1 && ( // Only show nav buttons if there's more than one image
                <>
                <Button variant="outline" size="sm" className="dark:hover:bg-slate-700" onClick={handlePrevious} disabled={!canNavigatePrevious}>
                    <ChevronLeft className="mr-1 h-4 w-4" /> 上一张
                </Button>
                <Button variant="outline" size="sm" className="dark:hover:bg-slate-700" onClick={handleNext} disabled={!canNavigateNext}>
                    下一张 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <div className="h-6 border-l border-muted-foreground/50 dark:border-slate-600 mx-1 sm:mx-2"></div> {/* Separator */}
                </>
            )}

            {/* Action Buttons */}
            <Button variant="outline" size="sm" className="dark:hover:bg-slate-700" onClick={handleDownload}> {/* Removed w-full and justify-start */}
                <Download className="mr-2 h-4 w-4" /> 下载图像
            </Button>
            <Button variant="outline" size="sm" className="dark:hover:bg-slate-700" onClick={handleCopyPrompt}> {/* Removed w-full and justify-start */}
                <Copy className="mr-2 h-4 w-4" /> 复制提示词
            </Button>
            {onToggleFavorite && (
                <Button variant={isFavorite ? "default" : "outline"} size="sm" className="dark:hover:bg-slate-700" onClick={() => onToggleFavorite(id, !isFavorite)}> {/* Removed w-full and justify-start */}
                    {isFavorite ? <Star className="mr-2 h-4 w-4 fill-current" /> : <Star className="mr-2 h-4 w-4" />}
                    {isFavorite ? "取消收藏" : "收藏"}
                </Button>
            )}
            {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(id)}> {/* Removed w-full and justify-start */}
                    <Trash2 className="mr-2 h-4 w-4" /> 删除记录
                </Button>
            )}
          </div>

          {/* Close Button (Always at the end) */}
            <DialogClose asChild>
                <Button variant="outline" className="dark:hover:bg-slate-700">关闭</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Add toast import if not globally available
import { toast } from "sonner";

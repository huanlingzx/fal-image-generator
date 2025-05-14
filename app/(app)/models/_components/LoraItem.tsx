 // app/(app)/models/_components/LoraItem.tsx
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Slider } from "@/components/ui/slider";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { X } from "lucide-react";

 export interface LoraItemData { // Export this if LoraControls needs it
     id: string;
     path: string;
     scale: number;
 }

 interface LoraItemProps {
     lora: LoraItemData;
     onChange: (id: string, field: "path" | "scale", value: string | number) => void;
     onRemove: (id: string) => void;
 }

 export default function LoraItem({ lora, onChange, onRemove }: LoraItemProps) {
     return (
         <Card className="p-3 dark:bg-slate-700/50 dark:border-slate-600">
             <div className="space-y-2">
                 <Label htmlFor={`lora-path-${lora.id}`}>LoRA path or URL</Label>
                 <Input
                     id={`lora-path-${lora.id}`}
                     value={lora.path}
                     onChange={(e) => onChange(lora.id, "path", e.target.value)}
                     placeholder="https://.../lora.safetensors or path/to/lora"
                     className="dark:bg-slate-600 dark:border-slate-500 dark:placeholder-slate-400"
                 />
                 <div className="flex items-center space-x-2">
                     <Label htmlFor={`lora-scale-${lora.id}`} className="whitespace-nowrap">
                        比例: {lora.scale.toFixed(1)}
                     </Label>
                     <Slider
                         id={`lora-scale-${lora.id}`}
                         min={-1}
                         max={2}
                         step={0.1}
                         value={[lora.scale]}
                         onValueChange={(value) => onChange(lora.id, "scale", value[0])}
                         className="flex-grow [&>span:first-child]:bg-primary dark:[&>span:first-child]:bg-sky-500"
                     />
                     <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(lora.id)}>
                         <X className="h-4 w-4" />
                     </Button>
                 </div>
             </div>
         </Card>
     );
 }

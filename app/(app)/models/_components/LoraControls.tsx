// app/(app)/models/_components/LoraControls.tsx
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoraItem, { LoraItemData } from "./LoraItem"; // Import LoraItemData

interface LoraControlsProps {
  loras: LoraItemData[]; // Use the exported type
  onAddLora: () => void;
  onRemoveLora: (id: string) => void;
  onLoraChange: (id: string, field: "path" | "scale", value: string | number) => void;
}

export default function LoraControls({
  loras,
  onAddLora,
  onRemoveLora,
  onLoraChange,
}: LoraControlsProps) {
  return (
    <div className="space-y-4 mt-6">
      <Label>LoRA 权重</Label>
      {loras.map((lora) => (
        <LoraItem
          key={lora.id}
          lora={lora}
          onChange={onLoraChange}
          onRemove={onRemoveLora}
        />
      ))}
      <Button type="button" variant="outline" onClick={onAddLora} className="w-full dark:border-slate-600 dark:hover:bg-slate-700">
        添加 LoRA
      </Button>
    </div>
  );
}

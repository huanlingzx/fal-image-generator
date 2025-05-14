// app/(app)/models/_components/ImageSizeSelector.tsx
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ImageSizeOption {
  value: string;
  label: string;
  icon: string; // Or ReactNode for more complex icons
  // icon: React.ReactNode; // 新的类型，可以包含任何 React 节点 (包括组件)
  resolution: string;
}

interface ImageSizeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: ImageSizeOption[];
}

export default function ImageSizeSelector({ value, onChange, options }: ImageSizeSelectorProps) {
  return (
    <div className="space-y-2 mt-4">
      <Label>图片尺寸</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => { if (val) onChange(val); }}
        className="grid grid-cols-3 sm:grid-cols-6 gap-2"
      >
        {options.map(opt => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            aria-label={opt.label}
            className="flex flex-col h-auto p-2 border
                      border-gray-200 hover:bg-gray-300 data-[state=on]:bg-gray-500 data-[state=on]:text-white
                      dark:border-slate-600 dark:data-[state=on]:bg-sky-500 dark:data-[state=on]:text-white dark:hover:bg-slate-700"
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="text-xs mt-1">{opt.label}</span>
            <span className="text-xs mt-1">{opt.resolution}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

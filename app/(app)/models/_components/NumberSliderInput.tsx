// app/(app)/models/_components/NumberSliderInput.tsx
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface NumberSliderInputProps {
  id: string;
  label: string;
  value: number;
  currentValueDisplay?: string; // For "Steps: 28"
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function NumberSliderInput({
  id,
  label,
  value,
  currentValueDisplay,
  onChange,
  min,
  max,
  step,
}: NumberSliderInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}: {currentValueDisplay !== undefined ? currentValueDisplay : value}</Label>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        className="[&>span:first-child]:bg-primary dark:[&>span:first-child]:bg-sky-500"
      />
    </div>
  );
}

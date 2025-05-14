// app/(app)/models/_components/PromptInput.tsx
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, ListTree } from "lucide-react"; // Assuming you have these icons

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  // You can add props for the helper buttons if they have functionality
}

export default function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">提示词</Label>
      <div className="flex space-x-1 mb-1 flex-wrap gap-1">
        <Button type="button" variant="outline" size="sm" className="bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200 dark:bg-pink-700/30 dark:text-pink-300 dark:border-pink-600 dark:hover:bg-pink-600/40">英文</Button>
        <Button type="button" variant="outline" size="sm" className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-600/40">标签化</Button>
        {/* Add more helper buttons if needed */}
        <div className="flex-grow hidden sm:block"></div>
        <Button type="button" variant="outline" size="sm" className="dark:hover:bg-slate-700"><Wand2 className="mr-1 h-3 w-3"/>提示词增强</Button>
        <Button type="button" variant="outline" size="sm" className="dark:hover:bg-slate-700"><ListTree className="mr-1 h-3 w-3"/>标签结构化</Button>
      </div>
      <Textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ultra realistic photo, natural light, fine details..."
        rows={5}
        required
        className="dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
      />
    </div>
  );
}

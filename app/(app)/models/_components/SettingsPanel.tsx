// app/(app)/models/_components/SettingsPanel.tsx
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Settings2 } from "lucide-react";

interface SettingsPanelProps {
  children: ReactNode; // Form elements will go here
  onSaveSettings?: () => void; // Optional: if you implement saving
  onLoadDefaults?: () => void; // Optional: if you implement defaults
  onSubmit: (event: React.FormEvent) => void;
  isGenerating: boolean;
  generateButtonText?: string;
  modelName?: string; // To customize description
}

export default function SettingsPanel({
  children,
  onSaveSettings,
  onLoadDefaults,
  onSubmit,
  isGenerating,
  generateButtonText = "生成图像",
  modelName = "flux"
}: SettingsPanelProps) {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>设置</CardTitle>
          {(onSaveSettings || onLoadDefaults) && (
            <div className="flex space-x-2">
              {onSaveSettings && (
                <Button type="button" variant="outline" size="sm" onClick={onSaveSettings} className="dark:border-slate-600 dark:hover:bg-slate-700">
                  <Save className="mr-2 h-4 w-4" />保存设置
                </Button>
              )}
              {onLoadDefaults && (
                <Button type="button" variant="outline" size="sm" onClick={onLoadDefaults} className="dark:border-slate-600 dark:hover:bg-slate-700">
                  <Settings2 className="mr-2 h-4 w-4" />默认设置
                </Button>
              )}
            </div>
          )}
        </div>
        <CardDescription className="dark:text-slate-400">
          为 {modelName} 配置您的图像生成。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit}>
          {children} {/* Model-specific form fields go here */}
          <Separator className="my-6 dark:bg-slate-700" />
          <Button type="submit" disabled={isGenerating} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white">
            {isGenerating ? "生成中..." : generateButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

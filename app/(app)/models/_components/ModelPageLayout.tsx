// app/(app)/models/_components/ModelPageLayout.tsx
// import { Card } from "@/components/ui/card";

interface ModelPageLayoutProps {
  title: string;
  description: string;
  settingsNode: React.ReactNode; // Slot for the settings panel
  outputNode: React.ReactNode;   // Slot for the output panel
}

export default function ModelPageLayout({
  title,
  description,
  settingsNode,
  outputNode,
}: ModelPageLayoutProps) {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Panel: Settings */}
        <div className="md:col-span-1">{settingsNode}</div>

        {/* Right Panel: Output */}
        <div className="md:col-span-2">{outputNode}</div>
      </div>
    </>
  );
}

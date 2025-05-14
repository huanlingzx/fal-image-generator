// app/(app)/models/_components/ModelCard.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelInfo } from "../models-data"; // Import the interface

interface ModelCardProps {
  model: ModelInfo;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={model.path} className="block hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="flex flex-col h-full dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg hover:border-primary/50 dark:hover:border-sky-500/50 transition-all duration-200 ease-in-out cursor-pointer">
        <CardHeader>
          <CardTitle>{model.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground dark:text-slate-500 pt-1">
            {model.falId}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            {model.description || "高质量模型，用于各种AI任务。"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 mt-auto">
          <div className="text-xs text-muted-foreground dark:text-slate-500">
            {model.inputParamsCount} 输入参数 | {model.outputParamsCount} 输出参数
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

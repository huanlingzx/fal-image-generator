// app/(app)/models/_components/ModelCard.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ModelInfo } from "../models-data"; // Import the interface

interface ModelCardProps {
  model: ModelInfo;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="flex flex-col dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg transition-shadow">
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
      <CardFooter className="flex justify-between items-center pt-4">
        <div className="text-xs text-muted-foreground dark:text-slate-500">
          {model.inputParamsCount} 输入参数 | {model.outputParamsCount} 输出参数
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={model.path}>
            使用模型 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

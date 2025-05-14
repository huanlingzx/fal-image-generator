// app/(app)/models/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import ModelCard from "./_components/ModelCard";
import { modelsData, ModelInfo } from "./models-data"; // Import data and type

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "flux"

  const filteredModels = useMemo(() => {
    let MData = [...modelsData];

    if (activeTab === "flux") {
      MData = MData.filter(model => model.tags.includes("flux"));
    }
    // Add more tab filters here if needed, e.g.,
    // else if (activeTab === "text") {
    //   MData = MData.filter(model => model.tags.includes("text-generation"));
    // }


    if (searchTerm) {
      MData = MData.filter(
        (model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.falId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return MData;
  }, [searchTerm, activeTab]);

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">FAL.AI 模型库</h1>
        <p className="mt-3 text-lg text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
          浏览所有可用的AI模型，选择最适合您需求的模型。
        </p>
      </div>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索模型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full dark:bg-slate-800 dark:border-slate-700"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:mx-auto md:max-w-sm dark:bg-slate-800">
          <TabsTrigger value="all" className="dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-50">所有模型</TabsTrigger>
          <TabsTrigger value="flux" className="dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-50">Flux 模型</TabsTrigger>
          {/* Add more tabs if you have more categories */}
        </TabsList>
      </Tabs>

      {filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground dark:text-slate-400">
            未找到匹配的模型。请尝试其他搜索词或筛选条件。
          </p>
        </div>
      )}
    </div>
  );
}

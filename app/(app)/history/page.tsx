// app/(app)/history/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { HistoryEntry } from "@/lib/types";
// import { getHistory, deleteHistoryEntry, toggleFavoriteHistoryEntry } from "@/lib/history"; // Adjust path
import ImageDetailModal from "../models/_components/ImageDetailModal";
import PaginationControls from "../models/_components/PaginationControls";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Star, Maximize, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { modelsData } from "../models/models-data"; // For model filter dropdown
import { useDebounce } from "@/hooks/useDebounce"; // A custom hook for debouncing search

const ITEMS_PER_PAGE = 12; // Or your preferred number

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [searchTermInput, setSearchTermInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchTermInput, 500); // Debounce search
  const [modelFilter, setModelFilter] = useState("all"); // Stores modelId
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");


  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
      });
      if (debouncedSearchTerm) params.append('searchTerm', debouncedSearchTerm);
      // if (modelFilter) params.append('modelFilter', modelFilter);
      if (modelFilter && modelFilter !== 'all') {
        params.append('modelFilter', modelFilter);
      }
      if (sortOrder) params.append('sortOrder', sortOrder);
      const response = await fetch(`/api/history?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("加载历史记录失败。");
      setHistory([]); // Clear history on error
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, modelFilter, sortOrder]);  

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // fetchHistory is memoized with useCallback
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, modelFilter, sortOrder]);
  const handleImageClick = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success("记录已删除！");
      fetchHistory(); // Re-fetch to update list
      if (selectedEntry?.id === id) {
          setIsModalOpen(false);
          setSelectedEntry(null);
      }
    } catch (error) {
      console.error("删除记录失败：", error);
      toast.error("删除记录失败。");
    }
  };
  const handleToggleFavorite = async (id: string, currentIsFavorite: boolean) => {
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      if (!response.ok) throw new Error('Failed to update favorite status');
      toast.success(!currentIsFavorite ? "已收藏！" : "已取消收藏！");
      fetchHistory(); // Re-fetch to update list
      if (selectedEntry?.id === id) {
        setSelectedEntry(prev => prev ? {...prev, isFavorite: !currentIsFavorite} : null);
      }
    } catch (error) {
      console.error("更新收藏状态失败：", error);
      toast.error("更新收藏状态失败。");
    }
  };


  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight">生成历史</h1>
        <p className="mt-3 text-lg text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto">
          浏览、管理您之前生成的图像和参数。
        </p>
      </div>
      {/* Filters Bar */}
      <div className="mb-8 p-4 border rounded-lg dark:border-slate-700 dark:bg-slate-800/30 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索提示词或模型名称..."
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
            className="pl-9 w-full dark:bg-slate-700 dark:border-slate-600"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-full md:w-[180px] dark:bg-slate-700 dark:border-slate-600">
                <SelectValue placeholder="筛选模型" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                <SelectItem value="all" className="dark:focus:bg-slate-700">所有模型</SelectItem>
                {modelsData.map(model => (
                  <SelectItem key={model.falId} value={model.falId}  className="dark:focus:bg-slate-700">
                    {model.name}
                  </SelectItem>
                ))}
            </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "desc" | "asc")}>
            <SelectTrigger className="w-full md:w-[180px] dark:bg-slate-700 dark:border-slate-600">
                <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                <SelectItem value="desc" className="dark:focus:bg-slate-700">最新优先</SelectItem>
                <SelectItem value="asc" className="dark:focus:bg-slate-700">最早优先</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground dark:text-slate-400">
          <p>未找到符合条件的记录，或您的生成历史为空。</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {history.map((entry) => (
              <Card
                key={entry.id}
                className="overflow-hidden group relative cursor-pointer dark:bg-slate-800 dark:border-slate-700 hover:shadow-xl transition-shadow aspect-[3/4]" // Aspect ratio for consistency
                // onClick={() => handleImageClick(entry)} // Click handled by overlay button now
              >
                <CardContent className="p-0 h-full">
                  <Image
                    src={entry.image.url}
                    alt={entry.parameters.prompt.substring(0, 30) + "..."}
                    width={300} // Provide a consistent width for grid layout
                    height={400} // Provide a consistent height based on aspect ratio
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                    priority={history.indexOf(entry) < ITEMS_PER_PAGE / 2} // Prioritize loading for above-the-fold images
                  />
                </CardContent>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:bg-black/40 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 mb-1" onClick={(e) => { e.stopPropagation(); handleImageClick(entry); }}>
                        <Maximize className="h-6 w-6"/>
                    </Button>
                    <div className="flex space-x-1 mt-1">
                        <Button variant="ghost" size="icon" 
                            className={`text-white hover:bg-white/20 ${entry.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'hover:text-yellow-400'}`} 
                            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(entry.id, entry.isFavorite || false); }}>
                            {entry.isFavorite ? <Star className="h-5 w-5 fill-current"/> : <Star className="h-5 w-5"/>}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:bg-white/20 hover:text-red-300" onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}>
                            <Trash2 className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-white truncate font-medium">{entry.modelName}</p>
                    <p className="text-xs text-slate-200 truncate mt-0.5">{entry.parameters.prompt}</p>
                </div>
              </Card>
            ))}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        </>
      )}
      <ImageDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        historyEntry={selectedEntry}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

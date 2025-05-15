// app/(app)/_components/PaginationControls.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  if (totalPages < 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t dark:border-slate-700">
      <div className="text-sm text-muted-foreground dark:text-slate-400">
        显示第 {startItem} 到 {endItem} 条，共 {totalItems} 条记录
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden md:inline-flex dark:hover:bg-slate-700"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1 md:mr-0" />
          <span className="hidden md:inline">上一页</span>
        </Button>
        <span className="text-sm px-2">
          第 {currentPage} 页 / 共 {totalPages} 页
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="dark:hover:bg-slate-700"
        >
          <span className="hidden md:inline">下一页</span>
          <ChevronRight className="h-4 w-4 ml-1 md:ml-0" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden md:inline-flex dark:hover:bg-slate-700"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

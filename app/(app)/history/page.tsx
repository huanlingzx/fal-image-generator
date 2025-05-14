// app/(app)/history/page.tsx
"use client"; // If you plan to fetch/display dynamic data

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">生成历史</h1>
        <p className="text-muted-foreground dark:text-slate-400">
          浏览您之前生成的图像。
        </p>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
         <CardHeader>
             <CardTitle>我的图像</CardTitle>
             <CardDescription className="dark:text-slate-400">
              您创建的图像列表。(功能待实现)
             </CardDescription>
         </CardHeader>
         <CardContent>
             <div className="flex items-center justify-center h-64 border border-dashed rounded-md bg-muted/30 dark:border-slate-700 dark:bg-slate-800/30">
                 <p className="text-muted-foreground dark:text-slate-500">
                  图像历史将显示在此处。
                 </p>
             </div>
         </CardContent>
      </Card>
      {/* Future: Add pagination, filtering, etc. */}
    </div>
  );
}

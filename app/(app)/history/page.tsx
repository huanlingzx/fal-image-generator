// app/(app)/history/page.tsx
"use client"; // If you plan to fetch/display dynamic data

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Generation History</h1>
        <p className="text-muted-foreground dark:text-slate-400">
          Browse your previously generated images.
        </p>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
         <CardHeader>
             <CardTitle>My Images</CardTitle>
             <CardDescription className="dark:text-slate-400">
                 A list of images you&apos;ve created. (Functionality to be implemented)
             </CardDescription>
         </CardHeader>
         <CardContent>
             <div className="flex items-center justify-center h-64 border border-dashed rounded-md bg-muted/30 dark:border-slate-700 dark:bg-slate-800/30">
                 <p className="text-muted-foreground dark:text-slate-500">
                     Image history will be displayed here.
                 </p>
             </div>
         </CardContent>
      </Card>
      {/* Future: Add pagination, filtering, etc. */}
    </div>
  );
}

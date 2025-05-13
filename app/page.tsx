// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RootHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 dark:bg-slate-900 dark:text-slate-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold mb-8">
          Welcome to AI Image Generation Hub
        </h1>
        <p className="text-xl mb-12 text-muted-foreground dark:text-slate-400">
          Explore different models and generate stunning visuals.
        </p>
        <div className="flex space-x-4">
          <Button asChild size="lg">
            <Link href="/models/fal-ai-flux-lora">Try Flux LoRA Model</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Link href="/history">View Generation History</Link>
          </Button>
        </div>
      </main>
      <footer className="flex items-center justify-center w-full h-24 border-t dark:border-slate-800">
         <p className="text-muted-foreground dark:text-slate-500">Fal.ai Image Generator © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

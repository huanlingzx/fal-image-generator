// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RootHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 dark:bg-slate-900 dark:text-slate-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold mb-8">
          欢迎来到AI图像生成中心
        </h1>
        <p className="text-xl mb-12 text-muted-foreground dark:text-slate-400">
          探索不同的模型并生成令人惊叹的视觉效果。
        </p>
        <div className="flex space-x-4">
          <Button asChild size="lg">
            <Link href="/models">浏览所有模型</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Link href="/history">查看生成历史</Link>
          </Button>
        </div>
      </main>
      <footer className="flex items-center justify-center w-full h-24 border-t dark:border-slate-800">
         <p className="text-muted-foreground dark:text-slate-500">Fal.ai 图像生成器 © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

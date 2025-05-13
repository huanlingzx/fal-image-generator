// app/(app)/layout.tsx
"use client"; // If using client-side state like darkMode in the header

import { useState, useEffect } from "react";
import Image from "next/image"; // If your logo is an image
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KeyRound, Settings2, Trash2, Moon, Sun } from "lucide-react";
import { usePathname } from 'next/navigation';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname(); // To highlight active nav link

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const navItems = [
     { href: "/", label: "首页" },
     { href: "/models/fal-ai-flux-lora", label: "所有模型" }, // Or a generic /models page first
     { href: "/history", label: "生成历史" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col dark:bg-slate-900 dark:text-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-slate-900/90 dark:border-slate-800">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            {/* Placeholder for Fal.ai Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary dark:text-sky-400">
              <path d="M12 .9C5.88.9.9 5.88.9 12s4.98 11.1 11.1 11.1 11.1-4.98 11.1-11.1S18.12.9 12 .9zm0 18.9c-4.31 0-7.8-3.49-7.8-7.8s3.49-7.8 7.8-7.8 7.8 3.49 7.8 7.8-3.49 7.8-7.8 7.8z"/>
              <path d="M12 6.6c-2.97 0-5.4 2.43-5.4 5.4s2.43 5.4 5.4 5.4 5.4-2.43 5.4-5.4-2.43-5.4-5.4-5.4zm0 8.1c-1.49 0-2.7-1.21-2.7-2.7s1.21-2.7 2.7-2.7 2.7 1.21 2.7 2.7-1.21 2.7-2.7 2.7z"/>
            </svg>
            <span className="font-bold text-lg">Fal.AI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             {navItems.map(item => (
                 <Link
                     key={item.href}
                     href={item.href}
                     className={`${
                         pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                         ? "text-foreground dark:text-slate-200 font-semibold"
                         : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200"
                     }`}
                 >
                     {item.label}
                 </Link>
             ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={toggleDarkMode} className="dark:border-slate-700 dark:hover:bg-slate-800">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="sm" className="dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"><KeyRound className="mr-2 h-4 w-4"/> 密钥 1</Button>
            <Button variant="outline" size="sm" className="dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"><Settings2 className="mr-2 h-4 w-4"/> 系统</Button>
            <Button variant="outline" size="sm" className="dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"><Trash2 className="mr-2 h-4 w-4"/> 清除缓存</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}

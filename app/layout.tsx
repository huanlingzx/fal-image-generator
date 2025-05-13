import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Updated import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flux LoRA Image Generator",
  description: "Generate images using Fal.ai Flux LoRA model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountProvider } from "@/components/account-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teyvat Atelier — разбор билдов Genshin Impact",
  description:
    "Локальный разбор персонажей: оружие и сеты в процентах, капы статов и предложения по оптимизации по JSON аккаунта.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`dark ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          <AccountProvider>{children}</AccountProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

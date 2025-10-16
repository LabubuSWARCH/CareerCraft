import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "CareerCraft",
  description: "Craft resumes that get you hired.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-dvh ${inter.variable} font-inter`}>
        <Providers>
          <Header />
          <div className="flex flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

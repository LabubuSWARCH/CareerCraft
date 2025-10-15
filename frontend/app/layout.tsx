import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "CareerCraft Template Preview",
  description: "Render CareerCraft resume templates from the shared schema.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-dvh">
        <Providers>
          <Header />
          <div className="flex flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

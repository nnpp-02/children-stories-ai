import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MainMenu from "@/components/main-menu";
import { AuthProvider } from "@/contexts/auth-context";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Kids Book",
  description: "Children's storybook app powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <MainMenu />
          <main className="pt-[72px] md:pt-[80px] min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

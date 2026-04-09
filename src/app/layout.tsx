import type { Metadata } from "next";
import "./globals.css";
import HandDrawnFilters from "@/components/jeju/HandDrawnFilters";

export const metadata: Metadata = {
  title: "旅行助手",
  description: "旅行行程规划、出行清单、实用信息",
  openGraph: {
    title: "旅行助手 ✈️",
    description: "规划你的旅行行程 · 出行清单 · 实用信息",
    url: "https://jeju.kurize.com",
    siteName: "Travel Planner",
    images: [
      {
        url: "https://jeju.kurize.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "旅行助手 ✈️",
    description: "规划你的旅行行程 · 出行清单 · 实用信息",
    images: ["https://jeju.kurize.com/og-image.jpg"],
  },
  other: {
    "theme-color": "#F5727F",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "旅行助手",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <HandDrawnFilters />
        <div className="mx-auto w-full max-w-[420px] min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}

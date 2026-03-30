import type { Metadata } from "next";
import "./globals.css";
import HandDrawnFilters from "@/components/jeju/HandDrawnFilters";

export const metadata: Metadata = {
  title: "济州岛旅行助手",
  description: "济州岛4天旅行行程、出行清单、实用信息",
  openGraph: {
    title: "济州岛旅行助手 🌸",
    description: "4月济州岛4天行程 · 樱花+美食+海景 · 出行清单一键勾选",
    url: "https://jeju.kurize.com",
    siteName: "Jeju Travel",
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
    title: "济州岛旅行助手 🌸",
    description: "4月济州岛4天行程 · 樱花+美食+海景 · 出行清单一键勾选",
    images: ["https://jeju.kurize.com/og-image.jpg"],
  },
  other: {
    "theme-color": "#F5727F",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "济州岛旅行助手",
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

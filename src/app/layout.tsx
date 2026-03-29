'use client';

import "./globals.css";
import HandDrawnFilters from "@/components/jeju/HandDrawnFilters";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>济州岛旅行助手</title>
        <meta name="description" content="济州岛4天旅行行程、出行清单、实用信息" />
        {/* 微信/社交分享卡片 */}
        <meta property="og:title" content="济州岛旅行助手 🌸" />
        <meta property="og:description" content="4月济州岛4天行程 · 樱花+美食+海景 · 出行清单一键勾选" />
        <meta property="og:image" content="https://jeju.kurize.com/jeju-travelpublicbanner-jeju-01.jpg" />
        <meta property="og:url" content="https://jeju.kurize.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jeju Travel" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="济州岛旅行助手 🌸" />
        <meta name="twitter:description" content="4月济州岛4天行程 · 樱花+美食+海景 · 出行清单一键勾选" />
        <meta name="twitter:image" content="https://jeju.kurize.com/jeju-travelpublicbanner-jeju-01.jpg" />
        {/* PWA */}
        <meta name="theme-color" content="#F5727F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="济州岛旅行助手" />
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

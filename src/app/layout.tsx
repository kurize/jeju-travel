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
        <meta name="theme-color" content="#F5727F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jeju Travel" />
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

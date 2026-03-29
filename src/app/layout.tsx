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
        <title>Jeju Travel</title>
        <meta name="description" content="济州岛旅行 App" />
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

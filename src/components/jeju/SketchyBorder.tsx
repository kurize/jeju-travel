'use client';

import React from 'react';
import { colors, radius, shadows } from '@/lib/theme';

/**
 * SketchyBorder — 手绘边框容器
 *
 * 核心思路：两层分离
 * - 底层：带 filter 的空壳（只有 border + background），产生手绘边框扭曲
 * - 上层：干净的内容区，文字完全不受滤镜影响
 */
interface SketchyBorderProps {
  children: React.ReactNode;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: string;
  backgroundColor?: string;
  boxShadow?: string;
  padding?: string;
  style?: React.CSSProperties;
  /** 使用较强的滤镜 */
  strong?: boolean;
}

export default function SketchyBorder({
  children,
  borderColor = colors.border,
  borderWidth = 2,
  borderRadius: br = radius.lg,
  backgroundColor = colors.bgCard,
  boxShadow = shadows.level1,
  padding = '14px',
  style,
  strong = false,
}: SketchyBorderProps) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {/* 底层：滤镜只作用于边框和背景形状 */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: br,
          boxShadow,
          filter: `url(#${strong ? 'sketchy-strong' : 'sketchy'})`,
        }}
      />
      {/* 上层：干净的文字内容 */}
      <div style={{ position: 'relative', padding }}>
        {children}
      </div>
    </div>
  );
}

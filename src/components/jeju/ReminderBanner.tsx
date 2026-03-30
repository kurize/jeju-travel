'use client';

import React from 'react';
import { colors, radius } from '@/lib/theme';

interface ReminderBannerProps {
  text: string;
}

export default function ReminderBanner({ text }: ReminderBannerProps) {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#FFF9E6',
        borderRadius: radius.sm,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '12px',
        fontWeight: 600,
        color: colors.textPrimary,
        lineHeight: 1.5,
        margin: '0 16px',
        border: `1.5px dashed ${colors.amber}60`,
        filter: 'url(#sketchy)',
      }}
    >
      {/* 便签纸贴效果 */}
      <span style={{ position: 'absolute', top: '-8px', left: '16px', fontSize: '14px' }}>📌</span>
      <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
      <span>{text}</span>
    </div>
  );
}

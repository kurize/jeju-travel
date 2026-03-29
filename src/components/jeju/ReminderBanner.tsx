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
        backgroundColor: colors.bgHighlight,
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
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
      <span>{text}</span>
    </div>
  );
}

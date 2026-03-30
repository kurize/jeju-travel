'use client';

import React from 'react';
import { colors, radius, shadows, typography } from '@/lib/theme';

interface DayTabProps {
  day: string;
  date: string;
  emoji: string;
  active?: boolean;
  onClick?: () => void;
}

export default function DayTab({ day, date, emoji, active = false, onClick }: DayTabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 14px',
        borderRadius: radius.lg,
        border: active ? `2px solid ${colors.amber}` : `2px dashed ${colors.borderLight}`,
        backgroundColor: active ? colors.amber : '#FFFFFF',
        color: active ? '#FFFFFF' : colors.textSecondary,
        cursor: 'pointer',
        fontFamily: typography.fontDisplay,
        boxShadow: active ? shadows.level3 : 'none',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: active ? 'scale(1.05) rotate(-1deg)' : 'scale(1)',
        whiteSpace: 'nowrap',
        filter: 'url(#sketchy)',
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: 800 }}>{day}</span>
      <span style={{ fontSize: '12px', fontWeight: 600 }}>{date}</span>
      <span style={{ fontSize: '14px' }}>{emoji}</span>
    </button>
  );
}

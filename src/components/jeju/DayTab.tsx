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
        padding: '6px 12px',
        borderRadius: radius.lg,
        border: active ? 'none' : `1.5px solid ${colors.borderLight}`,
        backgroundColor: active ? colors.amber : '#FFFFFF',
        color: active ? '#FFFFFF' : colors.textSecondary,
        cursor: 'pointer',
        fontFamily: typography.fontBody,
        boxShadow: active ? shadows.level3 : 'none',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 800 }}>{day}</span>
      <span style={{ fontSize: '11px', fontWeight: 600 }}>{date}</span>
      <span style={{ fontSize: '13px' }}>{emoji}</span>
    </button>
  );
}

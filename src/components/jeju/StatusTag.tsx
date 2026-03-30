'use client';

import React from 'react';
import { colors, radius, components } from '@/lib/theme';

export type TagType = 'completed' | 'dining' | 'coffee' | 'transport' | 'hiking' | 'difficult' | 'default';

interface StatusTagProps {
  type: TagType;
  label?: string;
}

const tagConfig: Record<TagType, { bg: string; icon: string; defaultLabel: string }> = {
  completed:  { bg: colors.tagCompleted,  icon: '✅', defaultLabel: 'COMPLETED' },
  dining:     { bg: colors.tagDining,     icon: '🍴', defaultLabel: 'DINING' },
  coffee:     { bg: colors.tagCoffee,     icon: '☕', defaultLabel: 'COFFEE' },
  transport:  { bg: colors.tagTransport,  icon: '🚌', defaultLabel: 'TRANSPORTATION' },
  hiking:     { bg: colors.tagHiking,     icon: '🥾', defaultLabel: 'HIKING' },
  difficult:  { bg: colors.tagDifficult,  icon: '⚠️', defaultLabel: 'DIFFICULT' },
  default:    { bg: colors.textSecondary,  icon: '',   defaultLabel: '' },
};

export default function StatusTag({ type, label }: StatusTagProps) {
  const config = tagConfig[type];

  // default 类型使用描边样式
  if (type === 'default') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'transparent',
          color: colors.textSecondary,
          border: `1.5px dashed ${colors.borderLight}`,
          borderRadius: radius.lg,
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: "'Nunito', sans-serif",
          height: '28px',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: config.bg,
        color: '#FFFFFF',
        borderRadius: radius.lg,
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 700,
        fontFamily: "'Nunito', sans-serif",
        height: '28px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      }}
    >
      {config.icon && <span style={{ fontSize: '11px' }}>{config.icon}</span>}
      {label || config.defaultLabel}
    </span>
  );
}

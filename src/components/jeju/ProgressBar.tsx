'use client';

import React from 'react';
import { colors, components as comp } from '@/lib/theme';

interface ProgressBarProps {
  percent: number;
  height?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ percent, height, showLabel = false }: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const h = height || comp.ProgressBar.height;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            color: colors.textSecondary,
            marginBottom: '6px',
          }}
        >
          {clampedPercent}% COMPLETED
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: h,
          borderRadius: comp.ProgressBar.radius,
          backgroundColor: comp.ProgressBar.bg,
          overflow: 'hidden',
          filter: 'url(#sketchy)',
          border: `1px solid ${colors.borderLight}`,
        }}
      >
        <div
          style={{
            width: `${clampedPercent}%`,
            height: '100%',
            borderRadius: comp.ProgressBar.radius,
            background: comp.ProgressBar.gradient,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

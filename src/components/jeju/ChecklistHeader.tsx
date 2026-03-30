'use client';

import React from 'react';
import { colors, typography } from '@/lib/theme';
import ProgressBar from './ProgressBar';

interface ChecklistHeaderProps {
  completed: number;
  total: number;
}

export default function ChecklistHeader({ completed, total }: ChecklistHeaderProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllDone = completed === total;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '24px 16px 16px',
        fontFamily: typography.fontBody,
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '16px', opacity: 0.5, transform: 'rotate(-10deg)' }}>⭐</div>
      <div style={{ position: 'absolute', top: '10px', left: '48px', fontSize: '12px', opacity: 0.3 }}>🌼</div>
      <div style={{ position: 'absolute', top: '8px', right: '20px', fontSize: '16px', opacity: 0.4, transform: 'rotate(8deg)' }}>✈️</div>
      <div style={{ position: 'absolute', top: '14px', right: '52px', fontSize: '12px', opacity: 0.3 }}>✨</div>

      <h1 style={{ fontSize: '24px', fontWeight: 900, color: colors.primary, letterSpacing: '2px', margin: 0, fontFamily: typography.fontDisplay }}>
        济州岛出行清单
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
        <span style={{ fontSize: '48px', fontWeight: 900, color: colors.primary, lineHeight: 1 }}>
          {completed}/{total}
        </span>
        {isAllDone && <span style={{ fontSize: '28px' }}>✅</span>}
      </div>

      {isAllDone && (
        <div style={{ fontSize: '18px', fontWeight: 800, color: colors.forestGreen, marginTop: '4px', animation: 'celebrateBounce 0.6s ease-out' }}>
          🎉 准备出发！Ready to go! ✨
        </div>
      )}
      <style>{`
        @keyframes celebrateBounce {
          0% { opacity: 0; transform: scale(0.5); }
          60% { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{ marginTop: '12px' }}>
        <ProgressBar percent={percent} height="14px" />
      </div>
    </div>
  );
}

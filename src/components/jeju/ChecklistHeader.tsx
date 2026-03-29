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
      <div style={{ position: 'absolute', top: '12px', left: '20px', fontSize: '18px', opacity: 0.5 }}>⭐</div>
      <div style={{ position: 'absolute', top: '8px', right: '24px', fontSize: '16px', opacity: 0.4 }}>✈️</div>

      <h1 style={{ fontSize: '22px', fontWeight: 900, color: colors.primary, letterSpacing: '2px', margin: 0, fontFamily: typography.fontHand }}>
        JEJU ISLAND CHECKLIST
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

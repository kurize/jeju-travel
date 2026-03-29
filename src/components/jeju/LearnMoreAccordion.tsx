'use client';

import React, { useState } from 'react';
import { colors, radius } from '@/lib/theme';

interface LearnMoreAccordionProps {
  children: React.ReactNode;
  hint?: string;
}

export default function LearnMoreAccordion({ children, hint }: LearnMoreAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
            color: colors.amber,
            padding: 0,
          }}
        >
          💡 Learn more {open ? '∧' : '∨'}
        </button>
        {hint && !open && (
          <span style={{ fontSize: '12px', color: colors.textSecondary }}>{hint}</span>
        )}
      </div>
      {open && (
        <div
          style={{
            marginTop: '8px',
            padding: '14px',
            backgroundColor: colors.bgLearnMore,
            borderRadius: radius.sm,
            fontSize: '14px',
            color: colors.textSecondary,
            lineHeight: '22px',
            border: `1px dashed ${colors.border}`,
            position: 'relative',
          }}
        >
          {/* 回形针装饰 */}
          <span style={{ position: 'absolute', top: '-6px', right: '12px', fontSize: '16px' }}>📎</span>
          {children}
        </div>
      )}
    </div>
  );
}

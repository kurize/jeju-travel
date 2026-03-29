'use client';

import React, { useState } from 'react';
import { colors, radius, components } from '@/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'language' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, style, disabled, ...props }: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 700,
      fontSize: '14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      borderRadius: radius.xl,
      padding: '10px 24px',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    };

    if (variant === 'primary') {
      const state = disabled ? 'disabled' : hovered ? 'hover' : 'default';
      const s = components.Button.primary[state];
      return { ...base, backgroundColor: s.bg, color: s.color, boxShadow: s.shadow };
    }
    if (variant === 'secondary') {
      const state = disabled ? 'disabled' : hovered ? 'hover' : 'default';
      const s = components.Button.secondary[state];
      return { ...base, backgroundColor: s.bg, color: s.color, border: s.border, boxShadow: s.shadow };
    }
    if (variant === 'language') {
      return { ...base, backgroundColor: colors.amber, color: '#FFFFFF', borderRadius: radius.lg, padding: '8px 16px' };
    }
    if (variant === 'icon') {
      return {
        ...base,
        width: '48px', height: '48px',
        borderRadius: '50%',
        padding: 0,
        border: `2px solid ${colors.primary}`,
        backgroundColor: hovered ? colors.primary : 'transparent',
        color: hovered ? '#FFFFFF' : colors.primary,
      };
    }
    return base;
  };

  return (
    <button
      style={{ ...getStyles(), ...style }}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}

'use client';

import React from 'react';
import { colors, components as comp } from '@/lib/theme';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  strikethrough?: boolean;
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, label, strikethrough = true, disabled = false }: CheckboxProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : onChange ? 'pointer' : 'default',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '14px',
        color: colors.textPrimary,
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onChange?.(!checked);
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: comp.Checkbox.size,
          height: comp.Checkbox.size,
          borderRadius: comp.Checkbox.radius,
          border: checked ? 'none' : comp.Checkbox.unchecked.border,
          backgroundColor: checked ? comp.Checkbox.checked.bg : 'transparent',
          color: comp.Checkbox.checked.color,
          fontSize: '14px',
          fontWeight: 700,
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        {checked && '✓'}
      </span>
      {label && (
        <span
          style={{
            textDecoration: checked && strikethrough ? 'line-through' : 'none',
            color: checked ? colors.textSecondary : colors.textPrimary,
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}

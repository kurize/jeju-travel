'use client';

import React from 'react';
import { colors, radius, components as comp } from '@/lib/theme';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'coffee';

interface MealButtonProps {
  type: MealType;
  label?: string;
  onClick?: () => void;
}

const mealConfig: Record<MealType, { icon: string; defaultLabel: string }> = {
  breakfast: { icon: '🌅', defaultLabel: 'Breakfast' },
  lunch:     { icon: '🍱', defaultLabel: 'Lunch' },
  dinner:    { icon: '🍽️', defaultLabel: 'Dinner' },
  coffee:    { icon: '☕', defaultLabel: 'Coffee' },
};

export default function MealButton({ type, label, onClick }: MealButtonProps) {
  const config = mealConfig[type];
  const bg = comp.MealButton[type].bg;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: comp.MealButton.padding,
        borderRadius: radius.xl,
        backgroundColor: bg,
        color: '#FFFFFF',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '13px',
        fontWeight: 700,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.1s',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{config.icon}</span>
      {label || config.defaultLabel}
    </button>
  );
}

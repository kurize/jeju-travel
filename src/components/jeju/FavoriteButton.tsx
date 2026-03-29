'use client';

import React from 'react';
import { colors } from '@/lib/theme';

interface FavoriteButtonProps {
  active?: boolean;
  onClick?: () => void;
  size?: number;
}

export default function FavoriteButton({ active = false, onClick, size = 48 }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `2px solid ${colors.primary}`,
        backgroundColor: active ? colors.primary : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: `${size * 0.4}px`,
        transition: 'all 0.2s',
        padding: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <span>{active ? '❤️' : '🤍'}</span>
    </button>
  );
}

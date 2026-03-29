'use client';

import React from 'react';
import { colors, shadows } from '@/lib/theme';

interface MapFABProps {
  onClick?: () => void;
}

export default function MapFAB({ onClick }: MapFABProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: colors.primary,
        color: '#FFFFFF',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '13px',
        fontWeight: 800,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0px',
        boxShadow: '0 4px 16px rgba(245,114,127,0.4)',
        transition: 'transform 0.15s',
        lineHeight: 1.1,
      }}
    >
      <span style={{ fontSize: '14px' }}>↑</span>
      <span>Map</span>
    </button>
  );
}

'use client';

import React from 'react';
import { colors, radius, typography } from '@/lib/theme';
import SketchyBorder from './SketchyBorder';

interface TimelineTransportPillProps {
  mode: string;
  duration: string;
  destination: string;
}

function getModeIcon(mode: string) {
  const m = mode.toLowerCase();
  if (m.includes('步行') || m.includes('walk')) return '🚶';
  if (m.includes('渡轮') || m.includes('ferry') || m.includes('渡')) return '⛴️';
  if (m.includes('bus') || m.includes('巴士') || m.includes('公交')) return '🚌';
  return '🚗';
}

export default function TimelineTransportPill({ mode, duration, destination }: TimelineTransportPillProps) {
  return (
    <SketchyBorder
      backgroundColor="#F5F0E8"
      borderColor={colors.border}
      borderWidth={1}
      borderRadius={radius.lg}
      padding="8px 14px"
      boxShadow="none"
      style={{}}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: typography.fontBody,
        fontSize: '12px',
        color: colors.textSecondary,
      }}>
        <span>{getModeIcon(mode)}</span>
        <span style={{ fontFamily: typography.fontDisplay }}>{mode}</span>
        <span style={{ color: colors.amber }}>···</span>
        <span style={{ fontWeight: 700, color: colors.amber }}>{duration}</span>
        <span style={{ color: colors.amber }}>···</span>
        <span style={{ fontSize: '11px' }}>{destination}</span>
      </div>
    </SketchyBorder>
  );
}

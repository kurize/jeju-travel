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
      backgroundColor="#F0EDE8"
      borderColor="transparent"
      borderWidth={0}
      borderRadius={radius.lg}
      padding="10px 16px"
      boxShadow="none"
      style={{}}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: typography.fontBody,
        fontSize: '13px',
        color: colors.textSecondary,
      }}>
        <span>{getModeIcon(mode)}</span>
        <span>{mode}</span>
        <span>→</span>
        <span style={{ fontWeight: 700 }}>{duration}</span>
        <span>→</span>
        <span style={{ fontSize: '12px' }}>{destination}</span>
      </div>
    </SketchyBorder>
  );
}

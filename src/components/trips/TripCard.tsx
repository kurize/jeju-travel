'use client';

import React from 'react';
import { colors, typography, radius, shadows } from '@/lib/theme';
import { Trash2 } from 'lucide-react';
import type { Trip } from '@/lib/types';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export default function TripCard({ trip, onClick, onDelete }: TripCardProps) {
  // 格式化日期
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const dateRange = trip.start_date && trip.end_date
    ? `${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`
    : '';

  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        backgroundColor: colors.bgCard,
        borderRadius: radius.lg,
        border: `2px solid ${colors.border}`,
        cursor: 'pointer',
        filter: 'url(#sketchy)',
        position: 'relative',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = shadows.level2;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 模板标记 */}
      {trip.is_template && (
        <span style={{
          position: 'absolute', top: '-6px', right: '12px',
          fontSize: '10px', fontWeight: 700,
          backgroundColor: colors.amber, color: '#FFF',
          padding: '1px 8px', borderRadius: '8px',
          fontFamily: typography.fontBody,
        }}>模板</span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>{trip.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '16px', fontWeight: 800, color: colors.textPrimary,
            fontFamily: typography.fontDisplay,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{trip.title}</div>
          {trip.destination && (
            <div style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: typography.fontBody, marginTop: '2px' }}>
              📍 {trip.destination}
            </div>
          )}
          {dateRange && (
            <div style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: typography.fontBody, marginTop: '2px' }}>
              📅 {dateRange}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', color: colors.textMuted }}>→</span>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: `${colors.emergencyRed}10`, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            ><Trash2 size={12} color={colors.emergencyRed} /></button>
          )}
        </div>
      </div>

      {trip.description && (
        <div style={{
          fontSize: '12px', color: colors.textSecondary, marginTop: '8px',
          fontFamily: typography.fontBody,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{trip.description}</div>
      )}
    </div>
  );
}

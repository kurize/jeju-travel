'use client';

import React from 'react';
import { colors, radius, shadows } from '@/lib/theme';
import StatusTag, { TagType } from './StatusTag';

interface ActivityCardProps {
  title: string;
  koreanTitle?: string;
  subtitle?: string;
  accentColor?: string;
  tags?: { type: TagType; label?: string }[];
  completed?: boolean;
  distance?: string;
  decorations?: boolean;
}

export default function ActivityCard({
  title,
  koreanTitle,
  subtitle,
  accentColor = colors.primary,
  tags = [],
  completed = false,
  distance,
  decorations = true,
}: ActivityCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        borderRadius: radius.md,
        backgroundColor: colors.bgCard,
        boxShadow: shadows.level1,
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
      }}
    >
      {/* 左侧色条 */}
      <div style={{ width: '4px', backgroundColor: accentColor, flexShrink: 0 }} />
      {/* 内容 */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>
              {title}
            </div>
            {koreanTitle && (
              <div style={{ fontSize: '14px', color: colors.amber, marginTop: '2px' }}>
                {koreanTitle}
              </div>
            )}
            {subtitle && (
              <div style={{ fontSize: '14px', color: colors.textSecondary, marginTop: '2px' }}>
                {subtitle}
              </div>
            )}
          </div>
          {/* 装饰 */}
          {decorations && (
            <div style={{ display: 'flex', gap: '4px', fontSize: '12px', opacity: 0.5 }}>
              <span>⭐</span><span>🌸</span>
            </div>
          )}
        </div>
        {distance && (
          <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '4px' }}>
            Distance: {distance}
          </div>
        )}
        {/* 标签 */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            {tags.map((tag, i) => (
              <StatusTag key={i} type={tag.type} label={tag.label} />
            ))}
          </div>
        )}
        {/* 完成状态 */}
        {completed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: colors.tagCompleted, fontSize: '13px', fontWeight: 600 }}>
            <span>✅</span> Completed
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { colors, radius, shadows, typography } from '@/lib/theme';
import StatusTag, { TagType } from './StatusTag';
import LearnMoreAccordion from './LearnMoreAccordion';
import SketchyBorder from './SketchyBorder';

interface TimelineActivityCardProps {
  title: string;
  time?: string;
  koreanTitle?: string;
  description?: string;
  typeLabel?: string;
  tags?: { type: TagType; label?: string }[];
  learnMoreContent?: string;
  accentColor?: string;
  bgTint?: string;
  isCurrent?: boolean;
  onNavigate?: () => void;
}

export default function TimelineActivityCard({
  title,
  time,
  koreanTitle,
  description,
  typeLabel,
  tags = [],
  learnMoreContent,
  bgTint,
  isCurrent = false,
}: TimelineActivityCardProps) {
  return (
    <SketchyBorder
      backgroundColor={bgTint || colors.bgCard}
      borderColor={colors.border}
      style={{ marginLeft: '8px' }}
    >
      {/* 图钉装饰 */}
      <span style={{ position: 'absolute', top: '-8px', right: '16px', fontSize: '16px', zIndex: 3 }}>📌</span>

      {/* 时间 + 标题区域 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 时间已移至卡片外部的分隔行显示 */}
          <div style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3, fontFamily: typography.fontBody }}>{title}</div>
          {koreanTitle && (
            <div style={{ fontSize: '14px', color: colors.amber, marginTop: '1px', fontFamily: typography.fontKorean }}>{koreanTitle}</div>
          )}
        </div>
        {typeLabel && (
          <StatusTag type="default" label={typeLabel} />
        )}
      </div>

      {/* 描述 */}
      {description && (
        <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: '20px', margin: '6px 0 0', fontFamily: typography.fontBody }}>
          {description}
        </p>
      )}

      {/* 标签 */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {tags.map((tag, i) => (
            <StatusTag key={i} type={tag.type} label={tag.label} />
          ))}
        </div>
      )}

      {/* 底部操作 */}
      {learnMoreContent && (
        <div style={{ marginTop: '10px' }}>
          <LearnMoreAccordion>
            {learnMoreContent}
          </LearnMoreAccordion>
        </div>
      )}
    </SketchyBorder>
  );
}

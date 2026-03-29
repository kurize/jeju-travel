'use client';

import React, { useState } from 'react';
import { colors, radius, typography } from '@/lib/theme';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SketchyBorder from './SketchyBorder';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export type ChecklistCategory =
  | 'documents' | 'currency' | 'communication'
  | 'restaurant' | 'transportation' | 'packing';

interface ChecklistCardProps {
  category: ChecklistCategory;
  title: string;
  icon: string;
  items: ChecklistItem[];
  borderColor: string;
  onToggleItem?: (id: string) => void;
}

export default function ChecklistCard({ title, icon, items, borderColor, onToggleItem }: ChecklistCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const completedCount = items.filter((i) => i.checked).length;

  return (
    <SketchyBorder
      borderColor={borderColor}
      borderRadius={radius.md}
      padding="10px"
      boxShadow="0 2px 8px rgba(0,0,0,0.06)"
    >
      {/* 标题行 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '4px',
          marginBottom: collapsed ? 0 : '8px',
          cursor: 'pointer',
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '13px' }}>{icon}</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary, letterSpacing: '0.3px', lineHeight: 1.2, fontFamily: typography.fontBody }}>
            {title}
          </span>
          {collapsed
            ? <ChevronDown size={12} color={colors.textSecondary} />
            : <ChevronUp size={12} color={colors.textSecondary} />
          }
        </div>
        <span style={{ fontSize: '8px', fontWeight: 700, color: colors.primary, backgroundColor: '#F5F0E8', padding: '2px 6px', borderRadius: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {completedCount}/{items.length}
        </span>
      </div>

      {/* 列表项 */}
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem?.(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: onToggleItem ? 'pointer' : 'default' }}
            >
              <span
                style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  border: item.checked ? 'none' : `2px solid ${colors.borderLight}`,
                  backgroundColor: item.checked ? colors.forestGreen : 'transparent',
                  color: '#FFFFFF', fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: item.checked ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {item.checked && '✓'}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 500, color: item.checked ? colors.textSecondary : colors.textPrimary, textDecoration: item.checked ? 'line-through' : 'none', fontFamily: typography.fontBody }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </SketchyBorder>
  );
}

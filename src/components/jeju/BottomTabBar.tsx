'use client';

import React from 'react';
import { colors, typography } from '@/lib/theme';
import { CalendarDays, CheckSquare, Info } from 'lucide-react';

export type TabId = 'itinerary' | 'checklist' | 'info';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'itinerary', label: '行程', icon: CalendarDays },
  { id: 'checklist', label: '清单', icon: CheckSquare },
  { id: 'info',      label: '信息', icon: Info },
];

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '72px',
        backgroundColor: '#FFFFFF',
        borderTop: `2px solid ${colors.border}`,
        borderRadius: '24px 24px 0 0',
        fontFamily: typography.fontBody,
        zIndex: 100,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        filter: 'url(#sketchy)',
      }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 24px',
              transition: 'transform 0.2s',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '34px',
                borderRadius: '14px',
                backgroundColor: isActive ? `${colors.primary}20` : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
            >
              <Icon
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: isActive ? 800 : 500,
                color: isActive ? colors.primary : colors.textSecondary,
                fontFamily: typography.fontDisplay,
              }}
            >
              {label}
            </span>
            {isActive && (
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: colors.primary, marginTop: '1px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

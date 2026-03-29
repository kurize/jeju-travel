'use client';

import React from 'react';
import { colors } from '@/lib/theme';
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
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderTop: `1.5px solid ${colors.borderLight}`,
        borderRadius: '20px 20px 0 0',
        fontFamily: "'Nunito', sans-serif",
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
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
              padding: '8px 20px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '32px',
                borderRadius: '12px',
                backgroundColor: isActive ? `${colors.primary}18` : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
            >
              <Icon
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? colors.primary : colors.textSecondary,
              }}
            >
              {label}
            </span>
            {isActive && (
              <div style={{
                width: '4px', height: '4px', borderRadius: '50%',
                backgroundColor: colors.primary, marginTop: '2px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

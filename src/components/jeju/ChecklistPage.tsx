'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { colors, typography, radius } from '@/lib/theme';
import ChecklistHeader from './ChecklistHeader';
import ReminderBanner from './ReminderBanner';
import ChecklistCard, { ChecklistCategory } from './ChecklistCard';
import JejuBanner from './JejuBanner';

interface ChecklistItemData {
  id: string;
  label: string;
  checked: boolean;
}

interface CategoryData {
  category: ChecklistCategory;
  title: string;
  icon: string;
  borderColor: string;
  items: ChecklistItemData[];
}

interface Member {
  id: string;
  name: string;
  emoji: string;
}

const MEMBERS_KEY = 'jeju-checklist-members';
const OLD_STATE_KEY = 'jeju-checklist-state';

const memberEmojis = ['🧑', '👩', '🧒', '👦', '👧', '🧓', '👨', '👩‍🦰'];

function getStateKey(memberId: string) {
  return `jeju-checklist-state-${memberId}`;
}

const initialCategories: CategoryData[] = [
  {
    category: 'documents',
    title: '证件与文件',
    icon: '📋',
    borderColor: colors.cardDocuments,
    items: [
      { id: 'doc-1', label: '护照（有效期6个月以上）', checked: false },
      { id: 'doc-2', label: 'K-ETA / 免签确认', checked: false },
      { id: 'doc-3', label: '机票行程单（去程+回程）', checked: false },
      { id: 'doc-4', label: '酒店预订确认单', checked: false },
      { id: 'doc-5', label: '身份证（国内段备用）', checked: false },
    ],
  },
  {
    category: 'currency',
    title: '货币与支付',
    icon: '💰',
    borderColor: colors.cardCurrency,
    items: [
      { id: 'cur-1', label: '换韩元现金（10-20万/人）', checked: false },
      { id: 'cur-2', label: '开通信用卡境外支付', checked: false },
      { id: 'cur-3', label: '만배회센타备现金（95折）', checked: false },
    ],
  },
  {
    category: 'communication',
    title: '通讯与导航',
    icon: '📱',
    borderColor: colors.cardComms,
    items: [
      { id: 'com-1', label: '韩国SIM卡/境外流量', checked: false },
      { id: 'com-2', label: 'KakaoTaxi 打车', checked: false },
    ],
  },
  {
    category: 'restaurant',
    title: '餐厅预约',
    icon: '🍴',
    borderColor: colors.cardRestaurant,
    items: [
      { id: 'res-1', label: 'Doldam 黑猪肉（4/4晚）', checked: false },
      { id: 'res-2', label: 'Jeju Madang（4/5晚）', checked: false },
      { id: 'res-3', label: '만배회센타（4/6晚）', checked: false },
    ],
  },
  {
    category: 'transportation',
    title: '交通安排',
    icon: '🚌',
    borderColor: colors.cardTransport,
    items: [
      { id: 'tra-1', label: '租车/包车确认', checked: false },
      { id: 'tra-2', label: '牛岛渡轮时刻查询', checked: false },
      { id: 'tra-3', label: '机场→酒店交通确认', checked: false },
    ],
  },
  {
    category: 'packing',
    title: '行李清单',
    icon: '🧳',
    borderColor: colors.cardPacking,
    items: [
      { id: 'pak-1', label: '春季外套/风衣', checked: false },
      { id: 'pak-2', label: '轻便运动鞋', checked: false },
      { id: 'pak-3', label: '防晒霜 + 墨镜', checked: false },
      { id: 'pak-4', label: '雨伞/轻便雨衣', checked: false },
      { id: 'pak-5', label: '充电宝', checked: false },
      { id: 'pak-6', label: '转换插头（德标圆孔）', checked: false },
    ],
  },
];

const totalItemCount = initialCategories.reduce((sum, c) => sum + c.items.length, 0);

function loadMembers(): Member[] {
  if (typeof window === 'undefined') return [{ id: 'me', name: '我', emoji: '🧑' }];
  try {
    const saved = localStorage.getItem(MEMBERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [{ id: 'me', name: '我', emoji: '🧑' }];
}

function saveMembers(members: Member[]) {
  try { localStorage.setItem(MEMBERS_KEY, JSON.stringify(members)); } catch {}
}

function loadSavedState(memberId: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(getStateKey(memberId));
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function applyState(categories: CategoryData[], saved: Record<string, boolean>): CategoryData[] {
  return categories.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({
      ...item,
      checked: saved[item.id] ?? false,
    })),
  }));
}

function getMemberCompletedCount(memberId: string): number {
  const saved = loadSavedState(memberId);
  return Object.values(saved).filter(Boolean).length;
}

export default function ChecklistPage() {
  const [members, setMembers] = useState<Member[]>(() => loadMembers());
  const [activeMember, setActiveMember] = useState<string>(() => loadMembers()[0]?.id || 'me');
  const [categories, setCategories] = useState(initialCategories);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newName, setNewName] = useState('');

  // 迁移旧数据到第一个成员
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const oldData = localStorage.getItem(OLD_STATE_KEY);
      if (oldData) {
        const firstMember = loadMembers()[0];
        if (firstMember && !localStorage.getItem(getStateKey(firstMember.id))) {
          localStorage.setItem(getStateKey(firstMember.id), oldData);
        }
        localStorage.removeItem(OLD_STATE_KEY);
      }
    } catch {}
  }, []);

  // 切换成员时加载对应状态
  useEffect(() => {
    const saved = loadSavedState(activeMember);
    setCategories(applyState(initialCategories, saved));
  }, [activeMember]);

  const allItems = categories.flatMap((c) => c.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => i.checked).length;

  const handleToggle = (categoryIndex: number, itemId: string) => {
    setCategories((prev) => {
      const next = prev.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      });
      const state: Record<string, boolean> = {};
      next.forEach((cat) => cat.items.forEach((item) => { state[item.id] = item.checked; }));
      try { localStorage.setItem(getStateKey(activeMember), JSON.stringify(state)); } catch {}
      return next;
    });
  };

  const handleAddMember = () => {
    const name = newName.trim();
    if (!name) return;
    const id = `member-${Date.now()}`;
    const emoji = memberEmojis[members.length % memberEmojis.length];
    const updated = [...members, { id, name, emoji }];
    setMembers(updated);
    saveMembers(updated);
    setNewName('');
    setShowAddInput(false);
    setActiveMember(id);
  };

  const handleDeleteMember = (memberId: string) => {
    if (members.length <= 1) return;
    const updated = members.filter((m) => m.id !== memberId);
    setMembers(updated);
    saveMembers(updated);
    try { localStorage.removeItem(getStateKey(memberId)); } catch {}
    if (activeMember === memberId) {
      setActiveMember(updated[0].id);
    }
  };

  const leftCol = [0, 2, 4];
  const rightCol = [1, 3, 5];

  const renderColumn = (indices: number[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: 0 }}>
      {indices.map((i) => {
        const cat = categories[i];
        if (!cat) return null;
        return (
          <div key={cat.category} style={{ position: 'relative' }}>
            {i % 3 === 0 && <span style={{ position: 'absolute', top: '-6px', right: '12px', fontSize: '14px', zIndex: 4 }}>📌</span>}
            {i % 3 === 1 && <span style={{ position: 'absolute', top: '-4px', right: '10px', fontSize: '14px', zIndex: 4, transform: 'rotate(15deg)' }}>📎</span>}
            <ChecklistCard
              category={cat.category}
              title={cat.title}
              icon={cat.icon}
              items={cat.items}
              borderColor={cat.borderColor}
              onToggleItem={(itemId) => handleToggle(i, itemId)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        paddingBottom: '120px',
        minHeight: '100vh',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 10% 20%, rgba(245,114,127,0.05) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(141,130,211,0.05) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      <JejuBanner image="jeju-travelpublicbanner-jeju-03.jpg" />

      <ChecklistHeader completed={completedItems} total={totalItems} />

      {/* 成员选择器 */}
      <div style={{ padding: '0 12px', marginTop: '8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          overflowX: 'auto', paddingBottom: '4px',
        }}>
          {members.map((member) => {
            const isActive = activeMember === member.id;
            const count = isActive ? completedItems : getMemberCompletedCount(member.id);
            return (
              <button
                key={member.id}
                onClick={() => setActiveMember(member.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px',
                  borderRadius: radius.lg,
                  border: isActive ? `2px solid ${colors.amber}` : `1.5px solid ${colors.borderLight}`,
                  backgroundColor: isActive ? `${colors.amber}15` : '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: typography.fontBody,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: '16px' }}>{member.emoji}</span>
                <span style={{
                  fontSize: '13px', fontWeight: isActive ? 800 : 600,
                  color: isActive ? colors.amber : colors.textSecondary,
                }}>{member.name}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: count === totalItemCount ? colors.forestGreen : colors.textSecondary,
                  backgroundColor: count === totalItemCount ? `${colors.forestGreen}15` : `${colors.borderLight}50`,
                  padding: '1px 6px', borderRadius: '8px',
                }}>{count}/{totalItemCount}</span>
                {/* 长按删除提示：只有非唯一成员才能删 */}
                {members.length > 1 && isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.id); }}
                    style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      backgroundColor: colors.emergencyRed,
                      color: '#FFF', fontSize: '10px', fontWeight: 800,
                      border: '2px solid #FFF',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >×</button>
                )}
              </button>
            );
          })}
          {/* 添加成员按钮 */}
          {!showAddInput && (
            <button
              onClick={() => setShowAddInput(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px',
                borderRadius: radius.lg,
                border: `1.5px dashed ${colors.borderLight}`,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '18px', color: colors.textSecondary,
                flexShrink: 0,
              }}
            >+</button>
          )}
          {showAddInput && (
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddMember(); if (e.key === 'Escape') setShowAddInput(false); }}
                placeholder="输入名字"
                style={{
                  width: '80px', padding: '6px 8px',
                  borderRadius: radius.sm,
                  border: `1.5px solid ${colors.amber}`,
                  fontSize: '13px', fontFamily: typography.fontBody,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAddMember}
                style={{
                  padding: '6px 10px', borderRadius: radius.sm,
                  backgroundColor: colors.amber, color: '#FFF',
                  border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 700,
                  fontFamily: typography.fontBody,
                }}
              >添加</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '12px', marginBottom: '16px' }}>
        <ReminderBanner text="别忘了：护照有效期、韩元现金、转换插头、SIM卡、KakaoTaxi" />
      </div>

      {/* 2列瀑布网格 */}
      <div style={{ display: 'flex', gap: '10px', padding: '0 12px', alignItems: 'flex-start' }}>
        {renderColumn(leftCol)}
        {renderColumn(rightCol)}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.4, fontSize: '20px' }}>
        <span>🤿</span>
        <span style={{ transform: 'rotate(-5deg)' }}>🌴</span>
        <span>🧳</span>
        <span style={{ transform: 'rotate(10deg)' }}>🌺</span>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
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

const MY_NAME_KEY = 'jeju-checklist-myname';
const OLD_STATE_KEY = 'jeju-checklist-state';

function getStateKey(name: string) {
  return `jeju-checklist-${name}`;
}

const initialCategories: CategoryData[] = [
  {
    category: 'documents', title: '证件与文件', icon: '📋', borderColor: colors.cardDocuments,
    items: [
      { id: 'doc-1', label: '护照（有效期6个月以上）', checked: false },
      { id: 'doc-2', label: 'K-ETA / 免签确认', checked: false },
      { id: 'doc-3', label: '机票行程单（去程+回程）', checked: false },
      { id: 'doc-4', label: '酒店预订确认单', checked: false },
      { id: 'doc-5', label: '身份证（国内段备用）', checked: false },
    ],
  },
  {
    category: 'currency', title: '货币与支付', icon: '💰', borderColor: colors.cardCurrency,
    items: [
      { id: 'cur-1', label: '换韩元现金（10-20万/人）', checked: false },
      { id: 'cur-2', label: '开通信用卡境外支付', checked: false },
      { id: 'cur-3', label: '만배회센타备现金（95折）', checked: false },
    ],
  },
  {
    category: 'communication', title: '通讯与导航', icon: '📱', borderColor: colors.cardComms,
    items: [
      { id: 'com-1', label: '韩国SIM卡/境外流量', checked: false },
      { id: 'com-2', label: 'KakaoTaxi 打车', checked: false },
    ],
  },
  {
    category: 'restaurant', title: '餐厅预约', icon: '🍴', borderColor: colors.cardRestaurant,
    items: [
      { id: 'res-1', label: 'Doldam 黑猪肉（4/4晚）', checked: false },
      { id: 'res-2', label: 'Jeju Madang（4/5晚）', checked: false },
      { id: 'res-3', label: '만배회센타（4/6晚）', checked: false },
    ],
  },
  {
    category: 'transportation', title: '交通安排', icon: '🚌', borderColor: colors.cardTransport,
    items: [
      { id: 'tra-1', label: '租车/包车确认', checked: false },
      { id: 'tra-2', label: '牛岛渡轮时刻查询', checked: false },
      { id: 'tra-3', label: '机场→酒店交通确认', checked: false },
    ],
  },
  {
    category: 'packing', title: '行李清单', icon: '🧳', borderColor: colors.cardPacking,
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

function loadSavedState(name: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(getStateKey(name));
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function applyState(cats: CategoryData[], saved: Record<string, boolean>): CategoryData[] {
  return cats.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({ ...item, checked: saved[item.id] ?? false })),
  }));
}

export default function ChecklistPage() {
  const [myName, setMyName] = useState<string | null>(null);
  const [inputName, setInputName] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const [ready, setReady] = useState(false);

  // 读取已保存的名字
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 迁移旧数据
    try {
      const oldData = localStorage.getItem(OLD_STATE_KEY);
      const oldName = localStorage.getItem(MY_NAME_KEY);
      if (oldData && oldName && !localStorage.getItem(getStateKey(oldName))) {
        localStorage.setItem(getStateKey(oldName), oldData);
        localStorage.removeItem(OLD_STATE_KEY);
      } else if (oldData && !oldName) {
        localStorage.removeItem(OLD_STATE_KEY);
      }
    } catch {}

    const saved = localStorage.getItem(MY_NAME_KEY);
    if (saved) {
      setMyName(saved);
      setCategories(applyState(initialCategories, loadSavedState(saved)));
    }
    setReady(true);
  }, []);

  const handleSetName = () => {
    const name = inputName.trim();
    if (!name) return;
    localStorage.setItem(MY_NAME_KEY, name);
    setMyName(name);
    setCategories(applyState(initialCategories, loadSavedState(name)));
  };

  const handleChangeName = () => {
    setMyName(null);
    setInputName('');
  };

  const handleToggle = (categoryIndex: number, itemId: string) => {
    if (!myName) return;
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
      try { localStorage.setItem(getStateKey(myName), JSON.stringify(state)); } catch {}
      return next;
    });
  };

  const allItems = categories.flatMap((c) => c.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => i.checked).length;

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

  if (!ready) return null;

  // 首次进入 — 输入名字
  if (!myName) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)',
        fontFamily: typography.fontBody,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
        <h2 style={{
          fontSize: '22px', fontWeight: 900, color: colors.primary,
          fontFamily: typography.fontDisplay, margin: '0 0 8px',
        }}>你是谁？</h2>
        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px', textAlign: 'center' }}>
          输入你的名字，开始你的专属清单
        </p>
        <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '280px' }}>
          <input
            autoFocus
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSetName(); }}
            placeholder="输入名字..."
            style={{
              flex: 1, padding: '12px 16px',
              borderRadius: radius.lg,
              border: `2px solid ${colors.border}`,
              fontSize: '16px', fontFamily: typography.fontBody,
              outline: 'none',
              filter: 'url(#sketchy)',
            }}
          />
          <button
            onClick={handleSetName}
            style={{
              padding: '12px 20px', borderRadius: radius.lg,
              backgroundColor: colors.amber, color: '#FFF',
              border: 'none', cursor: 'pointer',
              fontSize: '15px', fontWeight: 800,
              fontFamily: typography.fontBody,
              boxShadow: '0 2px 8px rgba(255,191,0,0.3)',
            }}
          >开始</button>
        </div>
      </div>
    );
  }

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

      {/* 切换用户（小字） */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: '6px', margin: '0 16px 8px',
      }}>
        <button
          onClick={handleChangeName}
          style={{
            fontSize: '11px', color: colors.textSecondary,
            background: 'none', border: `1px solid ${colors.borderLight}`,
            borderRadius: '8px', padding: '2px 8px', cursor: 'pointer',
            fontFamily: typography.fontBody,
          }}
        >切换身份</button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <ReminderBanner text="别忘了：护照有效期、韩元现金、转换插头、SIM卡、KakaoTaxi" />
      </div>

      {/* 2列瀑布网格 */}
      <div style={{ display: 'flex', gap: '10px', padding: '0 12px', alignItems: 'flex-start' }}>
        {renderColumn(leftCol)}
        {renderColumn(rightCol)}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.4, fontSize: '20px' }}>
        <span>🤿</span><span style={{ transform: 'rotate(-5deg)' }}>🌴</span>
        <span>🧳</span><span style={{ transform: 'rotate(10deg)' }}>🌺</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: colors.textSecondary, fontFamily: typography.fontHand, opacity: 0.5 }}>
        ~ check everything before you go ~
      </div>
    </div>
  );
}

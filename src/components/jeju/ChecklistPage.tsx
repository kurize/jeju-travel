'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { colors, typography, radius } from '@/lib/theme';
import ChecklistHeader from './ChecklistHeader';
import ReminderBanner from './ReminderBanner';
import ChecklistCard, { ChecklistCategory } from './ChecklistCard';
import JejuBanner from './JejuBanner';
import {
  getChecklistCategories,
  getChecklistItems,
  getChecklistChecks,
  toggleChecklistItem,
} from '@/lib/trips';
import type { ChecklistCategoryRecord, ChecklistItemRecord } from '@/lib/types';

interface CategoryWithItems {
  category: ChecklistCategory;
  title: string;
  icon: string;
  borderColor: string;
  items: { id: string; label: string; checked: boolean }[];
}

const MY_NAME_KEY = 'jeju-checklist-myname';

interface ChecklistPageProps {
  tripId: string;
}

export default function ChecklistPage({ tripId }: ChecklistPageProps) {
  const [myName, setMyName] = useState<string | null>(null);
  const [inputName, setInputName] = useState('');
  const [categories, setCategories] = useState<CategoryWithItems[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // 读取已保存的名字
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(MY_NAME_KEY);
    if (saved) setMyName(saved);
    setReady(true);
  }, []);

  // 从 Supabase 加载清单数据
  const loadChecklist = useCallback(async (userName: string | null) => {
    setLoading(true);
    const cats = await getChecklistCategories(tripId);
    if (cats.length === 0) {
      setCategories([]);
      setLoading(false);
      return;
    }

    // 加载所有条目
    const allItems: (ChecklistItemRecord & { categoryId: string })[] = [];
    for (const cat of cats) {
      const items = await getChecklistItems(cat.id);
      items.forEach((item) => allItems.push({ ...item, categoryId: cat.id }));
    }

    // 加载勾选状态
    let checksMap: Record<string, boolean> = {};
    if (userName) {
      const itemIds = allItems.map((i) => i.id);
      if (itemIds.length > 0) {
        const checks = await getChecklistChecks(itemIds, 'local', userName);
        checks.forEach((c) => { checksMap[c.item_id] = c.checked; });
      }
    }

    // 组装数据
    const result: CategoryWithItems[] = cats.map((cat) => ({
      category: cat.category as ChecklistCategory,
      title: cat.title,
      icon: cat.icon || '📋',
      borderColor: cat.border_color || colors.border,
      items: allItems
        .filter((item) => item.categoryId === cat.id)
        .map((item) => ({
          id: item.id,
          label: item.label,
          checked: checksMap[item.id] ?? false,
        })),
    }));

    setCategories(result);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    if (!ready) return;
    loadChecklist(myName);
  }, [ready, myName, loadChecklist]);

  const handleSetName = () => {
    const name = inputName.trim();
    if (!name) return;
    localStorage.setItem(MY_NAME_KEY, name);
    setMyName(name);
  };

  const handleChangeName = () => {
    setMyName(null);
    setInputName('');
  };

  const handleToggle = async (categoryIndex: number, itemId: string) => {
    if (!myName) return;
    // 乐观更新
    setCategories((prev) => {
      return prev.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      });
    });
    // 查找当前状态
    const cat = categories[categoryIndex];
    const item = cat?.items.find((i) => i.id === itemId);
    if (item) {
      await toggleChecklistItem(itemId, !item.checked, 'local', myName);
    }
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0' }}>
        <div style={{ textAlign: 'center', fontFamily: typography.fontBody }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>加载清单中...</div>
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

      {/* 切换用户 */}
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

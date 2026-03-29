'use client';

import React, { useState } from 'react';
import { colors } from '@/lib/theme';
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

export default function ChecklistPage() {
  const [categories, setCategories] = useState(initialCategories);

  const allItems = categories.flatMap((c) => c.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => i.checked).length;

  const handleToggle = (categoryIndex: number, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
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
            {/* 装饰 — 不受滤镜影响 */}
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

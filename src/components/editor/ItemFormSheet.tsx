'use client';

import React, { useState, useEffect } from 'react';
import { colors, typography, radius } from '@/lib/theme';
import type { TimelineItemRecord, Tag, TagType } from '@/lib/types';

// 圆点颜色选项
const DOT_COLORS = [
  { value: '#FF6B9D', label: '餐厅' },
  { value: '#4CAF50', label: '景点' },
  { value: '#8B4513', label: '咖啡' },
  { value: '#BDD8DB', label: '酒店' },
  { value: '#8D82D3', label: '交通' },
  { value: '#F5727F', label: '当前' },
];

// 标签类型选项
const TAG_OPTIONS: { type: TagType; label: string }[] = [
  { type: 'dining', label: '用餐' },
  { type: 'coffee', label: '咖啡' },
  { type: 'hiking', label: '徒步' },
  { type: 'transport', label: '交通' },
  { type: 'default', label: '海滩' },
  { type: 'default', label: '拍照' },
  { type: 'default', label: '购物' },
  { type: 'default', label: '人文' },
  { type: 'default', label: '赏樱' },
  { type: 'default', label: '骑行' },
];

interface ItemFormSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TimelineItemRecord>) => void;
  initialData?: Partial<TimelineItemRecord>;
}

export default function ItemFormSheet({ open, onClose, onSubmit, initialData }: ItemFormSheetProps) {
  const [type, setType] = useState<'activity' | 'transport'>(initialData?.type || 'activity');
  // 活动字段
  const [time, setTime] = useState(initialData?.time || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [koreanTitle, setKoreanTitle] = useState(initialData?.korean_title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [typeLabel, setTypeLabel] = useState(initialData?.type_label || '');
  const [dotColor, setDotColor] = useState(initialData?.dot_color || '#4CAF50');
  const [tags, setTags] = useState<Tag[]>(initialData?.tags || []);
  const [learnMoreContent, setLearnMoreContent] = useState(initialData?.learn_more_content || '');
  const [learnMoreImage, setLearnMoreImage] = useState(initialData?.learn_more_image || '');
  const [bgTint, setBgTint] = useState(initialData?.bg_tint || '');
  // 交通字段
  const [mode, setMode] = useState(initialData?.mode || '包车');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [destination, setDestination] = useState(initialData?.destination || '');

  // 重置表单
  useEffect(() => {
    if (open && initialData) {
      setType(initialData.type || 'activity');
      setTime(initialData.time || '');
      setTitle(initialData.title || '');
      setKoreanTitle(initialData.korean_title || '');
      setDescription(initialData.description || '');
      setTypeLabel(initialData.type_label || '');
      setDotColor(initialData.dot_color || '#4CAF50');
      setTags(initialData.tags || []);
      setLearnMoreContent(initialData.learn_more_content || '');
      setLearnMoreImage(initialData.learn_more_image || '');
      setBgTint(initialData.bg_tint || '');
      setMode(initialData.mode || '包车');
      setDuration(initialData.duration || '');
      setDestination(initialData.destination || '');
    } else if (open && !initialData) {
      setType('activity');
      setTime('');
      setTitle('');
      setKoreanTitle('');
      setDescription('');
      setTypeLabel('');
      setDotColor('#4CAF50');
      setTags([]);
      setLearnMoreContent('');
      setLearnMoreImage('');
      setBgTint('');
      setMode('包车');
      setDuration('');
      setDestination('');
    }
  }, [open, initialData]);

  const toggleTag = (tag: Tag) => {
    setTags((prev) => {
      const exists = prev.find((t) => t.type === tag.type && t.label === tag.label);
      if (exists) return prev.filter((t) => !(t.type === tag.type && t.label === tag.label));
      return [...prev, tag];
    });
  };

  const handleSubmit = () => {
    if (type === 'activity' && !title.trim()) return;
    if (type === 'transport' && !destination.trim()) return;

    const data: Partial<TimelineItemRecord> = { type };
    if (type === 'activity') {
      data.time = time || null;
      data.title = title;
      data.korean_title = koreanTitle || null;
      data.description = description || null;
      data.type_label = typeLabel || null;
      data.dot_color = dotColor;
      data.tags = tags;
      data.learn_more_content = learnMoreContent || null;
      data.learn_more_image = learnMoreImage || null;
      data.bg_tint = bgTint || null;
    } else {
      data.mode = mode;
      data.duration = duration || null;
      data.destination = destination;
    }
    onSubmit(data);
  };

  if (!open) return null;

  const isEdit = !!initialData;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    borderRadius: radius.sm, border: `1.5px solid ${colors.border}`,
    fontSize: '14px', fontFamily: typography.fontBody,
    outline: 'none', boxSizing: 'border-box',
    backgroundColor: '#FEFEFE',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 700, color: colors.textSecondary,
    display: 'block', marginBottom: '4px',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px', maxHeight: '85vh',
          backgroundColor: '#FFF', borderRadius: '24px 24px 0 0',
          padding: '20px 20px 36px',
          fontFamily: typography.fontBody,
          overflowY: 'auto',
        }}
      >
        <h3 style={{
          fontSize: '18px', fontWeight: 900, color: colors.primary,
          fontFamily: typography.fontDisplay, margin: '0 0 16px', textAlign: 'center',
        }}>{isEdit ? '编辑条目' : '添加条目'}</h3>

        {/* 类型切换 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['activity', 'transport'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1, padding: '8px', borderRadius: radius.sm,
                border: type === t ? `2px solid ${colors.primary}` : `1.5px solid ${colors.border}`,
                backgroundColor: type === t ? `${colors.primary}10` : 'transparent',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                color: type === t ? colors.primary : colors.textSecondary,
                fontFamily: typography.fontBody,
              }}
            >{t === 'activity' ? '🎯 活动' : '🚗 交通'}</button>
          ))}
        </div>

        {type === 'activity' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 时间 + 类型标签 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>时间</label>
                <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:00" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>类型标签</label>
                <input value={typeLabel} onChange={(e) => setTypeLabel(e.target.value)} placeholder="午餐/景点/打卡" style={inputStyle} />
              </div>
            </div>

            {/* 标题 */}
            <div>
              <label style={labelStyle}>标题 *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="景点/餐厅名称" style={inputStyle} />
            </div>

            {/* 韩文名 */}
            <div>
              <label style={labelStyle}>韩文名</label>
              <input value={koreanTitle} onChange={(e) => setKoreanTitle(e.target.value)} placeholder="한국어 이름" style={inputStyle} />
            </div>

            {/* 描述 */}
            <div>
              <label style={labelStyle}>描述</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* 圆点颜色 */}
            <div>
              <label style={labelStyle}>圆点颜色</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {DOT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setDotColor(c.value)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: c.value, border: dotColor === c.value ? '3px solid #333' : '2px solid #eee',
                      cursor: 'pointer',
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* 标签 */}
            <div>
              <label style={labelStyle}>标签</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {TAG_OPTIONS.map((t, i) => {
                  const active = tags.some((tag) => tag.type === t.type && tag.label === t.label);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleTag(t)}
                      style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                        border: active ? `2px solid ${colors.primary}` : `1.5px solid ${colors.borderLight}`,
                        backgroundColor: active ? `${colors.primary}15` : 'transparent',
                        color: active ? colors.primary : colors.textSecondary,
                        cursor: 'pointer', fontFamily: typography.fontBody, fontWeight: 600,
                      }}
                    >{t.label}</button>
                  );
                })}
              </div>
            </div>

            {/* 详情 */}
            <div>
              <label style={labelStyle}>详细介绍</label>
              <textarea value={learnMoreContent} onChange={(e) => setLearnMoreContent(e.target.value)} placeholder="展开后显示的详细信息..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* 图片 */}
            <div>
              <label style={labelStyle}>图片路径</label>
              <input value={learnMoreImage} onChange={(e) => setLearnMoreImage(e.target.value)} placeholder="/places/xxx.jpg" style={inputStyle} />
            </div>

            {/* 背景色 */}
            <div>
              <label style={labelStyle}>背景色</label>
              <input value={bgTint} onChange={(e) => setBgTint(e.target.value)} placeholder="#FFF5F5" style={inputStyle} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 交通方式 */}
            <div>
              <label style={labelStyle}>交通方式</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['包车', '步行', '渡轮', '巴士', '出租车'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      padding: '6px 12px', borderRadius: '12px', fontSize: '13px',
                      border: mode === m ? `2px solid ${colors.lavender}` : `1.5px solid ${colors.borderLight}`,
                      backgroundColor: mode === m ? `${colors.lavender}15` : 'transparent',
                      color: mode === m ? colors.lavender : colors.textSecondary,
                      cursor: 'pointer', fontFamily: typography.fontBody, fontWeight: 600,
                    }}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* 时长 */}
            <div>
              <label style={labelStyle}>时长</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30分钟" style={inputStyle} />
            </div>

            {/* 目的地 */}
            <div>
              <label style={labelStyle}>目的地 *</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="下一个目的地" style={inputStyle} />
            </div>
          </div>
        )}

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: radius.lg,
              border: `2px solid ${colors.border}`, backgroundColor: 'transparent',
              fontSize: '15px', fontWeight: 700, color: colors.textSecondary,
              cursor: 'pointer', fontFamily: typography.fontBody,
            }}
          >取消</button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, padding: '12px', borderRadius: radius.lg,
              border: 'none', backgroundColor: colors.primary, color: '#FFF',
              fontSize: '15px', fontWeight: 800, cursor: 'pointer',
              fontFamily: typography.fontBody,
            }}
          >{isEdit ? '保存' : '添加'}</button>
        </div>
      </div>
    </div>
  );
}

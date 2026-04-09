'use client';

import React, { useState, useCallback } from 'react';
import { colors, typography, radius } from '@/lib/theme';
import { useTripContext } from '@/lib/TripContext';
import {
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimelineItems,
  createTripDay,
  updateTripDay,
  deleteTripDay,
} from '@/lib/mutations';
import DayTab from './DayTab';
import TimelineActivityCard from './TimelineActivityCard';
import TimelineTransportPill from './TimelineTransportPill';
import DayMapLazy from './DayMapLazy';
import JejuBanner from './JejuBanner';
import SortableTimeline, { type DragHandleProps } from '../editor/SortableTimeline';
import ItemFormSheet from '../editor/ItemFormSheet';
import type { TimelineItemRecord, MapStopRecord } from '@/lib/types';
import type { MapStop } from './DayMapLazy';
import { Pencil, GripVertical, Plus, Trash2, X } from 'lucide-react';

// 将 DB 记录转为地图组件需要的格式
function toMapStops(records: MapStopRecord[]): MapStop[] {
  return records.map((r) => ({
    name: r.name,
    coord: [r.lat, r.lng] as [number, number],
    emoji: r.emoji || '📍',
    type: (r.type || 'attraction') as MapStop['type'],
  }));
}

export default function TimelinePage() {
  const {
    trip, days, timelineItems, mapStops, loading,
    activeDayIndex, setActiveDayIndex,
    editMode, setEditMode,
    setTimelineItems, setDays, refetchDay, refetch,
  } = useTripContext();

  // 编辑表单状态
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItemRecord | null>(null);
  const [insertAfterIndex, setInsertAfterIndex] = useState<number>(-1);

  // 日程编辑状态
  const [dayFormOpen, setDayFormOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<{ id: string; day_label: string; date: string; emoji: string; theme: string } | null>(null);

  // 编辑条目
  const handleEditItem = useCallback((item: TimelineItemRecord) => {
    setEditingItem(item);
    setFormOpen(true);
  }, []);

  // 添加条目（在指定位置后插入）
  const handleAddItem = useCallback((afterIndex: number) => {
    setEditingItem(null);
    setInsertAfterIndex(afterIndex);
    setFormOpen(true);
  }, []);

  // 删除条目
  const handleDeleteItem = useCallback(async (item: TimelineItemRecord) => {
    if (!confirm('确定要删除这个条目吗？')) return;
    // 乐观更新
    setTimelineItems((prev) => prev.filter((i) => i.id !== item.id));
    await deleteTimelineItem(item.id);
  }, [setTimelineItems]);

  // 表单提交
  const handleFormSubmit = useCallback(async (data: Partial<TimelineItemRecord>) => {
    const currentDay = days[activeDayIndex];
    if (!currentDay) return;

    if (editingItem) {
      // 编辑模式
      setTimelineItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i)),
      );
      await updateTimelineItem(editingItem.id, data);
    } else {
      // 新增模式
      const sortOrder = insertAfterIndex >= 0 ? insertAfterIndex + 1 : timelineItems.length;
      const newItem = await createTimelineItem(currentDay.id, {
        ...data,
        type: data.type || 'activity',
        sort_order: sortOrder,
      });
      if (newItem) {
        // 更新后续条目的 sort_order 并插入新条目
        setTimelineItems((prev) => {
          const updated = prev.map((item) =>
            item.sort_order >= sortOrder ? { ...item, sort_order: item.sort_order + 1 } : item,
          );
          return [...updated, newItem].sort((a, b) => a.sort_order - b.sort_order);
        });
      }
    }
    setFormOpen(false);
    setEditingItem(null);
  }, [editingItem, insertAfterIndex, days, activeDayIndex, timelineItems.length, setTimelineItems]);

  // 拖拽排序
  const handleReorder = useCallback((newItems: TimelineItemRecord[]) => {
    setTimelineItems(newItems);
    const dayId = days[activeDayIndex]?.id;
    if (dayId) {
      reorderTimelineItems(dayId, newItems.map((i) => i.id));
    }
  }, [days, activeDayIndex, setTimelineItems]);

  // 添加新天
  const handleAddDay = useCallback(async () => {
    if (!trip) return;
    const newDayNum = days.length + 1;
    const day = await createTripDay(trip.id, {
      day_label: `D${newDayNum}`,
      emoji: '📅',
      sort_order: days.length,
    });
    if (day) {
      setDays((prev) => [...prev, day]);
      setActiveDayIndex(days.length);
    }
  }, [trip, days.length, setDays, setActiveDayIndex]);

  // 编辑天
  const handleEditDay = useCallback((day: typeof days[0]) => {
    setEditingDay({
      id: day.id,
      day_label: day.day_label,
      date: day.date || '',
      emoji: day.emoji || '📅',
      theme: day.theme || '',
    });
    setDayFormOpen(true);
  }, []);

  // 保存天编辑
  const handleSaveDayEdit = useCallback(async () => {
    if (!editingDay) return;
    setDays((prev) =>
      prev.map((d) => (d.id === editingDay.id ? { ...d, ...editingDay } : d)),
    );
    await updateTripDay(editingDay.id, {
      day_label: editingDay.day_label,
      date: editingDay.date || null,
      emoji: editingDay.emoji || null,
      theme: editingDay.theme || null,
    } as any);
    setDayFormOpen(false);
    setEditingDay(null);
  }, [editingDay, setDays]);

  // 删除天
  const handleDeleteDay = useCallback(async (dayId: string) => {
    if (!confirm('删除这一天会同时删除所有条目，确定吗？')) return;
    const idx = days.findIndex((d) => d.id === dayId);
    setDays((prev) => prev.filter((d) => d.id !== dayId));
    if (activeDayIndex >= days.length - 1) setActiveDayIndex(Math.max(0, days.length - 2));
    await deleteTripDay(dayId);
    setDayFormOpen(false);
    setEditingDay(null);
  }, [days, activeDayIndex, setDays, setActiveDayIndex]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0' }}>
        <div style={{ textAlign: 'center', fontFamily: typography.fontBody }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✈️</div>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>加载行程中...</div>
        </div>
      </div>
    );
  }

  if (!trip || days.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0' }}>
        <div style={{ textAlign: 'center', fontFamily: typography.fontBody }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>暂无行程数据</div>
          {!trip?.is_template && (
            <button
              onClick={handleAddDay}
              style={{
                marginTop: '16px', padding: '10px 20px', borderRadius: radius.lg,
                backgroundColor: colors.primary, color: '#FFF', border: 'none',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                fontFamily: typography.fontBody,
              }}
            >+ 添加第一天</button>
          )}
        </div>
      </div>
    );
  }

  const currentDay = days[activeDayIndex];
  const bannerImage = trip.cover_image || 'jeju-travelpublicbanner-jeju-01.jpg';
  const isTemplate = trip.is_template;

  // 渲染单个时间轴条目（编辑模式 / 普通模式共用）
  const renderTimelineItem = (item: TimelineItemRecord, index: number, dragHandleProps: DragHandleProps | null) => {
    const isActivity = item.type !== 'transport';
    // 计算 step number（只统计当前 item 之前的 activity 数量 + 1）
    let stepNum = 0;
    if (isActivity) {
      for (let i = 0; i <= index; i++) {
        if (timelineItems[i]?.type !== 'transport') stepNum++;
      }
    }
    const isFirst = index === 0;
    const isLast = index === timelineItems.length - 1;
    const dotColor = item.dot_color || colors.dotFuture;

    return (
      <>
        <div style={{ display: 'flex', gap: '0' }}>
          {/* 左侧轨道 */}
          <div style={{
            width: editMode ? '52px' : '40px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            {/* 拖拽手柄 */}
            {editMode && dragHandleProps && (
              <div
                ref={dragHandleProps.ref}
                {...dragHandleProps.listeners}
                {...dragHandleProps.attributes}
                style={{
                  position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)',
                  width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'grab', color: colors.textMuted, zIndex: 2,
                }}
              >
                <GripVertical size={16} />
              </div>
            )}
            {/* 上半段线 */}
            <div style={{
              width: '2px', flex: 1,
              backgroundColor: isFirst ? 'transparent' : colors.timelineLine,
            }} />
            {/* 圆点 */}
            {isActivity ? (
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                backgroundColor: dotColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 0 3px ${dotColor}25`,
              }}>
                <span style={{
                  fontSize: '12px', fontWeight: 800, color: '#FFFFFF',
                  fontFamily: typography.fontBody,
                }}>{stepNum}</span>
              </div>
            ) : (
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: colors.lavender,
                flexShrink: 0,
                boxShadow: `0 0 0 2px ${colors.lavender}25`,
              }} />
            )}
            {/* 下半段线 */}
            <div style={{
              width: '2px', flex: 1,
              backgroundColor: isLast ? 'transparent' : colors.timelineLine,
            }} />
          </div>

          {/* 右侧内容 */}
          <div style={{ flex: 1, padding: '8px 0', minWidth: 0, position: 'relative' }}>
            {/* 编辑/删除按钮 */}
            {editMode && (
              <div style={{
                position: 'absolute', top: '8px', right: '0', zIndex: 3,
                display: 'flex', gap: '4px',
              }}>
                <button
                  onClick={() => handleEditItem(item)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: `${colors.amber}20`, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><Pencil size={14} color={colors.amber} /></button>
                <button
                  onClick={() => handleDeleteItem(item)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: `${colors.emergencyRed}15`, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><Trash2 size={14} color={colors.emergencyRed} /></button>
              </div>
            )}

            {isActivity ? (
              <>
                {item.time && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    marginBottom: '6px',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    backgroundColor: `${dotColor}18`,
                    border: `1.5px solid ${dotColor}40`,
                  }}>
                    <span style={{
                      fontSize: '13px', fontWeight: 800,
                      color: dotColor,
                      fontFamily: typography.fontBody,
                    }}>{item.time}</span>
                  </div>
                )}
                <TimelineActivityCard
                  title={item.title || ''}
                  koreanTitle={item.korean_title || undefined}
                  description={item.description || undefined}
                  typeLabel={item.type_label || undefined}
                  tags={item.tags || []}
                  learnMoreContent={editMode ? undefined : (item.learn_more_content || undefined)}
                  learnMoreImage={editMode ? undefined : (item.learn_more_image || undefined)}
                  bgTint={item.bg_tint || undefined}
                />
              </>
            ) : (
              <TimelineTransportPill
                mode={item.mode || ''}
                duration={item.duration || ''}
                destination={item.destination || ''}
              />
            )}
          </div>
        </div>

        {/* 编辑模式：条目间的 + 按钮 */}
        {editMode && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
            <button
              onClick={() => handleAddItem(index)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: `${colors.primary}12`, border: `1.5px dashed ${colors.primary}40`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${colors.primary}25`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${colors.primary}12`; }}
            ><Plus size={14} color={colors.primary} /></button>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      style={{
        paddingBottom: '120px',
        minHeight: '100vh',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 85% 10%, rgba(141,130,211,0.06) 0%, transparent 50%),
          radial-gradient(circle at 15% 80%, rgba(245,114,127,0.04) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      {/* 横幅 */}
      <JejuBanner image={bannerImage} />

      {/* 编辑模式切换按钮 */}
      {!isTemplate && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 16px 0' }}>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 12px', borderRadius: '12px',
              backgroundColor: editMode ? colors.primary : `${colors.primary}12`,
              color: editMode ? '#FFF' : colors.primary,
              border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700,
              fontFamily: typography.fontBody,
              transition: 'all 0.2s',
            }}
          >
            {editMode ? <><X size={14} /> 完成</> : <><Pencil size={14} /> 编辑</>}
          </button>
        </div>
      )}

      {/* 日期选择器 */}
      <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {days.map((day, i) => (
          <div key={day.id} style={{ position: 'relative' }}>
            <DayTab
              day={day.day_label}
              date={day.date || ''}
              emoji={day.emoji || '📅'}
              active={activeDayIndex === i}
              onClick={() => setActiveDayIndex(i)}
            />
            {editMode && activeDayIndex === i && (
              <button
                onClick={() => handleEditDay(day)}
                style={{
                  position: 'absolute', top: '-6px', right: '-6px', zIndex: 5,
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: colors.amber, border: '2px solid #FFF',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              ><Pencil size={10} color="#FFF" /></button>
            )}
          </div>
        ))}
        {editMode && (
          <button
            onClick={handleAddDay}
            style={{
              padding: '8px 14px', borderRadius: radius.xl,
              border: `2px dashed ${colors.primary}40`,
              backgroundColor: `${colors.primary}08`,
              cursor: 'pointer', fontSize: '13px', fontWeight: 700,
              color: colors.primary, fontFamily: typography.fontBody,
              whiteSpace: 'nowrap',
            }}
          >+ 添加天</button>
        )}
      </div>

      {/* 今日主题 */}
      {currentDay?.theme && (
        <div style={{
          margin: '0 16px 16px', padding: '10px 14px',
          backgroundColor: `${colors.amber}15`, borderRadius: '12px',
          border: `2px dashed ${colors.amber}50`,
          fontFamily: typography.fontDisplay,
          position: 'relative',
          filter: 'url(#sketchy)',
        }}>
          <span style={{ position: 'absolute', top: '-8px', right: '14px', fontSize: '14px' }}>✨</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.amber }}>
            {currentDay.emoji} 今日主题：{currentDay.theme}
          </span>
        </div>
      )}

      {/* 地图 */}
      {mapStops.length > 0 && <DayMapLazy stops={toMapStops(mapStops)} />}

      {/* 编辑模式：最顶部的 + 按钮 */}
      {editMode && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 2px' }}>
          <button
            onClick={() => handleAddItem(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 14px', borderRadius: '12px',
              backgroundColor: `${colors.primary}10`, border: `1.5px dashed ${colors.primary}30`,
              cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              color: colors.primary, fontFamily: typography.fontBody,
            }}
          ><Plus size={14} /> 添加条目</button>
        </div>
      )}

      {/* 时间轴 */}
      <div style={{ padding: '0 16px' }}>
        {editMode ? (
          <SortableTimeline
            items={timelineItems}
            onReorder={handleReorder}
            renderItem={(item, index, dragHandleProps) => renderTimelineItem(item, index, dragHandleProps)}
            renderOverlay={(item) => (
              <div style={{ opacity: 0.8, transform: 'scale(1.02)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                {item.type === 'activity' ? (
                  <TimelineActivityCard title={item.title || ''} bgTint={item.bg_tint || undefined} />
                ) : (
                  <TimelineTransportPill mode={item.mode || ''} duration={item.duration || ''} destination={item.destination || ''} />
                )}
              </div>
            )}
          />
        ) : (
          // 非编辑模式：原始渲染
          (() => {
            let step = 0;
            return timelineItems.map((item, index) => {
              const isActivity = item.type !== 'transport';
              if (isActivity) step++;
              const currentStep = step;
              const isFirst = index === 0;
              const isLast = index === timelineItems.length - 1;
              const dotColor = item.dot_color || colors.dotFuture;

              return (
                <div key={item.id} style={{ display: 'flex', gap: '0' }}>
                  <div style={{
                    width: '40px', flexShrink: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <div style={{ width: '2px', flex: 1, backgroundColor: isFirst ? 'transparent' : colors.timelineLine }} />
                    {isActivity ? (
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        backgroundColor: dotColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: `0 0 0 3px ${dotColor}25`,
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', fontFamily: typography.fontBody }}>{currentStep}</span>
                      </div>
                    ) : (
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        backgroundColor: colors.lavender, flexShrink: 0,
                        boxShadow: `0 0 0 2px ${colors.lavender}25`,
                      }} />
                    )}
                    <div style={{ width: '2px', flex: 1, backgroundColor: isLast ? 'transparent' : colors.timelineLine }} />
                  </div>
                  <div style={{ flex: 1, padding: '8px 0', minWidth: 0 }}>
                    {isActivity ? (
                      <>
                        {item.time && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', marginBottom: '6px',
                            padding: '2px 10px', borderRadius: '10px',
                            backgroundColor: `${dotColor}18`, border: `1.5px solid ${dotColor}40`,
                          }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: dotColor, fontFamily: typography.fontBody }}>{item.time}</span>
                          </div>
                        )}
                        <TimelineActivityCard
                          title={item.title || ''}
                          koreanTitle={item.korean_title || undefined}
                          description={item.description || undefined}
                          typeLabel={item.type_label || undefined}
                          tags={item.tags || []}
                          learnMoreContent={item.learn_more_content || undefined}
                          learnMoreImage={item.learn_more_image || undefined}
                          bgTint={item.bg_tint || undefined}
                        />
                      </>
                    ) : (
                      <TimelineTransportPill mode={item.mode || ''} duration={item.duration || ''} destination={item.destination || ''} />
                    )}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.4, fontSize: '20px' }}>
        <span>🤿</span><span style={{ transform: 'rotate(-5deg)' }}>🌴</span>
        <span>🧳</span><span style={{ transform: 'rotate(10deg)' }}>🌺</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: colors.textSecondary, fontFamily: typography.fontHand, opacity: 0.5 }}>
        ~ have a wonderful trip ~
      </div>

      {/* 条目编辑表单 */}
      <ItemFormSheet
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingItem(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingItem || undefined}
      />

      {/* 天编辑弹窗 */}
      {dayFormOpen && editingDay && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
          onClick={() => { setDayFormOpen(false); setEditingDay(null); }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '420px',
              backgroundColor: '#FFF', borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px',
              fontFamily: typography.fontBody,
            }}
          >
            <h3 style={{
              fontSize: '18px', fontWeight: 900, color: colors.primary,
              fontFamily: typography.fontDisplay, margin: '0 0 16px', textAlign: 'center',
            }}>编辑日程</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>标签</label>
                  <input value={editingDay.day_label} onChange={(e) => setEditingDay({ ...editingDay, day_label: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>日期</label>
                  <input value={editingDay.date} onChange={(e) => setEditingDay({ ...editingDay, date: e.target.value })} placeholder="4/4" style={{ width: '100%', padding: '10px', borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>Emoji</label>
                <input value={editingDay.emoji} onChange={(e) => setEditingDay({ ...editingDay, emoji: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>主题</label>
                <input value={editingDay.theme} onChange={(e) => setEditingDay({ ...editingDay, theme: e.target.value })} placeholder="西线：休闲海景" style={{ width: '100%', padding: '10px', borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => handleDeleteDay(editingDay.id)}
                style={{
                  padding: '12px', borderRadius: radius.lg,
                  border: `2px solid ${colors.emergencyRed}`, backgroundColor: 'transparent',
                  fontSize: '14px', fontWeight: 700, color: colors.emergencyRed,
                  cursor: 'pointer', fontFamily: typography.fontBody,
                }}
              >删除</button>
              <button
                onClick={() => { setDayFormOpen(false); setEditingDay(null); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: radius.lg,
                  border: `2px solid ${colors.border}`, backgroundColor: 'transparent',
                  fontSize: '15px', fontWeight: 700, color: colors.textSecondary,
                  cursor: 'pointer', fontFamily: typography.fontBody,
                }}
              >取消</button>
              <button
                onClick={handleSaveDayEdit}
                style={{
                  flex: 1, padding: '12px', borderRadius: radius.lg,
                  border: 'none', backgroundColor: colors.primary, color: '#FFF',
                  fontSize: '15px', fontWeight: 800, cursor: 'pointer',
                  fontFamily: typography.fontBody,
                }}
              >保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

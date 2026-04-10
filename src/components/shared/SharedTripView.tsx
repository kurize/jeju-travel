'use client';

import React, { useState } from 'react';
import { colors, typography, radius } from '@/lib/theme';
import { useTripContext } from '@/lib/TripContext';
import { forkTrip } from '@/lib/sharing';
import { useRouter } from 'next/navigation';
import DayTab from '../jeju/DayTab';
import TimelineActivityCard from '../jeju/TimelineActivityCard';
import TimelineTransportPill from '../jeju/TimelineTransportPill';
import DayMapLazy from '../jeju/DayMapLazy';
import JejuBanner from '../jeju/JejuBanner';
import type { MapStopRecord } from '@/lib/types';
import type { MapStop } from '../jeju/DayMapLazy';

function toMapStops(records: MapStopRecord[]): MapStop[] {
  return records.map((r) => ({
    name: r.name,
    coord: [r.lat, r.lng] as [number, number],
    emoji: r.emoji || '📍',
    type: (r.type || 'attraction') as MapStop['type'],
  }));
}

export default function SharedTripView() {
  const router = useRouter();
  const { trip, days, timelineItems, mapStops, loading, activeDayIndex, setActiveDayIndex } = useTripContext();
  const [forking, setForking] = useState(false);

  const handleFork = async () => {
    if (!trip || forking) return;
    setForking(true);
    const newTrip = await forkTrip(trip.id);
    if (newTrip) {
      router.push(`/trips/${newTrip.id}`);
    } else {
      alert('复制失败，请稍后重试');
      setForking(false);
    }
  };

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
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>该链接无效或已失效</div>
          <button
            onClick={() => router.push('/trips')}
            style={{
              marginTop: '16px', padding: '10px 20px', borderRadius: radius.lg,
              backgroundColor: colors.primary, color: '#FFF', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontBody,
            }}
          >创建我的旅行</button>
        </div>
      </div>
    );
  }

  const currentDay = days[activeDayIndex];
  const bannerImage = trip.cover_image || 'jeju-travelpublicbanner-jeju-01.jpg';

  return (
    <div
      style={{
        paddingBottom: '100px', minHeight: '100vh',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 85% 10%, rgba(141,130,211,0.06) 0%, transparent 50%),
          radial-gradient(circle at 15% 80%, rgba(245,114,127,0.04) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      <JejuBanner image={bannerImage} />

      {/* 旅行信息 */}
      <div style={{ padding: '12px 16px 4px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 900, color: colors.primary, fontFamily: typography.fontDisplay }}>
          {trip.emoji} {trip.title}
        </div>
        {trip.destination && (
          <div style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: typography.fontBody, marginTop: '2px' }}>
            📍 {trip.destination}
          </div>
        )}
      </div>

      {/* 日期选择器 */}
      <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {days.map((day, i) => (
          <DayTab
            key={day.id}
            day={day.day_label}
            date={day.date || ''}
            emoji={day.emoji || '📅'}
            active={activeDayIndex === i}
            onClick={() => setActiveDayIndex(i)}
          />
        ))}
      </div>

      {/* 今日主题 */}
      {currentDay?.theme && (
        <div style={{
          margin: '0 16px 16px', padding: '10px 14px',
          backgroundColor: `${colors.amber}15`, borderRadius: '12px',
          border: `2px dashed ${colors.amber}50`,
          fontFamily: typography.fontDisplay,
          position: 'relative', filter: 'url(#sketchy)',
        }}>
          <span style={{ position: 'absolute', top: '-8px', right: '14px', fontSize: '14px' }}>✨</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.amber }}>
            {currentDay.emoji} 今日主题：{currentDay.theme}
          </span>
        </div>
      )}

      {/* 地图 */}
      {mapStops.length > 0 && <DayMapLazy stops={toMapStops(mapStops)} />}

      {/* 只读时间轴 */}
      <div style={{ padding: '0 16px' }}>
        {(() => {
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
        })()}
      </div>

      {/* Fork 按钮 */}
      <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={handleFork}
          disabled={forking}
          style={{
            width: '100%', padding: '14px', borderRadius: radius.lg,
            backgroundColor: forking ? colors.textMuted : colors.primary,
            color: '#FFF', border: 'none', cursor: forking ? 'default' : 'pointer',
            fontSize: '16px', fontWeight: 800, fontFamily: typography.fontBody,
          }}
        >{forking ? '正在复制...' : '🔀 使用此模板'}</button>
        <button
          onClick={() => router.push('/trips')}
          style={{
            padding: '10px 20px', borderRadius: radius.lg,
            backgroundColor: 'transparent', color: colors.textSecondary,
            border: `1.5px solid ${colors.border}`, cursor: 'pointer',
            fontSize: '14px', fontWeight: 600, fontFamily: typography.fontBody,
          }}
        >创建我的旅行</button>
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.4, fontSize: '20px' }}>
        <span>🤿</span><span style={{ transform: 'rotate(-5deg)' }}>🌴</span>
        <span>🧳</span><span style={{ transform: 'rotate(10deg)' }}>🌺</span>
      </div>
    </div>
  );
}

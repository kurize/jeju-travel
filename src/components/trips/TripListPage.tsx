'use client';

import React, { useState, useEffect } from 'react';
import { colors, typography, radius, shadows } from '@/lib/theme';
import { getTrips, createTrip, deleteTrip } from '@/lib/trips';
import type { Trip } from '@/lib/types';
import TripCard from './TripCard';
import CreateTripModal from './CreateTripModal';
import { useRouter } from 'next/navigation';

export default function TripListPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getTrips().then((data) => {
      setTrips(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (data: { title: string; emoji: string; destination: string }) => {
    const trip = await createTrip(data);
    if (trip) {
      setTrips((prev) => [...prev, trip]);
      setShowCreate(false);
      router.push(`/trips/${trip.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, tripId: string, isTemplate: boolean) => {
    e.stopPropagation();
    if (isTemplate) return;
    if (!confirm('确定要删除这个旅行吗？所有行程数据将被清除。')) return;
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    await deleteTrip(tripId);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingBottom: '40px',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 85% 10%, rgba(141,130,211,0.06) 0%, transparent 50%),
          radial-gradient(circle at 15% 80%, rgba(245,114,127,0.04) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      {/* 顶部 */}
      <div style={{ padding: '40px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>✈️</div>
        <h1 style={{
          fontSize: '24px', fontWeight: 900, color: colors.primary,
          fontFamily: typography.fontDisplay, margin: '0 0 4px',
        }}>我的旅行</h1>
        <p style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: typography.fontBody, margin: 0 }}>
          规划你的下一次旅行
        </p>
      </div>

      {/* 旅行列表 */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: typography.fontBody, color: colors.textSecondary }}>
            加载中...
          </div>
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: typography.fontBody }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
            <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '16px' }}>
              还没有旅行计划，创建一个吧！
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => router.push(`/trips/${trip.id}`)}
                onDelete={trip.is_template ? undefined : (e) => handleDelete(e, trip.id, trip.is_template)}
              />
            ))}
          </div>
        )}

        {/* 探索模板入口 */}
        <button
          onClick={() => router.push('/explore')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', marginTop: '16px', padding: '14px',
            borderRadius: radius.lg,
            border: 'none',
            backgroundColor: `${colors.lavender}15`,
            cursor: 'pointer',
            fontSize: '15px', fontWeight: 700, color: colors.lavender,
            fontFamily: typography.fontBody,
            filter: 'url(#sketchy)',
          }}
        >
          🧭 探索更多模板
        </button>

        {/* 新建旅行按钮 */}
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', marginTop: '8px', padding: '14px',
            borderRadius: radius.lg,
            border: `2px dashed ${colors.border}`,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '15px', fontWeight: 700, color: colors.primary,
            fontFamily: typography.fontBody,
            filter: 'url(#sketchy)',
          }}
        >
          <span style={{ fontSize: '20px' }}>+</span>
          新建旅行
        </button>
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', opacity: 0.4, fontSize: '20px' }}>
        <span>🌏</span><span style={{ transform: 'rotate(-5deg)' }}>🗺️</span>
        <span>🧳</span><span style={{ transform: 'rotate(10deg)' }}>📸</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: colors.textSecondary, fontFamily: typography.fontHand, opacity: 0.5 }}>
        ~ plan your next adventure ~
      </div>

      <CreateTripModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}

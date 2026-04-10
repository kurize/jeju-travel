'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getTripByShareToken } from '@/lib/sharing';
import { TripProvider } from '@/lib/TripContext';
import SharedTripView from '@/components/shared/SharedTripView';
import { colors, typography, radius } from '@/lib/theme';
import { useRouter } from 'next/navigation';

export default function SharedTripPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [tripId, setTripId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getTripByShareToken(token).then((trip) => {
      if (trip) {
        setTripId(trip.id);
      } else {
        setNotFound(true);
      }
    });
  }, [token]);

  if (notFound) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFF8F0', fontFamily: typography.fontBody,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔗</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: colors.textPrimary, fontFamily: typography.fontDisplay }}>
            链接无效
          </div>
          <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '4px' }}>
            该分享链接不存在或已失效
          </div>
          <button
            onClick={() => router.push('/trips')}
            style={{
              marginTop: '20px', padding: '10px 24px', borderRadius: radius.lg,
              backgroundColor: colors.primary, color: '#FFF', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontBody,
            }}
          >创建我的旅行</button>
        </div>
      </div>
    );
  }

  if (!tripId) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFF8F0', fontFamily: typography.fontBody,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✈️</div>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <TripProvider tripId={tripId}>
      <SharedTripView />
    </TripProvider>
  );
}

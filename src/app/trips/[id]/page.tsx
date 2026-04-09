'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TripProvider, useTripContext } from '@/lib/TripContext';
import BottomTabBar, { TabId } from '@/components/jeju/BottomTabBar';
import ChecklistPage from '@/components/jeju/ChecklistPage';
import TimelinePage from '@/components/jeju/TimelinePage';
import InfoPage from '@/components/jeju/InfoPage';
import { ChevronLeft } from 'lucide-react';
import { colors, typography } from '@/lib/theme';

function TripDetailContent() {
  const router = useRouter();
  const { trip } = useTripContext();
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [fadeKey, setFadeKey] = useState(0);
  const tripId = trip?.id || '';

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setFadeKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 返回按钮 */}
      <div style={{
        position: 'fixed', top: '12px', left: 'max(12px, calc(50% - 210px + 12px))',
        zIndex: 50,
      }}>
        <button
          onClick={() => router.push('/trips')}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
            border: `1.5px solid ${colors.border}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <ChevronLeft size={20} color={colors.textPrimary} />
        </button>
      </div>

      <div
        key={fadeKey}
        style={{
          animation: 'fadeSlideIn 0.25s ease-out',
        }}
      >
        {activeTab === 'itinerary' && <TimelinePage />}
        {activeTab === 'checklist' && <ChecklistPage tripId={tripId} />}
        {activeTab === 'info' && <InfoPage tripId={tripId} />}
      </div>
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;

  return (
    <TripProvider tripId={tripId}>
      <TripDetailContent />
    </TripProvider>
  );
}

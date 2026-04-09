'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { TripProvider, useTripContext } from '@/lib/TripContext';
import BottomTabBar, { TabId } from '@/components/jeju/BottomTabBar';
import ChecklistPage from '@/components/jeju/ChecklistPage';
import TimelinePage from '@/components/jeju/TimelinePage';
import InfoPage from '@/components/jeju/InfoPage';

function TripDetailContent() {
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

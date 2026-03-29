'use client';

import { useState, useEffect } from 'react';
import BottomTabBar, { TabId } from '@/components/jeju/BottomTabBar';
import ChecklistPage from '@/components/jeju/ChecklistPage';
import TimelinePage from '@/components/jeju/TimelinePage';
import InfoPage from '@/components/jeju/InfoPage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [fadeKey, setFadeKey] = useState(0);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setFadeKey((k) => k + 1);
    window.scrollTo(0, 0);
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
        {activeTab === 'checklist' && <ChecklistPage />}
        {activeTab === 'info' && <InfoPage />}
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

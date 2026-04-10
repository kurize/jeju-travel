'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TripProvider, useTripContext } from '@/lib/TripContext';
import BottomTabBar, { TabId } from '@/components/jeju/BottomTabBar';
import ChecklistPage from '@/components/jeju/ChecklistPage';
import TimelinePage from '@/components/jeju/TimelinePage';
import InfoPage from '@/components/jeju/InfoPage';
import ShareSheet from '@/components/shared/ShareSheet';
import { generateShareToken } from '@/lib/sharing';
import { ChevronLeft, Share2 } from 'lucide-react';
import { colors } from '@/lib/theme';

function TripDetailContent() {
  const router = useRouter();
  const { trip } = useTripContext();
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [fadeKey, setFadeKey] = useState(0);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const tripId = trip?.id || '';

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setFadeKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (!tripId) return;
    const token = await generateShareToken(tripId);
    if (token) {
      setShareToken(token);
      setShareSheetOpen(true);
    }
  };

  const btnStyle: React.CSSProperties = {
    width: '36px', height: '36px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
    border: `1.5px solid ${colors.border}`,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  return (
    <>
      {/* 返回按钮 */}
      <div style={{ position: 'fixed', top: '12px', left: 'max(12px, calc(50% - 210px + 12px))', zIndex: 50 }}>
        <button onClick={() => router.push('/trips')} style={btnStyle}>
          <ChevronLeft size={20} color={colors.textPrimary} />
        </button>
      </div>

      {/* 分享按钮 */}
      <div style={{ position: 'fixed', top: '12px', right: 'max(12px, calc(50% - 210px + 12px))', zIndex: 50 }}>
        <button onClick={handleShare} style={btnStyle}>
          <Share2 size={18} color={colors.textPrimary} />
        </button>
      </div>

      <div
        key={fadeKey}
        style={{ animation: 'fadeSlideIn 0.25s ease-out' }}
      >
        {activeTab === 'itinerary' && <TimelinePage />}
        {activeTab === 'checklist' && <ChecklistPage tripId={tripId} />}
        {activeTab === 'info' && <InfoPage tripId={tripId} />}
      </div>
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 分享弹窗 */}
      {shareToken && (
        <ShareSheet
          open={shareSheetOpen}
          onClose={() => setShareSheetOpen(false)}
          tripTitle={trip?.title || ''}
          shareToken={shareToken}
        />
      )}

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

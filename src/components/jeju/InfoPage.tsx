'use client';

import React, { useState, useEffect } from 'react';
import { colors, radius, typography } from '@/lib/theme';
import SketchyBorder from './SketchyBorder';
import JejuBanner from './JejuBanner';
import { getTripInfo } from '@/lib/trips';
import type { TripInfoRecord } from '@/lib/types';

// ==================== 紧急联系卡片 ====================
function EmergencyCard({ number, title, subtitle, icon }: { number: string; title: string; subtitle: string; icon: string }) {
  return (
    <a
      href={number ? `tel:${number}` : undefined}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <SketchyBorder
        borderColor={colors.emergencyRed}
        borderRadius={radius.md}
        padding="12px 8px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textAlign: 'center', fontFamily: typography.fontBody }}>
          <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', zIndex: 3 }}>📌</span>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <span style={{ fontSize: number.length > 6 ? '14px' : '24px', fontWeight: 900, color: colors.textPrimary, wordBreak: 'break-all' }}>{number || '—'}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: colors.textPrimary }}>{title}</span>
          <span style={{ fontSize: '10px', color: colors.textSecondary }}>{subtitle}</span>
          <span style={{ fontSize: '10px', color: colors.primary, fontWeight: 600, marginTop: '2px' }}>📞 点击拨打</span>
        </div>
      </SketchyBorder>
    </a>
  );
}

// ==================== 实用信息卡片 ====================
function TipCard({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div
      style={{
        padding: '14px 12px', backgroundColor: '#FFF9E6',
        borderRadius: radius.md, textAlign: 'center', fontFamily: typography.fontBody,
        border: `1.5px dashed ${colors.border}`,
        filter: 'url(#sketchy)',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 900, color: colors.textPrimary, lineHeight: 1.2, fontFamily: typography.fontDisplay }}>{title}</div>
      <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>{subtitle}</div>
    </div>
  );
}

// ==================== 韩语短语行 ====================
function PhraseRow({ korean, english, chinese, pronunciation }: { korean: string; english: string; chinese: string; pronunciation?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(korean);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={handleCopy}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', backgroundColor: colors.bgCard,
        borderRadius: radius.md, fontFamily: typography.fontBody,
        cursor: 'pointer',
        position: 'relative', border: `1.5px dashed ${colors.borderLight}`,
        filter: 'url(#sketchy)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '10px', opacity: 0.4 }}>⭐</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.amber, fontFamily: typography.fontKorean }}>{korean}</div>
          {pronunciation && <div style={{ fontSize: '10px', color: colors.textSecondary, fontStyle: 'italic' }}>{pronunciation}</div>}
          <div style={{ fontSize: '11px', color: colors.textSecondary }}>{english}</div>
        </div>
      </div>
      <div style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: 500, flexShrink: 0, marginLeft: '8px' }}>{chinese}</div>
      {copied && (
        <span style={{
          position: 'absolute', top: '-8px', right: '12px',
          backgroundColor: colors.forestGreen, color: '#FFFFFF',
          padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
        }}>
          已复制!
        </span>
      )}
    </div>
  );
}

// ==================== 备选餐厅卡片 ====================
function RestaurantCard({ icon, name, desc, address }: { icon: string; name: string; desc: string; address?: string }) {
  return (
    <div
      style={{
        padding: '10px', backgroundColor: colors.warmBeige, borderRadius: radius.sm,
        fontFamily: typography.fontBody, border: `1.5px dashed ${colors.border}`,
        filter: 'url(#sketchy)',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '12px', fontWeight: 800, color: colors.textPrimary, fontFamily: typography.fontDisplay }}>{name}</div>
      <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: '2px' }}>{desc}</div>
      {address && <div style={{ fontSize: '9px', color: colors.textSecondary, marginTop: '2px', opacity: 0.7 }}>📍 {address}</div>}
    </div>
  );
}

// ==================== 酒店信息卡片 ====================
function HotelCard({ hotel }: { hotel: Record<string, string> }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hotel.korean_address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ position: 'relative' }}>
      <SketchyBorder
        borderColor={colors.softBlue}
        borderRadius={radius.md}
      >
        <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', zIndex: 3 }}>📌</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>🏨</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: colors.textPrimary, fontFamily: typography.fontBody }}>{hotel.name}</div>
            <div style={{ fontSize: '13px', color: colors.amber, fontFamily: typography.fontKorean }}>{hotel.korean_name}</div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, fontFamily: typography.fontBody }}>
          <div>📍 {hotel.address}</div>
          <div style={{ fontFamily: typography.fontKorean }}>🇰🇷 {hotel.korean_address}</div>
          <div>📅 {hotel.check_in} 入住 → {hotel.check_out} 退房</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={handleCopy}
            style={{ flex: 1, fontSize: '10px', color: colors.primary, fontWeight: 600, textAlign: 'center', padding: '6px 0', backgroundColor: `${colors.primary}10`, borderRadius: radius.sm, border: 'none', cursor: 'pointer' }}
          >
            📋 点击复制韩文地址
          </button>
          {hotel.map_url && (
            <a
              href={hotel.map_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, fontSize: '10px', color: colors.softBlue, fontWeight: 600, textAlign: 'center', padding: '6px 0', backgroundColor: `${colors.softBlue}15`, borderRadius: radius.sm, textDecoration: 'none' }}
            >
              🗺️ 打开地图导航
            </a>
          )}
        </div>
        {copied && (
          <span style={{
            position: 'absolute', top: '-8px', right: '12px',
            backgroundColor: colors.forestGreen, color: '#FFFFFF',
            padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, zIndex: 3,
          }}>
            已复制!
          </span>
        )}
      </SketchyBorder>
    </div>
  );
}

// ==================== Info 页面主体 ====================
interface InfoPageProps {
  tripId: string;
}

export default function InfoPage({ tripId }: InfoPageProps) {
  const [infoSections, setInfoSections] = useState<TripInfoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTripInfo(tripId).then((data) => {
      setInfoSections(data);
      setLoading(false);
    });
  }, [tripId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0' }}>
        <div style={{ textAlign: 'center', fontFamily: typography.fontBody }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
          <div style={{ fontSize: '14px', color: colors.textSecondary }}>加载信息中...</div>
        </div>
      </div>
    );
  }

  // 按 section 查找数据
  const getSection = (section: string) => infoSections.find((s) => s.section === section);
  const hotelInfo = getSection('hotel');
  const emergencyInfo = getSection('emergency');
  const tipsInfo = getSection('tips');
  const phrasesInfo = getSection('phrases');
  const restaurantsInfo = getSection('restaurants');

  const hotel = hotelInfo?.data as Record<string, string> | undefined;
  const emergencyContacts = (emergencyInfo?.data as { contacts?: { number: string; title: string; subtitle: string; icon: string }[] })?.contacts || [];
  const tips = (tipsInfo?.data as { tips?: { icon: string; title: string; subtitle: string }[] })?.tips || [];
  const phrases = (phrasesInfo?.data as { phrases?: { korean: string; pronunciation?: string; english: string; chinese: string }[] })?.phrases || [];
  const restaurants = (restaurantsInfo?.data as { restaurants?: { icon: string; name: string; desc: string; address?: string }[] })?.restaurants || [];

  return (
    <div
      style={{
        paddingBottom: '120px', minHeight: '100vh',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 80% 20%, rgba(189,216,219,0.1) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
        fontFamily: typography.fontBody,
      }}
    >
      <JejuBanner image="jeju-travelpublicbanner-jeju-02.jpg" />

      <div style={{ padding: '16px' }}>
        {/* 酒店信息 */}
        {hotel && (
          <>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
              🏨 住宿信息
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <HotelCard hotel={hotel} />
            </div>
          </>
        )}

        {/* 紧急联系 */}
        {emergencyContacts.length > 0 && (
          <>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
              🚨 紧急联系
            </h3>
            <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '8px' }}>→ 点击拨打</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {emergencyContacts.map((c, i) => (
                <EmergencyCard key={i} number={c.number} title={c.title} subtitle={c.subtitle} icon={c.icon} />
              ))}
            </div>
          </>
        )}

        {/* 实用信息 */}
        {tips.length > 0 && (
          <>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
              📝 实用信息
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {tips.map((tip, i) => (
                <TipCard key={i} icon={tip.icon} title={tip.title} subtitle={tip.subtitle} />
              ))}
            </div>
          </>
        )}

        {/* 常用韩语 */}
        {phrases.length > 0 && (
          <>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
              🇰🇷 常用韩语
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '10px', color: colors.textSecondary, marginBottom: '8px' }}>
              <span>📋</span> 点击复制韩文
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {phrases.map((p, i) => (
                <PhraseRow key={i} korean={p.korean} pronunciation={p.pronunciation} english={p.english} chinese={p.chinese} />
              ))}
            </div>
          </>
        )}

        {/* 备选餐厅 */}
        {restaurants.length > 0 && (
          <>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
              🍽️ 备选方案
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {restaurants.map((r, i) => (
                <RestaurantCard key={i} icon={r.icon} name={r.name} desc={r.desc} address={r.address} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

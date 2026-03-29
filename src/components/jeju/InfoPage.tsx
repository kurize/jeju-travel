'use client';

import React, { useState } from 'react';
import { colors, radius, shadows, typography } from '@/lib/theme';
import SketchyBorder from './SketchyBorder';
import JejuBanner from './JejuBanner';

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

// ==================== 实用信息卡片（轻量，不用滤镜） ====================
function TipCard({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div
      style={{
        padding: '14px 12px', backgroundColor: colors.bgHighlight,
        borderRadius: radius.md, textAlign: 'center', fontFamily: typography.fontBody,
        boxShadow: shadows.level1,
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 900, color: colors.textPrimary, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>{subtitle}</div>
    </div>
  );
}

// ==================== 韩语短语行（纯文本，不用滤镜） ====================
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
        cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'relative', border: `1px solid ${colors.borderLight}`,
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

// ==================== 备选餐厅卡片（轻量，不用滤镜） ====================
function RestaurantCard({ icon, name, desc, address }: { icon: string; name: string; desc: string; address?: string }) {
  return (
    <div
      style={{
        padding: '10px', backgroundColor: colors.warmBeige, borderRadius: radius.sm,
        fontFamily: typography.fontBody, border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '12px', fontWeight: 800, color: colors.textPrimary }}>{name}</div>
      <div style={{ fontSize: '10px', color: colors.textSecondary, marginTop: '2px' }}>{desc}</div>
      {address && <div style={{ fontSize: '9px', color: colors.textSecondary, marginTop: '2px', opacity: 0.7 }}>📍 {address}</div>}
    </div>
  );
}

// ==================== 酒店信息卡片 ====================
function HotelCard() {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('제주시 탑동로 5 (Mangrove Jeju City)');
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
            <div style={{ fontSize: '16px', fontWeight: 800, color: colors.textPrimary, fontFamily: typography.fontBody }}>济州红树林酒店</div>
            <div style={{ fontSize: '13px', color: colors.amber, fontFamily: typography.fontKorean }}>Mangrove Jeju City</div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, fontFamily: typography.fontBody }}>
          <div>📍 塔洞路5号 (5 Tapdong-ro)</div>
          <div style={{ fontFamily: typography.fontKorean }}>🇰🇷 제주시 탑동로 5</div>
          <div>📅 4/4 入住 → 4/7 退房</div>
          <div>👥 2人</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={handleCopy}
            style={{ flex: 1, fontSize: '10px', color: colors.primary, fontWeight: 600, textAlign: 'center', padding: '6px 0', backgroundColor: `${colors.primary}10`, borderRadius: radius.sm, border: 'none', cursor: 'pointer' }}
          >
            📋 点击复制韩文地址
          </button>
          <a
            href="https://maps.google.com/maps?q=33.5168,126.5242&z=16"
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, fontSize: '10px', color: colors.softBlue, fontWeight: 600, textAlign: 'center', padding: '6px 0', backgroundColor: `${colors.softBlue}15`, borderRadius: radius.sm, textDecoration: 'none' }}
          >
            🗺️ 打开地图导航
          </a>
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
export default function InfoPage() {
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
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
          🏨 住宿信息
        </h3>
        <div style={{ marginBottom: '20px' }}>
          <HotelCard />
        </div>

        {/* 紧急联系 */}
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
          🚨 紧急联系
        </h3>
        <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '8px' }}>→ 点击拨打</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <EmergencyCard number="112" title="报警" subtitle="Police" icon="🚨" />
          <EmergencyCard number="119" title="急救/消防" subtitle="Medical / Fire" icon="❤️‍🩹" />
          <EmergencyCard number="1330" title="旅游咨询" subtitle="支持中文" icon="🚌" />
          <EmergencyCard number="+82-64-738-8880" title="中国领事馆" subtitle="驻济州总领事馆" icon="🏛️" />
        </div>

        {/* 实用信息 */}
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
          📝 实用信息
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          <TipCard icon="🕐" title="快1小时" subtitle="韩国 UTC+9" />
          <TipCard icon="🔌" title="德标圆孔" subtitle="220V 双圆孔插头" />
          <TipCard icon="🌡️" title="10-17°C" subtitle="4月初·薄外套+长裤" />
          <TipCard icon="💰" title="现金重要" subtitle="东门市场/小店需现金" />
        </div>

        {/* 常用韩语 */}
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
          🇰🇷 常用韩语
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '10px', color: colors.textSecondary, marginBottom: '8px' }}>
          <span>📋</span> 点击复制韩文
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <PhraseRow korean="안녕하세요" pronunciation="an-nyeong-ha-se-yo" english="Hello" chinese="你好" />
          <PhraseRow korean="감사합니다" pronunciation="kam-sa-ham-ni-da" english="Thank You" chinese="谢谢" />
          <PhraseRow korean="얼마예요?" pronunciation="eol-ma-ye-yo" english="How Much?" chinese="多少钱?" />
          <PhraseRow korean="맛있어요" pronunciation="ma-si-sseo-yo" english="Delicious" chinese="好吃" />
          <PhraseRow korean="이거 주세요" pronunciation="i-geo ju-se-yo" english="This One Please" chinese="请给我这个" />
          <PhraseRow korean="계산이요" pronunciation="gye-sa-ni-yo" english="Check Please" chinese="结账" />
          <PhraseRow korean="안 맵게 해주세요" pronunciation="an maep-ge hae-ju-se-yo" english="Not Spicy Please" chinese="不要辣" />
          <PhraseRow korean="화장실 어디예요?" pronunciation="hwa-jang-sil eo-di-ye-yo" english="Where is Restroom?" chinese="洗手间在哪?" />
          <PhraseRow korean="택시 불러주세요" pronunciation="taek-si bul-leo-ju-se-yo" english="Call a Taxi Please" chinese="请叫出租车" />
          <PhraseRow korean="여기로 가주세요" pronunciation="yeo-gi-ro ga-ju-se-yo" english="Please Go Here" chinese="请去这里" />
        </div>

        {/* 备选餐厅 */}
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: colors.primary, letterSpacing: '1px', marginBottom: '10px', fontFamily: typography.fontDisplay }}>
          🍽️ 备选方案
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <RestaurantCard icon="🍗" name="BHC 炸鸡" desc="韩式炸鸡，宵夜首选" address="Sammu-ro 27" />
          <RestaurantCard icon="🍖" name="바로족발보쌈" desc="猪蹄包肉，替换晚餐" address="진군1길 25" />
          <RestaurantCard icon="🍜" name="老奶奶炸酱面" desc="中餐，D4早餐备选" address="莲洞252-72" />
          <RestaurantCard icon="🏮" name="全国大排档" desc="大排档，任意晚上" address="莲洞10街4" />
          <RestaurantCard icon="☕" name="Hugely Jeju" desc="咖啡甜品，任意下午" address="Heungun-gil 83" />
          <RestaurantCard icon="🐕" name="济州小狗咖啡店" desc="撸狗首选" />
          <RestaurantCard icon="🛥️" name="M1971 Yacht" desc="游艇日落，需半天" address="大静邑" />
          <RestaurantCard icon="🏖️" name="狭才海水浴场" desc="替换D1涯月海滩" address="Hallim-eup" />
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { colors, radius, shadows } from '@/lib/theme';
import Button from './Button';
import StatusTag from './StatusTag';
import Checkbox from './Checkbox';
import ProgressBar from './ProgressBar';
import ActivityCard from './ActivityCard';
import LearnMoreAccordion from './LearnMoreAccordion';
import FavoriteButton from './FavoriteButton';
import MapFAB from './MapFAB';
import BottomTabBar, { TabId } from './BottomTabBar';
import HandDrawnFilters from './HandDrawnFilters';

// 手绘风格容器
function SketchyBox({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ filter: 'url(#sketchy)', ...style }}>
      {children}
    </div>
  );
}

// 胶带装饰
function WashiTape({ color = '#F5E6D0', rotation = -2, top = '-6px', left = '20px' }: { color?: string; rotation?: number; top?: string; left?: string }) {
  return (
    <div style={{
      position: 'absolute', top, left, width: '60px', height: '16px',
      backgroundColor: color, opacity: 0.7,
      transform: `rotate(${rotation}deg)`,
      borderRadius: '2px',
      zIndex: 2,
    }} />
  );
}

// 回形针装饰
function PaperClip({ top = '-4px', right = '16px' }: { top?: string; right?: string }) {
  return (
    <div style={{
      position: 'absolute', top, right, fontSize: '20px',
      transform: 'rotate(15deg)', zIndex: 2,
      filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.15))',
    }}>
      📎
    </div>
  );
}

// 图钉装饰
function PushPin({ top = '-8px', right = '50%' }: { top?: string; right?: string }) {
  return (
    <div style={{
      position: 'absolute', top, right, fontSize: '18px', zIndex: 2,
      filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))',
    }}>
      📌
    </div>
  );
}

// 手绘风格卡片
function SketchyCard({ children, borderColor = colors.border, style }: { children: React.ReactNode; borderColor?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: colors.bgCard,
      border: `2px solid ${borderColor}`,
      borderRadius: '16px',
      padding: '14px',
      position: 'relative',
      filter: 'url(#sketchy)',
      boxShadow: '2px 3px 0px rgba(0,0,0,0.04)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function ComponentShowcase() {
  const [checked, setChecked] = useState(true);
  const [unchecked, setUnchecked] = useState(false);
  const [favActive, setFavActive] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [learnMoreOpen] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '80px',
        overflow: 'hidden',
        // 纸质感背景
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 30px,
            rgba(200,180,150,0.03) 30px,
            rgba(200,180,150,0.03) 31px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 30px,
            rgba(200,180,150,0.03) 30px,
            rgba(200,180,150,0.03) 31px
          ),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      {/* SVG 滤镜 */}
      <HandDrawnFilters />

      {/* ==================== 散落装饰元素 ==================== */}
      <div style={{ position: 'absolute', top: '12px', left: '8px', fontSize: '16px', opacity: 0.5, transform: 'rotate(-10deg)' }}>⭐</div>
      <div style={{ position: 'absolute', top: '38px', left: '28px', fontSize: '9px', opacity: 0.35 }}>⭐</div>
      <div style={{ position: 'absolute', top: '70px', right: '12px', fontSize: '11px', opacity: 0.3, transform: 'rotate(15deg)' }}>🌸</div>
      <div style={{ position: 'absolute', top: '200px', left: '6px', fontSize: '12px', opacity: 0.25, transform: 'rotate(25deg)' }}>🌸</div>
      <div style={{ position: 'absolute', top: '360px', left: '12px', fontSize: '9px', opacity: 0.2 }}>🌼</div>
      <div style={{ position: 'absolute', top: '300px', right: '8px', fontSize: '9px', opacity: 0.3, transform: 'rotate(-20deg)' }}>🌸</div>
      <div style={{ position: 'absolute', top: '500px', right: '14px', fontSize: '10px', opacity: 0.25 }}>🌸</div>
      <div style={{ position: 'absolute', top: '450px', left: '8px', fontSize: '8px', opacity: 0.2 }}>✨</div>
      <div style={{ position: 'absolute', top: '600px', left: '20px', fontSize: '9px', opacity: 0.2 }}>🌼</div>
      {/* 手绘箭头 */}
      <div style={{ position: 'absolute', top: '280px', left: '50%', fontSize: '14px', opacity: 0.2, transform: 'rotate(40deg)' }}>↗</div>

      <div style={{ position: 'relative', padding: '20px 14px' }}>

        {/* ==================== 第一行：按钮 ==================== */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '14px' }}>
          <SketchyBox>
            <Button variant="primary">EXPLORE JEJU</Button>
          </SketchyBox>
          <SketchyBox>
            <Button variant="language">한국어 (Korean Text)</Button>
          </SketchyBox>
        </div>

        {/* ==================== 第二行 ==================== */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <SketchyBox>
            <Button variant="secondary">VIEW DETAILS</Button>
          </SketchyBox>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '22px', filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.15))' }}>📌</span>
            <SketchyBox>
              <FavoriteButton active={favActive} onClick={() => setFavActive(!favActive)} size={44} />
            </SketchyBox>
          </div>
        </div>

        {/* ==================== 第三行：标签 ==================== */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <SketchyBox><StatusTag type="completed" /></SketchyBox>
          <SketchyBox><StatusTag type="dining" /></SketchyBox>
        </div>

        {/* ==================== 两列主体 ==================== */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>

          {/* 左列 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Hallasan Hike 卡片 */}
            <SketchyCard borderColor={colors.primary}>
              <WashiTape rotation={-3} />
              <div style={{ marginTop: '8px' }}>
                {/* 装饰 */}
                <div style={{ position: 'absolute', top: '12px', right: '10px', fontSize: '10px', opacity: 0.4 }}>
                  <span>→</span> <span>🌸</span> <span style={{ fontSize: '8px' }}>✨</span>
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: colors.textPrimary }}>Hallasan Hike</div>
                <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '2px' }}>Distance: 9.6km</div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <StatusTag type="difficult" label="DIFFICULT" />
                  <StatusTag type="hiking" label="HIKING" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: colors.tagCompleted, fontSize: '13px', fontWeight: 600 }}>
                  ✅ Completed
                </div>
                {/* 小装饰花 */}
                <div style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '14px', opacity: 0.4 }}>🌸</div>
              </div>
            </SketchyCard>

            {/* Manjanggul Cave 卡片 */}
            <SketchyCard borderColor={colors.softBlue} style={{ borderLeft: `5px solid ${colors.softBlue}` }}>
              <div style={{ position: 'absolute', top: '6px', right: '10px', fontSize: '10px', opacity: 0.5 }}>
                ⭐ <span style={{ color: colors.softBlue }}>★</span>
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: colors.textPrimary }}>Manjanggul Cave</div>
              {/* 箭头装饰 */}
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '12px', opacity: 0.3 }}>↗</div>
              <div style={{ position: 'absolute', bottom: '4px', left: '10px', fontSize: '8px', opacity: 0.3 }}>⭐</div>
            </SketchyCard>
          </div>

          {/* 右列 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Checkbox */}
            <SketchyCard borderColor="transparent" style={{ border: 'none', padding: '0', backgroundColor: 'transparent', filter: 'none', boxShadow: 'none' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: colors.textSecondary, marginBottom: '6px' }}>Checkbox</div>
                <Checkbox checked={checked} onChange={setChecked} />
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: colors.textSecondary, marginBottom: '6px' }}>Options</div>
                <Checkbox checked={unchecked} onChange={setUnchecked} />
              </div>
            </SketchyCard>

            {/* Progress Bar */}
            <SketchyBox>
              <ProgressBar percent={75} showLabel />
            </SketchyBox>

            {/* Tags */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: colors.textSecondary, marginBottom: '6px' }}>Tags</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SketchyBox><StatusTag type="dining" /></SketchyBox>
                <SketchyBox><StatusTag type="coffee" /></SketchyBox>
                <SketchyBox><StatusTag type="transport" /></SketchyBox>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== Learn More ==================== */}
        <div style={{ marginTop: '16px' }}>
          <SketchyCard borderColor={colors.border} style={{ borderStyle: 'dashed' }}>
            <PaperClip top="-6px" right="14px" />
            {/* 角落涂鸦装饰 */}
            <div style={{ position: 'absolute', bottom: '8px', left: '10px', fontSize: '10px', opacity: 0.2, transform: 'rotate(-10deg)' }}>〰️</div>
            <div style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '10px', opacity: 0.2 }}>✏️</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px' }}>💡</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: colors.textPrimary }}>Learn more</span>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>∨</span>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: colors.bgLearnMore,
              borderRadius: '10px',
              fontSize: '13px',
              color: colors.textSecondary,
              lineHeight: '20px',
              border: `1px dashed ${colors.border}`,
              position: 'relative',
            }}>
              {/* 山形涂鸦 */}
              <div style={{ position: 'absolute', bottom: '8px', right: '10px', opacity: 0.15, fontSize: '24px' }}>🏔️</div>
              Jeju&apos;s volcanic history and diverse natural landscape make it one of Korea&apos;s most treasured islands. From ancient lava tubes to spring cherry blossoms, every season brings unique beauty.
            </div>
          </SketchyCard>
        </div>

        {/* ==================== Map FAB ==================== */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <SketchyBox>
            <MapFAB />
          </SketchyBox>
        </div>

      </div>

      {/* ==================== 底部 TabBar ==================== */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

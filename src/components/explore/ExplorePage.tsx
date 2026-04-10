'use client';

import React, { useState, useEffect, useRef } from 'react';
import { colors, typography, radius, shadows } from '@/lib/theme';
import { getTemplateTrips } from '@/lib/trips';
import { forkTrip, generateShareToken } from '@/lib/sharing';
import type { Trip } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, Eye, GitFork } from 'lucide-react';

export default function ExplorePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [forkingId, setForkingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 初始加载 + 搜索
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const data = await getTemplateTrips(search || undefined);
      setTemplates(data);
      setLoading(false);
    }, search ? 300 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const handleFork = async (tripId: string) => {
    setForkingId(tripId);
    const newTrip = await forkTrip(tripId);
    if (newTrip) {
      router.push(`/trips/${newTrip.id}`);
    } else {
      alert('复制失败，请稍后重试');
      setForkingId(null);
    }
  };

  const handleView = async (trip: Trip) => {
    // 确保模板有 share_token
    let token = trip.share_token;
    if (!token) {
      token = await generateShareToken(trip.id);
    }
    if (token) {
      router.push(`/shared/${token}`);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh', paddingBottom: '40px',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 85% 10%, rgba(141,130,211,0.06) 0%, transparent 50%),
          radial-gradient(circle at 15% 80%, rgba(245,114,127,0.04) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      {/* 返回按钮 */}
      <div style={{ position: 'fixed', top: '12px', left: 'max(12px, calc(50% - 210px + 12px))', zIndex: 50 }}>
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

      {/* 顶部 */}
      <div style={{ padding: '40px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🧭</div>
        <h1 style={{
          fontSize: '24px', fontWeight: 900, color: colors.primary,
          fontFamily: typography.fontDisplay, margin: '0 0 4px',
        }}>发现旅行</h1>
        <p style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: typography.fontBody, margin: 0 }}>
          探索精选行程模板，一键复制到你的旅行
        </p>
      </div>

      {/* 搜索栏 */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px', borderRadius: radius.lg,
          backgroundColor: '#FFF', border: `2px solid ${colors.border}`,
          filter: 'url(#sketchy)',
        }}>
          <Search size={18} color={colors.textSecondary} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索目的地或旅行名称..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '14px', fontFamily: typography.fontBody,
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>

      {/* 模板列表 */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: typography.fontBody, color: colors.textSecondary }}>
            搜索中...
          </div>
        ) : templates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: typography.fontBody }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>
              {search ? `没有找到「${search}」相关的模板` : '暂无模板'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {templates.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '16px', backgroundColor: colors.bgCard,
                  borderRadius: radius.lg, border: `2px solid ${colors.border}`,
                  filter: 'url(#sketchy)', position: 'relative',
                }}
              >
                <span style={{
                  position: 'absolute', top: '-6px', right: '12px',
                  fontSize: '10px', fontWeight: 700,
                  backgroundColor: colors.amber, color: '#FFF',
                  padding: '1px 8px', borderRadius: '8px',
                  fontFamily: typography.fontBody,
                }}>模板</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px' }}>{t.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '16px', fontWeight: 800, color: colors.textPrimary,
                      fontFamily: typography.fontDisplay,
                    }}>{t.title}</div>
                    {t.destination && (
                      <div style={{ fontSize: '12px', color: colors.textSecondary, fontFamily: typography.fontBody }}>
                        📍 {t.destination}
                      </div>
                    )}
                  </div>
                </div>

                {t.description && (
                  <div style={{
                    fontSize: '12px', color: colors.textSecondary, marginBottom: '12px',
                    fontFamily: typography.fontBody,
                  }}>{t.description}</div>
                )}

                {/* 操作按钮 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleView(t)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: radius.md,
                      border: `1.5px solid ${colors.border}`, backgroundColor: 'transparent',
                      fontSize: '13px', fontWeight: 700, color: colors.textSecondary,
                      cursor: 'pointer', fontFamily: typography.fontBody,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}
                  ><Eye size={14} /> 查看行程</button>
                  <button
                    onClick={() => handleFork(t.id)}
                    disabled={forkingId === t.id}
                    style={{
                      flex: 1, padding: '10px', borderRadius: radius.md,
                      border: 'none', backgroundColor: forkingId === t.id ? colors.textMuted : colors.primary,
                      fontSize: '13px', fontWeight: 700, color: '#FFF',
                      cursor: forkingId === t.id ? 'default' : 'pointer',
                      fontFamily: typography.fontBody,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}
                  ><GitFork size={14} /> {forkingId === t.id ? '复制中...' : '使用模板'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', opacity: 0.4, fontSize: '20px' }}>
        <span>🌏</span><span style={{ transform: 'rotate(-5deg)' }}>🗺️</span>
        <span>🧳</span><span style={{ transform: 'rotate(10deg)' }}>📸</span>
      </div>
    </div>
  );
}

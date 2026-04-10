'use client';

import React, { useState } from 'react';
import { colors, typography, radius } from '@/lib/theme';
import { Copy, Check, X } from 'lucide-react';

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  tripTitle: string;
  shareToken: string;
}

export default function ShareSheet({ open, onClose, tripTitle, shareToken }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const shareUrl = `https://jeju.kurize.com/shared/${shareToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 回退方案：选中文本
      const input = document.querySelector('#share-url-input') as HTMLInputElement;
      input?.select();
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px',
          backgroundColor: '#FFF', borderRadius: '24px 24px 0 0',
          padding: '24px 20px 36px',
          fontFamily: typography.fontBody,
        }}
      >
        {/* 关闭按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '18px', fontWeight: 900, color: colors.primary,
            fontFamily: typography.fontDisplay, margin: 0,
          }}>分享旅行</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color={colors.textSecondary} />
          </button>
        </div>

        {/* 旅行名称 */}
        <div style={{
          padding: '12px 14px', backgroundColor: `${colors.warmBeige}`,
          borderRadius: radius.md, marginBottom: '16px',
          border: `1.5px dashed ${colors.border}`, filter: 'url(#sketchy)',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: colors.textPrimary }}>
            📋 {tripTitle}
          </div>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '4px' }}>
            任何拥有链接的人都可以查看此行程
          </div>
        </div>

        {/* 分享链接 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            id="share-url-input"
            readOnly
            value={shareUrl}
            style={{
              flex: 1, padding: '10px 12px',
              borderRadius: radius.sm, border: `1.5px solid ${colors.border}`,
              fontSize: '12px', fontFamily: typography.fontBody,
              color: colors.textSecondary, backgroundColor: '#FAFAFA',
              outline: 'none',
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 16px', borderRadius: radius.sm,
              backgroundColor: copied ? colors.forestGreen : colors.primary,
              color: '#FFF', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 700,
              fontFamily: typography.fontBody,
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? <><Check size={14} /> 已复制</> : <><Copy size={14} /> 复制链接</>}
          </button>
        </div>

        {/* 提示 */}
        <div style={{ fontSize: '11px', color: colors.textSecondary, textAlign: 'center' }}>
          💡 对方打开链接后可以查看行程，也可以 fork 到自己的旅行列表
        </div>
      </div>
    </div>
  );
}

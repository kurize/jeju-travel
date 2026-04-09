'use client';

import React, { useState } from 'react';
import { colors, typography, radius } from '@/lib/theme';

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; emoji: string; destination: string }) => void;
}

const EMOJI_OPTIONS = ['✈️', '🌸', '🏖️', '⛰️', '🗼', '🎭', '🍜', '🛍️', '🏔️', '🌊', '🎢', '🏕️'];

export default function CreateTripModal({ open, onClose, onSubmit }: CreateTripModalProps) {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('✈️');
  const [destination, setDestination] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), emoji, destination: destination.trim() });
    setTitle('');
    setEmoji('✈️');
    setDestination('');
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
        <h3 style={{
          fontSize: '18px', fontWeight: 900, color: colors.primary,
          fontFamily: typography.fontDisplay, margin: '0 0 16px', textAlign: 'center',
        }}>新建旅行</h3>

        {/* 选择 emoji */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
            选择图标
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: '24px', width: '40px', height: '40px',
                  borderRadius: '12px', border: 'none', cursor: 'pointer',
                  backgroundColor: emoji === e ? `${colors.amber}20` : 'transparent',
                  outline: emoji === e ? `2px solid ${colors.amber}` : 'none',
                }}
              >{e}</button>
            ))}
          </div>
        </div>

        {/* 旅行名称 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
            旅行名称 *
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="例如：东京5日游"
            style={{
              width: '100%', padding: '12px 14px',
              borderRadius: radius.md, border: `2px solid ${colors.border}`,
              fontSize: '15px', fontFamily: typography.fontBody,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 目的地 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
            目的地
          </label>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="例如：东京"
            style={{
              width: '100%', padding: '12px 14px',
              borderRadius: radius.md, border: `2px solid ${colors.border}`,
              fontSize: '15px', fontFamily: typography.fontBody,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: radius.lg,
              border: `2px solid ${colors.border}`, backgroundColor: 'transparent',
              fontSize: '15px', fontWeight: 700, color: colors.textSecondary,
              cursor: 'pointer', fontFamily: typography.fontBody,
            }}
          >取消</button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, padding: '12px', borderRadius: radius.lg,
              border: 'none', backgroundColor: colors.primary, color: '#FFF',
              fontSize: '15px', fontWeight: 800, cursor: 'pointer',
              fontFamily: typography.fontBody,
              opacity: title.trim() ? 1 : 0.5,
            }}
          >创建</button>
        </div>
      </div>
    </div>
  );
}

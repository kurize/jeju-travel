'use client';

import React from 'react';
import Image from 'next/image';
import { colors } from '@/lib/theme';

interface JejuBannerProps {
  image?: string;
}

/**
 * 济州岛顶部横幅
 * 01: 海滩（行程页）, 02: 日落（Info页）, 03: 樱花（Checklist页）
 */
export default function JejuBanner({ image = 'jeju-travelpublicbanner-jeju-03.jpg' }: JejuBannerProps) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, ${colors.primary}20, ${colors.softBlue}30, ${colors.lavender}15)`,
    }}>
      <div style={{
        width: '100%',
        height: '140px',
        position: 'relative',
      }}>
        <Image
          src={`/${image}`}
          alt="济州岛横幅"
          fill
          sizes="420px"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
          background: 'linear-gradient(transparent, #FFF8F0)',
          zIndex: 1,
        }} />
      </div>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import type { MapStop } from './DayMap';

const DayMap = dynamic(() => import('./DayMap'), { ssr: false });

interface DayMapLazyProps {
  stops: MapStop[];
  height?: string;
}

export default function DayMapLazy({ stops, height }: DayMapLazyProps) {
  return <DayMap stops={stops} height={height} />;
}

export type { MapStop };

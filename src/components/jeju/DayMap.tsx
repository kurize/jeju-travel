'use client';

import React, { useEffect, useRef } from 'react';
import { colors, radius, typography } from '@/lib/theme';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapStop {
  name: string;
  coord: [number, number]; // [lat, lng]
  emoji: string;
  type: 'restaurant' | 'attraction' | 'coffee' | 'hotel' | 'transport';
}

interface DayMapProps {
  stops: MapStop[];
  height?: string;
}

// 根据类型返回圆点颜色
function dotColor(type: MapStop['type']) {
  switch (type) {
    case 'restaurant': return colors.dotRestaurant;
    case 'attraction': return colors.dotAttraction;
    case 'coffee':     return colors.dotCoffee;
    case 'hotel':      return colors.dotHotel;
    case 'transport':  return colors.dotTransport;
    default:           return colors.primary;
  }
}

export default function DayMap({ stops, height = '200px' }: DayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || stops.length === 0) return;

    // 防止重复初始化
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
    });

    mapInstance.current = map;

    // 使用 OSM 瓦片，CSS 滤镜实现手绘风
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 16,
      className: 'sketchy-tiles',
    }).addTo(map);

    // 设置视野
    const bounds = L.latLngBounds(stops.map((s) => s.coord));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });

    // 画路线 — 手绘风虚线
    const routeCoords = stops.map((s) => s.coord as L.LatLngExpression);
    L.polyline(routeCoords, {
      color: colors.primary,
      weight: 3,
      opacity: 0.5,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // 添加站点标记
    stops.forEach((stop, i) => {
      const color = dotColor(stop.type);
      const isFirst = i === 0;
      const isLast = i === stops.length - 1;
      const size = (isFirst || isLast) ? 32 : 26;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: ${size}px; height: ${size}px;
          display: flex; align-items: center; justify-content: center;
          background: white;
          border: 2.5px solid ${color};
          border-radius: 50%;
          font-size: ${size * 0.5}px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          position: relative;
        ">
          ${stop.emoji}
          <span style="
            position: absolute; top: -18px; left: 50%; transform: translateX(-50%);
            font-size: 9px; font-weight: 700; white-space: nowrap;
            color: ${colors.textPrimary};
            background: rgba(255,255,255,0.85);
            padding: 1px 4px; border-radius: 4px;
            font-family: ${typography.fontBody};
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            max-width: 110px; overflow: hidden; text-overflow: ellipsis;
          ">${i + 1}. ${stop.name}</span>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      L.marker(stop.coord, { icon }).addTo(map);
    });

    // 序号连接线上的小箭头
    if (stops.length > 1) {
      for (let i = 0; i < stops.length - 1; i++) {
        const from = stops[i].coord;
        const to = stops[i + 1].coord;
        const midLat = (from[0] + to[0]) / 2;
        const midLng = (from[1] + to[1]) / 2;

        const arrowIcon = L.divIcon({
          className: 'route-arrow',
          html: `<div style="
            font-size: 10px; color: ${colors.primary}; opacity: 0.6;
            font-weight: 900;
          ">›</div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        L.marker([midLat, midLng], { icon: arrowIcon, interactive: false }).addTo(map);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [stops]);

  return (
    <div style={{ position: 'relative', margin: '0 16px 16px', borderRadius: radius.lg, overflow: 'hidden' }}>
      {/* 手绘边框底层 */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          border: `2.5px solid ${colors.border}`,
          borderRadius: radius.lg,
          filter: 'url(#sketchy)',
          pointerEvents: 'none',
        }}
      />
      {/* 纸质纹理叠加 */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          borderRadius: radius.lg,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(200,180,150,0.04) 4px, rgba(200,180,150,0.04) 5px)',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
        }}
      />
      {/* 地图容器 */}
      <div
        ref={mapRef}
        style={{
          height,
          width: '100%',
          borderRadius: radius.lg,
          position: 'relative',
          zIndex: 0,
        }}
      />
      {/* CSS 滤镜样式 */}
      <style>{`
        .sketchy-tiles {
          filter: grayscale(0.25) sepia(0.25) saturate(0.85) contrast(0.92) brightness(1.05);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .route-arrow {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: ${typography.fontBody};
          background: ${colors.bgMap};
        }
      `}</style>
    </div>
  );
}

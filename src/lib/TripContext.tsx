'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Trip, TripDay, TimelineItemRecord, MapStopRecord } from './types';
import { getTripById, getTripDays, getTimelineItems, getMapStops } from './trips';

interface TripContextValue {
  trip: Trip | null;
  days: TripDay[];
  timelineItems: TimelineItemRecord[];
  mapStops: MapStopRecord[];
  loading: boolean;
  activeDayIndex: number;
  setActiveDayIndex: (index: number) => void;
  refetch: () => void;
  // Phase 2: 编辑模式
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  setTimelineItems: React.Dispatch<React.SetStateAction<TimelineItemRecord[]>>;
  setMapStops: React.Dispatch<React.SetStateAction<MapStopRecord[]>>;
  setDays: React.Dispatch<React.SetStateAction<TripDay[]>>;
  refetchDay: () => void;
}

const TripContext = createContext<TripContextValue>({
  trip: null,
  days: [],
  timelineItems: [],
  mapStops: [],
  loading: true,
  activeDayIndex: 0,
  setActiveDayIndex: () => {},
  refetch: () => {},
  editMode: false,
  setEditMode: () => {},
  setTimelineItems: () => {},
  setMapStops: () => {},
  setDays: () => {},
  refetchDay: () => {},
});

export function TripProvider({ tripId, children }: { tripId: string; children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItemRecord[]>([]);
  const [mapStops, setMapStops] = useState<MapStopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const fetchTrip = useCallback(async () => {
    setLoading(true);
    const [tripData, daysData] = await Promise.all([
      getTripById(tripId),
      getTripDays(tripId),
    ]);
    setTrip(tripData);
    setDays(daysData);
    setLoading(false);
  }, [tripId]);

  // 加载旅行基本数据
  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  // 当天数据加载
  const loadDayData = useCallback(async () => {
    if (days.length === 0) return;
    const dayId = days[activeDayIndex]?.id;
    if (!dayId) return;

    const [items, stops] = await Promise.all([
      getTimelineItems(dayId),
      getMapStops(dayId),
    ]);
    setTimelineItems(items);
    setMapStops(stops);
  }, [days, activeDayIndex]);

  useEffect(() => {
    loadDayData();
  }, [loadDayData]);

  return (
    <TripContext.Provider
      value={{
        trip,
        days,
        timelineItems,
        mapStops,
        loading,
        activeDayIndex,
        setActiveDayIndex,
        refetch: fetchTrip,
        editMode,
        setEditMode,
        setTimelineItems,
        setMapStops,
        setDays,
        refetchDay: loadDayData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  return useContext(TripContext);
}

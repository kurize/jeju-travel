'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Trip, TripDay, TimelineItemRecord, MapStopRecord } from './types';
import { getTripById, getTripDays, getTimelineItems, getMapStops } from './trips';

interface TripContextValue {
  trip: Trip | null;
  days: TripDay[];
  // 当前选中日的数据
  timelineItems: TimelineItemRecord[];
  mapStops: MapStopRecord[];
  loading: boolean;
  activeDayIndex: number;
  setActiveDayIndex: (index: number) => void;
  refetch: () => void;
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
});

export function TripProvider({ tripId, children }: { tripId: string; children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItemRecord[]>([]);
  const [mapStops, setMapStops] = useState<MapStopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

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
  useEffect(() => {
    if (days.length === 0) return;
    const dayId = days[activeDayIndex]?.id;
    if (!dayId) return;

    Promise.all([
      getTimelineItems(dayId),
      getMapStops(dayId),
    ]).then(([items, stops]) => {
      setTimelineItems(items);
      setMapStops(stops);
    });
  }, [days, activeDayIndex]);

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
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  return useContext(TripContext);
}

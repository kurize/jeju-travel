import { supabase } from './supabase';
import type { TripDay, TimelineItemRecord, MapStopRecord, Trip } from './types';

// ==================== Trip ====================

export async function updateTrip(id: string, data: Partial<Trip>): Promise<boolean> {
  const { error } = await supabase
    .from('trips')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('更新旅行失败:', error);
    return false;
  }
  return true;
}

// ==================== Trip Days ====================

export async function createTripDay(
  tripId: string,
  data: { day_label: string; date?: string; emoji?: string; theme?: string; sort_order: number },
): Promise<TripDay | null> {
  const { data: day, error } = await supabase
    .from('trip_days')
    .insert({ trip_id: tripId, ...data })
    .select()
    .single();
  if (error) {
    console.error('创建日程失败:', error);
    return null;
  }
  return day;
}

export async function updateTripDay(id: string, data: Partial<TripDay>): Promise<boolean> {
  const { error } = await supabase.from('trip_days').update(data).eq('id', id);
  if (error) {
    console.error('更新日程失败:', error);
    return false;
  }
  return true;
}

export async function deleteTripDay(id: string): Promise<boolean> {
  const { error } = await supabase.from('trip_days').delete().eq('id', id);
  if (error) {
    console.error('删除日程失败:', error);
    return false;
  }
  return true;
}

// ==================== Timeline Items ====================

export async function createTimelineItem(
  dayId: string,
  data: Partial<TimelineItemRecord> & { type: 'activity' | 'transport'; sort_order: number },
): Promise<TimelineItemRecord | null> {
  const { data: item, error } = await supabase
    .from('timeline_items')
    .insert({ day_id: dayId, ...data })
    .select()
    .single();
  if (error) {
    console.error('创建条目失败:', error);
    return null;
  }
  return item;
}

export async function updateTimelineItem(
  id: string,
  data: Partial<TimelineItemRecord>,
): Promise<boolean> {
  const { error } = await supabase
    .from('timeline_items')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('更新条目失败:', error);
    return false;
  }
  return true;
}

export async function deleteTimelineItem(id: string): Promise<boolean> {
  const { error } = await supabase.from('timeline_items').delete().eq('id', id);
  if (error) {
    console.error('删除条目失败:', error);
    return false;
  }
  return true;
}

export async function reorderTimelineItems(
  dayId: string,
  orderedIds: string[],
): Promise<boolean> {
  const updates = orderedIds.map((id, index) =>
    supabase.from('timeline_items').update({ sort_order: index }).eq('id', id).eq('day_id', dayId),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error('排序失败:', failed.error);
    return false;
  }
  return true;
}

// ==================== Map Stops ====================

export async function createMapStop(
  dayId: string,
  data: { name: string; lat: number; lng: number; emoji?: string; type?: string; sort_order: number },
): Promise<MapStopRecord | null> {
  const { data: stop, error } = await supabase
    .from('map_stops')
    .insert({ day_id: dayId, ...data })
    .select()
    .single();
  if (error) {
    console.error('创建地图标记失败:', error);
    return null;
  }
  return stop;
}

export async function updateMapStop(id: string, data: Partial<MapStopRecord>): Promise<boolean> {
  const { error } = await supabase.from('map_stops').update(data).eq('id', id);
  if (error) {
    console.error('更新地图标记失败:', error);
    return false;
  }
  return true;
}

export async function deleteMapStop(id: string): Promise<boolean> {
  const { error } = await supabase.from('map_stops').delete().eq('id', id);
  if (error) {
    console.error('删除地图标记失败:', error);
    return false;
  }
  return true;
}

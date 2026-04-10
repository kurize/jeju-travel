import { supabase } from './supabase';
import type {
  Trip,
  TripDay,
  TimelineItemRecord,
  MapStopRecord,
  ChecklistCategoryRecord,
  ChecklistItemRecord,
  ChecklistCheckRecord,
  TripInfoRecord,
} from './types';

// ==================== 旅行 ====================

export async function getTrips(userId = 'local'): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取旅行列表失败:', error);
    return [];
  }
  return data || [];
}

export async function getTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('获取旅行失败:', error);
    return null;
  }
  return data;
}

export async function createTrip(trip: Partial<Trip>): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .insert({
      title: trip.title || '新旅行',
      emoji: trip.emoji || '✈️',
      destination: trip.destination || null,
      start_date: trip.start_date || null,
      end_date: trip.end_date || null,
      description: trip.description || null,
      user_id: trip.user_id || 'local',
    })
    .select()
    .single();
  if (error) {
    console.error('创建旅行失败:', error);
    return null;
  }
  return data;
}

export async function deleteTrip(id: string): Promise<boolean> {
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) {
    console.error('删除旅行失败:', error);
    return false;
  }
  return true;
}

// ==================== 天/日程 ====================

export async function getTripDays(tripId: string): Promise<TripDay[]> {
  const { data, error } = await supabase
    .from('trip_days')
    .select('*')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取日程失败:', error);
    return [];
  }
  return data || [];
}

// ==================== 时间轴条目 ====================

export async function getTimelineItems(dayId: string): Promise<TimelineItemRecord[]> {
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('day_id', dayId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取时间轴条目失败:', error);
    return [];
  }
  return data || [];
}

// ==================== 地图标记 ====================

export async function getMapStops(dayId: string): Promise<MapStopRecord[]> {
  const { data, error } = await supabase
    .from('map_stops')
    .select('*')
    .eq('day_id', dayId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取地图标记失败:', error);
    return [];
  }
  return data || [];
}

// ==================== 清单 ====================

export async function getChecklistCategories(tripId: string): Promise<ChecklistCategoryRecord[]> {
  const { data, error } = await supabase
    .from('checklist_categories')
    .select('*')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取清单分类失败:', error);
    return [];
  }
  return data || [];
}

export async function getChecklistItems(categoryId: string): Promise<ChecklistItemRecord[]> {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取清单条目失败:', error);
    return [];
  }
  return data || [];
}

export async function getChecklistChecks(
  itemIds: string[],
  userId = 'local',
  userName?: string,
): Promise<ChecklistCheckRecord[]> {
  let query = supabase
    .from('checklist_checks')
    .select('*')
    .in('item_id', itemIds)
    .eq('user_id', userId);
  if (userName) {
    query = query.eq('user_name', userName);
  }
  const { data, error } = await query;
  if (error) {
    console.error('获取清单勾选状态失败:', error);
    return [];
  }
  return data || [];
}

export async function toggleChecklistItem(
  itemId: string,
  checked: boolean,
  userId = 'local',
  userName?: string,
): Promise<void> {
  // upsert: 如果已存在则更新，否则插入
  const { error } = await supabase
    .from('checklist_checks')
    .upsert(
      {
        item_id: itemId,
        user_id: userId,
        user_name: userName || null,
        checked,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'item_id,user_id,user_name' },
    );
  if (error) {
    console.error('更新清单勾选状态失败:', error);
  }
}

// ==================== 模板搜索 ====================

export async function getTemplateTrips(search?: string): Promise<Trip[]> {
  let query = supabase.from('trips').select('*').eq('is_template', true);
  if (search?.trim()) {
    const s = search.trim();
    query = query.or(`title.ilike.%${s}%,destination.ilike.%${s}%`);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error('搜索模板失败:', error);
    return [];
  }
  return data || [];
}

// ==================== 行程信息 ====================

export async function getTripInfo(tripId: string): Promise<TripInfoRecord[]> {
  const { data, error } = await supabase
    .from('trip_info')
    .select('*')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('获取行程信息失败:', error);
    return [];
  }
  return data || [];
}

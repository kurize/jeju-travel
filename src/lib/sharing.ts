import { supabase } from './supabase';
import type { Trip } from './types';

// 生成分享 token（幂等：已有则返回现有的）
export async function generateShareToken(tripId: string): Promise<string | null> {
  // 先查是否已有 token
  const { data: trip } = await supabase
    .from('trips')
    .select('share_token')
    .eq('id', tripId)
    .maybeSingle();

  if (trip?.share_token) return trip.share_token;

  // 生成新 token
  const token = crypto.randomUUID();
  const { error } = await supabase
    .from('trips')
    .update({ share_token: token })
    .eq('id', tripId);

  if (error) {
    console.error('生成分享 token 失败:', error);
    return null;
  }
  return token;
}

// 通过分享 token 获取旅行
export async function getTripByShareToken(token: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('share_token', token)
    .maybeSingle();

  if (error) {
    console.error('通过 token 获取旅行失败:', error);
    return null;
  }
  return data;
}

// 深拷贝旅行（fork）
export async function forkTrip(sourceTripId: string, userId = 'local'): Promise<Trip | null> {
  // 1. 获取源旅行
  const { data: source } = await supabase
    .from('trips')
    .select('*')
    .eq('id', sourceTripId)
    .single();

  if (!source) {
    console.error('源旅行不存在');
    return null;
  }

  // 2. 创建新旅行
  const { data: newTrip, error: tripError } = await supabase
    .from('trips')
    .insert({
      title: `${source.title} (副本)`,
      emoji: source.emoji,
      destination: source.destination,
      description: source.description,
      start_date: source.start_date,
      end_date: source.end_date,
      cover_image: source.cover_image,
      user_id: userId,
      forked_from: sourceTripId,
      is_template: false,
      status: 'draft',
    })
    .select()
    .single();

  if (tripError || !newTrip) {
    console.error('创建 fork 旅行失败:', tripError);
    return null;
  }

  // 3. 复制 trip_days
  const { data: sourceDays } = await supabase
    .from('trip_days')
    .select('*')
    .eq('trip_id', sourceTripId)
    .order('sort_order', { ascending: true });

  if (!sourceDays || sourceDays.length === 0) return newTrip;

  const dayIdMap: Record<string, string> = {};
  for (const day of sourceDays) {
    const { data: newDay } = await supabase
      .from('trip_days')
      .insert({
        trip_id: newTrip.id,
        day_label: day.day_label,
        date: day.date,
        emoji: day.emoji,
        theme: day.theme,
        sort_order: day.sort_order,
      })
      .select()
      .single();
    if (newDay) dayIdMap[day.id] = newDay.id;
  }

  // 4. 批量复制 timeline_items
  const oldDayIds = Object.keys(dayIdMap);
  const { data: sourceItems } = await supabase
    .from('timeline_items')
    .select('*')
    .in('day_id', oldDayIds)
    .order('sort_order', { ascending: true });

  if (sourceItems && sourceItems.length > 0) {
    const newItems = sourceItems.map((item) => ({
      day_id: dayIdMap[item.day_id],
      type: item.type,
      sort_order: item.sort_order,
      time: item.time,
      title: item.title,
      korean_title: item.korean_title,
      description: item.description,
      type_label: item.type_label,
      dot_color: item.dot_color,
      tags: item.tags,
      learn_more_content: item.learn_more_content,
      learn_more_image: item.learn_more_image,
      bg_tint: item.bg_tint,
      mode: item.mode,
      duration: item.duration,
      destination: item.destination,
    }));
    await supabase.from('timeline_items').insert(newItems);
  }

  // 5. 批量复制 map_stops
  const { data: sourceStops } = await supabase
    .from('map_stops')
    .select('*')
    .in('day_id', oldDayIds)
    .order('sort_order', { ascending: true });

  if (sourceStops && sourceStops.length > 0) {
    const newStops = sourceStops.map((stop) => ({
      day_id: dayIdMap[stop.day_id],
      name: stop.name,
      emoji: stop.emoji,
      lat: stop.lat,
      lng: stop.lng,
      type: stop.type,
      sort_order: stop.sort_order,
    }));
    await supabase.from('map_stops').insert(newStops);
  }

  // 6. 复制 checklist_categories + checklist_items
  const { data: sourceCats } = await supabase
    .from('checklist_categories')
    .select('*')
    .eq('trip_id', sourceTripId)
    .order('sort_order', { ascending: true });

  if (sourceCats && sourceCats.length > 0) {
    for (const cat of sourceCats) {
      const { data: newCat } = await supabase
        .from('checklist_categories')
        .insert({
          trip_id: newTrip.id,
          category: cat.category,
          title: cat.title,
          icon: cat.icon,
          border_color: cat.border_color,
          sort_order: cat.sort_order,
        })
        .select()
        .single();

      if (newCat) {
        const { data: sourceItems2 } = await supabase
          .from('checklist_items')
          .select('*')
          .eq('category_id', cat.id)
          .order('sort_order', { ascending: true });

        if (sourceItems2 && sourceItems2.length > 0) {
          const newCheckItems = sourceItems2.map((item) => ({
            category_id: newCat.id,
            label: item.label,
            sort_order: item.sort_order,
          }));
          await supabase.from('checklist_items').insert(newCheckItems);
        }
      }
    }
  }

  // 7. 复制 trip_info
  const { data: sourceInfo } = await supabase
    .from('trip_info')
    .select('*')
    .eq('trip_id', sourceTripId)
    .order('sort_order', { ascending: true });

  if (sourceInfo && sourceInfo.length > 0) {
    const newInfo = sourceInfo.map((info) => ({
      trip_id: newTrip.id,
      section: info.section,
      data: info.data,
      sort_order: info.sort_order,
    }));
    await supabase.from('trip_info').insert(newInfo);
  }

  return newTrip;
}

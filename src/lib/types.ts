// 旅行主表
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  emoji: string;
  cover_image: string | null;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  is_template: boolean;
  forked_from: string | null;
  share_token: string | null;
  settings: Record<string, unknown>;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// 天/日程
export interface TripDay {
  id: string;
  trip_id: string;
  day_label: string;
  date: string | null;
  emoji: string | null;
  theme: string | null;
  sort_order: number;
  created_at: string;
}

// 标签类型
export type TagType = 'default' | 'dining' | 'coffee' | 'completed' | 'hiking' | 'difficult' | 'transport';

// 标签
export interface Tag {
  type: TagType;
  label: string;
}

// 时间轴条目
export interface TimelineItemRecord {
  id: string;
  day_id: string;
  type: 'activity' | 'transport';
  sort_order: number;
  time: string | null;
  title: string | null;
  korean_title: string | null;
  description: string | null;
  type_label: string | null;
  dot_color: string | null;
  tags: Tag[];
  learn_more_content: string | null;
  learn_more_image: string | null;
  bg_tint: string | null;
  mode: string | null;
  duration: string | null;
  destination: string | null;
  created_at: string;
  updated_at: string;
}

// 地图标记
export interface MapStopRecord {
  id: string;
  day_id: string;
  name: string;
  emoji: string | null;
  lat: number;
  lng: number;
  type: string | null;
  sort_order: number;
}

// 清单分类
export interface ChecklistCategoryRecord {
  id: string;
  trip_id: string;
  category: string;
  title: string;
  icon: string | null;
  border_color: string | null;
  sort_order: number;
}

// 清单条目
export interface ChecklistItemRecord {
  id: string;
  category_id: string;
  label: string;
  sort_order: number;
}

// 清单勾选状态
export interface ChecklistCheckRecord {
  id: string;
  item_id: string;
  user_id: string;
  user_name: string | null;
  checked: boolean;
  updated_at: string;
}

// 行程信息
export interface TripInfoRecord {
  id: string;
  trip_id: string;
  section: string;
  data: Record<string, unknown>;
  sort_order: number;
}

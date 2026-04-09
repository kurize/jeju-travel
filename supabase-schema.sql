-- ============================================================
-- jeju-travel Phase 1 建表脚本
-- 在 Supabase SQL Editor 中执行
-- ============================================================

-- 旅行主表
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'local',
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '✈️',
  cover_image TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft',
  is_template BOOLEAN DEFAULT FALSE,
  forked_from UUID REFERENCES trips(id) ON DELETE SET NULL,
  share_token TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 天/日程
CREATE TABLE trip_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_label TEXT NOT NULL,
  date TEXT,
  emoji TEXT,
  theme TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 时间轴条目
CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES trip_days(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('activity', 'transport')),
  sort_order INT NOT NULL DEFAULT 0,
  time TEXT,
  title TEXT,
  korean_title TEXT,
  description TEXT,
  type_label TEXT,
  dot_color TEXT,
  tags JSONB DEFAULT '[]',
  learn_more_content TEXT,
  learn_more_image TEXT,
  bg_tint TEXT,
  mode TEXT,
  duration TEXT,
  destination TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 地图标记
CREATE TABLE map_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES trip_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  type TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- 清单分类
CREATE TABLE checklist_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  border_color TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- 清单条目
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES checklist_categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 清单勾选状态
CREATE TABLE checklist_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT 'local',
  user_name TEXT,
  checked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(item_id, user_id, user_name)
);

-- 行程信息
CREATE TABLE trip_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  data JSONB NOT NULL,
  sort_order INT DEFAULT 0
);

-- 索引
CREATE INDEX idx_trip_days_trip ON trip_days(trip_id);
CREATE INDEX idx_timeline_items_day ON timeline_items(day_id);
CREATE INDEX idx_map_stops_day ON map_stops(day_id);
CREATE INDEX idx_checklist_categories_trip ON checklist_categories(trip_id);
CREATE INDEX idx_checklist_items_category ON checklist_items(category_id);
CREATE INDEX idx_checklist_checks_item ON checklist_checks(item_id);
CREATE INDEX idx_trips_share_token ON trips(share_token);
CREATE INDEX idx_trips_user ON trips(user_id);

-- 禁用 RLS（个人项目）
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE trip_days DISABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE map_stops DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_checks DISABLE ROW LEVEL SECURITY;
ALTER TABLE trip_info DISABLE ROW LEVEL SECURITY;

-- 授权 anon 访问
GRANT ALL ON trips TO anon;
GRANT ALL ON trip_days TO anon;
GRANT ALL ON timeline_items TO anon;
GRANT ALL ON map_stops TO anon;
GRANT ALL ON checklist_categories TO anon;
GRANT ALL ON checklist_items TO anon;
GRANT ALL ON checklist_checks TO anon;
GRANT ALL ON trip_info TO anon;

// ============================================================
// Jeju Island Travel App — Design System v2.0
// 基于设计规范图更新 2026-03-29
// ============================================================

export const colors = {
  // 主色
  primary:        '#F5727F',  // Coral Pink
  lavender:       '#8D82D3',  // Lavender Purple
  softBlue:       '#BDD8DB',  // Soft Blue
  warmBeige:      '#FCF7EE',  // Warm Beige

  // 强调色
  amber:          '#FFBF00',  // Amber — 韩文文字、选中态
  forestGreen:    '#4CAF50',  // Forest Green
  orangeYellow:   '#FBA044',  // Orange Yellow
  rosePink:       '#FF6B90',  // Rose Pink
  brown:          '#8B4513',  // Brown

  // 背景
  bgPage:         '#FFF8F0',  // 全局页面底色
  bgCard:         '#FFFFFF',  // 卡片背景
  bgMap:          '#F5F0E8',  // 地图区域
  bgHighlight:    '#F5E6D0',  // 提示条背景
  bgLearnMore:    '#F5F0E8',  // Learn more 展开区
  bgTimeline:     '#F8F4EE',  // 时间轴背景

  // 功能色（餐饮按钮）
  breakfast:      '#F5A623',
  lunch:          '#4CAF50',
  dinner:         '#E07878',
  coffee:         '#8B4513',

  // 标签 Tag 颜色
  tagDining:      '#D4537E',
  tagCoffee:      '#8B4513',
  tagTransport:   '#8D82D3',
  tagDifficult:   '#FBA044',
  tagHiking:      '#8D82D3',
  tagCompleted:   '#4CAF50',

  // Checklist 分类卡片边框
  cardDocuments:  '#F5727F',
  cardCurrency:   '#BDD8DB',
  cardComms:      '#8D82D3',
  cardRestaurant: '#F5727F',
  cardTransport:  '#BDD8DB',
  cardPacking:    '#8D82D3',

  // 时间轴圆点
  dotRestaurant:  '#FF6B9D',
  dotAttraction:  '#4CAF50',
  dotCoffee:      '#8B4513',
  dotTransport:   '#8D82D3',
  dotHotel:       '#BDD8DB',
  dotCurrent:     '#F5727F',  // 当前时段
  dotFuture:      '#E0E0E0',

  // 时间轴线
  timelineLine:   '#E8D0B0',

  // 中性色
  textPrimary:    '#2F2F2F',  // Deep Gray
  textSecondary:  '#757575',  // Medium Gray
  textMuted:      '#E0E0E0',  // Light Gray
  white:          '#FFFFFF',
  border:         '#E8D0B0',
  borderLight:    '#E0E0E0',

  // 紧急联系
  emergencyRed:   '#FF6B6B',
} as const;

export const typography = {
  fontDisplay: "'ZCOOL KuaiLe', 'Caveat', cursive",  // 中文标题手绘体
  fontHand:    "'Caveat', cursive",                    // 英文手写体
  fontKorean:  "'Gaegu', cursive",                     // 韩文手写体
  fontBody:    "'Nunito', sans-serif",                 // 正文

  h1: { size: '28px', weight: 700, lineHeight: '36px', letterSpacing: '-0.5px', color: colors.primary },
  h2: { size: '24px', weight: 700, lineHeight: '32px', letterSpacing: '-0.3px', color: colors.primary },
  h3: { size: '20px', weight: 700, lineHeight: '28px', color: colors.primary },
  subtitle: { size: '16px', weight: 500, lineHeight: '24px', color: colors.textPrimary },
  body: { size: '14px', weight: 400, lineHeight: '22px', color: colors.textPrimary },
  label: { size: '12px', weight: 400, lineHeight: '18px', letterSpacing: '0.3px', color: colors.textSecondary },
  korean: { size: '14px', weight: 400, lineHeight: '22px', color: colors.amber },
} as const;

export const radius = {
  sm:       '12px',
  md:       '16px',
  lg:       '20px',
  xl:       '24px',
  circular: '50%',
} as const;

export const spacing = {
  xs:  '8px',
  sm:  '16px',
  md:  '24px',
  lg:  '32px',
  xl:  '48px',
  base: '8px',  // 基础单位
} as const;

export const shadows = {
  level0: 'none',
  level1: '0 2px 8px rgba(0,0,0,0.1)',      // 卡片
  level2: '0 4px 12px rgba(0,0,0,0.15)',     // 按钮 hover / 下拉
  level3: '0 4px 12px rgba(255,191,0,0.3)',  // 选中 pill / 激活态
  level4: '0 8px 24px rgba(0,0,0,0.2)',      // Modal
} as const;

export const borders = {
  card:        `2px solid ${colors.border}`,
  cardAccent:  `2.5px solid ${colors.primary}`,
  cardBlue:    `2px solid ${colors.softBlue}`,
  dashed:      `2px dashed ${colors.borderLight}`,
  emergency:   `2px solid ${colors.emergencyRed}`,
} as const;

// ============================================================
// 组件速查表
// ============================================================
export const components = {
  Button: {
    primary: {
      default:  { bg: colors.primary,  color: '#FFFFFF', shadow: '0 2px 4px rgba(0,0,0,0.1)' },
      hover:    { bg: '#E35F6C',       color: '#FFFFFF', shadow: '0 4px 8px rgba(0,0,0,0.15)' },
      active:   { bg: '#D14D5A',       color: '#FFFFFF', shadow: '0 1px 2px rgba(0,0,0,0.1)' },
      disabled: { bg: '#9E8E8E',       color: '#FFFFFF', shadow: 'none' },
    },
    secondary: {
      default:  { bg: 'transparent', color: colors.primary, border: `2px solid ${colors.primary}`, shadow: '0 2px 4px rgba(0,0,0,0.1)' },
      hover:    { bg: 'transparent', color: '#E35F6C',      border: '2px solid #E35F6C',           shadow: '0 4px 8px rgba(0,0,0,0.15)' },
      active:   { bg: '#F1E4E6',    color: colors.primary,  border: `2px solid ${colors.primary}`, shadow: '0 1px 2px rgba(0,0,0,0.1)' },
      disabled: { bg: 'transparent', color: '#9E9E9E',      border: '2px solid #9E9E9E',           shadow: 'none' },
    },
    icon: { size: '48px', radius: '50%' },
    radius: radius.xl,
    padding: '10px 24px',
  },
  Tag: {
    height:    '32px',
    padding:   '8px 16px',
    radius:    radius.lg,
    fontSize:  '14px',
    fontWeight: 700,
  },
  Checkbox: {
    size:      '24px',
    innerSize: '16px',
    radius:    '50%',
    checked:   { bg: colors.forestGreen, color: '#FFFFFF' },
    unchecked: { bg: 'transparent', border: `2px solid ${colors.borderLight}` },
    disabled:  { bg: '#E0E0E0', cursor: 'not-allowed' },
  },
  ProgressBar: {
    height:   '12px',
    radius:   '6px',
    gradient: 'linear-gradient(to right, #F5A623, #4CAF50)',
    bg:       '#E8E8E8',
  },
  DayTab: {
    minWidth:  '80px',
    height:    '64px',
    padding:   '12px 16px',
    radius:    radius.xl,
    selected:  { bg: colors.amber, color: '#FFFFFF', shadow: shadows.level3 },
    hover:     { bg: '#FFF3D0', color: colors.textPrimary, shadow: 'none' },
    unselected:{ bg: '#FFFFFF', color: colors.textSecondary, border: `2px solid ${colors.borderLight}`, shadow: 'none' },
  },
  MealButton: {
    breakfast: { bg: colors.breakfast },
    lunch:     { bg: colors.lunch },
    dinner:    { bg: colors.dinner },
    coffee:    { bg: colors.coffee },
    radius:    radius.xl,
    padding:   '8px 16px',
  },
  ActivityCard: {
    radius:    radius.md,
    shadow:    shadows.level1,
    leftBorder: '4px',
  },
  TimelineDot: {
    restaurant:  { size: '12px', color: colors.dotRestaurant },
    attraction:  { size: '12px', color: colors.dotAttraction },
    coffee:      { size: '12px', color: colors.dotCoffee },
    transport:   { size: '12px', color: colors.dotTransport },
    hotel:       { size: '12px', color: colors.dotHotel },
    current:     { size: '14px', color: colors.dotCurrent },
    future:      { size: '10px', color: colors.dotFuture },
  },
} as const;

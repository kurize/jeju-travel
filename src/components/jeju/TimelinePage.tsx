'use client';

import React, { useState } from 'react';
import { colors, typography } from '@/lib/theme';
import DayTab from './DayTab';
import TimelineActivityCard from './TimelineActivityCard';
import TimelineTransportPill from './TimelineTransportPill';
import DayMapLazy, { type MapStop } from './DayMapLazy';
import JejuBanner from './JejuBanner';

interface TimelineItem {
  type: 'activity' | 'transport' | 'current';
  dotColor?: string;
  time?: string;
  title?: string;
  koreanTitle?: string;
  description?: string;
  typeLabel?: string;
  tags?: { type: 'default' | 'dining' | 'coffee' | 'completed' | 'hiking' | 'difficult' | 'transport'; label: string }[];
  learnMoreContent?: string;
  learnMoreImage?: string;
  bgTint?: string;
  isCurrent?: boolean;
  mode?: string;
  duration?: string;
  destination?: string;
}

interface DayData {
  day: string;
  date: string;
  emoji: string;
  theme: string;
  mapStops: MapStop[];
  items: TimelineItem[];
}

const daysData: DayData[] = [
  {
    day: 'D1', date: '4/4', emoji: '🌸', theme: '到达 + 涯月西线 + 樱花',
    mapStops: [
      { name: '济州机场', coord: [33.5069, 126.4928], emoji: '✈️', type: 'transport' },
      { name: '红树林酒店', coord: [33.5168, 126.5242], emoji: '🏨', type: 'hotel' },
      { name: '济州蒙国', coord: [33.5187, 126.4953], emoji: '🍜', type: 'restaurant' },
      { name: '典農路樱花', coord: [33.5066, 126.5224], emoji: '🌸', type: 'attraction' },
      { name: 'Coffeenap', coord: [33.4892, 126.4138], emoji: '☕', type: 'coffee' },
      { name: 'Sunset Cliff', coord: [33.4560, 126.3089], emoji: '🌅', type: 'attraction' },
      { name: '涯月果冻海', coord: [33.4591, 126.3104], emoji: '🌊', type: 'attraction' },
      { name: 'Doldam黑猪', coord: [33.4625, 126.3268], emoji: '🥩', type: 'restaurant' },
    ],
    items: [
      {
        type: 'activity', dotColor: colors.dotHotel, time: '09:55',
        title: '到达济州国际机场', koreanTitle: '제주국제공항',
        description: '过关+取行李约30分钟，打车到酒店约10分钟（~4000韩元）',
        typeLabel: '到达',
        tags: [{ type: 'transport', label: '交通' }],
        learnMoreContent: '济州机场是韩国第二繁忙的机场。入境流程简单，凭护照和K-ETA即可快速通关。出机场后左转即可搭乘出租车，到市区酒店约10分钟。',
        bgTint: '#F0F8FF',
      },
      { type: 'transport', mode: '出租车', duration: '10分钟', destination: '济州红树林酒店' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '11:00',
        title: '金希善济州蒙国', koreanTitle: '김희선 제주몸국',
        description: '评分4.2 | 马尾海藻猪骨汤（몸국），济州传统早餐',
        typeLabel: '早午餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '济州传统蒙国（몸국）是用海藻和猪骨熬制的浓汤，是当地人最爱的早餐。注意：周日休息。',
        learnMoreImage: '/places/momguk.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '步行', duration: '15分钟', destination: '典农路樱花街' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '12:30',
        title: '典农路樱花街', koreanTitle: '전농로 벚꽃거리',
        description: '1.2公里樱花隧道，树龄20-100年。4月初可能落樱纷飞',
        typeLabel: '景点',
        tags: [{ type: 'default', label: '赏樱' }],
        learnMoreContent: '济州市内最著名的赏樱路，每年3月底至4月初满开。道路两旁种满济州特有的王樱花（왕벚꽃），花瓣比日本樱花更大更饱满。附近新山公园和济州大学樱花路也值得一逛。',
        learnMoreImage: '/places/cherry-blossom.jpg',
        bgTint: '#FFF0F8',
      },
      { type: 'transport', mode: '出租车', duration: '30分钟', destination: '涯月邑' },
      {
        type: 'activity', dotColor: colors.dotCoffee, time: '14:30',
        title: 'Coffeenap Roasters', koreanTitle: '커피냅 로스터스',
        description: '传统济州石头屋改造，院子里有小猫，自家烘焙 | 评分4.4',
        typeLabel: '咖啡',
        tags: [{ type: 'coffee', label: '咖啡' }],
        learnMoreContent: '备选：Haejigae Cafe（涯月北西路52号，海景咖啡），两家风格不同选其一。',
        learnMoreImage: '/places/coffeenap.jpg',
      },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '15:30',
        title: 'Sunset Cliff', koreanTitle: '선셋클리프',
        description: '涯月海边悬崖观景台，拍照绝佳',
        typeLabel: '打卡',
        tags: [{ type: 'default', label: '拍照' }],
        learnMoreContent: '涯月邑的悬崖观景台，面朝大海视野开阔，日落时分光线打在玄武岩上非常壮观。适合拍剪影照，建议日落前1小时到达占位。',
        learnMoreImage: '/places/sunset-cliff.jpg',
      },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '17:30',
        title: '涯月果冻海日落',
        description: '沿海岸线散步，海水如果冻般通透。日落约18:40',
        typeLabel: '日落',
        tags: [{ type: 'default', label: '日落' }],
        learnMoreContent: '涯月海岸线的海水清澈见底，因阳光折射呈现果冻般的翡翠色而得名"果冻海"。日落时海面被染成金色，是济州西海岸最浪漫的时刻。沿海岸步道散步约30分钟。',
        learnMoreImage: '/places/ocean-sunset.jpg',
      },
      { type: 'transport', mode: '出租车', duration: '10分钟', destination: 'Doldam Black Pork' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '19:00',
        title: 'Doldam Black Pork', koreanTitle: '돌담흑돼지',
        description: '熟成黑猪肉烤肉 | 评分4.8 | 店员帮烤 | 营业到凌晨2点',
        typeLabel: '晚餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '济州黑猪肉以肉质鲜嫩多汁著称，是济州岛最具代表性的美食之一。这家店用熟成工艺让肉质更加入味，店员帮烤火候恰到好处。预估费用：60,000-80,000韩元（2人）。',
        learnMoreImage: '/places/black-pork.jpg',
        bgTint: '#FFF5F5',
      },
    ],
  },
  {
    day: 'D2', date: '4/5', emoji: '⛰️', theme: '东线一日（日出峰+海女+月汀里）',
    mapStops: [
      { name: '鹿山路', coord: [33.3960, 126.7294], emoji: '🌻', type: 'attraction' },
      { name: 'Delmoondo', coord: [33.5438, 126.6688], emoji: '☕', type: 'coffee' },
      { name: '城山日出峰', coord: [33.4595, 126.9395], emoji: '⛰️', type: 'attraction' },
      { name: '涉地可支', coord: [33.4242, 126.9311], emoji: '🏖️', type: 'attraction' },
      { name: '海女之家', coord: [33.4612, 126.9321], emoji: '🤿', type: 'restaurant' },
      { name: '月汀里', coord: [33.5556, 126.7969], emoji: '☕', type: 'coffee' },
      { name: 'Jeju Madang', coord: [33.4982, 126.4582], emoji: '🐟', type: 'restaurant' },
    ],
    items: [
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '07:30',
        title: '鹿山路', koreanTitle: '녹산로',
        description: '绵延8公里，济州唯一同时看到樱花和油菜花的道路',
        typeLabel: '车览',
        tags: [{ type: 'default', label: '赏樱' }, { type: 'default', label: '油菜花' }],
        learnMoreContent: '连接表善面和南元邑的乡间公路，两侧种满了油菜花和樱花。每年春天金黄与粉白交织的画面成为济州最具代表性的春景。适合车上欣赏，也可以停车拍照。',
        learnMoreImage: '/places/canola-road.jpg',
        bgTint: '#FFFFF0',
      },
      { type: 'transport', mode: '出租车', duration: '30分钟', destination: 'Cafe Delmoondo' },
      {
        type: 'activity', dotColor: colors.dotCoffee, time: '08:00',
        title: 'Cafe Delmoondo',
        description: '咸德海水浴场旁 | 早6点开门 | 可颂和肉桂卷是招牌',
        typeLabel: '早餐',
        tags: [{ type: 'coffee', label: '咖啡' }, { type: 'dining', label: '用餐' }],
        learnMoreContent: '咸德海水浴场（함덕해수욕장）是济州北部最美海滩之一，浅蓝色清澈海水，白色沙滩。吃完可在海滩散步，远处可望见城山日出峰轮廓。',
        learnMoreImage: '/places/hamdeok-beach.jpg',
      },
      { type: 'transport', mode: '出租车', duration: '30分钟', destination: '城山日出峰' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '09:30',
        title: '城山日出峰', koreanTitle: '성산일출봉',
        description: 'UNESCO世界自然遗产 | 门票5,000韩元 | 登顶30-40分钟',
        typeLabel: '景点',
        tags: [{ type: 'hiking', label: '徒步' }],
        learnMoreContent: '约10万年前海底火山喷发形成的巨大岩石山，海拔182米，山顶有直径约600米的火山口。名字来源于"看日出最美的山峰"。登顶后360度全景：一侧大海，另一侧牛岛和济州东海岸。',
        learnMoreImage: '/places/seongsan.jpg',
        bgTint: '#F0FFF0',
      },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '11:00',
        title: '涉地可支', koreanTitle: '섭지코지',
        description: '黑色玄武岩海岸+绿色草坪，沿栈道散步约1小时',
        typeLabel: '景点',
        tags: [{ type: 'default', label: '海岸' }],
        learnMoreContent: '济州东海岸伸入海中的岬角，由黑色火山岩和翠绿草坪组成，尽头有白色灯塔。天气好时能看到城山日出峰和牛岛的壮丽全景。安藤忠雄设计的"Genius Loci"建筑也在此处。电视剧《All In》取景地。',
        learnMoreImage: '/places/seopjikoji.jpg',
      },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '12:30',
        title: '海女之家', koreanTitle: '해녀의집',
        description: '91名海女合伙经营 | 1点前点菜，2点看海女潜水表演',
        typeLabel: '午餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '济州岛独有的海女（해녀）文化已列入UNESCO非物质文化遗产。海女不使用氧气设备，凭一口气潜入10-20米深海中采集海鲜。现役海女大多60-80岁高龄。现捞的海螺、鲍鱼、海胆直接入厨房。预估费用：50,000-70,000韩元（2人）。',
        learnMoreImage: '/places/haenyeo.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '出租车', duration: '20分钟', destination: '月汀里' },
      {
        type: 'activity', dotColor: colors.dotCoffee, time: '15:00',
        title: '月汀里 + 咖啡馆慕月', koreanTitle: '월정리',
        description: '济州东海岸最有名的咖啡街 | 翡翠色海水+白沙滩+彩色咖啡馆',
        typeLabel: '咖啡',
        tags: [{ type: 'coffee', label: '咖啡' }],
        learnMoreContent: '备选：伦敦贝果博物馆（특색贝果店）或 카페 모알보알（东部海边咖啡）。',
        learnMoreImage: '/places/woljeongri.jpg',
      },
      { type: 'transport', mode: '出租车', duration: '40分钟', destination: 'Jeju Madang' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '18:30',
        title: 'Jeju Madang', koreanTitle: '제주마당',
        description: '带鱼料理专门店 | 烤带鱼+带鱼煮两种吃法',
        typeLabel: '晚餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '济州近海盛产银带鱼，是济州最具代表性的海鲜之一。济州带鱼比一般带鱼更肥厚鲜甜。红烧带鱼煮（갈치조림）酱香浓郁，炭火烤带鱼（갈치구이）外焦里嫩。预估费用：50,000-60,000韩元（2人）。',
        learnMoreImage: '/places/grilled-fish.jpg',
        bgTint: '#FFF5F5',
      },
    ],
  },
  {
    day: 'D3', date: '4/6', emoji: '🐄', theme: '牛岛 + 东门市场 + 龙头岩日落',
    mapStops: [
      { name: '城山浦港', coord: [33.4737, 126.9292], emoji: '⛴️', type: 'transport' },
      { name: '牛岛', coord: [33.5053, 126.9558], emoji: '🐄', type: 'attraction' },
      { name: '东门市场', coord: [33.5116, 126.5260], emoji: '🛒', type: 'restaurant' },
      { name: '三姓穴', coord: [33.5047, 126.5293], emoji: '🌸', type: 'attraction' },
      { name: '龙头岩', coord: [33.5162, 126.5121], emoji: '🐉', type: 'attraction' },
      { name: '만배회센타', coord: [33.4867, 126.4930], emoji: '🍣', type: 'restaurant' },
    ],
    items: [
      { type: 'transport', mode: '出租车', duration: '50分钟', destination: '城山浦港' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '08:30',
        title: '牛岛', koreanTitle: '우도',
        description: '渡轮15分钟 | 船票~5,500韩元/人 | 带护照 | 骑行环岛3-4小时',
        typeLabel: '景点',
        tags: [{ type: 'hiking', label: '骑行' }, { type: 'default', label: '海滩' }],
        learnMoreContent: '因形似卧牛而得名。拥有韩国唯一的珊瑚沙海水浴场——"西滨白沙"，海水呈梦幻翡翠色。环岛约17公里，骑自行车最受欢迎。必吃花生冰淇淋（牛岛特产花生制作），还有黑色花生拿铁。',
        learnMoreImage: '/places/udo-island.jpg',
        bgTint: '#F0FFFF',
      },
      { type: 'transport', mode: '渡轮+出租车', duration: '60分钟', destination: '东门市场' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '13:30',
        title: '东门市场', koreanTitle: '동문시장',
        description: '济州最大传统市场 | 300+摊位 | 离酒店步行10分钟',
        typeLabel: '午餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '1945年开业至今的济州最大最古老传统市场。推荐：现烤海鲜（鲍鱼、扇贝）、黑猪肉紫菜卷、济州橘子鲜榨果汁、辣炒年糕、红衣花生。每周五六日晚上还有夜市。预估费用：~30,000韩元（2人）。',
        learnMoreImage: '/places/dongmun-market.jpg',
        bgTint: '#FFF8F0',
      },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '15:00',
        title: '三姓穴 + 宝健路', koreanTitle: '삼성혈 · 보건로',
        description: '樱花搭配韩屋 | 宝健路步行街购物 | 七星路商业街',
        typeLabel: '逛街',
        tags: [{ type: 'default', label: '赏樱' }, { type: 'default', label: '购物' }],
        learnMoreContent: '三姓穴是济州岛建岛传说的发源地，三位神人从地底涌出的三个洞穴。4月初樱花盛开时，传统韩屋与粉色樱花交相辉映，非常出片。出来后步行5分钟到宝健路步行街，可以逛化妆品店和特色小店。',
        learnMoreImage: '/places/cherry-blossom.jpg',
      },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '17:30',
        title: '龙头岩', koreanTitle: '용두암',
        description: '步行可达 | 200万年前火山熔岩形成 | 日落约18:40',
        typeLabel: '日落',
        tags: [{ type: 'default', label: '日落' }],
        learnMoreContent: '200万年前火山熔岩从汉拿山流入大海时冷却凝固形成，高约10米，因酷似龙头仰天长啸而得名。传说是一条想飞上天的龙被神仙的箭射中后化为石头。日落时分最佳。',
        learnMoreImage: '/places/yongduam.jpg',
      },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '18:30',
        title: '만배회센타', koreanTitle: '만배회센타',
        description: '评分4.4 | 双人套餐60,000韩元 | 现金95折 | 堂食等~1小时',
        typeLabel: '晚餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '万倍生鱼片中心，近500条评价。推荐：鰤鱼生鱼片+青花鱼+套餐送酱蟹。地址：济州市国基路2街2-9（莲洞）。堂食通常等1小时，可选外带（25-30分钟）。现金支付95折，建议备好现金。',
        learnMoreImage: '/places/sashimi.jpg',
        bgTint: '#FFF5F5',
      },
    ],
  },
  {
    day: 'D4', date: '4/7', emoji: '✈️', theme: '离开',
    mapStops: [
      { name: '은희네해장국', coord: [33.5085, 126.5408], emoji: '🍲', type: 'restaurant' },
      { name: '新罗免税店', coord: [33.4863, 126.4874], emoji: '🛍️', type: 'attraction' },
      { name: '济州机场', coord: [33.5069, 126.4928], emoji: '✈️', type: 'transport' },
    ],
    items: [
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '07:30',
        title: '早餐', koreanTitle: '은희네해장국 본점',
        description: '醒酒汤名店 | 备选：酒店附近便利店/咖啡厅',
        typeLabel: '早餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '银熙家醒酒汤（은희네해장국）是济州排名前列的醒酒汤店。招牌是猪骨醒酒汤，浓郁鲜美，配上泡菜和米饭是完美的早餐。地址靠近济州机场和市区，适合最后一天早起吃完出发。',
        learnMoreImage: '/places/momguk.jpg',
        bgTint: '#FFF5F5',
      },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '08:30',
        title: '新罗免税店',
        description: '69 Noyeon-ro | 济州免税店人少，比首尔好逛',
        typeLabel: '购物',
        tags: [{ type: 'default', label: '购物' }],
        learnMoreContent: '济州新罗免税店位于莲洞，比首尔明洞店人少很多。品牌齐全，购物环境舒适。建议提前在网上下单到店取货更快。营业时间9:00-20:00。',
      },
      { type: 'transport', mode: '出租车', duration: '10分钟', destination: '济州机场' },
      {
        type: 'activity', dotColor: colors.dotHotel, time: '09:30',
        title: '前往机场', koreanTitle: '제주국제공항',
        description: '建议提前1.5小时到达 | 济州航空休息室J可候机',
        typeLabel: '出发',
        tags: [{ type: 'transport', label: '交通' }],
      },
      {
        type: 'activity', dotColor: colors.dotCurrent, time: '11:20',
        title: '航班起飞 ✈️',
        description: '结束济州岛之旅，带着满满的回忆回家！',
        typeLabel: '离开',
        bgTint: '#FFF0F8',
      },
    ],
  },
];

export default function TimelinePage() {
  const [activeDay, setActiveDay] = useState(0);
  const currentDay = daysData[activeDay];

  return (
    <div
      style={{
        paddingBottom: '120px',
        minHeight: '100vh',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(200,180,150,0.03) 32px, rgba(200,180,150,0.03) 33px),
          radial-gradient(circle at 85% 10%, rgba(141,130,211,0.06) 0%, transparent 50%),
          radial-gradient(circle at 15% 80%, rgba(245,114,127,0.04) 0%, transparent 50%),
          linear-gradient(135deg, #FFF8F0 0%, #FCF7EE 50%, #FFF5E8 100%)
        `,
      }}
    >
      {/* 横幅 */}
      <JejuBanner image="jeju-travelpublicbanner-jeju-01.jpg" />

      {/* 日期选择器 */}
      <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {daysData.map((day, i) => (
          <DayTab
            key={i}
            day={day.day}
            date={day.date}
            emoji={day.emoji}
            active={activeDay === i}
            onClick={() => setActiveDay(i)}
          />
        ))}
      </div>

      {/* 今日主题 */}
      <div style={{
        margin: '0 16px 16px', padding: '10px 14px',
        backgroundColor: `${colors.amber}15`, borderRadius: '12px',
        border: `2px dashed ${colors.amber}50`,
        fontFamily: typography.fontDisplay,
        position: 'relative',
        filter: 'url(#sketchy)',
      }}>
        <span style={{ position: 'absolute', top: '-8px', right: '14px', fontSize: '14px' }}>✨</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: colors.amber }}>
          {currentDay.emoji} 今日主题：{currentDay.theme}
        </span>
      </div>

      {/* 地图 */}
      <DayMapLazy stops={currentDay.mapStops} />

      {/* 时间轴 — 双列布局：左侧轨道 + 右侧内容 */}
      <div style={{ padding: '0 16px' }}>
        {(() => {
          let step = 0;
          return currentDay.items.map((item, index) => {
            const isActivity = item.type !== 'transport';
            if (isActivity) step++;
            const currentStep = step;
            const isFirst = index === 0;
            const isLast = index === currentDay.items.length - 1;
            const dotColor = item.dotColor || colors.dotFuture;

            return (
              <div key={index} style={{ display: 'flex', gap: '0' }}>
                {/* 左侧轨道 */}
                <div style={{
                  width: '40px', flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  {/* 上半段线 */}
                  <div style={{
                    width: '2px', flex: 1,
                    backgroundColor: isFirst ? 'transparent' : colors.timelineLine,
                  }} />
                  {/* 圆点 */}
                  {isActivity ? (
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      backgroundColor: dotColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 0 0 3px ${dotColor}25`,
                    }}>
                      <span style={{
                        fontSize: '12px', fontWeight: 800, color: '#FFFFFF',
                        fontFamily: typography.fontBody,
                      }}>{currentStep}</span>
                    </div>
                  ) : (
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: colors.lavender,
                      flexShrink: 0,
                      boxShadow: `0 0 0 2px ${colors.lavender}25`,
                    }} />
                  )}
                  {/* 下半段线 */}
                  <div style={{
                    width: '2px', flex: 1,
                    backgroundColor: isLast ? 'transparent' : colors.timelineLine,
                  }} />
                </div>
                {/* 右侧内容 */}
                <div style={{ flex: 1, padding: '8px 0', minWidth: 0 }}>
                  {isActivity ? (
                    <>
                      {item.time && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center',
                          marginBottom: '6px',
                          padding: '2px 10px',
                          borderRadius: '10px',
                          backgroundColor: `${dotColor}18`,
                          border: `1.5px solid ${dotColor}40`,
                        }}>
                          <span style={{
                            fontSize: '13px', fontWeight: 800,
                            color: dotColor,
                            fontFamily: typography.fontBody,
                          }}>{item.time}</span>
                        </div>
                      )}
                      <TimelineActivityCard
                        title={item.title!}
                        koreanTitle={item.koreanTitle}
                        description={item.description}
                        typeLabel={item.typeLabel}
                        tags={item.tags}
                        learnMoreContent={item.learnMoreContent}
                        learnMoreImage={item.learnMoreImage}
                        bgTint={item.bgTint}
                        isCurrent={item.isCurrent}
                      />
                    </>
                  ) : (
                    <TimelineTransportPill mode={item.mode!} duration={item.duration!} destination={item.destination!} />
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* 底部装饰 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.4, fontSize: '20px' }}>
        <span>🤿</span><span style={{ transform: 'rotate(-5deg)' }}>🌴</span>
        <span>🧳</span><span style={{ transform: 'rotate(10deg)' }}>🌺</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: colors.textSecondary, fontFamily: typography.fontHand, opacity: 0.5 }}>
        ~ have a wonderful trip ~
      </div>
    </div>
  );
}

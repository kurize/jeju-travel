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
    day: 'D1', date: '4/4', emoji: '🌊', theme: '西线：休闲海景 + 治愈咖啡',
    mapStops: [
      { name: '济州机场', coord: [33.5069, 126.4928], emoji: '✈️', type: 'transport' },
      { name: '은혜전복', coord: [33.4630, 126.3102], emoji: '🍜', type: 'restaurant' },
      { name: 'Team blow', coord: [33.4592, 126.3105], emoji: '☕', type: 'coffee' },
      { name: '挟才浴场', coord: [33.3936, 126.2396], emoji: '🏖️', type: 'attraction' },
      { name: '오만정성', coord: [33.3620, 126.2400], emoji: '🐟', type: 'restaurant' },
    ],
    items: [
      {
        type: 'activity', dotColor: colors.dotHotel, time: '10:00',
        title: '抵达济州国际机场', koreanTitle: '제주국제공항',
        description: '过关+取行李约30分钟 | Hello Kitty休息室可候机休息',
        typeLabel: '到达',
        tags: [{ type: 'transport', label: '交通' }],
        learnMoreContent: '济州机场Hello Kitty主题休息室位于国内线出发层，粉色装修适合拍照打卡。若从机场直接出发，步行即可到达休息室。到酒店约15-20分钟车程。',
        bgTint: '#F0F8FF',
      },
      { type: 'transport', mode: '包车', duration: '30分钟', destination: '涯月邑' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '10:45',
        title: '은혜전복 鲍鱼料理', koreanTitle: '은혜전복',
        description: '涯月鲍鱼专门店 | 评分3.9 | 鲍鱼石锅饭·鲍鱼粥·烤鲍鱼',
        typeLabel: '午餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '은혜전복是涯月邑人气鲍鱼料理店，使用济州产活鲍鱼。招牌菜：전복돌솥밥（鲍鱼石锅饭）17,000韩元、전복죽（鲍鱼粥）15,000韩元、전복구이（烤鲍鱼）25,000韩元。通透玻璃窗采光好，环境舒适。地址：애월읍 애월로1길 24-3。营业10:30-20:00。',
        learnMoreImage: '/places/eunhye-abalone.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '包车', duration: '5分钟', destination: 'Team blow 咖啡厅' },
      {
        type: 'activity', dotColor: colors.dotCoffee, time: '12:45',
        title: 'Team blow / lazy pump', koreanTitle: '팀블로우 / 레이지펌프',
        description: '涯月海岸公路网红咖啡厅，面朝大海，适合拍照打卡',
        typeLabel: '打卡',
        tags: [{ type: 'coffee', label: '咖啡' }],
        learnMoreContent: '两家咖啡厅均位于涯月海岸公路沿线，距离很近。Team blow以海景露台和特调饮品出名，lazy pump走工业风+海景路线。可根据喜好选一家坐坐。',
        learnMoreImage: '/places/team-blow-cafe.jpg',
      },
      { type: 'transport', mode: '包车', duration: '20分钟', destination: '挟才海水浴场' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '13:35',
        title: '挟才海水浴场', koreanTitle: '협재해수욕장',
        description: '济州西部最美海滩，翡翠色海水+白沙滩，远眺飞扬岛',
        typeLabel: '海滩',
        tags: [{ type: 'default', label: '海滩' }, { type: 'default', label: '拍照' }],
        learnMoreContent: '挟才海水浴场是济州岛西部代表性海滩，以翡翠色清澈海水和细白沙滩著称。对面可以看到飞扬岛（비양도），天气好时景色绝美。水浅适合戏水，建议停留1小时拍照散步。',
        learnMoreImage: '/places/hyeopjae-beach.jpg',
        bgTint: '#F0FFFF',
      },
      { type: 'transport', mode: '包车', duration: '10分钟', destination: '오만정성' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '14:35',
        title: '오만정성 海鲜锅', koreanTitle: '오만정성 제주협재점',
        description: '挟才海鲜料理 | 评分4.4 | 갈치조림·해물뚝배기 | 近海景',
        typeLabel: '晚餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '오만정성 제주협재점位于挟才海水浴场附近，以新鲜海鲜料理为主打，评分4.4。招牌菜：갈치조림（红烧带鱼2人份）45,000韩元、해물뚝배기（海鲜砂锅）15,000韩元、전복구이（烤鲍鱼）25,000韩元。用餐环境明亮宽敞，可感受济州西海岸的海鲜风味。',
        learnMoreImage: '/places/omanjeongseong.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '包车', duration: '30分钟', destination: '酒店' },
      {
        type: 'activity', dotColor: colors.dotHotel, time: '16:35',
        title: '返回酒店',
        description: '结束第一天西线行程，回酒店休息',
        typeLabel: '结束',
        bgTint: '#F0F8FF',
      },
    ],
  },
  {
    day: 'D2', date: '4/5', emoji: '⛰️', theme: '东线：自然景观 + 果冻海',
    mapStops: [
      { name: '月汀里', coord: [33.5556, 126.7969], emoji: '🌊', type: 'attraction' },
      { name: 'Monmoon', coord: [33.5560, 126.7950], emoji: '☕', type: 'coffee' },
      { name: '진미식당', coord: [33.4634, 126.9352], emoji: '🍜', type: 'restaurant' },
      { name: '城山日出峰', coord: [33.4595, 126.9395], emoji: '⛰️', type: 'attraction' },
      { name: '咸德海水浴场', coord: [33.5438, 126.6688], emoji: '🏖️', type: 'attraction' },
      { name: '牛岛', coord: [33.5053, 126.9558], emoji: '🐄', type: 'attraction' },
      { name: '해녀촌', coord: [33.5537, 126.7099], emoji: '🦐', type: 'restaurant' },
    ],
    items: [
      { type: 'transport', mode: '包车', duration: '40分钟', destination: '月汀里' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '08:00',
        title: '月汀里果冻海', koreanTitle: '월정리 해변',
        description: '济州东海岸最有名的果冻海，翡翠色海水+白沙滩+彩色咖啡馆',
        typeLabel: '海滩',
        tags: [{ type: 'default', label: '海滩' }, { type: 'default', label: '拍照' }],
        learnMoreContent: '月汀里以"果冻海"闻名，海水清澈通透如果冻般。沿海有许多彩色咖啡馆和小店，是济州东部最热门的打卡地。建议早到人少时拍照，停留1.5小时。',
        learnMoreImage: '/places/woljeongri.jpg',
        bgTint: '#F0FFFF',
      },
      { type: 'transport', mode: '包车', duration: '5分钟', destination: 'Monmoon 咖啡厅' },
      {
        type: 'activity', dotColor: colors.dotCoffee, time: '09:30',
        title: 'Monmoon 咖啡厅', koreanTitle: '머문 카페',
        description: '月汀里海边人气咖啡厅，面朝大海，氛围感满分',
        typeLabel: '打卡',
        tags: [{ type: 'coffee', label: '咖啡' }],
        learnMoreContent: 'Monmoon（머문）咖啡厅紧邻月汀里海滩，海景视野绝佳。特色是大面积落地窗和极简风装修，非常适合拍照。招牌饮品推荐尝试。',
        learnMoreImage: '/places/monmoon-cafe.jpg',
      },
      { type: 'transport', mode: '包车', duration: '25分钟', destination: '진미식당' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '10:20',
        title: '진미식당 海鲜料理', koreanTitle: '진미식당',
        description: '城山35年老店 | 鲍鱼海胆海带汤·红烧带鱼 | 距日出峰步行3分钟',
        typeLabel: '午餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '진미식당是城山日出峰旁经营35年以上的老字号，上过多个电视美食节目。招牌：오분작해물뚝배기（鲍鱼海鲜砂锅）20,000韩元、전복성게미역국（鲍鱼海胆海带汤）15,000韩元、갈치조림（红烧带鱼2人份）45,000韩元。吃完步行3分钟即到城山日出峰入口。地址：성산읍 일출로 290。营业08:00-21:00。',
        learnMoreImage: '/places/jinmi.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '包车', duration: '25分钟', destination: '城山日出峰' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '12:20',
        title: '城山日出峰', koreanTitle: '성산일출봉',
        description: 'UNESCO世界自然遗产 | 门票5,000韩元 | 登顶30-40分钟',
        typeLabel: '景点',
        tags: [{ type: 'hiking', label: '徒步' }],
        learnMoreContent: '约10万年前海底火山喷发形成的巨大岩石山，海拔182米，山顶有直径约600米的火山口。登顶后360度全景：一侧大海，另一侧牛岛和济州东海岸。建议停留约2小时。',
        learnMoreImage: '/places/seongsan.jpg',
        bgTint: '#F0FFF0',
      },
      { type: 'transport', mode: '包车', duration: '20分钟', destination: '咸德海水浴场' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '14:30',
        title: '咸德海水浴场', koreanTitle: '함덕해수욕장',
        description: '济州北部最美海滩，浅蓝清澈海水，远眺城山日出峰',
        typeLabel: '海滩',
        tags: [{ type: 'default', label: '海滩' }],
        learnMoreContent: '咸德海水浴场是济州北部最受欢迎的海滩之一，水浅且清澈，沙滩细白。远处可以望见城山日出峰的轮廓，傍晚时分光线柔和适合拍照。建议停留1小时。',
        learnMoreImage: '/places/hamdeok-beach.jpg',
      },
      { type: 'transport', mode: '包车', duration: '15分钟', destination: '牛岛码头' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '15:30',
        title: '牛岛（可选）', koreanTitle: '우도',
        description: '渡轮15分钟 | 船票~5,500韩元/人 | 带护照 | 骑行环岛',
        typeLabel: '可选',
        tags: [{ type: 'hiking', label: '骑行' }, { type: 'default', label: '海滩' }],
        learnMoreContent: '因形似卧牛而得名。拥有韩国唯一的珊瑚沙海水浴场——"西滨白沙"，海水呈梦幻翡翠色。环岛约17公里，骑自行车最受欢迎。必吃花生冰淇淋。上岛需乘船，根据时间决定是否前往。',
        learnMoreImage: '/places/udo-island.jpg',
        bgTint: '#F0FFFF',
      },
      { type: 'transport', mode: '包车', duration: '20分钟', destination: '해녀촌' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '17:30',
        title: '해녀촌 성게국수', koreanTitle: '해녀촌',
        description: '东海岸海鲜名店 | 评分4.3 | 성게국수·회국수 | KBS推荐',
        typeLabel: '晚餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '해녀촌是济州东部구좌읍的海鲜名店，KBS《生放送 투데이》推荐。招牌：성게국수（海胆国수）15,000韩元——鲜甜海胆配中粗面条，无腥味浓郁鲜美；회국수（生鱼片国수）13,000韩元——清爽酸甜拌面。使用济州近海新鲜食材，口味地道。地址：구좌읍 동복로 33。营业09:00-19:00（每月第2、4个周二休息）。',
        learnMoreImage: '/places/haenyeochon.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '包车', duration: '40分钟', destination: '酒店' },
      {
        type: 'activity', dotColor: colors.dotHotel, time: '19:30',
        title: '返回酒店',
        description: '结束东线行程，回酒店休息',
        typeLabel: '结束',
        bgTint: '#F0F8FF',
      },
    ],
  },
  {
    day: 'D3', date: '4/6', emoji: '🌸', theme: '市区：樱花 + 购物 + 人文',
    mapStops: [
      { name: '典农路樱花', coord: [33.5066, 126.5224], emoji: '🌸', type: 'attraction' },
      { name: '三姓穴', coord: [33.5047, 126.5293], emoji: '🏛️', type: 'attraction' },
      { name: '우진해장국', coord: [33.5115, 126.5199], emoji: '🍲', type: 'restaurant' },
      { name: '保健路', coord: [33.4970, 126.5310], emoji: '🛍️', type: 'attraction' },
      { name: '东门市场', coord: [33.5116, 126.5260], emoji: '🛒', type: 'restaurant' },
      { name: '신중산간', coord: [33.4859, 126.4851], emoji: '🥩', type: 'restaurant' },
    ],
    items: [
      { type: 'transport', mode: '包车', duration: '20分钟', destination: '典农路' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '09:00',
        title: '典农路樱花大道', koreanTitle: '전농로 벚꽃거리',
        description: '济州赏樱热门地，韩剧同款，建议清晨前往拍空镜',
        typeLabel: '樱花',
        tags: [{ type: 'default', label: '赏樱' }, { type: 'default', label: '拍照' }],
        learnMoreContent: '典农路是济州市内最著名的赏樱路，每年3月底至4月初满开。道路两旁种满济州特有的王樱花（왕벚꽃），花瓣比日本樱花更大更饱满。建议停留1.5小时，慢慢拍照打卡。',
        learnMoreImage: '/places/cherry-blossom.jpg',
        bgTint: '#FFF0F8',
      },
      { type: 'transport', mode: '包车', duration: '10分钟', destination: '三姓穴' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '10:30',
        title: '三姓穴', koreanTitle: '삼성혈',
        description: '济州人文景点，古韩屋搭配樱花，适合拍韩服风照片',
        typeLabel: '人文',
        tags: [{ type: 'default', label: '人文' }, { type: 'default', label: '赏樱' }],
        learnMoreContent: '三姓穴是济州岛建岛传说的发源地，三位神人从地底涌出的三个洞穴。4月初樱花盛开时，传统韩屋与粉色樱花交相辉映，非常出片。建议停留40分钟-1小时。',
        learnMoreImage: '/places/samseonghyeol.jpg',
      },
      { type: 'transport', mode: '包车', duration: '10分钟', destination: '우진해장국' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '11:30',
        title: '우진해장국 蕨菜汤', koreanTitle: '우진해장국',
        description: '济州排队名店 | 评分4.4 | 蕨菜牛肉辣汤 | 上过《水曜美食会》',
        typeLabel: '午餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '우진해장국是济州市区超人气解酒汤名店，上过《水曜美食会》等多个电视节目。招牌：고사리육개장（蕨菜牛肉辣汤）10,000韩元，使用济州产蕨菜配浓郁牛骨汤底，是济州独有的传统保养食。몸국和绿豆饼也值得一试。建议11:00前到，饭点需排队。地址：제주시 서사로 11。营业06:00-22:00。',
        learnMoreImage: '/places/ujin.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '包车', duration: '5分钟', destination: '保健路' },
      {
        type: 'activity', dotColor: colors.dotAttraction, time: '13:30',
        title: '保健路购物', koreanTitle: '보건로 · 칠성로',
        description: '济州核心购物街，免税店、美妆店、服饰店，适合买买买',
        typeLabel: '购物',
        tags: [{ type: 'default', label: '购物' }],
        learnMoreContent: '保健路和七星路是济州市中心最热闹的购物商圈，有免税店、韩国美妆品牌店、服饰店等。建议停留2-2.5小时，司机可在附近停车场等候，购物结束后直接出发。',
        learnMoreImage: '/places/bogeon-road.jpg',
      },
      { type: 'transport', mode: '包车', duration: '10分钟', destination: '东门市场' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '16:00',
        title: '东门市场', koreanTitle: '동문시장',
        description: '济州最大传统市场 | 300+摊位 | 鱼饼、炒年糕、橘子糖',
        typeLabel: '市场',
        tags: [{ type: 'dining', label: '用餐' }, { type: 'default', label: '购物' }],
        learnMoreContent: '1945年开业至今的济州最大最古老传统市场。推荐：现烤海鲜（鲍鱼、扇贝）、黑猪肉紫菜卷、济州橘子鲜榨果汁、辣炒年糕、红衣花生。建议停留1.5小时。',
        learnMoreImage: '/places/dongmun-market.jpg',
        bgTint: '#FFF8F0',
      },
      { type: 'transport', mode: '包车', duration: '5分钟', destination: '신중산간 黑猪肉' },
      {
        type: 'activity', dotColor: colors.dotRestaurant, time: '17:30',
        title: '신중산간 黑猪肉', koreanTitle: '신중산간 제주흑돼지 전문점',
        description: '25-30天熟成黑猪肉 | 评分4.0 | 店员帮烤 | 双人套餐59,000韩元',
        typeLabel: '晚餐',
        tags: [{ type: 'dining', label: '用餐' }],
        learnMoreContent: '신중산간是济州人气黑猪肉烤肉店，使用25-30天熟成工艺让肉质更加鲜嫩入味。招牌套餐包含흑목살（黑猪颈肉）和흑삼겹（黑猪五花肉）。店员帮烤火候恰到好处，还有自助小菜吧。地址：제주시 노연로 48（老衡洞），营业到23:00。',
        learnMoreImage: '/places/black-pork.jpg',
        bgTint: '#FFF5F5',
      },
      { type: 'transport', mode: '包车', duration: '10分钟', destination: '酒店' },
      {
        type: 'activity', dotColor: colors.dotCurrent, time: '19:00',
        title: '返回酒店 · 行程结束',
        description: '结束3天济州岛行程，整理行李，准备返程',
        typeLabel: '结束',
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

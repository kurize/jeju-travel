import { supabase } from './supabase';

// 济州岛行程种子数据
// 将 TimelinePage.tsx / ChecklistPage.tsx / InfoPage.tsx 中的硬编码数据写入 Supabase

export async function seedJejuTrip() {
  // 1. 创建旅行主记录
  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert({
      title: '济州岛旅行',
      emoji: '🌸',
      destination: '济州岛',
      description: '4月济州岛3天行程 · 樱花+美食+海景',
      start_date: '2026-04-04',
      end_date: '2026-04-06',
      status: 'active',
      is_template: true,
      cover_image: 'jeju-travelpublicbanner-jeju-01.jpg',
    })
    .select()
    .single();

  if (tripError || !trip) {
    console.error('创建旅行失败:', tripError);
    return { success: false, error: tripError?.message };
  }

  const tripId = trip.id;

  // 2. 创建3天日程
  const daysInput = [
    { day_label: 'D1', date: '4/4', emoji: '🌊', theme: '西线：休闲海景 + 治愈咖啡', sort_order: 0 },
    { day_label: 'D2', date: '4/5', emoji: '⛰️', theme: '东线：自然景观 + 果冻海', sort_order: 1 },
    { day_label: 'D3', date: '4/6', emoji: '🌸', theme: '市区：樱花 + 购物 + 人文', sort_order: 2 },
  ];

  const { data: days, error: daysError } = await supabase
    .from('trip_days')
    .insert(daysInput.map((d) => ({ ...d, trip_id: tripId })))
    .select()
    .order('sort_order', { ascending: true });

  if (daysError || !days || days.length !== 3) {
    console.error('创建日程失败:', daysError);
    return { success: false, error: daysError?.message };
  }

  const [day1, day2, day3] = days;

  // 3. 插入地图标记
  const mapStopsData = [
    // D1
    { day_id: day1.id, name: '济州机场', emoji: '✈️', lat: 33.5069, lng: 126.4928, type: 'transport', sort_order: 0 },
    { day_id: day1.id, name: '은혜전복', emoji: '🍜', lat: 33.4630, lng: 126.3102, type: 'restaurant', sort_order: 1 },
    { day_id: day1.id, name: 'Team blow', emoji: '☕', lat: 33.4592, lng: 126.3105, type: 'coffee', sort_order: 2 },
    { day_id: day1.id, name: '挟才浴场', emoji: '🏖️', lat: 33.3936, lng: 126.2396, type: 'attraction', sort_order: 3 },
    { day_id: day1.id, name: '오만정성', emoji: '🐟', lat: 33.3620, lng: 126.2400, type: 'restaurant', sort_order: 4 },
    // D2
    { day_id: day2.id, name: '月汀里', emoji: '🌊', lat: 33.5556, lng: 126.7969, type: 'attraction', sort_order: 0 },
    { day_id: day2.id, name: 'Monmoon', emoji: '☕', lat: 33.5560, lng: 126.7950, type: 'coffee', sort_order: 1 },
    { day_id: day2.id, name: '진미식당', emoji: '🍜', lat: 33.4634, lng: 126.9352, type: 'restaurant', sort_order: 2 },
    { day_id: day2.id, name: '城山日出峰', emoji: '⛰️', lat: 33.4595, lng: 126.9395, type: 'attraction', sort_order: 3 },
    { day_id: day2.id, name: '咸德海水浴场', emoji: '🏖️', lat: 33.5438, lng: 126.6688, type: 'attraction', sort_order: 4 },
    { day_id: day2.id, name: '牛岛', emoji: '🐄', lat: 33.5053, lng: 126.9558, type: 'attraction', sort_order: 5 },
    { day_id: day2.id, name: '해녀촌', emoji: '🦐', lat: 33.5537, lng: 126.7099, type: 'restaurant', sort_order: 6 },
    // D3
    { day_id: day3.id, name: '典农路樱花', emoji: '🌸', lat: 33.5066, lng: 126.5224, type: 'attraction', sort_order: 0 },
    { day_id: day3.id, name: '三姓穴', emoji: '🏛️', lat: 33.5047, lng: 126.5293, type: 'attraction', sort_order: 1 },
    { day_id: day3.id, name: '우진해장국', emoji: '🍲', lat: 33.5115, lng: 126.5199, type: 'restaurant', sort_order: 2 },
    { day_id: day3.id, name: '保健路', emoji: '🛍️', lat: 33.4970, lng: 126.5310, type: 'attraction', sort_order: 3 },
    { day_id: day3.id, name: '东门市场', emoji: '🛒', lat: 33.5116, lng: 126.5260, type: 'restaurant', sort_order: 4 },
    { day_id: day3.id, name: '신중산간', emoji: '🥩', lat: 33.4859, lng: 126.4851, type: 'restaurant', sort_order: 5 },
  ];

  const { error: mapError } = await supabase.from('map_stops').insert(mapStopsData);
  if (mapError) console.error('插入地图标记失败:', mapError);

  // 4. 插入时间轴条目
  const timelineData = [
    // ===== D1 =====
    { day_id: day1.id, type: 'activity', sort_order: 0, time: '10:00', title: '抵达济州国际机场', korean_title: '제주국제공항', description: '过关+取行李约30分钟 | Hello Kitty休息室可候机休息', type_label: '到达', dot_color: '#BDD8DB', tags: [{ type: 'transport', label: '交通' }], learn_more_content: '济州机场Hello Kitty主题休息室位于国内线出发层，粉色装修适合拍照打卡。若从机场直接出发，步行即可到达休息室。到酒店约15-20分钟车程。', bg_tint: '#F0F8FF' },
    { day_id: day1.id, type: 'transport', sort_order: 1, mode: '包车', duration: '30分钟', destination: '涯月邑' },
    { day_id: day1.id, type: 'activity', sort_order: 2, time: '10:45', title: '은혜전복 鲍鱼料理', korean_title: '은혜전복', description: '涯月鲍鱼专门店 | 评分3.9 | 鲍鱼石锅饭·鲍鱼粥·烤鲍鱼', type_label: '午餐', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }], learn_more_content: '은혜전복是涯月邑人气鲍鱼料理店，使用济州产活鲍鱼。招牌菜：전복돌솥밥（鲍鱼石锅饭）17,000韩元、전복죽（鲍鱼粥）15,000韩元、전복구이（烤鲍鱼）25,000韩元。通透玻璃窗采光好，环境舒适。地址：애월읍 애월로1길 24-3。营业10:30-20:00。', learn_more_image: '/places/eunhye-abalone.jpg', bg_tint: '#FFF5F5' },
    { day_id: day1.id, type: 'transport', sort_order: 3, mode: '包车', duration: '5分钟', destination: 'Team blow 咖啡厅' },
    { day_id: day1.id, type: 'activity', sort_order: 4, time: '12:45', title: 'Team blow / lazy pump', korean_title: '팀블로우 / 레이지펌프', description: '涯月海岸公路网红咖啡厅，面朝大海，适合拍照打卡', type_label: '打卡', dot_color: '#8B4513', tags: [{ type: 'coffee', label: '咖啡' }], learn_more_content: '两家咖啡厅均位于涯月海岸公路沿线，距离很近。Team blow以海景露台和特调饮品出名，lazy pump走工业风+海景路线。可根据喜好选一家坐坐。', learn_more_image: '/places/team-blow-cafe.jpg' },
    { day_id: day1.id, type: 'transport', sort_order: 5, mode: '包车', duration: '20分钟', destination: '挟才海水浴场' },
    { day_id: day1.id, type: 'activity', sort_order: 6, time: '13:35', title: '挟才海水浴场', korean_title: '협재해수욕장', description: '济州西部最美海滩，翡翠色海水+白沙滩，远眺飞扬岛', type_label: '海滩', dot_color: '#4CAF50', tags: [{ type: 'default', label: '海滩' }, { type: 'default', label: '拍照' }], learn_more_content: '挟才海水浴场是济州岛西部代表性海滩，以翡翠色清澈海水和细白沙滩著称。对面可以看到飞扬岛（비양도），天气好时景色绝美。水浅适合戏水，建议停留1小时拍照散步。', learn_more_image: '/places/hyeopjae-beach.jpg', bg_tint: '#F0FFFF' },
    { day_id: day1.id, type: 'transport', sort_order: 7, mode: '包车', duration: '10分钟', destination: '오만정성' },
    { day_id: day1.id, type: 'activity', sort_order: 8, time: '14:35', title: '오만정성 海鲜锅', korean_title: '오만정성 제주협재점', description: '挟才海鲜料理 | 评分4.4 | 갈치조림·해물뚝배기 | 近海景', type_label: '晚餐', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }], learn_more_content: '오만정성 제주협재점位于挟才海水浴场附近，以新鲜海鲜料理为主打，评分4.4。招牌菜：갈치조림（红烧带鱼2人份）45,000韩元、해물뚝배기（海鲜砂锅）15,000韩元、전복구이（烤鲍鱼）25,000韩元。用餐环境明亮宽敞，可感受济州西海岸的海鲜风味。', learn_more_image: '/places/omanjeongseong.jpg', bg_tint: '#FFF5F5' },
    { day_id: day1.id, type: 'transport', sort_order: 9, mode: '包车', duration: '30分钟', destination: '酒店' },
    { day_id: day1.id, type: 'activity', sort_order: 10, time: '16:35', title: '返回酒店', description: '结束第一天西线行程，回酒店休息', type_label: '结束', dot_color: '#BDD8DB', bg_tint: '#F0F8FF' },

    // ===== D2 =====
    { day_id: day2.id, type: 'transport', sort_order: 0, mode: '包车', duration: '40分钟', destination: '月汀里' },
    { day_id: day2.id, type: 'activity', sort_order: 1, time: '08:00', title: '月汀里果冻海', korean_title: '월정리 해변', description: '济州东海岸最有名的果冻海，翡翠色海水+白沙滩+彩色咖啡馆', type_label: '海滩', dot_color: '#4CAF50', tags: [{ type: 'default', label: '海滩' }, { type: 'default', label: '拍照' }], learn_more_content: '月汀里以"果冻海"闻名，海水清澈通透如果冻般。沿海有许多彩色咖啡馆和小店，是济州东部最热门的打卡地。建议早到人少时拍照，停留1.5小时。', learn_more_image: '/places/woljeongri.jpg', bg_tint: '#F0FFFF' },
    { day_id: day2.id, type: 'transport', sort_order: 2, mode: '包车', duration: '5分钟', destination: 'Monmoon 咖啡厅' },
    { day_id: day2.id, type: 'activity', sort_order: 3, time: '09:30', title: 'Monmoon 咖啡厅', korean_title: '머문 카페', description: '月汀里海边人气咖啡厅，面朝大海，氛围感满分', type_label: '打卡', dot_color: '#8B4513', tags: [{ type: 'coffee', label: '咖啡' }], learn_more_content: 'Monmoon（머문）咖啡厅紧邻月汀里海滩，海景视野绝佳。特色是大面积落地窗和极简风装修，非常适合拍照。招牌饮品推荐尝试。', learn_more_image: '/places/monmoon-cafe.jpg' },
    { day_id: day2.id, type: 'transport', sort_order: 4, mode: '包车', duration: '25分钟', destination: '진미식당' },
    { day_id: day2.id, type: 'activity', sort_order: 5, time: '10:20', title: '진미식당 海鲜料理', korean_title: '진미식당', description: '城山35年老店 | 鲍鱼海胆海带汤·红烧带鱼 | 距日出峰步行3分钟', type_label: '午餐', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }], learn_more_content: '진미식당是城山日出峰旁经营35年以上的老字号，上过多个电视美食节目。招牌：오분작해물뚝배기（鲍鱼海鲜砂锅）20,000韩元、전복성게미역국（鲍鱼海胆海带汤）15,000韩元、갈치조림（红烧带鱼2人份）45,000韩元。吃完步行3分钟即到城山日出峰入口。地址：성산읍 일출로 290。营业08:00-21:00。', learn_more_image: '/places/jinmi.jpg', bg_tint: '#FFF5F5' },
    { day_id: day2.id, type: 'transport', sort_order: 6, mode: '包车', duration: '25分钟', destination: '城山日出峰' },
    { day_id: day2.id, type: 'activity', sort_order: 7, time: '12:20', title: '城山日出峰', korean_title: '성산일출봉', description: 'UNESCO世界自然遗产 | 门票5,000韩元 | 登顶30-40分钟', type_label: '景点', dot_color: '#4CAF50', tags: [{ type: 'hiking', label: '徒步' }], learn_more_content: '约10万年前海底火山喷发形成的巨大岩石山，海拔182米，山顶有直径约600米的火山口。登顶后360度全景：一侧大海，另一侧牛岛和济州东海岸。建议停留约2小时。', learn_more_image: '/places/seongsan.jpg', bg_tint: '#F0FFF0' },
    { day_id: day2.id, type: 'transport', sort_order: 8, mode: '包车', duration: '20分钟', destination: '咸德海水浴场' },
    { day_id: day2.id, type: 'activity', sort_order: 9, time: '14:30', title: '咸德海水浴场', korean_title: '함덕해수욕장', description: '济州北部最美海滩，浅蓝清澈海水，远眺城山日出峰', type_label: '海滩', dot_color: '#4CAF50', tags: [{ type: 'default', label: '海滩' }], learn_more_content: '咸德海水浴场是济州北部最受欢迎的海滩之一，水浅且清澈，沙滩细白。远处可以望见城山日出峰的轮廓，傍晚时分光线柔和适合拍照。建议停留1小时。', learn_more_image: '/places/hamdeok-beach.jpg' },
    { day_id: day2.id, type: 'transport', sort_order: 10, mode: '包车', duration: '15分钟', destination: '牛岛码头' },
    { day_id: day2.id, type: 'activity', sort_order: 11, time: '15:30', title: '牛岛（可选）', korean_title: '우도', description: '渡轮15分钟 | 船票~5,500韩元/人 | 带护照 | 骑行环岛', type_label: '可选', dot_color: '#4CAF50', tags: [{ type: 'hiking', label: '骑行' }, { type: 'default', label: '海滩' }], learn_more_content: '因形似卧牛而得名。拥有韩国唯一的珊瑚沙海水浴场——"西滨白沙"，海水呈梦幻翡翠色。环岛约17公里，骑自行车最受欢迎。必吃花生冰淇淋。上岛需乘船，根据时间决定是否前往。', learn_more_image: '/places/udo-island.jpg', bg_tint: '#F0FFFF' },
    { day_id: day2.id, type: 'transport', sort_order: 12, mode: '包车', duration: '20分钟', destination: '해녀촌' },
    { day_id: day2.id, type: 'activity', sort_order: 13, time: '17:30', title: '해녀촌 성게국수', korean_title: '해녀촌', description: '东海岸海鲜名店 | 评分4.3 | 성게국수·회국수 | KBS推荐', type_label: '晚餐', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }], learn_more_content: '해녀촌是济州东部구좌읍的海鲜名店，KBS《生放送 투데이》推荐。招牌：성게국수（海胆国수）15,000韩元——鲜甜海胆配中粗面条，无腥味浓郁鲜美；회국수（生鱼片国수）13,000韩元——清爽酸甜拌面。使用济州近海新鲜食材，口味地道。地址：구좌읍 동복로 33。营业09:00-19:00（每月第2、4个周二休息）。', learn_more_image: '/places/haenyeochon.jpg', bg_tint: '#FFF5F5' },
    { day_id: day2.id, type: 'transport', sort_order: 14, mode: '包车', duration: '40分钟', destination: '酒店' },
    { day_id: day2.id, type: 'activity', sort_order: 15, time: '19:30', title: '返回酒店', description: '结束东线行程，回酒店休息', type_label: '结束', dot_color: '#BDD8DB', bg_tint: '#F0F8FF' },

    // ===== D3 =====
    { day_id: day3.id, type: 'transport', sort_order: 0, mode: '包车', duration: '20分钟', destination: '典农路' },
    { day_id: day3.id, type: 'activity', sort_order: 1, time: '09:00', title: '典农路樱花大道', korean_title: '전농로 벚꽃거리', description: '济州赏樱热门地，韩剧同款，建议清晨前往拍空镜', type_label: '樱花', dot_color: '#4CAF50', tags: [{ type: 'default', label: '赏樱' }, { type: 'default', label: '拍照' }], learn_more_content: '典农路是济州市内最著名的赏樱路，每年3月底至4月初满开。道路两旁种满济州特有的王樱花（왕벚꽃），花瓣比日本樱花更大更饱满。建议停留1.5小时，慢慢拍照打卡。', learn_more_image: '/places/cherry-blossom.jpg', bg_tint: '#FFF0F8' },
    { day_id: day3.id, type: 'transport', sort_order: 2, mode: '包车', duration: '10分钟', destination: '三姓穴' },
    { day_id: day3.id, type: 'activity', sort_order: 3, time: '10:30', title: '三姓穴', korean_title: '삼성혈', description: '济州人文景点，古韩屋搭配樱花，适合拍韩服风照片', type_label: '人文', dot_color: '#4CAF50', tags: [{ type: 'default', label: '人文' }, { type: 'default', label: '赏樱' }], learn_more_content: '三姓穴是济州岛建岛传说的发源地，三位神人从地底涌出的三个洞穴。4月初樱花盛开时，传统韩屋与粉色樱花交相辉映，非常出片。建议停留40分钟-1小时。', learn_more_image: '/places/samseonghyeol.jpg' },
    { day_id: day3.id, type: 'transport', sort_order: 4, mode: '包车', duration: '10分钟', destination: '우진해장국' },
    { day_id: day3.id, type: 'activity', sort_order: 5, time: '11:30', title: '우진해장국 蕨菜汤', korean_title: '우진해장국', description: '济州排队名店 | 评分4.4 | 蕨菜牛肉辣汤 | 上过《水曜美食会》', type_label: '午餐', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }], learn_more_content: '우진해장국是济州市区超人气解酒汤名店，上过《水曜美食会》等多个电视节目。招牌：고사리육개장（蕨菜牛肉辣汤）10,000韩元，使用济州产蕨菜配浓郁牛骨汤底，是济州独有的传统保养食。몸국和绿豆饼也值得一试。建议11:00前到，饭点需排队。地址：제주시 서사로 11。营业06:00-22:00。', learn_more_image: '/places/ujin.jpg', bg_tint: '#FFF5F5' },
    { day_id: day3.id, type: 'transport', sort_order: 6, mode: '包车', duration: '5分钟', destination: '保健路' },
    { day_id: day3.id, type: 'activity', sort_order: 7, time: '13:30', title: '保健路购物', korean_title: '보건로 · 칠성로', description: '济州核心购物街，免税店、美妆店、服饰店，适合买买买', type_label: '购物', dot_color: '#4CAF50', tags: [{ type: 'default', label: '购物' }], learn_more_content: '保健路和七星路是济州市中心最热闹的购物商圈，有免税店、韩国美妆品牌店、服饰店等。建议停留2-2.5小时，司机可在附近停车场等候，购物结束后直接出发。', learn_more_image: '/places/bogeon-road.jpg' },
    { day_id: day3.id, type: 'transport', sort_order: 8, mode: '包车', duration: '10分钟', destination: '东门市场' },
    { day_id: day3.id, type: 'activity', sort_order: 9, time: '16:00', title: '东门市场', korean_title: '동문시장', description: '济州最大传统市场 | 300+摊位 | 鱼饼、炒年糕、橘子糖', type_label: '市场', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }, { type: 'default', label: '购物' }], learn_more_content: '1945年开业至今的济州最大最古老传统市场。推荐：现烤海鲜（鲍鱼、扇贝）、黑猪肉紫菜卷、济州橘子鲜榨果汁、辣炒年糕、红衣花生。建议停留1.5小时。', learn_more_image: '/places/dongmun-market.jpg', bg_tint: '#FFF8F0' },
    { day_id: day3.id, type: 'transport', sort_order: 10, mode: '包车', duration: '5分钟', destination: '신중산간 黑猪肉' },
    { day_id: day3.id, type: 'activity', sort_order: 11, time: '17:30', title: '신중산간 黑猪肉', korean_title: '신중산간 제주흑돼지 전문점', description: '25-30天熟成黑猪肉 | 评分4.0 | 店员帮烤 | 双人套餐59,000韩元', type_label: '晚餐', dot_color: '#FF6B9D', tags: [{ type: 'dining', label: '用餐' }], learn_more_content: '신중산간是济州人气黑猪肉烤肉店，使用25-30天熟成工艺让肉质更加鲜嫩入味。招牌套餐包含흑목살（黑猪颈肉）和흑삼겹（黑猪五花肉）。店员帮烤火候恰到好处，还有自助小菜吧。地址：제주시 노연로 48（老衡洞），营业到23:00。', learn_more_image: '/places/black-pork.jpg', bg_tint: '#FFF5F5' },
    { day_id: day3.id, type: 'transport', sort_order: 12, mode: '包车', duration: '10分钟', destination: '酒店' },
    { day_id: day3.id, type: 'activity', sort_order: 13, time: '19:00', title: '返回酒店 · 行程结束', description: '结束3天济州岛行程，整理行李，准备返程', type_label: '结束', dot_color: '#F5727F', bg_tint: '#FFF0F8' },
  ];

  const { error: timelineError } = await supabase.from('timeline_items').insert(timelineData);
  if (timelineError) console.error('插入时间轴条目失败:', timelineError);

  // 5. 插入清单分类和条目
  const checklistData = [
    { category: 'documents', title: '证件与文件', icon: '📋', border_color: '#F5727F', items: ['护照（有效期6个月以上）', 'K-ETA / 免签确认', '机票行程单（去程+回程）', '酒店预订确认单', '身份证（国内段备用）'] },
    { category: 'currency', title: '货币与支付', icon: '💰', border_color: '#BDD8DB', items: ['换韩元现金（10-20万/人）', '开通信用卡境外支付', '만배회센타备现金（95折）'] },
    { category: 'communication', title: '通讯与导航', icon: '📱', border_color: '#8D82D3', items: ['韩国SIM卡/境外流量', 'KakaoTaxi 打车'] },
    { category: 'restaurant', title: '餐厅预约', icon: '🍴', border_color: '#F5727F', items: ['Doldam 黑猪肉（4/4晚）', 'Jeju Madang（4/5晚）', '만배회센타（4/6晚）'] },
    { category: 'transportation', title: '交通安排', icon: '🚌', border_color: '#BDD8DB', items: ['租车/包车确认', '牛岛渡轮时刻查询', '机场→酒店交通确认'] },
    { category: 'packing', title: '行李清单', icon: '🧳', border_color: '#8D82D3', items: ['春季外套/风衣', '轻便运动鞋', '防晒霜 + 墨镜', '雨伞/轻便雨衣', '充电宝', '转换插头（德标圆孔）'] },
  ];

  for (let i = 0; i < checklistData.length; i++) {
    const cat = checklistData[i];
    const { data: catRecord, error: catError } = await supabase
      .from('checklist_categories')
      .insert({ trip_id: tripId, category: cat.category, title: cat.title, icon: cat.icon, border_color: cat.border_color, sort_order: i })
      .select()
      .single();
    if (catError || !catRecord) {
      console.error('插入清单分类失败:', catError);
      continue;
    }
    const itemsToInsert = cat.items.map((label, j) => ({
      category_id: catRecord.id,
      label,
      sort_order: j,
    }));
    const { error: itemsError } = await supabase.from('checklist_items').insert(itemsToInsert);
    if (itemsError) console.error('插入清单条目失败:', itemsError);
  }

  // 6. 插入行程信息
  const infoData = [
    {
      trip_id: tripId, section: 'hotel', sort_order: 0,
      data: {
        name: '济州红树林酒店',
        korean_name: 'Mangrove Jeju City',
        address: '塔洞路5号 (5 Tapdong-ro)',
        korean_address: '제주시 탑동로 5',
        check_in: '4/4',
        check_out: '4/7',
        map_url: 'https://maps.google.com/maps?q=33.5168,126.5242&z=16',
      },
    },
    {
      trip_id: tripId, section: 'emergency', sort_order: 1,
      data: {
        contacts: [
          { number: '112', title: '报警', subtitle: 'Police', icon: '🚨' },
          { number: '119', title: '急救/消防', subtitle: 'Medical / Fire', icon: '❤️‍🩹' },
          { number: '1330', title: '旅游咨询', subtitle: '支持中文', icon: '🚌' },
          { number: '+82-64-738-8880', title: '中国领事馆', subtitle: '驻济州总领事馆', icon: '🏛️' },
        ],
      },
    },
    {
      trip_id: tripId, section: 'tips', sort_order: 2,
      data: {
        tips: [
          { icon: '🕐', title: '快1小时', subtitle: '韩国 UTC+9' },
          { icon: '🔌', title: '德标圆孔', subtitle: '220V 双圆孔插头' },
          { icon: '🌡️', title: '10-17°C', subtitle: '4月初·薄外套+长裤' },
          { icon: '💰', title: '现金重要', subtitle: '东门市场/小店需现金' },
        ],
      },
    },
    {
      trip_id: tripId, section: 'phrases', sort_order: 3,
      data: {
        phrases: [
          { korean: '안녕하세요', pronunciation: 'an-nyeong-ha-se-yo', english: 'Hello', chinese: '你好' },
          { korean: '감사합니다', pronunciation: 'kam-sa-ham-ni-da', english: 'Thank You', chinese: '谢谢' },
          { korean: '얼마예요?', pronunciation: 'eol-ma-ye-yo', english: 'How Much?', chinese: '多少钱?' },
          { korean: '맛있어요', pronunciation: 'ma-si-sseo-yo', english: 'Delicious', chinese: '好吃' },
          { korean: '이거 주세요', pronunciation: 'i-geo ju-se-yo', english: 'This One Please', chinese: '请给我这个' },
          { korean: '계산이요', pronunciation: 'gye-sa-ni-yo', english: 'Check Please', chinese: '结账' },
          { korean: '안 맵게 해주세요', pronunciation: 'an maep-ge hae-ju-se-yo', english: 'Not Spicy Please', chinese: '不要辣' },
          { korean: '화장실 어디예요?', pronunciation: 'hwa-jang-sil eo-di-ye-yo', english: 'Where is Restroom?', chinese: '洗手间在哪?' },
          { korean: '택시 불러주세요', pronunciation: 'taek-si bul-leo-ju-se-yo', english: 'Call a Taxi Please', chinese: '请叫出租车' },
          { korean: '여기로 가주세요', pronunciation: 'yeo-gi-ro ga-ju-se-yo', english: 'Please Go Here', chinese: '请去这里' },
        ],
      },
    },
    {
      trip_id: tripId, section: 'restaurants', sort_order: 4,
      data: {
        restaurants: [
          { icon: '🍗', name: 'BHC 炸鸡', desc: '韩式炸鸡，宵夜首选', address: 'Sammu-ro 27' },
          { icon: '🍖', name: '바로족발보쌈', desc: '猪蹄包肉，替换晚餐', address: '진군1길 25' },
          { icon: '🍜', name: '老奶奶炸酱面', desc: '中餐，D4早餐备选', address: '莲洞252-72' },
          { icon: '🏮', name: '全国大排档', desc: '大排档，任意晚上', address: '莲洞10街4' },
          { icon: '☕', name: 'Hugely Jeju', desc: '咖啡甜品，任意下午', address: 'Heungun-gil 83' },
          { icon: '🐕', name: '济州小狗咖啡店', desc: '撸狗首选' },
          { icon: '🛥️', name: 'M1971 Yacht', desc: '游艇日落，需半天', address: '大静邑' },
          { icon: '🏖️', name: '狭才海水浴场', desc: '替换D1涯月海滩', address: 'Hallim-eup' },
        ],
      },
    },
  ];

  const { error: infoError } = await supabase.from('trip_info').insert(infoData);
  if (infoError) console.error('插入行程信息失败:', infoError);

  return { success: true, tripId };
}

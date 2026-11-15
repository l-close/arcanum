// arcanum: sceneMaterials
//
// 18 个户外地点的素材表、两句式库的锚句、两张 16 格置换矩阵、锁定状态。
// STYLE.md 的 ANCHORS 生成块从本文件渲染；validate:style 也从本文件取值。
//
// 矩阵：每地点 16 格，顺序为
//   季节层：春晨/春昼/春暮/春夜 → 夏 → 秋 → 冬
//   天气层：春晴/春多云/春阴/春雨(雪) → 夏 → 秋 → 冬
// 每行必须是 1–16 的置换，且同组不相邻、缺席不在晨。

export type NpcPresence = 'none' | 'has' | 'future'

export type MaterialTable = {
  objects: string[]
  sounds: string[]
  traces: string[]
  npc: NpcPresence
  npcNote?: string
}

/** 与 weather.ts 的 OUTDOOR 顺序一致。 */
export const SCENE_LOCATIONS = [
  'yard',
  'gate',
  'town',
  'commercial',
  'church',
  'academy',
  'orphanage',
  'backyard',
  'academyStreet',
  'orphanStreet',
  'churchStreet',
  'bellTower',
  'outside',
  'cemetery',
  'forest',
  'forestDeep',
  'craftDistrict',
  'herbGarden',
] as const

export type SceneLocationId = (typeof SCENE_LOCATIONS)[number]

/** 素材表按批次补齐；未建的地点不在此。 */
export const MATERIALS: Partial<Record<SceneLocationId, MaterialTable>> = {
  yard: {
    objects: [
      '木桩（桩顶／桩脚／桩身）',
      '旧刻痕',
      '黄土',
      '浮土',
      '木剑架',
      '木剑',
      '水桶',
      '麻绳',
      '墙根',
      '墙根的草',
      '门口',
      '换下来的旧桩',
      '裂口缠过麻绳的桩',
    ],
    sounds: ['鞋底碾土', '木剑相击', '桶底磕地', '风穿过木桩', '扫帚扫地'],
    traces: ['脚印', '扫过的土', '木剑扔回架', '桶倒扣', '麻绳结', '撞歪的桩', '踩出来的窄路'],
    npc: 'future',
    npcNote: '格里高利上课时在场',
  },
  gate: {
    objects: [
      '两扇木门',
      '门缝',
      '门洞',
      '石墙',
      '褪色纹章',
      '石阶',
      '灯',
      '盔甲',
      '肩甲',
      '披风',
      '运菜的车',
      '门轴',
      '换下来的旧门板',
      '班次木牌',
    ],
    sounds: ['门轴', '车轴', '甲片相碰', '脚步', '风从门缝', '马'],
    traces: ['车辙', '蹄印', '门洞里踩出的圆痕', '石阶磨出的凹面', '门轴下的油迹'],
    npc: 'future',
    npcNote: '守门骑士，常驻未具名',
  },
  town: {
    objects: [
      '旧喷泉（池沿／池底／池水）',
      '封了的井（石板／铁环／缝隙里的草）',
      '石板路',
      '街灯（灯座／旧灯罩）',
      '告示板',
      '鸽子',
      '摊棚',
      '绳索',
      '店铺门板',
      '街边旗子',
      '车辙',
    ],
    sounds: ['鸽翅', '水声', '叫卖', '车轴', '脚步', '棚布'],
    traces: ['车辙', '脚印', '鸽食', '告示叠贴', '摊位绳结', '花摊落下的花瓣', '井沿磨出的凹口'],
    npc: 'none',
  },
  commercial: {
    objects: [
      '招牌',
      '门板',
      '遮棚',
      '布棚',
      '货摊',
      '屋檐',
      '绳索',
      '筐',
      '酒馆的灯',
      '车辙',
      '卖花的摊',
      '热食摊',
      '换下来的旧招牌',
      '厚布',
      '薄布',
    ],
    sounds: ['卸门板', '招牌碰墙', '叫卖', '雨打遮棚', '车轴', '脚步'],
    traces: ['车辙', '烂菜叶', '绳结', '门板靠墙', '遮棚上的补丁', '摊位压出的地痕'],
    npc: 'has',
    npcNote: '米娅、卢卡，假日下午',
  },
}

export type ShapeAnchor = { id: number; name: string; anchor: string }

/** 天气 16。只示范骨架，素材必须来自该地点素材表。 */
export const WEATHER_SHAPES: ShapeAnchor[] = [
  { id: 1, name: '物件状态', anchor: '木桩上结了一层薄冰。' },
  { id: 2, name: '痕迹', anchor: '台阶上有泥，踩上去打滑。' },
  { id: 3, name: '局部否定', anchor: '靠墙那排没湿。' },
  { id: 4, name: '数量', anchor: '滴水声只剩三处。' },
  { id: 5, name: '声音', anchor: '木桩之间，风声是空的。' },
  { id: 6, name: '并置', anchor: '一边踩上去发硬，一边还陷脚。' },
  { id: 7, name: '限定', anchor: '只有背阴那面还发软。' },
  { id: 8, name: '因果', anchor: '土面冻住了，脚陷不进去。' },
  { id: 9, name: '转折', anchor: '踩过的地方硬了，桩底下还是软的。' },
  { id: 10, name: '程度', anchor: '雪薄得一脚就踩到底。' },
  { id: 11, name: '位置', anchor: '水积在门洞和石阶之间。' },
  { id: 12, name: '残留', anchor: '门槛底下还是潮的。' },
  { id: 13, name: '界限', anchor: '硬土到墙根就断了。' },
  { id: 14, name: '方位', anchor: '墙根一带还是湿的。' },
  { id: 15, name: '触感', anchor: '踩上去发黏，鞋底拔起来有声。' },
  { id: 16, name: '参照物', anchor: '第三级台阶还是滑的。' },
]

/** 季节 16。锚句取自演武场，只示范骨架。 */
export const SEASON_SHAPES: ShapeAnchor[] = [
  { id: 1, name: '累积', anchor: '墙根的雪堆到墙半腰。' },
  { id: 2, name: '缺损', anchor: '剑架空两个卡口，木剑借出去没还。' },
  { id: 3, name: '残留', anchor: '墙根的土还潮，鞋底带一层泥。' },
  { id: 4, name: '错位', anchor: '水桶扣在剑架上，桶底朝上。' },
  { id: 5, name: '长期状态', anchor: '桩身上截被手磨得发滑，比下截细。' },
  { id: 6, name: '人与物的占位', anchor: '水桶搁在剑架脚边，桶里半桶水。' },
  { id: 7, name: '重复', anchor: '桩身刻痕压刻痕。' },
  { id: 8, name: '变化方向', anchor: '桩身朝门口那一面磨得更狠。' },
  { id: 9, name: '归属', anchor: '木剑柄上刻名字，磨得只剩半个。' },
  { id: 10, name: '修补', anchor: '桩身裂口缠了麻绳，结打得很紧。' },
  { id: 11, name: '废弃', anchor: '墙根堆几根换下来的旧桩，裂口里长草。' },
  { id: 12, name: '边界', anchor: '场地的边界是一道踩出来的线，线外是草。' },
  { id: 13, name: '交接', anchor: '旧桩退墙根，新桩立原处。' },
  { id: 14, name: '缺席', anchor: '水桶不在，墙根一圈印子。' },
  { id: 15, name: '叠加', anchor: '剑架木条换过两次，钉孔挨钉孔。' },
  { id: 16, name: '尺度', anchor: '场地只摆得下六根桩，第七根得挤到墙根。' },
]

export const SHAPE_ANCHORS = {
  season: SEASON_SHAPES,
  weather: WEATHER_SHAPES,
}

/** 季节层：16 格句式号（已验证置换、同组不相邻、缺席不在晨）。 */
export const SEASON_MATRIX: Record<SceneLocationId, number[]> = {
  yard: [5, 3, 2, 9, 10, 7, 6, 8, 4, 11, 15, 12, 1, 13, 16, 14],
  gate: [7, 5, 11, 16, 4, 15, 9, 2, 10, 14, 8, 6, 12, 13, 3, 1],
  town: [6, 8, 4, 15, 10, 12, 11, 13, 16, 9, 1, 3, 2, 14, 5, 7],
  commercial: [3, 2, 4, 1, 7, 6, 8, 9, 11, 10, 12, 15, 13, 16, 14, 5],
  church: [13, 1, 16, 14, 15, 3, 2, 4, 5, 7, 6, 8, 9, 11, 10, 12],
  academy: [11, 4, 15, 10, 9, 14, 13, 16, 12, 1, 3, 2, 8, 5, 7, 6],
  orphanage: [2, 11, 1, 7, 6, 8, 9, 5, 10, 12, 14, 13, 16, 15, 4, 3],
  backyard: [13, 16, 14, 5, 3, 2, 4, 1, 7, 6, 8, 9, 11, 10, 12, 15],
  academyStreet: [10, 15, 9, 12, 11, 13, 16, 14, 1, 3, 2, 4, 5, 7, 6, 8],
  orphanStreet: [12, 14, 7, 6, 8, 9, 5, 10, 15, 4, 13, 16, 11, 1, 3, 2],
  churchStreet: [16, 14, 5, 3, 2, 4, 1, 7, 6, 8, 9, 11, 10, 12, 15, 13],
  bellTower: [15, 10, 12, 11, 13, 16, 14, 5, 3, 2, 4, 1, 7, 6, 8, 9],
  outside: [15, 7, 6, 8, 9, 11, 10, 12, 5, 13, 16, 14, 1, 3, 2, 4],
  cemetery: [4, 9, 3, 2, 1, 5, 7, 6, 8, 15, 11, 10, 12, 14, 13, 16],
  forest: [9, 12, 10, 4, 16, 14, 15, 3, 2, 13, 5, 7, 6, 8, 1, 11],
  forestDeep: [15, 6, 8, 4, 7, 10, 12, 11, 13, 16, 14, 5, 3, 2, 9, 1],
  craftDistrict: [1, 3, 2, 4, 5, 7, 6, 8, 9, 11, 10, 12, 15, 13, 16, 14],
  herbGarden: [8, 14, 13, 16, 12, 1, 3, 15, 2, 5, 7, 6, 4, 9, 11, 10],
}

/** 天气层：16 格句式号。 */
export const WEATHER_MATRIX: Record<SceneLocationId, number[]> = {
  yard: [1, 5, 7, 16, 2, 6, 12, 3, 9, 10, 14, 8, 15, 13, 4, 11],
  gate: [8, 16, 13, 5, 7, 1, 2, 3, 12, 4, 6, 15, 11, 9, 10, 14],
  town: [11, 12, 9, 10, 7, 8, 15, 13, 16, 14, 1, 2, 3, 4, 5, 6],
  commercial: [2, 3, 12, 11, 6, 8, 7, 5, 10, 15, 4, 9, 13, 16, 14, 1],
  church: [15, 13, 16, 14, 1, 2, 3, 4, 5, 6, 8, 11, 9, 10, 7, 12],
  academy: [10, 9, 4, 7, 11, 15, 13, 16, 14, 1, 2, 3, 12, 5, 6, 8],
  orphanage: [3, 12, 5, 6, 8, 11, 9, 10, 7, 4, 15, 13, 16, 14, 1, 2],
  backyard: [13, 8, 14, 1, 2, 3, 4, 9, 6, 12, 7, 5, 10, 11, 16, 15],
  academyStreet: [9, 10, 11, 12, 15, 13, 16, 14, 1, 2, 3, 4, 5, 6, 8, 7],
  orphanStreet: [7, 12, 6, 8, 4, 9, 10, 11, 5, 15, 13, 16, 14, 1, 2, 3],
  churchStreet: [12, 14, 1, 2, 3, 4, 5, 6, 8, 11, 9, 10, 7, 16, 15, 13],
  bellTower: [4, 7, 10, 15, 13, 16, 14, 1, 2, 3, 12, 5, 6, 8, 11, 9],
  outside: [5, 6, 8, 7, 9, 10, 11, 12, 15, 13, 16, 14, 1, 2, 3, 4],
  cemetery: [14, 1, 2, 3, 12, 5, 6, 8, 11, 9, 10, 7, 4, 15, 13, 16],
  forest: [7, 11, 15, 13, 16, 14, 1, 2, 3, 8, 5, 6, 4, 12, 9, 10],
  forestDeep: [6, 4, 11, 9, 10, 7, 8, 15, 13, 16, 14, 1, 2, 3, 12, 5],
  craftDistrict: [1, 2, 3, 4, 5, 6, 15, 7, 9, 10, 11, 12, 8, 13, 16, 14],
  herbGarden: [16, 15, 13, 12, 14, 1, 2, 3, 4, 5, 6, 8, 11, 7, 10, 9],
}

/**
 * 已锁定的层。锁定后该层文本必须在表里（SEASON_DESC / WEATHER_SCENES），
 * 校验器只扫表，不再看 drafts。
 */
export const LOCKED: { season: string[]; weather: string[] } = {
  season: ['yard'],
  weather: [],
}

/**
 * 室内暮格（18:00–21:00）覆盖。只覆盖该时段仍开着的室内地点，
 * 其余室内继续用 DESC_BY_TIME 的夜句。
 */
export const EVENING_OVERRIDE: Record<string, string> = {
  canteen: '灶间门口堆着择下的菜叶。',
  orphanCanteen: '水缸的水少了一截。',
  relief: '长椅上叠着几件旧衣。',
  greenhouse: '砖台上摆着几只空陶盆。',
  runeShop: '台面上的铜屑扫成了一堆。',
  weaponShop: '工作台上摊着没打完的活。',
}

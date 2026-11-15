// arcanum: styleRules
//
// 场景层（季节句 / 天气句）的硬规则。STYLE.md 的 BANNED 生成块从本文件渲染，
// validate:style 也从本文件取词表——不要在别处手抄这些词。

export type TextLayer = 'season' | 'weather'

export type BannedCategory = {
  key: string
  label: string
  words: string[]
  /** 缺省为两层都适用。 */
  layers?: TextLayer[]
  /** words 为空时显示在表格里的说明。 */
  note?: string
}

export const BANNED_CATEGORIES: BannedCategory[] = [
  {
    key: 'visual',
    label: '光感与颜色',
    words: ['亮', '暗', '光', '影', '色', '白', '黑', '反光', '发亮'],
  },
  {
    key: 'period',
    label: '时段',
    words: ['早上', '傍晚', '深夜', '正午', '清早'],
  },
  {
    key: 'crossDay',
    label: '跨日',
    words: ['昨天', '上次', '前几天', '上一场', '前一天'],
  },
  {
    key: 'unbounded',
    label: '无界量化',
    words: ['别处', '到处', '处处', '所有', '一切', '全城', '各处'],
  },
  {
    key: 'frequency',
    label: '频度副词',
    words: ['总', '向来', '每到', '每天', '每隔'],
  },
  {
    key: 'process',
    label: '进程',
    words: ['正在', '已经', '刚', '还没', '停了', '化了', '退了', '散了', '从…起'],
  },
  {
    key: 'universalNegation',
    label: '全称否定',
    words: ['没有人', '空无一人', '不见人影', '整条街空着'],
  },
  {
    key: 'course',
    label: '课程名',
    words: [],
    note: '见 `COURSE-WORDS` 生成块',
  },
  {
    key: 'weather',
    label: '天气词（仅天气层）',
    words: ['晴', '阴', '雨', '云', '雷', '天色', '阳光', '日头'],
    layers: ['weather'],
  },
  {
    key: 'snowVerb',
    label: '雪（动词位）',
    words: ['雪落', '落雪', '下雪', '飘雪', '雪停了'],
  },
  {
    key: 'temperature',
    label: '温度',
    words: ['冷', '暖', '凉', '热', '闷'],
  },
]

/**
 * 先于禁词匹配替换掉的词。
 * 只放不依赖可见性、也不会和禁词撞义的词；`热气` 不在其中。
 */
export const ALLOWED_NOUNS = ['热食', '热水', '背阴', '阴影', '阴凉', '阴面']

/** 行首禁用；两层都查。 */
export const BANNED_LINE_START = ['风', '天色', '阳光', '日头']

/** 配额按 (地点, 层) 汇总，单位是格，不按句数累加。 */
export const QUOTA = {
  /** 含“着”的格数上限。 */
  zheMaxCells: 6,
  /** 压缩构式（X 压 X 等）的格数上限。 */
  compressedMaxCells: 1,
  /** 以转折或判断收尾的格数上限（人工核）。 */
  echoMaxCells: 3,
} as const

/** 压缩构式：X 压 X / X 叠 X / X 挨 X / X 套 X。 */
export const COMPRESSED_PATTERN = /(.{2,4})(压|叠|挨|套)\1/

/**
 * 素材词在整个地点同一层里的出现格数上限。
 * null = 校准中：只打印前三个高频词，不判定。跑满三个地点后填数字。
 */
export const MATERIAL_TERM_CAP: number | null = null

/** 空间参照词：分别管“锚点习惯”，不参与道具用量。 */
export const REFERENCE_TERMS = ['墙根', '门口', '角落', '场地', '台阶', '路面', '墙边']

/** 参照词占该组已扫描格数的比例上限。 */
export const REFERENCE_RATIO = 0.4

/** 每层每地点的格数：4 季 × 4 段（天气层是 4 季 × 4 天气）。 */
export const CELLS_PER_LAYER = 16

/** 近似组：同组不得在 4×4 网格里正交相邻。 */
export const SEASON_GROUPS: Record<number, string> = {
  1: '增减',
  2: '增减',
  15: '增减',
  3: '不在场',
  11: '不在场',
  14: '不在场',
  9: '归属变化',
  10: '归属变化',
  13: '归属变化',
  7: '趋势',
  8: '趋势',
  4: '独立',
  5: '独立',
  6: '独立',
  12: '独立',
  16: '独立',
}

export const WEATHER_GROUPS: Record<number, string> = {
  3: '对比',
  6: '对比',
  7: '对比',
  9: '对比',
  13: '对比',
  14: '对比',
  2: '遗留',
  12: '遗留',
  15: '遗留',
  1: '状态',
  8: '状态',
  10: '状态',
  4: '计数',
  16: '计数',
  5: '声音',
  11: '位置',
}

/** 时段名，只用于报错信息。 */
export const PERIOD_LABELS = ['晨', '昼', '暮', '夜'] as const

/** 季节名，只用于报错信息。 */
export const SEASON_LABELS = ['春', '夏', '秋', '冬'] as const

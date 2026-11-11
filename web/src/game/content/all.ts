import type {
  CombatBuffKey,
  CombatBuffs,
  EquipmentSlot,
  Skill,
  SkillKey,
  WestProjectKey,
} from '../types'
import { hash01 } from './rng'
import { TIER_REQ, SKILL_LABEL } from './skills'
import { ITEMS } from './items'
import type { Location } from './locations'
import { timePeriod } from './locations'
import { SUMMER_RITE_DAY, WINTER_RITE_DAY } from './life'
import { Season, seasonOf } from './weather'
import {
  absoluteMinutes,
  chineseNumber,
  currentYear,
  dayInYear,
  HOLIDAY_DAYS,
  isTimeWindow,
  MAX_YEAR,
  SEMESTER_DAYS,
  semesterState,
  weekday,
  YEAR_DAYS,
} from './time'

export const SHOP_STOCKS: Record<string, Record<string, number>> = {
  shop: {
    advanced_wand: 1,
    mana_potion: 3,
    tonic: 3,
    healing_potion: 3,
  },
  weaponShop: {
    practice_sword: 1,
    iron_sword: 1,
  },
  westGate: {
    tonic: 1,
    healing_potion: 1,
  },
  westMarket: {
    healing_potion: 2,
    tonic: 2,
    dry_ration: 4,
  },
  bookshop: {
    brawl_manual: 1,
    defense_notes: 1,
    old_city_stories: 1,
    silver_moon_lore: 1,
  },
  potionWorkshop: {
    sharp_draught: 2,
    stone_draught: 2,
    swift_draught: 2,
  },
}

/** 西镇集市价格：阶段 0 更贵，阶段 1 回落。 */
export function shopPriceAt(location: string, id: string, westStage = 0): number {
  const base = ITEMS[id]?.price ?? 0
  if (location !== 'westMarket') return base
  if (id === 'healing_potion') return westStage >= 1 ? 15 : 18
  if (id === 'tonic') return westStage >= 1 ? 10 : 12
  return base
}

export const CRAFTED_POTIONS = new Set([
  'salve',
  'salve_fine',
  'stimulant',
  'stimulant_fine',
])

export const WORKSHOP_HERBS = new Set(['bloodherb', 'bitterleaf'])

export const WORKSHOP_HERB_PRICES: Record<string, number> = {
  bloodherb: 4,
  bitterleaf: 3,
}

export function canSellAt(location: string, id: string): boolean {
  const def = ITEMS[id]
  if (!def) return false
  if (location === 'potionWorkshop') {
    if (def.type === 'material') return WORKSHOP_HERBS.has(id)
    return CRAFTED_POTIONS.has(id)
  }
  if (location === 'shop') {
    if (def.type === 'material') return true
    return CRAFTED_POTIONS.has(id)
  }
  if (location === 'westMarket') return def.type === 'material'
  return false
}

export function sellPriceAt(location: string, id: string): number {
  const base = ITEMS[id]?.price ?? 0
  if (CRAFTED_POTIONS.has(id)) {
    return Math.floor(base * (location === 'potionWorkshop' ? 0.7 : 0.6))
  }
  if (location === 'potionWorkshop' && WORKSHOP_HERB_PRICES[id] !== undefined) {
    return WORKSHOP_HERB_PRICES[id]
  }
  if (location === 'westMarket') return Math.floor(base * 0.7)
  return base
}

export const WORKSHOP_OPEN_START = 8 * 60
export const WORKSHOP_OPEN_END = 20 * 60
export const WORKSHOP_WORK_MINUTES = 120
export const WORKSHOP_WORK_STAMINA = 8
export const WORKSHOP_WORK_SPIRIT = 2
export const WORKSHOP_WORK_MOOD = 2
export const WORKSHOP_WORK_EXP = 1
export const WORKSHOP_PAY_BY_TIER = [8, 11, 15, 20, 26]
export const WORKSHOP_RENT_COST = 40
export const WORKSHOP_RENT_DAYS = 7
export const WORKSHOP_LESSON_COST = 8
export const WORKSHOP_LESSON_MINUTES = 60
export const WORKSHOP_LESSON_SPIRIT = 2
export const WORKSHOP_LESSON_EXP = 3

export const WORKSHOP_WORK_TEXTS = [
  '你只能打下手，搬药材、洗瓶子。托比亚斯没让你碰火。',
  '你开始负责看火和递料，偶尔能搅两下锅。',
  '你独立处理了一锅基础药，托比亚斯只在旁边看了一眼。',
  '你负责的锅不再需要人盯，学徒会来问你火候。',
  '奥古斯特把一整批订单交给你，自己去前面谈生意。',
]

export function workshopPayForTier(tier: number): number {
  return WORKSHOP_PAY_BY_TIER[Math.max(0, Math.min(4, tier))] ?? 8
}

export type RecipeDef = {
  id: string
  name: string
  level: number
  unlockExp: number
  inputs: Record<string, number>
  standard: string
  fine: string
  successBase: number
  fineBase: number
  desc: string
}

export const RECIPES: RecipeDef[] = [
  {
    id: 'salve',
    name: '止血膏',
    level: 1,
    unlockExp: 0,
    inputs: { bloodherb: 2 },
    standard: 'salve',
    fine: 'salve_fine',
    successBase: 105,
    fineBase: 30,
    desc: '止血草熬成的膏，颜色发暗，带一点草腥味。',
  },
  {
    id: 'stimulant',
    name: '提神剂',
    level: 1,
    unlockExp: 40,
    inputs: { bitterleaf: 2 },
    standard: 'stimulant',
    fine: 'stimulant_fine',
    successBase: 105,
    fineBase: 20,
    desc: '苦叶煎出的提神剂，苦味很重，喝下去身上会暖起来。',
  },
]

export function recipeById(id: string): RecipeDef | undefined {
  return RECIPES.find((recipe) => recipe.id === id)
}

/** 炼药累计经验：已升档消耗的部分 + 当前档位经验 */
export function alchemyLifetimeExp(skill: Skill): number {
  let total = skill.exp
  for (let i = 0; i < Math.min(skill.tier, TIER_REQ.length); i++) total += TIER_REQ[i]
  return total
}

export function recipeUnlocked(recipe: RecipeDef, skill: Skill): boolean {
  return alchemyLifetimeExp(skill) >= recipe.unlockExp
}

/** 成功率：基础值 + 档位 × 15% - 配方等级 × 25%，0–100 */
export function brewSuccessChance(recipe: RecipeDef, skill: Skill): number {
  const value = recipe.successBase + skill.tier * 15 - recipe.level * 25
  return Math.max(0, Math.min(100, value))
}

/** 精制率：基础值 + 档位 × 10% - 配方等级 × 5%，0–100 */
export function brewFineChance(recipe: RecipeDef, skill: Skill): number {
  const value = recipe.fineBase + skill.tier * 10 - recipe.level * 5
  return Math.max(0, Math.min(100, value))
}

export type WestCommissionKind = 'repair' | 'patrol' | 'care' | 'maintenance'

export type WestCommissionDef = {
  id: string
  name: string
  kind: WestCommissionKind
  project?: WestProjectKey
  location: string
  minutes: number
  stamina: number
  money: number
  construction: number
  points: number
  battleChance?: number
  battleEnemy?: string
  battleBonus?: number
  desc: string
}

export const WEST_COMMISSIONS: Record<string, WestCommissionDef> = {
  wall: {
    id: 'wall',
    name: '修复西墙',
    kind: 'repair',
    project: 'wall',
    location: 'westGate',
    minutes: 120,
    stamina: 8,
    money: 10,
    construction: 30,
    points: 2,
    desc: '昨夜的风把西墙吹塌了一角。搬石头、和灰浆，把缺口垒回去。',
  },
  ditch: {
    id: 'ditch',
    name: '修复水渠',
    kind: 'repair',
    project: 'ditch',
    location: 'westGate',
    minutes: 120,
    stamina: 9,
    money: 9,
    construction: 30,
    points: 2,
    desc: '水渠里积着黑泥和烂叶，得一段一段清开。',
  },
  lamp: {
    id: 'lamp',
    name: '修复街灯',
    kind: 'repair',
    project: 'lamp',
    location: 'westMarket',
    minutes: 120,
    stamina: 7,
    money: 10,
    construction: 30,
    points: 2,
    desc: '集市口的街灯只剩一盏还亮着。换灯芯，擦灯罩。',
  },
  patrol: {
    id: 'patrol',
    name: '巡田',
    kind: 'patrol',
    location: 'westEdge',
    minutes: 180,
    stamina: 10,
    money: 12,
    construction: 10,
    points: 1,
    battleChance: 0.2,
    battleEnemy: 'corrupted_dog',
    battleBonus: 2,
    desc: '沿着界桩走一圈，看看田里和路边有没有异常。',
  },
  care: {
    id: 'care',
    name: '驻地换药',
    kind: 'care',
    location: 'westInn',
    minutes: 120,
    stamina: 4,
    money: 8,
    construction: 10,
    points: 1,
    desc: '巡逻队带回两个轻伤员。烧水、换绷带、登记药品。',
  },
  maintenance: {
    id: 'maintenance',
    name: '日常维护',
    kind: 'maintenance',
    location: 'westGate',
    minutes: 120,
    stamina: 8,
    money: 10,
    construction: 0,
    points: 2,
    desc: '主项目已经修完，剩下的是日常维护：门槛、棚顶、路沿。',
  },
}

export type WestGenericDef = {
  id: string
  name: string
  location: string
  text: string
}

export const WEST_GENERIC_MINUTES = 90
export const WEST_GENERIC_STAMINA = 6
export const WEST_GENERIC_CONSTRUCTION = 2
export const WEST_GENERIC_POINTS = 1
export const WEST_CONSTRUCTION_MAX = 800
export const WEST_PROJECT_MAX = 4

export const WEST_REPAIR_TEXTS: Record<WestProjectKey, string[]> = {
  wall: [
    '西墙的缺口边缘还在掉土。你先把松动的石块清下来，堆在一边。',
    '你和好灰浆，把第一层石头垒回去。格里高利在旁边看了一眼，没说话。',
    '墙补到一半。风从缺口灌进来，灰浆干得很慢。',
    '最后一块石头嵌好。西墙的缺口终于合上了，灰浆颜色比旁边的石头新。',
  ],
  ditch: [
    '水渠里积着黑泥和烂叶。你先把表面的杂物捞出来。',
    '泥比看起来深。你换了一把短锹，一锹一锹往外清。',
    '沟底露出旧石壁，上面有一道裂缝。你记下位置，继续清。',
    '水渠通了。水沿着沟流走，路面的积水退下去一层。',
  ],
  lamp: [
    '集市口的街灯只剩一盏还亮着。你搬来梯子，先检查灯罩。',
    '灯罩里积了灰和虫尸。你把它拆下来，用布擦干净。',
    '灯芯受潮了。你换了一根新的，试了几次才点着。',
    '最后一盏灯亮起来。集市口比之前亮多了，收摊的人不再摸黑走路。',
  ],
}

export const WEST_COMMISSION_TEXTS: Record<string, string> = {
  patrol: '你沿着界桩走了一圈。田里没有新踩出的路，只有风吹过麦茬。',
  care: '你烧水、换绷带，把最后一卷绷带用完。伤员咬着牙没出声，只在最后问了一句什么时候能回队里。',
  maintenance: '你跟着支援队修补镇里的零碎地方：门槛、棚顶、路沿。',
}

export const WEST_GENERICS: WestGenericDef[] = [
  {
    id: 'gate_barricade',
    name: '加固拒马',
    location: 'westGate',
    text: '你把松动的木桩重新钉紧，又在底部垫了几块石头。\n风从拒马的缝隙里穿过去，声音比刚才小了一点。',
  },
  {
    id: 'gate_stone',
    name: '搬石料',
    location: 'westGate',
    text: '你把塌下来的碎石搬到墙根，按大小堆成两堆。\n手掌磨得发红，袖口里全是灰。',
  },
  {
    id: 'inn_roof',
    name: '补棚顶',
    location: 'westInn',
    text: '粗布棚顶被风撕开一道口子。你用旧布和麻绳把它重新缝上。\n棚下终于不再落灰，药箱上能少盖一层布。',
  },
  {
    id: 'inn_wood',
    name: '劈柴',
    location: 'westInn',
    text: '你把湿柴劈开，码在棚下。\n柴火还不太干，但至少今晚能烧得旺一点。',
  },
  {
    id: 'market_paper',
    name: '补窗纸',
    location: 'westMarket',
    text: '窗纸被风吹破。你裁了一块新的，用浆糊贴好。\n屋里暗了一点，但风不再从缝里灌进来。',
  },
  {
    id: 'market_stall',
    name: '修摊位',
    location: 'westMarket',
    text: '摊位的木板翘了起来。你找了两块旧木料，把台面重新钉平。\n摊主试了试，把一筐土豆放上去，没有再晃。',
  },
  {
    id: 'tower_ladder',
    name: '修木梯',
    location: 'westTower',
    text: '哨塔的木梯有一级裂了。你换了块木板，踩上去不再响。\n上面的人往下看了一眼，朝你点了点头。',
  },
  {
    id: 'tower_mat',
    name: '扎草帘',
    location: 'westTower',
    text: '你用干草编了几张挡风的帘子，挂在哨塔入口。\n风被挡在外面，里面的人终于能把手从袖子里伸出来。',
  },
]

export const WEST_RUMORS_STAGE0 = [
  '今年的风比往年早。',
  '集市口那盏灯修好了？晚上走路总算不用摸黑。',
  '北边那块田今年没种，土太硬。',
  '前几天夜里，镇外好像有动静。守卫说是风。',
  '支援队又要往西边送东西了，听说路不太好走。',
  '旧礼拜堂那边，最近总有人半夜路过。',
]

export const WEST_RUMORS_STAGE1 = [
  '现在至少能买到热的东西了。',
  '等路再修好一点，商队应该会回来。',
  '墙补好之后，风没那么灌了。',
  '夜里的灯亮了，孩子也敢在门口多站一会儿。',
]

export function westRumor(stage: number): string {
  const pool = stage >= 1 ? WEST_RUMORS_STAGE1 : WEST_RUMORS_STAGE0
  return pool[Math.floor(Math.random() * pool.length)]
}

export type GuildJobId = 'escort' | 'haul' | 'errand' | 'inventory'

export type GuildJobDef = {
  id: Exclude<GuildJobId, 'escort'>
  name: string
  minutes: number
  stamina: number
  money: number
  location: string
  desc: string
}

export const GUILD_JOB_DEFS: Record<Exclude<GuildJobId, 'escort'>, GuildJobDef> = {
  haul: {
    id: 'haul',
    name: '搬运货物',
    minutes: 120,
    stamina: 10,
    money: 12,
    location: 'guild',
    desc: '把到货的箱子从车上搬到后院，再按单子分开。',
  },
  errand: {
    id: 'errand',
    name: '跑腿送信',
    minutes: 60,
    stamina: 5,
    money: 7,
    location: 'guild',
    desc: '把一封封好的信送到学院或教堂，再回来复命。',
  },
  inventory: {
    id: 'inventory',
    name: '清点货单',
    minutes: 90,
    stamina: 4,
    money: 9,
    location: 'guild',
    desc: '对着货单清点箱子，把短少的数目记下来。',
  },
}

export type GuildEscortDef = {
  id: string
  name: string
  destination: string
  segments: number
  minutes: number
  money: number
  enemy: string
}

export const GUILD_ESCORTS: GuildEscortDef[] = [
  {
    id: 'oldStation',
    name: '旧驿站',
    destination: 'oldStation',
    segments: 6,
    minutes: 180,
    money: 20,
    enemy: 'deserter',
  },
  {
    id: 'forestDepot',
    name: '林间货栈',
    destination: 'forestDepot',
    segments: 4,
    minutes: 120,
    money: 16,
    enemy: 'gray_wolf',
  },
  {
    id: 'eastFarm',
    name: '东边农庄',
    destination: 'eastFarm',
    segments: 3,
    minutes: 90,
    money: 14,
    enemy: 'deserter',
  },
]

export const GUILD_SEGMENT_MINUTES = 30
export const GUILD_ENCOUNTER_CHANCE = 0.075
export const GUILD_RETURN_MINUTES = 60

export function guildWeek(day: number): number {
  return Math.floor(day / 7)
}

export function guildEscortForDay(day: number): GuildEscortDef {
  return GUILD_ESCORTS[guildWeek(day) % GUILD_ESCORTS.length]
}

export function guildJobsForDay(day: number): GuildJobId[] {
  const week = guildWeek(day)
  return ['escort', 'haul', week % 2 === 0 ? 'errand' : 'inventory']
}

export const GUILD_ROAD_TEXTS = [
  '货车压过碎石，车轮发出低响。',
  '路边的草被风吹向一边，远处看不到人。',
  '你们在路边停了一会儿，让马喘口气。',
  '前面的路拐进一片矮林，视野短了下来。',
  '车轮陷进一段软土，几个人下来推了一把。',
]

export function shopStockAt(location: string): Record<string, number> {
  return SHOP_STOCKS[location] ?? {}
}

export const GATE_OPEN_START = 6 * 60
export const GATE_OPEN_END = 22 * 60

export function isGateOpen(minutes: number): boolean {
  return minutes >= GATE_OPEN_START && minutes < GATE_OPEN_END
}

export const CEMETERY_SWEEP_MINUTES = 30
export const CEMETERY_SWEEP_STAMINA = 2
export const CEMETERY_SWEEP_MOOD = 2

export const FOREST_WALK_MINUTES = 15
export const FOREST_WALK_STAMINA = 1
export const FOREST_WALK_MOOD = 1
export const FOREST_ENCOUNTER_CHANCE = 0.25
export const SLIME_GEL_DROP_CHANCE = 0.6
export const WOLF_HIDE_DROP_CHANCE = 0.6
export const BOAR_HIDE_DROP_CHANCE = 0.6
export const BOAR_TUSK_DROP_CHANCE = 0.2
export const FOREST_DEEP_ENCOUNTER_CHANCE = 0.2
export const HERB_GATHER_SUCCESS_CHANCE = 0.6
export const MATERIAL_SELL_LOCATION = 'shop'

export type SocialTier = 'far' | 'familiar' | 'close'

export type NpcSlot = {
  location: string
  days: 'workday' | 'weekend' | 'all' | 'sunday'
  start: number
  end: number
  chance?: number
  only?: 'school' | 'vacation'
  onlyDay?: number
}

export type NpcDef = {
  id: string
  name: string
  short: string
  title: string
  status: string
  relationship?: 'bond' | 'familiarity'
  schedule: NpcSlot[]
  impression: Record<SocialTier, string>
  lines: Record<SocialTier, string[]>
}

export const SOCIAL_MINUTES = 15
export const SOCIAL_DAILY_GAIN = 1

export function socialTier(affinity: number): SocialTier {
  if (affinity >= 60) return 'close'
  if (affinity >= 20) return 'familiar'
  return 'far'
}

export function heartsText(affinity: number): string {
  const full = Math.max(0, Math.min(5, Math.floor(affinity / 20)))
  return '♥'.repeat(full) + '♡'.repeat(5 - full)
}

export const NPCS: NpcDef[] = [
  {
    id: 'mia',
    name: '米娅·罗兰',
    short: '米娅',
    title: '同学',
    schedule: [
      { location: 'chapel', days: 'all', start: 18 * 60, end: 21 * 60, chance: 0.6, onlyDay: WINTER_RITE_DAY },
      { location: 'chapel', days: 'all', start: 19 * 60, end: 22 * 60, chance: 0.6, onlyDay: SUMMER_RITE_DAY },
      { location: 'chapel', days: 'sunday', start: 9 * 60, end: 11 * 60, chance: 0.4 },
      { location: 'canteen', days: 'all', start: 11 * 60 + 30, end: 12 * 60 + 30, only: 'school' },
      { location: 'commercial', days: 'all', start: 14 * 60, end: 17 * 60, chance: 0.7, only: 'vacation' },
    ],
    status: '她把面包撕成小块，腿在桌下轻轻晃。',
    impression: {
      far: '同班同学，还没说过几句话',
      familiar: '算得上朋友了',
      close: '无话不谈的同伴',
    },
    lines: {
      far: [
        '今天的课你听懂了？我一半都没听进去。',
        '你是那个刚入学的吧。食堂的炖菜别抱太大期望。',
        '演武场下午人多，想练的话早点去。',
        '有事？没事的话我先把这盘吃完。',
      ],
      familiar: [
        '你来得正好，帮我看看这个动作对不对。',
        '我跟你说，卢卡昨天又在藏书阁待到关门，他以为没人知道。',
        '别老闷着，吃完饭去演武场走两圈。',
        '你最近是不是又没好好吃饭？',
      ],
      close: [
        '……你坐近点。算了，也没什么，就是想让你坐近点。',
        '以后要是有人找你麻烦，报我名字。虽然不一定有用。',
        '我以前觉得学院里的人都挺没意思的，你不太一样。',
        '下次休息日，陪我去商业区逛逛？就逛逛。',
      ],
    },
  },
  {
    id: 'luca',
    name: '卢卡·维恩',
    short: '卢卡',
    title: '同学',
    schedule: [
      { location: 'chapel', days: 'all', start: 18 * 60, end: 21 * 60, chance: 0.5, onlyDay: WINTER_RITE_DAY },
      { location: 'chapel', days: 'all', start: 19 * 60, end: 22 * 60, chance: 0.5, onlyDay: SUMMER_RITE_DAY },
      { location: 'chapel', days: 'sunday', start: 9 * 60, end: 11 * 60, chance: 0.3 },
      { location: 'library', days: 'workday', start: 7 * 60 + 30, end: 8 * 60 + 30, only: 'school' },
      { location: 'library', days: 'workday', start: 18 * 60, end: 19 * 60, only: 'school' },
      { location: 'library', days: 'weekend', start: 9 * 60, end: 10 * 60, only: 'school' },
      { location: 'library', days: 'weekend', start: 14 * 60, end: 15 * 60, only: 'school' },
      { location: 'library', days: 'weekend', start: 20 * 60, end: 21 * 60, only: 'school' },
      { location: 'library', days: 'all', start: 9 * 60, end: 11 * 60, chance: 0.8, only: 'vacation' },
      { location: 'commercial', days: 'all', start: 14 * 60, end: 16 * 60, chance: 0.7, only: 'vacation' },
      { location: 'library', days: 'all', start: 19 * 60, end: 21 * 60, chance: 0.75, only: 'vacation' },
    ],
    status: '他背对着门口，桌上摊着两本书。',
    impression: {
      far: '安静的同学',
      familiar: '勉强算熟人',
      close: '难得的信任',
    },
    lines: {
      far: [
        '这本书的注释是错的。',
        '别挡光。',
        '藏书阁里说话小声点。',
        '你要找的书在最里面那排。',
      ],
      familiar: [
        '别跟别人说，我昨晚在藏书阁待到关门。',
        '这次的测验，你多少分？……随口问问。',
        '这本借你。别弄折页。',
        '我不喜欢输。就这么简单。',
      ],
      close: [
        '……你坐这边吧。这里安静。',
        '上次的事，谢谢。别让我说第二遍。',
        '如果哪天我超过你了，你不许不高兴。',
        '我家里……算了，以后再说。',
      ],
    },
  },
  {
    id: 'nora',
    name: '诺拉·霍尔',
    short: '诺拉',
    title: '院长',
    schedule: [
      { location: 'chapel', days: 'all', start: 18 * 60, end: 21 * 60, chance: 1, onlyDay: WINTER_RITE_DAY },
      { location: 'chapel', days: 'all', start: 19 * 60, end: 22 * 60, chance: 1, onlyDay: SUMMER_RITE_DAY },
      { location: 'chapel', days: 'sunday', start: 9 * 60, end: 11 * 60, chance: 1 },
      { location: 'office', days: 'all', start: 6 * 60 + 30, end: 21 * 60 + 30, chance: 0.95 },
    ],
    status: '她正低头核对册子，笔尖停在半空。',
    impression: {
      far: '把你养大的人',
      familiar: '像家人一样',
      close: '她把你当自己的孩子',
    },
    lines: {
      far: [
        '今天账上终于没赤字了。',
        '别总熬夜。',
        '钱够不够？不够就说。',
        '孩子们今天又把柴火堆弄塌了。',
      ],
      familiar: [
        '你今天脸色不好，是不是没吃饭？',
        '别学我，什么事都自己扛。',
        '学院的课跟得上吗？跟不上也别硬撑。',
        '这周的账我算了两遍，还是差一点。',
      ],
      close: [
        '……你小时候也这样，摔了不哭，自己爬起来。',
        '这个家不大，但总有你一间房。',
        '我没什么能给你的。你别嫌少。',
        '要是有一天你不想待在这儿了，跟我说一声就行。',
      ],
    },
  },
  {
    id: 'greta',
    name: '格蕾塔·霍恩',
    short: '格蕾塔',
    title: '酒馆老板娘',
    relationship: 'familiarity',
    schedule: [{ location: 'tavern', days: 'all', start: 17 * 60, end: 4 * 60 }],
    status: '她正擦着杯子，抬眼看你一下。',
    impression: {
      far: '酒馆老板娘，还没记住你的名字',
      familiar: '开始把你当熟客',
      close: '记得你的口味',
    },
    lines: {
      far: [
        '第一次来？位置自己找。',
        '麦酒两铜，蜂蜜水也两铜。',
        '打烊前半小时别点热食。',
        '你看起来不像常喝酒的。',
      ],
      familiar: [
        '又来了。老位置还空着。',
        '今天走了一天？先坐下。',
        '别光喝水，吃点东西。',
        '你朋友刚才也来过。',
      ],
      close: [
        '你的杯子我留着。',
        '这杯算我的。别声张。',
        '要是遇到麻烦，先来这儿。',
        '你比刚来的时候话多了点。',
      ],
    },
  },
  {
    id: 'august',
    name: '奥古斯特·瓦尔',
    short: '奥古斯特',
    title: '药剂工坊主人',
    relationship: 'familiarity',
    schedule: [{ location: 'potionWorkshop', days: 'all', start: 8 * 60, end: 20 * 60 }],
    status: '他正低头看一张订单，手指在桌面上敲了两下。',
    impression: {
      far: '工坊主人，忙着看订单',
      familiar: '开始记得你上一批药的质量',
      close: '愿意和你多谈两句配方',
    },
    lines: {
      far: [
        '订单放柜台上。急单不接。',
        '你挡光了。',
        '这锅火候不对。谁看的火？',
        '买药剂去柜台，找莉薇娅。',
      ],
      familiar: [
        '上次那批止血膏，收得还行。',
        '别省火。省下来的时间，后面要还。',
        '今天的单子多，手脚麻利点。',
        '你手稳了。再练练火候。',
      ],
      close: [
        '配方不是藏起来的。看懂了，就是你的。',
        '我年轻时也把一锅药熬糊过。别声张。',
        '莉薇娅比我更会跟人打交道。',
        '你要真想做这行，先把眼睛练出来。',
      ],
    },
  },
  {
    id: 'livia',
    name: '莉薇娅·瓦尔',
    short: '莉薇娅',
    title: '药剂工坊柜台',
    schedule: [
      { location: 'potionWorkshop', days: 'all', start: 10 * 60, end: 18 * 60, chance: 0.75 },
    ],
    status: '她把一叠订单按顺序码好，抬眼看你。',
    impression: {
      far: '工坊柜台，做事很利落',
      familiar: '开始把你当成熟面孔',
      close: '愿意和你多说几句工坊的事',
    },
    lines: {
      far: [
        '订单放这里。急单要加钱。',
        '师傅在里间。小事跟我说。',
        '学徒在左边，临时工在右边。别走错。',
        '你第一次来？名字写在这张单子上。',
      ],
      familiar: [
        '今天人手紧，你来得正好。',
        '托比亚斯说你手稳了不少。',
        '师傅记得你上一批药，不记得你名字。别介意。',
        '柜台这边我来。你去帮托比亚斯吧。',
      ],
      close: [
        '我父亲只谈配方。跟人打交道的事，归我。',
        '这间工坊看着乱，其实每一单都排得很清楚。',
        '你要是想学，别只盯着锅。也看看单子怎么写。',
        '……你比我认识的多数学徒都稳。',
      ],
    },
  },
]

export function npcById(id: string): NpcDef | undefined {
  return NPCS.find((n) => n.id === id)
}

export function npcLocationAt(npc: NpcDef, day: number, minutes: number): string | null {
  const workday = weekday(day) < 5
  const sunday = weekday(day) === 6
  const summer = semesterState(day) === 'summer'
  const vacation = summer || semesterState(day) === 'winter'
  for (const slot of npc.schedule) {
    if (slot.only === 'school' && vacation) continue
    if (slot.only === 'vacation' && !vacation) continue
    if (slot.onlyDay !== undefined && day !== slot.onlyDay) continue
    if (slot.days === 'workday' && !workday) continue
    if (slot.days === 'weekend' && workday) continue
    if (slot.days === 'sunday' && !sunday) continue
    if (!isTimeWindow(minutes, slot.start, slot.end)) continue
    if (!slotPresent(npc.id, day, slot)) continue
    return slot.location
  }
  return null
}

function slotPresent(npcId: string, day: number, slot: NpcSlot): boolean {
  const chance = slot.chance ?? 1
  if (chance >= 1) return true
  let h = day * 2654435761 + slot.start * 97 + slot.end
  for (let i = 0; i < npcId.length; i++) {
    h = Math.imul(h ^ npcId.charCodeAt(i), 16777619)
  }
  return hash01(h) < chance
}

export function npcsAt(location: string, day: number, minutes: number): NpcDef[] {
  return NPCS.filter((n) => npcLocationAt(n, day, minutes) === location)
}

export type CourseDef = {
  id: string
  year: number
  name: string
  skill: SkillKey
  kind: 'literature' | 'nature' | 'physical'
  location: string
  start: number
  end: number
  teacher: string
  /** 考试地点；不填则跟随当天的上课地点 */
  examLocation?: string
  /** 按星期指定上课地点，索引 0 = 周一 */
  locationByWeekday?: string[]
  /** 按星期指定上课技能，索引 0 = 周一 */
  skillByWeekday?: SkillKey[]
  /** 体术类课程在格斗与剑术之间轮换 */
  rotate?: boolean
  /** 按整周轮换，而不是按天轮换 */
  rotateWeekly?: boolean
  /** 单双周轮换预留，暂未启用 */
  weekParity?: 'odd' | 'even'
}

export const COURSES: CourseDef[] = [
  {
    id: 'y1_literature',
    year: 1,
    name: '古典文学',
    skill: 'knowledge',
    kind: 'literature',
    location: 'lecture',
    start: 9 * 60,
    end: 11 * 60,
    teacher: '伊莲娜',
  },
  {
    id: 'y1_nature',
    year: 1,
    name: '法术导论',
    skill: 'nature',
    kind: 'nature',
    location: 'lecture',
    start: 13 * 60,
    end: 15 * 60,
    teacher: '阿尔文·莱特',
  },
  {
    id: 'y1_physical',
    year: 1,
    name: '体术课',
    skill: 'brawl',
    kind: 'physical',
    location: 'yard',
    start: 15 * 60 + 30,
    end: 17 * 60 + 30,
    teacher: '格里高利·索恩',
    rotate: true,
    rotateWeekly: true,
  },
  {
    id: 'y2_history',
    year: 2,
    name: '王国史',
    skill: 'knowledge',
    kind: 'literature',
    location: 'lecture',
    start: 8 * 60,
    end: 9 * 60 + 30,
    teacher: '伊莲娜',
  },
  {
    id: 'y2_advanced_nature',
    year: 2,
    name: '法术进阶',
    skill: 'nature',
    kind: 'nature',
    location: 'lecture',
    start: 10 * 60,
    end: 11 * 60 + 30,
    teacher: '阿尔文·莱特',
  },
  {
    id: 'y2_sword',
    year: 2,
    name: '高阶剑术',
    skill: 'sword',
    kind: 'physical',
    location: 'yard',
    start: 13 * 60,
    end: 14 * 60 + 30,
    teacher: '格里高利·索恩',
  },
  {
    id: 'y2_course_4',
    year: 2,
    name: '草药学',
    skill: 'alchemy',
    kind: 'nature',
    location: 'brewery',
    start: 15 * 60,
    end: 16 * 60 + 30,
    teacher: '赛拉·莫恩',
    examLocation: 'lecture',
    locationByWeekday: ['brewery', 'brewery', 'brewery', 'herbGarden', 'herbGarden'],
    skillByWeekday: ['alchemy', 'alchemy', 'alchemy', 'cultivation', 'cultivation'],
  },
]

/** 课堂场景文本：按 30 分钟一段取句，key 为课程或课程变体 */
const CLASS_SCENES: Record<string, string[]> = {
  y1_literature: [
    '伊莲娜没有急着翻开课本，先问你们最近有没有哪句话，一直记到现在。等了一会儿，她才把书翻到夹着纸条的那一页。',
    '她念了一段旧诗，念到一半停下来，说这个字她年轻时也读错过。然后她从那个字重新念起。',
    '伊莲娜让你们各挑一句抄下来。她在过道里慢慢走，偶尔在谁身后站一会儿，什么也没说。',
    '窗外开始落雨。伊莲娜合上书，说今天就读到这里，剩下的时间自己看。',
  ],
  y1_nature: [
    '阿尔文在讲台后抬起手，指尖亮起一小团白光。他没有解释，只抬了抬下巴，示意你们开始。',
    '有人手里的光灭了。阿尔文走过去，把那个人的手腕往上抬了一点，光又亮起来。',
    '阿尔文让你们把手伸平，什么也别想。教室里安静下来，只有几团光在晃。',
    '下课前，阿尔文熄了讲台上的灯，让你们在黑里维持住手里的光。有人撑不住，光一点点暗下去。',
  ],
  'y1_physical:brawl': [
    '格里高利用脚尖把木桩踢正，退后半步，等你们站好。',
    '他绕着队伍走，在一个人的面前停下，伸手把他的肩膀按低了一点。',
    '木桩被撞得晃了晃。格里高利看了一眼，说不够，再来。',
    '格里高利让两人一组对练，自己靠在墙边看，偶尔喊一声停。',
  ],
  'y1_physical:sword': [
    '格里高利从架子上抽出一把木剑，在手里掂了掂，扔给排头的人。',
    '他示范了一遍起手，动作很慢，慢到能看清手腕怎么转。',
    '剑与剑碰在一起，声音在院子里散开。格里高利在旁边数着，谁的动作乱了就点一下名。',
    '格里高利收起木剑，说今天到这里，明天手腕会酸，正常。',
  ],
  y2_history: [
    '伊莲娜在黑板上画了一条很长的线，在中间点了一下，说这里就是银月城建成的那一年。',
    '她讲到一半，有人问那年冬天到底死了多少人。伊莲娜停了一下，说记载里有三个数字。',
    '伊莲娜合上课本，说历史不是记住年份，是知道当年的人为什么那样选。说完她自己也笑了一下。',
  ],
  y2_advanced_nature: [
    '阿尔文把一张画满符线的纸贴在桌上，让你们照着描。他先描了一遍，笔尖没有停顿。',
    '有人描到一半线断了。阿尔文看了一眼，说重来，这次慢一点。',
    '阿尔文把几个人的纸收上去，一张张看，没说什么，只在其中两张上点了点。',
  ],
  y2_sword: [
    '格里高利今天没有摆木桩，只让你们站在院子中间，把剑举平。',
    '他走到一个人身后，握住他的手腕，把剑尖压低了两寸。',
    '格里高利让你们收剑，说举得稳比劈得快难。然后他先走了。',
  ],
  'y2_course_4:brewery': [
    '赛拉把一束苦叶放在石台上，先自己闻了闻，才递给你们。',
    '有人切得太碎。赛拉把砧板转过来，说这样味道就散了，重来。',
    '锅里的水开始冒小泡。赛拉让你们盯着火，自己去看下一组的药材。',
  ],
  'y2_course_4:herbGarden': [
    '赛拉蹲在畦边，拨开叶子让你们看根。她让每个人都说一遍看到了什么。',
    '有人的手伸得太快，赛拉按住他的手腕，让他先看清楚再碰。',
    '赛拉摘了几片叶子放在掌心，说起昨天那场雨。然后她让你们把这一畦认完。',
  ],
}

export const EXAM_DAYS_YEAR1 = [25, 53, 81, 137, 165, 193]
export const EXAM_DAYS_YEAR2 = [25, 53, 81, 137, 165, 193]

export function examDaysForYear(year: number): number[] {
  return year === 1 ? EXAM_DAYS_YEAR1 : EXAM_DAYS_YEAR2
}

export function isExamDay(day: number): boolean {
  const year = currentYear(day)
  if (year !== 1 && year !== 2) return false
  return examDaysForYear(year).includes(dayInYear(day))
}

/** 月考课程：按原本的上课时间开考。 */
const EXAM_COURSE_IDS: Record<number, string[]> = {
  1: ['y1_literature', 'y1_nature', 'y1_physical'],
  2: ['y2_history', 'y2_advanced_nature', 'y2_sword', 'y2_course_4'],
}

export function examCoursesForYear(year: number): CourseDef[] {
  const ids = EXAM_COURSE_IDS[year]
  if (!ids) return []
  return coursesForYear(year).filter((c) => ids.includes(c.id))
}

/** 月考包裹在考试后的周日 08:00 到达孤儿院。 */
export function examPackageTime(examDay: number): number {
  return (examDay + 2) * 1440 + 8 * 60
}

/** 学期成绩单在学期结束后的第一个周日 08:00 到达孤儿院。 */
export function semesterEndDay(year: number, semester: 1 | 2): number {
  return (year - 1) * YEAR_DAYS + (semester === 1 ? SEMESTER_DAYS : SEMESTER_DAYS * 2 + HOLIDAY_DAYS)
}

export function semesterPackageTime(endDay: number): number {
  const wd = weekday(endDay)
  const add = (6 - wd + 7) % 7 || 7
  return (endDay + add) * 1440 + 8 * 60
}

/** 学期最后一次月考所在的一天，用于学期成绩单的掌握度线。 */
export function semesterLastExamDay(year: number, semester: 1 | 2): number {
  const days = examDaysForYear(year)
  return (year - 1) * YEAR_DAYS + days[semester === 1 ? 2 : 5]
}

const YEAR_THRESHOLDS: Record<number, number[]> = {
  1: [20, 60, 100, 120, 160, 200],
  // 第二学年每月少一周课，考试线下调
  2: [15, 35, 60, 80, 100, 120],
}

export type SupportPeriod = {
  key: string
  kind: 'school' | 'holiday'
  maxSets: number
  startDay: number
  endDay: number
  month: number
  label: string
}

// NOTE: 如果支援窗口从「学期月 1 周 / 假期月整月」改成其他频率，
// 需要重算建设值、支援点与阶段 1 的时间。
export function supportPeriodAt(day: number): SupportPeriod | null {
  if (currentYear(day) < 2) return null
  const diy = dayInYear(day)
  const month = Math.floor(diy / 28)
  const week = Math.floor((diy % 28) / 7)
  const monthStart = (currentYear(day) - 1) * YEAR_DAYS + month * 28
  const holiday = month === 3 || month === 7
  if (holiday) {
    return {
      key: `${currentYear(day)}_${month}`,
      kind: 'holiday',
      maxSets: 4,
      startDay: monthStart,
      endDay: monthStart + 27,
      month,
      label: `${chineseNumber(month + 1)}月 · 假期建设`,
    }
  }
  if (week === 2) {
    return {
      key: `${currentYear(day)}_${month}`,
      kind: 'school',
      maxSets: 1,
      startDay: monthStart + 14,
      endDay: monthStart + 20,
      month,
      label: `${chineseNumber(month + 1)}月 · 建设周`,
    }
  }
  return null
}

export function nextSupportPeriod(day: number): SupportPeriod | null {
  for (let i = 0; i <= 56; i += 1) {
    const period = supportPeriodAt(day + i)
    if (period) return period
  }
  return null
}

export function isConstructionWeek(day: number): boolean {
  if (currentYear(day) < 2) return false
  const diy = dayInYear(day)
  const month = Math.floor(diy / 28)
  const week = Math.floor((diy % 28) / 7)
  if (month === 3 || month === 7) return true
  return week === 2
}

export function isClassDay(day: number): boolean {
  if (isExamDay(day) || isConstructionWeek(day)) return false
  const state = semesterState(day)
  return weekday(day) < 5 && (state === 'semester1' || state === 'semester2')
}

export function coursesForYear(year: number): CourseDef[] {
  return COURSES.filter((c) => c.year === year)
}

export function courseById(id: string): CourseDef | undefined {
  return COURSES.find((c) => c.id === id)
}

/** 某门课当天的上课地点 */
export function courseLocationOn(course: CourseDef, day: number): string {
  const wd = weekday(day)
  if (course.locationByWeekday && wd >= 0 && wd < 5) {
    return course.locationByWeekday[wd] ?? course.location
  }
  return course.location
}

/** 某门课当天实际训练的的技能 */
export function courseSkillOn(course: CourseDef, day: number): SkillKey {
  const wd = weekday(day)
  if (course.skillByWeekday && wd >= 0 && wd < 5) {
    return course.skillByWeekday[wd] ?? course.skill
  }
  if (course.rotate) {
    if (course.rotateWeekly) {
      return Math.floor(day / 7) % 2 === 0 ? 'brawl' : 'sword'
    }
    return wd === 0 || wd === 2 || wd === 4 ? 'brawl' : 'sword'
  }
  return course.skill
}

/** 某门课考试当天的地点 */
export function courseExamLocationOn(course: CourseDef, day: number): string {
  return course.examLocation ?? courseLocationOn(course, day)
}

export function examThresholdForDay(day: number): number {
  const year = currentYear(day)
  const days = examDaysForYear(year)
  const idx = days.indexOf(dayInYear(day))
  const table = YEAR_THRESHOLDS[year] ?? YEAR_THRESHOLDS[1]
  return table[idx < 0 ? table.length - 1 : idx]
}

export function nextExamThreshold(day: number, minutes: number): number | null {
  const total = nextExamTotal(day, minutes)
  if (total === null) return null
  return examThresholdForDay(Math.floor(total / 1440))
}

export type ClassSegment = {
  subject: string
  label: string
  skill: SkillKey
  extraSkill?: SkillKey
  courseId: string
  start: number
  end: number
  segmentStart: number
  segmentEnd: number
  index: number
}

export function classSegmentAt(location: string, minutes: number, day: number): ClassSegment | null {
  if (!isClassDay(day)) return null
  const wd = weekday(day)
  if (wd >= 5) return null

  const course = coursesForYear(currentYear(day)).find(
    (c) => courseLocationOn(c, day) === location && minutes >= c.start && minutes < c.end,
  )
  if (!course) return null

  const skill = courseSkillOn(course, day)
  const extraSkill: SkillKey | undefined = course.kind === 'physical' ? 'physique' : undefined
  const rotating = Boolean(course.rotate || course.skillByWeekday)
  const label = rotating ? `${course.name} · ${SKILL_LABEL[skill]}` : course.name

  const index = Math.floor((minutes - course.start) / 30)
  const segmentStart = course.start + index * 30
  const segmentEnd = Math.min(segmentStart + 30, course.end)
  return {
    subject: course.name,
    label,
    skill,
    extraSkill,
    courseId: course.id,
    start: course.start,
    end: course.end,
    segmentStart,
    segmentEnd,
    index,
  }
}

/** 当前 30 分钟分段的课堂场景文本；没有对应文本时返回空串 */
export function classScene(segment: ClassSegment, location: string): string {
  const variant =
    segment.courseId === 'y1_physical'
      ? segment.skill
      : segment.courseId === 'y2_course_4'
        ? location
        : ''
  const lines = CLASS_SCENES[variant ? `${segment.courseId}:${variant}` : segment.courseId] ?? []
  if (lines.length === 0) return ''
  return lines[segment.index % lines.length]
}

/** 自习与练习对应的当前学年课程；没有对应课程时返回 null */
export function masteryCourseForSkill(skill: SkillKey, day: number): string | null {
  const courses = coursesForYear(currentYear(day))
  if (skill === 'brawl' || skill === 'sword') {
    const physical = courses.find(
      (c) => c.kind === 'physical' && (c.rotate || c.skill === skill),
    )
    return physical?.id ?? null
  }
  const match = courses.find(
    (c) =>
      c.kind !== 'physical' &&
      (c.skill === skill || c.skillByWeekday?.includes(skill)),
  )
  return match?.id ?? null
}

export function classWindowAt(
  location: string,
  day: number,
  minutes: number,
): { start: number; end: number } | null {
  if (!isClassDay(day)) return null
  const course = coursesForYear(currentYear(day)).find(
    (c) => courseLocationOn(c, day) === location && minutes >= c.start && minutes < c.end,
  )
  return course ? { start: course.start, end: course.end } : null
}

export function nextClassStart(location: string, day: number, minutes: number): number | null {
  if (!isClassDay(day)) return null
  const starts = coursesForYear(currentYear(day))
    .filter((c) => courseLocationOn(c, day) === location)
    .map((c) => c.start)
    .sort((a, b) => a - b)
  return starts.find((s) => s > minutes) ?? null
}

export type LecturePreviewPlan =
  | {
      ok: true
      minutes: number
      subject: string
      skill: SkillKey
      courseId: string
    }
  | { ok: false; reason: string }

export function lecturePreviewPlan(day: number, minutes: number): LecturePreviewPlan {
  if (!isClassDay(day)) {
    return { ok: false, reason: '今天讲堂不开门。' }
  }
  if (classWindowAt('lecture', day, minutes)) {
    return { ok: false, reason: '这节课还在上，等下课吧。' }
  }
  const next = nextClassStart('lecture', day, minutes)
  if (next === null) {
    return { ok: false, reason: '今天没有下一节课了。' }
  }
  const available = Math.min(30, next - minutes)
  if (available < 15) {
    return { ok: false, reason: `还有 ${available} 分钟上课，来不及预习了。` }
  }
  const course = coursesForYear(currentYear(day)).find(
    (c) => c.location === 'lecture' && c.start === next,
  )
  if (!course) {
    return { ok: false, reason: '今天没有下一节课了。' }
  }
  return {
    ok: true,
    minutes: available,
    subject: course.name,
    skill: course.skill,
    courseId: course.id,
  }
}

export function nextExamTotal(day: number, minutes: number): number | null {
  if (isExamDay(day) && minutes < 20 * 60) {
    return day * 1440 + (currentYear(day) === 1 ? 9 * 60 : 8 * 60)
  }
  const t = absoluteMinutes(day, minutes)
  const year = currentYear(day)
  const candidates: number[] = []
  for (let y = year; y <= Math.min(MAX_YEAR, year + 1); y++) {
    const start = y === 1 ? 9 * 60 : 8 * 60
    for (const offset of examDaysForYear(y)) {
      candidates.push(((y - 1) * YEAR_DAYS + offset) * 1440 + start)
    }
  }
  return candidates.filter((x) => x > t).sort((a, b) => a - b)[0] ?? null
}

export type ReportKey = { year: number; semester: 1 | 2 }

export function semesterEndFor(prevDay: number, day: number): ReportKey | null {
  for (let y = currentYear(prevDay); y <= currentYear(day); y++) {
    const ends: Array<{ at: number; semester: 1 | 2 }> = [
      { at: (y - 1) * YEAR_DAYS + SEMESTER_DAYS, semester: 1 },
      { at: (y - 1) * YEAR_DAYS + SEMESTER_DAYS * 2 + HOLIDAY_DAYS, semester: 2 },
    ]
    for (const end of ends) {
      if (prevDay < end.at && day >= end.at) return { year: y, semester: end.semester }
    }
  }
  return null
}

export type PlazaNotice = { id: string; title: string; text: string }

const PLAZA_NOTICES_BASE: PlazaNotice[] = [
  {
    id: 'gate_hours',
    title: '城门时刻',
    text: '自即日起，城门 22:00 关闭，次日 06:00 开启。夜间入城请走侧门，并出示文书。\n——城门卫队',
  },
  {
    id: 'night_patrol',
    title: '夜间巡逻',
    text: '近日城南夜间有窃案，骑士团将加派巡骑。请居民夜间关好门窗。',
  },
  {
    id: 'lost_bag',
    title: '失物招领',
    text: '城门卫队拾到一只旧皮袋，内有铜币若干。失主请至城门认领。',
  },
  {
    id: 'road_repair',
    title: '道路修补',
    text: '中央广场东侧石板将修补三日，行人请绕行。',
  },
  {
    id: 'prayer',
    title: '圣祷公告',
    text: '本周日 09:00–11:00 于教堂举行圣祷，欢迎信徒参加。',
  },
  {
    id: 'relief_donation',
    title: '救济院募捐',
    text: '救济院征集旧衣、面粉与柴火，请送至教堂救济院。',
  },
  {
    id: 'bell_open',
    title: '钟楼开放',
    text: '钟楼 08:00–18:00 开放。登楼请勿敲钟。',
  },
  {
    id: 'caravan_arrive',
    title: '商队到城',
    text: '北境商队已抵银月城。杂货店新到香料、毛皮与药品。',
  },
  {
    id: 'weekend_market',
    title: '周末集市',
    text: '本周六 09:00–17:00 于中央广场设集市，招募摊主与帮工。',
  },
  {
    id: 'tavern_job',
    title: '酒馆招工',
    text: '酒馆招晚间帮工，包一顿晚饭，工钱面议。',
  },
  {
    id: 'herb_buy',
    title: '草药收购',
    text: '商会收购森林边缘的草药，按份计价。',
  },
  {
    id: 'lost_cat',
    title: '寻猫',
    text: '遗失一只灰猫，右耳有缺口，常在广场讨食。见者请告知孤儿院附近住户。',
  },
  {
    id: 'missing_traveler',
    title: '寻人',
    text: '寻找一名走失的旅人，最后出现在商业区。',
  },
  {
    id: 'room_rent',
    title: '房屋出租',
    text: '孤儿院附近有一间小屋出租，租金面议。',
  },
]

const PLAZA_NOTICES_WEST: PlazaNotice[] = [
  {
    id: 'west_supplies',
    title: '西境物资募集',
    text: '商会征集药品、绷带与干粮，送往西境。按件计价，送至商业区仓库。',
  },
  {
    id: 'west_move',
    title: '西境迁居登记',
    text: '西境部分村镇开放迁居登记，有意者请至商会办事处。',
  },
  {
    id: 'west_labor',
    title: '商会招募搬运帮工',
    text: '西境物资装车，需临时帮工。明日 08:00–10:00，工钱日结，管一顿早饭。',
  },
  {
    id: 'west_delay',
    title: '西境商队延期',
    text: '因道路不宁，原定本周出发的西境商队延期三日。已登记的货物与人员请等候通知。',
  },
]

export function plazaNotices(day: number, flags: Record<string, boolean>): PlazaNotice[] {
  const pool = [...PLAZA_NOTICES_BASE]
  if (currentYear(day) >= 2 && flags.west_support_started) {
    pool.push(...PLAZA_NOTICES_WEST)
  }
  const start = (day * 5) % pool.length
  const picked: PlazaNotice[] = []
  for (let i = 0; i < 3 && i < pool.length; i += 1) {
    const notice = pool[(start + i) % pool.length]
    if (!picked.some((n) => n.id === notice.id)) picked.push(notice)
  }
  return picked
}

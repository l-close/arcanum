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

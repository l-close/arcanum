// arcanum: world

import type { WestProjectKey } from '../types'
import { YEAR_DAYS, chineseNumber, currentYear, dayInYear } from './time'

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

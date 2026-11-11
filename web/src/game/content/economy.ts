// arcanum: economy

import type { Skill } from '../types'
import { ITEMS } from './items'
import { TIER_REQ } from './skills'

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

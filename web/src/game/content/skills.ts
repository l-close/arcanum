// arcanum: skills

import type { SkillKey } from '../types'

export const TIER_REQ = [200, 1000, 3000, 7500, 20000]

const TIER_NAMES: Record<SkillKey, string[]> = {
  physique: ['单薄', '普通', '强壮', '坚韧', '超凡'],
  knowledge: ['浅陋', '启蒙', '博闻', '通晓', '渊博'],
  will: ['薄弱', '普通', '坚定', '刚毅', '不屈'],
  brawl: ['入门', '初识', '娴熟', '精湛', '大师'],
  sword: ['入门', '初识', '娴熟', '精湛', '大师'],
  nature: ['入门', '初识', '娴熟', '精湛', '大师'],
  divine: ['入门', '初识', '娴熟', '精湛', '大师'],
  cultivation: ['入门', '初识', '娴熟', '精湛', '大师'],
  alchemy: ['入门', '初识', '娴熟', '精湛', '大师'],
}

export const SKILL_LABEL: Record<SkillKey, string> = {
  physique: '体质',
  knowledge: '学识',
  will: '意志',
  brawl: '格斗',
  sword: '剑术',
  nature: '自然系',
  divine: '神圣系',
  cultivation: '种植',
  alchemy: '炼药',
}

export const SKILL_ORDER: SkillKey[] = [
  'physique',
  'knowledge',
  'will',
  'brawl',
  'sword',
  'nature',
  'divine',
  'cultivation',
  'alchemy',
]

export function tierName(key: SkillKey, tier: number): string {
  if (tier >= 5) return '??'
  return TIER_NAMES[key][tier]
}

export function skillPercent(tier: number, exp: number): number {
  if (tier >= 5) return 0
  return Math.max(0, Math.min(100, (exp / TIER_REQ[tier]) * 100))
}

export function formatPercent(tier: number, exp: number): string {
  if (tier >= 5) return String(Math.floor(exp))
  return `${Math.floor(skillPercent(tier, exp))}%`
}

export function maxStamina(physiqueTier: number): number {
  return 100 + physiqueTier * 5
}

export function maxSpirit(willTier: number): number {
  return 100 + willTier * 5
}

export function maxHp(physiqueTier: number): number {
  return 60 + physiqueTier * 10
}

export function spiritCost(base: number, mood: number): number {
  if (mood < 20) return base + 2
  if (mood < 60) return base + 1
  return base
}

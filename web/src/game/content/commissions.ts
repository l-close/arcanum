// arcanum: commissions

import { hash01 } from './rng'

export type CommissionSource = 'guild' | 'workshop' | 'tavern'

export type CommissionObjective =
  | { kind: 'items'; items: Record<string, number> }
  | { kind: 'hunt'; enemyId: string; proof: string }

export type CommissionDef = {
  id: string
  source: CommissionSource
  name: string
  desc: string
  objective: CommissionObjective
  days: number
  money: number
  reputation: number
  minReputation?: number
  elite?: boolean
}

export const MAX_ACTIVE_COMMISSIONS = 3

export const COMMISSION_BOARD_SIZE = 6

export const REPUTATION_MAX = 50

export const REPUTATION_BANDS: Array<{ min: number; text: string }> = [
  { min: 0, text: '城里很少有人认得你。' },
  { min: 15, text: '常去的几家店开始记得你的脸。' },
  { min: 30, text: '商会、工坊和教会都愿意把活交给你。' },
  { min: 50, text: '在银月城，你的名字已经能当一层担保。' },
]

export function reputationText(reputation: number): string {
  let text = REPUTATION_BANDS[0].text
  for (const band of REPUTATION_BANDS) {
    if (reputation >= band.min) text = band.text
  }
  return text
}

/** 交付时的报酬加成：0 / 5% / 10% / 15%。 */
export function reputationPayBonus(reputation: number): number {
  if (reputation >= 50) return 0.15
  if (reputation >= 30) return 0.1
  if (reputation >= 15) return 0.05
  return 0
}

export function commissionPay(def: CommissionDef, reputation: number): number {
  return Math.round(def.money * (1 + reputationPayBonus(reputation)))
}

export function commissionSourceLocation(_source: CommissionSource): string {
  return 'guild'
}

export const COMMISSION_SOURCE_LABEL: Record<CommissionSource, string> = {
  guild: '商会',
  workshop: '工坊',
  tavern: '酒馆',
}

export const COMMISSIONS: CommissionDef[] = [
  {
    id: 'guild_hide',
    source: 'guild',
    name: '清点皮货',
    desc: '商会收购兽皮，供货棚与鞍具修补使用。',
    objective: { kind: 'items', items: { beast_hide: 3 } },
    days: 4,
    money: 35,
    reputation: 1,
  },
  {
    id: 'guild_misc',
    source: 'guild',
    name: '林间杂货',
    desc: '商会收购林间杂货，按清单验收。',
    objective: { kind: 'items', items: { beast_hide: 2, slime_gel: 2 } },
    days: 4,
    money: 28,
    reputation: 1,
  },
  {
    id: 'guild_gel',
    source: 'guild',
    name: '清理凝胶',
    desc: '商会收购史莱姆凝胶，用于后院水缸与管道清理。',
    objective: { kind: 'items', items: { slime_gel: 4, beast_hide: 2 } },
    days: 4,
    money: 30,
    reputation: 1,
  },
  {
    id: 'guild_tusk',
    source: 'guild',
    name: '收牙',
    desc: '商会代工匠收购野猪牙，用于制作器具。',
    objective: { kind: 'items', items: { boar_tusk: 2 } },
    days: 3,
    money: 40,
    reputation: 1,
    minReputation: 15,
  },
  {
    id: 'guild_wolf',
    source: 'guild',
    name: '讨伐灰狼首领',
    desc: '商会悬赏灰狼首领，凭狼牙交付。',
    objective: { kind: 'hunt', enemyId: 'gray_wolf_alpha', proof: 'wolf_fang' },
    days: 5,
    money: 60,
    reputation: 2,
    minReputation: 15,
    elite: true,
  },
  {
    id: 'guild_boar',
    source: 'guild',
    name: '讨伐野猪王',
    desc: '商会悬赏野猪王，凭王牙交付。',
    objective: { kind: 'hunt', enemyId: 'boar_king', proof: 'boar_king_tusk' },
    days: 6,
    money: 80,
    reputation: 2,
    minReputation: 30,
    elite: true,
  },
  {
    id: 'ws_salve',
    source: 'workshop',
    name: '生命药水订单',
    desc: '工坊征集生命药水，供伤员救治使用。',
    objective: { kind: 'items', items: { salve: 3 } },
    days: 3,
    money: 30,
    reputation: 1,
  },
  {
    id: 'ws_stim',
    source: 'workshop',
    name: '提神剂订单',
    desc: '工坊征集提神剂，供出城车队使用。',
    objective: { kind: 'items', items: { stimulant: 3 } },
    days: 3,
    money: 26,
    reputation: 1,
  },
  {
    id: 'ws_salve_fine',
    source: 'workshop',
    name: '精制生命药水订单',
    desc: '教会委托工坊征集精制生命药水。',
    objective: { kind: 'items', items: { salve_fine: 2 } },
    days: 4,
    money: 42,
    reputation: 1,
    minReputation: 15,
  },
  {
    id: 'ws_stim_fine',
    source: 'workshop',
    name: '精制提神剂订单',
    desc: '工坊征集精制提神剂，供夜间守塔使用。',
    objective: { kind: 'items', items: { stimulant_fine: 2 } },
    days: 4,
    money: 40,
    reputation: 1,
    minReputation: 15,
  },
  {
    id: 'ws_mixed',
    source: 'workshop',
    name: '混合订单',
    desc: '工坊与杂货铺联合征集常备药水。',
    objective: { kind: 'items', items: { salve: 2, stimulant: 2 } },
    days: 3,
    money: 36,
    reputation: 1,
    minReputation: 30,
  },
  {
    id: 'guild_venom',
    source: 'guild',
    name: '收毒牙',
    desc: '商会收购毒牙，供药师配制解毒剂。',
    objective: { kind: 'items', items: { venom_fang: 3 } },
    days: 4,
    money: 32,
    reputation: 1,
  },
  {
    id: 'guild_herbs',
    source: 'guild',
    name: '药田补货',
    desc: '商会代工坊收购止血草与苦叶。',
    objective: { kind: 'items', items: { bloodherb: 4, bitterleaf: 4 } },
    days: 3,
    money: 26,
    reputation: 1,
  },
  {
    id: 'guild_supplies',
    source: 'guild',
    name: '巡林补给',
    desc: '商会为巡林队征集兽皮、凝胶与止血草。',
    objective: { kind: 'items', items: { beast_hide: 2, slime_gel: 2, bloodherb: 3 } },
    days: 4,
    money: 34,
    reputation: 1,
  },
  {
    id: 'guild_tusk_bulk',
    source: 'guild',
    name: '大批野猪牙',
    desc: '商会大宗收购野猪牙，用于工匠订单。',
    objective: { kind: 'items', items: { boar_tusk: 4 } },
    days: 4,
    money: 80,
    reputation: 2,
    minReputation: 15,
  },
  {
    id: 'ws_antidote',
    source: 'workshop',
    name: '解毒剂订单',
    desc: '工坊征集解毒剂，供巡逻队使用。',
    objective: { kind: 'items', items: { antidote: 2 } },
    days: 3,
    money: 26,
    reputation: 1,
  },
  {
    id: 'ws_mana',
    source: 'workshop',
    name: '魔力药剂订单',
    desc: '工坊征集魔力药剂，供法阵维护使用。',
    objective: { kind: 'items', items: { mana_potion: 3 } },
    days: 3,
    money: 32,
    reputation: 1,
  },
  {
    id: 'ws_regen',
    source: 'workshop',
    name: '再生药水订单',
    desc: '工坊征集再生药水，供远行支援队备用。',
    objective: { kind: 'items', items: { regen_potion: 2 } },
    days: 4,
    money: 44,
    reputation: 1,
    minReputation: 15,
  },
  {
    id: 'ws_master',
    source: 'workshop',
    name: '精制三瓶',
    desc: '商会与教会联合征集精制药水，供教会与支援队使用。',
    objective: {
      kind: 'items',
      items: { salve_fine: 1, stimulant_fine: 1, antidote_fine: 1 },
    },
    days: 5,
    money: 75,
    reputation: 2,
    minReputation: 30,
  },
  {
    id: 'tavern_lanfruit',
    source: 'tavern',
    name: '兰果订单',
    desc: '酒馆兰果酒需求增加，收购兰果 5 个。',
    objective: { kind: 'items', items: { lanfruit: 5 } },
    days: 4,
    money: 30,
    reputation: 0,
  },
]

export function commissionById(id: string): CommissionDef | undefined {
  return COMMISSIONS.find((commission) => commission.id === id)
}

function seedOf(text: string): number {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** 高级委托出现概率。 */
export const ADVANCED_COMMISSION_CHANCE = 0.5

/**
 * 按周和名誉生成板子。
 * 商会 3 条、工坊 2 条；高级命中时随机顶掉 1 条低级。
 * 同一周结果固定。
 */
export function buildCommissionBoard(week: number, reputation: number): string[] {
  const byHash = (prefix: string, a: CommissionDef, b: CommissionDef) =>
    hash01(seedOf(`${week}:${prefix}:${a.id}`)) - hash01(seedOf(`${week}:${prefix}:${b.id}`))
  const base = COMMISSIONS.filter((commission) => (commission.minReputation ?? 0) === 0).sort(
    (a, b) => byHash('base', a, b),
  )
  const advanced = COMMISSIONS.filter(
    (commission) =>
      (commission.minReputation ?? 0) > 0 && (commission.minReputation ?? 0) <= reputation,
  ).sort((a, b) => byHash('advanced', a, b))

  let advancedCount = 0
  if (advanced.length > 0) {
    advancedCount = 1
    if (
      advanced.length >= 2 &&
      hash01(seedOf(`${week}:advanced-second`)) < ADVANCED_COMMISSION_CHANCE
    ) {
      advancedCount = 2
    }
  }

  const picked = [
    ...base.slice(0, Math.max(0, COMMISSION_BOARD_SIZE - advancedCount)),
    ...advanced.slice(0, advancedCount),
  ]
  if (picked.length < COMMISSION_BOARD_SIZE) {
    for (const def of [...advanced, ...base]) {
      if (picked.length >= COMMISSION_BOARD_SIZE) break
      if (!picked.some((entry) => entry.id === def.id)) picked.push(def)
    }
  }

  return picked
    .sort(
      (a, b) =>
        hash01(seedOf(`${week}:order:${a.id}`)) - hash01(seedOf(`${week}:order:${b.id}`)),
    )
    .map((def) => def.id)
}

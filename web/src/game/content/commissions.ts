// arcanum: commissions

import { hash01 } from './rng'

export type CommissionSource = 'guild' | 'workshop'

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

export const COMMISSION_BOARD_SIZE: Record<CommissionSource, number> = {
  guild: 3,
  workshop: 2,
}

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

export function commissionSourceLocation(source: CommissionSource): string {
  return source === 'guild' ? 'guild' : 'potionWorkshop'
}

export const COMMISSION_SOURCE_LABEL: Record<CommissionSource, string> = {
  guild: '商会',
  workshop: '工坊',
}

export const COMMISSIONS: CommissionDef[] = [
  {
    id: 'guild_hide',
    source: 'guild',
    name: '清点皮货',
    desc: '仓里堆了一批没鞣完的皮子，商会想先收几张顶用的。',
    objective: { kind: 'items', items: { beast_hide: 3 } },
    days: 4,
    money: 35,
    reputation: 1,
  },
  {
    id: 'guild_misc',
    source: 'guild',
    name: '林间杂货',
    desc: '林子里能捡的东西杂，商队按单子凑一批。',
    objective: { kind: 'items', items: { beast_hide: 2, slime_gel: 2 } },
    days: 4,
    money: 28,
    reputation: 1,
  },
  {
    id: 'guild_gel',
    source: 'guild',
    name: '清理凝胶',
    desc: '后院的水缸又让史莱姆爬满了，得有人清一清。',
    objective: { kind: 'items', items: { slime_gel: 4, beast_hide: 2 } },
    days: 4,
    money: 30,
    reputation: 1,
  },
  {
    id: 'guild_tusk',
    source: 'guild',
    name: '收牙',
    desc: '有工匠要野猪牙做活，商会替他收两根。',
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
    desc: '林子里那只缺耳的灰狼已经咬伤过两个樵夫。商会要它的牙。',
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
    desc: '野猪王把南边的药田拱了。商会要它的牙，挂在墙上。',
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
    desc: '工坊的生命药水见底了，柜台前排队的伤员还等着。',
    objective: { kind: 'items', items: { salve: 3 } },
    days: 3,
    money: 30,
    reputation: 1,
  },
  {
    id: 'ws_stim',
    source: 'workshop',
    name: '提神剂订单',
    desc: '车队明天出城，工坊得备几瓶提神的。',
    objective: { kind: 'items', items: { stimulant: 3 } },
    days: 3,
    money: 26,
    reputation: 1,
  },
  {
    id: 'ws_salve_fine',
    source: 'workshop',
    name: '精制生命药水订单',
    desc: '教会订了一批细制的生命药水，托工坊转手。',
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
    desc: '有位药师要精制提神剂，说是给夜里守塔的人用。',
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
    desc: '杂货铺和工坊一起补货，两种常备药各要几瓶。',
    objective: { kind: 'items', items: { salve: 2, stimulant: 2 } },
    days: 3,
    money: 36,
    reputation: 1,
    minReputation: 30,
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
  const board: string[] = []
  const sources: CommissionSource[] = ['guild', 'workshop']
  for (const source of sources) {
    const size = COMMISSION_BOARD_SIZE[source]
    const byHash = (prefix: string, a: CommissionDef, b: CommissionDef) =>
      hash01(seedOf(`${week}:${source}:${prefix}:${a.id}`)) -
      hash01(seedOf(`${week}:${source}:${prefix}:${b.id}`))
    const base = COMMISSIONS.filter(
      (commission) =>
        commission.source === source && (commission.minReputation ?? 0) === 0,
    ).sort((a, b) => byHash('base', a, b))
    const advanced = COMMISSIONS.filter(
      (commission) =>
        commission.source === source &&
        (commission.minReputation ?? 0) > 0 &&
        (commission.minReputation ?? 0) <= reputation,
    ).sort((a, b) => byHash('advanced', a, b))
    const roll = hash01(seedOf(`${week}:${source}:advanced-roll`))
    if (advanced.length > 0 && roll < ADVANCED_COMMISSION_CHANCE) {
      const pick = Math.floor(
        hash01(seedOf(`${week}:${source}:advanced-pick`)) * advanced.length,
      )
      const chosen = advanced[Math.min(pick, advanced.length - 1)]
      board.push(...base.slice(0, Math.max(0, size - 1)).map((c) => c.id), chosen.id)
    } else {
      board.push(...base.slice(0, size).map((c) => c.id))
    }
  }
  return board
}

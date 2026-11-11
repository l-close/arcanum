// arcanum: runes

import type { EquipmentSlot } from '../types'
import type { ItemDef } from './items'

export type RuneEffect = 'edge' | 'spell' | 'guard' | 'swift' | 'burn'

export type RuneDef = {
  id: string
  name: string
  price: number
  slots: EquipmentSlot[]
  effect: RuneEffect
  desc: string
  excludeMedium?: boolean
}

export const RUNE_SHOP_OPEN_START = 10 * 60
export const RUNE_SHOP_OPEN_END = 20 * 60
export const RUNE_LOOK_MINUTES = 15
export const RUNE_LOOK_MOOD = 2
export const RUNE_ENGRAVE_MINUTES = 30

export const RUNES: RuneDef[] = [
  {
    id: 'edge',
    name: '锋刃',
    price: 25,
    slots: ['mainHand'],
    effect: 'edge',
    desc: '使用该武器近战攻击时，伤害 +1。',
  },
  {
    id: 'spell',
    name: '聚魔',
    price: 30,
    slots: ['mainHand', 'accessory'],
    effect: 'spell',
    desc: '法术伤害 +1。',
  },
  {
    id: 'guard',
    name: '坚固',
    price: 35,
    slots: ['armor', 'offHand'],
    effect: 'guard',
    desc: '受到物理伤害 -1，仍受保底限制。',
  },
  {
    id: 'swift',
    name: '速行',
    price: 35,
    slots: ['armor', 'offHand', 'accessory', 'feet'],
    effect: 'swift',
    desc: '行动条充能 +5%。',
  },
  {
    id: 'burn',
    name: '灼燃',
    price: 45,
    slots: ['mainHand'],
    effect: 'burn',
    desc: '近战攻击有 40% 概率施加烧伤。烧伤最多 3 层，每层每秒造成 2 点火焰伤害，持续 4 秒，无视防御。',
    excludeMedium: true,
  },
]

export const RUNE_LOOK_TEXTS = [
  '墙上那排旧符被烟熏得发暗，纸边卷起。你看了一会儿，还是看不出它们原来管什么用。',
  '赛拉斯把一块铜片翻过来，让你看背面的刻痕。深浅很匀，像用尺量过。',
  '柜台上摊着半成品的护符，旁边压着一块镇纸。你听见刻刀在铜片上走，声音很轻。',
]

export function runeById(id: string): RuneDef | undefined {
  return RUNES.find((rune) => rune.id === id)
}

export function engravingSlotsForItem(item: ItemDef): number {
  return Math.max(0, item.engravingSlots ?? 1)
}

export function runeApplicable(item: ItemDef, rune: RuneDef): boolean {
  if (item.type !== 'equipment' || !item.slot) return false
  if (!rune.slots.includes(item.slot)) return false
  if (rune.effect === 'spell' && item.slot === 'mainHand' && !item.medium) return false
  if (rune.excludeMedium && item.medium) return false
  return true
}

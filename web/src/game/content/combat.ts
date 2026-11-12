// arcanum: combat

import type { CombatBuffKey, CombatBuffs } from '../types'
import { ITEMS } from './items'

export const COMBAT_BUFF_DURATION_MINUTES = 24 * 60

export const COMBAT_BUFF_LABEL: Record<CombatBuffKey, string> = {
  sharp: '锐锋',
  stone: '石肤',
  swift: '疾行',
}

export const COMBAT_BUFF_EFFECT: Record<CombatBuffKey, string> = {
  sharp: '近战伤害 +1',
  stone: '受到物理伤害 -1',
  swift: '行动条充能 +5%',
}

export const COMBAT_BUFF_ITEMS: Record<CombatBuffKey, string> = {
  sharp: 'sharp_draught',
  stone: 'stone_draught',
  swift: 'swift_draught',
}

export function combatBuffUntilKey(key: CombatBuffKey): keyof CombatBuffs {
  if (key === 'sharp') return 'sharpUntil'
  if (key === 'stone') return 'stoneUntil'
  return 'swiftUntil'
}

/** 保底伤害：至少 10%，最低 1 点，向下取整。 */
export const DAMAGE_FLOOR_RATE = 0.1

export function floorDamage(base: number): number {
  return Math.max(1, Math.floor(base * DAMAGE_FLOOR_RATE))
}

/** 基础伤害减去防御，最多减到保底。 */
export function applyDefense(base: number, defense: number): number {
  return Math.max(floorDamage(base), base - Math.max(0, defense))
}

export const POISON_MAX_STACKS = 3
export const POISON_DAMAGE_PER_STACK = 4
export const POISON_TICKS = 60

export const BLEED_MAX_STACKS = 5
export const BLEED_DAMAGE_PER_STACK = 3

export const REGEN_MAX_STACKS = 5
export const REGEN_HEAL_PER_STACK = 2

export type AttackKind = 'brawl' | 'sword'

export function weaponPower(kind: AttackKind, mainHand: string | null): number {
  if (!mainHand) return 0
  const item = ITEMS[mainHand]
  if (!item) return 0
  if (kind === 'sword') return item.weapon === 'sword' ? item.power ?? 0 : 0
  return item.weapon === 'staff' ? item.power ?? 0 : 0
}

export function attackDamageRange(
  kind: AttackKind,
  tier: number,
  mainHand: string | null,
  defense: number,
  bonus = 0,
): [number, number] {
  const base = 4 + tier * 2 + weaponPower(kind, mainHand) + bonus
  return [applyDefense(base, defense), applyDefense(base + 2, defense)]
}

export type SpellDef = {
  id: string
  name: string
  element: string
  desc: string
  mana: number
  baseDamage: number
  tierScale: number
  variance: number
  castTicks: number
}

export const SPELLS: Record<string, SpellDef> = {
  fireball: {
    id: 'fireball',
    name: '火球术',
    element: '火',
    desc: '自然系·火。把魔力压成一颗火球，砸向单个目标。',
    mana: 8,
    baseDamage: 12,
    tierScale: 4,
    variance: 3,
    castTicks: 10,
  },
}

export const FIREBALL_READING_EXP = 60

export function spellDamageRange(
  spell: SpellDef,
  natureTier: number,
  resist: number,
  spellPower = 0,
): [number, number] {
  const base = spell.baseDamage + natureTier * spell.tierScale + spellPower
  return [applyDefense(base, resist), applyDefense(base + spell.variance, resist)]
}

export type EnemyTrait = {
  name: string
  desc: string
}

export type EnemyRegen = {
  initial: number
  max: number
  healPer: number
  /** 层数不会减少（侵蚀体 α 的污秽之躯）。 */
  persistent?: boolean
}

export type EnemyDef = {
  id: string
  name: string
  desc: string
  hp: number
  attack: number
  defense: number
  resist: number
  /** 敌人攻击类型，缺省为物理。 */
  element?: 'physical' | 'magic'
  /** 图鉴个人记录里的补充信息。 */
  bestiaryRecord?: {
    grade?: string
    composition?: string
    source?: string
  }
  speed: number
  expValue: number
  intro: string
  attackLines: string[]
  defeatLine: string
  traits?: EnemyTrait[]
  /** 攻击命中时施加中毒的概率。 */
  poisonChance?: number
  /** 攻击命中时施加流血的概率。 */
  bleedChance?: number
  /** 生命归零后切换到的敌人 ID。 */
  transformTo?: string
  regen?: EnemyRegen
}

export const ENEMIES: Record<string, EnemyDef> = {
  dummy: {
    id: 'dummy',
    name: '木桩',
    desc: '立在场地中央的旧木桩，表面留着深浅不一的刻痕。',
    hp: 30,
    attack: 0,
    defense: 0,
    resist: 0,
    speed: 0,
    expValue: 0.5,
    intro: '木桩立在场地中央，不会还手。',
    attackLines: [],
    defeatLine: '木桩上的刻痕又深了一道。',
  },
  practice_dummy: {
    id: 'practice_dummy',
    name: '练习人偶',
    desc: '包着旧布和皮革的附魔木偶，手臂上缝着软垫，表面有防火涂层。',
    hp: 50,
    attack: 8,
    defense: 1,
    resist: 0,
    speed: 2.6,
    expValue: 1,
    intro: '练习人偶抬起包着布的手臂，关节发出轻响。',
    attackLines: [
      '人偶抬起手臂，撞在你肩上。',
      '人偶向前迈了一步，木脚在地面上磕出声响。',
      '人偶的动作有些笨拙，但力气不小。',
    ],
    defeatLine: '人偶的动作慢下来，最终垂下手。',
  },
  slime: {
    id: 'slime',
    name: '史莱姆',
    desc: '一团半透明的胶质，里面浮着几片没消化的叶子和石子。',
    hp: 45,
    attack: 7,
    defense: 0,
    resist: 1,
    speed: 2.3,
    expValue: 0.8,
    intro: '灌木里传来黏腻的声响。一团半透明的史莱姆慢慢从草里滑出来。',
    attackLines: [
      '史莱姆弹了一下，黏在你小腿上。',
      '史莱姆压过来，带着一股湿冷的气味。',
      '史莱姆的身体晃了晃，溅出几滴黏液。',
    ],
    defeatLine: '史莱姆塌成一摊，慢慢渗进落叶底下。',
  },
  viper: {
    id: 'viper',
    name: '毒蛇',
    desc: '一条细长的蛇，鳞片颜色几乎和落叶一样。它盘在草里，只抬起前半身。',
    hp: 50,
    attack: 8,
    defense: 0,
    resist: 0,
    speed: 2.7,
    expValue: 1,
    intro:
      '草叶轻轻动了一下。\n一条细长的蛇从落叶里抬起前半身，鳞片颜色几乎和周围一样。\n它没有退，只是把信子吐了一次。',
    attackLines: [
      '毒蛇弹起来，牙尖擦过你的手背。',
      '它贴着地面绕了半圈，突然咬向你的脚踝。',
      '毒蛇的身体绷紧，又弹了一次。',
    ],
    defeatLine: '毒蛇的身体松开，慢慢滑回落叶里。',
    traits: [{ name: '毒牙', desc: '攻击命中时可能使目标中毒。' }],
    poisonChance: 0.35,
  },
  corrupted_dog: {
    id: 'corrupted_dog',
    name: '被侵蚀的野狗',
    desc: '它的身体像被什么东西从里面撑开，肋骨顶破了皮，脊背弯成一个不自然的角度。',
    hp: 90,
    attack: 11,
    defense: 1,
    resist: 1,
    speed: 3.0,
    expValue: 2,
    intro:
      '路边的草里传来低低的喘息。\n它的身体像被什么东西从里面撑开，肋骨顶破了皮，脊背弯成一个不自然的角度。\n半边脸塌下去，露出的牙床比正常的狗长了一截。\n它还在喘气，喉咙里发出不像狗的声音。\n你只能从脖子上的旧项圈，勉强认出这原本是条狗。',
    attackLines: [
      '它用变形的肩骨撞过来。',
      '它咬住你的袖子，牙齿刮过皮肉。',
      '它喉咙里发出湿漉漉的声音，又扑了一次。',
    ],
    defeatLine: '它倒下去，四肢却从不对的方向撑住地面。',
    transformTo: 'erosion_body',
  },
  erosion_body: {
    id: 'erosion_body',
    name: '侵蚀体 α',
    desc: '野狗的躯壳已经裂开。蚀念还依附在壳里，像借着一件不合身的衣服站起来。',
    hp: 30,
    attack: 4,
    defense: 1,
    resist: 1,
    element: 'magic',
    speed: 3.1,
    expValue: 2,
    bestiaryRecord: {
      grade: 'α 型蚀念',
      composition: '蚀念（α 型）',
      source: '躯壳（犬形）',
    },
    intro:
      '它的躯壳从里面塌下去，又有什么东西把它撑了起来。\n它抬起头。这一次，它的动作不像活物。',
    attackLines: [
      '它隔着一段距离撞过来，像有什么先一步碰到了你。',
      '它的影子先动，身体才跟上。',
      '它的头歪向一边，声音从身体里传出来。',
    ],
    defeatLine: '这一次它没有再站起来。地上的东西慢慢安静下去。',
    traits: [
      {
        name: '污秽之躯',
        desc: '蚀念维持着转化出的躯体，伤口会按原来的形状重新合拢；登场时获得 3 层再生，再生层数不会减少。',
      },
    ],
    regen: { initial: 3, max: 5, healPer: 2, persistent: true },
  },
  gray_wolf: {
    id: 'gray_wolf',
    name: '灰狼',
    desc: '一只瘦而结实的灰狼，压低身子，在路边慢慢逼近。',
    hp: 60,
    attack: 10,
    defense: 0,
    resist: 0,
    speed: 3.3,
    expValue: 1.2,
    intro:
      '路边的灌木动了一下。\n一只灰狼从阴影里探出头，压低身子，慢慢逼近。',
    attackLines: [
      '灰狼从侧面扑上来，咬向你的小腿。',
      '它绕了半圈，又冲了一次。',
      '灰狼低吼着，爪子刨过地面。',
    ],
    defeatLine: '灰狼退了两步，转身钻进林子，很快不见了。',
  },
  deserter: {
    id: 'deserter',
    name: '劫道散兵',
    desc: '一个穿着褪色军服的人，手里握着一把旧刀。',
    hp: 75,
    attack: 11,
    defense: 1,
    resist: 0,
    speed: 2.8,
    expValue: 1.3,
    intro:
      '一个人从路边的石头后面站起来，手里握着一把旧刀。\n衣服上是褪色的军服，边角磨破了。',
    attackLines: [
      '他挥刀砍过来，刀刃擦过你的肩。',
      '他往前逼了一步，刀尖压得很低。',
      '他喘着气，又劈了一刀。',
    ],
    defeatLine: '他退进林子，刀掉在地上。你没有追。',
  },
  boar: {
    id: 'boar',
    name: '野猪',
    desc: '一头结实的野猪，肩背隆起，獠牙从嘴角支出来。',
    hp: 70,
    attack: 11,
    defense: 2,
    resist: 0,
    speed: 2.4,
    expValue: 1.4,
    intro:
      '灌木被撞开。\n一头野猪低下头，獠牙从嘴角支出来。',
    attackLines: [
      '野猪低头撞过来，肩膀撞在你身上。',
      '它用獠牙挑了一下，泥土被掀起来。',
      '野猪喷着气，又冲了一次。',
    ],
    defeatLine: '野猪退了两步，转身撞进灌木里，很快没了声音。',
  },
  gray_wolf_alpha: {
    id: 'gray_wolf_alpha',
    name: '灰狼首领',
    desc: '一只比寻常灰狼大一圈的狼。左耳缺了一块，颈毛上挂着旧伤。',
    hp: 130,
    attack: 14,
    defense: 1,
    resist: 0,
    speed: 3.8,
    expValue: 2.5,
    intro:
      '灌木深处传来低沉的呼吸。\n一只比寻常灰狼大一圈的狼从树影里走出来，左耳缺了一块，颈毛上挂着旧伤。\n它没有急着扑上来，只是慢慢压低身子。',
    attackLines: [
      '它从侧面切进来，牙齿擦过你的手臂。',
      '它低吼一声，肩骨撞在你胸口。',
      '它绕了半圈，突然加速扑上来。',
    ],
    defeatLine: '它退了两步，前腿一软，倒在落叶里。',
    traits: [{ name: '撕裂', desc: '攻击命中时可能使目标流血。' }],
    bleedChance: 0.35,
  },
  boar_king: {
    id: 'boar_king',
    name: '野猪王',
    desc: '一头肩高到腰的野猪，獠牙上留着旧裂口，背上结着厚厚的痂。',
    hp: 190,
    attack: 15,
    defense: 3,
    resist: 0,
    speed: 2.2,
    expValue: 3,
    intro:
      '地面在震。\n一头肩高到腰的野猪从树后撞出来，獠牙上留着旧裂口，背上结着厚厚的痂。\n它低下头，把獠牙对准你。',
    attackLines: [
      '它低头撞过来，整片地面都在响。',
      '獠牙挑过你的腿侧，带起一蓬土。',
      '它喷着白气，又撞了一次。',
    ],
    defeatLine: '它又冲了两步，膝盖一弯，重重跪在地上。',
    traits: [{ name: '獠牙撕裂', desc: '攻击命中时可能使目标流血。' }],
    bleedChance: 0.45,
  },
}

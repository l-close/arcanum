// arcanum: items

import type { CombatBuffKey, EquipmentSlot, SkillKey } from '../types'

export type ItemType = 'consumable' | 'equipment' | 'material' | 'book'

export type Quality = 'common' | 'rare' | 'uncommon' | 'epic' | 'legendary'

export const QUALITY: Record<Quality, { name: string; color: string }> = {
  common: { name: '普通', color: '#8a8f98' },
  rare: { name: '稀有', color: '#7fb069' },
  uncommon: { name: '罕见', color: '#6c9bd1' },
  epic: { name: '史诗', color: '#a87bd1' },
  legendary: { name: '传说', color: '#d8b45a' },
}

export const EQUIPMENT_SLOTS: Array<{ key: EquipmentSlot; label: string }> = [
  { key: 'mainHand', label: '主手' },
  { key: 'offHand', label: '副手' },
  { key: 'armor', label: '护甲' },
  { key: 'accessory', label: '饰品' },
]

export type ItemDef = {
  id: string
  name: string
  type: ItemType
  quality: Quality
  price: number
  desc: string
  slot?: EquipmentSlot
  medium: boolean
  weapon?: 'staff' | 'sword'
  power?: number
  spellPower?: number
  effect?: { stamina?: number; mana?: number; hp?: number; combatBuff?: CombatBuffKey }
}

export const ITEMS: Record<string, ItemDef> = {
  basic_wand: {
    id: 'basic_wand',
    name: '练习魔杖',
    type: 'equipment',
    quality: 'common',
    price: 0,
    slot: 'mainHand',
    medium: true,
    weapon: 'staff',
    power: 1,
    desc: '学院统一发的练习魔杖，杖身有细小的划痕。杖击威力很低。',
  },
  advanced_wand: {
    id: 'advanced_wand',
    name: '进阶魔杖',
    type: 'equipment',
    quality: 'rare',
    price: 60,
    slot: 'mainHand',
    medium: true,
    weapon: 'staff',
    power: 1,
    spellPower: 2,
    desc: '杖头镶着一小块打磨过的晶石。法术伤害 +2。',
  },
  practice_sword: {
    id: 'practice_sword',
    name: '练习短剑',
    type: 'equipment',
    quality: 'common',
    price: 25,
    slot: 'mainHand',
    medium: false,
    weapon: 'sword',
    power: 4,
    desc: '学院演武场用的短剑，刃口没有开锋。可以练习剑术。',
  },
  iron_sword: {
    id: 'iron_sword',
    name: '铁剑',
    type: 'equipment',
    quality: 'rare',
    price: 65,
    slot: 'mainHand',
    medium: false,
    weapon: 'sword',
    power: 6,
    desc: '武具店里最普通的铁剑。比练习短剑沉，也更锋利。',
  },
  mana_potion: {
    id: 'mana_potion',
    name: '魔力药剂',
    type: 'consumable',
    quality: 'rare',
    price: 12,
    medium: false,
    desc: '瓶身冰凉，液面泛着淡蓝。恢复 20 点魔力。',
    effect: { mana: 20 },
  },
  tonic: {
    id: 'tonic',
    name: '提神药',
    type: 'consumable',
    quality: 'rare',
    price: 10,
    medium: false,
    desc: '一股辛辣的草药味。恢复 15 点体力。',
    effect: { stamina: 15 },
  },
  healing_potion: {
    id: 'healing_potion',
    name: '伤药',
    type: 'consumable',
    quality: 'rare',
    price: 15,
    medium: false,
    desc: '灰白色的药粉，闻起来发苦。恢复 20 点生命。',
    effect: { hp: 20 },
  },
  salve: {
    id: 'salve',
    name: '止血膏',
    type: 'consumable',
    quality: 'common',
    price: 16,
    medium: false,
    desc: '用止血草熬成的药膏。抹在伤口上会有一阵凉意。恢复 25 点生命。',
    effect: { hp: 25 },
  },
  salve_fine: {
    id: 'salve_fine',
    name: '精制止血膏',
    type: 'consumable',
    quality: 'rare',
    price: 28,
    medium: false,
    desc: '滤得更细的止血膏，药性更足。恢复 40 点生命。',
    effect: { hp: 40 },
  },
  stimulant: {
    id: 'stimulant',
    name: '提神剂',
    type: 'consumable',
    quality: 'common',
    price: 12,
    medium: false,
    desc: '苦叶煎出的提神剂。喝下去舌根发苦，身上会暖起来。恢复 20 点体力。',
    effect: { stamina: 20 },
  },
  stimulant_fine: {
    id: 'stimulant_fine',
    name: '精制提神剂',
    type: 'consumable',
    quality: 'rare',
    price: 20,
    medium: false,
    desc: '浓缩过的提神剂，苦味更重，见效也更快。恢复 30 点体力。',
    effect: { stamina: 30 },
  },
  sharp_draught: {
    id: 'sharp_draught',
    name: '锐锋药剂',
    type: 'consumable',
    quality: 'rare',
    price: 18,
    medium: false,
    desc: '喝下去喉咙发热，握兵器的手更稳。24 小时内近战伤害 +1。同种药剂不可叠加。',
    effect: { combatBuff: 'sharp' },
  },
  stone_draught: {
    id: 'stone_draught',
    name: '石肤药剂',
    type: 'consumable',
    quality: 'rare',
    price: 18,
    medium: false,
    desc: '皮肤会短暂发紧，像裹了一层薄壳。24 小时内受到的伤害 -1，最低 1。同种药剂不可叠加。',
    effect: { combatBuff: 'stone' },
  },
  swift_draught: {
    id: 'swift_draught',
    name: '疾行药剂',
    type: 'consumable',
    quality: 'rare',
    price: 22,
    medium: false,
    desc: '心跳加快，脚步变轻。24 小时内行动条充能 +5%。同种药剂不可叠加。',
    effect: { combatBuff: 'swift' },
  },
  dry_ration: {
    id: 'dry_ration',
    name: '干粮',
    type: 'consumable',
    quality: 'common',
    price: 2,
    medium: false,
    desc: '硬得能敲响的干粮。恢复 8 点体力。',
    effect: { stamina: 8 },
  },
  slime_gel: {
    id: 'slime_gel',
    name: '史莱姆凝胶',
    type: 'material',
    quality: 'common',
    price: 3,
    medium: false,
    desc: '半透明的胶质，摸起来凉而弹。杂货店会收。',
  },
  beast_hide: {
    id: 'beast_hide',
    name: '兽皮',
    type: 'material',
    quality: 'common',
    price: 5,
    medium: false,
    desc: '从野兽身上剥下的皮，边缘还带着毛。杂货店会收。',
  },
  boar_tusk: {
    id: 'boar_tusk',
    name: '野猪牙',
    type: 'material',
    quality: 'rare',
    price: 15,
    medium: false,
    desc: '一根粗壮的野猪獠牙，表面泛着黄。很少见，杂货店会收。',
  },
  bloodherb: {
    id: 'bloodherb',
    name: '止血草',
    type: 'material',
    quality: 'common',
    price: 3,
    medium: false,
    desc: '叶背带一点暗红的草药。碾碎后有股涩味。',
  },
  bitterleaf: {
    id: 'bitterleaf',
    name: '苦叶',
    type: 'material',
    quality: 'common',
    price: 2,
    medium: false,
    desc: '一种味道很苦的叶子。晒干后能放很久。',
  },
  picture_book: {
    id: 'picture_book',
    name: '绘本',
    type: 'book',
    quality: 'common',
    price: 0,
    medium: false,
    desc: '一本边角磨圆的旧绘本。诺拉说，你小时候翻过很多遍。',
  },
  sword_manual: {
    id: 'sword_manual',
    name: '基础剑术图解',
    type: 'book',
    quality: 'uncommon',
    price: 0,
    medium: false,
    desc: '一本被压在旧书堆里的剑术图解。封面磨白，页边留着前一个主人的批注。',
  },
  fireball_book: {
    id: 'fireball_book',
    name: '火球术',
    type: 'book',
    quality: 'rare',
    price: 0,
    medium: false,
    desc: '一本薄薄的手抄本。前面的段落讲吟唱，后面的段落讲怎么把魔力压成火球。',
  },
  brawl_manual: {
    id: 'brawl_manual',
    name: '格斗札记',
    type: 'book',
    quality: 'uncommon',
    price: 40,
    medium: false,
    desc: '一本记着近身格斗要点的旧札记。页边画着不少受力方向的小图。',
  },
  defense_notes: {
    id: 'defense_notes',
    name: '防身笔记',
    type: 'book',
    quality: 'uncommon',
    price: 45,
    medium: false,
    desc: '一本讲怎么挨打、怎么卸力的笔记。字迹很密，边角被翻得发软。',
  },
  old_city_stories: {
    id: 'old_city_stories',
    name: '旧城故事集',
    type: 'book',
    quality: 'common',
    price: 20,
    medium: false,
    desc: '一本收着银月城旧街传闻和短故事的小册子。纸页发黄，读起来不费力。',
  },
  silver_moon_lore: {
    id: 'silver_moon_lore',
    name: '银月风土记',
    type: 'book',
    quality: 'common',
    price: 25,
    medium: false,
    desc: '一本讲银月城旧街、节令和日常规矩的杂记。字不深，读起来很慢。',
  },
}

export type BookReward = {
  mood?: number
  spirit?: number
  exp?: Partial<Record<SkillKey, number>>
  flag?: string
  spell?: string
  text?: string
}

export type BookDef = {
  id: string
  name: string
  desc: string
  progressPerRead: number
  repeatable: boolean
  spiritCost?: number
  foundText?: string
  requiresFlag?: string
  requirementText?: string
  reward: BookReward
}

export const BOOKS: Record<string, BookDef> = {
  picture_book: {
    id: 'picture_book',
    name: '绘本',
    desc: '颜色已经有些发暗的旧绘本。翻起来很慢，但会让人安静下来。',
    progressPerRead: 25,
    repeatable: true,
    reward: { mood: 8 },
  },
  sword_manual: {
    id: 'sword_manual',
    name: '基础剑术图解',
    desc: '一本被压在旧书堆里的剑术图解。封面磨白，页边留着前一个主人的批注。',
    progressPerRead: 20,
    repeatable: false,
    spiritCost: 1,
    foundText:
      '你在一排旧书的最后，翻到一本被压住的剑术图解。\n封面已经磨白，里面还留着前一个主人的批注。',
    reward: { flag: 'book_sword_manual', text: '剑术攻击伤害永久 +1' },
  },
  fireball_book: {
    id: 'fireball_book',
    name: '火球术',
    desc: '一本薄薄的手抄本。前面的段落讲吟唱，后面的段落讲怎么把魔力压成火球。',
    progressPerRead: 25,
    repeatable: false,
    spiritCost: 1,
    requiresFlag: 'fireball_ready',
    requirementText: '自然系 0 级进度 30%',
    foundText:
      '你在一本讲基础法术的旧册子后面，翻到一本薄薄的手抄本。\n封面上写着《火球术》。',
    reward: { spell: 'fireball', text: '学会火球术' },
  },
  brawl_manual: {
    id: 'brawl_manual',
    name: '格斗札记',
    desc: '一本记着近身格斗要点的旧札记。页边画着不少受力方向的小图。',
    progressPerRead: 20,
    repeatable: false,
    spiritCost: 1,
    reward: { flag: 'book_brawl_manual', text: '格斗攻击伤害永久 +1' },
  },
  defense_notes: {
    id: 'defense_notes',
    name: '防身笔记',
    desc: '一本讲怎么挨打、怎么卸力的笔记。字迹很密，边角被翻得发软。',
    progressPerRead: 17,
    repeatable: false,
    spiritCost: 1,
    reward: { flag: 'book_defense_notes', text: '受到伤害永久 -1' },
  },
  old_city_stories: {
    id: 'old_city_stories',
    name: '旧城故事集',
    desc: '一本收着银月城旧街传闻和短故事的小册子。纸页发黄，读起来不费力。',
    progressPerRead: 34,
    repeatable: true,
    reward: { mood: 6 },
  },
  silver_moon_lore: {
    id: 'silver_moon_lore',
    name: '银月风土记',
    desc: '一本讲银月城旧街、节令和日常规矩的杂记。字不深，读起来很慢。',
    progressPerRead: 50,
    repeatable: true,
    spiritCost: 2,
    reward: { exp: { knowledge: 5 }, text: '学识经验 +5' },
  },
}

export const SEARCHABLE_BOOKS = ['sword_manual', 'fireball_book']

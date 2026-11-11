import type {
  CombatBuffKey,
  CombatBuffs,
  EquipmentSlot,
  Skill,
  SkillKey,
  WestProjectKey,
} from '../types'

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

export const COMBAT_BUFF_DURATION_MINUTES = 24 * 60

export const COMBAT_BUFF_LABEL: Record<CombatBuffKey, string> = {
  sharp: '锐锋',
  stone: '石肤',
  swift: '疾行',
}

export const COMBAT_BUFF_EFFECT: Record<CombatBuffKey, string> = {
  sharp: '近战伤害 +1',
  stone: '受到伤害 -1',
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
  return [Math.max(1, base - defense), Math.max(1, base + 2 - defense)]
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
  defense: number,
  spellPower = 0,
): [number, number] {
  const base = spell.baseDamage + natureTier * spell.tierScale + spellPower
  return [Math.max(1, base - defense), Math.max(1, base + spell.variance - defense)]
}

export type EnemyDef = {
  id: string
  name: string
  desc: string
  hp: number
  attack: number
  defense: number
  speed: number
  expValue: number
  intro: string
  attackLines: string[]
  defeatLine: string
}

export const ENEMIES: Record<string, EnemyDef> = {
  dummy: {
    id: 'dummy',
    name: '木桩',
    desc: '立在场地中央的旧木桩，表面留着深浅不一的刻痕。',
    hp: 30,
    attack: 0,
    defense: 0,
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
  corrupted_dog: {
    id: 'corrupted_dog',
    name: '被侵蚀的野狗',
    desc: '它的身体像被什么东西从里面撑开，肋骨顶破了皮，脊背弯成一个不自然的角度。',
    hp: 80,
    attack: 11,
    defense: 1,
    speed: 2.9,
    expValue: 1.5,
    intro:
      '路边的草里传来低低的喘息。\n它的身体像被什么东西从里面撑开，肋骨顶破了皮，脊背弯成一个不自然的角度。\n半边脸塌下去，露出的牙床比正常的狗长了一截。\n它还在喘气，喉咙里发出不像狗的声音。\n你只能从脖子上的旧项圈，勉强认出这原本是条狗。',
    attackLines: [
      '它用变形的肩骨撞过来。',
      '它咬住你的袖子，牙齿刮过皮肉。',
      '它喉咙里发出湿漉漉的声音，又扑了一次。',
    ],
    defeatLine: '它倒在地上，身体还在抽动。你退开两步，等它彻底不动。',
  },
  gray_wolf: {
    id: 'gray_wolf',
    name: '灰狼',
    desc: '一只瘦而结实的灰狼，压低身子，在路边慢慢逼近。',
    hp: 60,
    attack: 10,
    defense: 0,
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
}

export function spiritCost(base: number, mood: number): number {
  if (mood < 20) return base + 2
  if (mood < 60) return base + 1
  return base
}

export const REST_THRESHOLD = 20
export const REST_MINUTES = 30
export const REST_STAMINA = 5

export const SLEEP_MIN_RECOVERY_MINUTES = 240
export const SLEEP_MIN_MINUTES = 60
export const SLEEP_MAX_MINUTES = 720

export const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function weekday(day: number): number {
  return ((day % 7) + 7) % 7
}

export function formatDate(day: number): string {
  return `${calendarYearLabel(currentYear(day))} · ${formatMonthDay(day)}`
}

export function calendarYearLabel(year: number): string {
  return `第${chineseNumber(year)}年`
}

export function formatMonthDay(day: number): string {
  const dayInYear = ((day % YEAR_DAYS) + YEAR_DAYS) % YEAR_DAYS
  const month = Math.floor(dayInYear / 28) + 1
  const d = (dayInYear % 28) + 1
  return `${chineseNumber(month)}月${chineseNumber(d)}日 · ${WEEKDAYS[weekday(day)]}`
}

const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export function chineseNumber(n: number): string {
  if (n <= 10) return CN_NUM[n]
  if (n < 20) return `十${CN_NUM[n - 10]}`
  if (n < 100) {
    const tens = Math.floor(n / 10)
    const ones = n % 10
    return `${CN_NUM[tens]}十${ones === 0 ? '' : CN_NUM[ones]}`
  }
  return String(n)
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = Math.floor(minutes) % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatMoney(copper: number): string {
  const sign = copper < 0 ? '-' : ''
  const v = Math.abs(Math.floor(copper))
  const gold = Math.floor(v / 10000)
  const silver = Math.floor((v % 10000) / 100)
  const bronze = v % 100
  const parts: string[] = []
  if (gold > 0) parts.push(`${gold} 金`)
  if (silver > 0) parts.push(`${silver} 银`)
  if (bronze > 0 || parts.length === 0) parts.push(`${bronze} 铜`)
  return sign + parts.join(' ')
}

export type Location = {
  id: string
  name: string
  parent?: string
  kind: 'area' | 'venue' | 'room' | 'wild'
  childLabel?: string
  desc: string
}

export const ENTER_MINUTES = 2
export const ROOM_MINUTES = 1

export const LOCATIONS: Location[] = [
  {
    id: 'town',
    name: '中央广场',
    kind: 'area',
    childLabel: '广场',
    desc: '广场中央有一座旧喷泉，四周是店铺和往来的行人。往东是学院区，往西是孤儿院和教堂。',
  },
  {
    id: 'craftDistrict',
    name: '工坊区',
    kind: 'area',
    childLabel: '工坊',
    desc: '窄街两侧是作坊和货栈，烟囱、铜招牌和热汽挤在一起。地上有车辙和散落的木屑。',
  },
  {
    id: 'academyStreet',
    name: '学院区',
    kind: 'area',
    desc: '缓坡向上，尽头是长明学院的门楼。这一带多是抱着书的学生。',
  },
  {
    id: 'orphanStreet',
    name: '孤儿院',
    kind: 'area',
    desc: '一片安静的地方，墙根长着草，教堂的尖顶从旁边露出来，尽头是孤儿院的院门。',
  },
  {
    id: 'churchStreet',
    name: '教堂',
    kind: 'area',
    desc: '教堂在孤儿院旁边，钟声从尖顶传下来，门前石阶被扫得很干净。',
  },
  {
    id: 'academy',
    name: '长明学院',
    parent: 'academyStreet',
    kind: 'venue',
    childLabel: '学院设施',
    desc: '石墙修得整齐，藤蔓顺着墙面往上爬。门内是一片铺着石板的庭院。',
  },
  {
    id: 'lecture',
    name: '讲堂',
    parent: 'academy',
    kind: 'room',
    desc: '长桌一排排摆到窗边，空气里有粉笔和纸页的味道。',
  },
  {
    id: 'library',
    name: '藏书阁',
    parent: 'academy',
    kind: 'room',
    desc: '书架一直排到天花板，最上面几层摆着成套的厚册。这里安静得能听见翻页声。',
  },
  {
    id: 'canteen',
    name: '食堂',
    parent: 'academy',
    kind: 'room',
    desc: '食堂里飘着炖菜和面包的味道，长桌旁坐满了学生。',
  },
  {
    id: 'yard',
    name: '演武场',
    parent: 'academy',
    kind: 'room',
    desc: '地面是压实的黄土，四周立着一圈木桩。风一吹，尘土轻轻扬起来。',
  },
  {
    id: 'brewery',
    name: '炼药室',
    parent: 'academy',
    kind: 'room',
    desc: '石台上摆着研钵和几把刀，墙边立着一排药柜。角落里的小炉常年温着，空气里有苦味和炭火气。',
  },
  {
    id: 'herbGarden',
    name: '药草园',
    parent: 'academy',
    kind: 'room',
    desc: '学院东侧围出一块坡地，几畦药草按颜色分开，木牌上写着名字。',
  },
  {
    id: 'potionWorkshop',
    name: '药剂工坊',
    parent: 'craftDistrict',
    kind: 'room',
    desc: '门口挂着铜釜招牌，熟客都叫这里铜釜工坊。里面是一排排药架和冒着热气的铜锅，学徒抱着货箱进出，空气里有苦味和炭火气。',
  },
  {
    id: 'orphanage',
    name: '孤儿院正厅',
    parent: 'orphanStreet',
    kind: 'venue',
    childLabel: '房间',
    desc: '一栋旧但收拾得很干净的房子。正厅里摆着几张矮凳，墙上挂着孩子们的字。',
  },
  {
    id: 'dorm',
    name: '寝室',
    parent: 'orphanage',
    kind: 'room',
    desc: '寝室不大：一张床、一张桌子、一扇朝北的窗，床边多了一个小书柜。',
  },
  {
    id: 'orphanCanteen',
    name: '食堂',
    parent: 'orphanage',
    kind: 'room',
    desc: '长桌上摆着面包和稀粥，孩子们的声音比学院里吵得多。',
  },
  {
    id: 'backyard',
    name: '后院',
    parent: 'orphanage',
    kind: 'room',
    desc: '后院有一小块菜地，靠墙堆着柴火和旧木箱。',
  },
  {
    id: 'office',
    name: '院长室',
    parent: 'orphanage',
    kind: 'room',
    desc: '院长室很小，桌上堆着册子和没写完的信。窗台上放着一小盆薄荷。',
  },
  {
    id: 'commercial',
    name: '商业区',
    kind: 'area',
    childLabel: '店铺',
    desc: '两侧开着店铺，招牌在风里轻轻晃。人来人往，比学院那边热闹。',
  },
  {
    id: 'shop',
    name: '杂货店',
    parent: 'commercial',
    kind: 'room',
    desc: '货架上摆着药剂、绳索、纸笔和一些叫不出名字的小东西。柜台后面堆着账本。',
  },
  {
    id: 'weaponShop',
    name: '武具店',
    parent: 'commercial',
    kind: 'room',
    desc: '墙上挂着几把剑，柜台里放着磨刀石和皮鞘。空气里有铁锈和油的味道。',
  },
  {
    id: 'tavern',
    name: '酒馆',
    parent: 'commercial',
    kind: 'room',
    desc: '几张旧木桌，一盏吊灯，墙上钉着褪色的菜单。傍晚之后，这里才会真正热闹起来。',
  },
  {
    id: 'guild',
    name: '商会办事处',
    parent: 'commercial',
    kind: 'room',
    desc: '商会办事处里堆着账本和货单。柜台后面有人在核账，抬眼看你一下，又低下头。',
  },
  {
    id: 'bookshop',
    name: '旧书铺',
    parent: 'commercial',
    kind: 'room',
    desc: '旧书铺里堆着高低不齐的书堆，空气里有纸和灰尘的味道。柜台边摆着几本翻旧了的册子。',
  },
  {
    id: 'church',
    name: '教堂内堂',
    parent: 'churchStreet',
    kind: 'venue',
    childLabel: '教堂设施',
    desc: '门内的光线暗下来，空气里有蜡烛和旧木头的气味。',
  },
  {
    id: 'chapel',
    name: '祷告厅',
    parent: 'church',
    kind: 'room',
    desc: '长椅排成几列，彩窗把光切成一块一块。司祭塞缪尔在侧廊翻着旧册子，见习修女莉安在最后一排整理祷本。',
  },
  {
    id: 'relief',
    name: '救济院',
    parent: 'church',
    kind: 'room',
    desc: '救济院里堆着旧衣、面粉和几捆柴。玛尔塔在桌边登记名单，头也没抬。',
  },
  {
    id: 'bellTower',
    name: '钟楼',
    parent: 'church',
    kind: 'room',
    desc: '木楼梯很窄，越往上越冷。塔下有一条长凳，凳脚边放着一只旧水壶。',
  },
  {
    id: 'gate',
    name: '城门',
    kind: 'area',
    desc: '两扇厚重的木门嵌在石墙里，门洞上方刻着褪色的纹章。几名骑士守在两侧。',
  },
  {
    id: 'outside',
    name: '城外',
    kind: 'wild',
    childLabel: '城外地点',
    desc: '出了城门，风一下子大了。土路往南分岔，一边通向墓园，一边通向林子。',
  },
  {
    id: 'cemetery',
    name: '墓园',
    parent: 'outside',
    kind: 'room',
    desc: '矮石墙围着一片安静的坡地，墓碑一排排立着。守墓人坐在墙边，手里拿着一本名册。',
  },
  {
    id: 'forest',
    name: '森林',
    parent: 'outside',
    kind: 'room',
    desc: '树木很快密了起来，脚下的落叶踩上去很软。远处偶尔传来枝叶晃动的声音。',
  },
  {
    id: 'forestDeep',
    name: '森林深处',
    parent: 'forest',
    kind: 'room',
    desc: '树木更密，光被枝叶切成碎片。脚下的落叶很厚，远处偶尔有重物压过灌木的声音。',
  },
  {
    id: 'teleportRoom',
    name: '传送室',
    parent: 'academy',
    kind: 'room',
    desc: '房间中央嵌着一圈深色金属纹路，边缘刻着细小的符文。空气里有轻微的嗡鸣。',
  },
  {
    id: 'westTown',
    name: '边区小镇',
    kind: 'area',
    childLabel: '小镇地点',
    desc: '边区小镇比银月城小得多。街上的店铺大多关着门，风里带着湿土和柴烟的味道。',
  },
  {
    id: 'westGate',
    name: '镇口',
    parent: 'westTown',
    kind: 'room',
    desc: '石砌的传送阵嵌在镇口，边缘长着青苔。旁边是骑士团的哨所，木拒马横在路中间。再往外就是通往田野的土路。',
  },
  {
    id: 'westInn',
    name: '支援队驻地',
    parent: 'westTown',
    kind: 'room',
    desc: '学院支援队在镇边搭了几排木架和粗布棚。棚下是一排通铺，旁边堆着木箱、药箱和记录册。',
  },
  {
    id: 'westChapel',
    name: '旧礼拜堂',
    parent: 'westTown',
    kind: 'room',
    desc: '礼拜堂的门被木条封住，门上贴着教会与审判庭的封条。石阶上落着灰，门缝里看不到光。',
  },
  {
    id: 'westEdge',
    name: '镇外路口',
    parent: 'westTown',
    kind: 'room',
    desc: '一排木拒马横在路口，后面插着一块木牌，上面写着“未净化”。再往前，路就隐进灰蒙蒙的田野里。',
  },
  {
    id: 'westMarket',
    name: '边镇集市',
    parent: 'westTown',
    kind: 'room',
    desc: '集市口的木棚歪着，几个摊位空了很久。地上有烂菜叶和被风吹来的灰。',
  },
  {
    id: 'westTower',
    name: '旧哨塔',
    parent: 'westTown',
    kind: 'room',
    desc: '哨塔的木梯断了一级，塔顶的棚布被风吹开。上面很久没人上去了。',
  },
  {
    id: 'oldStation',
    name: '旧驿站',
    kind: 'room',
    desc: '官道旁的旧驿站，屋檐下挂着褪色的招牌。院子里停着两辆空货车，井台边堆着草料。',
  },
  {
    id: 'forestDepot',
    name: '林间货栈',
    kind: 'room',
    desc: '林子边缘的木棚，四周堆着货箱。风从树梢上压下来，带着湿木头的味道。',
  },
  {
    id: 'eastFarm',
    name: '东边农庄',
    kind: 'room',
    desc: '城东的田地，几间低矮的农舍。井台边放着水桶，远处有人弯着腰。',
  },
]

export function getLocation(id: string): Location {
  return LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0]
}

// ---------- 时段描述 / 天气 ----------

/** 0 = 早晨 06:00–11:00，1 = 白天 11:00–18:00，2 = 夜晚 18:00–06:00 */
export function timePeriod(minutes: number): 0 | 1 | 2 {
  if (minutes >= 6 * 60 && minutes < 11 * 60) return 0
  if (minutes >= 11 * 60 && minutes < 18 * 60) return 1
  return 2
}

const DESC_BY_TIME: Record<string, [string, string, string]> = {
  town: [
    '石板路被晨雾打湿，店铺刚开门。往东是长明学院的坡道，往西是孤儿院。',
    '石板路被日头晒得发白，挑担的人从街口穿过。往东是学院区的坡道，往西是孤儿院。',
    '街灯一盏盏亮着，石板路上只剩零星脚步。东边的学院沉在暗处，西边的孤儿院早没了人声。',
  ],
  academy: [
    '石墙修得整齐，藤蔓上还挂着露水。门内是一片铺着石板的庭院。',
    '石墙晒得温热，藤蔓的影子落在门廊上。庭院里有学生抱着书匆匆走过。',
    '石墙沉进夜色，只有门房还亮着一盏灯。庭院里安静得能听见风穿过藤蔓。',
  ],
  lecture: [
    '长桌一排排摆到窗边，晨光落在桌面上，空气里有粉笔和纸页的味道。',
    '日光把长桌照得发亮，空气里有粉笔和纸页的味道。',
    '讲堂空着，长桌隐在暗处，粉笔灰在月光里浮着。',
  ],
  library: [
    '书架一直排到天花板，晨光从高窗斜进来，照亮最上层成套的厚册。',
    '书架一直排到天花板，这里安静得能听见翻页声。',
    '藏书阁只点着几盏灯，书架的影子压得很低，偶尔传来纸张翻动的声音。',
  ],
  canteen: [
    '食堂刚开火，面包的热气混着粥香，长桌旁坐着三三两两的学生。',
    '食堂里飘着炖菜和面包的味道，长桌旁坐满了学生。',
    '食堂已经收拾干净，只剩灶台还留着一点余温，长桌在暗处泛着光。',
  ],
  yard: [
    '地面是压实的黄土，晨雾还没散，木桩上挂着露水。',
    '地面是压实的黄土，四周立着一圈木桩。风一吹，尘土轻轻扬起来。',
    '演武场空了下来，木桩在月光下投出细长的影子。',
  ],
  orphanage: [
    '一栋旧但收拾得很干净的房子，门口菜地还湿着，屋里传来碗碟的声响。',
    '一栋旧但收拾得很干净的房子，门口有一小片菜地，晒着几件洗好的衣服。',
    '房子里的灯一盏盏灭了，只剩厨房还亮着一点光。',
  ],
  dorm: [
    '晨光从窗缝里漏进来，落在床边的小书柜上。',
    '寝室不大：一张床、一张桌子、一扇朝北的窗。小书柜安静地立在床边。',
    '屋里很暗，只有桌上的小灯亮着。书柜在床边，隐在阴影里。',
  ],
  orphanCanteen: [
    '长桌上摆着面包和稀粥，孩子们揉着眼睛排队。',
    '长桌上摆着面包和稀粥，孩子们的声音比学院里吵得多。',
    '长桌已经擦干净，只剩面包篮放在角落，屋里安静下来。',
  ],
  backyard: [
    '后院有一小块菜地，叶子上还挂着露水。靠墙堆着柴火和旧木箱。',
    '后院有一小块菜地，靠墙堆着柴火和旧木箱。',
    '后院浸在夜色里，菜地只剩模糊的轮廓，柴堆边有虫声。',
  ],
  office: [
    '院长室很小，晨光落在桌上堆着的册子和没写完的信上。窗台那盆薄荷很精神。',
    '院长室很小，桌上堆着册子和没写完的信。窗台上放着一小盆薄荷。',
    '院长室只点着一盏灯，桌上摊着没写完的信，薄荷的影子落在纸边。',
  ],
  commercial: [
    '店铺刚卸下门板，招牌在风里轻轻晃。街上人还不多。',
    '街道两侧开着店铺，招牌在风里轻轻晃。人来人往，比学院那边热闹。',
    '店铺陆续上了门板，只剩酒馆的灯还亮着，街上偶尔有人匆匆走过。',
  ],
  shop: [
    '货架上摆着药剂、绳索、纸笔和一些叫不出名字的小东西。店主正在清点早上的货。',
    '货架上摆着药剂、绳索、纸笔和一些叫不出名字的小东西。柜台后面堆着账本。',
    '店里点着灯，货架上的瓶罐映出微光。柜台后面堆着账本。',
  ],
  weaponShop: [
    '墙上挂着几把剑，店里刚生起火，空气里有铁锈和油的味道。',
    '墙上挂着几把剑，柜台里放着磨刀石和皮鞘。空气里有铁锈和油的味道。',
    '武具店还亮着灯，磨刀的声音一下一下，墙上的剑映着火光。',
  ],
  tavern: [
    '酒馆还没开门，门窗关着，只有门缝里透出一点昨天的酒气。',
    '酒馆里空荡荡的，桌椅倒扣着，老板在擦柜台。',
    '几张旧木桌，一盏吊灯，墙上钉着褪色的菜单。这里真正热闹起来了。',
  ],
  church: [
    '钟声从高处落下来。石阶被扫得很干净，神像脚下放着几束刚采的花。',
    '钟声从高处落下来。石阶被扫得很干净，母神的神像立在门口，肩头落着一点灰。',
    '教堂的窗还亮着暖光，钟楼沉在夜色里，石阶上只有风声。',
  ],
  chapel: [
    '长椅排成几列，晨光透过彩窗落在地上。司祭塞缪尔在侧廊翻着旧册子。',
    '长椅排成几列，彩窗把光切成一块一块。司祭塞缪尔在侧廊翻着旧册子，见习修女莉安在最后一排整理祷本。',
    '祷告厅只点着几支蜡烛，彩窗暗了下来。见习修女莉安在最后一排整理祷本。',
  ],
  relief: [
    '救济院里堆着旧衣、面粉和几捆柴。玛尔塔在桌边登记名单，头也没抬。',
    '救济院里有人在低声说话。玛尔塔把一叠名单压在桌角，起身去了里间。',
    '救济院熄了大半的灯，旧衣和面粉堆在墙角，玛尔塔还在核对最后几行名单。',
  ],
  bellTower: [
    '木楼梯很窄，越往上越冷。塔下有一条空长凳，守钟人奥托正坐在那里晒太阳。',
    '木楼梯很窄，越往上越冷。塔下有一条长凳，奥托的水壶还放在凳脚边。',
    '木楼梯很窄，越往上越冷。塔下空无一人，风从钟口灌下来，带着低低的鸣响。',
  ],
  gate: [
    '城门刚开，骑士换过岗，门洞里还残着夜里的凉气。',
    '两扇厚重的木门嵌在石墙里，门洞上方刻着褪色的纹章。几名骑士守在两侧。',
    '城门已经关了，门洞里只点着一盏灯，骑士的影子落在石墙上。',
  ],
  outside: [
    '出了城门，风里带着草味。土路往南分岔，一边通向墓园，一边通向林子。',
    '出了城门，风一下子大了。土路往南分岔，一边通向墓园，一边通向林子。',
    '城外黑得很快，土路只剩下模糊的轮廓，风从林子里吹过来。',
  ],
  cemetery: [
    '矮石墙围着一片安静的坡地，草叶上挂着露水。守墓人站在新翻的土边，手里拿着一本名册。',
    '矮石墙围着一片安静的坡地，墓碑一排排立着。守墓人坐在墙边，慢慢翻着名册。',
    '墓园沉进夜色，墓碑只剩一排排浅影。守墓人还守在门口，没有点灯。',
  ],
  forest: [
    '树木很快密了起来，晨光被叶子切成碎片，脚下全是湿的落叶。',
    '树木很快密了起来，脚下的落叶踩上去很软。远处偶尔传来枝叶晃动的声音。',
    '林子里几乎看不见路，枝叶在风里发出细碎的响声。',
  ],
  forestDeep: [
    '树木更密，晨光只剩下几道细线。落叶很厚，踩下去几乎没有声音。',
    '光被枝叶切成碎片，远处的灌木偶尔动一下，又安静下来。',
    '林子深处几乎全黑，只有脚下的落叶反着一点微光。',
  ],
  westTown: [
    '雾还没散，街上只有几个裹着旧衣的人。多数店铺的门板还关着。',
    '风从空地那边吹过来，卷起一点灰。街上看不到几个开门做生意的人。',
    '镇上很早就没了人声，只有哨所和驻地的灯还亮着。',
  ],
  westGate: [
    '守卫在换岗，名册摊在桌上。',
    '偶尔有运货的车进出，木拒马挪开又合上。',
    '哨所的灯亮着，木拒马没有挪开。',
  ],
  westInn: [
    '有人在棚下生火，锅里冒着热气。',
    '棚里多半空着，人都出去了。',
    '通铺上有人翻身，棚外有值守的人。',
  ],
  westChapel: [
    '晨雾里，封条上的印记有些模糊。',
    '日光照在石阶上，门里仍然没有声音。',
    '礼拜堂沉在暗处，封条被风吹得轻轻响。',
  ],
  westEdge: [
    '雾贴着地面，看不清更远的地方。',
    '风从田野那边吹过来，带着土腥味。',
    '路上没有脚印，草一直长到拒马边。',
  ],
  westMarket: [
    '集市口的木棚歪着，几个摊位空了很久。地上有烂菜叶和被风吹来的灰。',
    '集市里只有两个摊子开着，卖些蔫掉的菜。风把棚布吹得一下一下响。',
    '集市收了，地上只剩几片烂菜叶。木棚在暗处歪着。',
  ],
  westTower: [
    '哨塔的木梯断了一级，塔顶的棚布被风吹开。上面很久没人上去了。',
    '塔顶的棚布被风吹得鼓起来。楼梯口的灰里没有脚印。',
    '哨塔沉在暗处，断掉的木梯只剩一个轮廓。',
  ],
}

const WEST_STAGE1_DESC: Record<string, [string, string, string]> = {
  westTown: [
    '雾还是没散，但街上有几家店铺卸下了门板。有人挑着水从街口走过。',
    '风从空地那边吹过来，卷起一点灰。集市方向有人在说话，不像之前那么空。',
    '镇上亮着几盏灯，哨所和驻地之外，集市口也有一点光。',
  ],
  westGate: [
    '守卫在换岗，西墙的缺口已经补好。墙根下堆着新搬来的石料。',
    '木拒马挪开又合上，运货的车比之前多了一点。',
    '哨所的灯亮着，街灯也亮了一盏。木拒马没有挪开。',
  ],
  westInn: [
    '有人在棚下生火，锅里冒着热气。药箱重新装满了，靠墙码着。',
    '棚里空着，人都出去了。通铺上的被褥叠得比之前整齐。',
    '通铺上有人翻身，棚外有值守的人。药箱边多了一盏小灯。',
  ],
  westChapel: [
    '晨雾里，封条上的印记有些模糊。石阶被扫干净了，边上放着一小束枯花。',
    '日光照在石阶上，门里没有声音。',
    '礼拜堂沉在暗处，封条被风吹得轻轻响。门口的灰没有积起来。',
  ],
  westEdge: [
    '雾贴着地面，拒马修好了，木牌上的字还是看不清。',
    '风从田野那边吹过来，带着土腥味。路边的草被踩出一条窄路。',
    '拒马旁边多了一盏灯，路上还是没有脚印。',
  ],
  westMarket: [
    '两三个摊位重新开张，卖热食的锅刚架上。',
    '集市里有了说话声。旧货、土豆和几捆干柴摆在摊上。',
    '摊位陆续收了，只剩一盏灯亮着。有人还在收拾。',
  ],
  westTower: [
    '木梯修好了，踩上去不再响。塔顶有人影，正往田野那边看。',
    '哨塔的门开着，里面收拾过。风从塔顶穿过去，带着远处的土味。',
    '哨塔上亮着一盏灯。值守的人裹着旧衣，靠在栏杆边。',
  ],
}

export type WestDescState = {
  stage: number
  projects: Record<string, number>
}

function wallLine(p: number): string {
  if (p >= 4) return '西墙补好了，灰浆颜色比旁边的石头新。'
  if (p >= 3) return '西墙补了一半，灰浆还没干。'
  if (p >= 1) return '西墙的缺口边缘垒起了新石头。'
  return '西墙的缺口还在掉土。'
}

function ditchLine(p: number): string {
  if (p >= 4) return '水渠通了，路面的积水退下去一层。'
  if (p >= 3) return '水渠里的水开始动了。'
  if (p >= 1) return '水渠里的淤泥清开了一段。'
  return '水渠里的水几乎不流。'
}

function lampLine(p: number): string {
  if (p >= 4) return '集市口的灯全亮了。'
  if (p >= 3) return '集市口的灯亮了两盏。'
  if (p >= 1) return '集市口有一盏灯重新亮了起来。'
  return '集市口的街灯只剩一盏还亮着。'
}

type SeasonDesc = Record<Season, [string, string, string]>

const SEASON_DESC: Record<string, SeasonDesc> = {
  town: {
    spring: [
      '晨雾还没散，店铺一块块卸下门板。',
      '街上的人多了起来，店铺门前一直有人经过。',
      '街灯亮起，晚风里带着一点泥土的气味。',
    ],
    summer: [
      '天刚亮就有些闷，店铺早早开了门。',
      '热气一直不散，街上的人走得很慢。',
      '热气到夜里才散，街上的人慢慢多起来。',
    ],
    autumn: [
      '晨风带着凉意，落叶贴着石板被扫成一堆。',
      '风把街边的旗子吹得直响。',
      '风大了，街灯下的落叶打着转。',
    ],
    winter: [
      '天还没亮透，街上的雪被踩成灰白的一层。',
      '石板路上的雪迟迟不化。',
      '街上很早就空了，只有几盏灯还亮着。',
    ],
  },
  academyStreet: {
    spring: [
      '坡道两侧的树刚抽新芽，路面上落着几片湿叶子。学院的门楼在前方。',
      '坡道上人来人往，抱着书的学生三三两两。学院门楼在前方。',
      '坡道静了下来，学院门楼的灯还亮着。',
    ],
    summer: [
      '天亮得早，坡道上已经有学生往学院走。树叶被晒得发亮。',
      '日头很烈，坡道上升起一层薄薄的热气。',
      '夜风从坡道上吹下来，带着一点白天的余温。',
    ],
    autumn: [
      '坡道上落了一层黄叶，踩上去有细小的响声。',
      '风把落叶卷到路边，学生裹紧了外衣。',
      '坡道很暗，只有学院门楼亮着灯。',
    ],
    winter: [
      '坡道上的雪被踩出几道脚印，学院门楼在雾里。',
      '雪还在下，坡道上的人走得很快。',
      '坡道结了薄冰，学院门楼的灯照出一小片光。',
    ],
  },
  orphanStreet: {
    spring: [
      '巷子很窄，墙根冒出新草。孤儿院的屋顶在前头。',
      '有人把洗好的衣服晾在窗外，水滴在石板上。',
      '街口只剩几盏灯，孤儿院的窗还亮着。',
    ],
    summer: [
      '巷子里很安静，墙上的藤蔓被晒得发亮。',
      '孩子们在街口跑来跑去，笑声传得很远。',
      '墙根下闷热，有人坐在门口乘凉。',
    ],
    autumn: [
      '落叶堆在墙根，风一吹就散开。',
      '巷子里有股柴火味，谁家在准备晚饭。',
      '风穿过巷子，把晾衣绳吹得轻轻响。',
    ],
    winter: [
      '巷子里的雪没扫干净，脚印一直通到孤儿院门口。',
      '屋檐下挂着冰棱，孩子们缩着脖子跑过。',
      '巷子里很黑，只有孤儿院门口的灯亮着。',
    ],
  },
  churchStreet: {
    spring: [
      '钟声从街尽头传过来，石阶上还留着晨露。',
      '教堂的尖顶立在屋顶之间，街上的人放慢了脚步。',
      '教堂的窗透出暖光，钟楼沉在夜色里。',
    ],
    summer: [
      '早祷的钟声刚落，街上还很安静。',
      '石墙被晒得发烫，教堂门口有人歇脚。',
      '夜风从教堂那边吹来，带着蜡烛的味道。',
    ],
    autumn: [
      '风把落叶扫到教堂石阶下。',
      '钟声在秋日的街上传得很远。',
      '教堂的窗还亮着，街上的灯一盏盏熄灭。',
    ],
    winter: [
      '石阶上结了霜，教堂门口有人在扫雪。',
      '雪落在教堂的尖顶上，钟声听起来很远。',
      '教堂的灯在雪夜里亮着，街上几乎没有人。',
    ],
  },
  academy: {
    spring: [
      '藤蔓上新叶挂着露水，庭院里已经有学生走动。',
      '几个学生抱着书从门廊下穿过，鞋底在石板上敲得很响。',
      '门房亮着一盏灯，藤蔓的影子落在墙上。',
    ],
    summer: [
      '天亮得很早，庭院里已经有人走动。',
      '庭院里的热气压着不动。',
      '热气还没退，藤蔓间偶尔有一点风。',
    ],
    autumn: [
      '藤叶开始泛黄，晨风把几片叶子吹到石板上。',
      '藤叶落了大半，庭院里只剩几串脚印。',
      '风穿过藤蔓，庭院里只剩门房那点光。',
    ],
    winter: [
      '藤蔓上挂着薄霜，庭院里几乎没有人。',
      '墙头的雪迟迟不化。',
      '门房的灯在雪里显得很小，庭院静得没有声音。',
    ],
  },
  orphanage: {
    spring: [
      '厨房的烟囱冒起白烟，门口菜地还湿着。',
      '孩子们在门口追来追去，鞋底带起一层土。',
      '屋里的灯一盏盏灭了，只剩厨房还亮着。',
    ],
    summer: [
      '天亮得很早，厨房里已经在熬粥。',
      '孩子们躲在屋里不肯出来。',
      '屋里闷，几个孩子坐在门槛上乘凉。',
    ],
    autumn: [
      '院子里堆着新收的柴，厨房的烟升得很直。',
      '孩子们在门口捡落叶。',
      '窗里透出昏黄的灯，屋里传来碗碟的声响。',
    ],
    winter: [
      '烟囱的白气在冷空气里散得很慢。',
      '门口只有几行脚印。',
      '窗上结了霜，屋里的灯显得格外暖。',
    ],
  },
  commercial: {
    spring: [
      '店铺陆续卸下门板，街边多了卖花和旧货的小摊。',
      '卖热食的摊子前围了几个人，摊主一边收钱一边吆喝。',
      '店铺一间间上门板，只剩酒馆还亮着。',
    ],
    summer: [
      '天刚亮，摊子就支起来了，遮棚下一片闷热。',
      '最热的时候，街上的人少了一半。',
      '热气散得慢，酒馆门口坐着不少人。',
    ],
    autumn: [
      '晨风把落叶扫到摊子边，店主正一块块擦招牌。',
      '街上的摊子一直摆到路口。',
      '风把遮棚吹得直响，店铺早早上了门板。',
    ],
    winter: [
      '街上还积着雪，只有几家店卸了门板。',
      '摊主一边跺脚一边守着摊子。',
      '店铺早早上板，只有酒馆的灯还亮着。',
    ],
  },
  church: {
    spring: [
      '石阶刚扫过，神像脚下放着几束新采的花。',
      '进出教堂的人一直没断。',
      '教堂的窗透出暖光，钟楼沉在夜色里。',
    ],
    summer: [
      '天亮得早，石阶上已经有来祷告的人。',
      '教堂的门开着，门口有人在石阶上歇脚。',
      '窗里的光一直亮到很晚。',
    ],
    autumn: [
      '晨风把落叶吹到石阶边，有人正拿着扫帚。',
      '石阶扫得干净，风从钟楼下来，石缝里透着凉。',
      '教堂的窗透出一点暖光，风从钟楼下来。',
    ],
    winter: [
      '石阶上的雪被扫到两边，神像肩头落着一层白。',
      '门口的雪化得很慢。',
      '窗里的暖光落在雪上，钟楼只剩一个黑轮廓。',
    ],
  },
  yard: {
    spring: [
      '黄土上还留着夜里的湿气，木桩上挂着露水。',
      '场地上练习的人多了起来。',
      '演武场空了，木桩在暗处排成一列。',
    ],
    summer: [
      '天刚亮就热起来，场地上已经有人在练。',
      '最热的时候，场地上没什么人。',
      '热气从地面往上返，场地上没什么人。',
    ],
    autumn: [
      '晨风卷起一层薄土，木桩上落着几片叶子。',
      '场地上练习的人还没散。',
      '风穿过木桩，场地上只剩一点脚步声。',
    ],
    winter: [
      '木桩上结着薄冰，场地上只有几行脚印。',
      '演武场空着，只有风吹过木桩的声音。',
      '雪把场地盖住，木桩只剩一排黑影子。',
    ],
  },
  backyard: {
    spring: [
      '菜地还湿着，墙边的柴堆散着潮气。',
      '菜地里的土干得快。',
      '院子里很静，柴堆边有虫声。',
    ],
    summer: [
      '天亮得早，菜地里的水已经浇过一遍。',
      '菜叶被晒得发软，土面裂开细缝。',
      '热气闷在墙里，虫声很响。',
    ],
    autumn: [
      '晨风很凉，土垄上的土结着一层硬壳。',
      '风把枯叶吹到墙根。',
      '风穿过院子，柴堆发出轻响。',
    ],
    winter: [
      '菜畦上盖着一层雪，柴堆顶也白了。',
      '木箱边的雪化了一小片。',
      '后院冷得没什么声音，只有风从墙头过。',
    ],
  },
  bellTower: {
    spring: [
      '天光从钟口斜进来，木楼梯上有一层薄灰。',
      '钟楼里比外面凉，风从钟口穿过。',
      '夜里暗下来，铜钟只剩一个轮廓。',
    ],
    summer: [
      '天一亮钟楼里就闷，木楼梯很快热起来。',
      '最热的时候，钟楼里热得待不住。',
      '热气散得慢，钟口偶尔灌进一点风。',
    ],
    autumn: [
      '晨风从钟口灌进来，带着落叶的味道。',
      '风从钟口灌下来。',
      '风从钟口下来，钟楼里比外面更凉。',
    ],
    winter: [
      '钟口积着薄雪，木楼梯上结了一层霜。',
      '冰凌在檐下滴水。',
      '风从钟口灌进来，带着细碎的冰粒。',
    ],
  },
  gate: {
    spring: [
      '城门刚开，骑士换过岗，门洞里还残着夜里的凉气。',
      '一辆运菜的车卡在门洞里，后面的人排了一小串。',
      '城门关了，门洞里只点着一盏灯。',
    ],
    summer: [
      '天刚亮，门洞里就已经闷热。',
      '门洞里的脚步声一直没停。',
      '城门关得晚，门洞里还留着白天的热气。',
    ],
    autumn: [
      '晨风从门洞穿过，石墙上落着几片叶子。',
      '风把尘土吹进门洞。',
      '城门关上，风从门缝里钻进来。',
    ],
    winter: [
      '门洞里的雪被踩实，骑士的盔甲上落着一层霜。',
      '石墙上的雪一直没化。',
      '城门关得很早，门洞里的灯照着雪。',
    ],
  },
  outside: {
    spring: [
      '土路还湿着，草叶上挂着露水。',
      '远处有一队货车慢慢过来，车夫走在马旁边。',
      '城外黑得很快，远处林子只剩轮廓。',
    ],
    summer: [
      '天亮得很早，土路上已经有了脚印。',
      '热气贴着地面往上返。',
      '热气到夜里才散，虫声很密。',
    ],
    autumn: [
      '晨风很凉，草坡上的草伏在地上。',
      '风把落叶吹上土路。',
      '风大了，远处林子发出连续的响声。',
    ],
    winter: [
      '土路上的雪被冻硬，车辙很深。',
      '远处的林子白成一片。',
      '城外很静，只有风从林子里出来。',
    ],
  },
  cemetery: {
    spring: [
      '草叶上挂着露水，守墓人正沿着石墙走。',
      '墓园里有人来扫墓。',
      '墓园沉进夜色，守墓人屋里的灯还亮着。',
    ],
    summer: [
      '天亮得很早，草长得很高。',
      '石墙里闷得没有风。',
      '热气散得慢，草丛里一直有虫声。',
    ],
    autumn: [
      '晨风很凉，守墓人正沿着石墙走。',
      '墓园里没有风，草叶一动不动。',
      '风穿过草丛，墓碑一排排暗下去。',
    ],
    winter: [
      '坡地上盖着雪，只有碑顶露在外面。',
      '坡地上的雪很厚。',
      '守墓人屋里的灯在雪里亮着，坡地很静。',
    ],
  },
  forest: {
    spring: [
      '地上湿漉漉的，枝叶间还挂着水。',
      '林子里比外面凉，枝叶间一直有响动。',
      '林子里很暗，偶尔有枝叶晃动的声音。',
    ],
    summer: [
      '天亮得很早，林子里已经开始闷。',
      '林子里闷得没有风。',
      '热气闷在树间，虫声一夜没停。',
    ],
    autumn: [
      '落叶铺满小路，晨风一吹就有叶子飘下来。',
      '落叶不断往下掉。',
      '林子里很暗，风穿过枝头。',
    ],
    winter: [
      '林子里很静，只有踩雪的声音。',
      '树干上的雪偶尔往下掉。',
      '林子里很黑，雪把声音都吸走了。',
    ],
  },
}

export function locationDesc(
  loc: Location,
  minutes: number,
  day: number,
  west?: WestDescState,
): string {
  if (west && west.stage >= 1) {
    const stage1 = WEST_STAGE1_DESC[loc.id]
    if (stage1) return stage1[timePeriod(minutes)]
  }
  const seasonal = SEASON_DESC[loc.id]
  if (seasonal) return seasonal[seasonOf(day)][timePeriod(minutes)]
  const table = DESC_BY_TIME[loc.id]
  let text = table ? table[timePeriod(minutes)] : loc.desc
  if (west && west.stage === 0) {
    if (loc.id === 'westGate') {
      text = `${text} ${wallLine(west.projects.wall ?? 0)} ${ditchLine(west.projects.ditch ?? 0)}`
    } else if (loc.id === 'westMarket') {
      text = `${text} ${lampLine(west.projects.lamp ?? 0)}`
    }
  }
  return text
}

const OUTDOOR = new Set([
  'town',
  'academyStreet',
  'orphanStreet',
  'churchStreet',
  'craftDistrict',
  'academy',
  'orphanage',
  'commercial',
  'church',
  'yard',
  'herbGarden',
  'backyard',
  'bellTower',
  'gate',
  'outside',
  'cemetery',
  'forest',
  'forestDeep',
])

export type WeatherKind = 'sunny' | 'cloudy' | 'overcast' | 'rain' | 'snow'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const WEATHER_LABEL: Record<WeatherKind, string> = {
  sunny: '晴',
  cloudy: '多云',
  overcast: '阴',
  rain: '雨',
  snow: '雪',
}

/** 两个月一季：1–2 春、3–4 夏、5–6 秋、7–8 冬，之后循环 */
export function seasonOf(day: number): Season {
  const month = Math.floor(day / 28) + 1
  const index = Math.floor((((month - 1) % 8) + 8) % 8 / 2)
  return (['spring', 'summer', 'autumn', 'winter'] as const)[index]
}

function hash01(n: number): number {
  let x = (n | 0) + 0x6d2b79f5
  x = Math.imul(x ^ (x >>> 15), x | 1)
  x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296
}

const WEATHER_TABLE: Record<Season, Array<[WeatherKind, number]>> = {
  spring: [
    ['sunny', 0.4],
    ['cloudy', 0.3],
    ['overcast', 0.15],
    ['rain', 0.15],
  ],
  summer: [
    ['sunny', 0.45],
    ['cloudy', 0.25],
    ['overcast', 0.1],
    ['rain', 0.2],
  ],
  autumn: [
    ['sunny', 0.35],
    ['cloudy', 0.3],
    ['overcast', 0.2],
    ['rain', 0.15],
  ],
  winter: [
    ['sunny', 0.35],
    ['cloudy', 0.3],
    ['overcast', 0.2],
    ['snow', 0.15],
  ],
}

export function weatherOf(day: number): WeatherKind {
  const table = WEATHER_TABLE[seasonOf(day)]
  let r = hash01(day * 9973 + 17)
  for (const [kind, weight] of table) {
    if (r < weight) return kind
    r -= weight
  }
  return table[table.length - 1][0]
}

type SeasonSceneTable = Record<Season, Partial<Record<WeatherKind, string>>>

const WEATHER_SCENES: Record<string, SeasonSceneTable> = {
  town: {
    spring: {
      sunny: '阳光落在湿石板路上，街角的花摊刚支起来。',
      cloudy: '云影慢慢扫过街道，招牌的光一时亮一时暗。',
      overcast: '天色发灰，石板缝里还留着昨夜的潮气。',
      rain: '细雨打在石板上，行人贴着屋檐走。',
    },
    summer: {
      sunny: '日头把石板晒得发白，挑担的人沿着墙根走。',
      cloudy: '云影从街面上移过去，热气却没散。',
      overcast: '天色压低，街上的叫卖声也闷了下来。',
      rain: '骤雨砸在石板上，水顺着街口往下淌。',
    },
    autumn: {
      sunny: '阳光落在干爽的石板上，风把落叶卷到墙角。',
      cloudy: '云影掠过屋顶，街边的旗子被风吹得直响。',
      overcast: '天色阴沉，风里带着凉意。',
      rain: '冷雨打湿石板，行人把领口拢紧。',
    },
    winter: {
      sunny: '阳光照在薄雪上，石板路亮得刺眼。',
      cloudy: '云层压着城墙，街上的雪被踩成灰白的泥。',
      overcast: '天色灰沉，呼出的白气散得很慢。',
      snow: '雪落在街心，脚印很快又被盖住。',
    },
  },
  academyStreet: {
    spring: {
      sunny: '阳光落在坡道上，新叶的影子一晃一晃。',
      cloudy: '云从学院门楼上空滑过，坡道忽明忽暗。',
      overcast: '天色发灰，坡道上的学生低着头快步走。',
      rain: '细雨打在坡道上，石板有些滑。',
    },
    summer: {
      sunny: '日头直晒坡道，路面泛着白光。',
      cloudy: '云挡住太阳，坡道上还是闷。',
      overcast: '天色沉下来，远处有闷雷。',
      rain: '骤雨砸在坡道上，学生挤在门楼下躲雨。',
    },
    autumn: {
      sunny: '阳光穿过黄叶，坡道上落着碎金一样的光。',
      cloudy: '风卷着落叶从坡道上滚下去。',
      overcast: '天阴得早，学院门楼陷进灰里。',
      rain: '冷雨打湿了坡道，落叶贴在石板上。',
    },
    winter: {
      sunny: '雪后的坡道很亮，脚印一直通到学院门口。',
      cloudy: '云压着学院门楼，雪还没化。',
      overcast: '天光很淡，坡道上几乎没有人。',
      snow: '雪落在坡道上，很快盖住了脚印。',
    },
  },
  orphanStreet: {
    spring: {
      sunny: '阳光落在巷子的墙上，新草从石缝里钻出来。',
      cloudy: '云影扫过街口，晾着的衣服轻轻晃。',
      overcast: '天色发灰，沿街的门都关着。',
      rain: '细雨落在巷子里，墙根积起小水洼。',
    },
    summer: {
      sunny: '巷子被晒得发白，孩子们躲在屋檐下。',
      cloudy: '云把太阳挡住，墙根下还是闷得很。',
      overcast: '天色暗下来，远处的雷声滚过。',
      rain: '雨点砸在屋檐上，孩子们笑着往屋里跑。',
    },
    autumn: {
      sunny: '阳光照在落叶上，巷子一片暖黄。',
      cloudy: '风把落叶吹到墙根，堆成一小堆。',
      overcast: '巷子阴沉沉的，谁家的烟囱冒着烟。',
      rain: '冷雨打湿了石阶，柴火味更重了。',
    },
    winter: {
      sunny: '雪光映着屋檐，冰棱挂了一排。',
      cloudy: '云压得很低，巷子里的雪没有化。',
      overcast: '天光很淡，街口的脚印很少。',
      snow: '雪落在巷子里，孤儿院的窗透出暖光。',
    },
  },
  churchStreet: {
    spring: {
      sunny: '阳光落在教堂的石墙上，钟楼的影子拉得很长。',
      cloudy: '云从钟楼后面飘过，街上的光暗了一下。',
      overcast: '天色发灰，教堂的尖顶压着一层薄雾。',
      rain: '细雨落在石阶上，教堂门口有人在收伞。',
    },
    summer: {
      sunny: '钟楼被晒得发白，石阶烫脚。',
      cloudy: '云挡住太阳，教堂外安静下来。',
      overcast: '天色闷沉，钟声传得很远。',
      rain: '骤雨落在教堂门前，石阶很快湿透。',
    },
    autumn: {
      sunny: '阳光穿过落叶，教堂的窗映出暖光。',
      cloudy: '风把落叶扫到石阶下，钟声照常响。',
      overcast: '天阴得早，教堂的窗更亮了。',
      rain: '冷雨打在教堂门前，石阶一片湿滑。',
    },
    winter: {
      sunny: '雪落在教堂的尖顶上，钟楼在阳光里发亮。',
      cloudy: '云压着钟楼，街上的雪没有脚印。',
      overcast: '天光很淡，教堂的窗透出一点暖色。',
      snow: '雪落在石阶上，教堂门口的灯一直亮着。',
    },
  },
  academy: {
    spring: {
      sunny: '阳光把庭院的石板晒暖，藤蔓的新叶亮得发绿。',
      cloudy: '云影从石墙上滑过，庭院里忽明忽暗。',
      overcast: '天色发灰，石墙上的藤蔓一动不动。',
      rain: '雨顺着屋檐往下淌，庭院里积起一片片水洼。',
    },
    summer: {
      sunny: '日头晒得石板发烫，藤蔓的影子缩成一团。',
      cloudy: '云把光挡了一半，庭院里仍旧闷热。',
      overcast: '天色压得低，蝉声却更响了。',
      rain: '骤雨打在藤叶上，水从门廊前漫过去。',
    },
    autumn: {
      sunny: '阳光落在泛黄的藤叶上，庭院的影子拉得很长。',
      cloudy: '云影掠过石墙，风卷着落叶扫过石板。',
      overcast: '天色阴沉，藤蔓上只剩零星几片叶子。',
      rain: '冷雨敲着屋檐，落叶贴在湿石板上。',
    },
    winter: {
      sunny: '阳光照在墙头的积雪上，庭院亮得发白。',
      cloudy: '云层压着石墙，藤蔓上挂着薄冰。',
      overcast: '天光很淡，庭院里冷得没什么人停留。',
      snow: '雪压在藤蔓和墙头上，庭院里只剩踩雪的声音。',
    },
  },
  orphanage: {
    spring: {
      sunny: '阳光落在门口菜地的新叶上，土还带着湿气。',
      cloudy: '云影掠过屋顶，菜地里的光一晃一晃。',
      overcast: '天色发灰，晾在门口的衣裳被风吹得贴在绳上。',
      rain: '细雨敲着屋檐，菜地很快积起浅水。',
    },
    summer: {
      sunny: '日头晒着菜地，叶子有些发蔫，屋里开着窗。',
      cloudy: '云影盖过院子，热气从地面往上返。',
      overcast: '天色闷沉，孩子们都坐在门口不肯动。',
      rain: '雨点砸在菜叶和屋顶上，院子里一片湿响。',
    },
    autumn: {
      sunny: '阳光落在收过一茬的菜地上，墙边堆着干柴。',
      cloudy: '云影掠过屋顶，风把晾着的衣服吹得鼓起来。',
      overcast: '天色阴沉，门口的菜地只剩枯黄的叶。',
      rain: '冷雨打湿了门槛，屋里飘出煮粥的热气。',
    },
    winter: {
      sunny: '阳光照在薄雪上，烟囱冒出的白气很直。',
      cloudy: '云层压着屋顶，门口的雪被踩出几行脚印。',
      overcast: '天色灰沉，窗里透出一点昏黄的灯。',
      snow: '雪盖住菜地，门口只剩几行新踩的脚印。',
    },
  },
  commercial: {
    spring: {
      sunny: '阳光把招牌照得发亮，街边多了卖花的小摊。',
      cloudy: '云影在店铺之间移动，货摊上的光一闪一闪。',
      overcast: '天色发灰，街上的叫卖声低了下去。',
      rain: '细雨打在遮棚上，人挤在屋檐下等雨停。',
    },
    summer: {
      sunny: '日头晒得招牌发白，街上的人走得很快。',
      cloudy: '云影掠过街面，热气仍旧从石板上冒出来。',
      overcast: '天色闷沉，店铺把门帘放了下来。',
      rain: '骤雨砸在遮棚上，水顺着街边往下冲。',
    },
    autumn: {
      sunny: '阳光落在干爽的街面上，风把落叶吹到摊子边。',
      cloudy: '云影扫过招牌，摊主忙着压住被风吹起的布。',
      overcast: '天色阴沉，几个摊主已经在收布棚。',
      rain: '冷雨打湿招牌，行人把货摊往屋里挪。',
    },
    winter: {
      sunny: '阳光照在薄雪上，招牌上的冰凌慢慢滴水。',
      cloudy: '云层压着屋顶，街上的雪被踩得发黑。',
      overcast: '天色灰沉，店铺早早上了门板。',
      snow: '雪落进街道，车辙和脚印很快混成一片。',
    },
  },
  church: {
    spring: {
      sunny: '阳光落在神像的肩头，石阶缝里冒出细草。',
      cloudy: '云影从钟楼上滑过，石阶的光暗了下来。',
      overcast: '天色发灰，教堂的窗亮着，光落在湿石阶上。',
      rain: '细雨顺着檐角往下滴，石阶被打得发亮。',
    },
    summer: {
      sunny: '日头照着石阶，神像脚下摆着新采的花。',
      cloudy: '云影掠过钟楼，石阶上的热气散得慢。',
      overcast: '天色闷沉，教堂的门开着，里面传出很轻的诵声。',
      rain: '骤雨打在石阶上，水从台阶一级级往下流。',
    },
    autumn: {
      sunny: '阳光落在神像上，风把落叶吹到石阶边。',
      cloudy: '云影从钟楼上滑过去，石阶上的光暗下来。',
      overcast: '天色阴沉，教堂的窗透出一点暖光。',
      rain: '冷雨打湿石阶，落叶贴在台阶上。',
    },
    winter: {
      sunny: '阳光照在神像的积雪上，石阶亮得发白。',
      cloudy: '云层压着钟楼，石阶上的雪被踩成薄冰。',
      overcast: '天光很淡，教堂的窗透出的暖色格外明显。',
      snow: '雪落在神像的发间和肩头，石阶上很静。',
    },
  },
  yard: {
    spring: {
      sunny: '太阳晒暖了黄土，木桩上的露水很快干了。',
      cloudy: '云影在演武场上移过去，风里带着湿气。',
      overcast: '天色发灰，黄土的颜色也暗了下来。',
      rain: '细雨打在黄土上，地面慢慢变得泥泞。',
    },
    summer: {
      sunny: '日头把黄土晒得发烫，木桩的影子缩得很短。',
      cloudy: '云影掠过场地，热气仍旧从地面往上冒。',
      overcast: '天色闷沉，风里一点凉意也没有。',
      rain: '骤雨砸在黄土上，水洼很快连成一片。',
    },
    autumn: {
      sunny: '阳光落在干硬的黄土上，木桩的影子拉得很长。',
      cloudy: '云影扫过场地，风卷起一层薄土。',
      overcast: '天色阴沉，木桩上的旧刻痕被雨水泡得发黑。',
      rain: '冷雨打湿黄土，脚印陷得很深。',
    },
    winter: {
      sunny: '阳光照在薄雪上，黄土从雪里露出几块。',
      cloudy: '云层压着场地，木桩上结了一层薄冰。',
      overcast: '天光很淡，演武场空得没什么声音。',
      snow: '雪落在木桩和地面上，演武场没有一点声音。',
    },
  },
  backyard: {
    spring: {
      sunny: '阳光落在菜地的新叶上，墙边的柴堆还带着潮气。',
      cloudy: '云影盖过院子，菜叶上的光暗了下来。',
      overcast: '天色发灰，菜叶和柴堆都褪成了暗色。',
      rain: '细雨打在菜叶和柴堆上，院子里一片湿冷。',
    },
    summer: {
      sunny: '日头晒着菜地，叶子有些打蔫，旧木箱被晒得发烫。',
      cloudy: '云影掠过院子，热气仍旧闷在墙里。',
      overcast: '天色闷沉，柴堆边的虫声没停过。',
      rain: '雨点砸在菜叶和木箱上，地上很快积起水。',
    },
    autumn: {
      sunny: '阳光落在收过菜的土垄上，风把枯叶吹到墙根。',
      cloudy: '云影扫过院子，柴堆边的光忽明忽暗。',
      overcast: '天色阴沉，柴堆占了半边院子，剩下的路只够一个人走。',
      rain: '冷雨打湿柴堆，土垄里积起一洼洼水。',
    },
    winter: {
      sunny: '阳光照在薄雪上，柴堆顶上的雪开始化。',
      cloudy: '云层压着院墙，木箱上结了一层白霜。',
      overcast: '天光很淡，后院冷得没什么声音。',
      snow: '雪压在柴堆和菜畦上，后院安静下来。',
    },
  },
  bellTower: {
    spring: {
      sunny: '阳光从钟口斜照进来，灰尘在光柱里浮动。',
      cloudy: '云影掠过钟楼，钟口的光忽明忽暗。',
      overcast: '天色发灰，钟楼里灌着风，木楼梯凉得透手。',
      rain: '细雨从钟口飘进来，木楼梯被打湿了一片。',
    },
    summer: {
      sunny: '阳光直直落进钟口，楼梯被晒得发烫。',
      cloudy: '云影盖住钟楼，风从钟口灌进来还是热的。',
      overcast: '天色闷沉，钟楼里闷得透不过气。',
      rain: '骤雨从钟口泼进来，木楼梯上一片水声。',
    },
    autumn: {
      sunny: '阳光斜着照进钟口，风把落叶卷上楼梯。',
      cloudy: '云影掠过钟楼，钟口的铜色暗了下来。',
      overcast: '天色阴沉，钟楼里比外面更凉。',
      rain: '冷雨飘进钟口，楼梯上一片湿滑。',
    },
    winter: {
      sunny: '阳光照在钟口的积雪上，冰凌在檐下滴水。',
      cloudy: '云层压着钟楼，铜钟上结了一层白霜。',
      overcast: '天光很淡，风从钟口灌进来，带着细碎的冰粒。',
      snow: '雪从钟口落进来，在楼梯上积了薄薄一层。',
    },
  },
  gate: {
    spring: {
      sunny: '阳光照在门洞的石墙上，骑士的盔甲晃得发亮。',
      cloudy: '云影从城墙上移过去，门洞里的光暗了一半。',
      overcast: '天色发灰，城门上的纹章几乎看不清了。',
      rain: '细雨顺着城墙往下淌，门洞前积了一片水。',
    },
    summer: {
      sunny: '日头晒着门洞，石墙热得烫手。',
      cloudy: '云影掠过城墙，门洞里仍旧闷热。',
      overcast: '天色闷沉，守门的骑士也躲进了阴影里。',
      rain: '骤雨打在门洞上，水顺着墙根往外流。',
    },
    autumn: {
      sunny: '阳光落在干爽的石墙上，风把落叶吹进门洞。',
      cloudy: '云影扫过城墙，门洞里的光晃了晃。',
      overcast: '天色阴沉，城门上的纹章被雨水冲得发白。',
      rain: '冷雨打湿石阶，骑士把披风拢紧。',
    },
    winter: {
      sunny: '阳光照在门洞的薄雪上，石墙亮得发白。',
      cloudy: '云层压着城墙，骑士的肩甲上落了一层霜。',
      overcast: '天光很淡，门洞里呼出的白气散得很慢。',
      snow: '雪落在门洞和骑士的肩甲上，脚印一直延伸到城里。',
    },
  },
  outside: {
    spring: {
      sunny: '阳光落在土路两旁的新草上，风里带着土腥味。',
      cloudy: '云影从坡地上滑过去，土路一时亮一时暗。',
      overcast: '天色发灰，远处的林子压着一层青灰色的雾。',
      rain: '细雨把土路打得发软，草叶上全是水。',
    },
    summer: {
      sunny: '日头晒得土路发白，草叶被晒得卷起来。',
      cloudy: '云影掠过坡地，风里仍旧带着热气。',
      overcast: '天色闷沉，远处的林子像压着一层雾。',
      rain: '骤雨把土路打得泥泞，水顺着坡往下流。',
    },
    autumn: {
      sunny: '阳光落在干黄的草坡上，风把落叶吹上土路。',
      cloudy: '云影扫过坡地，土路上的光忽明忽暗。',
      overcast: '天色阴沉，远处的林子只剩一道黑边。',
      rain: '冷雨打湿土路，草叶贴在泥里。',
    },
    winter: {
      sunny: '阳光照在薄雪上，土路的车辙冻得发硬。',
      cloudy: '云层压着坡地，远处的林子只剩灰白的轮廓。',
      overcast: '天光很淡，风从林子里吹出来，带着寒气。',
      snow: '雪盖住了土路，车辙和脚印都变得很浅。',
    },
  },
  cemetery: {
    spring: {
      sunny: '阳光落在新返青的草地上，墓碑的影子很清楚。',
      cloudy: '云影慢慢掠过坡地，草叶上的光暗了下来。',
      overcast: '天色发灰，墓园里没有风，连草都不动。',
      rain: '细雨打在石碑上，草里积起一片片水洼。',
    },
    summer: {
      sunny: '日头晒着坡地，草长得很高，蝉声从墙外传进来。',
      cloudy: '云影掠过墓园，热气闷在石墙里。',
      overcast: '天色闷沉，风穿过草丛，带着潮气。',
      rain: '雨点打在石碑上，水顺着碑面往下流。',
    },
    autumn: {
      sunny: '阳光落在枯黄的草地上，风把落叶扫到碑脚。',
      cloudy: '云影扫过坡地，墓碑一排排暗下去。',
      overcast: '天色阴沉，枯叶贴着石碑堆在墙根。',
      rain: '冷雨打湿墓碑，草里积起浑浊的水洼。',
    },
    winter: {
      sunny: '阳光照在碑顶的积雪上，坡地亮得发白。',
      cloudy: '云层压着墓园，石碑上的雪冻成了薄冰。',
      overcast: '天光很淡，守墓人屋里的灯亮着。',
      snow: '雪盖住了坡地，只剩碑顶一排排露在外面。',
    },
  },
  forest: {
    spring: {
      sunny: '阳光从新叶间漏下来，地上落着一小块一小块的光。',
      cloudy: '云影从枝叶间滑过，林子里忽明忽暗。',
      overcast: '天色发灰，树干的颜色深得像刚淋过雨。',
      rain: '细雨打在叶子上，整片林子都是细密的响声。',
    },
    summer: {
      sunny: '阳光从密叶里漏下来，落在地上碎成一小块一小块。',
      cloudy: '云把光挡了大半，林子里闷得没有风。',
      overcast: '天色闷沉，蝉声压得很低。',
      rain: '骤雨打在叶子上，水顺着树干往下淌。',
    },
    autumn: {
      sunny: '阳光落在泛黄的叶子上，风一吹就有叶子飘下来。',
      cloudy: '云影扫过林梢，地上的光斑晃了晃。',
      overcast: '天色阴沉，枯叶铺满了整条小路。',
      rain: '冷雨打落了不少叶子，林子里一片湿响。',
    },
    winter: {
      sunny: '雪压着枝头，阳光一照，树干上的雪簌簌往下掉。',
      cloudy: '云层压着林梢，枝头的雪化了一半，露出深色的树皮。',
      overcast: '天光很淡，林子里静得只剩风声。',
      snow: '雪落在枝头和小路上，偶尔有一小团从高处掉下来。',
    },
  },
}

export function weatherScene(locationId: string, day: number): string | null {
  if (!OUTDOOR.has(locationId)) return null
  const season = seasonOf(day)
  const weather = weatherOf(day)
  return WEATHER_SCENES[locationId]?.[season]?.[weather] ?? null
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

export const SLEEP_LOCATIONS: string[] = ['dorm', 'westInn']
export const TELEPORT_YEAR = 2

export const MEDITATION_MINUTES = 60
export const MEDITATION_WILL_GAIN = 2
export const MEDITATION_LOCATIONS: string[] = ['dorm', 'chapel']

const MEDITATION_SCENES: Record<string, [string, string, string]> = {
  dorm: [
    '晨光从窗帘缝里漏进来。你坐在床边，听着院子里渐渐有了声响。',
    '寝室里没有人，走廊偶尔传来脚步。你靠着床沿，把呼吸放慢。',
    '屋里只亮着一盏小灯。你盘腿坐在床上，让一天的杂音慢慢沉下去。',
  ],
  chapel: [
    '祷告厅里还留着昨夜的凉意。你坐在最后一排，听晨光一点点落进来。',
    '彩窗把光切成几块，落在地面上。你闭上眼，让呼吸跟着光斑移动。',
    '烛火轻轻晃着，厅里只剩下你和影子。你坐了很久，什么也没有想。',
  ],
}

export function meditationScene(location: string, minutes: number): string {
  const table = MEDITATION_SCENES[location]
  return table ? table[timePeriod(minutes)] : '你安静地坐了一会儿。'
}

export const ACADEMY_MEAL_FEE = 2
export const SUMMER_RITE_DAY = 104
export const WINTER_RITE_DAY = 216
export const RITE_PHASE_MINUTES = 30

export type RiteNight = 'summer' | 'winter' | null
export type RitePhase = { key: string; name: string; start: number; end: number; night: RiteNight }

const RITE_PHASES = [
  { key: 'gather', name: '入席与静默', start: 9 * 60, end: 9 * 60 + 40 },
  { key: 'recite', name: '诵读与短歌', start: 9 * 60 + 40, end: 10 * 60 + 20 },
  { key: 'lights', name: '灯火与散场', start: 10 * 60 + 20, end: 11 * 60 },
]

const SUMMER_RITE_PHASES = [
  { key: 'gather', name: '入席与静默', start: 19 * 60, end: 20 * 60 },
  { key: 'recite', name: '诵读与短歌', start: 20 * 60, end: 21 * 60 },
  { key: 'lights', name: '灯火与散场', start: 21 * 60, end: 22 * 60 },
]

const WINTER_RITE_PHASES = [
  { key: 'gather', name: '入席与静默', start: 18 * 60, end: 19 * 60 },
  { key: 'recite', name: '诵读与短歌', start: 19 * 60, end: 20 * 60 },
  { key: 'lights', name: '灯火与散场', start: 20 * 60, end: 21 * 60 },
]

export function isSummer(day: number): boolean {
  return semesterState(day) === 'summer'
}

export function isVacation(day: number): boolean {
  const state = semesterState(day)
  return state === 'summer' || state === 'winter'
}

export function ritePhaseAt(day: number, minutes: number): RitePhase | null {
  if (day === SUMMER_RITE_DAY) {
    const phase = SUMMER_RITE_PHASES.find((p) => minutes >= p.start && minutes < p.end)
    if (phase) return { ...phase, night: 'summer' }
  }
  if (day === WINTER_RITE_DAY) {
    const phase = WINTER_RITE_PHASES.find((p) => minutes >= p.start && minutes < p.end)
    if (phase) return { ...phase, night: 'winter' }
  }
  if (weekday(day) === 6) {
    const phase = RITE_PHASES.find((p) => minutes >= p.start && minutes < p.end)
    if (phase) return { ...phase, night: null }
  }
  return null
}

export type RitePrep = { minutes: number; night: RiteNight }

export function ritePrepAt(day: number, minutes: number): RitePrep | null {
  if (day === SUMMER_RITE_DAY && minutes >= 17 * 60 && minutes < 19 * 60) {
    return { minutes: 120, night: 'summer' }
  }
  if (day === WINTER_RITE_DAY && minutes >= 16 * 60 && minutes < 18 * 60) {
    return { minutes: 120, night: 'winter' }
  }
  if (weekday(day) === 6 && minutes >= 8 * 60 && minutes < 9 * 60) {
    return { minutes: 60, night: null }
  }
  return null
}

export function ritePhaseDone(
  rite: { day: number; phases: string[] } | undefined,
  day: number,
  key: string,
): boolean {
  if (!rite || rite.day !== day) return false
  return rite.phases.includes(key)
}

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


export type Exit = { to: string; minutes: number }

const AREA_LINKS: Record<string, Exit[]> = {
  town: [
    { to: 'orphanStreet', minutes: 5 },
    { to: 'academyStreet', minutes: 5 },
    { to: 'commercial', minutes: 5 },
    { to: 'churchStreet', minutes: 5 },
    { to: 'craftDistrict', minutes: 5 },
  ],
  craftDistrict: [{ to: 'town', minutes: 5 }],
  orphanStreet: [
    { to: 'town', minutes: 5 },
    { to: 'churchStreet', minutes: 5 },
  ],
  academyStreet: [{ to: 'town', minutes: 5 }],
  churchStreet: [
    { to: 'town', minutes: 5 },
    { to: 'orphanStreet', minutes: 5 },
  ],
  commercial: [
    { to: 'town', minutes: 5 },
    { to: 'gate', minutes: 5 },
  ],
  gate: [
    { to: 'commercial', minutes: 5 },
    { to: 'outside', minutes: 5 },
  ],
  westTown: [],
}

export const CITY_AREA_IDS = [
  'craftDistrict',
  'churchStreet',
  'orphanStreet',
  'town',
  'academyStreet',
  'commercial',
  'gate',
]

export function isCityArea(id: string): boolean {
  return CITY_AREA_IDS.includes(id)
}

export function areaNeighbors(id: string): string[] {
  return (AREA_LINKS[id] ?? []).map((e) => e.to)
}

const LEGACY_EXITS: Record<string, Exit[]> = {
  outside: [
    { to: 'gate', minutes: 5 },
    { to: 'cemetery', minutes: 5 },
    { to: 'forest', minutes: 5 },
  ],
  cemetery: [
    { to: 'outside', minutes: 5 },
    { to: 'forest', minutes: 5 },
  ],
  forest: [
    { to: 'outside', minutes: 5 },
    { to: 'cemetery', minutes: 5 },
  ],
}

export function exitsOf(id: string): Exit[] {
  const loc = getLocation(id)
  if (loc.kind === 'area') {
    const links = AREA_LINKS[id] ?? []
    const children = LOCATIONS.filter((l) => l.parent === id).map((l) => ({
      to: l.id,
      minutes: ENTER_MINUTES,
    }))
    return [...links, ...children]
  }
  if (loc.kind === 'venue') {
    const back = loc.parent ? [{ to: loc.parent, minutes: ENTER_MINUTES }] : []
    const children = LOCATIONS.filter((l) => l.parent === id).map((l) => ({
      to: l.id,
      minutes: ROOM_MINUTES,
    }))
    return [...back, ...children]
  }
  if (loc.kind === 'room') {
    if (LEGACY_EXITS[id]) return LEGACY_EXITS[id]
    return loc.parent ? [{ to: loc.parent, minutes: ROOM_MINUTES }] : []
  }
  return LEGACY_EXITS[id] ?? []
}

function shortestPath(from: string, to: string): { minutes: number; path: string[] } | null {
  if (from === to) return { minutes: 0, path: [] }
  const dist = new Map<string, number>([[from, 0]])
  const prev = new Map<string, string>()
  const visited = new Set<string>()
  while (true) {
    let current: string | null = null
    let best = Infinity
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d
        current = id
      }
    }
    if (current === null) break
    visited.add(current)
    if (current === to) break
    for (const exit of exitsOf(current)) {
      const next = best + exit.minutes
      if (next < (dist.get(exit.to) ?? Infinity)) {
        dist.set(exit.to, next)
        prev.set(exit.to, current)
      }
    }
  }
  const total = dist.get(to)
  if (total === undefined) return null
  const path: string[] = []
  let cursor: string | undefined = to
  while (cursor !== undefined && cursor !== from) {
    path.unshift(cursor)
    cursor = prev.get(cursor)
  }
  return { minutes: total, path }
}

export function travelCost(from: string, to: string): number {
  return shortestPath(from, to)?.minutes ?? 15
}

export function routeBetween(from: string, to: string): string[] {
  return shortestPath(from, to)?.path ?? [to]
}

export const MEAL_WINDOWS: Array<[number, number, string]> = [
  [6 * 60, 9 * 60, '早餐'],
  [11 * 60, 13 * 60, '午餐'],
  [17 * 60 + 30, 20 * 60, '晚餐'],
]

export function currentMeal(minutes: number): string | null {
  for (const [start, end, name] of MEAL_WINDOWS) {
    if (minutes >= start && minutes < end) return name
  }
  return null
}

export type MealKey = 'breakfast' | 'lunch' | 'dinner'

export function mealKeyFor(meal: string): MealKey | null {
  if (meal === '早餐') return 'breakfast'
  if (meal === '午餐') return 'lunch'
  if (meal === '晚餐') return 'dinner'
  return null
}

export type DrinkDef = {
  id: string
  name: string
  price: number
  minutes: number
  desc: string
  effect: { mood?: number; spirit?: number; stamina?: number }
}

export const DRINKS: DrinkDef[] = [
  {
    id: 'ale',
    name: '麦酒',
    price: 2,
    minutes: 15,
    desc: '酒馆最普通的麦酒，味道偏苦。',
    effect: { mood: 3 },
  },
  {
    id: 'fruit_wine',
    name: '果酒',
    price: 3,
    minutes: 15,
    desc: '带一点甜味的低度果酒。',
    effect: { mood: 2, spirit: 1 },
  },
  {
    id: 'honey_water',
    name: '蜂蜜水',
    price: 2,
    minutes: 10,
    desc: '温水化开的蜂蜜，甜而不腻。',
    effect: { stamina: 2, mood: 1 },
  },
  {
    id: 'hot_tea',
    name: '热茶',
    price: 1,
    minutes: 10,
    desc: '一壶泡得有些浓的热茶。',
    effect: { spirit: 1, mood: 1 },
  },
]

export const TAVERN_OPEN_START = 17 * 60
export const TAVERN_OPEN_END = 4 * 60
export const TAVERN_DRINK_END = 3 * 60 + 45
export const TAVERN_WORK_START = 18 * 60
export const TAVERN_WORK_END = 2 * 60
export const TAVERN_TALK_START = 18 * 60
export const TAVERN_TALK_END = 3 * 60 + 30

export function isTimeWindow(minutes: number, start: number, end: number): boolean {
  if (start < end) return minutes >= start && minutes < end
  return minutes >= start || minutes < end
}

export type TavernListenScene = {
  text: string
  knowledge: boolean
}

export const TAVERN_LISTEN_SCENES: TavernListenScene[] = [
  {
    text: '酒馆里人声嘈杂。你端着杯子，在靠窗的位置坐下。\n隔壁桌的商人正压低声音抱怨城门口的商队。\n“又晚了三天。说是坏天气，谁知道呢。”',
    knowledge: true,
  },
  {
    text: '角落里的佣兵把剑靠在墙边，说话声音压得很低。\n“商业区后面的巷子最近不太平。那帮人专挑落单的下手。”\n你听了一会儿，没有插话。',
    knowledge: true,
  },
  {
    text: '吧台边坐着一个风尘仆仆的旅人，正跟格蕾塔打听路。\n“学院后山晚上有光，不像普通的灯火。”\n格蕾塔没有接话，只把杯子往他面前推了推。',
    knowledge: true,
  },
  {
    text: '几个常客围在炉边，话题从收成绕到了学院。\n“今年的税又涨了。学院那帮人倒是不用愁。”\n“你小点声。”',
    knowledge: false,
  },
  {
    text: '两个修女模样的客人坐在最里面，声音很轻。\n“钟楼的事，别在外面说。”\n你只听见这一句，她们就换了话题。',
    knowledge: false,
  },
  {
    text: '两个客人为了炉边最暖的位置争了几句。\n“我昨天就坐这儿。”\n“昨天是昨天。”\n最后谁也没动。',
    knowledge: false,
  },
  {
    text: '两个人在门口讨论明天的天气。\n“看这风，明天多半要下雨。”\n“下雨也得开门。”',
    knowledge: false,
  },
]

export const RELIEF_OPEN_START = 6 * 60
export const RELIEF_OPEN_END = 20 * 60
export const RELIEF_TIDY_MINUTES = 30
export const RELIEF_TIDY_STAMINA = 2
export const RELIEF_TIDY_MOOD = 1
export const RELIEF_CARE_MINUTES = 60
export const RELIEF_CARE_STAMINA = 3
export const RELIEF_CARE_MOOD = 2
export const RELIEF_TREAT_MINUTES = 30
export const RELIEF_TREAT_COST = 5
export const RELIEF_TREAT_HP = 20
export const RELIEF_VOLUNTEER_START = 8 * 60
export const RELIEF_VOLUNTEER_END = 18 * 60
export const RELIEF_VOLUNTEER_MINUTES = 120
export const RELIEF_VOLUNTEER_PAY = 8
export const RELIEF_VOLUNTEER_STAMINA = 8
export const RELIEF_VOLUNTEER_MOOD = 1
export const BELL_TOWER_OPEN_START = 8 * 60
export const BELL_TOWER_OPEN_END = 18 * 60
export const BELL_TOWER_MINUTES = 30
export const BELL_TOWER_STAMINA = 2
export const BELL_TOWER_MOOD = 1

export function reliefHasPatients(day: number): boolean {
  const n = Math.imul(day + 1, 2654435761) >>> 0
  return n % 100 < 40
}

export const RELIEF_PATIENT_SCENES = [
  '你替床上的孩子换了一次湿布。他烧得脸发红，迷迷糊糊地问今天是不是还在下雨。\n你陪他坐了一会儿，直到玛尔塔来接手。',
  '木匠的腿上缠着旧绷带，正抱怨自己耽误了活。你帮他重新固定了一下，听他把话说完。\n他最后叹了口气，说至少今天不用爬梯子。',
  '老人咳得很厉害，你扶他坐起来，给他喂了半杯温水。\n他缓过来以后，朝你点了点头，没有说话。',
]

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

export const YEAR_DAYS = 224
export const SEMESTER_DAYS = 84
export const HOLIDAY_DAYS = 28
export const MAX_YEAR = 2

export type SemesterState = 'semester1' | 'summer' | 'semester2' | 'winter' | 'after'

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

const YEAR_LABEL: Record<number, string> = {
  1: '第一学年',
  2: '第二学年',
  3: '第三学年',
}

export function currentYear(day: number): number {
  return Math.floor(day / YEAR_DAYS) + 1
}

export function dayInYear(day: number): number {
  return day % YEAR_DAYS
}

export function ageOf(day: number): number {
  return 14 + Math.floor(day / YEAR_DAYS)
}

export function semesterState(day: number): SemesterState {
  if (currentYear(day) > MAX_YEAR) return 'after'
  const d = dayInYear(day)
  if (d < SEMESTER_DAYS) return 'semester1'
  if (d < SEMESTER_DAYS + HOLIDAY_DAYS) return 'summer'
  if (d < SEMESTER_DAYS * 2 + HOLIDAY_DAYS) return 'semester2'
  return 'winter'
}

export function yearLabel(year: number): string {
  return YEAR_LABEL[year] ?? `第${year}学年`
}

export function semesterLabel(day: number): string {
  const state = semesterState(day)
  if (state === 'after') return '第三学年尚未开放'
  const term =
    state === 'semester1'
      ? '第一学期'
      : state === 'summer'
        ? '暑假'
        : state === 'semester2'
          ? '第二学期'
          : '寒假'
  const year = currentYear(day)
  return year === 1 ? term : `${yearLabel(year)} · ${term}`
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

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function absoluteMinutes(day: number, minutes: number): number {
  return day * 1440 + minutes
}

export function nextRentTotal(day: number, minutes: number): number {
  const t = absoluteMinutes(day, minutes)
  const weekStart = Math.floor(t / 10080) * 10080
  let b = weekStart + 6 * 1440 + 22 * 60
  if (b <= t) b += 10080
  return b
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

export function daysUntil(total: number, day: number, minutes: number): number {
  return Math.max(0, Math.floor((total - absoluteMinutes(day, minutes)) / 1440))
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

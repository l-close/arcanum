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
  { key: 'feet', label: '鞋' },
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
  armor?: number
  resist?: number
  speedPct?: number
  melee?: number
  engravingSlots?: number
  effect?: {
    stamina?: number
    mana?: number
    hp?: number
    combatBuff?: CombatBuffKey
    /** 解除的中毒层数。 */
    poisonCure?: number
    /** 获得的再生层数。 */
    regen?: number
  }
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
  hunter_sword: {
    id: 'hunter_sword',
    name: '猎人短剑',
    type: 'equipment',
    quality: 'uncommon',
    price: 45,
    slot: 'mainHand',
    medium: false,
    weapon: 'sword',
    power: 5,
    speedPct: 5,
    desc: '护林人用的短剑，刃短而窄，出手快。砍不深，但能抢在野兽前面。',
  },
  knight_sword: {
    id: 'knight_sword',
    name: '骑士长剑',
    type: 'equipment',
    quality: 'rare',
    price: 80,
    slot: 'mainHand',
    medium: false,
    weapon: 'sword',
    power: 8,
    speedPct: -5,
    desc: '骑士团淘汰下来的制式长剑，剑身沉，重心靠前。挥起来慢，落在身上很重。',
  },
  leather_armor: {
    id: 'leather_armor',
    name: '皮甲',
    type: 'equipment',
    quality: 'common',
    price: 30,
    slot: 'armor',
    medium: false,
    armor: 1,
    desc: '硝过的硬皮缝成的护甲，肩头加了一层衬。能挡住擦伤，挡不住重击。',
  },
  travel_cloak: {
    id: 'travel_cloak',
    name: '旅人斗篷',
    type: 'equipment',
    quality: 'common',
    price: 35,
    slot: 'armor',
    medium: false,
    resist: 1,
    desc: '厚布斗篷，内衬缝着几片写过字的旧符纸。穿上不显眼，却让人安心一点。',
  },
  studded_leather: {
    id: 'studded_leather',
    name: '镶钉皮甲',
    type: 'equipment',
    quality: 'rare',
    price: 70,
    slot: 'armor',
    medium: false,
    armor: 2,
    desc: '皮甲上铆了一排铁钉，肩口用野猪牙磨成的扣子扣住。沉，但挡得住。',
  },
  apprentice_charm: {
    id: 'apprentice_charm',
    name: '学徒护符',
    type: 'equipment',
    quality: 'uncommon',
    price: 40,
    slot: 'accessory',
    medium: false,
    spellPower: 1,
    desc: '一小块刻着符文的铜片，用细绳系着。握着它念咒，魔力聚得更紧。',
  },
  old_prayer_charm: {
    id: 'old_prayer_charm',
    name: '旧祈祷符',
    type: 'equipment',
    quality: 'common',
    price: 25,
    slot: 'accessory',
    medium: false,
    resist: 1,
    desc: '教会发剩下的旧祈祷符，边缘磨得发白。挡不住刀，挡得住一些别的东西。',
  },
  tusk_necklace: {
    id: 'tusk_necklace',
    name: '兽牙项链',
    type: 'equipment',
    quality: 'uncommon',
    price: 40,
    slot: 'accessory',
    medium: false,
    melee: 1,
    desc: '一根野猪牙串在皮绳上。低头时牙尖会碰到锁骨，提醒你出手要狠。',
  },
  light_boots: {
    id: 'light_boots',
    name: '轻靴',
    type: 'equipment',
    quality: 'common',
    price: 28,
    slot: 'feet',
    medium: false,
    speedPct: 5,
    desc: '薄底软靴，鞋帮里垫了一层史莱姆凝胶。走起来没什么声音。',
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
    desc: '皮肤会短暂发紧，像裹了一层薄壳。24 小时内受到的物理伤害 -1，仍受保底限制。同种药剂不可叠加。',
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
  antidote: {
    id: 'antidote',
    name: '解毒药',
    type: 'consumable',
    quality: 'rare',
    price: 10,
    medium: false,
    desc: '苦得发涩的药水。解除 1 层中毒，只能在战斗中使用。',
    effect: { poisonCure: 1 },
  },
  regen_potion: {
    id: 'regen_potion',
    name: '再生药水',
    type: 'consumable',
    quality: 'rare',
    price: 26,
    medium: false,
    desc: '喝下去后伤口会慢慢收拢。获得 3 层再生，最多 5 层，只能在战斗中使用。',
    effect: { regen: 3 },
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
  wolf_fang: {
    id: 'wolf_fang',
    name: '狼牙',
    type: 'material',
    quality: 'rare',
    price: 25,
    medium: false,
    desc: '灰狼首领的獠牙，牙根发黑，边缘有一道旧裂。商会按悬赏凭证收。',
  },
  boar_king_tusk: {
    id: 'boar_king_tusk',
    name: '王牙',
    type: 'material',
    quality: 'rare',
    price: 40,
    medium: false,
    desc: '野猪王的獠牙，比普通野猪牙粗一圈，背面结着厚痂。商会按悬赏凭证收。',
  },
  venom_fang: {
    id: 'venom_fang',
    name: '毒牙',
    type: 'material',
    quality: 'uncommon',
    price: 8,
    medium: false,
    desc: '毒蛇的细牙，牙根发暗。暂时只是材料，以后也许有用。',
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
  hundred_crafts: {
    id: 'hundred_crafts',
    name: '百工拾遗',
    type: 'book',
    quality: 'uncommon',
    price: 45,
    medium: false,
    desc: '一本记着城里各行手艺的册子。打铁、炼药、刻符、种药，每样都留了几页。',
  },
  frontier_notes: {
    id: 'frontier_notes',
    name: '边地行记',
    type: 'book',
    quality: 'rare',
    price: 80,
    medium: false,
    desc: '一个旅人沿边墙走访时写的笔记。纸页上沾着泥和风沙，字迹很稳。',
  },
  star_primer: {
    id: 'star_primer',
    name: '星图入门',
    type: 'book',
    quality: 'uncommon',
    price: 0,
    medium: false,
    desc: '一本教人认星的薄册子。星图是手绘的，线画得很细。',
  },
  hearth_tales: {
    id: 'hearth_tales',
    name: '炉边杂谈',
    type: 'book',
    quality: 'common',
    price: 15,
    medium: false,
    desc: '酒馆里传抄的闲话集。字迹潦草，故事都不长。',
  },
  old_letters: {
    id: 'old_letters',
    name: '旧信集',
    type: 'book',
    quality: 'common',
    price: 25,
    medium: false,
    desc: '一叠没有寄出的旧信。字迹深浅不一，纸角发脆。',
  },
}

export type BookCategory = 'growth' | 'spell' | 'leisure' | 'knowledge'

export const BOOK_CATEGORY_LABEL: Record<BookCategory, string> = {
  growth: '成长',
  spell: '法术',
  leisure: '休闲',
  knowledge: '知识',
}

export const BOOK_CATEGORY_ORDER: BookCategory[] = ['growth', 'spell', 'leisure', 'knowledge']

export const BOOKSHELF_SIZE = 12

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
  category: BookCategory
  desc: string
  progressPerRead: number
  repeatable: boolean
  /** 可重复书中，每轮完成是否都给完成奖励。 */
  repeatCompletion?: boolean
  spiritCost?: number
  /** 每次阅读都会结算的收益。 */
  perRead?: BookReward
  foundText?: string
  requiresFlag?: string
  requiresSkill?: { key: SkillKey; tier: number }
  requirementText?: string
  reward: BookReward
}

export const BOOKS: Record<string, BookDef> = {
  picture_book: {
    id: 'picture_book',
    name: '绘本',
    category: 'leisure',
    desc: '颜色已经有些发暗的旧绘本。翻起来很慢，但会让人安静下来。',
    progressPerRead: 25,
    repeatable: true,
    repeatCompletion: true,
    perRead: { mood: 1, text: '心情 +1' },
    reward: { mood: 3, text: '心情 +3' },
  },
  sword_manual: {
    id: 'sword_manual',
    name: '基础剑术图解',
    category: 'growth',
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
    category: 'spell',
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
    category: 'growth',
    desc: '一本记着近身格斗要点的旧札记。页边画着不少受力方向的小图。',
    progressPerRead: 20,
    repeatable: false,
    spiritCost: 1,
    reward: { flag: 'book_brawl_manual', text: '格斗攻击伤害永久 +1' },
  },
  old_city_stories: {
    id: 'old_city_stories',
    name: '旧城故事集',
    category: 'leisure',
    desc: '一本收着银月城旧街传闻和短故事的小册子。纸页发黄，读起来不费力。',
    progressPerRead: 34,
    repeatable: true,
    repeatCompletion: true,
    perRead: { mood: 1, text: '心情 +1' },
    reward: { mood: 2, text: '心情 +2' },
  },
  silver_moon_lore: {
    id: 'silver_moon_lore',
    name: '银月风土记',
    category: 'knowledge',
    desc: '一本讲银月城旧街、节令和日常规矩的杂记。字不深，读起来很慢。',
    progressPerRead: 50,
    repeatable: true,
    spiritCost: 1,
    perRead: { exp: { knowledge: 1 }, text: '学识经验 +1' },
    reward: { exp: { knowledge: 6 }, text: '学识经验 +6' },
  },
  hundred_crafts: {
    id: 'hundred_crafts',
    name: '百工拾遗',
    category: 'knowledge',
    desc: '一本记着城里各行手艺的册子。打铁、炼药、刻符、种药，每样都留了几页。',
    progressPerRead: 34,
    repeatable: true,
    spiritCost: 1,
    requiresSkill: { key: 'knowledge', tier: 1 },
    requirementText: '学识·启蒙',
    perRead: { exp: { knowledge: 2 }, text: '学识经验 +2' },
    reward: { exp: { knowledge: 12 }, text: '学识经验 +12' },
  },
  frontier_notes: {
    id: 'frontier_notes',
    name: '边地行记',
    category: 'knowledge',
    desc: '一个旅人沿边墙走访时写的笔记。纸页上沾着泥和风沙，字迹很稳。',
    progressPerRead: 25,
    repeatable: true,
    spiritCost: 2,
    requiresSkill: { key: 'knowledge', tier: 2 },
    requirementText: '学识·博闻',
    perRead: { exp: { knowledge: 3 }, text: '学识经验 +3' },
    reward: { exp: { knowledge: 20 }, text: '学识经验 +20' },
  },
  star_primer: {
    id: 'star_primer',
    name: '星图入门',
    category: 'knowledge',
    desc: '一本教人认星的薄册子。星图是手绘的，线画得很细。',
    progressPerRead: 34,
    repeatable: true,
    spiritCost: 1,
    foundText: '你在一摞旧星图下面，翻到一本教人认星的薄册子。',
    perRead: { exp: { knowledge: 1 }, text: '学识经验 +1' },
    reward: { exp: { knowledge: 6 }, text: '学识经验 +6' },
  },
  hearth_tales: {
    id: 'hearth_tales',
    name: '炉边杂谈',
    category: 'leisure',
    desc: '酒馆里传抄的闲话集。字迹潦草，故事都不长。',
    progressPerRead: 34,
    repeatable: true,
    repeatCompletion: true,
    perRead: { mood: 1, text: '心情 +1' },
    reward: { mood: 2, text: '心情 +2' },
  },
  old_letters: {
    id: 'old_letters',
    name: '旧信集',
    category: 'leisure',
    desc: '一叠没有寄出的旧信。字迹深浅不一，纸角发脆。',
    progressPerRead: 20,
    repeatable: true,
    repeatCompletion: true,
    perRead: { mood: 1, text: '心情 +1' },
    reward: { mood: 3, text: '心情 +3' },
  },
}

export const SEARCHABLE_BOOKS = ['sword_manual', 'fireball_book', 'star_primer']

import type { EquipmentSlot, SkillKey } from './types'

export const TIER_REQ = [200, 1000, 3000, 7500, 20000]

const TIER_NAMES: Record<SkillKey, string[]> = {
  physique: ['单薄', '普通', '强壮', '坚韧', '超凡'],
  knowledge: ['浅陋', '启蒙', '博闻', '通晓', '渊博'],
  will: ['薄弱', '普通', '坚定', '刚毅', '不屈'],
  brawl: ['入门', '初识', '娴熟', '精湛', '大师'],
  sword: ['入门', '初识', '娴熟', '精湛', '大师'],
  nature: ['入门', '初识', '娴熟', '精湛', '大师'],
  divine: ['入门', '初识', '娴熟', '精湛', '大师'],
}

export const SKILL_LABEL: Record<SkillKey, string> = {
  physique: '体质',
  knowledge: '学识',
  will: '意志',
  brawl: '格斗',
  sword: '剑术',
  nature: '自然系',
  divine: '神圣系',
}

export const SKILL_ORDER: SkillKey[] = [
  'physique',
  'knowledge',
  'will',
  'brawl',
  'sword',
  'nature',
  'divine',
]

export type ItemType = 'consumable' | 'equipment' | 'material'

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
  effect?: { stamina?: number; mana?: number; hp?: number }
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
    desc: '学院发放的基础施法媒介。杖击威力很低。',
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
    power: 2,
    desc: '做工更好的施法媒介。杖击比练习魔杖稍有力。',
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
    desc: '恢复 20 点魔力。',
    effect: { mana: 20 },
  },
  tonic: {
    id: 'tonic',
    name: '提神药',
    type: 'consumable',
    quality: 'rare',
    price: 10,
    medium: false,
    desc: '恢复 15 点体力。',
    effect: { stamina: 15 },
  },
  healing_potion: {
    id: 'healing_potion',
    name: '伤药',
    type: 'consumable',
    quality: 'rare',
    price: 15,
    medium: false,
    desc: '恢复 20 点生命。',
    effect: { hp: 20 },
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
}

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
}

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
): [number, number] {
  const base = 4 + tier * 2 + weaponPower(kind, mainHand)
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
}

export const SPELLS: Record<string, SpellDef> = {
  fireball: {
    id: 'fireball',
    name: '火球术',
    element: '火',
    desc: '自然系·火。把魔力压成一颗火球，砸向单个目标。',
    mana: 8,
    baseDamage: 10,
    tierScale: 3,
    variance: 3,
  },
}

export const SPELL_UNLOCK_MASTERY = 20
export const SPELL_UNLOCK_COURSE = 'y1_nature'

export function spellDamageRange(
  spell: SpellDef,
  natureTier: number,
  defense: number,
): [number, number] {
  const base = spell.baseDamage + natureTier * spell.tierScale
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
    hp: 40,
    attack: 6,
    defense: 0,
    speed: 2.2,
    expValue: 0.8,
    intro: '灌木里传来黏腻的声响。一团半透明的史莱姆慢慢从草里滑出来。',
    attackLines: [
      '史莱姆弹了一下，黏在你小腿上。',
      '史莱姆压过来，带着一股湿冷的气味。',
      '史莱姆的身体晃了晃，溅出几滴黏液。',
    ],
    defeatLine: '史莱姆塌成一摊，慢慢渗进落叶底下。',
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
  const month = Math.floor(day / 28) + 1
  const d = (day % 28) + 1
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
  kind: 'zone' | 'district' | 'room' | 'gate'
  childLabel?: string
  desc: string
}

export const LOCATIONS: Location[] = [
  {
    id: 'town',
    name: '银月城',
    kind: 'zone',
    childLabel: '可访问区域',
    desc: '石板路被晨雾打湿，店铺刚开门。往东是长明学院的坡道，往西是孤儿院所在的小街。',
  },
  {
    id: 'academy',
    name: '长明学院',
    parent: 'town',
    kind: 'district',
    childLabel: '学院设施',
    desc: '石墙修得整齐，藤蔓顺着墙面往上爬。门内是一片铺着石板的庭院。',
  },
  {
    id: 'lecture',
    name: '讲堂',
    parent: 'academy',
    kind: 'room',
    desc: '长桌一排排摆到窗边，空气里有粉笔和旧纸的味道。',
  },
  {
    id: 'library',
    name: '藏书阁',
    parent: 'academy',
    kind: 'room',
    desc: '书架一直排到天花板，最上面几层落着灰。这里安静得能听见翻页声。',
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
    id: 'orphanage',
    name: '孤儿院',
    parent: 'town',
    kind: 'district',
    childLabel: '房间',
    desc: '一栋旧但收拾得很干净的房子，门口有一小片菜地。',
  },
  {
    id: 'dorm',
    name: '寝室',
    parent: 'orphanage',
    kind: 'room',
    desc: '寝室不大：一张床、一张桌子、一扇朝北的窗。',
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
    parent: 'town',
    kind: 'district',
    childLabel: '店铺',
    desc: '街道两侧开着店铺，招牌在风里轻轻晃。人来人往，比学院那边热闹。',
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
    id: 'church',
    name: '教堂',
    parent: 'town',
    kind: 'district',
    childLabel: '教堂设施',
    desc: '钟声从高处落下来。石阶被扫得很干净，门口站着一尊女性形象的神像。',
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
    desc: '木楼梯很窄，越往上越冷。塔下有一条空长凳，守钟人奥托白天常坐在这里。',
  },
  {
    id: 'gate',
    name: '城门',
    parent: 'town',
    kind: 'gate',
    childLabel: '城门',
    desc: '两扇厚重的木门嵌在石墙里，门洞上方刻着褪色的纹章。几名骑士守在两侧。',
  },
  {
    id: 'outside',
    name: '城外',
    kind: 'zone',
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
    id: 'teleportRoom',
    name: '传送室',
    parent: 'academy',
    kind: 'room',
    desc: '房间中央嵌着一圈发暗的金属纹路，边缘刻着细小的符文。空气里有轻微的嗡鸣。',
  },
  {
    id: 'westTown',
    name: '边区小镇',
    kind: 'zone',
    childLabel: '小镇地点',
    desc: '一座比银月城小得多的镇子，屋顶压得很低，风里带着湿土和柴烟的味道。',
  },
  {
    id: 'westGate',
    name: '镇口',
    parent: 'westTown',
    kind: 'room',
    desc: '镇口立着一圈石砌的传送阵，边缘长着青苔。再往外就是通往田野的土路。',
  },
  {
    id: 'westInn',
    name: '旅店房间',
    parent: 'westTown',
    kind: 'room',
    desc: '房间不大，一张床、一张桌子、一扇朝南的窗。楼下偶尔传来碗碟的声响。',
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
    '石板路被晨雾打湿，店铺刚开门。往东是长明学院的坡道，往西是孤儿院所在的小街。',
    '石板路被日头晒得发白，挑担的人从街口穿过。往东是学院的坡道，往西是孤儿院所在的小街。',
    '街灯一盏盏亮着，石板路上只剩零星脚步。东边的学院沉在暗处，西边的小街早没了人声。',
  ],
  academy: [
    '石墙修得整齐，藤蔓上还挂着露水。门内是一片铺着石板的庭院。',
    '石墙晒得温热，藤蔓的影子落在门廊上。庭院里有学生抱着书匆匆走过。',
    '石墙沉进夜色，只有门房还亮着一盏灯。庭院里安静得能听见风穿过藤蔓。',
  ],
  lecture: [
    '长桌一排排摆到窗边，晨光落在桌面上，空气里有粉笔和旧纸的味道。',
    '日光把长桌照得发亮，空气里有粉笔和旧纸的味道。',
    '讲堂空着，长桌隐在暗处，粉笔灰在月光里浮着。',
  ],
  library: [
    '书架一直排到天花板，晨光从高窗斜进来，照见最上层落着的灰。',
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
    '寝室不大：一张床、一张桌子、一扇朝北的窗。晨光从窗缝里漏进来。',
    '寝室不大：一张床、一张桌子、一扇朝北的窗。窗外没什么声音。',
    '寝室里很暗，只有桌上那盏小灯还亮着。床铺整齐，窗外的风轻轻敲着玻璃。',
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
    '钟声从高处落下来。石阶被扫得很干净，门口站着一尊女性形象的神像。',
    '教堂的窗还亮着暖光，钟楼沉在夜色里，石阶上只有风声。',
  ],
  chapel: [
    '长椅排成几列，晨光透过彩窗落在地上。司祭塞缪尔在侧廊翻着旧册子。',
    '长椅排成几列，彩窗把光切成一块一块。司祭塞缪尔在侧廊翻着旧册子，见习修女莉安在最后一排整理祷本。',
    '祷告厅只点着几支蜡烛，彩窗暗了下来。见习修女莉安在最后一排整理祷本。',
  ],
  relief: [
    '救济院里堆着旧衣、面粉和几捆柴。玛尔塔在桌边登记名单，头也没抬。',
    '救济院里堆着旧衣、面粉和几捆柴。玛尔塔在桌边登记名单，头也没抬。',
    '救济院熄了大半的灯，旧衣和面粉堆在墙角，玛尔塔还在核对最后几行名单。',
  ],
  bellTower: [
    '木楼梯很窄，越往上越冷。塔下有一条空长凳，守钟人奥托正坐在那里晒太阳。',
    '木楼梯很窄，越往上越冷。塔下有一条空长凳，奥托白天常坐在这里。',
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
  academy: {
    spring: [
      '藤蔓上新叶挂着露水，庭院里已经有学生走动。',
      '庭院里人来人往。',
      '门房亮着一盏灯，藤蔓的影子落在墙上。',
    ],
    summer: [
      '天亮得很早，庭院里已经有人走动。',
      '庭院里的热气压着不动。',
      '热气还没退，藤蔓间偶尔有一点风。',
    ],
    autumn: [
      '藤叶开始泛黄，晨风把几片叶子吹到石板上。',
      '庭院显得比夏天空。',
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
      '孩子们在门口跑来跑去。',
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
      '摊主的叫卖声一直没停。',
      '店铺一间间上门板，只剩酒馆还亮着。',
    ],
    summer: [
      '天刚亮，摊子就支起来了，遮棚下一片闷热。',
      '最热的时候，街上的人少了一半。',
      '热气散得慢，酒馆门口坐着不少人。',
    ],
    autumn: [
      '晨风把落叶扫到摊子边，店主正一块块擦招牌。',
      '街上的摊子摆得比夏天满。',
      '风把遮棚吹得直响，店铺关得比平时早。',
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
      '进出教堂的人比冬天多。',
      '教堂的窗透出暖光，钟楼沉在夜色里。',
    ],
    summer: [
      '天亮得早，石阶上已经有来祷告的人。',
      '教堂的门一直开着。',
      '窗里的光一直亮到很晚。',
    ],
    autumn: [
      '晨风把落叶吹到石阶边，有人正拿着扫帚。',
      '石阶显得干净而冷。',
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
      '场地上练习的人比夏天多。',
      '风穿过木桩，场地上只剩一点脚步声。',
    ],
    winter: [
      '木桩上结着薄冰，场地上只有几行脚印。',
      '演武场空得没什么声音。',
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
      '叶子有些打蔫。',
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
      '进出城的人多了起来。',
      '城门关了，门洞里只点着一盏灯。',
    ],
    summer: [
      '天刚亮，门洞里就已经闷热。',
      '进出城的人不断。',
      '城门关得比平时晚，门洞里还留着白天的热气。',
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
      '路上偶尔有商队经过。',
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
      '墓园里比冬天多些人。',
      '墓园沉进夜色，守墓人屋里的灯还亮着。',
    ],
    summer: [
      '天亮得很早，草长得很高。',
      '石墙里闷得没有风。',
      '热气散得慢，草丛里一直有虫声。',
    ],
    autumn: [
      '晨风很凉，守墓人正沿着石墙走。',
      '墓园显得很空。',
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

export function locationDesc(loc: Location, minutes: number, day: number): string {
  const seasonal = SEASON_DESC[loc.id]
  if (seasonal) return seasonal[seasonOf(day)][timePeriod(minutes)]
  const table = DESC_BY_TIME[loc.id]
  return table ? table[timePeriod(minutes)] : loc.desc
}

const OUTDOOR = new Set([
  'town',
  'academy',
  'orphanage',
  'commercial',
  'church',
  'yard',
  'backyard',
  'bellTower',
  'gate',
  'outside',
  'cemetery',
  'forest',
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
  academy: {
    spring: {
      sunny: '阳光把庭院的石板晒暖，藤蔓的新叶亮得发绿。',
      cloudy: '云影从石墙上滑过，庭院里忽明忽暗。',
      overcast: '天色发灰，石墙上的藤蔓显得格外深。',
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
      overcast: '天色阴沉，街上的人比平时少。',
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
      overcast: '天色发灰，教堂的窗透出的光显得格外暖。',
      rain: '细雨顺着檐角往下滴，石阶被打得发亮。',
    },
    summer: {
      sunny: '日头照着石阶，神像脚下摆着新采的花。',
      cloudy: '云影掠过钟楼，石阶上的热气散得慢。',
      overcast: '天色闷沉，教堂的门一直开着。',
      rain: '骤雨打在石阶上，水从台阶一级级往下流。',
    },
    autumn: {
      sunny: '阳光落在神像上，风把落叶吹到石阶边。',
      cloudy: '云影从钟楼上滑过去，石阶显得更冷。',
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
      overcast: '天色阴沉，木桩看上去比平时更旧。',
      rain: '冷雨打湿黄土，脚印陷得很深。',
    },
    winter: {
      sunny: '阳光照在薄雪上，黄土从雪里露出几块。',
      cloudy: '云层压着场地，木桩上结了一层薄冰。',
      overcast: '天光很淡，演武场空得没什么声音。',
      snow: '雪落在木桩和地面上，演武场安静得不像平时。',
    },
  },
  backyard: {
    spring: {
      sunny: '阳光落在菜地的新叶上，墙边的柴堆还带着潮气。',
      cloudy: '云影盖过院子，菜叶上的光暗了下来。',
      overcast: '天色发灰，院子里的东西都失了颜色。',
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
      overcast: '天色阴沉，后院看上去比平时更窄。',
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
      overcast: '天色发灰，钟楼里比平时更冷。',
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
      overcast: '天色阴沉，城门上的纹章显得更旧。',
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
      overcast: '天色发灰，远处的林子看上去发青。',
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
      overcast: '天色阴沉，远处的林子看上去发黑。',
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
      overcast: '天色发灰，墓园比平时更安静。',
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
      overcast: '天色发灰，树干看上去比平时更深。',
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
      cloudy: '云层压着林梢，枝上的雪看上去发灰。',
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

const EXITS: Record<string, Exit[]> = {
  town: [
    { to: 'academy', minutes: 5 },
    { to: 'orphanage', minutes: 5 },
    { to: 'commercial', minutes: 5 },
    { to: 'church', minutes: 5 },
    { to: 'gate', minutes: 5 },
  ],
  academy: [
    { to: 'lecture', minutes: 5 },
    { to: 'library', minutes: 5 },
    { to: 'canteen', minutes: 5 },
    { to: 'yard', minutes: 5 },
    { to: 'teleportRoom', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  lecture: [
    { to: 'library', minutes: 5 },
    { to: 'canteen', minutes: 5 },
    { to: 'yard', minutes: 5 },
    { to: 'academy', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  library: [
    { to: 'lecture', minutes: 5 },
    { to: 'canteen', minutes: 5 },
    { to: 'yard', minutes: 5 },
    { to: 'academy', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  canteen: [
    { to: 'lecture', minutes: 5 },
    { to: 'library', minutes: 5 },
    { to: 'yard', minutes: 5 },
    { to: 'academy', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  yard: [
    { to: 'lecture', minutes: 5 },
    { to: 'library', minutes: 5 },
    { to: 'canteen', minutes: 5 },
    { to: 'academy', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  orphanage: [
    { to: 'dorm', minutes: 5 },
    { to: 'orphanCanteen', minutes: 5 },
    { to: 'backyard', minutes: 5 },
    { to: 'office', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  dorm: [
    { to: 'orphanCanteen', minutes: 5 },
    { to: 'backyard', minutes: 5 },
    { to: 'office', minutes: 5 },
    { to: 'orphanage', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  orphanCanteen: [
    { to: 'dorm', minutes: 5 },
    { to: 'backyard', minutes: 5 },
    { to: 'office', minutes: 5 },
    { to: 'orphanage', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  backyard: [
    { to: 'dorm', minutes: 5 },
    { to: 'orphanCanteen', minutes: 5 },
    { to: 'office', minutes: 5 },
    { to: 'orphanage', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  office: [
    { to: 'dorm', minutes: 5 },
    { to: 'orphanCanteen', minutes: 5 },
    { to: 'backyard', minutes: 5 },
    { to: 'orphanage', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  commercial: [
    { to: 'shop', minutes: 5 },
    { to: 'weaponShop', minutes: 5 },
    { to: 'tavern', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  shop: [
    { to: 'weaponShop', minutes: 5 },
    { to: 'tavern', minutes: 5 },
    { to: 'commercial', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  weaponShop: [
    { to: 'shop', minutes: 5 },
    { to: 'tavern', minutes: 5 },
    { to: 'commercial', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  tavern: [
    { to: 'shop', minutes: 5 },
    { to: 'weaponShop', minutes: 5 },
    { to: 'commercial', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  church: [
    { to: 'chapel', minutes: 5 },
    { to: 'relief', minutes: 5 },
    { to: 'bellTower', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  chapel: [
    { to: 'relief', minutes: 5 },
    { to: 'bellTower', minutes: 5 },
    { to: 'church', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  relief: [
    { to: 'chapel', minutes: 5 },
    { to: 'bellTower', minutes: 5 },
    { to: 'church', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  bellTower: [
    { to: 'chapel', minutes: 5 },
    { to: 'relief', minutes: 5 },
    { to: 'church', minutes: 5 },
    { to: 'town', minutes: 5 },
  ],
  gate: [
    { to: 'town', minutes: 5 },
    { to: 'outside', minutes: 5 },
  ],
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
  teleportRoom: [
    { to: 'academy', minutes: 5 },
  ],
  westTown: [
    { to: 'westGate', minutes: 5 },
    { to: 'westInn', minutes: 5 },
  ],
  westGate: [
    { to: 'westTown', minutes: 5 },
    { to: 'westInn', minutes: 5 },
  ],
  westInn: [
    { to: 'westTown', minutes: 5 },
    { to: 'westGate', minutes: 5 },
  ],
}

export function exitsOf(id: string): Exit[] {
  return EXITS[id] ?? []
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
  location: 'lecture' | 'yard'
  start: number
  end: number
  /** 体术类课程按星期在格斗与剑术之间轮换 */
  rotate?: boolean
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
    rotate: true,
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
  },
  {
    id: 'y2_course_4',
    year: 2,
    name: '课程4',
    skill: 'knowledge',
    kind: 'literature',
    location: 'lecture',
    start: 15 * 60,
    end: 16 * 60 + 30,
  },
]

export const YEAR_DAYS = 224
export const SEMESTER_DAYS = 84
export const HOLIDAY_DAYS = 28
export const MAX_YEAR = 2

export type SemesterState = 'semester1' | 'summer' | 'semester2' | 'winter' | 'after'

export const EXAM_OFFSETS = [27, 55, 83, 139, 167, 195]

const YEAR_THRESHOLDS: Record<number, number[]> = {
  1: [20, 60, 100, 120, 160, 200],
  // 第二学年每门课每天 3 段，考试线按 0.7 缩放
  2: [15, 40, 70, 85, 110, 140],
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

export function isClassDay(day: number): boolean {
  const state = semesterState(day)
  return weekday(day) < 5 && (state === 'semester1' || state === 'semester2')
}

export function coursesForYear(year: number): CourseDef[] {
  return COURSES.filter((c) => c.year === year)
}

export function courseById(id: string): CourseDef | undefined {
  return COURSES.find((c) => c.id === id)
}

export function examThresholdForDay(day: number): number {
  const year = currentYear(day)
  const idx = EXAM_OFFSETS.indexOf(dayInYear(day))
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
    (c) => c.location === location && minutes >= c.start && minutes < c.end,
  )
  if (!course) return null

  let skill = course.skill
  let extraSkill: SkillKey | undefined
  if (course.kind === 'physical') {
    if (course.rotate) skill = wd === 0 || wd === 2 || wd === 4 ? 'brawl' : 'sword'
    extraSkill = 'physique'
  }
  const label = course.rotate ? `${course.name} · ${SKILL_LABEL[skill]}` : course.name

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

/** 自习与练习对应的当前学年课程；没有对应课程时返回 null */
export function masteryCourseForSkill(skill: SkillKey, day: number): string | null {
  const courses = coursesForYear(currentYear(day))
  if (skill === 'brawl' || skill === 'sword') {
    const physical = courses.find(
      (c) => c.kind === 'physical' && (c.rotate || c.skill === skill),
    )
    return physical?.id ?? null
  }
  const match = courses.find((c) => c.kind !== 'physical' && c.skill === skill)
  return match?.id ?? null
}

export function classWindowAt(
  location: string,
  day: number,
  minutes: number,
): { start: number; end: number } | null {
  if (!isClassDay(day)) return null
  const course = coursesForYear(currentYear(day)).find(
    (c) => c.location === location && minutes >= c.start && minutes < c.end,
  )
  return course ? { start: course.start, end: course.end } : null
}

export function nextClassStart(location: string, day: number, minutes: number): number | null {
  if (!isClassDay(day)) return null
  const starts = coursesForYear(currentYear(day))
    .filter((c) => c.location === location)
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
  const t = absoluteMinutes(day, minutes)
  const year = currentYear(day)
  const candidates: number[] = []
  for (let y = year; y <= Math.min(MAX_YEAR, year + 1); y++) {
    for (const offset of EXAM_OFFSETS) {
      candidates.push(((y - 1) * YEAR_DAYS + offset) * 1440 + 22 * 60)
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

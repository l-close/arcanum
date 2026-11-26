import { BIRTHDAY_EVENT_ID, ITEMS, SKILL_LABEL, currentMeal, npcById, npcLocationAt, semesterState, weekday } from './content'
import type { CourseId, MealKey, MealName } from './content'
import type { GameData, SkillKey } from './types'

export const EVENT_DAILY_CAP = 3
export const EVENT_GAP_MINUTES = 30
export const EVENT_CHANCE = 0.3
export const EVENT_COOLDOWN_DAYS = 3

export type EventTrigger =
  | { type: 'enter' }
  | {
      type: 'after'
      action: 'class'
      courseId: CourseId
    }
  | {
      type: 'after'
      action: 'study' | 'practice' | 'work' | 'pray' | 'eat' | 'backyard'
    }

export type EventEffects = {
  minutes?: number
  stamina?: number
  spirit?: number
  mood?: number
  mana?: number
  money?: number
  exp?: Partial<Record<SkillKey, number>>
  affinity?: Record<string, number>
  items?: Record<string, number>
  flag?: string
  flags?: string[]
  meal?: MealKey
  ranges?: {
    money?: [number, number]
    stamina?: [number, number]
    spirit?: [number, number]
    mood?: [number, number]
    exp?: Partial<Record<SkillKey, [number, number]>>
  }
  bonusItems?: Array<{ id: string; chance: number; count?: number }>
}

export type EventChoice = {
  label: string
  result?: string
  effects?: EventEffects
}

function signed(value: number): string {
  return `${value > 0 ? '+' : ''}${value}`
}

function rollRange([min, max]: [number, number]): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/** 把区间奖励和概率物品结算成固定效果。 */
export function rollEventEffects(effects?: EventEffects): {
  effects?: EventEffects
  bonusText: string
} {
  if (!effects) return { effects, bonusText: '' }
  const resolved: EventEffects = { ...effects }
  delete resolved.ranges
  delete resolved.bonusItems

  if (effects.ranges) {
    const r = effects.ranges
    if (r.money) resolved.money = (resolved.money ?? 0) + rollRange(r.money)
    if (r.stamina) resolved.stamina = (resolved.stamina ?? 0) + rollRange(r.stamina)
    if (r.spirit) resolved.spirit = (resolved.spirit ?? 0) + rollRange(r.spirit)
    if (r.mood) resolved.mood = (resolved.mood ?? 0) + rollRange(r.mood)
    if (r.exp) {
      resolved.exp = { ...(resolved.exp ?? {}) }
      for (const [key, range] of Object.entries(r.exp)) {
        const skill = key as SkillKey
        resolved.exp[skill] = (resolved.exp[skill] ?? 0) + rollRange(range as [number, number])
      }
    }
  }

  const gained: string[] = []
  if (effects.bonusItems?.length) {
    const items = { ...(resolved.items ?? {}) }
    for (const bonus of effects.bonusItems) {
      if (Math.random() >= bonus.chance) continue
      const count = bonus.count ?? 1
      items[bonus.id] = (items[bonus.id] ?? 0) + count
      gained.push(`${ITEMS[bonus.id]?.name ?? bonus.id} ×${count}`)
    }
    if (Object.keys(items).length > 0) resolved.items = items
  }

  return { effects: resolved, bonusText: gained.length > 0 ? `另外得到 ${gained.join('、')}。` : '' }
}

export function cappedExpSkills(
  data: GameData,
  effects?: EventEffects,
  expCapTier?: number,
): SkillKey[] {
  if (!effects?.exp || expCapTier === undefined) return []
  return (Object.keys(effects.exp) as SkillKey[]).filter(
    (key) => (effects.exp?.[key] ?? 0) !== 0 && data.skills[key].tier >= expCapTier,
  )
}

export function eventEffectSummary(
  effects: EventEffects | undefined,
  data: GameData,
  expCapTier?: number,
): string {
  if (!effects) return '无变化'
  const capped = cappedExpSkills(data, effects, expCapTier)
  const ranges = effects.ranges
  const parts: string[] = []
  if (effects.minutes) parts.push(`${effects.minutes} 分钟`)
  if (ranges?.money) parts.push(`金钱 ${ranges.money[0]}–${ranges.money[1]}`)
  else if (effects.money) parts.push(`金钱 ${signed(effects.money)}`)
  if (ranges?.stamina) parts.push(`体力 ${signed(ranges.stamina[0])}～${signed(ranges.stamina[1])}`)
  else if (effects.stamina) parts.push(`体力 ${signed(effects.stamina)}`)
  if (ranges?.spirit) parts.push(`精神 ${signed(ranges.spirit[0])}～${signed(ranges.spirit[1])}`)
  else if (effects.spirit) parts.push(`精神 ${signed(effects.spirit)}`)
  if (ranges?.mood) parts.push(`心情 ${signed(ranges.mood[0])}～${signed(ranges.mood[1])}`)
  else if (effects.mood) parts.push(`心情 ${signed(effects.mood)}`)
  if (effects.mana) parts.push(`魔力 ${signed(effects.mana)}`)
  if (effects.exp) {
    for (const [key, value] of Object.entries(effects.exp)) {
      if (!value || capped.includes(key as SkillKey)) continue
      if (ranges?.exp?.[key as SkillKey]) continue
      parts.push(`${SKILL_LABEL[key as SkillKey]}经验 ${signed(value)}`)
    }
  }
  if (ranges?.exp) {
    for (const [key, range] of Object.entries(ranges.exp)) {
      if (expCapTier !== undefined && data.skills[key as SkillKey].tier >= expCapTier) continue
      parts.push(`${SKILL_LABEL[key as SkillKey]}经验 ${range[0]}–${range[1]}`)
    }
  }
  if (effects.affinity) {
    for (const [key, value] of Object.entries(effects.affinity)) {
      if (!value) continue
      const npc = npcById(key)
      if (npc?.relationship === 'familiarity') continue
      parts.push(`${npc?.short ?? key}好感 ${signed(value)}`)
    }
  }
  if (effects.bonusItems?.length) {
    const names = effects.bonusItems.map((bonus) => ITEMS[bonus.id]?.name ?? bonus.id)
    parts.push(`可能获得：${names.join('、')}`)
  }
  if (effects.items) {
    for (const [id, qty] of Object.entries(effects.items)) {
      if (qty <= 0) continue
      parts.push(`${ITEMS[id]?.name ?? id} ×${qty}`)
    }
  }
  if (effects.meal) {
    parts.push(effects.meal === 'breakfast' ? '视为早餐' : effects.meal === 'lunch' ? '视为午餐' : '视为晚餐')
  }
  return parts.length ? parts.join(' · ') : '无变化'
}

export type GameEvent = {
  id: string
  title: string
  trigger: EventTrigger
  locations: string[]
  days?: 'workday' | 'weekend' | 'all'
  timeRanges?: Array<[number, number]>
  /** 用餐时段；与 timeRanges 二选一。 */
  mealWindows?: MealName[]
  weight?: number
  once?: boolean
  /** 只能由代码强制触发，不进随机事件池。 */
  forcedOnly?: true
  expCapTier?: number
  requires?: {
    npc?: string
    affinity?: { npc: string; min: number }
    flag?: string
    notFlag?: string
    /** 只在对应假期触发。 */
    vacation?: 'summer' | 'winter'
    /** 只在学期内触发，假期不出现。 */
    school?: true
  }
  text: string[]
  choices: EventChoice[]
}

const at = (hour: number, minute = 0) => hour * 60 + minute

export const EVENTS: GameEvent[] = [
  {
    id: 'lecture_chalk',
    title: '黑板上的残留',
    trigger: { type: 'enter' },
    locations: ['lecture'],
    days: 'workday',
    timeRanges: [[at(8), at(9)]],
    expCapTier: 2,
    requires: { school: true },
    text: [
      '你比上课早到了一会儿。讲堂里还空着，黑板上留着上一节课的板书：半行古文，旁边几个被涂改过的字。',
    ],
    choices: [
      {
        label: '抄下来',
        result: '你把还看得清的部分抄进本子，赶在上课前收好。',
        effects: { minutes: 10, exp: { knowledge: 1 }, spirit: -1 },
      },
      {
        label: '擦掉',
        result: '你拿起板擦，把黑板擦干净。下一节课的人会轻松一点。',
        effects: { minutes: 5, stamina: -1, mood: 1 },
      },
      { label: '不管', result: '你在自己的位置上坐下，等上课。' },
    ],
  },
  {
    id: 'npc_luca_step0',
    title: '写错的注释',
    once: true,
    trigger: { type: 'enter' },
    locations: ['library'],
    days: 'workday',
    timeRanges: [
      [at(7, 30), at(8, 30)],
      [at(18), at(19)],
    ],
    requires: {
      npc: 'luca',
      affinity: { npc: 'luca', min: 20 },
    },
    text: [
      '卢卡坐在藏书阁最里面那排，盯着一本书的注释。你走近时，他把书往你这边推了推。',
      '“这注释写错了。”',
    ],
    choices: [
      {
        label: '帮他看',
        result: '你顺着他的手指看过去，注释确实和正文对不上。卢卡没说话，但把书往你这边又推了一点。',
        effects: { minutes: 10, spirit: -1, affinity: { luca: 1 }, flag: 'luca_step0' },
      },
      {
        label: '同意他',
        result: '你说这注释确实有问题。卢卡哼了一声，脸色好了一点。',
        effects: { affinity: { luca: 1 }, flag: 'luca_step0' },
      },
      {
        label: '不打扰',
        result: '你没有接话。卢卡把书收回去，继续自己看。',
        effects: { flag: 'luca_step0' },
      },
    ],
  },
  {
    id: 'library_luca_asleep',
    title: '卢卡睡着了',
    trigger: { type: 'enter' },
    locations: ['library'],
    days: 'workday',
    timeRanges: [[at(7, 30), at(8, 30)]],
    requires: { school: true },
    text: [
      '藏书阁最里面那排，卢卡趴在桌上睡着了。摊开的书还压在胳膊底下，旁边的笔记只写了一半。',
    ],
    choices: [
      {
        label: '叫醒他',
        result: '你敲了敲桌面。卢卡猛地抬头，先去看书有没有被压皱。',
        effects: { affinity: { luca: 1 } },
      },
      {
        label: '给他披外套',
        result: '你把外套搭在他肩上。他动了一下，半睁开眼，看清是你，没说什么，把外套往上拉了拉。',
        effects: { affinity: { luca: 2 }, mood: 1 },
      },
      { label: '悄悄走开', result: '你放轻脚步，从书架另一侧绕了过去。' },
    ],
  },
  {
    id: 'npc_mia_step0',
    title: '吃得很快的人',
    once: true,
    trigger: { type: 'enter' },
    locations: ['canteen'],
    days: 'all',
    mealWindows: ['午餐'],
    requires: {
      npc: 'mia',
      affinity: { npc: 'mia', min: 20 },
    },
    text: [
      '米娅吃得很快，盘子里的面包还没咽下去，人已经站起来了。',
      '“下午要去演武场，去晚了木桩就没了。”',
    ],
    choices: [
      {
        label: '问她为什么这么急',
        result: '她说下午要去演武场，去晚了木桩就没了。',
        effects: { affinity: { mia: 1 }, mood: 1, flag: 'mia_step0' },
      },
      {
        label: '让她慢点吃',
        result: '她嘴里说着知道了，手上还是没慢下来。',
        effects: { affinity: { mia: 1 }, flag: 'mia_step0' },
      },
      {
        label: '不打扰她',
        result: '你低头吃自己的。她很快端着空盘子走了。',
        effects: { flag: 'mia_step0' },
      },
    ],
  },
  {
    id: 'canteen_mia_seat',
    title: '米娅占座',
    trigger: { type: 'enter' },
    locations: ['canteen'],
    days: 'all',
    mealWindows: ['午餐'],
    requires: { npc: 'mia' },
    text: [
      '食堂里挤满了人。米娅远远看见你，抬手拍了拍旁边的空位，又把占座的书往自己那边挪了挪。',
    ],
    choices: [
      {
        label: '坐下一起吃',
        result: '你在她旁边坐下。她把盘子往中间推了推，说今天的炖菜比昨天好一点。',
        effects: { minutes: 30, stamina: 8, mood: 2, affinity: { mia: 1 }, meal: 'lunch' },
      },
      {
        label: '说吃过了',
        result: '你说自己已经吃过了。米娅耸耸肩，把书收回包里。',
        effects: { mood: 1 },
      },
      { label: '装没看见', result: '你低下头，从另一排桌子绕过去。' },
    ],
  },
  {
    id: 'yard_old_sword',
    title: '演武场的木剑',
    trigger: { type: 'enter' },
    locations: ['yard'],
    days: 'all',
    timeRanges: [[at(8), at(20)]],
    expCapTier: 2,
    text: [
      '演武场边上的木架上多了一把木剑，握柄被磨得发亮，剑身上有几道深浅不一的刻痕。',
    ],
    choices: [
      {
        label: '挥两下',
        result: '你把它取下来挥了两下。手感比练习用的那批轻一些。',
        effects: { minutes: 10, exp: { sword: 1 }, stamina: -2, mood: 1 },
      },
      {
        label: '放回架上',
        result: '你把木剑摆正，和其他器材对齐。',
        effects: { minutes: 5, mood: 1 },
      },
      { label: '不管', result: '你看了一眼，转身走开。' },
    ],
  },
  {
    id: 'lecture_alvin_notes',
    title: '阿尔文的批注',
    trigger: { type: 'after', action: 'class', courseId: 'y1_nature' },
    locations: ['lecture'],
    days: 'workday',
    expCapTier: 2,
    text: [
      '下课铃响后，阿尔文把你的笔记放在桌角。上面多了一行批注，字很小，写的是一个符号的正确写法。',
    ],
    choices: [
      {
        label: '认真读',
        result: '你把那行批注看了两遍，在旁边补上自己的理解。',
        effects: { minutes: 10, exp: { nature: 1 }, spirit: -1 },
      },
      {
        label: '去问清楚',
        result: '你追上正要离开的阿尔文。他停下脚步，听你问完，才慢慢解释。',
        effects: { minutes: 20, stamina: -2, exp: { nature: 1 }, mood: -1, affinity: { alvin: 1 } },
      },
      { label: '收起来', result: '你把笔记合上，塞回包里。' },
    ],
  },
  {
    id: 'lecture_elena_question',
    title: '伊莲娜的提问',
    trigger: { type: 'after', action: 'class', courseId: 'y1_literature' },
    locations: ['lecture'],
    days: 'workday',
    expCapTier: 2,
    text: [
      '古典文学课结束后，伊莲娜叫住你，问你觉得今天读的那段诗里，最打动你的是哪一句。',
    ],
    choices: [
      {
        label: '老实说没听懂',
        result: '你老实说没太听懂。她笑了一下，说没关系，下次可以慢慢来。',
        effects: { minutes: 5, exp: { knowledge: 1 }, mood: 1 },
      },
      {
        label: '编一个答案',
        result: '你挑了一句听起来最像答案的话。伊莲娜看了你一会儿，没有拆穿。',
        effects: { minutes: 5, exp: { knowledge: 1 }, mood: -1 },
      },
      {
        label: '反问她',
        result: '你反问她最喜欢哪一句。她愣了一下，然后认真地答了。',
        effects: { minutes: 10, exp: { knowledge: 1 }, affinity: { elena: 1 }, mood: 1 },
      },
    ],
  },
  {
    id: 'yard_gregory_extra',
    title: '格里高利的加练',
    trigger: { type: 'after', action: 'class', courseId: 'y1_physical' },
    locations: ['yard'],
    days: 'workday',
    expCapTier: 2,
    text: [
      '武艺课结束，其他人陆续离开。格里高利把木桩摆回原位，看了你一眼：“刚才那个动作，要再来一组吗？”',
    ],
    choices: [
      {
        label: '再加一组',
        result: '你咬牙又做了一组。做到最后几个，胳膊已经开始发抖。',
        effects: { minutes: 15, exp: { physique: 1 }, stamina: -3, mood: 0 },
      },
      { label: '说体力不支', result: '你说自己快没力气了。格里高利点点头，没有勉强。' },
      {
        label: '帮他收器材',
        result: '你留下来帮他把木桩搬回架子上。他没说什么，只在你搬完时拍了下你的肩。',
        effects: { minutes: 10, stamina: -2, mood: 1, affinity: { gregory: 1 } },
      },
    ],
  },
  {
    id: 'orphan_soup',
    title: '打翻的粥',
    trigger: { type: 'enter' },
    locations: ['orphanCanteen'],
    days: 'all',
    mealWindows: ['早餐', '晚餐'],
    text: [
      '一个孩子端着碗从桌边跑过，脚下一绊，粥洒了一地。他站在原地，先看了看地上的碗，又看了看你。',
    ],
    choices: [
      {
        label: '帮忙擦',
        result: '你拿来抹布，把地上的粥擦干净。孩子小声说了句谢谢。',
        effects: { minutes: 10, stamina: -2, mood: 1, affinity: { nora: 1 } },
      },
      {
        label: '再盛一碗',
        result: '你去厨房又盛了一碗，放回他手里。他抱着碗跑回座位。',
        effects: { minutes: 5, mood: 1, affinity: { nora: 1 } },
      },
      { label: '装作没看见', result: '你低下头继续吃自己的。' },
    ],
  },
  {
    id: 'backyard_firewood',
    title: '后院的柴火',
    trigger: { type: 'enter' },
    locations: ['backyard'],
    days: 'all',
    timeRanges: [[at(15), at(17)]],
    expCapTier: 1,
    text: [
      '后院里堆着一摞新送来的柴火。几个孩子正试着把它们码整齐，码到一半就塌了。',
    ],
    choices: [
      {
        label: '帮忙劈柴',
        result: '你接过斧子，把几根太粗的柴劈开。孩子们在旁边把劈好的柴递过去。',
        effects: { minutes: 30, stamina: -3, mood: 1, exp: { physique: 1 }, affinity: { nora: 1 } },
      },
      {
        label: '教孩子们怎么摆',
        result: '你蹲下来，教他们先把粗的放下面。第二次码到一半，没有塌。',
        effects: { minutes: 10, mood: 1 },
      },
      { label: '走开', result: '你绕过那堆柴火，回了屋里。' },
    ],
  },
  {
    id: 'office_nora_ledger',
    title: '诺拉的账本',
    trigger: { type: 'enter' },
    locations: ['office'],
    days: 'all',
    timeRanges: [[at(20), at(21)]],
    expCapTier: 1,
    text: [
      '院长室里只点着一盏灯。诺拉还在算账，纸上写满了数字，旁边放着一杯已经凉了的茶。',
    ],
    choices: [
      {
        label: '帮她算',
        result: '你拉过一张纸，帮她把这一页重新算了一遍。诺拉靠在椅背上，揉了揉眼睛。',
        effects: { minutes: 20, spirit: -1, exp: { knowledge: 1 }, affinity: { nora: 1 } },
      },
      {
        label: '劝她休息',
        result: '你把她手边的笔拿走，说今天到此为止。她看了你一会儿，没再坚持。',
        effects: { minutes: 5, mood: 1, affinity: { nora: 1 } },
      },
      { label: '不打扰', result: '你轻轻带上门，让她继续。' },
    ],
  },
  {
    id: 'backyard_nora_bread',
    title: '诺拉的面包',
    trigger: { type: 'after', action: 'backyard' },
    locations: ['backyard'],
    days: 'all',
    text: [
      '你收好工具，诺拉从厨房出来，手里拿着一块还温着的面包，塞到你手里。',
    ],
    choices: [
      {
        label: '收下',
        result: '你接过面包。她摆摆手，让你赶紧吃。',
        effects: { stamina: 5, affinity: { nora: 1 }, mood: 1 },
      },
      {
        label: '分给孩子们',
        result: '你把面包掰开，分给了还留在后院的孩子。诺拉站在门口看着，没有说什么。',
        effects: { affinity: { nora: 2 }, mood: 1 },
      },
      {
        label: '说不饿',
        result: '你说自己不饿。诺拉看了你一眼，把面包收了回去。',
        effects: { mood: 1 },
      },
    ],
  },
  {
    id: 'shop_owner_recommend',
    title: '店主的推荐',
    trigger: { type: 'enter' },
    locations: ['shop'],
    days: 'all',
    timeRanges: [[at(10), at(18)]],
    text: [
      '店主正在整理货架，见你进来，拿起一瓶药剂向你晃了晃：“今天刚到的新货，要不要看看？”',
    ],
    choices: [
      {
        label: '听她介绍',
        result: '你听她讲了几分钟。虽然没买，但知道了不少东西的用处。',
        effects: { minutes: 5, mood: 1 },
      },
      {
        label: '帮忙搬箱子',
        result: '你帮她把门口那箱货搬进柜台后面。她数出三枚铜币放在你手里。',
        effects: { minutes: 15, stamina: -3, money: 3 },
      },
      { label: '离开', result: '你摇摇头，转身出了店门。' },
    ],
  },
  {
    id: 'shop_change',
    title: '找零的铜板',
    trigger: { type: 'after', action: 'work' },
    locations: ['shop'],
    days: 'all',
    text: [
      '客人走后，你在柜台角落发现几枚铜板，应该是刚才找零时落下的。店主正在里屋整理货物。',
    ],
    choices: [
      {
        label: '交给店主',
        result: '你把铜板放在柜台上，告诉店主是刚才客人落下的。她点了点头，把铜板收进钱盒。',
        effects: { mood: 1 },
      },
      {
        label: '自己收下',
        result: '你把铜板揣进兜里，没有说话。',
        effects: { ranges: { money: [1, 3] }, mood: -1 },
      },
      {
        label: '放在柜台上',
        result: '你把铜板放在柜台显眼的地方，继续做自己的事。',
      },
    ],
  },
  {
    id: 'commercial_bookstall',
    title: '街角的旧书摊',
    trigger: { type: 'enter' },
    locations: ['commercial'],
    days: 'all',
    timeRanges: [[at(10), at(18)]],
    expCapTier: 2,
    text: [
      '街角支着一张小桌，旧书摞得歪歪斜斜。摊主坐在折叠椅上，手里翻着一本缺了封面的册子。',
    ],
    choices: [
      {
        label: '翻一翻',
        result: '你蹲下来翻了几本，纸页发黄，但有些批注写得很有意思。',
        effects: { minutes: 10, mood: 1 },
      },
      {
        label: '买一本',
        result: '你挑了一本还算完整的旧书，付了六枚铜币。',
        effects: { minutes: 10, money: -6, ranges: { exp: { knowledge: [1, 2] } } },
      },
      {
        label: '离开',
        result: '你没有停下，继续往前走。',
      },
    ],
  },
  {
    id: 'chapel_donation',
    title: '教堂的募捐',
    trigger: { type: 'enter' },
    locations: ['chapel'],
    days: 'all',
    timeRanges: [[at(6), at(21)]],
    text: [
      '祷告厅门口放着一只募捐箱，旁边站着一位修女。她说这些钱会用来给孤儿院添冬衣。',
    ],
    choices: [
      {
        label: '捐 2 铜',
        result: '你把两枚铜币放进箱子里。修女朝你点了点头。',
        effects: { money: -2, mood: 1 },
      },
      {
        label: '帮忙整理',
        result: '你帮她把堆在旁边的旧衣物叠好，按大小分开。',
        effects: { minutes: 10, stamina: -2, mood: 1 },
      },
      {
        label: '离开',
        result: '你没有停留，从门口走了过去。',
      },
    ],
  },
  {
    id: 'commercial_weekend_market',
    title: '周末的集市',
    trigger: { type: 'enter' },
    locations: ['commercial'],
    days: 'weekend',
    timeRanges: [[at(9), at(18)]],
    text: [
      '周末的商业区比平时热闹，街边多了几顶棚子，卖吃的、旧器具和不知道从哪儿来的小玩意儿。',
    ],
    choices: [
      {
        label: '逛一逛',
        result: '你沿着摊位慢慢走了一圈，什么也没买，但看得挺开心。',
        effects: { minutes: 10, mood: 1 },
      },
      {
        label: '买点吃的',
        result: '你买了一份刚出炉的小点心，边走边吃。',
        effects: { minutes: 5, money: -2, ranges: { stamina: [3, 6] } },
      },
      {
        label: '离开',
        result: '你从人群边上绕了过去。',
      },
    ],
  },
  {
    id: 'commercial_music',
    title: '街角的琴声',
    trigger: { type: 'enter' },
    locations: ['commercial'],
    days: 'all',
    timeRanges: [[at(12), at(20)]],
    text: [
      '街角有人拉着一把旧琴，曲子很慢，路过的人大多没有停。琴盒里散着几枚铜板。',
    ],
    choices: [
      {
        label: '听一会儿',
        result: '你在旁边站了一会儿。曲子换了一段，比刚才轻快些。',
        effects: { minutes: 10, mood: 1 },
      },
      {
        label: '给一枚铜板',
        result: '你往琴盒里放了一枚铜板。拉琴的人朝你点了点头，没有停下手。',
        effects: { minutes: 5, money: -1, mood: 1 },
      },
      { label: '走开', result: '你从人群边上绕过去。' },
    ],
  },
  {
    id: 'chapel_candles',
    title: '祷告厅的蜡烛',
    trigger: { type: 'enter' },
    locations: ['chapel'],
    days: 'all',
    timeRanges: [[at(6), at(21)]],
    text: [
      '祷告厅里，一位修女正踮着脚修剪长椅旁的烛芯。她手边的烛台有些歪，看起来不太稳。',
    ],
    choices: [
      {
        label: '帮忙修烛芯',
        result: '你扶住烛台，帮她把几根烧黑的烛芯修短。她低声道了谢。',
        effects: { minutes: 10, stamina: -2, mood: 1 },
      },
      {
        label: '安静坐一会儿',
        result: '你在最后一排坐下，听着烛火偶尔爆开的轻响。',
        effects: { minutes: 10, spirit: 1, mood: 1 },
      },
      { label: '离开', result: '你放轻脚步，退了出去。' },
    ],
  },
  {
    id: 'chapel_after_prayer',
    title: '钟声之前',
    trigger: { type: 'after', action: 'pray' },
    locations: ['chapel'],
    days: 'all',
    text: [
      '祷告结束后，钟声还没有响。厅里只剩几个人，彩窗上的光慢慢移到了长椅边。',
    ],
    choices: [
      {
        label: '再坐一会儿',
        result: '你又坐了一会儿，直到钟声从高处落下来。',
        effects: { minutes: 30, spirit: 1, mood: 2 },
      },
      {
        label: '起身离开',
        result: '你站起来，往门口走。心里的杂音比来时少了一些。',
        effects: { mana: 2 },
      },
      {
        label: '找修女说话',
        result: '你走到修女身边，和她说了几句话。她说话很慢，但不敷衍。',
        effects: { minutes: 10, mood: 1 },
      },
    ],
  },
  {
    id: 'town_directions',
    title: '问路的人',
    trigger: { type: 'enter' },
    locations: ['town'],
    days: 'all',
    timeRanges: [[at(9), at(18)]],
    text: [
      '一个背着行囊的人在路口拦住你，手里拿着一张画得不太清楚的地图，问去长明学院怎么走。',
    ],
    choices: [
      {
        label: '带他走一段',
        result: '你带他走过两个路口，指给他看坡道尽头的院墙。',
        effects: { minutes: 15, stamina: -1, mood: 1 },
      },
      {
        label: '指路',
        result: '你告诉他沿着这条路一直走，看到石墙再往右。',
        effects: { mood: 1 },
      },
      { label: '说不清楚', result: '你看了看地图，还是摇了摇头。' },
    ],
  },
  {
    id: 'west_arrival',
    title: '镇口',
    trigger: { type: 'enter' },
    locations: ['westGate'],
    days: 'all',
    once: true,
    text: [
      '守卫抬手示意你停下，验过你的学院文书，又对照了一遍名册。',
      '“支援队的？进去吧。”',
      '木拒马被挪开一半。',
    ],
    choices: [
      {
        label: '收好文书',
        result: '你把学院文书收回怀里，从挪开的木拒马旁走进去。',
      },
      {
        label: '点头进去',
        result: '你朝守卫点了点头。他没有再多问，只是把路让开。',
      },
    ],
  },
  {
    id: 'west_chapel_seal',
    title: '旧礼拜堂',
    trigger: { type: 'enter' },
    locations: ['westChapel'],
    days: 'all',
    once: true,
    text: [
      '门上的封条已经旧了，边角卷起。',
      '教会与审判庭的印记并排贴着，谁也没有揭。',
      '石阶上有一小片新踩出的灰痕，一直延伸到门边。',
      '你站了一会儿，里面没有声音。',
    ],
    choices: [
      {
        label: '离开',
        result: '你转身离开。封条在风里轻轻响了一下。',
      },
      {
        label: '再看一眼',
        result: '你又看了一眼那道门缝。里面还是没有声音。',
      },
    ],
  },
  {
    id: 'west_alvin_encounter',
    title: '封条外',
    trigger: { type: 'enter' },
    locations: ['westChapel'],
    days: 'all',
    once: true,
    text: [
      '阿尔文站在封条外，手里拿着一叠纸。',
      '他听见脚步，把纸收进外套里。',
      '“这边的事，别跟别人说。”',
    ],
    choices: [
      {
        label: '点头',
        result: '你点了点头。阿尔文没有再解释，转身走进镇外方向。',
      },
      {
        label: '问他在做什么',
        result: '“课上没讲完的东西。”他说完这句，就不再看你。',
      },
    ],
  },
  {
    id: 'commercial_rune_lamp',
    title: '招牌下的灯',
    once: true,
    trigger: { type: 'enter' },
    locations: ['commercial'],
    days: 'all',
    timeRanges: [[at(10), at(17)]],
    expCapTier: 2,
    text: [
      '一家店的招牌下挂着一盏灯，灯罩里侧积的是灰，不是烟油。',
      '店主正站在门口擦灯罩。',
      '“这盏不用添油。广场那几盏也是。”',
    ],
    choices: [
      {
        label: '问多久补刻一次',
        result: '“说不准。坏了才有人来。”店主把灯罩挂回去，没再多说。',
        effects: { minutes: 5, exp: { knowledge: 1 } },
      },
      {
        label: '看灯座',
        result: '灯座上有几道补刻的刀痕，深浅不一。',
        effects: { minutes: 5, mood: 1 },
      },
      { label: '走开', result: '你从招牌下走过去。' },
    ],
  },
  {
    id: 'summer_plaza_kids',
    title: '广场上的孩子',
    trigger: { type: 'enter' },
    locations: ['orphanage'],
    days: 'all',
    timeRanges: [[at(9), at(17)]],
    requires: { vacation: 'summer' },
    text: [
      '诺拉把三个孩子交到你手上，说今天不用急着回来。',
      '最小的那个已经拽着你的袖子往门口走，另外两个在台阶上等你。',
    ],
    choices: [
      {
        label: '给他们买点吃的',
        result:
          '你在广场边的小摊上买了几块糖。孩子们分得很仔细，连纸袋底的碎屑都倒进嘴里。',
        effects: { minutes: 30, money: -2, mood: 2 },
      },
      {
        label: '陪他们跑一圈',
        result:
          '你带着他们绕着喷泉跑。最小的那个跑不动了，另外两个就一左一右架着他。',
        effects: { minutes: 30, stamina: -2, mood: 2 },
      },
      {
        label: '只走一圈',
        result: '你们沿着广场慢慢走了一圈。孩子们看见鸽子就停下来，你也就跟着停。',
        effects: { minutes: 20, mood: 1 },
      },
    ],
  },
  {
    id: 'summer_mia_commercial',
    title: '商业区的米娅',
    trigger: { type: 'enter' },
    locations: ['commercial'],
    days: 'all',
    timeRanges: [[at(14), at(17)]],
    requires: { npc: 'mia', vacation: 'summer' },
    text: [
      '米娅靠在旧书铺的遮棚下，手里转着一枚铜币。看见你，她把铜币弹起来又接住。',
      '“放假比上课还无聊。”她说，“你也是来闲逛的？”',
    ],
    choices: [
      {
        label: '陪她逛',
        result: '你们从街头逛到街尾。米娅在每个摊子前都要停一下，最后什么也没买。',
        effects: { minutes: 30, mood: 2, affinity: { mia: 1 } },
      },
      {
        label: '帮她挑东西',
        result:
          '她看中两根发带，拿不定主意。你说左边那根更耐脏，她就买了左边。',
        effects: { minutes: 15, mood: 1, affinity: { mia: 1 } },
      },
      {
        label: '先走',
        result: '你说还有事。米娅摆摆手，又靠回遮棚下。',
        effects: { minutes: 5 },
      },
    ],
  },
  {
    id: 'summer_luca_library',
    title: '藏书阁的卢卡',
    trigger: { type: 'enter' },
    locations: ['library'],
    days: 'all',
    timeRanges: [[at(9), at(11)]],
    requires: { npc: 'luca', vacation: 'summer' },
    expCapTier: 2,
    text: [
      '藏书阁里只有最里面那排还坐着人。卢卡面前摊着两本书，手边压着一张写满字的纸。',
      '他抬头看了你一眼，把其中一本往旁边挪了挪。',
    ],
    choices: [
      {
        label: '一起看',
        result:
          '你在他对面坐下。他看的那本讲的是旧城的水道，你在旁边跟着读了两页。',
        effects: {
          minutes: 30,
          spirit: -1,
          exp: { knowledge: 1 },
          affinity: { luca: 1 },
        },
      },
      {
        label: '问他为什么来',
        result: '“宿舍太吵。”他说完就低下头，像是怕你继续问。',
        effects: { minutes: 10, mood: 1, affinity: { luca: 1 } },
      },
      {
        label: '不打扰',
        result: '你从书架另一侧绕过去，没有出声。',
        effects: { minutes: 5 },
      },
    ],
  },
  {
    id: 'winter_snow_chores',
    title: '扫雪',
    trigger: { type: 'enter' },
    locations: ['orphanage', 'backyard'],
    days: 'all',
    timeRanges: [[at(6), at(10)]],
    requires: { vacation: 'winter' },
    text: [
      '门口的雪堆了半尺。诺拉已经扫出一小段，正扶着墙喘气。',
      '孩子们挤在门里看，谁也没敢先踩出去。',
    ],
    choices: [
      {
        label: '接过扫帚',
        result:
          '你把诺拉替下来，一直扫到台阶下。她在后面把雪堆到两边，没再说话。',
        effects: { minutes: 30, stamina: -3, mood: 1, affinity: { nora: 1 } },
      },
      {
        label: '只扫门前',
        result: '你把门前那一小块清出来，剩下的留给太阳。',
        effects: { minutes: 15, stamina: -1 },
      },
      {
        label: '叫孩子们一起',
        result:
          '你给孩子们分了小铲子。他们干得乱七八糟，但门口很快清出来了。',
        effects: { minutes: 30, stamina: -2, mood: 2, affinity: { nora: 1 } },
      },
    ],
  },
  {
    id: 'winter_lanterns',
    title: '孩子们做灯',
    trigger: { type: 'enter' },
    locations: ['orphanCanteen'],
    days: 'all',
    timeRanges: [[at(17), at(20)]],
    requires: { vacation: 'winter' },
    text: [
      '孩子们把长桌拼在一起，糊灯纸的浆糊抹得到处都是。最小的那个举着一盏歪掉的灯，等你夸。',
      '诺拉从门口看了一眼，没有过来管。',
    ],
    choices: [
      {
        label: '帮他们糊纸',
        result:
          '你接手最歪的那盏，把纸角一层层压平。孩子们围在旁边，谁都想伸手。',
        effects: { minutes: 30, stamina: -1, mood: 2 },
      },
      {
        label: '讲长明夜',
        result:
          '你讲了学院那晚的灯。孩子们听得安静下来，手里的灯纸也忘了剪。',
        effects: { minutes: 20, mood: 1, spirit: 1 },
      },
      {
        label: '看着',
        result: '你靠在门边看他们忙。灯纸糊坏了几张，笑声倒是没停。',
        effects: { minutes: 10, mood: 1 },
      },
    ],
  },
  {
    id: 'winter_ledger',
    title: '年末的账本',
    trigger: { type: 'enter' },
    locations: ['office'],
    days: 'all',
    timeRanges: [[at(14), at(18)]],
    requires: { npc: 'nora', vacation: 'winter' },
    expCapTier: 2,
    text: [
      '院长室的桌上摊着三本册子。诺拉低头核对着数字，笔尖停在半空。',
      '“年末的账。”她说，“差一点就对不上。”',
    ],
    choices: [
      {
        label: '帮她算',
        result:
          '你把她标出来的几行重新加了一遍，找出两处抄错。诺拉看了很久，才说：“行，比我快。”',
        effects: {
          minutes: 30,
          spirit: -2,
          exp: { knowledge: 1 },
          affinity: { nora: 1 },
        },
      },
      {
        label: '问她累不累',
        result:
          '她说不累，手却没有再碰账本。你给她倒了杯水，她接过去喝了一口。',
        effects: { minutes: 10, mood: 1, affinity: { nora: 1 } },
      },
      {
        label: '不打扰',
        result: '你把门带上，让她自己算。',
        effects: { minutes: 5 },
      },
    ],
  },
  {
    id: BIRTHDAY_EVENT_ID,
    title: '纸包',
    forcedOnly: true,
    trigger: { type: 'enter' },
    locations: [],
    text: [
      '今天是诺拉捡到你的那天。她一直把这一天当作你的生日。',
      '诺拉从门里出来，手里拿着一个用旧账纸包好的东西。她看见你，先上下打量了一眼。',
      '“过来。”她说。她把纸包塞进你手里，没有立刻松手。',
      '“今天是捡到你的日子。”她说得很平，“拿着。别弄丢了。”',
      '你还没来得及开口，她已经把手收回去，像是怕你多问。',
      '“拆吧。”她靠在门边，没有走，“我在这儿。”',
      '纸包不重。解开麻绳，旧账纸里是几块烤饼干、一小截用旧布条编的发带，还有一张折了两折的字条。字条上是卢卡的字：「生日快乐。别弄丢。回学院还我。」',
      '饼干还是脆的。发带的颜色和制服不太搭。',
    ],
    choices: [
      {
        label: '掰一块给她',
        result:
          '你掰下一块，先递到她手边。诺拉看了一眼，说“我不吃甜的”，还是接过去咬了一小口。你这才吃自己那块。饼干烤得很干，糖放得不多，嚼到最后有一点焦味。“下次少放点糖。”她说。她自己没有再拿。',
        effects: {
          stamina: 2,
          mood: 2,
          affinity: { nora: 2 },
          items: { birthday_cookie: 3 },
        },
      },
      {
        label: '把发带系在手腕上',
        result:
          '你把发带在手腕上绕了两圈，系紧，又松开一格。袖口放下来，刚好遮住一半。诺拉看了一眼：“颜色太扎眼。”但她没有让你摘。',
        effects: { mood: 3, affinity: { mia: 1 }, items: { birthday_cookie: 3 } },
      },
      {
        label: '把字条收进课本',
        result:
          '你把字条折回原来的两折，夹进课本最里面那页。诺拉问：“谁写的？”你说卢卡。她“哦”了一声，没再问。',
        effects: { spirit: 2, affinity: { luca: 1 }, items: { birthday_cookie: 3 } },
      },
    ],
  },
  {
    id: 'dorm_kitchen_raid',
    title: '楼下的饼干罐',
    trigger: { type: 'enter' },
    locations: ['dorm'],
    days: 'all',
    timeRanges: [[at(21), at(23)]],
    text: [
      '走廊的灯灭了，过一会儿又亮。楼下有人压着声音笑，接着是赤脚踩过地板的声音，往厨房去了。',
    ],
    choices: [
      {
        label: '下楼看',
        result:
          '厨房门口蹲着两个更小的孩子，怀里抱着一罐饼干。看见你，他们僵了一下，然后把罐子往你这边推了推。你拿了一块，朝楼梯口指了指，让他们快点回去。',
        effects: { minutes: 10, mood: 1, items: { plain_cookie: 1 } },
      },
      {
        label: '不管',
        result: '你关上门，没再管楼下的动静。笑声过一会儿就停了。',
      },
    ],
  },
  {
    id: 'bookshop_dust',
    title: '夹在书里的纸条',
    trigger: { type: 'enter' },
    locations: ['bookshop'],
    days: 'all',
    timeRanges: [[at(9), at(19)]],
    requires: { notFlag: 'bookshop_note' },
    text: [
      '你抽出一本旧书，书页里掉出一张折过的纸条。上面写着一行地址，墨迹已经发灰。',
    ],
    choices: [
      {
        label: '买下这本书',
        result: '你付了钱，把纸条夹回书里。店主没多问。',
        effects: { money: -5, flag: 'bookshop_note' },
      },
      {
        label: '记下地址',
        result: '你把地址在心里默念了两遍，又把书放回架上。',
        effects: { minutes: 10, spirit: -3, flag: 'bookshop_note' },
      },
      {
        label: '夹回去',
        result: '你把纸条夹回原处，把书推了回去。',
      },
    ],
  },
  {
    id: 'weapon_shop_bellows',
    title: '风箱',
    trigger: { type: 'enter' },
    locations: ['weaponShop'],
    days: 'all',
    timeRanges: [[at(8), at(19)]],
    expCapTier: 2,
    text: [
      '戈登把一块烧红的铁夹到砧子上，朝风箱那边看了一眼。',
    ],
    choices: [
      {
        label: '拉风箱',
        result: '风箱把火吹成橙黄。戈登看了一眼，说正好。',
        effects: { minutes: 30, stamina: -3, exp: { physique: 2 } },
      },
      {
        label: '站远一点看',
        result: '戈登把铁翻了个面，随口讲了两句火候。',
        effects: { minutes: 10, exp: { knowledge: 1 } },
      },
      { label: '走', result: '你从门口退了出去。' },
    ],
  },
  {
    id: 'guild_miscount',
    title: '对不上的货单',
    trigger: { type: 'enter' },
    locations: ['guild'],
    days: 'all',
    timeRanges: [[at(8), at(19)]],
    expCapTier: 2,
    text: [
      '柜台后的男人把货单翻过来又翻过去，笔尖在同一个数字上停了很久。',
    ],
    choices: [
      {
        label: '帮他核',
        result: '你从第一行重新对了一遍，找出多算的一箱。',
        effects: { minutes: 30, spirit: -2, exp: { knowledge: 1 }, money: 3 },
      },
      {
        label: '去搬箱子',
        result: '你把箱子挪到后院，按单子分开。',
        effects: { minutes: 30, stamina: -3, money: 3 },
      },
      { label: '走', result: '你还有别的事，转身出了门。' },
    ],
  },
  {
    id: 'tavern_mercenary',
    title: '靠窗的佣兵',
    trigger: { type: 'enter' },
    locations: ['tavern'],
    days: 'all',
    timeRanges: [[at(18), at(23)]],
    expCapTier: 2,
    text: [
      '靠窗的佣兵把剑靠在桌腿上，正跟同桌的人说城外的事。声音不大，刚好够你听清几句。',
    ],
    choices: [
      {
        label: '请他一杯',
        result: '你把杯子推过去。他停了一下，把城外的事接着说完。',
        effects: { minutes: 10, money: -2, exp: { knowledge: 1 }, mood: 1 },
      },
      {
        label: '在旁边听',
        result: '你端着杯子在旁边坐下，听他们把话说完。',
        effects: { minutes: 15, exp: { knowledge: 1 } },
      },
      { label: '走', result: '你没有停下，往楼梯口走去。' },
    ],
  },
  {
    id: 'forest_cache',
    title: '纸条上的地址',
    trigger: { type: 'enter' },
    locations: ['forestDeep'],
    days: 'all',
    timeRanges: [[at(6), at(18)]],
    requires: { flag: 'bookshop_note', notFlag: 'forest_cache_done' },
    text: [
      '纸条上的地址指向森林更深处的一棵歪树。树根下的土有翻动过的痕迹。',
    ],
    choices: [
      {
        label: '挖开',
        result: '土里埋着一个锈铁盒。你把它撬开。',
        effects: {
          minutes: 20,
          stamina: -2,
          ranges: { money: [5, 12] },
          bonusItems: [{ id: 'bandage', chance: 0.3 }],
          flag: 'forest_cache_done',
        },
      },
      {
        label: '不挖',
        result: '你把土重新踩实，记下这棵树的位置。',
        effects: { minutes: 5 },
      },
      { label: '走', result: '你没有走近那棵树。' },
    ],
  },
  {
    id: 'greenhouse_repot',
    title: '分盆',
    trigger: { type: 'enter' },
    locations: ['greenhouse'],
    days: 'all',
    timeRanges: [[at(8), at(19)]],
    expCapTier: 2,
    text: [
      '苔丝蹲在砖台边分盆，脚边一排空陶盆，手上全是土。',
    ],
    choices: [
      {
        label: '帮忙',
        result: '你按她说的把根须理顺，她在旁边看着，偶尔伸手扶一下。',
        effects: { minutes: 30, stamina: -2, exp: { cultivation: 1 } },
      },
      {
        label: '问两句',
        result: '她讲了讲哪种土透气，哪种盆不能积水。',
        effects: { minutes: 10, exp: { knowledge: 1 } },
      },
      { label: '走', result: '你没有打扰她。' },
    ],
  },
  {
    id: 'potion_shop_spill',
    title: '歪掉的药瓶',
    trigger: { type: 'enter' },
    locations: ['potionWorkshop'],
    days: 'all',
    timeRanges: [[at(8), at(19)]],
    text: [
      '学徒抱着一摞药瓶，最上面一瓶歪了，他腾不出手。',
    ],
    choices: [
      {
        label: '扶住瓶子',
        result: '你伸手扶住瓶身。学徒松了口气，把整摞瓶子放稳。',
        effects: { minutes: 5, mood: 1 },
      },
      {
        label: '帮他接过去',
        result: '你把最上面几瓶接过来，按标签放回架上。',
        effects: { minutes: 10, stamina: -1, mood: 2 },
      },
      { label: '走', result: '你侧身让开，继续走自己的路。' },
    ],
  },
  {
    id: 'practice_spar',
    title: '再打一场',
    trigger: { type: 'after', action: 'practice' },
    locations: ['yard'],
    days: 'workday',
    timeRanges: [[at(15), at(19, 30)]],
    requires: { school: true },
    text: [
      '你刚练完，旁边一个学生把木剑横过来，问你要不要再打一场。',
    ],
    choices: [
      {
        label: '下场打一场',
        result: '你们打到两个人都开始喘，才把木剑放下。',
        effects: { minutes: 30, stamina: -4, exp: { sword: 3 } },
      },
      {
        label: '只走两招',
        result: '你接了两招，点到为止。',
        effects: { minutes: 10, stamina: -1, exp: { sword: 1 } },
      },
      { label: '收剑回去', result: '你摆了摆手，把木剑放回架上。' },
    ],
  },
  {
    id: 'work_shop_rumor',
    title: '盖着油布的货车',
    trigger: { type: 'after', action: 'work' },
    locations: ['shop'],
    days: 'all',
    timeRanges: [[at(7), at(19)]],
    text: [
      '常客来结账，顺口说起城门外最近多了几辆没见过的货车。',
    ],
    choices: [
      {
        label: '问他几句',
        result: '他说那些车都盖着油布，没在集市停，卸货的人也不像本地的。',
        effects: { minutes: 10 },
      },
      {
        label: '只听着',
        result: '你没接话，把找零递过去。他收好铜板，又提了一句：城门的守卫最近查得严。',
        effects: { minutes: 5 },
      },
      { label: '继续理货', result: '你继续把货架上的罐子摆正。常客说了两句，见你没接话，就拎着东西走了。' },
    ],
  },
  {
    id: 'work_tavern_song',
    title: '收工前的旧歌',
    trigger: { type: 'after', action: 'work' },
    locations: ['tavern'],
    days: 'all',
    timeRanges: [[at(18), at(23)]],
    text: [
      '收工前，靠窗的客人哼起一支旧歌，声音很轻。',
    ],
    choices: [
      {
        label: '跟着哼',
        result: '你放轻了手上的动作，跟着哼了两句。客人没有回头。',
        effects: { minutes: 10, mood: 2 },
      },
      {
        label: '把最后几张桌子擦完',
        result: '你在桌角发现一枚留下的铜板。',
        effects: { minutes: 10, stamina: -1, money: 1 },
      },
      { label: '回后厨', result: '你没有停下手里的活。' },
    ],
  },
  {
    id: 'weekend_orphan_games',
    title: '菜园边的旧绳',
    trigger: { type: 'enter' },
    locations: ['backyard'],
    days: 'weekend',
    timeRanges: [[at(14), at(17)]],
    text: [
      '后院菜园边的空地上，几个孩子把一根旧绳拉直，问你跳不跳。',
    ],
    choices: [
      {
        label: '陪他们跳',
        result: '你被拉进绳圈，跳错了几次，还得留意别踩到菜畦。孩子们笑得更响。',
        effects: { minutes: 30, stamina: -3, mood: 3 },
      },
      {
        label: '坐在柴堆边看',
        result: '你坐在柴堆边，看他们把绳子越拉越高。',
        effects: { minutes: 15, mood: 2 },
      },
      { label: '回房', result: '你朝屋里走去。' },
    ],
  },
  {
    id: 'evening_gate_watch',
    title: '换班',
    trigger: { type: 'enter' },
    locations: ['gate'],
    days: 'all',
    timeRanges: [[at(18), at(21)]],
    expCapTier: 2,
    text: [
      '城门要换班了，守卫把拒马往中间挪，风从城外灌进来。',
    ],
    choices: [
      {
        label: '和守卫搭话',
        result: '他说最近城外夜里不太平，回城的人最好赶在天黑前。',
        effects: { minutes: 10 },
      },
      {
        label: '帮他们把拒马挪正',
        result: '你和守卫把拒马挪回中间，手上沾了木刺。',
        effects: { minutes: 20, stamina: -2, exp: { physique: 1 } },
      },
      { label: '走', result: '你从城门边绕了过去。' },
    ],
  },
  {
    id: 'evening_town_notice',
    title: '新贴的告示',
    trigger: { type: 'enter' },
    locations: ['town'],
    days: 'all',
    timeRanges: [[at(18), at(21)]],
    text: [
      '告示板前新贴了一张纸，边角还没压平。',
    ],
    choices: [
      {
        label: '读完',
        result: '告示说城外的旧驿道在修，商队改走南边；落款是商会。',
        effects: { minutes: 10 },
      },
      {
        label: '只看标题',
        result: '你扫了一眼标题：“驿道修缮，商队改道”。',
        effects: { minutes: 5 },
      },
      { label: '走', result: '你没有停下。' },
    ],
  },
  {
    id: 'npc_luca_step1',
    title: '错架的书',
    trigger: { type: 'enter' },
    locations: ['library'],
    days: 'workday',
    timeRanges: [[at(18), at(19)]],
    once: true,
    expCapTier: 2,
    requires: { npc: 'luca', flag: 'luca_step0', school: true },
    text: [
      '卢卡站在最里面那排，手里捏着一张借书条，来回看同一格书架。',
    ],
    choices: [
      {
        label: '帮他一起找',
        result: '你们把那一排从头到尾对了一遍，书被错放在上一层。',
        effects: { minutes: 20, exp: { knowledge: 1 }, affinity: { luca: 1 } },
      },
      {
        label: '指出大概位置',
        result: '你看了眼借书条，用手指点了点上面那层，说书应该在那儿。他愣了一下，伸手去够。',
        effects: { minutes: 5, affinity: { luca: 1 } },
      },
      { label: '不打扰', result: '你没有走过去。' },
    ],
  },
  {
    id: 'npc_mia_step1',
    title: '揉皱的试卷',
    trigger: { type: 'enter' },
    locations: ['canteen'],
    days: 'all',
    mealWindows: ['午餐'],
    once: true,
    expCapTier: 2,
    requires: { npc: 'mia', flag: 'mia_step0', school: true },
    text: [
      '米娅把一张揉皱的试卷摊在餐盘旁边，半天没动勺子。',
    ],
    choices: [
      {
        label: '陪她过一遍错题',
        result: '你把她的错题从头看了一遍，指出两道是同一个问题。她埋头改了起来。',
        effects: { minutes: 20, exp: { knowledge: 1 }, affinity: { mia: 2 } },
      },
      {
        label: '说两句宽心话',
        result: '你说下次会好的。她“嗯”了一声，把试卷折了起来。',
        effects: { minutes: 5, affinity: { mia: 1 } },
      },
      { label: '让她自己待会儿', result: '你低头吃自己的。她过了一会儿才动勺子。' },
    ],
  },
  {
    id: 'nora_asleep_at_desk',
    title: '灯还亮着',
    trigger: { type: 'enter' },
    locations: ['office'],
    days: 'all',
    timeRanges: [[at(21), at(21, 30)]],
    once: true,
    requires: { npc: 'nora', affinity: { npc: 'nora', min: 20 } },
    text: [
      '院长室的灯还亮着。诺拉趴在账本上睡着了，笔还夹在指间。',
    ],
    choices: [
      {
        label: '把外套盖在她肩上',
        result:
          '你把外套搭上去时，她动了一下，半睁开眼。看清是你，含混地说了一句“这么晚了”，又闭上眼，把外套往上拉了拉。',
        effects: { minutes: 5, affinity: { nora: 1 }, mood: 2 },
      },
      {
        label: '把账本合上，灯调小',
        result: '你把账本合上，把灯芯调小，屋里暗下来。',
        effects: { minutes: 2 },
      },
      { label: '关上门', result: '你轻轻带上门。' },
    ],
  },
]

export function eventMatches(event: GameEvent, data: GameData, trigger: EventTrigger): boolean {
  if (event.forcedOnly) return false
  if (event.once && data.events.seen.includes(event.id)) return false

  const semester = semesterState(data.day)
  if (event.requires?.school && (semester === 'summer' || semester === 'winter')) return false
  if (event.requires?.vacation && semester !== event.requires.vacation) return false

  if (event.requires) {
    if (event.requires.npc) {
      const npc = npcById(event.requires.npc)
      if (!npc || npcLocationAt(npc, data.day, data.minutes) !== data.location) return false
    }
    if (event.requires.affinity) {
      const { npc, min } = event.requires.affinity
      if ((data.affinity[npc] ?? 0) < min) return false
    }
    if (event.requires.flag && !data.flags[event.requires.flag]) return false
    if (event.requires.notFlag && data.flags[event.requires.notFlag]) return false
  }

  if (event.trigger.type !== trigger.type) return false
  if (event.trigger.type === 'after' && trigger.type === 'after') {
    if (event.trigger.action !== trigger.action) return false
    if (event.trigger.action === 'class' && trigger.action === 'class') {
      if (event.trigger.courseId !== trigger.courseId) return false
    }
  }
  if (!event.locations.includes(data.location)) return false

  const workday = weekday(data.day) < 5
  if (event.days === 'workday' && !workday) return false
  if (event.days === 'weekend' && workday) return false

  if (
    event.timeRanges &&
    !event.timeRanges.some(([start, end]) => data.minutes >= start && data.minutes < end)
  ) {
    return false
  }

  if (event.mealWindows && event.mealWindows.length > 0) {
    const meal = currentMeal(data.minutes)
    if (!meal || !event.mealWindows.includes(meal)) return false
  }

  const last = data.events.lastSeen[event.id]
  if (last !== undefined && data.day - last < EVENT_COOLDOWN_DAYS) return false

  const today = data.events.day === data.day ? data.events.today : []
  if (today.includes(event.id)) return false

  return true
}

export function choiceBlockedReason(data: GameData, effects?: EventEffects): string | null {
  if (!effects) return null
  if (effects.spirit !== undefined && effects.spirit < 0 && data.spirit < -effects.spirit) {
    return '精神不足'
  }
  if (effects.money !== undefined && effects.money < 0 && data.money < -effects.money) {
    return '金钱不足'
  }
  if (effects.meal && data.meals.day === data.day && data.meals[effects.meal]) {
    return effects.meal === 'breakfast'
      ? '已经吃过早餐了'
      : effects.meal === 'lunch'
        ? '已经吃过午餐了'
        : '已经吃过晚餐了'
  }
  return null
}

export function eventById(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

import { SKILL_LABEL, npcById, npcLocationAt, weekday } from './content'
import type { GameData, SkillKey } from './types'

export const EVENT_DAILY_CAP = 3
export const EVENT_GAP_MINUTES = 30
export const EVENT_CHANCE = 0.3
export const EVENT_COOLDOWN_DAYS = 3

export type EventTrigger =
  | { type: 'enter' }
  | {
      type: 'after'
      action: 'class' | 'study' | 'practice' | 'work' | 'pray' | 'eat' | 'backyard'
      subject?: string
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
  flag?: string
  meal?: 'breakfast' | 'lunch' | 'dinner'
}

export type EventChoice = {
  label: string
  result?: string
  effects?: EventEffects
}

function signed(value: number): string {
  return `${value > 0 ? '+' : ''}${value}`
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
  const parts: string[] = []
  if (effects.minutes) parts.push(`${effects.minutes} 分钟`)
  if (effects.money) parts.push(`金钱 ${signed(effects.money)}`)
  if (effects.stamina) parts.push(`体力 ${signed(effects.stamina)}`)
  if (effects.spirit) parts.push(`精神 ${signed(effects.spirit)}`)
  if (effects.mood) parts.push(`心情 ${signed(effects.mood)}`)
  if (effects.mana) parts.push(`魔力 ${signed(effects.mana)}`)
  if (effects.exp) {
    for (const [key, value] of Object.entries(effects.exp)) {
      if (!value || capped.includes(key as SkillKey)) continue
      parts.push(`${SKILL_LABEL[key as SkillKey]}经验 ${signed(value)}`)
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
  weight?: number
  once?: boolean
  expCapTier?: number
  requires?: {
    npc?: string
    affinity?: { npc: string; min: number }
    flag?: string
    notFlag?: string
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
        result: '你把外套搭在他肩上。他没醒，只是往书那边缩了缩。',
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
    timeRanges: [[at(11, 30), at(12, 30)]],
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
    timeRanges: [[at(11, 30), at(12, 30)]],
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
    days: 'workday',
    timeRanges: [[at(15), at(15, 29)]],
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
      { label: '不管', result: '你看了一眼，转身去等上课。' },
    ],
  },
  {
    id: 'lecture_alvin_notes',
    title: '阿尔文的批注',
    trigger: { type: 'after', action: 'class', subject: '法术导论' },
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
    trigger: { type: 'after', action: 'class', subject: '古典文学' },
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
    trigger: { type: 'after', action: 'class', subject: '体术课' },
    locations: ['yard'],
    days: 'workday',
    expCapTier: 2,
    text: [
      '体术课结束，其他人陆续离开。格里高利把木桩摆回原位，看了你一眼：“刚才那个动作，要再来一组吗？”',
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
    timeRanges: [
      [at(6), at(9)],
      [at(17, 30), at(20)],
    ],
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
      '客人走后，你在柜台角落发现两枚铜板，应该是刚才找零时落下的。店主正在里屋整理货物。',
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
        effects: { money: 2, mood: -1 },
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
        result: '你挑了一本还算完整的旧书，付了八枚铜币。',
        effects: { minutes: 10, money: -8, exp: { knowledge: 2 } },
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
        effects: { minutes: 5, money: -2, stamina: 5 },
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
]

export function eventMatches(event: GameEvent, data: GameData, trigger: EventTrigger): boolean {
  if (event.once && data.events.seen.includes(event.id)) return false

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
    if (event.trigger.subject && event.trigger.subject !== trigger.subject) return false
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

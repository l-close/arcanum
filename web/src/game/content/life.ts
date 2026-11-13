// arcanum: life
import { timePeriod } from './locations'
import { formatTime, semesterState, weekday } from './time'

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

export const MEAL_WINDOWS: Array<[number, number, string]> = [
  [6 * 60, 8 * 60, '早餐'],
  [11 * 60, 13 * 60, '午餐'],
  [17 * 60, 19 * 60, '晚餐'],
]

export function currentMeal(minutes: number): string | null {
  for (const [start, end, name] of MEAL_WINDOWS) {
    if (minutes >= start && minutes < end) return name
  }
  return null
}

export function mealWindowHint(minutes: number): string {
  const next = MEAL_WINDOWS.find(([start]) => start > minutes)
  if (next) {
    const [start, end, name] = next
    return `现在不是用餐时间。下一个用餐时段：${name} ${formatTime(start)}–${formatTime(end)}。`
  }
  const windows = MEAL_WINDOWS.map(
    ([start, end, name]) => `${name} ${formatTime(start)}–${formatTime(end)}`,
  ).join('，')
  return `现在不是用餐时间。${windows}。`
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

export const BELL_TOWER_OPEN_START = 7 * 60

export const BELL_TOWER_OPEN_END = 19 * 60

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

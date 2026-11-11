// arcanum: observatory

import type { Season } from '../types'
import { YEAR_DAYS, formatDate, formatMonthDay, isTimeWindow } from './time'
import { seasonOf, weatherOf, WEATHER_LABEL } from './weather'
import { nextExamTotal } from './schedule'

export const OBSERVATORY_OPEN_START = 19 * 60
export const OBSERVATORY_OPEN_END = 3 * 60
export const OBSERVE_MINUTES = 30
export const OBSERVE_SPIRIT = 1
export const OBSERVE_MOOD = 1
export const OBSERVE_KNOWLEDGE = 2
export const CALENDAR_MINUTES = 10
export const STAR_CHART_MINUTES = 5

export const SEASON_LABEL: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
}

export type StarConstellation = {
  id: string
  name: string
  season: Season
  lore: string
  stars: Array<[number, number]>
  lines: Array<[number, number]>
}

export const CONSTELLATIONS: StarConstellation[] = [
  {
    id: 'sprout',
    name: '新芽',
    season: 'spring',
    lore: '三颗星排成一条细线，末端微微弯起，像刚破土的芽。农人用它记春耕。',
    stars: [
      [18, 42],
      [38, 28],
      [58, 34],
      [76, 17],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    id: 'long_lamp',
    name: '长灯',
    season: 'summer',
    lore: '一串星从东边斜下来，像有人提着灯走夜路。夏夜最早亮起来。',
    stars: [
      [14, 14],
      [30, 24],
      [46, 33],
      [62, 30],
      [62, 45],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: 'harvest',
    name: '丰谷',
    season: 'autumn',
    lore: '几颗星挤在一起，边缘散开，像一束收下来的谷穗。商会用它算秋收。',
    stars: [
      [22, 30],
      [40, 20],
      [56, 34],
      [72, 25],
      [50, 44],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [4, 2],
    ],
  },
  {
    id: 'keep_fire',
    name: '守火',
    season: 'winter',
    lore: '四颗星围成一个小圈，冬天整夜不落。守夜的人说，看见它就说明火还没灭。',
    stars: [
      [34, 20],
      [62, 18],
      [68, 38],
      [32, 40],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ],
  },
]

export const OBSERVE_TEXTS = [
  '你在望远镜前站了一会儿。风从城墙外吹上来，城里的灯一盏盏亮着。',
  '伊芙把星图往你这边推了推，指着一处空白。你顺着她的手指看过去。',
  '天窗开着，星光落在桌上的铜尺上。你听见远处巡夜人的脚步声。',
]

export function observatoryOpenAt(minutes: number): boolean {
  return isTimeWindow(minutes, OBSERVATORY_OPEN_START, OBSERVATORY_OPEN_END)
}

/** 19:00–23:59 属于当天；00:00–03:00 属于前一天晚上。 */
export function nightKey(day: number, minutes: number): number {
  return minutes < OBSERVATORY_OPEN_END ? day - 1 : day
}

export function currentConstellation(day: number): StarConstellation {
  const season = seasonOf(day)
  return CONSTELLATIONS.find((c) => c.season === season) ?? CONSTELLATIONS[0]
}

export function nextSeasonStart(day: number): number {
  const current = seasonOf(day)
  for (let i = 1; i <= YEAR_DAYS; i += 1) {
    if (seasonOf(day + i) !== current) return day + i
  }
  return day + YEAR_DAYS
}

export function weatherBlocksStars(day: number): boolean {
  const weather = weatherOf(day)
  return weather === 'rain' || weather === 'snow'
}

export type CalendarInfo = {
  date: string
  season: string
  nextSeason: string
  constellation: string
  exam: string
  tomorrowWeather: string
}

export function calendarInfo(day: number, minutes: number, starChart: string[]): CalendarInfo {
  const constellation = currentConstellation(day)
  const examTotal = nextExamTotal(day, minutes)
  return {
    date: formatDate(day),
    season: SEASON_LABEL[seasonOf(day)],
    nextSeason: formatMonthDay(nextSeasonStart(day)).split(' · ')[0],
    constellation: starChart.includes(constellation.id)
      ? `${constellation.name}（已记录）`
      : '尚未记录',
    exam: examTotal === null
      ? '暂无'
      : formatMonthDay(Math.floor(examTotal / 1440)).split(' · ')[0],
    tomorrowWeather: WEATHER_LABEL[weatherOf(day + 1)],
  }
}

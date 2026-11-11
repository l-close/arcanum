// arcanum: weather
import type { Season, WeatherKind } from '../types'
import { hash01 } from './rng'
import { WEATHER_SCENES } from './textWeatherScenes'

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

export function weatherScene(locationId: string, day: number): string | null {
  if (!OUTDOOR.has(locationId)) return null
  const season = seasonOf(day)
  const weather = weatherOf(day)
  return WEATHER_SCENES[locationId]?.[season]?.[weather] ?? null
}

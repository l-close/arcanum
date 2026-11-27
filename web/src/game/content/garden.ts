// arcanum: garden

import type { GardenCropId } from '../types'

export const GARDEN_PLOTS = 4

export type GardenCropDef = {
  id: GardenCropId
  name: string
  seedId: string
  produceId: string
  growth: number
  yield: number
}

export const GARDEN_CROPS: Record<GardenCropId, GardenCropDef> = {
  cabbage: {
    id: 'cabbage',
    name: '白菜',
    seedId: 'cabbage_seed',
    produceId: 'cabbage',
    growth: 5,
    yield: 4,
  },
  lanfruit: {
    id: 'lanfruit',
    name: '兰果',
    seedId: 'lanfruit_seed',
    produceId: 'lanfruit',
    growth: 5,
    yield: 3,
  },
  bitterleaf: {
    id: 'bitterleaf',
    name: '苦叶',
    seedId: 'bitterleaf_seed',
    produceId: 'bitterleaf',
    growth: 4,
    yield: 3,
  },
}

export const GARDEN_CROP_ORDER: GardenCropId[] = ['cabbage', 'lanfruit', 'bitterleaf']

export function gardenCrop(id: GardenCropId): GardenCropDef {
  return GARDEN_CROPS[id]
}

export const CABBAGE_GROWTH = GARDEN_CROPS.cabbage.growth
export const CABBAGE_YIELD = GARDEN_CROPS.cabbage.yield

export const CABBAGE_SEED_ID = 'cabbage_seed'
export const LANFRUIT_SEED_ID = 'lanfruit_seed'
export const BITTERLEAF_SEED_ID = 'bitterleaf_seed'
export const FERTILIZER_ID = 'fertilizer'
export const CABBAGE_ID = 'cabbage'
export const LANFRUIT_ID = 'lanfruit'
export const LANFRUIT_JAM_ID = 'lanfruit_jam'
export const CABBAGE_SOUP_ID = 'cabbage_soup'

export const PLANT_MINUTES = 20
export const PLANT_STAMINA = 3

export const WATER_MINUTES = 15
export const WATER_STAMINA = 3

export const FERTILIZE_MINUTES = 10
export const FERTILIZE_STAMINA = 2
export const FERTILIZE_GROWTH = 1

export const HARVEST_MINUTES = 20
export const HARVEST_STAMINA = 3

export const COOK_MINUTES = 20
export const COOK_STAMINA = 2
export const JAM_MINUTES = 15
export const JAM_STAMINA = 1
export const COOK_OPEN_START = 6 * 60
export const COOK_OPEN_END = 21 * 60

// 打印某地点某层的 16 格：格 / 句式号 / 形状名 / 文本。
// 改某一格之前先跑它，别回查矩阵。
//
// 用法：node scripts/cell-report.mjs bellTower weather
//       node scripts/cell-report.mjs bellTower
//       node scripts/cell-report.mjs            # 全部地点两层

import { closeStyleData, loadStyleData } from './style-blocks.mjs'

const { sceneMaterials, SEASON_DESC, WEATHER_SCENES } = await loadStyleData()

const SEASONS = ['spring', 'summer', 'autumn', 'winter']
const SEASON_CN = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
const SLOT_CN = {
  season: ['晨', '昼', '暮', '夜'],
  weather: ['晴', '多云', '阴', '雨'],
}
const WEATHER_KEY = (seasonIndex, slot) =>
  slot === 0 ? 'sunny' : slot === 1 ? 'cloudy' : slot === 2 ? 'overcast' : seasonIndex === 3 ? 'snow' : 'rain'

function shapes(layer) {
  const list = layer === 'season' ? sceneMaterials.SEASON_SHAPES : sceneMaterials.WEATHER_SHAPES
  const map = new Map()
  for (const shape of list) map.set(shape.id, shape.name)
  return map
}

function report(location, layer) {
  const matrix = (layer === 'season' ? sceneMaterials.SEASON_MATRIX : sceneMaterials.WEATHER_MATRIX)[location]
  const src = layer === 'season' ? SEASON_DESC[location] : WEATHER_SCENES[location]
  if (!matrix || !src) return
  const nameOf = shapes(layer)

  console.log(`\n== ${location} / ${layer}`)
  console.log('  格        号  形状        文本')
  SEASONS.forEach((season, seasonIndex) => {
    for (let slot = 0; slot < 4; slot += 1) {
      const index = seasonIndex * 4 + slot
      const syntaxId = matrix[index]
      const text =
        layer === 'season'
          ? src[season]?.[slot]
          : src[season]?.[WEATHER_KEY(seasonIndex, slot)]
      const slotLabel = slot === 3 && layer === 'weather' && seasonIndex === 3 ? '雪' : SLOT_CN[layer][slot]
      console.log(
        `  ${SEASON_CN[season]}·${slotLabel.padEnd(3, '　')} ${String(syntaxId).padStart(2)}  ${(nameOf.get(syntaxId) ?? '?').padEnd(5, '　')}  ${text ?? ''}`,
      )
    }
  })
}

const target = process.argv[2]
const layerArg = process.argv[3]
const locations = target ? [target] : sceneMaterials.SCENE_LOCATIONS
const layers = layerArg ? [layerArg] : ['season', 'weather']
for (const location of locations) {
  for (const layer of layers) report(location, layer)
}
await closeStyleData()

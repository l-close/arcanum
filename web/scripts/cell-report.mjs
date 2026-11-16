// 查一个地点每格的真实句式号：改格之前先跑它，比回查矩阵快。
//
// 用法：node scripts/cell-report.mjs bellTower weather
//       node scripts/cell-report.mjs bellTower

import { closeStyleData, loadStyleData } from './style-blocks.mjs'

const { sceneMaterials, SEASON_DESC, WEATHER_SCENES } = await loadStyleData()
const [location, layerArg] = process.argv.slice(2)

if (!location) {
  console.error('用法：node scripts/cell-report.mjs <location> [season|weather]')
  process.exit(1)
}

const SEASON_CN = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
const SLOT_CN = {
  season: ['晨', '昼', '暮', '夜'],
  weather: ['晴', '多云', '阴', '雨/雪'],
}
const SEASONS = ['spring', 'summer', 'autumn', 'winter']

for (const layer of layerArg ? [layerArg] : ['season', 'weather']) {
  const matrix = layer === 'season' ? sceneMaterials.SEASON_MATRIX : sceneMaterials.WEATHER_MATRIX
  const row = matrix[location]
  const table = layer === 'season' ? SEASON_DESC[location] : WEATHER_SCENES[location]
  if (!row || !table) {
    console.error(`${location}: 没有 ${layer} 的矩阵或文本`)
    continue
  }
  const shapes = new Map(sceneMaterials.SHAPE_ANCHORS[layer].map((shape) => [shape.id, shape.name]))

  console.log(`\n== ${location} / ${layer}`)
  console.log('  格      句式            文本')
  let index = 0
  for (const season of SEASONS) {
    const cells = layer === 'season' ? table[season] : Object.values(table[season])
    for (let slot = 0; slot < 4; slot += 1) {
      const id = row[index]
      const label =
        layer === 'weather' && season === 'winter' && slot === 3
          ? '冬·雪'
          : `${SEASON_CN[season]}·${SLOT_CN[layer][slot]}`
      const text = cells[slot]
      console.log(
        `  ${label.padEnd(6, '　')} ${String(id).padStart(2)} ${String(shapes.get(id) ?? '').padEnd(6, '　')} ${text}`,
      )
      index += 1
    }
  }
}

await closeStyleData()

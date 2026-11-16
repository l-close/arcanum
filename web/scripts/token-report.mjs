// 写之前查 token 的分布：格数 / 带方位 / 距离告警还差几格。
//
// 用法：node scripts/token-report.mjs backyard
//       node scripts/token-report.mjs            # 全部地点

import { closeStyleData, loadStyleData } from './style-blocks.mjs'

const { styleRules, sceneMaterials, SEASON_DESC, WEATHER_SCENES } = await loadStyleData()
const orientation = styleRules.ORIENTATION_TERMS ?? []
const MIN_CELLS = styleRules.ANCHOR_MIN_CELLS ?? 5
const MIN_RATIO = styleRules.ANCHOR_MIN_RATIO ?? 0.75

function cellsOf(location, layer) {
  if (layer === 'season') {
    const table = SEASON_DESC[location]
    return table ? Object.values(table).flat() : []
  }
  const table = WEATHER_SCENES[location]
  return table ? Object.values(table).flatMap((season) => Object.values(season)) : []
}

function report(location, layer) {
  const table = sceneMaterials.MATERIALS[location]
  if (!table) return
  const cells = cellsOf(location, layer)
  if (cells.length === 0) return

  const aliases = table.aliases ?? {}
  const tokens = [
    ...new Set([
      ...sceneMaterials.generalTokens(table),
      ...sceneMaterials.seasonalTokens(table).keys(),
    ]),
  ]

  const rows = []
  for (const token of tokens) {
    const names = [token, ...Object.keys(aliases).filter((alias) => aliases[alias] === token)]
      .sort((a, b) => b.length - a.length)
    let count = 0
    let anchored = 0
    for (const text of cells) {
      if (!names.some((name) => text.includes(name))) continue
      count += 1
      let rest = text
      for (const name of names) rest = rest.split(name).join('\u0000')
      if (orientation.some((word) => rest.includes(word))) anchored += 1
    }
    if (count < 2) continue
    const ratio = anchored / count
    const triggered = anchored >= MIN_CELLS && ratio >= MIN_RATIO
    let gap = 0
    if (!triggered) {
      for (let need = anchored; need <= count; need += 1) {
        if (need >= MIN_CELLS && need / count >= MIN_RATIO) {
          gap = need - anchored
          break
        }
      }
    }
    rows.push({ token, count, anchored, ratio, triggered, gap })
  }

  if (rows.length === 0) return
  rows.sort((a, b) => b.ratio - a.ratio)
  console.log(`\n== ${location} / ${layer}（${cells.length} 格）`)
  for (const row of rows) {
    const pct = `${Math.round(row.ratio * 100)}%`.padStart(4)
    const state = row.triggered ? '已告警' : row.gap === 0 ? '—' : `差 ${row.gap} 格带方位`
    console.log(
      `  ${row.token.padEnd(6, '　')} ${String(row.count).padStart(2)} / ${row.anchored} ${pct}  ${state}`,
    )
  }
}

const target = process.argv[2]
const locations = target ? [target] : sceneMaterials.SCENE_LOCATIONS
for (const location of locations) {
  for (const layer of ['season', 'weather']) report(location, layer)
}
await closeStyleData()

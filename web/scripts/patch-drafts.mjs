// 批量改写 drafts/scene.jsonl 的唯一入口。
//
// 用法：
//   node scripts/patch-drafts.mjs <patch.jsonl> --layer season --expect 7 [--dry]
//
// 四条断言，任一不满足就退出、不写文件：
//   1. 每条 patch 的 layer 与 --layer 一致
//   2. (location, season, slot) 必须能在矩阵里找到，candidate 必须是 1–3
//   3. 每条 patch 在 drafts 里只能命中一次
//   4. 命中总数必须等于 --expect
//
// 写入是原子的：临时文件 → fsync → rename。

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { closeStyleData, loadStyleData } from './style-blocks.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const DRAFTS = path.resolve(here, '../../drafts/scene.jsonl')

function usage(message) {
  console.error(`patch-drafts: ${message}`)
  console.error('用法：node scripts/patch-drafts.mjs <patch.jsonl> --layer season|weather --expect N [--dry]')
  process.exit(1)
}

const argv = process.argv.slice(2)
const patchPath = argv.find((arg) => !arg.startsWith('--') && argv.indexOf(arg) === 0)
const layerIndex = argv.indexOf('--layer')
const expectIndex = argv.indexOf('--expect')
const dry = argv.includes('--dry')

if (!patchPath) usage('缺少 patch 文件')
const layer = layerIndex >= 0 ? argv[layerIndex + 1] : null
if (layer !== 'season' && layer !== 'weather') usage('--layer 必须是 season 或 weather')
const expect = expectIndex >= 0 ? Number(argv[expectIndex + 1]) : NaN
if (!Number.isInteger(expect) || expect < 0) usage('--expect 必须是整数')

const data = await loadStyleData()
const { sceneMaterials } = data
const matrix = layer === 'season' ? sceneMaterials.SEASON_MATRIX : sceneMaterials.WEATHER_MATRIX
const locations = new Set(sceneMaterials.SCENE_LOCATIONS)

/** 一行一条；_note 行跳过。 */
function parseLines(raw, label) {
  const entries = []
  raw.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return
    let parsed
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      usage(`${label} 第 ${index + 1} 行不是合法 JSON`)
    }
    if (parsed._note) return
    entries.push({ ...parsed, __line: index + 1 })
  })
  return entries
}

const patchRaw = await fs.readFile(patchPath, 'utf8').catch(() => usage(`读不到 ${patchPath}`))
const patches = parseLines(patchRaw, 'patch')

for (const patch of patches) {
  const where = `patch 第 ${patch.__line} 行`
  if (patch.layer !== layer) usage(`${where}: layer 是 ${patch.layer}，--layer 是 ${layer}`)
  if (!locations.has(patch.location)) usage(`${where}: 未知地点 ${patch.location}`)
  if (!Number.isInteger(patch.season) || patch.season < 0 || patch.season > 3) {
    usage(`${where}: season 必须是 0–3`)
  }
  if (!Number.isInteger(patch.slot) || patch.slot < 0 || patch.slot > 3) {
    usage(`${where}: slot 必须是 0–3`)
  }
  if (![1, 2, 3].includes(patch.candidate)) usage(`${where}: candidate 必须是 1–3`)
  if (typeof patch.text !== 'string' || !patch.text.trim()) usage(`${where}: text 为空`)

  const row = matrix[patch.location]
  const expectedSyntax = row?.[patch.season * 4 + patch.slot]
  if (expectedSyntax === undefined) {
    usage(`${where}: ${patch.location} ${patch.season}/${patch.slot} 在矩阵里没有对应的格`)
  }
  if (patch.syntaxId !== undefined && patch.syntaxId !== expectedSyntax) {
    usage(`${where}: syntaxId ${patch.syntaxId}，矩阵要求 ${expectedSyntax}`)
  }
}

const draftsRaw = await fs.readFile(DRAFTS, 'utf8')
const lines = draftsRaw.split(/\r?\n/)
const keyOf = (entry) =>
  `${entry.layer}|${entry.location}|${entry.season}|${entry.slot}|${entry.candidate}`

const draftIndex = new Map()
lines.forEach((line, index) => {
  const trimmed = line.trim()
  if (!trimmed || !trimmed.startsWith('{')) return
  let parsed
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    return
  }
  if (parsed._note) return
  const key = keyOf(parsed)
  if (!draftIndex.has(key)) draftIndex.set(key, [])
  draftIndex.get(key).push(index)
})

let total = 0
for (const patch of patches) {
  const hits = draftIndex.get(keyOf(patch)) ?? []
  if (hits.length !== 1) {
    usage(`${patch.location} ${patch.season}/${patch.slot} 候选${patch.candidate}: 命中 ${hits.length} 条，应为 1`)
  }
  total += 1
}
if (total !== expect) usage(`命中 ${total} 条，--expect 是 ${expect}`)

const updates = new Map()
for (const patch of patches) {
  updates.set(draftIndex.get(keyOf(patch))[0], patch.text)
}

console.log(`patch: ${patches.length} 条命中，layer=${layer}，写入 ${dry ? '否（dry）' : '是'}`)

if (!dry) {
  const next = lines
    .map((line, index) => {
      if (!updates.has(index)) return line
      const parsed = JSON.parse(line)
      parsed.text = updates.get(index)
      return JSON.stringify(parsed)
    })
    .join('\n')

  const tmp = `${DRAFTS}.tmp`
  try {
    const handle = await fs.open(tmp, 'w')
    try {
      await handle.writeFile(next, 'utf8')
      await handle.sync()
    } finally {
      await handle.close()
    }
    await fs.rename(tmp, DRAFTS)
  } catch (error) {
    await fs.rm(tmp, { force: true })
    usage(`原子写入失败：${error instanceof Error ? error.message : String(error)}`)
  }
}

await closeStyleData()

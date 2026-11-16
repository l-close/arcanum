import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  STYLE_PATH,
  extractCourseWordsBlock,
  readPackageVersion,
  readStyle,
} from './style-course-words.mjs'
import {
  BLOCKS,
  closeStyleData,
  extractBlock,
  loadStyleData,
  renderAnchorsBlock,
  renderBannedBlock,
} from './style-blocks.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const STATUS_PATH = path.resolve(here, '../../TEXT_STATUS.md')
const DRAFTS_PATH = path.resolve(here, '../../drafts/scene.jsonl')

const errors = []
const warnings = []
const err = (area, message) => errors.push(`[${area}] ${message}`)
const warn = (area, message) => warnings.push(`[${area}] ${message}`)

const SEASONS = ['spring', 'summer', 'autumn', 'winter']
const WEATHER_SLOTS = [
  ['sunny', 'cloudy', 'overcast', 'rain'],
  ['sunny', 'cloudy', 'overcast', 'rain'],
  ['sunny', 'cloudy', 'overcast', 'rain'],
  ['sunny', 'cloudy', 'overcast', 'snow'],
]

let source
try {
  source = await readStyle()
} catch {
  err('style', `找不到 STYLE.md: ${STYLE_PATH}`)
}

if (source) {
  let data = null
  try {
    data = await loadStyleData()
  } catch (error) {
    err('source', `源文件缺失或无法载入：${error instanceof Error ? error.message : String(error)}`)
  }

  if (data) {
    const { schedule, styleRules, sceneMaterials, locations, weather } = data
    await checkCourseBlock(source, schedule)
    checkBlocks(source, styleRules, sceneMaterials)
    checkMatrices(sceneMaterials, styleRules)
    await checkStatus(sceneMaterials, locations, weather)
    await checkSceneText(sceneMaterials, styleRules, schedule, data)
  }
}

await closeStyleData()

for (const message of errors) console.error(`ERROR ${message}`)
for (const message of warnings) console.warn(`WARN ${message}`)
console.log(`\nstyle validation: ${errors.length} errors, ${warnings.length} warnings`)
if (errors.length > 0) process.exitCode = 1

// ---------- 生成块 ----------

async function checkCourseBlock(text, schedule) {
  const version = await readPackageVersion()
  try {
    const { header, body } = extractCourseWordsBlock(text)
    const headerMatch = header.match(/^<!-- COURSE-WORDS: v(\S+) · (\d{4}-\d{2}-\d{2}) -->$/)
    if (!headerMatch) {
      err('COURSE-WORDS', '起始标记格式不正确，应包含版本与日期')
    } else if (headerMatch[1] !== version) {
      err(
        'COURSE-WORDS',
        `版本不一致：STYLE.md 为 v${headerMatch[1]}，package.json 为 v${version}`,
      )
    }
    const expected = schedule.COURSE_WORDS.join(' / ')
    if (body !== expected) {
      err('COURSE-WORDS', `内容与课程表不一致：\n  期望：${expected}\n  实际：${body}`)
    }
  } catch (error) {
    err('COURSE-WORDS', error instanceof Error ? error.message : String(error))
  }
}

function checkBlocks(text, styleRules, sceneMaterials) {
  const cases = [
    {
      block: BLOCKS.banned,
      source: 'styleRules.ts',
      render: () => renderBannedBlock(styleRules.BANNED_CATEGORIES),
    },
    {
      block: BLOCKS.anchors,
      source: 'sceneMaterials.ts',
      render: () => renderAnchorsBlock(sceneMaterials.SHAPE_ANCHORS),
    },
  ]

  for (const item of cases) {
    const label = item.block.label
    let extracted
    try {
      extracted = extractBlock(text, item.block)
    } catch (error) {
      err(label, error instanceof Error ? error.message : String(error))
      continue
    }
    if (!extracted.body) {
      err(label, '生成块为空，未生成')
      continue
    }
    if (extracted.body !== item.render()) {
      err(label, `生成块与 ${item.source} 不一致，请运行 npm run sync:style`)
    }
  }
}

// ---------- 矩阵 ----------

function checkMatrices(sceneMaterials, styleRules) {
  const ids = sceneMaterials.SCENE_LOCATIONS
  const cases = [
    ['season', sceneMaterials.SEASON_MATRIX, styleRules.SEASON_GROUPS],
    ['weather', sceneMaterials.WEATHER_MATRIX, styleRules.WEATHER_GROUPS],
  ]
  for (const [layer, matrix, groups] of cases) {
    if (Object.keys(matrix).length !== ids.length) {
      err('matrix', `${layer}: 矩阵有 ${Object.keys(matrix).length} 个地点，应为 ${ids.length}`)
    }
    for (const id of ids) {
      const row = matrix[id]
      if (!row) {
        err('matrix', `${layer}: ${id} 缺少矩阵行`)
        continue
      }
      if (row.length !== 16) {
        err('matrix', `${layer}: ${id} 有 ${row.length} 格，应为 16`)
        continue
      }
      const sorted = [...row].sort((a, b) => a - b)
      sorted.forEach((value, index) => {
        if (value !== index + 1) err('matrix', `${layer}: ${id} 不是 1–16 的置换`)
      })
      for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
          const index = r * 4 + c
          if (c < 3 && groups[row[index]] === groups[row[index + 1]]) {
            err('matrix', `${layer}: ${id} 第 ${index}/${index + 1} 格同组相邻`)
          }
          if (r < 3 && groups[row[index]] === groups[row[index + 4]]) {
            err('matrix', `${layer}: ${id} 第 ${index}/${index + 4} 格同组相邻`)
          }
        }
      }
      if (layer === 'season') {
        for (let season = 0; season < 4; season += 1) {
          if (row[season * 4] === 14) {
            err('matrix', `season: ${id} 的缺席落在晨格`)
          }
        }
      }
    }
  }
}

// ---------- TEXT_STATUS ----------

async function checkStatus(sceneMaterials, locations, weather) {
  let text
  try {
    text = await fs.readFile(STATUS_PATH, 'utf8')
  } catch {
    err('TEXT_STATUS', `找不到 ${STATUS_PATH}`)
    return
  }

  const lines = text.split(/\r?\n/)
  const headerIndex = lines.findIndex((line) => /^\|\s*id\s*\|/.test(line))
  if (headerIndex < 0) {
    err('TEXT_STATUS', '表格格式异常：缺少 id 列')
    return
  }

  const rows = []
  for (let i = headerIndex + 2; i < lines.length; i += 1) {
    const line = lines[i]
    if (!/^\|/.test(line)) break
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length !== 7) {
      err('TEXT_STATUS', `表格格式异常：第 ${i + 1} 行有 ${cells.length} 列，应为 7`)
      continue
    }
    rows.push({
      id: cells[0],
      name: cells[1],
      material: cells[2],
      season: cells[3],
      weather: cells[4],
    })
  }

  const expected = new Set(sceneMaterials.SCENE_LOCATIONS)
  const outdoor = new Set(weather.OUTDOOR)
  if (expected.size !== outdoor.size || [...expected].some((id) => !outdoor.has(id))) {
    err('scene', 'SCENE_LOCATIONS 与 weather.ts 的 OUTDOOR 不一致')
  }

  if (rows.length !== expected.size) {
    err('TEXT_STATUS', `表格有 ${rows.length} 行，应为 ${expected.size}`)
  }

  const seen = new Set()
  const names = new Set()
  for (const row of rows) {
    if (!/^[a-z][a-zA-Z]*$/.test(row.id)) {
      err('TEXT_STATUS', `${row.id}: id 格式异常`)
    }
    if (seen.has(row.id)) err('TEXT_STATUS', `${row.id}: id 重复`)
    seen.add(row.id)
    if (!expected.has(row.id)) {
      err('TEXT_STATUS', `${row.id}: 不在 SCENE_LOCATIONS 中`)
      continue
    }
    if (/\s/.test(row.name)) {
      err('TEXT_STATUS', `${row.id}: 地点名含空白字符`)
    }
    const derived = locations.getLocation(row.id).name
    if (row.name !== derived) {
      warn('TEXT_STATUS', `${row.id}: 地点名「${row.name}」与派生名「${derived}」不一致`)
    }
    if (names.has(derived)) {
      warn('TEXT_STATUS', `${row.id}: 派生名「${derived}」在 ${expected.size} 个地点中重复`)
    }
    names.add(derived)

    const hasMaterial = Boolean(sceneMaterials.MATERIALS[row.id])
    if (row.material === '已有' && !hasMaterial) {
      err('TEXT_STATUS', `${row.id}: 标为素材表已有，但 sceneMaterials.ts 缺失`)
    }
    if (row.material !== '已有' && hasMaterial) {
      warn('TEXT_STATUS', `${row.id}: sceneMaterials.ts 已有素材表，表格仍标为「${row.material}」`)
    }
  }

  for (const id of expected) {
    if (!seen.has(id)) err('TEXT_STATUS', `${id}: 表格缺少这一行`)
  }

  const seasonLocked = new Set(sceneMaterials.LOCKED.season)
  const weatherLocked = new Set(sceneMaterials.LOCKED.weather)
  for (const row of rows) {
    const markedSeason = row.season === '已锁'
    const markedWeather = row.weather === '已锁'
    if (markedSeason !== seasonLocked.has(row.id)) {
      err('TEXT_STATUS', `${row.id}: 季节标注「${row.season}」与 LOCKED.season 不一致`)
    }
    if (markedWeather !== weatherLocked.has(row.id)) {
      err('TEXT_STATUS', `${row.id}: 天气标注「${row.weather}」与 LOCKED.weather 不一致`)
    }
  }
  for (const id of seasonLocked) {
    if (!expected.has(id)) err('scene', `LOCKED.season 含未知地点 ${id}`)
  }
  for (const id of weatherLocked) {
    if (!expected.has(id)) err('scene', `LOCKED.weather 含未知地点 ${id}`)
  }
}

// ---------- 场景文本 ----------

async function checkSceneText(sceneMaterials, styleRules, schedule, data) {
  checkMaterialTables(sceneMaterials, styleRules)

  const drafts = await loadDrafts()
  const scans = [
    buildScan('season', sceneMaterials, drafts, data.SEASON_DESC),
    buildScan('weather', sceneMaterials, drafts, data.WEATHER_SCENES),
  ]

  checkOverrides(sceneMaterials, styleRules, schedule)
  checkDraftConsistency(sceneMaterials, drafts, data)

  for (const scan of scans) {
    checkQuota(scan, styleRules)
    checkMaterialCap(scan, styleRules, sceneMaterials)
    checkMagicDensity(scan, styleRules)
    checkDeadTokens(scan, styleRules, sceneMaterials)
    checkIso(scan, sceneMaterials, styleRules)
    checkRhythm(scan)
    checkColumn(scan, sceneMaterials)
    checkBigrams(scan, sceneMaterials, styleRules)
    for (const cell of scan.cells) {
      if (!cell.text) continue
      const hit = findBanned(cell.text, scan.layer, styleRules, schedule)
      if (hit) {
        err('scene', `${scan.layer}/${cell.location}/${cell.label}: 命中禁词「${hit.word}」（${hit.label}）`)
      }
      for (const prefix of styleRules.BANNED_LINE_START) {
        if (cell.text.startsWith(prefix)) {
          err('scene', `${scan.layer}/${cell.location}/${cell.label}: 句首禁词「${prefix}」`)
        }
      }
      if (cell.syntaxId !== cell.expectedSyntax) {
        err(
          'scene',
          `${scan.layer}/${cell.location}/${cell.label}: 句式号 ${cell.syntaxId}，矩阵要求 ${cell.expectedSyntax}`,
        )
      }
      checkMaterialHit(cell, scan.layer, sceneMaterials)
    }
  }
}

function checkDraftConsistency(sceneMaterials, drafts, data) {
  for (const draft of drafts) {
    const matrix =
      draft.layer === 'season' ? sceneMaterials.SEASON_MATRIX : sceneMaterials.WEATHER_MATRIX
    const expected = matrix[draft.location]?.[draft.season * 4 + draft.slot]
    if (expected !== undefined && draft.syntaxId !== expected) {
      err(
        'drafts',
        `${draft.layer}/${draft.location}/${draft.season}/${draft.slot}: 句式号 ${draft.syntaxId}，矩阵要求 ${expected}`,
      )
    }

    if (!draft.selected) continue
    const locked =
      draft.layer === 'season' ? sceneMaterials.LOCKED.season : sceneMaterials.LOCKED.weather
    if (!locked.includes(draft.location)) continue
    const table = draft.layer === 'season' ? data.SEASON_DESC : data.WEATHER_SCENES
    const text = readTableCell(draft.layer, table, draft.location, draft.season, draft.slot)
    if (text !== draft.text) {
      err(
        'drafts',
        `${draft.layer}/${draft.location}/${draft.season}/${draft.slot}: 选中候选与表不一致`,
      )
    }
  }
}

// ---------- 素材表 ----------
function checkMaterialTables(sceneMaterials, styleRules) {
  for (const [id, table] of Object.entries(sceneMaterials.MATERIALS)) {
    const general = new Set(sceneMaterials.generalTokens(table))
    const seasonal = sceneMaterials.seasonalTokens(table)

    for (const term of seasonal.keys()) {
      if (general.has(term)) {
        err('material', `${id}: 「${term}」同时登记在通用列与 seasonal`)
      }
    }

    for (const [alias, host] of Object.entries(table.aliases ?? {})) {
      if (!alias || /\s/.test(alias)) {
        err('material', `${id}: alias 为空或含空白`)
        continue
      }
      if (!general.has(host)) {
        err('material', `${id}: alias「${alias}」的宿主「${host}」不是通用 token`)
      } else if (!host.includes(alias)) {
        err('material', `${id}: alias「${alias}」不是宿主「${host}」的子串`)
      }
    }
  }

  // 规则 9：相邻地点的通用 token 重合率超过 50%，必须能说清区别。
  // 全城通用的基础设施词（石墙、石阶、车……）不计入，否则会顶出假警。
  const common = new Set(styleRules.COMMON_CITY_TOKENS ?? [])
  const tokenSets = Object.entries(sceneMaterials.MATERIALS).map(([id, table]) => [
    id,
    new Set(sceneMaterials.generalTokens(table).filter((token) => !common.has(token))),
  ])
  for (let i = 0; i < tokenSets.length; i += 1) {
    for (let j = i + 1; j < tokenSets.length; j += 1) {
      const [idA, setA] = tokenSets[i]
      const [idB, setB] = tokenSets[j]
      let overlap = 0
      for (const token of setA) if (setB.has(token)) overlap += 1
      const smaller = Math.min(setA.size, setB.size)
      if (smaller > 0 && overlap / smaller > 0.5) {
        warn(
          'material',
          `${idA} 与 ${idB} 通用 token 重合 ${overlap}/${smaller}（>50%），需要说清区别`,
        )
      }
    }
  }
}

function checkMaterialHit(cell, layer, sceneMaterials) {
  const table = sceneMaterials.MATERIALS[cell.location]
  if (!table) {
    err('material', `${layer}/${cell.location}: 已有文本但没有素材表`)
    return
  }
  const hits = sceneMaterials.hitTokens(table, cell.season)
  if (!hits.some((term) => cell.text.includes(term))) {
    err('material', `${layer}/${cell.location}/${cell.label}: 未命中任何素材（物件／声音／痕迹／本季词）`)
  }
  const seasonal = sceneMaterials.seasonalTokens(table)
  for (const [term, seasons] of seasonal) {
    if (cell.text.includes(term) && !seasons.has(cell.season)) {
      err(
        'material',
        `${layer}/${cell.location}/${cell.label}: 「${term}」只属于 ${[...seasons].join('/')}，出现在 ${cell.season}`,
      )
    }
  }
}

function checkMaterialCap(scan, styleRules, sceneMaterials) {
  const groups = new Map()
  for (const cell of scan.cells) {
    if (!groups.has(cell.location)) groups.set(cell.location, [])
    groups.get(cell.location).push(cell)
  }
  for (const [location, cells] of groups) {
    const table = sceneMaterials.MATERIALS[location]
    if (!table) continue
    const aliases = table.aliases ?? {}
    const hostAliases = new Map()
    for (const [alias, host] of Object.entries(aliases)) {
      if (!hostAliases.has(host)) hostAliases.set(host, [])
      hostAliases.get(host).push(alias)
    }
    const realTokens = [
      ...new Set([
        ...sceneMaterials.generalTokens(table),
        ...sceneMaterials.seasonalTokens(table).keys(),
      ]),
    ].sort((a, b) => b.length - a.length)

    // 先剔除真正的 token，剩下的才允许 alias 命中——避免「门」把「门洞／门轴」算到「两扇木门」头上。
    const matchedCells = cells.map((cell) => {
      let residual = cell.text
      const matched = new Set()
      for (const term of realTokens) {
        if (!residual.includes(term)) continue
        matched.add(term)
        residual = residual.split(term).join('\u0000')
      }
      return { text: cell.text, matched, residual }
    })

    const counts = []
    for (const term of realTokens) {
      const names = hostAliases.get(term) ?? []
      let count = 0
      let anchored = 0
      for (const cell of matchedCells) {
        const hit = cell.matched.has(term) || names.some((alias) => cell.residual.includes(alias))
        if (!hit) continue
        count += 1
        // 先剔掉锚点本身，再看残句里有没有方位词：井沿 自带的「沿」不算拿它定位。
        let rest = cell.text
        for (const name of [term, ...names].sort((a, b) => b.length - a.length)) {
          rest = rest.split(name).join('\u0000')
        }
        if (styleRules.ORIENTATION_TERMS.some((word) => rest.includes(word))) anchored += 1
      }
      if (count > 1) counts.push([term, count, anchored])
    }
    if (counts.length === 0) continue
    counts.sort((a, b) => b[1] - a[1])

    const reference = new Set(styleRules.REFERENCE_TERMS ?? [])
    const baseline = new Set(styleRules.ANCHOR_BASELINE ?? [])
    const minCells = styleRules.ANCHOR_MIN_CELLS ?? 5
    const minRatio = styleRules.ANCHOR_MIN_RATIO ?? 0.75
    for (const [term, count, anchored] of counts) {
      if (anchored < minCells || anchored / count < minRatio) continue
      const key = `${location}:${term}`
      if (baseline.has(key)) {
        console.log(
          `INFO [anchor] ${scan.layer}/${key}: ${count} 格，带方位 ${anchored}`,
        )
      } else {
        warn('anchor', `${scan.layer}/${key}: ${count} 格，带方位 ${anchored}`)
      }
    }
    if (styleRules.MATERIAL_TERM_CAP === null) {
      const top = counts
        .slice(0, 3)
        .map(
          ([term, count, anchored]) =>
            `${term} ${count}（${reference.has(term) ? '参照' : '物件'}，带方位 ${anchored}）`,
        )
        .join('，')
      console.log(`INFO [material] ${scan.layer}/${location}: ${top}`)
    } else if (counts[0][1] > styleRules.MATERIAL_TERM_CAP) {
      warn(
        'material',
        `${scan.layer}/${location}: 「${counts[0][0]}」出现 ${counts[0][1]} 格，上限 ${styleRules.MATERIAL_TERM_CAP}`,
      )
    }

    const ratio = styleRules.REFERENCE_RATIO ?? 0.4
    if (cells.length >= 8) {
      for (const term of reference) {
        const count = cells.filter((cell) => cell.text.includes(term)).length
        if (count / cells.length > ratio) {
          warn(
            'material',
            `${scan.layer}/${location}: 参照词「${term}」占 ${count}/${cells.length} 格（上限 ${Math.round(ratio * 100)}%）`,
          )
        }
      }
    }
  }
}

function checkIso(scan, sceneMaterials, styleRules) {
  const common = new Set(styleRules.COMMON_CITY_TOKENS ?? [])
  const byToken = new Map()
  const byHead = new Map()
  for (const cell of scan.cells) {
    const table = sceneMaterials.MATERIALS[cell.location]
    if (!table) continue
    for (const token of sceneMaterials.generalTokens(table)) {
      if (common.has(token)) continue
      if (!cell.text.includes(token)) continue
      const key = `${cell.syntaxId}|${token}`
      if (!byToken.has(key)) byToken.set(key, [])
      byToken.get(key).push(cell)
    }
    const key = `${cell.syntaxId}|${cell.text.slice(0, 5)}`
    if (!byHead.has(key)) byHead.set(key, [])
    byHead.get(key).push(cell)
  }
  const hits = []
  for (const [label, map] of [['token', byToken], ['head', byHead]]) {
    for (const [key, cells] of map) {
      const locations = [...new Set(cells.map((cell) => cell.location))]
      if (locations.length < 2) continue
      const [syntaxId, needle] = key.split('|')
      hits.push(`${scan.layer} ${label} 句式${syntaxId}「${needle}」← ${locations.join(' / ')}`)
    }
  }
  if (hits.length === 0) return
  console.log(`INFO [iso] ${scan.layer}: ${hits.length} 处同构风险`)
  for (const line of hits.slice(0, 20)) console.log(`  ${line}`)
  if (hits.length > 20) console.log(`  …… 其余 ${hits.length - 20} 处省略`)
}

function checkRhythm(scan) {
  const SEASON_LABEL = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
  const show = (label) => {
    const [season, slot] = label.split('/')
    return `${SEASON_LABEL[season] ?? season}/${slot}`
  }
  const groups = new Map()
  for (const cell of scan.cells) {
    const key = `${cell.location}/${cell.season}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(cell)
  }
  const hits = []
  for (const [key, cells] of groups) {
    for (let i = 0; i + 1 < cells.length; i += 1) {
      const a = cells[i].text.slice(0, 3)
      const b = cells[i + 1].text.slice(0, 3)
      if (a === b) {
        hits.push(`${key}: 相邻重复开头「${a}」—— ${show(cells[i].label)}、${show(cells[i + 1].label)}`)
      }
    }
  }
  // 季节层的时间是循环的：冬·夜之后就是春·晨。
  if (scan.layer === 'season') {
    for (const location of new Set(scan.cells.map((cell) => cell.location))) {
      const winter = groups.get(`${location}/winter`)
      const spring = groups.get(`${location}/spring`)
      if (!winter || !spring) continue
      const a = winter[winter.length - 1].text.slice(0, 3)
      const b = spring[0].text.slice(0, 3)
      if (a === b) {
        hits.push(`${location}/跨季: 相邻重复开头「${a}」—— ${show(winter[winter.length - 1].label)}、${show(spring[0].label)}`)
      }
    }
  }
  if (hits.length === 0) return
  const note = scan.layer === 'weather' ? '（设计顺序，非玩家时间顺序）' : ''
  console.log(`INFO [rhythm] ${scan.layer}: ${hits.length} 处相邻重复${note}`)
  for (const hit of hits) console.log(`  ${hit}`)
}

function seasonCn(label) {
  const map = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
  const [season, slot] = label.split('/')
  return `${map[season] ?? season}/${slot}`
}

/** 文本里最早出现的表内 token；同位置取更长的。 */
function firstToken(text, table, sceneMaterials) {
  const tokens = [...sceneMaterials.generalTokens(table), ...Object.keys(table.aliases ?? {})]
  let best = null
  for (const token of tokens) {
    const index = text.indexOf(token)
    if (index < 0) continue
    if (!best || index < best.index || (index === best.index && token.length > best.token.length)) {
      best = { token, index }
    }
  }
  return best ? best.token : null
}

function checkColumn(scan, sceneMaterials) {
  const columns = new Map()
  for (const cell of scan.cells) {
    const table = sceneMaterials.MATERIALS[cell.location]
    if (!table) continue
    const token = firstToken(cell.text, table, sceneMaterials)
    if (!token) continue
    const slot = cell.label.split('/')[1]
    const key = `${cell.location}/${slot}/${token}`
    if (!columns.has(key)) columns.set(key, [])
    columns.get(key).push(cell)
  }
  const hits = []
  for (const [key, cells] of columns) {
    if (cells.length < 3) continue
    const [location, slot, token] = key.split('/')
    hits.push(
      `${location}/${slot} 首个 token「${token}」× ${cells.length} —— ${cells.map((c) => seasonCn(c.label)).join('、')}`,
    )
  }
  if (hits.length === 0) return
  console.log(`INFO [column] ${scan.layer}: ${hits.length} 处跨季同 token 开头`)
  for (const hit of hits) console.log(`  ${hit}`)
}

function checkDeadTokens(scan, styleRules, sceneMaterials) {
  const minLen = styleRules.DEAD_TOKEN_MIN_LEN ?? 5
  const groups = new Map()
  for (const cell of scan.cells) {
    if (!groups.has(cell.location)) groups.set(cell.location, [])
    groups.get(cell.location).push(cell)
  }
  for (const [location, cells] of groups) {
    const table = sceneMaterials.MATERIALS[location]
    if (!table) continue
    const aliases = table.aliases ?? {}
    const dead = []
    for (const token of sceneMaterials.generalTokens(table)) {
      if (token.length < minLen) continue
      const names = Object.keys(aliases).filter((key) => aliases[key] === token)
      const hit = cells.some(
        (cell) => cell.text.includes(token) || names.some((name) => cell.text.includes(name)),
      )
      if (!hit) dead.push(token)
    }
    if (dead.length) {
      dead.sort((a, b) => b.length - a.length)
      warn('token', `${scan.layer}/${location}: ${dead.length} 个长 token 未命中 —— ${dead.join('、')}`)
    }
  }
}

function checkMagicDensity(scan, styleRules) {
  const terms = styleRules.MAGIC_TERMS ?? []
  if (terms.length === 0) return
  const groups = new Map()
  for (const cell of scan.cells) {
    if (!groups.has(cell.location)) groups.set(cell.location, [])
    groups.get(cell.location).push(cell)
  }
  for (const [location, cells] of groups) {
    const magic = cells.filter((cell) => terms.some((term) => cell.text.includes(term)))
    if (magic.length > 1) {
      warn('magic', `${scan.layer}/${location}: ${magic.length} 格带魔法词（上限 1）`)
    }
  }
}

function checkBigrams(scan, sceneMaterials, styleRules) {
  const texts = scan.cells.filter((cell) => cell.text)
  if (texts.length < 8) return
  const counts = new Map()
  for (const cell of texts) {
    const table = sceneMaterials.MATERIALS[cell.location]
    const terms = table
      ? [
          ...sceneMaterials.generalTokens(table),
          ...sceneMaterials.seasonalTokens(table).keys(),
          ...Object.keys(table.aliases ?? {}),
        ].sort((a, b) => b.length - a.length)
      : []
    let clean = cell.text
    for (const term of terms) clean = clean.split(term).join('\u0000')
    const seen = new Set()
    for (let i = 0; i < clean.length - 1; i += 1) {
      const pair = clean.slice(i, i + 2)
      if (pair.includes('\u0000')) continue
      if (/[\s，。、；：！“”（）]/.test(pair)) continue
      if (seen.has(pair)) continue
      seen.add(pair)
      counts.set(pair, (counts.get(pair) ?? 0) + 1)
    }
  }
  const floor = Math.max(3, Math.ceil(0.05 * texts.length))
  const stop = styleRules.BIGRAM_STOP_CHARS ?? ''
  const exceptions = new Set(styleRules.BIGRAM_EXCEPTIONS ?? [])
  const suppressed = new Map()
  for (const [pair, count] of counts) {
    if (count < floor) continue
    if (!exceptions.has(pair) && [...pair].some((char) => stop.includes(char))) {
      suppressed.set(pair, count)
      continue
    }
    warn('bigram', `${scan.layer}: 二元组「${pair}」出现 ${count} 次（共 ${texts.length} 句）`)
  }
  if (suppressed.size > 0) {
    const top = [...suppressed.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pair, count]) => `${pair} ${count}`)
      .join('，')
    console.log(`INFO [bigram:suppressed] ${scan.layer}: ${top}`)
  }
}

function buildScan(layer, sceneMaterials, drafts, table) {
  const locked = new Set(
    layer === 'season' ? sceneMaterials.LOCKED.season : sceneMaterials.LOCKED.weather,
  )
  const matrix = layer === 'season' ? sceneMaterials.SEASON_MATRIX : sceneMaterials.WEATHER_MATRIX
  const cells = []

  for (const location of sceneMaterials.SCENE_LOCATIONS) {
    const row = matrix[location] ?? []
    if (locked.has(location)) {
      for (let season = 0; season < 4; season += 1) {
        for (let slot = 0; slot < 4; slot += 1) {
          const index = season * 4 + slot
          const label = `${SEASONS[season]}/${slot}`
          const text = readTableCell(layer, table, location, season, slot)
          if (!text) {
            err('scene', `${layer}/${location}/${label}: 已锁定但缺文本`)
            continue
          }
          cells.push({
            location,
            label,
            season: SEASONS[season],
            text,
            syntaxId: row[index],
            expectedSyntax: row[index],
          })
        }
      }
    } else {
      for (const draft of drafts) {
        if (draft.location !== location || draft.layer !== layer || !draft.selected) continue
        const index = draft.season * 4 + draft.slot
        cells.push({
          location,
          label: `${SEASONS[draft.season]}/${draft.slot}`,
          season: SEASONS[draft.season],
          text: draft.text,
          syntaxId: draft.syntaxId,
          expectedSyntax: row[index],
        })
      }
    }
  }

  return { layer, cells }
}

function readTableCell(layer, table, location, season, slot) {
  const entry = table[location]
  if (!entry) return null
  if (layer === 'season') {
    return entry[SEASONS[season]]?.[slot] ?? null
  }
  return entry[SEASONS[season]]?.[WEATHER_SLOTS[season][slot]] ?? null
}

function checkQuota(scan, styleRules) {
  const groups = new Map()
  for (const cell of scan.cells) {
    if (!groups.has(cell.location)) groups.set(cell.location, [])
    groups.get(cell.location).push(cell)
  }
  for (const [location, cells] of groups) {
    const zhe = cells.filter((cell) => cell.text.includes('着')).length
    if (zhe > styleRules.QUOTA.zheMaxCells) {
      err('quota', `${scan.layer}/${location}: 含「着」的格 ${zhe} 个，上限 ${styleRules.QUOTA.zheMaxCells}`)
    }
    const compressed = cells.filter((cell) => styleRules.COMPRESSED_PATTERN.test(cell.text)).length
    if (compressed > styleRules.QUOTA.compressedMaxCells) {
      err(
        'quota',
        `${scan.layer}/${location}: 压缩构式 ${compressed} 格，上限 ${styleRules.QUOTA.compressedMaxCells}`,
      )
    }
  }
}

function checkOverrides(sceneMaterials, styleRules, schedule) {
  const overrides = sceneMaterials.EVENING_OVERRIDE ?? {}
  for (const [location, text] of Object.entries(overrides)) {
    if (!text || !text.trim()) {
      err('scene', `override/${location}: 空文本`)
      continue
    }
    const hit = findBanned(text, 'season', styleRules, schedule)
    if (hit) {
      err('scene', `override/${location}: 命中禁词「${hit.word}」（${hit.label}）`)
    }
    for (const prefix of styleRules.BANNED_LINE_START) {
      if (text.startsWith(prefix)) {
        err('scene', `override/${location}: 句首禁词「${prefix}」`)
      }
    }
  }
}

// ---------- 禁词 ----------

function findBanned(text, layer, styleRules, schedule) {
  let clean = text
  for (const noun of styleRules.ALLOWED_NOUNS) {
    clean = clean.split(noun).join('\u0000')
  }
  for (const category of styleRules.BANNED_CATEGORIES) {
    if (category.layers && !category.layers.includes(layer)) continue
    const words = category.key === 'course' ? schedule.COURSE_WORDS : category.words
    for (const word of words) {
      if (clean.includes(word)) return { word, label: category.label }
    }
  }
  return null
}

// ---------- drafts ----------

async function loadDrafts() {
  let raw
  try {
    raw = await fs.readFile(DRAFTS_PATH, 'utf8')
  } catch {
    return []
  }
  const entries = []
  raw.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return
    let parsed
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      err('drafts', `第 ${index + 1} 行不是合法 JSON`)
      return
    }
    if (parsed._note) return
    if (
      typeof parsed.location !== 'string' ||
      (parsed.layer !== 'season' && parsed.layer !== 'weather') ||
      typeof parsed.season !== 'number' ||
      typeof parsed.slot !== 'number' ||
      typeof parsed.syntaxId !== 'number' ||
      typeof parsed.text !== 'string'
    ) {
      err('drafts', `第 ${index + 1} 行字段不完整`)
      return
    }
    entries.push({ ...parsed, selected: parsed.selected === true })
  })

  const groups = new Map()
  for (const draft of entries) {
    const key = `${draft.layer}/${draft.location}/${draft.season}/${draft.slot}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(draft)
  }
  for (const [key, list] of groups) {
    const selected = list.filter((draft) => draft.selected)
    if (selected.length === 0) {
      warn('drafts', `${key}: 尚未选择候选`)
    } else if (selected.length > 1) {
      err('drafts', `${key}: 选中了 ${selected.length} 条候选`)
    }
    const skeletons = new Set(list.map((draft) => draft.skeleton).filter(Boolean))
    if (list.length === 3 && skeletons.size > 0 && skeletons.size < 3) {
      err('drafts', `${key}: 三条候选的表面骨架不足三种`)
    }
  }

  return entries
}

import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

const SOURCE_STYLE = 'web/src/game/content/styleRules.ts'
const SOURCE_SCENE = 'web/src/game/content/sceneMaterials.ts'

export const BLOCKS = {
  banned: {
    label: 'BANNED',
    start: /<!-- BANNED:START[^\n]*-->/,
    end: '<!-- BANNED:END -->',
    header: `<!-- BANNED:START 源：${SOURCE_STYLE} -->`,
  },
  anchors: {
    label: 'ANCHORS',
    start: /<!-- ANCHORS:START[^\n]*-->/,
    end: '<!-- ANCHORS:END -->',
    header: `<!-- ANCHORS:START 源：${SOURCE_SCENE} · SHAPE_ANCHORS -->`,
  },
}

let serverPromise = null

async function getServer() {
  if (!serverPromise) {
    serverPromise = createServer({
      root,
      appType: 'custom',
      logLevel: 'error',
      server: { middlewareMode: true },
    })
  }
  return serverPromise
}

export async function loadStyleData() {
  const server = await getServer()
  const [schedule, styleRules, sceneMaterials, locations, weather, seasonDesc, weatherScenes] =
    await Promise.all([
      server.ssrLoadModule('/src/game/content/schedule.ts'),
      server.ssrLoadModule('/src/game/content/styleRules.ts'),
      server.ssrLoadModule('/src/game/content/sceneMaterials.ts'),
      server.ssrLoadModule('/src/game/content/locations.ts'),
      server.ssrLoadModule('/src/game/content/weather.ts'),
      server.ssrLoadModule('/src/game/content/textSeasonDesc.ts'),
      server.ssrLoadModule('/src/game/content/textWeatherScenes.ts'),
    ])
  return {
    schedule,
    styleRules,
    sceneMaterials,
    locations,
    weather,
    SEASON_DESC: seasonDesc.SEASON_DESC,
    WEATHER_SCENES: weatherScenes.WEATHER_SCENES,
  }
}

export async function closeStyleData() {
  if (!serverPromise) return
  const server = await serverPromise
  await server.close()
  serverPromise = null
}

/** 取出生成块；标记缺失时抛错，不返回空体。 */
export function extractBlock(source, block) {
  const start = source.match(block.start)
  if (!start || start.index === undefined) {
    throw new Error(`STYLE.md 缺少 ${block.label} 起始标记`)
  }
  const startIndex = start.index
  const endIndex = source.indexOf(block.end, startIndex)
  if (endIndex < 0) {
    throw new Error(`STYLE.md 缺少 ${block.label} 结束标记`)
  }
  return {
    header: start[0],
    body: source.slice(startIndex + start[0].length, endIndex).trim(),
    startIndex,
    endIndex,
  }
}

/** 用给定内容替换生成块，标记本身保留。 */
export function replaceBlock(source, block, body) {
  const { startIndex, endIndex } = extractBlock(source, block)
  return (
    source.slice(0, startIndex) +
    `${block.header}\n\n${body}\n${block.end}` +
    source.slice(endIndex + block.end.length)
  )
}

export function renderBannedBlock(categories) {
  const rows = categories.map((category) =>
    category.words.length > 0
      ? `| ${category.label} | ${category.words.join('、')} |`
      : `| ${category.label} | ${category.note ?? '—'} |`,
  )
  return ['| 类别 | 词 |', '|---|---|', ...rows].join('\n')
}

function renderAnchorTable(title, shapes, head) {
  return [
    `### ${title}`,
    '',
    `| # | 句式 | ${head} |`,
    '|---|---|---|',
    ...shapes.map((shape) => `| ${shape.id} | ${shape.name} | ${shape.anchor} |`),
  ].join('\n')
}

export function renderAnchorsBlock(anchors) {
  return [
    renderAnchorTable('天气 16', anchors.weather, '锚句'),
    '',
    renderAnchorTable('季节 16', anchors.season, '锚句（演武场）'),
  ].join('\n')
}

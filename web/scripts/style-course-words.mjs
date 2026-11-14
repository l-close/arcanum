import { createServer } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const STYLE_PATH = path.resolve(here, '../../STYLE.md')
const PACKAGE_PATH = path.resolve(here, '../package.json')
const START_RE = /<!-- COURSE-WORDS:[^\n]*-->/
const END_MARKER = '<!-- /COURSE-WORDS -->'

export async function readPackageVersion() {
  const pkg = JSON.parse(await fs.readFile(PACKAGE_PATH, 'utf8'))
  return String(pkg.version)
}

export function currentDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`
}

export async function loadCourseWords() {
  const server = await createServer({
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
  })
  try {
    const mod = await server.ssrLoadModule('/src/game/content/schedule.ts')
    return mod.COURSE_WORDS
  } finally {
    await server.close()
  }
}

export function renderCourseWordsBlock(words, version, date) {
  return [
    `<!-- COURSE-WORDS: v${version} · ${date} -->`,
    words.join(' / '),
    END_MARKER,
  ].join('\n')
}

export function extractCourseWordsBlock(source) {
  const start = source.match(START_RE)
  if (!start || start.index === undefined) {
    throw new Error('STYLE.md 缺少 COURSE-WORDS 起始标记')
  }
  const startIndex = start.index
  const endIndex = source.indexOf(END_MARKER, startIndex)
  if (endIndex < 0) {
    throw new Error('STYLE.md 缺少 COURSE-WORDS 结束标记')
  }
  return {
    header: start[0],
    body: source.slice(startIndex + start[0].length, endIndex).trim(),
    startIndex,
    endIndex,
  }
}

export function replaceCourseWordsBlock(source, block) {
  const { startIndex, endIndex } = extractCourseWordsBlock(source)
  return (
    source.slice(0, startIndex) +
    block +
    source.slice(endIndex + END_MARKER.length)
  )
}

export async function readStyle() {
  return fs.readFile(STYLE_PATH, 'utf8')
}

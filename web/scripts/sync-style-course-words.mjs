import fs from 'node:fs/promises'
import {
  STYLE_PATH,
  currentDate,
  loadCourseWords,
  readPackageVersion,
  readStyle,
  renderCourseWordsBlock,
  replaceCourseWordsBlock,
} from './style-course-words.mjs'

const version = await readPackageVersion()
const words = await loadCourseWords()
const block = renderCourseWordsBlock(words, version, currentDate())
const source = await readStyle()
const next = replaceCourseWordsBlock(source, block)
await fs.writeFile(STYLE_PATH, next, 'utf8')
console.log(`style course words synced: ${words.length} courses -> ${STYLE_PATH}`)

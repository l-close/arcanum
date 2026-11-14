import {
  STYLE_PATH,
  extractCourseWordsBlock,
  loadCourseWords,
  readPackageVersion,
  readStyle,
} from './style-course-words.mjs'

const errors = []

let source
try {
  source = await readStyle()
} catch {
  errors.push(`找不到 STYLE.md: ${STYLE_PATH}`)
}

if (source) {
  const version = await readPackageVersion()
  const words = await loadCourseWords()
  try {
    const { header, body } = extractCourseWordsBlock(source)
    const headerMatch = header.match(
      /^<!-- COURSE-WORDS: v(\S+) · (\d{4}-\d{2}-\d{2}) -->$/,
    )
    if (!headerMatch) {
      errors.push('COURSE-WORDS 起始标记格式不正确，应包含版本与日期')
    } else if (headerMatch[1] !== version) {
      errors.push(
        `COURSE-WORDS 版本不一致：STYLE.md 为 v${headerMatch[1]}，package.json 为 v${version}`,
      )
    }
    const expected = words.join(' / ')
    if (body !== expected) {
      errors.push(`COURSE-WORDS 内容不一致：\n  期望：${expected}\n  实际：${body}`)
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR [style] ${error}`)
  process.exitCode = 1
} else {
  console.log('style validation: COURSE-WORDS 与课程表一致')
}

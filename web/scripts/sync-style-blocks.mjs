import fs from 'node:fs/promises'
import { STYLE_PATH, readStyle } from './style-course-words.mjs'
import {
  BLOCKS,
  closeStyleData,
  loadStyleData,
  renderAnchorsBlock,
  renderBannedBlock,
  replaceBlock,
} from './style-blocks.mjs'

const { styleRules, sceneMaterials } = await loadStyleData()

try {
  let source = await readStyle()
  source = replaceBlock(source, BLOCKS.banned, renderBannedBlock(styleRules.BANNED_CATEGORIES))
  source = replaceBlock(
    source,
    BLOCKS.anchors,
    renderAnchorsBlock(sceneMaterials.SHAPE_ANCHORS),
  )
  await fs.writeFile(STYLE_PATH, source, 'utf8')
  console.log('style blocks synced: BANNED, ANCHORS')
} finally {
  await closeStyleData()
}

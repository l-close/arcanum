// arcanum: greenhouse

import { isTimeWindow } from './time'

export const GREENHOUSE_OPEN_START = 8 * 60
export const GREENHOUSE_OPEN_END = 20 * 60
export const GREENHOUSE_VISIT_MINUTES = 15
export const GREENHOUSE_VISIT_MOOD = 2
export const GREENHOUSE_IDENTIFY_MINUTES = 30
export const GREENHOUSE_IDENTIFY_SPIRIT = 3
export const GREENHOUSE_IDENTIFY_EXP = 1

export const GREENHOUSE_HERB_STOCK: Record<string, number> = {
  bloodherb: 2,
  bitterleaf: 2,
}

export const GREENHOUSE_HERB_PRICES: Record<string, number> = {
  bloodherb: 5,
  bitterleaf: 4,
}

export const GREENHOUSE_VISIT_TEXTS = [
  '你在温室里慢慢走了一圈。玻璃顶上的水珠一颗颗往下滴，砖台边的陶盆排得很整齐。',
  '苔丝把一盆银叶草挪到光下，叶背亮了一下。你在旁边站了一会儿。',
  '最里面的门锁着，门缝里透出一点冷光。你没有靠近，转身去看另一排陶盆。',
]

export const GREENHOUSE_IDENTIFY_TEXTS = [
  '你对照木牌上的名字，翻看叶背的纹路。有一盆和牌子上写的不太一样。',
  '砖台边的木牌被水汽洇得发软，字还能看清。你蹲下来，一盆一盆认过去。',
  '你把几片叶子放在掌心，按木牌上记的气味一一对比。指尖沾了草汁。',
]

export function greenhouseOpenAt(minutes: number): boolean {
  return isTimeWindow(minutes, GREENHOUSE_OPEN_START, GREENHOUSE_OPEN_END)
}

// arcanum: desc
import type { Location } from './locations'
import { timePeriod } from './locations'
import type { Season } from './weather'
import { seasonOf } from './weather'
import { DESC_BY_TIME } from './textDescByTime'
import { SEASON_DESC } from './textSeasonDesc'

const WEST_STAGE1_DESC: Record<string, [string, string, string]> = {
  westTown: [
    '雾还是没散，但街上有几家店铺卸下了门板。有人挑着水从街口走过。',
    '风从空地那边吹过来，卷起一点灰。集市方向有人在说话，不像之前那么空。',
    '镇上亮着几盏灯，哨所和驻地之外，集市口也有一点光。',
  ],
  westGate: [
    '守卫在换岗，西墙的缺口已经补好。墙根下堆着新搬来的石料。',
    '木拒马挪开又合上，运货的车比之前多了一点。',
    '哨所的灯亮着，街灯也亮了一盏。木拒马没有挪开。',
  ],
  westInn: [
    '有人在棚下生火，锅里冒着热气。药箱重新装满了，靠墙码着。',
    '棚里空着，人都出去了。通铺上的被褥叠得比之前整齐。',
    '通铺上有人翻身，棚外有值守的人。药箱边多了一盏小灯。',
  ],
  westChapel: [
    '晨雾里，封条上的印记有些模糊。石阶被扫干净了，边上放着一小束枯花。',
    '日光照在石阶上，门里没有声音。',
    '礼拜堂沉在暗处，封条被风吹得轻轻响。门口的灰没有积起来。',
  ],
  westEdge: [
    '雾贴着地面，拒马修好了，木牌上的字还是看不清。',
    '风从田野那边吹过来，带着土腥味。路边的草被踩出一条窄路。',
    '拒马旁边多了一盏灯，路上还是没有脚印。',
  ],
  westMarket: [
    '两三个摊位重新开张，卖热食的锅刚架上。',
    '集市里有了说话声。旧货、土豆和几捆干柴摆在摊上。',
    '摊位陆续收了，只剩一盏灯亮着。有人还在收拾。',
  ],
  westTower: [
    '木梯修好了，踩上去不再响。塔顶有人影，正往田野那边看。',
    '哨塔的门开着，里面收拾过。风从塔顶穿过去，带着远处的土味。',
    '哨塔上亮着一盏灯。值守的人裹着旧衣，靠在栏杆边。',
  ],
}

export type WestDescState = {
  stage: number
  projects: Record<string, number>
}

function wallLine(p: number): string {
  if (p >= 4) return '西墙补好了，灰浆颜色比旁边的石头新。'
  if (p >= 3) return '西墙补了一半，灰浆还没干。'
  if (p >= 1) return '西墙的缺口边缘垒起了新石头。'
  return '西墙的缺口还在掉土。'
}

function ditchLine(p: number): string {
  if (p >= 4) return '水渠通了，路面的积水退下去一层。'
  if (p >= 3) return '水渠里的水开始动了。'
  if (p >= 1) return '水渠里的淤泥清开了一段。'
  return '水渠里的水几乎不流。'
}

function lampLine(p: number): string {
  if (p >= 4) return '集市口的灯全亮了。'
  if (p >= 3) return '集市口的灯亮了两盏。'
  if (p >= 1) return '集市口有一盏灯重新亮了起来。'
  return '集市口的街灯只剩一盏还亮着。'
}

export function locationDesc(
  loc: Location,
  minutes: number,
  day: number,
  west?: WestDescState,
): string {
  if (west && west.stage >= 1) {
    const stage1 = WEST_STAGE1_DESC[loc.id]
    if (stage1) return stage1[timePeriod(minutes)]
  }
  const seasonal = SEASON_DESC[loc.id]
  if (seasonal) return seasonal[seasonOf(day)][timePeriod(minutes)]
  const table = DESC_BY_TIME[loc.id]
  let text = table ? table[timePeriod(minutes)] : loc.desc
  if (west && west.stage === 0) {
    if (loc.id === 'westGate') {
      text = `${text} ${wallLine(west.projects.wall ?? 0)} ${ditchLine(west.projects.ditch ?? 0)}`
    } else if (loc.id === 'westMarket') {
      text = `${text} ${lampLine(west.projects.lamp ?? 0)}`
    }
  }
  return text
}

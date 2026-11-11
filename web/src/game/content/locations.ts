// arcanum: locations

export type Location = {
  id: string
  name: string
  parent?: string
  kind: 'area' | 'venue' | 'room' | 'wild'
  childLabel?: string
  desc: string
}

export const ENTER_MINUTES = 2

export const ROOM_MINUTES = 1

export const LOCATIONS: Location[] = [
  {
    id: 'town',
    name: '中央广场',
    kind: 'area',
    childLabel: '广场',
    desc: '广场中央有一座旧喷泉，四周是店铺和往来的行人。往东是学院区，往西是孤儿院和教堂。',
  },
  {
    id: 'craftDistrict',
    name: '工坊区',
    kind: 'area',
    childLabel: '工坊',
    desc: '窄街两侧是作坊和货栈，烟囱、铜招牌和热汽挤在一起。地上有车辙和散落的木屑。',
  },
  {
    id: 'academyStreet',
    name: '学院区',
    kind: 'area',
    desc: '缓坡向上，尽头是长明学院的门楼。这一带多是抱着书的学生。',
  },
  {
    id: 'orphanStreet',
    name: '孤儿院',
    kind: 'area',
    desc: '一片安静的地方，墙根长着草，教堂的尖顶从旁边露出来，尽头是孤儿院的院门。',
  },
  {
    id: 'churchStreet',
    name: '教堂',
    kind: 'area',
    desc: '教堂在孤儿院旁边，钟声从尖顶传下来，门前石阶被扫得很干净。',
  },
  {
    id: 'academy',
    name: '长明学院',
    parent: 'academyStreet',
    kind: 'venue',
    childLabel: '学院设施',
    desc: '石墙修得整齐，藤蔓顺着墙面往上爬。门内是一片铺着石板的庭院。',
  },
  {
    id: 'lecture',
    name: '讲堂',
    parent: 'academy',
    kind: 'room',
    desc: '长桌一排排摆到窗边，空气里有粉笔和纸页的味道。',
  },
  {
    id: 'library',
    name: '藏书阁',
    parent: 'academy',
    kind: 'room',
    desc: '书架一直排到天花板，最上面几层摆着成套的厚册。这里安静得能听见翻页声。',
  },
  {
    id: 'canteen',
    name: '食堂',
    parent: 'academy',
    kind: 'room',
    desc: '食堂里飘着炖菜和面包的味道，长桌旁坐满了学生。',
  },
  {
    id: 'yard',
    name: '演武场',
    parent: 'academy',
    kind: 'room',
    desc: '地面是压实的黄土，四周立着一圈木桩。风一吹，尘土轻轻扬起来。',
  },
  {
    id: 'brewery',
    name: '炼药室',
    parent: 'academy',
    kind: 'room',
    desc: '石台上摆着研钵和几把刀，墙边立着一排药柜。角落里的小炉常年温着，空气里有苦味和炭火气。',
  },
  {
    id: 'herbGarden',
    name: '药草园',
    parent: 'academy',
    kind: 'room',
    desc: '学院东侧围出一块坡地，几畦药草按颜色分开，木牌上写着名字。',
  },
  {
    id: 'potionWorkshop',
    name: '药剂工坊',
    parent: 'craftDistrict',
    kind: 'room',
    desc: '门口挂着铜釜招牌，熟客都叫这里铜釜工坊。里面是一排排药架和冒着热气的铜锅，学徒抱着货箱进出，空气里有苦味和炭火气。',
  },
  {
    id: 'greenhouse',
    name: '魔法植物温室',
    parent: 'craftDistrict',
    kind: 'room',
    desc: '药剂工坊后墙接出一间玻璃温室。矮砖墙托着铁架，斜玻璃顶伸到屋檐下，玻璃内侧刻着一圈保温的细符文。门口挂着手刻的木牌。',
  },
  {
    id: 'orphanage',
    name: '孤儿院正厅',
    parent: 'orphanStreet',
    kind: 'venue',
    childLabel: '房间',
    desc: '一栋旧但收拾得很干净的房子。正厅里摆着几张矮凳，墙上挂着孩子们的字。',
  },
  {
    id: 'dorm',
    name: '寝室',
    parent: 'orphanage',
    kind: 'room',
    desc: '寝室不大：一张床、一张桌子、一扇朝北的窗，床边多了一个小书柜。',
  },
  {
    id: 'orphanCanteen',
    name: '食堂',
    parent: 'orphanage',
    kind: 'room',
    desc: '长桌上摆着面包和稀粥，孩子们的声音比学院里吵得多。',
  },
  {
    id: 'backyard',
    name: '后院',
    parent: 'orphanage',
    kind: 'room',
    desc: '后院有一小块菜地，靠墙堆着柴火和旧木箱。',
  },
  {
    id: 'office',
    name: '院长室',
    parent: 'orphanage',
    kind: 'room',
    desc: '院长室很小，桌上堆着册子和没写完的信。窗台上放着一小盆薄荷。',
  },
  {
    id: 'commercial',
    name: '商业区',
    kind: 'area',
    childLabel: '店铺',
    desc: '两侧开着店铺，招牌在风里轻轻晃。人来人往，比学院那边热闹。',
  },
  {
    id: 'shop',
    name: '杂货店',
    parent: 'commercial',
    kind: 'room',
    desc: '货架上摆着药剂、绳索、纸笔和一些叫不出名字的小东西。柜台后面堆着账本。',
  },
  {
    id: 'weaponShop',
    name: '武具店',
    parent: 'commercial',
    kind: 'room',
    desc: '墙上挂着几把剑，柜台里放着磨刀石和皮鞘。空气里有铁锈和油的味道。',
  },
  {
    id: 'tavern',
    name: '酒馆',
    parent: 'commercial',
    kind: 'room',
    desc: '几张旧木桌，一盏吊灯，墙上钉着褪色的菜单。傍晚之后，这里才会真正热闹起来。',
  },
  {
    id: 'guild',
    name: '商会办事处',
    parent: 'commercial',
    kind: 'room',
    desc: '商会办事处里堆着账本和货单。柜台后面有人在核账，抬眼看你一下，又低下头。',
  },
  {
    id: 'bookshop',
    name: '旧书铺',
    parent: 'commercial',
    kind: 'room',
    desc: '旧书铺里堆着高低不齐的书堆，空气里有纸和灰尘的味道。柜台边摆着几本翻旧了的册子。',
  },
  {
    id: 'runeShop',
    name: '符文刻印铺',
    parent: 'commercial',
    kind: 'room',
    desc: '商业区靠里的一间窄铺子，门总是半开着。屋里更像工坊，不像店铺：厚木工作台占了半边，台面上摊着刻刀、铜粉和半成品的护符。',
  },
  {
    id: 'church',
    name: '教堂内堂',
    parent: 'churchStreet',
    kind: 'venue',
    childLabel: '教堂设施',
    desc: '门内的光线暗下来，空气里有蜡烛和旧木头的气味。',
  },
  {
    id: 'chapel',
    name: '祷告厅',
    parent: 'church',
    kind: 'room',
    desc: '长椅排成几列，彩窗把光切成一块一块。司祭塞缪尔在侧廊翻着旧册子，见习修女莉安在最后一排整理祷本。',
  },
  {
    id: 'relief',
    name: '救济院',
    parent: 'church',
    kind: 'room',
    desc: '救济院里堆着旧衣、面粉和几捆柴。玛尔塔在桌边登记名单，头也没抬。',
  },
  {
    id: 'bellTower',
    name: '钟楼',
    parent: 'church',
    kind: 'room',
    desc: '木楼梯很窄，越往上越冷。塔下有一条长凳，凳脚边放着一只旧水壶。',
  },
  {
    id: 'gate',
    name: '城门',
    kind: 'area',
    desc: '两扇厚重的木门嵌在石墙里，门洞上方刻着褪色的纹章。几名骑士守在两侧。',
  },
  {
    id: 'outside',
    name: '城外',
    kind: 'wild',
    childLabel: '城外地点',
    desc: '出了城门，风一下子大了。土路往南分岔，一边通向墓园，一边通向林子。',
  },
  {
    id: 'cemetery',
    name: '墓园',
    parent: 'outside',
    kind: 'room',
    desc: '矮石墙围着一片安静的坡地，墓碑一排排立着。守墓人坐在墙边，手里拿着一本名册。',
  },
  {
    id: 'forest',
    name: '森林',
    parent: 'outside',
    kind: 'room',
    desc: '树木很快密了起来，脚下的落叶踩上去很软。远处偶尔传来枝叶晃动的声音。',
  },
  {
    id: 'forestDeep',
    name: '森林深处',
    parent: 'forest',
    kind: 'room',
    desc: '树木更密，光被枝叶切成碎片。脚下的落叶很厚，远处偶尔有重物压过灌木的声音。',
  },
  {
    id: 'teleportRoom',
    name: '传送室',
    parent: 'academy',
    kind: 'room',
    desc: '房间中央嵌着一圈深色金属纹路，边缘刻着细小的符文。空气里有轻微的嗡鸣。',
  },
  {
    id: 'westTown',
    name: '边区小镇',
    kind: 'area',
    childLabel: '小镇地点',
    desc: '边区小镇比银月城小得多。街上的店铺大多关着门，风里带着湿土和柴烟的味道。',
  },
  {
    id: 'westGate',
    name: '镇口',
    parent: 'westTown',
    kind: 'room',
    desc: '石砌的传送阵嵌在镇口，边缘长着青苔。旁边是骑士团的哨所，木拒马横在路中间。再往外就是通往田野的土路。',
  },
  {
    id: 'westInn',
    name: '支援队驻地',
    parent: 'westTown',
    kind: 'room',
    desc: '学院支援队在镇边搭了几排木架和粗布棚。棚下是一排通铺，旁边堆着木箱、药箱和记录册。',
  },
  {
    id: 'westChapel',
    name: '旧礼拜堂',
    parent: 'westTown',
    kind: 'room',
    desc: '礼拜堂的门被木条封住，门上贴着教会与审判庭的封条。石阶上落着灰，门缝里看不到光。',
  },
  {
    id: 'westEdge',
    name: '镇外路口',
    parent: 'westTown',
    kind: 'room',
    desc: '一排木拒马横在路口，后面插着一块木牌，上面写着“未净化”。再往前，路就隐进灰蒙蒙的田野里。',
  },
  {
    id: 'westMarket',
    name: '边镇集市',
    parent: 'westTown',
    kind: 'room',
    desc: '集市口的木棚歪着，几个摊位空了很久。地上有烂菜叶和被风吹来的灰。',
  },
  {
    id: 'westTower',
    name: '旧哨塔',
    parent: 'westTown',
    kind: 'room',
    desc: '哨塔的木梯断了一级，塔顶的棚布被风吹开。上面很久没人上去了。',
  },
  {
    id: 'oldStation',
    name: '旧驿站',
    kind: 'room',
    desc: '官道旁的旧驿站，屋檐下挂着褪色的招牌。院子里停着两辆空货车，井台边堆着草料。',
  },
  {
    id: 'forestDepot',
    name: '林间货栈',
    kind: 'room',
    desc: '林子边缘的木棚，四周堆着货箱。风从树梢上压下来，带着湿木头的味道。',
  },
  {
    id: 'eastFarm',
    name: '东边农庄',
    kind: 'room',
    desc: '城东的田地，几间低矮的农舍。井台边放着水桶，远处有人弯着腰。',
  },
]

export function getLocation(id: string): Location {
  return LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0]
}

// ---------- 时段描述 / 天气 ----------

/** 0 = 早晨 06:00–11:00，1 = 白天 11:00–18:00，2 = 夜晚 18:00–06:00 */
export function timePeriod(minutes: number): 0 | 1 | 2 {
  if (minutes >= 6 * 60 && minutes < 11 * 60) return 0
  if (minutes >= 11 * 60 && minutes < 18 * 60) return 1
  return 2
}

export type Exit = { to: string; minutes: number }

const AREA_LINKS: Record<string, Exit[]> = {
  town: [
    { to: 'orphanStreet', minutes: 5 },
    { to: 'academyStreet', minutes: 5 },
    { to: 'commercial', minutes: 5 },
    { to: 'churchStreet', minutes: 5 },
    { to: 'craftDistrict', minutes: 5 },
  ],
  craftDistrict: [{ to: 'town', minutes: 5 }],
  orphanStreet: [
    { to: 'town', minutes: 5 },
    { to: 'churchStreet', minutes: 5 },
  ],
  academyStreet: [{ to: 'town', minutes: 5 }],
  churchStreet: [
    { to: 'town', minutes: 5 },
    { to: 'orphanStreet', minutes: 5 },
  ],
  commercial: [
    { to: 'town', minutes: 5 },
    { to: 'gate', minutes: 5 },
  ],
  gate: [
    { to: 'commercial', minutes: 5 },
    { to: 'outside', minutes: 5 },
  ],
  westTown: [],
}

export const CITY_AREA_IDS = [
  'craftDistrict',
  'churchStreet',
  'orphanStreet',
  'town',
  'academyStreet',
  'commercial',
  'gate',
]

export function isCityArea(id: string): boolean {
  return CITY_AREA_IDS.includes(id)
}

export function areaNeighbors(id: string): string[] {
  return (AREA_LINKS[id] ?? []).map((e) => e.to)
}

const LEGACY_EXITS: Record<string, Exit[]> = {
  outside: [
    { to: 'gate', minutes: 5 },
    { to: 'cemetery', minutes: 5 },
    { to: 'forest', minutes: 5 },
  ],
  cemetery: [
    { to: 'outside', minutes: 5 },
    { to: 'forest', minutes: 5 },
  ],
  forest: [
    { to: 'outside', minutes: 5 },
    { to: 'cemetery', minutes: 5 },
  ],
}

export function exitsOf(id: string): Exit[] {
  const loc = getLocation(id)
  if (loc.kind === 'area') {
    const links = AREA_LINKS[id] ?? []
    const children = LOCATIONS.filter((l) => l.parent === id).map((l) => ({
      to: l.id,
      minutes: ENTER_MINUTES,
    }))
    return [...links, ...children]
  }
  if (loc.kind === 'venue') {
    const back = loc.parent ? [{ to: loc.parent, minutes: ENTER_MINUTES }] : []
    const children = LOCATIONS.filter((l) => l.parent === id).map((l) => ({
      to: l.id,
      minutes: ROOM_MINUTES,
    }))
    return [...back, ...children]
  }
  if (loc.kind === 'room') {
    if (LEGACY_EXITS[id]) return LEGACY_EXITS[id]
    return loc.parent ? [{ to: loc.parent, minutes: ROOM_MINUTES }] : []
  }
  return LEGACY_EXITS[id] ?? []
}

function shortestPath(from: string, to: string): { minutes: number; path: string[] } | null {
  if (from === to) return { minutes: 0, path: [] }
  const dist = new Map<string, number>([[from, 0]])
  const prev = new Map<string, string>()
  const visited = new Set<string>()
  while (true) {
    let current: string | null = null
    let best = Infinity
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d
        current = id
      }
    }
    if (current === null) break
    visited.add(current)
    if (current === to) break
    for (const exit of exitsOf(current)) {
      const next = best + exit.minutes
      if (next < (dist.get(exit.to) ?? Infinity)) {
        dist.set(exit.to, next)
        prev.set(exit.to, current)
      }
    }
  }
  const total = dist.get(to)
  if (total === undefined) return null
  const path: string[] = []
  let cursor: string | undefined = to
  while (cursor !== undefined && cursor !== from) {
    path.unshift(cursor)
    cursor = prev.get(cursor)
  }
  return { minutes: total, path }
}

export function travelCost(from: string, to: string): number {
  return shortestPath(from, to)?.minutes ?? 15
}

export function routeBetween(from: string, to: string): string[] {
  return shortestPath(from, to)?.path ?? [to]
}

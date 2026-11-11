// arcanum: weather
import { hash01 } from './rng'

const OUTDOOR = new Set([
  'town',
  'academyStreet',
  'orphanStreet',
  'churchStreet',
  'craftDistrict',
  'academy',
  'orphanage',
  'commercial',
  'church',
  'yard',
  'herbGarden',
  'backyard',
  'bellTower',
  'gate',
  'outside',
  'cemetery',
  'forest',
  'forestDeep',
])

export type WeatherKind = 'sunny' | 'cloudy' | 'overcast' | 'rain' | 'snow'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const WEATHER_LABEL: Record<WeatherKind, string> = {
  sunny: '晴',
  cloudy: '多云',
  overcast: '阴',
  rain: '雨',
  snow: '雪',
}

/** 两个月一季：1–2 春、3–4 夏、5–6 秋、7–8 冬，之后循环 */
export function seasonOf(day: number): Season {
  const month = Math.floor(day / 28) + 1
  const index = Math.floor((((month - 1) % 8) + 8) % 8 / 2)
  return (['spring', 'summer', 'autumn', 'winter'] as const)[index]
}

const WEATHER_TABLE: Record<Season, Array<[WeatherKind, number]>> = {
  spring: [
    ['sunny', 0.4],
    ['cloudy', 0.3],
    ['overcast', 0.15],
    ['rain', 0.15],
  ],
  summer: [
    ['sunny', 0.45],
    ['cloudy', 0.25],
    ['overcast', 0.1],
    ['rain', 0.2],
  ],
  autumn: [
    ['sunny', 0.35],
    ['cloudy', 0.3],
    ['overcast', 0.2],
    ['rain', 0.15],
  ],
  winter: [
    ['sunny', 0.35],
    ['cloudy', 0.3],
    ['overcast', 0.2],
    ['snow', 0.15],
  ],
}

export function weatherOf(day: number): WeatherKind {
  const table = WEATHER_TABLE[seasonOf(day)]
  let r = hash01(day * 9973 + 17)
  for (const [kind, weight] of table) {
    if (r < weight) return kind
    r -= weight
  }
  return table[table.length - 1][0]
}

type SeasonSceneTable = Record<Season, Partial<Record<WeatherKind, string>>>

const WEATHER_SCENES: Record<string, SeasonSceneTable> = {
  town: {
    spring: {
      sunny: '阳光落在湿石板路上，街角的花摊刚支起来。',
      cloudy: '云影慢慢扫过街道，招牌的光一时亮一时暗。',
      overcast: '天色发灰，石板缝里还留着昨夜的潮气。',
      rain: '细雨打在石板上，行人贴着屋檐走。',
    },
    summer: {
      sunny: '日头把石板晒得发白，挑担的人沿着墙根走。',
      cloudy: '云影从街面上移过去，热气却没散。',
      overcast: '天色压低，街上的叫卖声也闷了下来。',
      rain: '骤雨砸在石板上，水顺着街口往下淌。',
    },
    autumn: {
      sunny: '阳光落在干爽的石板上，风把落叶卷到墙角。',
      cloudy: '云影掠过屋顶，街边的旗子被风吹得直响。',
      overcast: '天色阴沉，风里带着凉意。',
      rain: '冷雨打湿石板，行人把领口拢紧。',
    },
    winter: {
      sunny: '阳光照在薄雪上，石板路亮得刺眼。',
      cloudy: '云层压着城墙，街上的雪被踩成灰白的泥。',
      overcast: '天色灰沉，呼出的白气散得很慢。',
      snow: '雪落在街心，脚印很快又被盖住。',
    },
  },
  academyStreet: {
    spring: {
      sunny: '阳光落在坡道上，新叶的影子一晃一晃。',
      cloudy: '云从学院门楼上空滑过，坡道忽明忽暗。',
      overcast: '天色发灰，坡道上的学生低着头快步走。',
      rain: '细雨打在坡道上，石板有些滑。',
    },
    summer: {
      sunny: '日头直晒坡道，路面泛着白光。',
      cloudy: '云挡住太阳，坡道上还是闷。',
      overcast: '天色沉下来，远处有闷雷。',
      rain: '骤雨砸在坡道上，学生挤在门楼下躲雨。',
    },
    autumn: {
      sunny: '阳光穿过黄叶，坡道上落着碎金一样的光。',
      cloudy: '风卷着落叶从坡道上滚下去。',
      overcast: '天阴得早，学院门楼陷进灰里。',
      rain: '冷雨打湿了坡道，落叶贴在石板上。',
    },
    winter: {
      sunny: '雪后的坡道很亮，脚印一直通到学院门口。',
      cloudy: '云压着学院门楼，雪还没化。',
      overcast: '天光很淡，坡道上几乎没有人。',
      snow: '雪落在坡道上，很快盖住了脚印。',
    },
  },
  orphanStreet: {
    spring: {
      sunny: '阳光落在巷子的墙上，新草从石缝里钻出来。',
      cloudy: '云影扫过街口，晾着的衣服轻轻晃。',
      overcast: '天色发灰，沿街的门都关着。',
      rain: '细雨落在巷子里，墙根积起小水洼。',
    },
    summer: {
      sunny: '巷子被晒得发白，孩子们躲在屋檐下。',
      cloudy: '云把太阳挡住，墙根下还是闷得很。',
      overcast: '天色暗下来，远处的雷声滚过。',
      rain: '雨点砸在屋檐上，孩子们笑着往屋里跑。',
    },
    autumn: {
      sunny: '阳光照在落叶上，巷子一片暖黄。',
      cloudy: '风把落叶吹到墙根，堆成一小堆。',
      overcast: '巷子阴沉沉的，谁家的烟囱冒着烟。',
      rain: '冷雨打湿了石阶，柴火味更重了。',
    },
    winter: {
      sunny: '雪光映着屋檐，冰棱挂了一排。',
      cloudy: '云压得很低，巷子里的雪没有化。',
      overcast: '天光很淡，街口的脚印很少。',
      snow: '雪落在巷子里，孤儿院的窗透出暖光。',
    },
  },
  churchStreet: {
    spring: {
      sunny: '阳光落在教堂的石墙上，钟楼的影子拉得很长。',
      cloudy: '云从钟楼后面飘过，街上的光暗了一下。',
      overcast: '天色发灰，教堂的尖顶压着一层薄雾。',
      rain: '细雨落在石阶上，教堂门口有人在收伞。',
    },
    summer: {
      sunny: '钟楼被晒得发白，石阶烫脚。',
      cloudy: '云挡住太阳，教堂外安静下来。',
      overcast: '天色闷沉，钟声传得很远。',
      rain: '骤雨落在教堂门前，石阶很快湿透。',
    },
    autumn: {
      sunny: '阳光穿过落叶，教堂的窗映出暖光。',
      cloudy: '风把落叶扫到石阶下，钟声照常响。',
      overcast: '天阴得早，教堂的窗更亮了。',
      rain: '冷雨打在教堂门前，石阶一片湿滑。',
    },
    winter: {
      sunny: '雪落在教堂的尖顶上，钟楼在阳光里发亮。',
      cloudy: '云压着钟楼，街上的雪没有脚印。',
      overcast: '天光很淡，教堂的窗透出一点暖色。',
      snow: '雪落在石阶上，教堂门口的灯一直亮着。',
    },
  },
  academy: {
    spring: {
      sunny: '阳光把庭院的石板晒暖，藤蔓的新叶亮得发绿。',
      cloudy: '云影从石墙上滑过，庭院里忽明忽暗。',
      overcast: '天色发灰，石墙上的藤蔓一动不动。',
      rain: '雨顺着屋檐往下淌，庭院里积起一片片水洼。',
    },
    summer: {
      sunny: '日头晒得石板发烫，藤蔓的影子缩成一团。',
      cloudy: '云把光挡了一半，庭院里仍旧闷热。',
      overcast: '天色压得低，蝉声却更响了。',
      rain: '骤雨打在藤叶上，水从门廊前漫过去。',
    },
    autumn: {
      sunny: '阳光落在泛黄的藤叶上，庭院的影子拉得很长。',
      cloudy: '云影掠过石墙，风卷着落叶扫过石板。',
      overcast: '天色阴沉，藤蔓上只剩零星几片叶子。',
      rain: '冷雨敲着屋檐，落叶贴在湿石板上。',
    },
    winter: {
      sunny: '阳光照在墙头的积雪上，庭院亮得发白。',
      cloudy: '云层压着石墙，藤蔓上挂着薄冰。',
      overcast: '天光很淡，庭院里冷得没什么人停留。',
      snow: '雪压在藤蔓和墙头上，庭院里只剩踩雪的声音。',
    },
  },
  orphanage: {
    spring: {
      sunny: '阳光落在门口菜地的新叶上，土还带着湿气。',
      cloudy: '云影掠过屋顶，菜地里的光一晃一晃。',
      overcast: '天色发灰，晾在门口的衣裳被风吹得贴在绳上。',
      rain: '细雨敲着屋檐，菜地很快积起浅水。',
    },
    summer: {
      sunny: '日头晒着菜地，叶子有些发蔫，屋里开着窗。',
      cloudy: '云影盖过院子，热气从地面往上返。',
      overcast: '天色闷沉，孩子们都坐在门口不肯动。',
      rain: '雨点砸在菜叶和屋顶上，院子里一片湿响。',
    },
    autumn: {
      sunny: '阳光落在收过一茬的菜地上，墙边堆着干柴。',
      cloudy: '云影掠过屋顶，风把晾着的衣服吹得鼓起来。',
      overcast: '天色阴沉，门口的菜地只剩枯黄的叶。',
      rain: '冷雨打湿了门槛，屋里飘出煮粥的热气。',
    },
    winter: {
      sunny: '阳光照在薄雪上，烟囱冒出的白气很直。',
      cloudy: '云层压着屋顶，门口的雪被踩出几行脚印。',
      overcast: '天色灰沉，窗里透出一点昏黄的灯。',
      snow: '雪盖住菜地，门口只剩几行新踩的脚印。',
    },
  },
  commercial: {
    spring: {
      sunny: '阳光把招牌照得发亮，街边多了卖花的小摊。',
      cloudy: '云影在店铺之间移动，货摊上的光一闪一闪。',
      overcast: '天色发灰，街上的叫卖声低了下去。',
      rain: '细雨打在遮棚上，人挤在屋檐下等雨停。',
    },
    summer: {
      sunny: '日头晒得招牌发白，街上的人走得很快。',
      cloudy: '云影掠过街面，热气仍旧从石板上冒出来。',
      overcast: '天色闷沉，店铺把门帘放了下来。',
      rain: '骤雨砸在遮棚上，水顺着街边往下冲。',
    },
    autumn: {
      sunny: '阳光落在干爽的街面上，风把落叶吹到摊子边。',
      cloudy: '云影扫过招牌，摊主忙着压住被风吹起的布。',
      overcast: '天色阴沉，几个摊主已经在收布棚。',
      rain: '冷雨打湿招牌，行人把货摊往屋里挪。',
    },
    winter: {
      sunny: '阳光照在薄雪上，招牌上的冰凌慢慢滴水。',
      cloudy: '云层压着屋顶，街上的雪被踩得发黑。',
      overcast: '天色灰沉，店铺早早上了门板。',
      snow: '雪落进街道，车辙和脚印很快混成一片。',
    },
  },
  church: {
    spring: {
      sunny: '阳光落在神像的肩头，石阶缝里冒出细草。',
      cloudy: '云影从钟楼上滑过，石阶的光暗了下来。',
      overcast: '天色发灰，教堂的窗亮着，光落在湿石阶上。',
      rain: '细雨顺着檐角往下滴，石阶被打得发亮。',
    },
    summer: {
      sunny: '日头照着石阶，神像脚下摆着新采的花。',
      cloudy: '云影掠过钟楼，石阶上的热气散得慢。',
      overcast: '天色闷沉，教堂的门开着，里面传出很轻的诵声。',
      rain: '骤雨打在石阶上，水从台阶一级级往下流。',
    },
    autumn: {
      sunny: '阳光落在神像上，风把落叶吹到石阶边。',
      cloudy: '云影从钟楼上滑过去，石阶上的光暗下来。',
      overcast: '天色阴沉，教堂的窗透出一点暖光。',
      rain: '冷雨打湿石阶，落叶贴在台阶上。',
    },
    winter: {
      sunny: '阳光照在神像的积雪上，石阶亮得发白。',
      cloudy: '云层压着钟楼，石阶上的雪被踩成薄冰。',
      overcast: '天光很淡，教堂的窗透出的暖色格外明显。',
      snow: '雪落在神像的发间和肩头，石阶上很静。',
    },
  },
  yard: {
    spring: {
      sunny: '太阳晒暖了黄土，木桩上的露水很快干了。',
      cloudy: '云影在演武场上移过去，风里带着湿气。',
      overcast: '天色发灰，黄土的颜色也暗了下来。',
      rain: '细雨打在黄土上，地面慢慢变得泥泞。',
    },
    summer: {
      sunny: '日头把黄土晒得发烫，木桩的影子缩得很短。',
      cloudy: '云影掠过场地，热气仍旧从地面往上冒。',
      overcast: '天色闷沉，风里一点凉意也没有。',
      rain: '骤雨砸在黄土上，水洼很快连成一片。',
    },
    autumn: {
      sunny: '阳光落在干硬的黄土上，木桩的影子拉得很长。',
      cloudy: '云影扫过场地，风卷起一层薄土。',
      overcast: '天色阴沉，木桩上的旧刻痕被雨水泡得发黑。',
      rain: '冷雨打湿黄土，脚印陷得很深。',
    },
    winter: {
      sunny: '阳光照在薄雪上，黄土从雪里露出几块。',
      cloudy: '云层压着场地，木桩上结了一层薄冰。',
      overcast: '天光很淡，演武场空得没什么声音。',
      snow: '雪落在木桩和地面上，演武场没有一点声音。',
    },
  },
  backyard: {
    spring: {
      sunny: '阳光落在菜地的新叶上，墙边的柴堆还带着潮气。',
      cloudy: '云影盖过院子，菜叶上的光暗了下来。',
      overcast: '天色发灰，菜叶和柴堆都褪成了暗色。',
      rain: '细雨打在菜叶和柴堆上，院子里一片湿冷。',
    },
    summer: {
      sunny: '日头晒着菜地，叶子有些打蔫，旧木箱被晒得发烫。',
      cloudy: '云影掠过院子，热气仍旧闷在墙里。',
      overcast: '天色闷沉，柴堆边的虫声没停过。',
      rain: '雨点砸在菜叶和木箱上，地上很快积起水。',
    },
    autumn: {
      sunny: '阳光落在收过菜的土垄上，风把枯叶吹到墙根。',
      cloudy: '云影扫过院子，柴堆边的光忽明忽暗。',
      overcast: '天色阴沉，柴堆占了半边院子，剩下的路只够一个人走。',
      rain: '冷雨打湿柴堆，土垄里积起一洼洼水。',
    },
    winter: {
      sunny: '阳光照在薄雪上，柴堆顶上的雪开始化。',
      cloudy: '云层压着院墙，木箱上结了一层白霜。',
      overcast: '天光很淡，后院冷得没什么声音。',
      snow: '雪压在柴堆和菜畦上，后院安静下来。',
    },
  },
  bellTower: {
    spring: {
      sunny: '阳光从钟口斜照进来，灰尘在光柱里浮动。',
      cloudy: '云影掠过钟楼，钟口的光忽明忽暗。',
      overcast: '天色发灰，钟楼里灌着风，木楼梯凉得透手。',
      rain: '细雨从钟口飘进来，木楼梯被打湿了一片。',
    },
    summer: {
      sunny: '阳光直直落进钟口，楼梯被晒得发烫。',
      cloudy: '云影盖住钟楼，风从钟口灌进来还是热的。',
      overcast: '天色闷沉，钟楼里闷得透不过气。',
      rain: '骤雨从钟口泼进来，木楼梯上一片水声。',
    },
    autumn: {
      sunny: '阳光斜着照进钟口，风把落叶卷上楼梯。',
      cloudy: '云影掠过钟楼，钟口的铜色暗了下来。',
      overcast: '天色阴沉，钟楼里比外面更凉。',
      rain: '冷雨飘进钟口，楼梯上一片湿滑。',
    },
    winter: {
      sunny: '阳光照在钟口的积雪上，冰凌在檐下滴水。',
      cloudy: '云层压着钟楼，铜钟上结了一层白霜。',
      overcast: '天光很淡，风从钟口灌进来，带着细碎的冰粒。',
      snow: '雪从钟口落进来，在楼梯上积了薄薄一层。',
    },
  },
  gate: {
    spring: {
      sunny: '阳光照在门洞的石墙上，骑士的盔甲晃得发亮。',
      cloudy: '云影从城墙上移过去，门洞里的光暗了一半。',
      overcast: '天色发灰，城门上的纹章几乎看不清了。',
      rain: '细雨顺着城墙往下淌，门洞前积了一片水。',
    },
    summer: {
      sunny: '日头晒着门洞，石墙热得烫手。',
      cloudy: '云影掠过城墙，门洞里仍旧闷热。',
      overcast: '天色闷沉，守门的骑士也躲进了阴影里。',
      rain: '骤雨打在门洞上，水顺着墙根往外流。',
    },
    autumn: {
      sunny: '阳光落在干爽的石墙上，风把落叶吹进门洞。',
      cloudy: '云影扫过城墙，门洞里的光晃了晃。',
      overcast: '天色阴沉，城门上的纹章被雨水冲得发白。',
      rain: '冷雨打湿石阶，骑士把披风拢紧。',
    },
    winter: {
      sunny: '阳光照在门洞的薄雪上，石墙亮得发白。',
      cloudy: '云层压着城墙，骑士的肩甲上落了一层霜。',
      overcast: '天光很淡，门洞里呼出的白气散得很慢。',
      snow: '雪落在门洞和骑士的肩甲上，脚印一直延伸到城里。',
    },
  },
  outside: {
    spring: {
      sunny: '阳光落在土路两旁的新草上，风里带着土腥味。',
      cloudy: '云影从坡地上滑过去，土路一时亮一时暗。',
      overcast: '天色发灰，远处的林子压着一层青灰色的雾。',
      rain: '细雨把土路打得发软，草叶上全是水。',
    },
    summer: {
      sunny: '日头晒得土路发白，草叶被晒得卷起来。',
      cloudy: '云影掠过坡地，风里仍旧带着热气。',
      overcast: '天色闷沉，远处的林子像压着一层雾。',
      rain: '骤雨把土路打得泥泞，水顺着坡往下流。',
    },
    autumn: {
      sunny: '阳光落在干黄的草坡上，风把落叶吹上土路。',
      cloudy: '云影扫过坡地，土路上的光忽明忽暗。',
      overcast: '天色阴沉，远处的林子只剩一道黑边。',
      rain: '冷雨打湿土路，草叶贴在泥里。',
    },
    winter: {
      sunny: '阳光照在薄雪上，土路的车辙冻得发硬。',
      cloudy: '云层压着坡地，远处的林子只剩灰白的轮廓。',
      overcast: '天光很淡，风从林子里吹出来，带着寒气。',
      snow: '雪盖住了土路，车辙和脚印都变得很浅。',
    },
  },
  cemetery: {
    spring: {
      sunny: '阳光落在新返青的草地上，墓碑的影子很清楚。',
      cloudy: '云影慢慢掠过坡地，草叶上的光暗了下来。',
      overcast: '天色发灰，墓园里没有风，连草都不动。',
      rain: '细雨打在石碑上，草里积起一片片水洼。',
    },
    summer: {
      sunny: '日头晒着坡地，草长得很高，蝉声从墙外传进来。',
      cloudy: '云影掠过墓园，热气闷在石墙里。',
      overcast: '天色闷沉，风穿过草丛，带着潮气。',
      rain: '雨点打在石碑上，水顺着碑面往下流。',
    },
    autumn: {
      sunny: '阳光落在枯黄的草地上，风把落叶扫到碑脚。',
      cloudy: '云影扫过坡地，墓碑一排排暗下去。',
      overcast: '天色阴沉，枯叶贴着石碑堆在墙根。',
      rain: '冷雨打湿墓碑，草里积起浑浊的水洼。',
    },
    winter: {
      sunny: '阳光照在碑顶的积雪上，坡地亮得发白。',
      cloudy: '云层压着墓园，石碑上的雪冻成了薄冰。',
      overcast: '天光很淡，守墓人屋里的灯亮着。',
      snow: '雪盖住了坡地，只剩碑顶一排排露在外面。',
    },
  },
  forest: {
    spring: {
      sunny: '阳光从新叶间漏下来，地上落着一小块一小块的光。',
      cloudy: '云影从枝叶间滑过，林子里忽明忽暗。',
      overcast: '天色发灰，树干的颜色深得像刚淋过雨。',
      rain: '细雨打在叶子上，整片林子都是细密的响声。',
    },
    summer: {
      sunny: '阳光从密叶里漏下来，落在地上碎成一小块一小块。',
      cloudy: '云把光挡了大半，林子里闷得没有风。',
      overcast: '天色闷沉，蝉声压得很低。',
      rain: '骤雨打在叶子上，水顺着树干往下淌。',
    },
    autumn: {
      sunny: '阳光落在泛黄的叶子上，风一吹就有叶子飘下来。',
      cloudy: '云影扫过林梢，地上的光斑晃了晃。',
      overcast: '天色阴沉，枯叶铺满了整条小路。',
      rain: '冷雨打落了不少叶子，林子里一片湿响。',
    },
    winter: {
      sunny: '雪压着枝头，阳光一照，树干上的雪簌簌往下掉。',
      cloudy: '云层压着林梢，枝头的雪化了一半，露出深色的树皮。',
      overcast: '天光很淡，林子里静得只剩风声。',
      snow: '雪落在枝头和小路上，偶尔有一小团从高处掉下来。',
    },
  },
}

export function weatherScene(locationId: string, day: number): string | null {
  if (!OUTDOOR.has(locationId)) return null
  const season = seasonOf(day)
  const weather = weatherOf(day)
  return WEATHER_SCENES[locationId]?.[season]?.[weather] ?? null
}

// arcanum: forest

export const FOREST_MAX_DEPTH = 2

export const FOREST_MOVE_MINUTES = 10

export const FOREST_EXPLORE_MINUTES = 15
export const FOREST_EXPLORE_STAMINA = 2
export const FOREST_DEEP_EXPLORE_MINUTES = 30
export const FOREST_DEEP_EXPLORE_STAMINA = 6

export const FOREST_DEPTH_MOVE_TEXTS = [
  '你往深处走了一段。树影压下来，路只剩一条踩出来的痕迹。',
  '你又往里走了一段。光只剩几道细线，脚下的落叶更厚了。',
  '前面的树忽然让开一小块空地，你走进了森林深处。',
]

export const FOREST_BACK_TEXTS = [
  '你沿着来路往外走了一段。',
  '你退回林子外围。',
  '你从森林深处退了出来。',
]

export const FOREST_EMPTY_TEXTS: Record<number, string[]> = {
  0: [
    '你沿着小路走了一段，鞋底沾了泥。',
    '林子里很安静，只有枝叶晃动的声音。',
  ],
  1: [
    '树影压下来，路只剩一条踩出来的痕迹。',
    '前面有枝条折断的声音，但什么也没出现。',
  ],
  2: [
    '光只剩几道细线，脚下的落叶很厚。',
    '你停下来听了一会儿，只有风。',
  ],
  3: [
    '你往林子深处走了一段。除了被踩倒的草和新泥印，什么也没发现。',
    '深处的枝叶很静，连鸟声都没有。',
  ],
}

export const FOREST_DEPTH_ENCOUNTER_CHANCE: Record<number, number> = {
  0: 0.25,
  1: 0.27,
  2: 0.3,
  3: 0.2,
}

export const FOREST_ENEMY_POOLS: Record<number, Array<[string, number]>> = {
  0: [
    ['slime', 60],
    ['viper', 40],
  ],
  1: [
    ['slime', 30],
    ['viper', 55],
    ['gray_wolf', 15],
  ],
  2: [
    ['slime', 10],
    ['viper', 25],
    ['gray_wolf', 40],
    ['boar', 25],
  ],
  3: [
    ['viper', 10],
    ['gray_wolf', 50],
    ['boar', 35],
  ],
}

export const FOREST_ELITE_CHANCE = 0.05
export const FOREST_AVOID_MINUTES = 10

export const FOREST_ENCOUNTER_TEXTS: Record<string, string> = {
  slime: '灌木里传来黏腻的声响。',
  viper: '草叶间传来细碎的沙沙声。',
  gray_wolf: '低处的枝叶被什么压开了。',
  boar: '前面的灌木被撞开，枝叶还在晃。',
  gray_wolf_alpha: '前面的灌木被撞开，这一次撞开它的东西很大。',
  boar_king: '前面的灌木被撞开，这一次撞开它的东西很大。',
}

export const FOREST_CAMP_DISCOVERY_TEXT =
  '树后有一处石坳，里面堆着熄掉的火和压平的草。这里之前有人住过。'

export const FOREST_CAMP_HINT = '石坳里的旧营地还在。'

export const FOREST_CAMP_REST_MINUTES = 30
export const FOREST_CAMP_REST_STAMINA = 6
export const FOREST_CAMP_LOOT_MINUTES = 20
export const FOREST_CAMP_LOOT_COPPER = 3
export const FOREST_CAMP_SEARCH_MINUTES = 20
export const FOREST_CAMP_SEARCH_COPPER = 1

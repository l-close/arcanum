// arcanum: crafting

export const WEAPON_SHOP_OPEN_START = 8 * 60
export const WEAPON_SHOP_OPEN_END = 20 * 60

export type CraftRecipe = {
  id: string
  name: string
  result: string
  materials: Record<string, number>
  cost: number
  minutes: number
  desc: string
}

export const CRAFT_RECIPES: CraftRecipe[] = [
  {
    id: 'studded_leather',
    name: '镶钉皮甲',
    result: 'studded_leather',
    materials: { beast_hide: 3, boar_tusk: 2 },
    cost: 25,
    minutes: 60,
    desc: '把铁钉一颗颗铆进皮甲，肩口用野猪牙磨成的扣子扣住。',
  },
  {
    id: 'tusk_necklace',
    name: '兽牙项链',
    result: 'tusk_necklace',
    materials: { boar_tusk: 2 },
    cost: 10,
    minutes: 30,
    desc: '在野猪牙根部钻孔，穿进一根皮绳，收口处用蜡封住。',
  },
  {
    id: 'light_boots',
    name: '轻靴',
    result: 'light_boots',
    materials: { beast_hide: 2, slime_gel: 1 },
    cost: 15,
    minutes: 45,
    desc: '薄皮裁成鞋面，鞋帮里垫一层处理过的凝胶，走起来更轻。',
  },
]

export const CRAFT_TEXTS = [
  '戈登把活接过去，敲打声在店里一下一下地响。',
  '戈登没多问，量了量尺寸，就把材料收进工作台。',
]

export function craftRecipeById(id: string): CraftRecipe | undefined {
  return CRAFT_RECIPES.find((recipe) => recipe.id === id)
}

export function weaponShopOpenAt(minutes: number): boolean {
  return minutes >= WEAPON_SHOP_OPEN_START && minutes < WEAPON_SHOP_OPEN_END
}

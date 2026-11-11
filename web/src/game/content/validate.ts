import {
  BOOKS,
  COMBAT_BUFF_LABEL,
  COURSES,
  ENEMIES,
  EQUIPMENT_SLOTS,
  GUILD_ESCORTS,
  ITEMS,
  LOCATIONS,
  NPCS,
  RECIPES,
  SHOP_STOCKS,
  SPELLS,
  WEST_COMMISSIONS,
  WEST_GENERICS,
  exitsOf,
} from './index'
import { EVENTS } from '../events'
import { STORY } from '../story'

export type ContentIssue = {
  level: 'error' | 'warning'
  area: string
  message: string
}

export function validateContent(): ContentIssue[] {
  const issues: ContentIssue[] = []
  const error = (area: string, message: string) =>
    issues.push({ level: 'error', area, message })
  const warn = (area: string, message: string) =>
    issues.push({ level: 'warning', area, message })

  const locationIds = new Set(LOCATIONS.map((l) => l.id))
  const itemIds = new Set(Object.keys(ITEMS))
  const npcIds = new Set(NPCS.map((n) => n.id))
  const spellIds = new Set(Object.keys(SPELLS))
  const enemyIds = new Set(Object.keys(ENEMIES))
  const slotKeys = new Set(EQUIPMENT_SLOTS.map((s) => s.key))

  const checkUnique = (area: string, ids: string[]) => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) error(area, `重复 ID: ${id}`)
      seen.add(id)
    }
  }

  checkUnique('locations', LOCATIONS.map((l) => l.id))
  checkUnique('items', Object.keys(ITEMS))
  checkUnique('npcs', NPCS.map((n) => n.id))
  checkUnique('courses', COURSES.map((c) => c.id))
  checkUnique('recipes', RECIPES.map((r) => r.id))
  checkUnique('events', EVENTS.map((e) => e.id))
  checkUnique('story', STORY.map((s) => s.id))

  for (const loc of LOCATIONS) {
    if (loc.parent && !locationIds.has(loc.parent)) {
      error('locations', `${loc.id}: parent ${loc.parent} 不存在`)
    }
    for (const exit of exitsOf(loc.id)) {
      if (!locationIds.has(exit.to)) {
        error('locations', `${loc.id}: 出口 ${exit.to} 不存在`)
      }
    }
  }

  for (const item of Object.values(ITEMS)) {
    if (item.type === 'equipment') {
      if (!item.slot) error('items', `${item.id}: 装备缺少 slot`)
      else if (!slotKeys.has(item.slot)) error('items', `${item.id}: slot ${item.slot} 无效`)
    }
    if (item.effect?.combatBuff && !(item.effect.combatBuff in COMBAT_BUFF_LABEL)) {
      error('items', `${item.id}: combatBuff ${item.effect.combatBuff} 无效`)
    }
  }

  for (const [id, book] of Object.entries(BOOKS)) {
    if (!itemIds.has(id)) error('books', `${id}: 对应物品不存在`)
    if (book.reward.spell && !spellIds.has(book.reward.spell)) {
      error('books', `${id}: 奖励法术 ${book.reward.spell} 不存在`)
    }
  }

  for (const [loc, stock] of Object.entries(SHOP_STOCKS)) {
    if (!locationIds.has(loc)) error('shop', `${loc}: 商店地点不存在`)
    for (const itemId of Object.keys(stock)) {
      if (!itemIds.has(itemId)) error('shop', `${loc}: 商品 ${itemId} 不存在`)
    }
  }

  for (const recipe of RECIPES) {
    for (const input of Object.keys(recipe.inputs)) {
      if (!itemIds.has(input)) error('recipes', `${recipe.id}: 材料 ${input} 不存在`)
    }
    for (const output of [recipe.standard, recipe.fine]) {
      if (!itemIds.has(output)) error('recipes', `${recipe.id}: 产物 ${output} 不存在`)
    }
  }

  for (const commission of Object.values(WEST_COMMISSIONS)) {
    if (!locationIds.has(commission.location)) {
      error('west', `${commission.id}: 地点 ${commission.location} 不存在`)
    }
    if (commission.battleEnemy && !enemyIds.has(commission.battleEnemy)) {
      error('west', `${commission.id}: 敌人 ${commission.battleEnemy} 不存在`)
    }
  }

  for (const generic of WEST_GENERICS) {
    if (!locationIds.has(generic.location)) {
      error('west', `${generic.id}: 地点 ${generic.location} 不存在`)
    }
  }

  for (const escort of GUILD_ESCORTS) {
    if (!locationIds.has(escort.destination)) {
      error('guild', `${escort.id}: 目的地 ${escort.destination} 不存在`)
    }
    if (!enemyIds.has(escort.enemy)) {
      error('guild', `${escort.id}: 敌人 ${escort.enemy} 不存在`)
    }
  }

  for (const course of COURSES) {
    if (!locationIds.has(course.location)) {
      error('courses', `${course.id}: 地点 ${course.location} 不存在`)
    }
    for (const loc of course.locationByWeekday ?? []) {
      if (!locationIds.has(loc)) error('courses', `${course.id}: 轮换地点 ${loc} 不存在`)
    }
    if (course.examLocation && !locationIds.has(course.examLocation)) {
      error('courses', `${course.id}: 考试地点 ${course.examLocation} 不存在`)
    }
    if (course.locationByWeekday && course.locationByWeekday.length !== 5) {
      warn('courses', `${course.id}: locationByWeekday 不是 5 天`)
    }
    if (course.skillByWeekday && course.skillByWeekday.length !== 5) {
      warn('courses', `${course.id}: skillByWeekday 不是 5 天`)
    }
  }

  for (const npc of NPCS) {
    for (const slot of npc.schedule) {
      if (!locationIds.has(slot.location)) {
        error('npcs', `${npc.id}: 作息地点 ${slot.location} 不存在`)
      }
    }
    for (const tier of ['far', 'familiar', 'close'] as const) {
      if (!npc.impression[tier]) error('npcs', `${npc.id}: 缺少 ${tier} 印象`)
      if (!npc.lines[tier]?.length) error('npcs', `${npc.id}: 缺少 ${tier} 台词`)
    }
  }

  for (const event of EVENTS) {
    for (const loc of event.locations ?? []) {
      if (!locationIds.has(loc)) error('events', `${event.id}: 地点 ${loc} 不存在`)
    }
    if (event.requires?.npc && !npcIds.has(event.requires.npc)) {
      error('events', `${event.id}: NPC ${event.requires.npc} 不存在`)
    }
    if (event.requires?.affinity && !npcIds.has(event.requires.affinity.npc)) {
      error('events', `${event.id}: 好感 NPC ${event.requires.affinity.npc} 不存在`)
    }
  }

  for (const scene of STORY) {
    if (!locationIds.has(scene.location)) {
      error('story', `${scene.id}: 地点 ${scene.location} 不存在`)
    }
    if (scene.next !== undefined && !STORY[scene.next]) {
      error('story', `${scene.id}: next ${scene.next} 不存在`)
    }
    for (const choice of scene.choices ?? []) {
      if (choice.next !== undefined && !STORY[choice.next]) {
        error('story', `${scene.id}: 选项 next ${choice.next} 不存在`)
      }
    }
  }

  return issues
}

import {
  BOOKS,
  COMBAT_BUFF_LABEL,
  COURSES,
  ENEMIES,
  EQUIPMENT_SLOTS,
  GUILD_ESCORTS,
  GUILD_JOB_DEFS,
  ITEMS,
  LOCATIONS,
  NPCS,
  RECIPES,
  SHOP_STOCKS,
  SPELLS,
  WEST_COMMISSIONS,
  WEST_GENERICS,
  courseLocationOn,
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

  const inDay = (n: number) => Number.isFinite(n) && n >= 0 && n <= 1440
  const nonNegative = (n: number) => Number.isFinite(n) && n >= 0

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
      if (exit.minutes <= 0) {
        error('locations', `${loc.id}: 到 ${exit.to} 的耗时不大于 0`)
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
    if (!nonNegative(item.price)) error('items', `${item.id}: 价格为负`)
    if (item.power !== undefined && !nonNegative(item.power)) {
      error('items', `${item.id}: power 为负`)
    }
    if (item.spellPower !== undefined && !nonNegative(item.spellPower)) {
      error('items', `${item.id}: spellPower 为负`)
    }
    if (item.effect) {
      for (const key of ['hp', 'mana', 'stamina'] as const) {
        const value = item.effect[key]
        if (value !== undefined && !nonNegative(value)) {
          error('items', `${item.id}: ${key} 为负`)
        }
      }
    }
  }

  for (const [id, book] of Object.entries(BOOKS)) {
    if (!itemIds.has(id)) error('books', `${id}: 对应物品不存在`)
    if (book.reward.spell && !spellIds.has(book.reward.spell)) {
      error('books', `${id}: 奖励法术 ${book.reward.spell} 不存在`)
    }
    if (book.progressPerRead <= 0) {
      error('books', `${id}: progressPerRead 必须大于 0`)
    }
    if (book.spiritCost !== undefined && !nonNegative(book.spiritCost)) {
      error('books', `${id}: spiritCost 为负`)
    }
  }

  for (const enemy of Object.values(ENEMIES)) {
    if (enemy.hp <= 0) error('enemies', `${enemy.id}: hp 必须大于 0`)
    if (!nonNegative(enemy.attack)) error('enemies', `${enemy.id}: attack 为负`)
    if (!nonNegative(enemy.defense)) error('enemies', `${enemy.id}: defense 为负`)
    if (!nonNegative(enemy.speed)) error('enemies', `${enemy.id}: speed 为负`)
    if (!nonNegative(enemy.expValue)) error('enemies', `${enemy.id}: expValue 为负`)
  }

  for (const spell of Object.values(SPELLS)) {
    if (!nonNegative(spell.mana)) error('spells', `${spell.id}: mana 为负`)
    if (!nonNegative(spell.baseDamage)) error('spells', `${spell.id}: baseDamage 为负`)
    if (!nonNegative(spell.tierScale)) error('spells', `${spell.id}: tierScale 为负`)
    if (!nonNegative(spell.variance)) error('spells', `${spell.id}: variance 为负`)
    if (spell.castTicks <= 0) error('spells', `${spell.id}: castTicks 必须大于 0`)
  }

  for (const [loc, stock] of Object.entries(SHOP_STOCKS)) {
    if (!locationIds.has(loc)) error('shop', `${loc}: 商店地点不存在`)
    for (const itemId of Object.keys(stock)) {
      if (!itemIds.has(itemId)) error('shop', `${loc}: 商品 ${itemId} 不存在`)
      if (stock[itemId] <= 0) error('shop', `${loc}: 商品 ${itemId} 库存不大于 0`)
    }
  }

  for (const recipe of RECIPES) {
    for (const input of Object.keys(recipe.inputs)) {
      if (!itemIds.has(input)) error('recipes', `${recipe.id}: 材料 ${input} 不存在`)
      if (recipe.inputs[input] <= 0) error('recipes', `${recipe.id}: 材料 ${input} 数量不大于 0`)
    }
    for (const output of [recipe.standard, recipe.fine]) {
      if (!itemIds.has(output)) error('recipes', `${recipe.id}: 产物 ${output} 不存在`)
    }
    if (!nonNegative(recipe.level)) error('recipes', `${recipe.id}: level 为负`)
    if (!nonNegative(recipe.unlockExp)) error('recipes', `${recipe.id}: unlockExp 为负`)
    if (!nonNegative(recipe.successBase)) error('recipes', `${recipe.id}: successBase 为负`)
    else if (recipe.successBase > 150) warn('recipes', `${recipe.id}: successBase 超过 150`)
    if (!nonNegative(recipe.fineBase)) error('recipes', `${recipe.id}: fineBase 为负`)
    else if (recipe.fineBase > 150) warn('recipes', `${recipe.id}: fineBase 超过 150`)
  }

  for (const commission of Object.values(WEST_COMMISSIONS)) {
    if (!locationIds.has(commission.location)) {
      error('west', `${commission.id}: 地点 ${commission.location} 不存在`)
    }
    if (commission.battleEnemy && !enemyIds.has(commission.battleEnemy)) {
      error('west', `${commission.id}: 敌人 ${commission.battleEnemy} 不存在`)
    }
    if (commission.minutes <= 0) error('west', `${commission.id}: minutes 必须大于 0`)
    if (!nonNegative(commission.stamina)) error('west', `${commission.id}: stamina 为负`)
    if (!nonNegative(commission.money)) error('west', `${commission.id}: money 为负`)
    if (!nonNegative(commission.construction)) error('west', `${commission.id}: construction 为负`)
    if (!nonNegative(commission.points)) error('west', `${commission.id}: points 为负`)
    if (
      commission.battleChance !== undefined &&
      (!Number.isFinite(commission.battleChance) ||
        commission.battleChance < 0 ||
        commission.battleChance > 1)
    ) {
      error('west', `${commission.id}: battleChance 不在 0–1`)
    }
  }

  for (const generic of WEST_GENERICS) {
    if (!locationIds.has(generic.location)) {
      error('west', `${generic.id}: 地点 ${generic.location} 不存在`)
    }
  }

  for (const job of Object.values(GUILD_JOB_DEFS)) {
    if (job.minutes <= 0) error('guild', `${job.id}: minutes 必须大于 0`)
    if (!nonNegative(job.stamina)) error('guild', `${job.id}: stamina 为负`)
    if (!nonNegative(job.money)) error('guild', `${job.id}: money 为负`)
  }

  for (const escort of GUILD_ESCORTS) {
    if (!locationIds.has(escort.destination)) {
      error('guild', `${escort.id}: 目的地 ${escort.destination} 不存在`)
    }
    if (!enemyIds.has(escort.enemy)) {
      error('guild', `${escort.id}: 敌人 ${escort.enemy} 不存在`)
    }
    if (escort.segments <= 0) error('guild', `${escort.id}: segments 必须大于 0`)
    if (escort.minutes <= 0) error('guild', `${escort.id}: minutes 必须大于 0`)
    if (!nonNegative(escort.money)) error('guild', `${escort.id}: money 为负`)
  }

  for (const course of COURSES) {
    if (!locationIds.has(course.location)) {
      error('courses', `${course.id}: 地点 ${course.location} 不存在`)
    }
    if (!inDay(course.start) || !inDay(course.end) || course.start >= course.end) {
      error('courses', `${course.id}: 上课时间无效`)
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

  for (const year of new Set(COURSES.map((c) => c.year))) {
    const yearCourses = COURSES.filter((c) => c.year === year)
    for (let wd = 0; wd < 5; wd += 1) {
      for (let i = 0; i < yearCourses.length; i += 1) {
        for (let j = i + 1; j < yearCourses.length; j += 1) {
          const a = yearCourses[i]
          const b = yearCourses[j]
          const locA = courseLocationOn(a, wd)
          const locB = courseLocationOn(b, wd)
          if (locA === locB && a.start < b.end && b.start < a.end) {
            error(
              'courses',
              `${year} 学年周${wd + 1}: ${a.id} 与 ${b.id} 在 ${locA} 时间重叠`,
            )
          }
        }
      }
    }
  }

  for (const npc of NPCS) {
    for (const slot of npc.schedule) {
      if (!locationIds.has(slot.location)) {
        error('npcs', `${npc.id}: 作息地点 ${slot.location} 不存在`)
      }
      if (!inDay(slot.start) || !inDay(slot.end)) {
        error('npcs', `${npc.id}: 作息时间超出 0–1440`)
      }
      if (slot.start === slot.end) {
        error('npcs', `${npc.id}: 作息起止时间相同`)
      }
      if (
        slot.chance !== undefined &&
        (!Number.isFinite(slot.chance) || slot.chance < 0 || slot.chance > 1)
      ) {
        error('npcs', `${npc.id}: 出现概率不在 0–1`)
      }
      if (slot.onlyDay !== undefined && slot.onlyDay < 0) {
        error('npcs', `${npc.id}: onlyDay 为负`)
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
    for (const [start, end] of event.timeRanges ?? []) {
      if (!inDay(start) || !inDay(end) || start >= end) {
        error('events', `${event.id}: 时间窗 ${start}–${end} 无效`)
      }
    }
    if (event.expCapTier !== undefined && event.expCapTier < 0) {
      error('events', `${event.id}: expCapTier 为负`)
    }
  }

  for (const scene of STORY) {
    if (!locationIds.has(scene.location)) {
      error('story', `${scene.id}: 地点 ${scene.location} 不存在`)
    }
    if (!inDay(scene.time)) {
      error('story', `${scene.id}: time ${scene.time} 不在 0–1440`)
    }
    if (scene.duration !== undefined && !nonNegative(scene.duration)) {
      error('story', `${scene.id}: duration 为负`)
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

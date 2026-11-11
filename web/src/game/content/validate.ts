import {
  BOOKS,
  BOOK_CATEGORY_LABEL,
  COMBAT_BUFF_LABEL,
  CONSTELLATIONS,
  COURSES,
  CRAFT_RECIPES,
  ENEMIES,
  EQUIPMENT_SLOTS,
  GREENHOUSE_HERB_PRICES,
  GREENHOUSE_HERB_STOCK,
  GUILD_ESCORTS,
  GUILD_JOB_DEFS,
  ITEMS,
  LOCATIONS,
  NPCS,
  RECIPES,
  RUNES,
  SHOP_STOCKS,
  SKILL_ORDER,
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
  checkUnique('runes', RUNES.map((r) => r.id))
  checkUnique('constellations', CONSTELLATIONS.map((c) => c.id))
  checkUnique('craft', CRAFT_RECIPES.map((r) => r.id))

  for (const constellation of CONSTELLATIONS) {
    if (!constellation.name) error('constellations', `${constellation.id}: 缺少名字`)
    if (!constellation.lore) error('constellations', `${constellation.id}: 缺少说明`)
    if (constellation.stars.length === 0) {
      error('constellations', `${constellation.id}: 没有星点`)
    }
    for (const [a, b] of constellation.lines) {
      if (!constellation.stars[a] || !constellation.stars[b]) {
        error('constellations', `${constellation.id}: 星线 ${a}-${b} 超出星点范围`)
      }
    }
  }
  if (new Set(CONSTELLATIONS.map((c) => c.season)).size !== 4) {
    warn('constellations', '四季星座没有覆盖全部四个季节')
  }

  for (const rune of RUNES) {
    if (rune.price < 0) error('runes', `${rune.id}: price 为负`)
    if (rune.slots.length === 0) error('runes', `${rune.id}: 没有可用部位`)
    if (!rune.desc) error('runes', `${rune.id}: 缺少说明`)
  }

  for (const [id, price] of Object.entries(GREENHOUSE_HERB_PRICES)) {
    if (!itemIds.has(id)) error('greenhouse', `${id}: 药草价格对应的物品不存在`)
    if (price < 0) error('greenhouse', `${id}: 价格为负`)
  }
  for (const [id, qty] of Object.entries(GREENHOUSE_HERB_STOCK)) {
    if (!itemIds.has(id)) error('greenhouse', `${id}: 库存对应的物品不存在`)
    if (qty <= 0) error('greenhouse', `${id}: 库存不大于 0`)
  }

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
    if (item.engravingSlots !== undefined && item.engravingSlots < 0) {
      error('items', `${item.id}: engravingSlots 为负`)
    }
    for (const key of ['armor', 'resist', 'melee'] as const) {
      const value = item[key]
      if (value !== undefined && !nonNegative(value)) {
        error('items', `${item.id}: ${key} 为负`)
      }
    }
    if (item.speedPct !== undefined) {
      if (!Number.isFinite(item.speedPct)) {
        error('items', `${item.id}: speedPct 不是数字`)
      } else if (Math.abs(item.speedPct) > 50) {
        warn('items', `${item.id}: speedPct 超过 50%`)
      }
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
    if (!(book.category in BOOK_CATEGORY_LABEL)) {
      error('books', `${id}: 分类 ${book.category} 无效`)
    }
    if (book.reward.spell && !spellIds.has(book.reward.spell)) {
      error('books', `${id}: 奖励法术 ${book.reward.spell} 不存在`)
    }
    if (book.perRead?.spell && !spellIds.has(book.perRead.spell)) {
      error('books', `${id}: 单次奖励法术 ${book.perRead.spell} 不存在`)
    }
    for (const reward of [book.reward, book.perRead]) {
      for (const key of Object.keys(reward?.exp ?? {})) {
        if (!(SKILL_ORDER as readonly string[]).includes(key)) {
          error('books', `${id}: 经验类型 ${key} 无效`)
        }
      }
    }
    if (book.requiresSkill) {
      if (!SKILL_ORDER.includes(book.requiresSkill.key)) {
        error('books', `${id}: 门槛技能 ${book.requiresSkill.key} 无效`)
      }
      if (book.requiresSkill.tier < 0 || book.requiresSkill.tier > 5) {
        error('books', `${id}: 门槛档位超出 0–5`)
      }
    }
    if (book.progressPerRead <= 0) {
      error('books', `${id}: progressPerRead 必须大于 0`)
    }
    if (book.spiritCost !== undefined && !nonNegative(book.spiritCost)) {
      error('books', `${id}: spiritCost 为负`)
    }
    if (book.repeatCompletion && !book.repeatable) {
      warn('books', `${id}: 一次性书设置了每轮完成奖励`)
    }
  }

  for (const enemy of Object.values(ENEMIES)) {
    if (enemy.hp <= 0) error('enemies', `${enemy.id}: hp 必须大于 0`)
    if (!nonNegative(enemy.attack)) error('enemies', `${enemy.id}: attack 为负`)
    if (!nonNegative(enemy.defense)) error('enemies', `${enemy.id}: defense 为负`)
    if (!nonNegative(enemy.resist)) error('enemies', `${enemy.id}: resist 为负`)
    if (enemy.element && enemy.element !== 'physical' && enemy.element !== 'magic') {
      error('enemies', `${enemy.id}: element 无效`)
    }
    if (!nonNegative(enemy.speed)) error('enemies', `${enemy.id}: speed 为负`)
    if (!nonNegative(enemy.expValue)) error('enemies', `${enemy.id}: expValue 为负`)
  }

  for (const recipe of CRAFT_RECIPES) {
    const result = ITEMS[recipe.result]
    if (!result) error('craft', `${recipe.id}: 产物 ${recipe.result} 不存在`)
    else if (result.type !== 'equipment') error('craft', `${recipe.id}: 产物不是装备`)
    if (recipe.cost < 0) error('craft', `${recipe.id}: 费用为负`)
    if (recipe.minutes <= 0) error('craft', `${recipe.id}: 时间必须大于 0`)
    if (!recipe.desc) error('craft', `${recipe.id}: 缺少说明`)
    if (Object.keys(recipe.materials).length === 0) {
      error('craft', `${recipe.id}: 没有材料`)
    }
    for (const [id, qty] of Object.entries(recipe.materials)) {
      if (!itemIds.has(id)) error('craft', `${recipe.id}: 材料 ${id} 不存在`)
      if (qty <= 0) error('craft', `${recipe.id}: 材料 ${id} 数量不大于 0`)
    }
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
    if (course.expPerSegment !== undefined) {
      if (!Number.isFinite(course.expPerSegment) || course.expPerSegment <= 0) {
        error('courses', `${course.id}: expPerSegment 必须大于 0`)
      } else if (course.expPerSegment > 5) {
        warn('courses', `${course.id}: expPerSegment 超过 5`)
      }
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

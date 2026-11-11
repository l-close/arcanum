import { create } from 'zustand'
import type {
  BattleState,
  BattleSubmenu,
  CombatBuffKey,
  CombatBuffs,
  EquipmentSlot,
  ExamPackage,
  ExamResult,
  GameData,
  Gender,
  GuildState,
  Player,
  Screen,
  Skill,
  SkillKey,
  WestState,
} from './types'
import {
  BELL_TOWER_MINUTES,
  BELL_TOWER_MOOD,
  BELL_TOWER_OPEN_END,
  BELL_TOWER_OPEN_START,
  BELL_TOWER_STAMINA,
  DRINKS,
  ENEMIES,
  ITEMS,
  BOOKS,
  SEARCHABLE_BOOKS,
  WEST_COMMISSIONS,
  WEST_GENERICS,
  WEST_GENERIC_MINUTES,
  WEST_GENERIC_STAMINA,
  WEST_GENERIC_CONSTRUCTION,
  WEST_GENERIC_POINTS,
  WEST_CONSTRUCTION_MAX,
  WEST_PROJECT_MAX,
  WEST_REPAIR_TEXTS,
  WEST_COMMISSION_TEXTS,
  GUILD_JOB_DEFS,
  GUILD_ESCORTS,
  GUILD_SEGMENT_MINUTES,
  GUILD_ENCOUNTER_CHANCE,
  GUILD_RETURN_MINUTES,
  GUILD_ROAD_TEXTS,
  guildWeek,
  guildEscortForDay,
  guildJobsForDay,
  westRumor,
  supportPeriodAt,
  shopPriceAt,
  sellPriceAt,
  RELIEF_CARE_MINUTES,
  RELIEF_CARE_MOOD,
  RELIEF_CARE_STAMINA,
  RELIEF_OPEN_END,
  RELIEF_OPEN_START,
  RELIEF_PATIENT_SCENES,
  RELIEF_TIDY_MINUTES,
  RELIEF_TIDY_MOOD,
  RELIEF_TIDY_STAMINA,
  RELIEF_TREAT_COST,
  RELIEF_TREAT_HP,
  RELIEF_TREAT_MINUTES,
  RELIEF_VOLUNTEER_END,
  RELIEF_VOLUNTEER_MINUTES,
  RELIEF_VOLUNTEER_MOOD,
  RELIEF_VOLUNTEER_PAY,
  RELIEF_VOLUNTEER_STAMINA,
  RELIEF_VOLUNTEER_START,
  REST_MINUTES,
  REST_STAMINA,
  REST_THRESHOLD,
  ACADEMY_MEAL_FEE,
  RITE_PHASE_MINUTES,
  CEMETERY_SWEEP_MINUTES,
  CEMETERY_SWEEP_MOOD,
  CEMETERY_SWEEP_STAMINA,
  FOREST_WALK_MINUTES,
  FOREST_WALK_MOOD,
  FOREST_WALK_STAMINA,
  FOREST_ENCOUNTER_CHANCE,
  SLEEP_MAX_MINUTES,
  SLEEP_MIN_MINUTES,
  SLEEP_MIN_RECOVERY_MINUTES,
  SLEEP_LOCATIONS,
  TELEPORT_YEAR,
  MEDITATION_MINUTES,
  MEDITATION_WILL_GAIN,
  MEDITATION_LOCATIONS,
  meditationScene,
  SKILL_LABEL,
  SOCIAL_MINUTES,
  SPELLS,
  FIREBALL_READING_EXP,
  SLIME_GEL_DROP_CHANCE,
  WOLF_HIDE_DROP_CHANCE,
  BOAR_HIDE_DROP_CHANCE,
  BOAR_TUSK_DROP_CHANCE,
  FOREST_DEEP_ENCOUNTER_CHANCE,
  HERB_GATHER_SUCCESS_CHANCE,
  COMBAT_BUFF_DURATION_MINUTES,
  COMBAT_BUFF_LABEL,
  combatBuffUntilKey,
  WORKSHOP_OPEN_START,
  WORKSHOP_OPEN_END,
  WORKSHOP_WORK_MINUTES,
  WORKSHOP_WORK_STAMINA,
  WORKSHOP_WORK_SPIRIT,
  WORKSHOP_WORK_MOOD,
  WORKSHOP_WORK_EXP,
  workshopPayForTier,
  WORKSHOP_WORK_TEXTS,
  WORKSHOP_RENT_COST,
  WORKSHOP_RENT_DAYS,
  WORKSHOP_LESSON_COST,
  WORKSHOP_LESSON_MINUTES,
  WORKSHOP_LESSON_SPIRIT,
  WORKSHOP_LESSON_EXP,
  canSellAt,
  TAVERN_DRINK_END,
  TAVERN_LISTEN_SCENES,
  TAVERN_OPEN_END,
  TAVERN_OPEN_START,
  TAVERN_TALK_END,
  TAVERN_TALK_START,
  TAVERN_WORK_END,
  TAVERN_WORK_START,
  TIER_REQ,
  YEAR_DAYS,
  absoluteMinutes,
  isTimeWindow,
  shopStockAt,
  attackDamageRange,
  clamp,
  classSegmentAt,
  classScene,
  courseById,
  courseExamLocationOn,
  recipeById,
  recipeUnlocked,
  brewSuccessChance,
  brewFineChance,
  currentMeal,
  currentYear,
  examDaysForYear,
  examPackageTime,
  examCoursesForYear,
  isExamDay,
  semesterEndDay,
  semesterPackageTime,
  examThresholdForDay,
  formatDate,
  formatMoney,
  formatTime,
  getLocation,
  isGateOpen,
  isVacation,
  lecturePreviewPlan,
  masteryCourseForSkill,
  maxHp,
  maxSpirit,
  maxStamina,
  mealKeyFor,
  npcById,
  reliefHasPatients,
  npcLocationAt,
  routeBetween,
  ritePhaseAt,
  ritePhaseDone,
  ritePrepAt,
  semesterEndFor,
  socialTier,
  spellDamageRange,
  spiritCost,
  exitsOf,
  ENTER_MINUTES,
  weekday,
  GREENHOUSE_IDENTIFY_EXP,
  GREENHOUSE_IDENTIFY_MINUTES,
  GREENHOUSE_IDENTIFY_SPIRIT,
  GREENHOUSE_IDENTIFY_TEXTS,
  GREENHOUSE_VISIT_MINUTES,
  GREENHOUSE_VISIT_MOOD,
  GREENHOUSE_VISIT_TEXTS,
  greenhouseOpenAt,
  RUNE_ENGRAVE_MINUTES,
  RUNE_LOOK_MINUTES,
  RUNE_LOOK_MOOD,
  RUNE_LOOK_TEXTS,
  RUNE_SHOP_OPEN_END,
  RUNE_SHOP_OPEN_START,
  RUNES,
  runeApplicable,
  runeById,
  CONSTELLATIONS,
  OBSERVE_KNOWLEDGE,
  OBSERVE_MINUTES,
  OBSERVE_MOOD,
  OBSERVE_SPIRIT,
  OBSERVE_TEXTS,
  CALENDAR_MINUTES,
  STAR_CHART_MINUTES,
  observatoryOpenAt,
  nightKey,
  currentConstellation,
  weatherBlocksStars,
} from './content'
import {
  EVENTS,
  EVENT_CHANCE,
  EVENT_DAILY_CAP,
  EVENT_GAP_MINUTES,
  cappedExpSkills,
  choiceBlockedReason,
  eventById,
  eventMatches,
  type EventEffects,
  type EventTrigger,
} from './events'
import { deleteSave, loadGame, saveGame } from './save'
import { STORY, type StoryEffects } from './story'

function makeSkills(): Record<SkillKey, Skill> {
  return {
    physique: { tier: 0, exp: 0 },
    knowledge: { tier: 0, exp: 0 },
    will: { tier: 0, exp: 0 },
    brawl: { tier: 0, exp: 0 },
    sword: { tier: 0, exp: 0 },
    nature: { tier: 0, exp: 0 },
    divine: { tier: 0, exp: 0 },
    cultivation: { tier: 0, exp: 0 },
    alchemy: { tier: 0, exp: 0 },
  }
}

export function freshData(): GameData {
  return {
    version: 1,
    day: 0,
    minutes: 7 * 60 + 30,
    location: 'dorm',
    money: 40,
    stamina: 100,
    spirit: 100,
    mood: 80,
    mana: 50,
    hp: 60,
    spells: [],
    skills: makeSkills(),
    affinity: {},
    familiarity: {},
    flags: {},
    weekly: { week: 0, backyard: 0 },
    backyard: { day: 0, count: 0 },
    rite: { day: -1, phases: [] },
    vacation: { day: 0, kids: false },
    training: { week: 0, skills: [] },
    social: { day: 0, counts: {} },
    courseMastery: {},
    classBonus: null,
    inventory: { basic_wand: 1 },
    equipment: { mainHand: 'basic_wand', offHand: null, armor: null, accessory: null },
    shop: { day: 0, sold: {} },
    books: {},
    bookshelf: ['picture_book'],
    west: {
      stage: 0,
      construction: 0,
      projects: { wall: 0, ditch: 0, lamp: 0 },
      points: 0,
      period: null,
      setIndex: 0,
      accepted: [],
      done: [],
    },
    guild: {
      week: 0,
      accepted: [],
      done: [],
      escort: null,
    },
    prayers: { day: 0, count: 0 },
    plaza: { day: 0, fed: false },
    meals: { day: 0, breakfast: false, lunch: false, dinner: false },
    relief: { day: 0, cared: false, treated: false, volunteered: false },
    workshop: { brewKitUntilDay: 0, lessonDay: -1 },
    greenhouse: { day: -1, visited: false },
    runeShop: { day: -1, looked: false },
    engravings: {},
    starChart: [],
    starWatch: { night: -1, watched: false },
    combatBuffs: { sharpUntil: 0, stoneUntil: 0, swiftUntil: 0 },
    events: { day: 0, count: 0, today: [], lastSeen: {}, lastAt: -9999, seen: [] },
    examPackages: [],
    examStartDay: 0,
    notice: '',
    log: ['第一年 一月一日，周一。入学第一天。'],
    prologueSeen: false,
    storyStep: 0,
    storyDone: false,
  }
}

function makeMonthlyPackage(examDay: number): ExamPackage {
  return {
    id: `monthly_${examDay}`,
    kind: 'monthly',
    day: examDay,
    availableAt: examPackageTime(examDay),
    results: {},
    received: false,
    opened: false,
  }
}

function makeSemesterPackage(
  year: number,
  semester: 1 | 2,
  availableAt: number,
): ExamPackage {
  return {
    id: `semester_${year}_${semester}`,
    kind: 'semester',
    day: semesterEndDay(year, semester),
    availableAt,
    results: {},
    year,
    semester,
    received: false,
    opened: false,
  }
}

function ensureSemesterPackage(d: GameData, report: { year: number; semester: 1 | 2 }): void {
  const id = `semester_${report.year}_${report.semester}`
  if (d.examPackages.some((p) => p.id === id)) return
  const endDay = semesterEndDay(report.year, report.semester)
  d.examPackages.push(
    makeSemesterPackage(report.year, report.semester, semesterPackageTime(endDay)),
  )
}

function packageNow(d: GameData): number {
  return d.day * 1440 + d.minutes
}

function ensureMonthlyPackage(
  d: GameData,
  examDay: number,
): { pkg: ExamPackage; created: boolean } {
  const id = `monthly_${examDay}`
  const existing = d.examPackages.find((p) => p.id === id)
  if (existing) return { pkg: existing, created: false }
  const pkg = makeMonthlyPackage(examDay)
  d.examPackages.push(pkg)
  return { pkg, created: true }
}

function fillMissingExamResults(pkg: ExamPackage): boolean {
  if (pkg.kind !== 'monthly') return false
  let changed = false
  for (const course of examCoursesForYear(currentYear(pkg.day))) {
    if (pkg.results[course.id] === undefined) {
      pkg.results[course.id] = 'absent'
      changed = true
    }
  }
  return changed
}

function ensureMonthlyPackages(d: GameData): boolean {
  const now = packageNow(d)
  let changed = false
  for (const year of [1, 2]) {
    for (const offset of examDaysForYear(year)) {
      const examDay = (year - 1) * YEAR_DAYS + offset
      if (examDay < d.examStartDay) continue
      if (examPackageTime(examDay) > now) continue
      const { pkg, created } = ensureMonthlyPackage(d, examDay)
      if (created) changed = true
      if (fillMissingExamResults(pkg)) changed = true
    }
  }
  return changed
}

function parseLegacyReport(raw: unknown): { year: number; semester: 1 | 2 } | null {
  if (!raw) return null
  if (typeof raw === 'number') {
    return { year: 1, semester: raw === 2 ? 2 : 1 }
  }
  if (typeof raw === 'object' && 'year' in raw && 'semester' in raw) {
    const r = raw as { year: number; semester: number }
    return { year: r.year, semester: r.semester === 2 ? 2 : 1 }
  }
  return null
}

export function normalizeData(raw: GameData): GameData {
  const legacyStress = (raw as GameData & { stress?: number }).stress
  const skills = { ...makeSkills(), ...raw.skills }
  const hpMax = maxHp(skills.physique.tier)
  const data: GameData = {
    ...freshData(),
    ...raw,
    skills,
    spirit: raw.spirit ?? maxSpirit(skills.will.tier),
    mood: raw.mood ?? (legacyStress !== undefined ? 100 - legacyStress : 80),
    hp: clamp(raw.hp ?? hpMax, 0, hpMax),
    spells: raw.spells ?? [],
    affinity: raw.affinity ?? {},
    familiarity: raw.familiarity ?? {},
    weekly: raw.weekly ?? { week: 0, backyard: 0 },
    backyard: raw.backyard ?? { day: 0, count: 0 },
    rite: raw.rite ?? { day: -1, phases: [] },
    vacation:
      raw.vacation ??
      (raw as GameData & { summer?: { day: number; kids: boolean } }).summer ?? {
        day: 0,
        kids: false,
      },
    training: raw.training ?? { week: 0, skills: [] },
    social: {
      day: raw.social?.day ?? 0,
      counts: raw.social?.counts ?? {},
    },
    courseMastery: Object.fromEntries(
      Object.entries(raw.courseMastery ?? {}).filter(([id]) => courseById(id)),
    ),
    classBonus: raw.classBonus ?? null,
    inventory: { basic_wand: 1, ...(raw.inventory ?? {}) },
    equipment: (() => {
      const e = (raw.equipment ?? {}) as Record<string, string | null | undefined>
      return {
        mainHand: e.mainHand ?? e.medium ?? 'basic_wand',
        offHand: e.offHand ?? null,
        armor: e.armor ?? null,
        accessory: e.accessory ?? null,
      }
    })(),
    shop: (() => {
      const shop = raw.shop ?? { day: 0, sold: {} }
      const sold: Record<string, number> = {}
      for (const [key, value] of Object.entries(shop.sold ?? {})) {
        sold[key.includes(':') ? key : `shop:${key}`] = value
      }
      return { day: shop.day, sold }
    })(),
    books: raw.books ?? {},
    bookshelf: raw.bookshelf ?? ['picture_book'],
    west: {
      stage: raw.west?.stage === 1 ? 1 : 0,
      construction: clamp(raw.west?.construction ?? 0, 0, WEST_CONSTRUCTION_MAX),
      projects: {
        wall: clamp(raw.west?.projects?.wall ?? 0, 0, WEST_PROJECT_MAX),
        ditch: clamp(raw.west?.projects?.ditch ?? 0, 0, WEST_PROJECT_MAX),
        lamp: clamp(raw.west?.projects?.lamp ?? 0, 0, WEST_PROJECT_MAX),
      },
      points: Math.max(0, raw.west?.points ?? 0),
      period: raw.west?.period ?? null,
      setIndex: Math.max(0, raw.west?.setIndex ?? 0),
      accepted: raw.west?.accepted ?? [],
      done: raw.west?.done ?? [],
    },
    guild: {
      week: raw.guild?.week ?? guildWeek(raw.day),
      accepted: raw.guild?.accepted ?? [],
      done: raw.guild?.done ?? [],
      escort: raw.guild?.escort
        ? {
            destination: raw.guild.escort.destination,
            segment: raw.guild.escort.segment ?? 0,
            totalSegments: raw.guild.escort.totalSegments ?? 1,
            goodsDamaged: !!raw.guild.escort.goodsDamaged,
          }
        : null,
    },
    prayers: raw.prayers ?? { day: 0, count: 0 },
    plaza: raw.plaza ?? { day: 0, fed: false },
    meals: raw.meals ?? { day: 0, breakfast: false, lunch: false, dinner: false },
    relief: raw.relief ?? { day: 0, cared: false, treated: false, volunteered: false },
    workshop: {
      brewKitUntilDay: raw.workshop?.brewKitUntilDay ?? 0,
      lessonDay: raw.workshop?.lessonDay ?? -1,
    },
    greenhouse: {
      day: raw.greenhouse?.day ?? -1,
      visited: !!raw.greenhouse?.visited,
    },
    runeShop: {
      day: raw.runeShop?.day ?? -1,
      looked: !!raw.runeShop?.looked,
    },
    engravings: Object.fromEntries(
      Object.entries(raw.engravings ?? {}).map(([id, runes]) => [
        id,
        Array.isArray(runes) ? runes.filter((r) => typeof r === 'string') : [],
      ]),
    ),
    starChart: Array.isArray(raw.starChart)
      ? raw.starChart.filter((id) => CONSTELLATIONS.some((c) => c.id === id))
      : [],
    starWatch: {
      night: raw.starWatch?.night ?? -1,
      watched: !!raw.starWatch?.watched,
    },
    combatBuffs: {
      sharpUntil: raw.combatBuffs?.sharpUntil ?? 0,
      stoneUntil: raw.combatBuffs?.stoneUntil ?? 0,
      swiftUntil: raw.combatBuffs?.swiftUntil ?? 0,
    },
    events: {
      day: raw.events?.day ?? 0,
      count: raw.events?.count ?? 0,
      today: raw.events?.today ?? [],
      lastSeen: raw.events?.lastSeen ?? {},
      lastAt: raw.events?.lastAt ?? -9999,
      seen: raw.events?.seen ?? [],
    },
    examPackages: (() => {
      const packages: ExamPackage[] = (raw.examPackages ?? []).map((p) => ({
        ...p,
        results: p.results ?? {},
        received: !!p.received,
        opened: !!p.opened,
      }))
      const legacy = (raw as GameData & { pendingReport?: unknown }).pendingReport
      const report = parseLegacyReport(legacy)
      if (
        report &&
        !packages.some(
          (p) => p.kind === 'semester' && p.year === report.year && p.semester === report.semester,
        )
      ) {
        packages.push(
          makeSemesterPackage(report.year, report.semester, raw.day * 1440 + raw.minutes),
        )
      }
      return packages
    })(),
    examStartDay: raw.examStartDay ?? raw.day,
    notice: raw.notice ?? '',
    storyStep: raw.storyStep ?? -1,
    storyDone: raw.storyDone ?? true,
  }
  resetWestPeriod(data)
  syncGuildWeek(data)
  maybeUnlockFireballReading(data)
  return data
}

function maybeUnlockFireballReading(d: GameData): string | null {
  if (d.flags.fireball_ready) return null
  if (d.spells.includes('fireball')) {
    d.flags.fireball_ready = true
    return null
  }
  const nature = d.skills.nature
  const qualified =
    nature.tier >= 1 || (nature.tier === 0 && nature.exp >= FIREBALL_READING_EXP)
  if (!qualified) return null
  d.flags.fireball_ready = true
  const text = '你对法术的理解又深了一层。有些以前看不懂的东西，现在能看懂了。'
  d.notice = d.notice ? `${d.notice} ${text}` : text
  pushLog(d, text)
  return text
}

function formatGain(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100)
}

function itemHasRune(d: GameData, itemId: string | null | undefined, runeId: string): boolean {
  if (!itemId) return false
  return (d.engravings[itemId] ?? []).includes(runeId)
}

function slotHasRune(d: GameData, slot: EquipmentSlot, runeId: string): boolean {
  return itemHasRune(d, d.equipment[slot], runeId)
}

function anySlotHasRune(d: GameData, slots: EquipmentSlot[], runeId: string): boolean {
  return slots.some((slot) => slotHasRune(d, slot, runeId))
}

function closeTimedLocation(d: GameData): void {
  if (d.location === 'greenhouse' && !greenhouseOpenAt(d.minutes)) {
    d.location = 'craftDistrict'
    pushLog(d, '苔丝把温室的门锁上，你回到工坊区。')
  } else if (
    d.location === 'runeShop' &&
    !isTimeWindow(d.minutes, RUNE_SHOP_OPEN_START, RUNE_SHOP_OPEN_END)
  ) {
    d.location = 'craftDistrict'
    pushLog(d, '赛拉斯把工坊的门关上，你回到工坊区。')
  } else if (d.location === 'observatory' && !observatoryOpenAt(d.minutes)) {
    d.location = 'gate'
    pushLog(d, '伊芙把天窗合上，你回到城门。')
  }
}

function combatBuffActive(buffs: CombatBuffs, key: CombatBuffKey, now: number): boolean {
  return buffs[combatBuffUntilKey(key)] > now
}

function setCombatBuff(
  buffs: CombatBuffs,
  key: CombatBuffKey,
  now: number,
): { ok: boolean; until: number; remaining: number } {
  const untilKey = combatBuffUntilKey(key)
  const current = buffs[untilKey]
  if (current > now) {
    return { ok: false, until: current, remaining: current - now }
  }
  const until = now + COMBAT_BUFF_DURATION_MINUTES
  buffs[untilKey] = until
  return { ok: true, until, remaining: COMBAT_BUFF_DURATION_MINUTES }
}

function buffHours(minutes: number): string {
  return `${Math.max(1, Math.ceil(minutes / 60))} 小时`
}

function addExp(d: GameData, key: SkillKey, amount: number): void {
  if (amount > 0) {
    const week = Math.floor(d.day / 7)
    if (!d.training || d.training.week !== week) {
      d.training = { week, skills: [] }
    }
    if (!d.training.skills.includes(key)) d.training.skills.push(key)
  }
  const s = d.skills[key]
  if (s.tier >= 5) {
    s.exp += amount
    return
  }
  s.exp += amount
  while (s.tier < 5 && s.exp >= TIER_REQ[s.tier]) {
    s.exp -= TIER_REQ[s.tier]
    s.tier += 1
  }
}

function decaySkill(d: GameData, key: SkillKey): boolean {
  const s = d.skills[key]
  if (s.tier >= 5) return false
  const beforeTier = s.tier
  const beforeExp = s.exp
  s.exp -= TIER_REQ[s.tier] * 0.05
  while (s.exp < 0 && s.tier > 0) {
    s.tier -= 1
    s.exp += TIER_REQ[s.tier]
  }
  if (s.exp < 0) s.exp = 0
  return s.tier !== beforeTier || s.exp !== beforeExp
}

function settleWeek(d: GameData): void {
  d.money -= 50
  if (d.money < 0) {
    d.mood = clamp(d.mood - 12, 0, 100)
    let text = `周日结算：你没能交上这周的 50 铜币，欠款 ${Math.abs(d.money)} 铜。`
    if (!d.flags.church_volunteer) {
      d.flags.church_volunteer = true
      text += ' 诺拉看了看账本：“教堂救济院缺人手。你去帮几天忙，至少能还上一点。”'
    }
    d.notice = d.notice ? `${d.notice} ${text}` : text
    pushLog(d, text)
  } else {
    const text = '周日结算：你把 50 铜币交给诺拉，算作这周的一点还款。'
    d.notice = d.notice ? `${d.notice} ${text}` : text
    pushLog(d, text)
  }
  const week = Math.floor(d.day / 7)
  const trained = d.training?.week === week ? d.training.skills : []
  const decayable: SkillKey[] = [
    'physique',
    'knowledge',
    'will',
    'brawl',
    'sword',
    'nature',
    'cultivation',
    'alchemy',
  ]
  const decayed: SkillKey[] = []
  for (const key of decayable) {
    if (trained.includes(key)) continue
    if (decaySkill(d, key)) decayed.push(key)
  }
  if (decayed.length) {
    pushLog(d, `${decayed.map((key) => SKILL_LABEL[key]).join('、')}有些生疏了。`)
  }
  if (currentYear(d.day) >= 2 && d.west.stage === 0) {
    d.west.construction = Math.min(WEST_CONSTRUCTION_MAX, d.west.construction + 5)
    pushLog(d, '西镇的人也在修补。建设值 +5。')
    checkWestStage(d)
  }
}

function applyFaint(d: GameData, place?: string): void {
  const target = d.minutes < 6 * 60 ? 6 * 60 : 24 * 60 + 6 * 60
  advanceTime(d, target - d.minutes)
  d.minutes = 6 * 60
  d.spirit = 50
  d.stamina = 50
  d.location = 'dorm'
  const where = place ? `在${place}里` : ''
  const text = `你${where}眼前一黑，昏了过去。醒来时，你躺在孤儿院的寝室里。`
  d.notice = d.notice ? `${d.notice} ${text}` : text
  pushLog(d, text)
}

function advanceTime(d: GameData, minutes: number): boolean {
  const beforeTotal = d.day * 1440 + d.minutes
  const beforeDay = Math.floor(beforeTotal / 1440)
  const afterTotal = beforeTotal + minutes
  d.day = Math.floor(afterTotal / 1440)
  d.minutes = afterTotal % 1440
  const daysPassed = d.day - beforeDay
  for (let i = 0; i < daysPassed; i++) {
    if (d.mood > 60) d.mood = clamp(d.mood - 1, 0, 100)
  }
  if (d.meals.day !== d.day) {
    d.meals = { day: d.day, breakfast: false, lunch: false, dinner: false }
  }

  const firstWeekBoundary = Math.floor(beforeTotal / 10080) * 10080 + 6 * 1440 + 22 * 60
  for (let b = firstWeekBoundary; b <= afterTotal; b += 10080) {
    if (b > beforeTotal) settleWeek(d)
  }

  if (beforeDay < YEAR_DAYS && d.day >= YEAR_DAYS) {
    d.flags.year2_started = true
    d.courseMastery = {}
    const text = '第二学年开始了。边区支援项目在等你。'
    d.notice = d.notice ? `${d.notice} ${text}` : text
    pushLog(d, text)
  } else if (d.day >= YEAR_DAYS && !d.flags.year2_started) {
    d.flags.year2_started = true
  }
  if (beforeDay < YEAR_DAYS * 2 && d.day >= YEAR_DAYS * 2) {
    d.flags.year3_notice = true
    const text = '第二学年结束了。第三学年内容尚未开放。'
    d.notice = d.notice ? `${d.notice} ${text}` : text
    pushLog(d, text)
  } else if (d.day >= YEAR_DAYS * 2 && !d.flags.year3_notice) {
    d.flags.year3_notice = true
  }

  return d.day > Math.floor(beforeTotal / 1440)
}

function pushLog(d: GameData, text: string): void {
  d.log.push(`[${formatDate(d.day)} ${formatTime(d.minutes)}] ${text}`)
  if (d.log.length > 200) d.log.splice(0, d.log.length - 200)
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m} 分钟`
  if (m === 0) return `${h} 小时`
  return `${h} 小时 ${m} 分钟`
}

function battleLog(b: BattleState, text: string): void {
  b.log.push(text)
  if (b.log.length > 24) b.log.splice(0, b.log.length - 24)
}

function resetReliefDay(d: GameData): void {
  if (d.relief.day !== d.day) {
    d.relief = { day: d.day, cared: false, treated: false, volunteered: false }
  }
}

function applyEventEffects(d: GameData, e?: EventEffects, expCapTier?: number): void {
  if (!e) return
  if (e.minutes) advanceTime(d, e.minutes)
  if (e.stamina) d.stamina = clamp(d.stamina + e.stamina, 0, maxStamina(d.skills.physique.tier))
  if (e.spirit) d.spirit = clamp(d.spirit + e.spirit, 0, maxSpirit(d.skills.will.tier))
  if (e.mood) d.mood = clamp(d.mood + e.mood, 0, 100)
  if (e.mana) d.mana = clamp(d.mana + e.mana, 0, 100)
  if (e.money) d.money += e.money
  if (e.exp) {
    const capped = cappedExpSkills(d, e, expCapTier)
    ;(Object.keys(e.exp) as SkillKey[]).forEach((k) => {
      if (!capped.includes(k)) addExp(d, k, e.exp![k] ?? 0)
    })
  }
  if (e.affinity) {
    Object.entries(e.affinity).forEach(([k, v]) => {
      d.affinity[k] = Math.min(100, (d.affinity[k] ?? 0) + v)
    })
  }
  if (e.flag) d.flags[e.flag] = true
  if (e.meal) {
    if (d.meals.day !== d.day) {
      d.meals = { day: d.day, breakfast: false, lunch: false, dinner: false }
    }
    d.meals[e.meal] = true
  }
}

function applyStoryEffects(d: GameData, e?: StoryEffects): void {
  if (!e) return
  if (e.stamina) d.stamina = clamp(d.stamina + e.stamina, 0, maxStamina(d.skills.physique.tier))
  if (e.spirit) d.spirit = clamp(d.spirit + e.spirit, 0, maxSpirit(d.skills.will.tier))
  if (e.mood) d.mood = clamp(d.mood + e.mood, 0, 100)
  if (e.mana) d.mana = clamp(d.mana + e.mana, 0, 100)
  if (e.money) d.money += e.money
  if (e.exp) {
    ;(Object.keys(e.exp) as SkillKey[]).forEach((k) => addExp(d, k, e.exp![k] ?? 0))
  }
  if (e.affinity) {
    Object.entries(e.affinity).forEach(([k, v]) => {
      d.affinity[k] = (d.affinity[k] ?? 0) + v
    })
  }
  if (e.flag) d.flags[e.flag] = true
  if (e.time !== undefined) d.minutes = e.time
  if (e.location) d.location = e.location
}

type Modal = 'sleep' | 'study' | 'practice' | 'battleSelect' | 'wait' | 'save' | 'export' | 'import' | 'log' | 'debug' | 'inventory' | 'shop' | 'drinks' | 'relations' | 'stats' | 'eventPicker' | 'plazaNotices' | 'bookshelf' | 'reading' | 'exam' | 'examHandoff' | 'examOpen' | 'westBoard' | 'westRecord' | 'academyBoard' | 'guildBoard' | 'brew' | 'workshop' | 'engrave' | 'starChart' | 'calendar' | null

type TitlePanel = 'saves' | 'export' | 'import' | null

type Store = {
  screen: Screen
  player: Player
  data: GameData
  sidebarOpen: boolean
  modal: Modal
  titlePanel: TitlePanel
  message: string
  savesRev: number
  storyReply: string[] | null
  storyNext: number | null
  storyRoute: string[]
  storyTarget: number | null
  pendingEvent: string | null
  eventResult: string | null
  battle: BattleState | null
  battleBonusCopper: number
  activePackageId: string | null
  examCourseId: string | null

  setScreen: (s: Screen) => void
  startNewGame: (name: string, gender: Gender) => void
  continueGame: () => boolean
  toggleSidebar: () => void
  setModal: (m: Modal) => void
  setTitlePanel: (p: TitlePanel) => void
  clearNotice: () => void
  clearMessage: () => void
  storyChoose: (index: number) => void
  storyContinue: () => void
  storyTravel: () => void
  storyWait: () => void

  eventChoose: (index: number) => void
  eventContinue: () => void

  takeExam: (courseId: string, prep: boolean, early: boolean) => void
  startExam: (courseId: string) => void
  checkExamPackages: () => void
  receiveExamPackage: (id: string) => void
  startOpenExamPackage: (id: string) => void
  closeExamPackage: () => void

  startBattle: (enemyId: string) => void
  battleTick: () => void
  battleOpenSubmenu: (menu: Exclude<BattleSubmenu, null>) => void
  battleBack: () => void
  battleAttack: (kind: 'brawl' | 'sword') => void
  battleCast: (spellId: string) => void
  battleUseItem: (id: string) => void
  battleChangeWeapon: (id: string) => void
  battleYield: () => void
  battleClose: () => void

  moveTo: (id: string) => void
  walkPlaza: () => void
  readPlazaNotices: () => void
  feedPigeons: () => void
  storeBook: (id: string) => void
  takeBook: (id: string) => void
  readBook: (id: string) => void
  searchLibrary: () => void
  teleport: (to: 'west' | 'town') => void
  acceptWestCommission: (id: string) => void
  doWestCommission: (id: string) => void
  doWestGeneric: (id: string) => void
  listenWestRumors: () => void
  westLookout: () => void
  westPatrol: () => void
  acceptGuildJob: (id: string) => void
  doGuildJob: (id: string) => void
  startEscort: () => void
  escortContinue: () => void
  escortArrive: () => void
  escortAbort: () => void
  returnFromEscort: () => void
  startWildBattle: (enemyId: string, bonusCopper: number) => void
  eat: () => void
  rest: () => void
  sleep: (hours: number) => void
  sleepUntil: (targetMinutes: number) => void
  attendClass: () => void
  slackClass: () => void
  study: (key: SkillKey) => void
  previewClass: () => void
  practice: (key: SkillKey) => void
  visitGreenhouse: () => void
  identifyHerbs: () => void
  lookAtRunes: () => void
  engraveRune: (itemId: string, runeId: string) => void
  observeStars: () => void
  askCalendar: () => void
  openStarChart: () => void
  helpBackyard: () => void
  helpOrphanKids: () => void
  joinRite: () => void
  prepareRite: () => void
  sweepGrave: () => void
  walkForest: () => void
  exploreForestDeep: () => void
  gatherHerbs: () => void
  careHerbs: () => void
  brewPotion: (recipeId: string) => void
  chatWithNpc: (id: string) => boolean
  wait: (minutes: number) => void
  workShop: () => void
  workPotionWorkshop: () => void
  rentBrewKit: () => void
  learnAlchemyAtWorkshop: () => void
  workTavern: () => void
  orderDrink: (id: string) => void
  listenTavern: () => void
  buyItem: (id: string) => void
  sellItem: (id: string, all: boolean) => void
  useItem: (id: string) => void
  equipItem: (id: string) => void
  unequipSlot: (slot: EquipmentSlot) => void
  pray: () => void
  meditate: () => void
  tidyDonations: () => void
  careForPatients: () => void
  treatAtRelief: () => void
  volunteerAtRelief: () => void
  climbBellTower: () => void

  saveSlot: (slot: number | 'auto') => void
  loadSlot: (slot: number | 'auto') => void
  removeSlot: (slot: number | 'auto') => void
  refreshSaves: () => void
  autosave: () => void

  debugMoney: () => void
  debugExp: () => void
  debugHour: () => void
  debugDay: () => void
  debugSpell: () => void
  debugHeal: () => void
  debugEvent: (id: string) => void
  resetGame: () => void
}

function resetWestPeriod(d: GameData): void {
  const period = supportPeriodAt(d.day)
  const key = period?.key ?? null
  if (d.west.period !== key) {
    d.west.period = key
    d.west.setIndex = 0
    d.west.accepted = []
    d.west.done = []
  }
}

function westRepairIds(d: GameData): string[] {
  if (d.west.stage >= 1) return ['maintenance']
  return (['wall', 'ditch', 'lamp'] as const).filter(
    (key) => (d.west.projects[key] ?? 0) < WEST_PROJECT_MAX,
  )
}

function westSetComplete(d: GameData): boolean {
  const repairDone = ['wall', 'ditch', 'lamp', 'maintenance'].some((id) =>
    d.west.done.includes(id),
  )
  const repairAvailable = westRepairIds(d).length > 0
  return (repairDone || !repairAvailable) && d.west.done.includes('patrol') && d.west.done.includes('care')
}

function refreshWestSet(d: GameData): void {
  const period = supportPeriodAt(d.day)
  if (!period) return
  if (!westSetComplete(d)) return
  if (d.west.setIndex + 1 >= period.maxSets) {
    d.west.setIndex = period.maxSets
    return
  }
  d.west.setIndex += 1
  d.west.accepted = []
  d.west.done = []
  const text = `第 ${d.west.setIndex + 1} 组委托已刷新。`
  d.notice = d.notice ? `${d.notice} ${text}` : text
  pushLog(d, text)
}

function syncGuildWeek(d: GameData): void {
  if (d.guild.escort) return
  const week = guildWeek(d.day)
  if (d.guild.week !== week) {
    d.guild.week = week
    d.guild.accepted = []
    d.guild.done = []
  }
}

function checkWestStage(d: GameData): void {  if (d.west.stage >= 1) {
    d.west.construction = Math.min(WEST_CONSTRUCTION_MAX, d.west.construction)
    return
  }
  if (d.west.construction < WEST_CONSTRUCTION_MAX) return
  if (!(['wall', 'ditch', 'lamp'] as const).every((key) => (d.west.projects[key] ?? 0) >= WEST_PROJECT_MAX)) {
    return
  }
  d.west.stage = 1
  d.west.construction = WEST_CONSTRUCTION_MAX
  d.flags.west_stage1 = true
  const text = '西镇的重建暂时告一段落。阶段 1：勉强维持。'
  d.notice = d.notice ? `${d.notice} ${text}` : text
  pushLog(d, text)
}

export const useGame = create<Store>((set, get) => {
  const mutate = (fn: (d: GameData) => string) => {
    const { data, player } = get()
    const next = structuredClone(data)
    const msg = fn(next)
    resetWestPeriod(next)
    syncGuildWeek(next)
    checkWestStage(next)
    const learned = maybeUnlockFireballReading(next)
    const report = semesterEndFor(data.day, next.day)
    if (report) {
      const key = `report_s${report.year}_${report.semester}`
      if (!next.flags[key]) {
        next.flags[key] = true
        ensureSemesterPackage(next, report)
      }
    }
    set({ data: next, message: learned ? (msg ? `${msg} ${learned}` : learned) : msg })
    if (next.day !== data.day && !next.guild.escort) {
      saveGame('auto', player, next)
    }
  }

  const maybeEvent = (trigger: EventTrigger) => {
    const { data, pendingEvent, storyTarget } = get()
    if (pendingEvent) return
    if (!data.storyDone || data.storyStep >= 0) return
    if (storyTarget !== null) return

    const today = data.events.day === data.day ? data.events.today : []
    if (today.length >= EVENT_DAILY_CAP) return

    const abs = absoluteMinutes(data.day, data.minutes)
    if (abs - data.events.lastAt < EVENT_GAP_MINUTES) return
    if (Math.random() >= EVENT_CHANCE) return

    const candidates = EVENTS.filter((e) => eventMatches(e, data, trigger))
    if (candidates.length === 0) return

    const total = candidates.reduce((sum, e) => sum + (e.weight ?? 1), 0)
    let roll = Math.random() * total
    let picked = candidates[candidates.length - 1]
    for (const e of candidates) {
      roll -= e.weight ?? 1
      if (roll <= 0) {
        picked = e
        break
      }
    }

    const next = structuredClone(data)
    if (next.events.day !== next.day) {
      next.events.day = next.day
      next.events.count = 0
      next.events.today = []
    }
    next.events.count += 1
    next.events.today.push(picked.id)
    next.events.lastSeen[picked.id] = next.day
    next.events.lastAt = abs
    if (picked.once) next.events.seen.push(picked.id)
    set({ data: next, pendingEvent: picked.id, eventResult: null, message: '' })
  }

  const enterScene = (target: number) => {
    const { data } = get()
    if (target < 0 || target >= STORY.length) return
    const scene = STORY[target]
    const next = structuredClone(data)
    next.storyStep = target
    next.location = scene.location
    next.minutes = Math.max(next.minutes, scene.time)
    set({
      data: next,
      storyReply: null,
      storyNext: null,
      storyRoute: [],
      storyTarget: null,
      message: '',
    })
  }

  const beginTransition = (target: number) => {
    const { data } = get()
    if (target < 0 || target >= STORY.length) {
      finishDayOne()
      return
    }
    const scene = STORY[target]
    const route = routeBetween(data.location, scene.location)
    if (route.length > 0) {
      set({
        storyRoute: route,
        storyTarget: target,
        storyReply: null,
        storyNext: null,
        message: '',
      })
      return
    }
    if (data.minutes < scene.time) {
      set({
        storyRoute: [],
        storyTarget: target,
        storyReply: null,
        storyNext: null,
        message: '',
      })
      return
    }
    enterScene(target)
  }

  const finishDayOne = () => {
    const { data, player } = get()
    const next = structuredClone(data)
    advanceTime(next, 8 * 60)
    next.minutes = 6 * 60
    next.stamina = clamp(next.stamina + 8 * 8 + 10, 0, maxStamina(next.skills.physique.tier))
    next.spirit = clamp(next.spirit + 8 * 8, 0, maxSpirit(next.skills.will.tier))
    next.hp = clamp(next.hp + 8 * 5, 0, maxHp(next.skills.physique.tier))
    next.mana = clamp(next.mana + 16, 0, 100)
    next.mood = clamp(next.mood + 2, 0, 100)
    next.storyStep = -1
    next.storyDone = true
    next.location = 'dorm'
    pushLog(next, '第一天结束了。')
    set({
      data: next,
      storyReply: null,
      storyNext: null,
      storyRoute: [],
      storyTarget: null,
      message: '第一天结束了。',
    })
    saveGame('auto', player, next)
  }

  return {
    screen: 'title',
    player: { name: '', gender: 'male' },
    data: freshData(),
    sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 860 : true,
    modal: null,
    titlePanel: null,
    message: '',
    savesRev: 0,
    storyReply: null,
    storyNext: null,
    storyRoute: [],
    storyTarget: null,
    pendingEvent: null,
    eventResult: null,
    battle: null,
    activePackageId: null,
    examCourseId: null,
    battleBonusCopper: 0,

    setScreen: (screen) => set({ screen }),
    startNewGame: (name, gender) => {
      const data = freshData()
      set({
        screen: 'game',
        player: { name: name.trim() || '无名', gender },
        data,
        modal: null,
        titlePanel: null,
        message: '',
        storyReply: null,
        storyNext: null,
        storyRoute: [],
        storyTarget: null,
        pendingEvent: null,
        eventResult: null,
        battle: null,
        activePackageId: null,
        examCourseId: null,
        battleBonusCopper: 0,
        sidebarOpen: typeof window !== 'undefined' ? window.innerWidth > 860 : true,
      })
      saveGame('auto', { name: name.trim() || '无名', gender }, data)
    },
    continueGame: () => {
      const s = loadGame('auto')
      if (!s) return false
      set({
        screen: 'game',
        player: s.player,
        data: normalizeData(s.data),
        modal: null,
        titlePanel: null,
        message: '',
        storyReply: null,
        storyNext: null,
        storyRoute: [],
        storyTarget: null,
        pendingEvent: null,
        eventResult: null,
        battle: null,
        activePackageId: null,
        examCourseId: null,
        battleBonusCopper: 0,
      })
      return true
    },
    toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
    setModal: (modal) => set({ modal }),
    setTitlePanel: (titlePanel) => set({ titlePanel }),
    clearNotice: () => {
      const next = structuredClone(get().data)
      next.notice = ''
      set({ data: next })
    },
    clearMessage: () => set({ message: '' }),
    storyChoose: (index) => {
      const { data } = get()
      const scene = STORY[data.storyStep]
      const choice = scene?.choices?.[index]
      if (!choice) return
      const next = structuredClone(data)
      applyStoryEffects(next, choice.effects)
      set({
        data: next,
        storyReply: choice.reply,
        storyNext: choice.next ?? scene.next ?? data.storyStep + 1,
        message: '',
      })
    },
    storyContinue: () => {
      const { data, storyReply, storyNext, storyTarget } = get()
      if (storyTarget !== null) return
      const scene = STORY[data.storyStep]
      if (!scene) return
      if (!storyReply && scene.sleep) {
        finishDayOne()
        return
      }
      const target = storyReply
        ? storyNext ?? scene.next ?? data.storyStep + 1
        : scene.next ?? data.storyStep + 1
      if (target >= STORY.length) {
        finishDayOne()
        return
      }
      if (scene.duration) {
        const next = structuredClone(data)
        advanceTime(next, scene.duration)
        set({ data: next, storyReply: null, storyNext: null })
        beginTransition(target)
      } else {
        set({ storyReply: null, storyNext: null })
        beginTransition(target)
      }
    },
    storyTravel: () => {
      const { data, storyRoute, storyTarget } = get()
      if (!storyRoute.length || storyTarget === null) return
      const leg = storyRoute[0]
      const remaining = storyRoute.slice(1)
      const next = structuredClone(data)
      const step = exitsOf(data.location).find((e) => e.to === leg)
      advanceTime(next, step?.minutes ?? ENTER_MINUTES)
      next.location = leg
      pushLog(next, `你走到了${getLocation(leg).name}。`)
      set({ data: next, storyRoute: remaining, message: '' })
      if (remaining.length === 0) {
        const scene = STORY[storyTarget]
        if (next.minutes >= scene.time) enterScene(storyTarget)
      }
    },
    storyWait: () => {
      const { data, storyTarget } = get()
      if (storyTarget === null) return
      const scene = STORY[storyTarget]
      const next = structuredClone(data)
      if (next.minutes < scene.time) {
        next.minutes = scene.time
        pushLog(next, '你等了一会儿。')
      }
      set({ data: next })
      enterScene(storyTarget)
    },

    eventChoose: (index) => {
      const { data, pendingEvent } = get()
      if (!pendingEvent) return
      const event = eventById(pendingEvent)
      const choice = event?.choices[index]
      if (!event || !choice) return
      const blocked = choiceBlockedReason(data, choice.effects)
      if (blocked) {
        set({ message: blocked })
        return
      }
      const capped = cappedExpSkills(data, choice.effects, event.expCapTier)
      mutate((d) => {
        applyEventEffects(d, choice.effects, event.expCapTier)
        return ''
      })
      const result = choice.result ?? '你做出了选择。'
      set({
        eventResult:
          capped.length > 0
            ? `${result} 你已经很熟练了，无法再从这件事中获得经验。`
            : result,
      })
    },

    eventContinue: () => {
      set({ pendingEvent: null, eventResult: null, message: '' })
    },

    startExam: (courseId) => {
      const { data } = get()
      const year = currentYear(data.day)
      if (!isExamDay(data.day) || (year !== 1 && year !== 2)) return
      const course = examCoursesForYear(year).find((c) => c.id === courseId)
      if (!course) return
      if (data.location !== courseExamLocationOn(course, data.day)) {
        set({ message: '你不在考场。' })
        return
      }
      if (data.minutes < course.start || data.minutes >= course.start + 30) {
        set({ message: '现在不能入场。' })
        return
      }
      const pkg = data.examPackages.find(
        (p) => p.kind === 'monthly' && p.day === data.day,
      )
      if (pkg?.results[courseId] !== undefined) {
        set({ message: '这门考试已经结束了。' })
        return
      }
      set({ examCourseId: courseId, modal: 'exam' })
    },

    takeExam: (courseId, prep, early) => {
      const { data } = get()
      const year = currentYear(data.day)
      if (!isExamDay(data.day) || (year !== 1 && year !== 2)) return
      const course = examCoursesForYear(year).find((c) => c.id === courseId)
      if (!course) return
      if (data.location !== courseExamLocationOn(course, data.day)) {
        set({ message: '你不在考场。' })
        return
      }
      if (data.minutes < course.start || data.minutes >= course.start + 30) {
        set({ message: '现在不能入场。' })
        return
      }
      const existing = data.examPackages.find(
        (p) => p.kind === 'monthly' && p.day === data.day,
      )
      if (existing?.results[courseId] !== undefined) {
        set({ message: '这门考试已经结束了。' })
        return
      }
      if (prep && course.kind === 'physical') {
        if (data.stamina < 2) {
          set({ message: '体力不足，无法热身。' })
          return
        }
      } else if (prep && data.spirit < 1) {
        set({ message: '精神不足，无法翻笔记。' })
        return
      }
      const examDay = data.day
      const duration = course.end - course.start
      mutate((d) => {
        if (prep) {
          advanceTime(d, 30)
          if (course.kind === 'physical') {
            d.stamina = clamp(d.stamina - 2, 0, maxStamina(d.skills.physique.tier))
          } else {
            d.spirit = clamp(d.spirit - 1, 0, maxSpirit(d.skills.will.tier))
          }
        }
        advanceTime(d, early ? Math.round(duration / 2) : duration)
        const threshold = examThresholdForDay(examDay)
        const mastery = d.courseMastery[courseId] ?? 0
        const bonus = (prep ? 0.5 : 0) - (early ? 1 : 0)
        const result: ExamResult = mastery + bonus >= threshold ? 'pass' : 'fail'
        const { pkg } = ensureMonthlyPackage(d, examDay)
        pkg.results[courseId] = result
        pushLog(d, `你参加了${course.name}考试。`)
        return `你考完了${course.name}。成绩会在周日寄到孤儿院。`
      })
      set({ modal: null, examCourseId: null })
    },

    checkExamPackages: () => {
      const { data, screen, modal, pendingEvent, battle } = get()
      if (screen !== 'game' || modal !== null || pendingEvent || battle) return
      if (data.location !== 'orphanage') return
      const next = structuredClone(data)
      const changed = ensureMonthlyPackages(next)
      const now = packageNow(next)
      const pkg = next.examPackages
        .filter((p) => !p.received && p.availableAt <= now)
        .sort((a, b) => a.day - b.day)[0]
      if (!pkg) {
        if (changed) set({ data: next })
        return
      }
      set({ data: next, activePackageId: pkg.id, modal: 'examHandoff' })
    },

    receiveExamPackage: (id) => {
      const next = structuredClone(get().data)
      const pkg = next.examPackages.find((p) => p.id === id)
      if (!pkg || pkg.received) return
      pkg.received = true
      set({ data: next, modal: null, activePackageId: null, message: '你收下了包裹。' })
    },

    startOpenExamPackage: (id) => {
      const next = structuredClone(get().data)
      const pkg = next.examPackages.find((p) => p.id === id)
      if (!pkg || !pkg.received || pkg.opened) return
      pkg.opened = true
      if (pkg.kind === 'monthly') {
        for (const result of Object.values(pkg.results)) {
          next.mood = clamp(next.mood + (result === 'pass' ? 1 : -2), 0, 100)
        }
        pushLog(next, '你拆开了成绩单。')
      } else {
        pushLog(next, '你拆开了学期成绩单。')
      }
      set({ data: next, modal: 'examOpen', activePackageId: id })
    },

    closeExamPackage: () => {
      set({ modal: null, activePackageId: null })
    },

    startBattle: (enemyId) => {
      const { data } = get()
      if (data.location !== 'yard') {
        set({ message: '你需要在演武场才能切磋。' })
        return
      }
      const enemy = ENEMIES[enemyId]
      if (!enemy) return
      set({
        battle: {
          kind: 'spar',
          enemyId,
          enemyHp: enemy.hp,
          playerHp: Math.max(1, data.hp),
          playerGauge: 0,
          enemyGauge: 0,
          elapsedTicks: 0,
          casting: null,
          actions: 0,
          log: [enemy.intro, '行动条开始充能。'],
          phase: 'filling',
          submenu: null,
          result: '',
          usedSkills: [],
        },
        modal: null,
        message: '',
      })
    },

    battleTick: () => {
      const { battle, data } = get()
      if (!battle) return
      if (battle.phase !== 'filling' && battle.phase !== 'casting') return
      const enemy = ENEMIES[battle.enemyId]
      if (!enemy) return

      const b: BattleState = {
        ...battle,
        log: [...battle.log],
        casting: battle.casting ? { ...battle.casting } : null,
      }
      b.elapsedTicks += 1
      let nextData = data

      if (b.phase === 'filling') {
        const now = absoluteMinutes(data.day, data.minutes)
        const swift = combatBuffActive(data.combatBuffs, 'swift', now)
        const swiftRune = anySlotHasRune(data, ['armor', 'offHand', 'accessory'], 'swift')
        const speedBonus = (swift ? 0.05 : 0) + (swiftRune ? 0.05 : 0)
        b.playerGauge = Math.min(100, b.playerGauge + 4 * (1 + speedBonus))
      }
      if (enemy.speed > 0) b.enemyGauge = Math.min(100, b.enemyGauge + enemy.speed)

      if (b.enemyBurn && b.enemyBurn.ticksLeft > 0) {
        if (b.elapsedTicks % 10 === 0) {
          const burnDmg = b.enemyBurn.stacks * 2
          b.enemyHp = Math.max(0, b.enemyHp - burnDmg)
          battleLog(b, `烧伤造成 ${burnDmg} 点伤害。 -${burnDmg}`)
          if (b.enemyHp <= 0) {
            b.phase = 'victory'
            b.submenu = null
            b.result = `${enemy.defeatLine}${b.kind === 'wild' ? '' : ' 你结束了练习。'}`
            battleLog(b, enemy.defeatLine)
            set({ battle: b, data: nextData })
            return
          }
        }
        b.enemyBurn.ticksLeft -= 1
        if (b.enemyBurn.ticksLeft <= 0) b.enemyBurn = null
      }

      let castReady = false
      if (b.casting) {
        const spell = SPELLS[b.casting.spellId]
        if (!spell) {
          b.casting = null
          b.phase = 'filling'
        } else {
          const step = 100 / Math.max(1, spell.castTicks)
          b.casting.progress = Math.min(100, b.casting.progress + step)
          const targetDrained =
            b.casting.progress >= 100
              ? spell.mana
              : Math.floor((spell.mana * b.casting.progress) / 100)
          const delta = Math.max(0, targetDrained - b.casting.manaDrained)
          if (delta > 0) {
            nextData = structuredClone(data)
            nextData.mana = clamp(nextData.mana - delta, 0, 100)
            b.casting.manaDrained += delta
          }
          if (b.casting.progress >= 100) castReady = true
        }
      }

      if (b.phase === 'filling' && b.playerGauge >= 100) {
        b.phase = 'player'
        set({ battle: b, data: nextData })
        return
      }

      if (castReady && b.casting) {
        const spell = SPELLS[b.casting.spellId]
        if (spell) {
          if (b.casting.manaDrained < spell.mana) {
            if (nextData === data) nextData = structuredClone(data)
            nextData.mana = clamp(nextData.mana - (spell.mana - b.casting.manaDrained), 0, 100)
            b.casting.manaDrained = spell.mana
          }
          const [min, max] = spellDamageRange(
            spell,
            nextData.skills.nature.tier,
            enemy.defense,
            (ITEMS[nextData.equipment.mainHand ?? '']?.spellPower ?? 0) +
              (anySlotHasRune(nextData, ['mainHand', 'accessory'], 'spell') ? 1 : 0),
          )
          const dmg = randInt(min, max)
          b.enemyHp = Math.max(0, b.enemyHp - dmg)
          if (!b.usedSkills.includes('nature')) b.usedSkills = [...b.usedSkills, 'nature']
          b.actions += 1
          b.playerGauge = 0
          b.casting = null
          battleLog(b, `你念出咒语，${spell.name}在${enemy.name}身上炸开。 -${dmg}`)
          if (b.enemyHp <= 0) {
            b.phase = 'victory'
            b.submenu = null
            b.result = `${enemy.defeatLine}${b.kind === 'wild' ? '' : ' 你结束了练习。'}`
            battleLog(b, enemy.defeatLine)
            set({ battle: b, data: nextData })
            return
          }
          b.phase = 'filling'
        }
      }

      if (enemy.speed > 0 && b.enemyGauge >= 100) {
        b.enemyGauge = 0
        b.actions += 1
        const stone = combatBuffActive(
          nextData.combatBuffs,
          'stone',
          absoluteMinutes(nextData.day, nextData.minutes),
        )
          ? 1
          : 0
        const reduction =
          Math.floor(nextData.skills.physique.tier / 2) +
          (nextData.flags.book_defense_notes ? 1 : 0) +
          stone +
          (anySlotHasRune(nextData, ['armor', 'offHand'], 'guard') ? 1 : 0)
        const dmg = Math.max(1, enemy.attack + randInt(0, 2) - reduction)
        b.playerHp = Math.max(0, b.playerHp - dmg)
        const line = enemy.attackLines.length
          ? enemy.attackLines[randInt(0, enemy.attackLines.length - 1)]
          : `${enemy.name}撞了你一下。`
        battleLog(b, `${line} -${dmg}`)
        if (b.playerHp <= 0) {
          b.phase = 'defeat'
          b.submenu = null
          b.casting = null
          b.result =
            b.kind === 'wild'
              ? '你被击倒在地，眼前一阵发黑。'
              : '你被逼退到场边，抬手认输。练习到此为止。'
          battleLog(b, b.kind === 'wild' ? '你倒了下去。' : '你抬手认输。')
        }
      }

      set({ battle: b, data: nextData })
    },

    battleOpenSubmenu: (menu) => {
      const { battle } = get()
      if (!battle || battle.phase !== 'player') return
      set({ battle: { ...battle, phase: 'submenu', submenu: menu } })
    },

    battleBack: () => {
      const { battle } = get()
      if (!battle || battle.phase !== 'submenu') return
      set({ battle: { ...battle, phase: 'player', submenu: null } })
    },

    battleAttack: (kind) => {
      const { battle, data } = get()
      if (!battle || battle.phase !== 'submenu' || battle.submenu !== 'attack') return
      const enemy = ENEMIES[battle.enemyId]
      if (!enemy) return
      const mainHand = data.equipment.mainHand
      const weapon = mainHand ? ITEMS[mainHand] : null
      if (kind === 'sword' && weapon?.weapon !== 'sword') {
        set({ message: '需要装备剑才能使用剑术。' })
        return
      }

      const bookBonus =
        (kind === 'sword' && data.flags.book_sword_manual) ||
        (kind === 'brawl' && data.flags.book_brawl_manual)
          ? 1
          : 0
      const [min, max] = attackDamageRange(
        kind,
        data.skills[kind].tier,
        mainHand,
        enemy.defense,
        bookBonus,
      )
      const sharp = combatBuffActive(
        data.combatBuffs,
        'sharp',
        absoluteMinutes(data.day, data.minutes),
      )
        ? 1
        : 0
      const edge = kind === 'sword' && slotHasRune(data, 'mainHand', 'edge') ? 1 : 0
      const dmg = randInt(min, max) + sharp + edge
      const next = structuredClone(data)

      const b: BattleState = { ...battle, log: [...battle.log] }
      b.enemyHp = Math.max(0, b.enemyHp - dmg)
      if (!b.usedSkills.includes(kind)) b.usedSkills = [...b.usedSkills, kind]
      b.actions += 1
      b.playerGauge = 0
      b.submenu = null
      const verb = kind === 'sword' ? '你挥剑斩向' : weapon?.weapon === 'staff' ? '你挥杖敲向' : '你挥拳打向'
      battleLog(b, `${verb}${enemy.name}。 -${dmg}`)

      if (b.enemyHp <= 0) {
        b.phase = 'victory'
        b.result = `${enemy.defeatLine}${b.kind === 'wild' ? '' : ' 你结束了练习。'}`
        battleLog(b, enemy.defeatLine)
      } else {
        if (
          kind === 'sword' &&
          weapon &&
          !weapon.medium &&
          slotHasRune(data, 'mainHand', 'burn') &&
          Math.random() < 0.4
        ) {
          const stacks = Math.min(3, (b.enemyBurn?.stacks ?? 0) + 1)
          b.enemyBurn = { stacks, ticksLeft: 40 }
          battleLog(b, `灼燃生效：${enemy.name}烧伤 ${stacks} 层。`)
        }
        b.phase = 'filling'
      }
      set({ battle: b, data: next })
    },

    battleCast: (spellId) => {
      const { battle, data } = get()
      if (!battle || battle.phase !== 'submenu' || battle.submenu !== 'spell') return
      const spell = SPELLS[spellId]
      if (!spell) return
      if (!data.spells.includes(spellId)) {
        set({ message: '你还没有学会这个法术。' })
        return
      }
      if (!ITEMS[data.equipment.mainHand ?? '']?.medium) {
        set({ message: '需要主手装备施法媒介。' })
        return
      }
      if (data.mana < spell.mana) {
        set({ message: '魔力不足。' })
        return
      }
      const enemy = ENEMIES[battle.enemyId]
      if (!enemy) return

      const b: BattleState = {
        ...battle,
        log: [...battle.log],
        casting: { spellId, progress: 0, manaDrained: 0 },
      }
      b.phase = 'casting'
      b.playerGauge = 0
      b.submenu = null
      battleLog(b, `你开始吟唱${spell.name}。`)
      set({ battle: b })
    },

    battleUseItem: (id) => {
      const { battle, data } = get()
      if (!battle || battle.phase !== 'submenu' || battle.submenu !== 'item') return
      const def = ITEMS[id]
      if (!def || (data.inventory[id] ?? 0) <= 0) return
      const buffKey = def.effect?.combatBuff
      if (buffKey) {
        const now = absoluteMinutes(data.day, data.minutes)
        const untilKey = combatBuffUntilKey(buffKey)
        if (data.combatBuffs[untilKey] > now) {
          set({
            message: `${COMBAT_BUFF_LABEL[buffKey]}药剂已生效（剩余 ${buffHours(
              data.combatBuffs[untilKey] - now,
            )}）。`,
          })
          return
        }
        const next = structuredClone(data)
        next.inventory[id] -= 1
        if (next.inventory[id] <= 0) delete next.inventory[id]
        setCombatBuff(next.combatBuffs, buffKey, now)
        const b: BattleState = { ...battle, log: [...battle.log] }
        battleLog(b, `你喝下${def.name}。${COMBAT_BUFF_LABEL[buffKey]}生效 24 小时。`)
        set({ battle: b, data: next })
        return
      }
      const healHp = def.effect?.hp ?? 0
      const healMana = def.effect?.mana ?? 0
      if (!healHp && !healMana) return
      const hpMax = maxHp(data.skills.physique.tier)
      if (healHp && battle.playerHp >= hpMax && !healMana) {
        set({ message: '生命已经满了。' })
        return
      }
      if (healMana && data.mana >= 100 && !healHp) {
        set({ message: '魔力已经满了。' })
        return
      }

      const next = structuredClone(data)
      next.inventory[id] -= 1
      if (next.inventory[id] <= 0) delete next.inventory[id]
      const b: BattleState = { ...battle, log: [...battle.log] }
      if (healHp) b.playerHp = clamp(b.playerHp + healHp, 0, hpMax)
      if (healMana) next.mana = clamp(next.mana + healMana, 0, 100)
      b.actions += 1
      b.playerGauge = 0
      b.submenu = null
      b.phase = 'filling'
      battleLog(
        b,
        `你使用了${def.name}。${healHp ? `生命 +${healHp}。` : ''}${healMana ? `魔力 +${healMana}。` : ''}`,
      )
      set({ battle: b, data: next })
    },

    battleChangeWeapon: (id) => {
      const { battle, data } = get()
      if (!battle || battle.phase !== 'submenu' || battle.submenu !== 'weapon') return
      const def = ITEMS[id]
      if (!def || def.type !== 'equipment' || def.slot !== 'mainHand') return
      if ((data.inventory[id] ?? 0) <= 0) return
      if (data.equipment.mainHand === id) {
        set({ message: '已经装备着这件武器。' })
        return
      }
      const next = structuredClone(data)
      next.equipment.mainHand = id
      const b: BattleState = { ...battle, log: [...battle.log] }
      b.actions += 1
      b.playerGauge = 0
      b.submenu = null
      b.phase = 'filling'
      battleLog(b, `你换上了${def.name}。`)
      set({ battle: b, data: next })
    },

    battleYield: () => {
      const { battle } = get()
      if (!battle || (battle.phase !== 'player' && battle.phase !== 'submenu')) return
      const enemy = ENEMIES[battle.enemyId]
      const b: BattleState = { ...battle, log: [...battle.log] }
      b.phase = 'defeat'
      b.submenu = null
      b.result = battle.kind === 'wild' ? `你转身退开，${enemy?.name ?? '它'}没有追上来。` : '你抬手认输，练习到此为止。'
      battleLog(b, battle.kind === 'wild' ? '你退出了战斗。' : '你抬手认输。')
      set({ battle: b, battleBonusCopper: 0 })
    },

    battleClose: () => {
      const { battle, data, player } = get()
      if (!battle) return
      const next = structuredClone(data)
      const hpMax = maxHp(next.skills.physique.tier)
      next.hp = clamp(Math.max(1, battle.playerHp), 1, hpMax)
      const minutes = Math.max(1, battle.actions)
      advanceTime(next, minutes)
      next.hp = clamp(next.hp, 0, maxHp(next.skills.physique.tier))
      const enemy = ENEMIES[battle.enemyId]
      let dropText = ''
      if (battle.phase === 'victory' && enemy) {
        const bonus = get().battleBonusCopper
        if (bonus > 0) {
          next.money += bonus
          dropText += ` 额外获得 ${bonus} 铜。`
          pushLog(next, `战斗额外奖励：${bonus} 铜。`)
        }
        const gains = battle.usedSkills.map((key) => {
          addExp(next, key, enemy.expValue)
          return `${SKILL_LABEL[key]}经验 +${enemy.expValue}`
        })
        if (gains.length) pushLog(next, `战斗经验：${gains.join('、')}。`)
        const addDrop = (id: string, text: string) => {
          next.inventory[id] = (next.inventory[id] ?? 0) + 1
          dropText += ` ${text}`
          pushLog(next, `你获得${ITEMS[id]?.name ?? id} ×1。`)
        }
        if (enemy.id === 'slime' && Math.random() < SLIME_GEL_DROP_CHANCE) {
          addDrop('slime_gel', '你从史莱姆留下的胶质里拾到一块凝胶。')
        }
        if (enemy.id === 'gray_wolf' && Math.random() < WOLF_HIDE_DROP_CHANCE) {
          addDrop('beast_hide', '你从灰狼身上剥下一张兽皮。')
        }
        if (enemy.id === 'boar') {
          if (Math.random() < BOAR_HIDE_DROP_CHANCE) {
            addDrop('beast_hide', '你从野猪身上剥下一张兽皮。')
          }
          if (Math.random() < BOAR_TUSK_DROP_CHANCE) {
            addDrop('boar_tusk', '你撬下一根野猪牙。')
          }
        }
      }
      const report = semesterEndFor(data.day, next.day)
      if (report) {
        const key = `report_s${report.year}_${report.semester}`
        if (!next.flags[key]) {
          next.flags[key] = true
          ensureSemesterPackage(next, report)
        }
      }
      if (next.guild.escort && battle.kind === 'wild' && battle.phase !== 'victory') {
        next.guild.escort.goodsDamaged = true
        pushLog(next, '货车在混乱中受了损。')
      }
      const text =
        (battle.kind === 'wild'
          ? `战斗结束，用时约 ${minutes} 分钟。`
          : `你结束了练习，用时约 ${minutes} 分钟。`) + dropText
      pushLog(next, text)
      set({ battle: null, data: next, message: text, modal: null, battleBonusCopper: 0 })
      if (!next.guild.escort) saveGame('auto', player, next)
    },

    moveTo: (id) => {
      const { data } = get()
      if (data.location === id) return
      const from = getLocation(data.location)
      const to = getLocation(id)
      const edge = exitsOf(data.location).find((e) => e.to === id)
      if (!edge) {
        set({ message: '从这里走不过去。' })
        return
      }
      if (data.location === 'gate' && id === 'outside' && !isGateOpen(data.minutes)) {
        set({ message: '城门已经关了。' })
        return
      }
      if (id === 'greenhouse' && !greenhouseOpenAt(data.minutes)) {
        set({ message: '温室已经锁门了。' })
        return
      }
      if (id === 'runeShop' && !isTimeWindow(data.minutes, RUNE_SHOP_OPEN_START, RUNE_SHOP_OPEN_END)) {
        set({ message: '符文工坊已经关门了。' })
        return
      }
      if (id === 'observatory' && !observatoryOpenAt(data.minutes)) {
        set({ message: '星象台已经关门了。' })
        return
      }
      const cost = edge.minutes
      let forcedEvent: string | null = null
      mutate((d) => {
        advanceTime(d, cost)
        d.location = id
        pushLog(d, `你从${from.name}走到了${to.name}。`)
        let text = `你走了 ${cost} 分钟，来到${to.name}。`
        if (data.location === 'gate' && id === 'town' && (d.minutes >= 22 * 60 || d.minutes < 6 * 60)) {
          if (!d.flags.gate_night_return) {
            d.flags.gate_night_return = true
            text += ' 守门的骑士打量了你片刻，才把侧门拉开。他让开半步，低声说了句：“下次早点。”'
          } else {
            text += ' 骑士朝你点了下头，侧门已经开了一半。'
          }
        }
        if (id === 'relief' && !d.flags.relief_intro) {
          d.flags.relief_intro = true
          text += ' 修女长伊莎贝尔正在和玛尔塔核对名单。她抬头看了你一眼，只说了句：“来帮忙的？听玛尔塔的。”'
        }
        if (id === 'westChapel' && !d.flags.west_chapel_seen) {
          d.flags.west_chapel_seen = true
          forcedEvent = 'west_chapel_seal'
        }
        return text
      })
      if (forcedEvent) {
        set({ pendingEvent: forcedEvent, eventResult: null, message: '' })
      } else {
        maybeEvent({ type: 'enter' })
      }
    },

    walkPlaza: () => {
      const { data } = get()
      if (data.location !== 'town') {
        set({ message: '这里不是广场。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 15)
        d.stamina = clamp(d.stamina - 1, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + 1, 0, 100)
        pushLog(d, '你在广场上走了一圈。')
        return '你在广场上走了一圈。心情 +1。'
      })
    },

    readPlazaNotices: () => {
      const { data } = get()
      if (data.location !== 'town') {
        set({ message: '这里没有告示板。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 5)
        return '你看完了告示。'
      })
      set({ modal: 'plazaNotices' })
    },

    feedPigeons: () => {
      const { data } = get()
      if (data.location !== 'town') {
        set({ message: '这里没有鸽子。' })
        return
      }
      if (data.minutes < 6 * 60 || data.minutes >= 18 * 60) {
        set({ message: '鸽子已经归巢了。' })
        return
      }
      if (data.plaza.day === data.day && data.plaza.fed) {
        set({ message: '它们已经吃饱了。' })
        return
      }
      if (data.money < 1) {
        set({ message: '你没有多余的铜币。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 5)
        d.money -= 1
        d.mood = clamp(d.mood + 1, 0, 100)
        d.plaza = { day: d.day, fed: true }
        pushLog(d, '你在广场上喂了一会儿鸽子。')
        return '你喂了一会儿鸽子。心情 +1。'
      })
    },

    storeBook: (id) => {
      const { data } = get()
      if (data.location !== 'dorm') {
        set({ message: '书柜在寝室。' })
        return
      }
      const book = BOOKS[id]
      if (!book) return
      if ((data.inventory[id] ?? 0) <= 0) return
      if (data.bookshelf.includes(id)) {
        set({ message: '书柜里已经有这本书了。' })
        return
      }
      if (data.bookshelf.length >= 10) {
        set({ message: '书柜放不下了。' })
        return
      }
      mutate((d) => {
        d.inventory[id] = (d.inventory[id] ?? 0) - 1
        if (d.inventory[id] <= 0) delete d.inventory[id]
        d.bookshelf = [...d.bookshelf, id]
        return `你把《${book.name}》放回了书柜。`
      })
    },

    takeBook: (id) => {
      const { data } = get()
      if (data.location !== 'dorm') {
        set({ message: '书柜在寝室。' })
        return
      }
      const book = BOOKS[id]
      if (!book || !data.bookshelf.includes(id)) return
      mutate((d) => {
        d.bookshelf = d.bookshelf.filter((x) => x !== id)
        d.inventory[id] = (d.inventory[id] ?? 0) + 1
        return `你把《${book.name}》从书柜取了出来。`
      })
    },

    readBook: (id) => {
      const { data } = get()
      if (data.location !== 'library') {
        set({ message: '这里不是读书的地方。' })
        return
      }
      const book = BOOKS[id]
      if (!book) return
      if ((data.inventory[id] ?? 0) <= 0) {
        set({ message: '你身上没有这本书。' })
        return
      }
      if (book.requiresFlag && !data.flags[book.requiresFlag]) {
        set({
          message: `你还看不懂这本书。需要${book.requirementText ?? '更高的学识'}。`,
        })
        return
      }
      const state = data.books[id] ?? { progress: 0, completed: false }
      const cost = book.spiritCost ?? 0
      if (cost > 0 && data.spirit <= cost) {
        mutate((d) => {
          applyFaint(d, getLocation(d.location).name)
          return '你没能撑住。'
        })
        set({ modal: null })
        return
      }
      const reread = !book.repeatable && state.completed
      mutate((d) => {
        advanceTime(d, 30)
        if (cost > 0) d.spirit = clamp(d.spirit - cost, 0, maxSpirit(d.skills.will.tier))
        if (reread) {
          const text = `你又翻了一遍《${book.name}》。这本书已经不会再带来新的收获。`
          pushLog(d, text)
          return text
        }
        const current = d.books[id] ?? { progress: 0, completed: false }
        let progress = current.progress + book.progressPerRead
        let completed = current.completed
        let text = `你在藏书阁读了半小时《${book.name}》。阅读进度 ${Math.min(100, progress)}%。`
        if (progress >= 100) {
          const reward = book.reward
          if (reward.mood) d.mood = clamp(d.mood + reward.mood, 0, 100)
          if (reward.spirit) {
            d.spirit = clamp(d.spirit + reward.spirit, 0, maxSpirit(d.skills.will.tier))
          }
          if (reward.exp) {
            for (const [key, value] of Object.entries(reward.exp)) {
              addExp(d, key as SkillKey, value ?? 0)
            }
          }
          if (reward.spell && !d.spells.includes(reward.spell)) {
            d.spells.push(reward.spell)
            pushLog(d, `你学会了${SPELLS[reward.spell]?.name ?? '新法术'}。`)
          }
          if (reward.flag) d.flags[reward.flag] = true
          const parts: string[] = []
          if (reward.mood) parts.push(`心情 +${reward.mood}`)
          if (reward.spirit) parts.push(`精神 +${reward.spirit}`)
          if (reward.exp) parts.push(reward.text ?? '经验提升')
          if (reward.spell) parts.push(reward.text ?? '学会了新法术')
          if (reward.flag) parts.push(reward.text ?? '记下了一些东西')
          const rewardText = parts.length ? `${parts.join('，')}。` : ''
          if (book.repeatable) {
            progress = 0
            text = `你读完了《${book.name}》。${rewardText}`
          } else {
            progress = 100
            completed = true
            text = `你读完了《${book.name}》。${rewardText}`
          }
        }
        d.books[id] = { progress, completed }
        pushLog(d, text)
        return text
      })
      set({ modal: null })
    },

    searchLibrary: () => {
      const { data } = get()
      if (data.location !== 'library') {
        set({ message: '这里不是藏书阁。' })
        return
      }
      const staminaCost = 2
      if (data.stamina < staminaCost) {
        set({ message: '你太累了，先在旁边坐一会儿吧。' })
        return
      }
      const missing = SEARCHABLE_BOOKS.filter(
        (id) => (data.inventory[id] ?? 0) <= 0 && !data.bookshelf.includes(id),
      )
      const found = missing.length > 0 && Math.random() < 0.2 ? missing[Math.floor(Math.random() * missing.length)] : null
      mutate((d) => {
        advanceTime(d, 30)
        d.stamina = clamp(d.stamina - staminaCost, 0, maxStamina(d.skills.physique.tier))
        if (found) {
          const book = BOOKS[found]
          d.inventory[found] = (d.inventory[found] ?? 0) + 1
          const text = book.foundText ?? `你找到了《${book.name}》。`
          pushLog(d, text)
          return text
        }
        const text = '你在书架间翻了很久，指尖沾了灰，还是没有找到想要的那本。'
        pushLog(d, text)
        return text
      })
    },

    acceptWestCommission: (id) => {
      const { data } = get()
      const period = supportPeriodAt(data.day)
      if (!period) {
        set({ message: '现在没有支援委托。' })
        return
      }
      const def = WEST_COMMISSIONS[id]
      if (!def) return
      const next = structuredClone(data)
      resetWestPeriod(next)
      if (next.west.setIndex >= period.maxSets) {
        set({ message: '本月委托已经全部完成。' })
        return
      }
      if (next.west.accepted.includes(id) || next.west.done.includes(id)) {
        set({ message: '这个委托已经接过了。' })
        return
      }
      const repairKeys = ['wall', 'ditch', 'lamp']
      if (def.kind === 'repair') {
        if (next.west.stage !== 0) {
          set({ message: '现在没有需要修复的主项目。' })
          return
        }
        if (!def.project || (next.west.projects[def.project] ?? 0) >= WEST_PROJECT_MAX) {
          set({ message: '这个项目已经修好了。' })
          return
        }
        if (
          next.west.accepted.some((x) => repairKeys.includes(x)) ||
          next.west.done.some((x) => repairKeys.includes(x))
        ) {
          set({ message: '这一组已经接了一个修复委托。' })
          return
        }
      }
      if (def.kind === 'maintenance' && next.west.stage < 1) {
        set({ message: '现在还没有日常维护。' })
        return
      }
      if (def.kind === 'patrol' && next.west.done.includes('patrol')) {
        set({ message: '这一组的巡田已经完成了。' })
        return
      }
      if (def.kind === 'care' && next.west.done.includes('care')) {
        set({ message: '这一组的驻地换药已经完成了。' })
        return
      }
      next.west.accepted.push(id)
      set({ data: next, message: `已接取：${def.name}` })
    },

    doWestCommission: (id) => {
      const { data } = get()
      const def = WEST_COMMISSIONS[id]
      if (!def) return
      if (!supportPeriodAt(data.day)) {
        set({ message: '现在不是建设周。' })
        return
      }
      if (!data.west.accepted.includes(id) || data.west.done.includes(id)) {
        set({ message: '你还没有接取这个委托。' })
        return
      }
      if (data.location !== def.location) {
        set({ message: `你需要去${getLocation(def.location).name}。` })
        return
      }
      if (data.stamina < def.stamina) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      const beforeProject = def.project ? data.west.projects[def.project] ?? 0 : 0
      mutate((d) => {
        advanceTime(d, def.minutes)
        d.stamina = clamp(d.stamina - def.stamina, 0, maxStamina(d.skills.physique.tier))
        d.money += def.money
        d.west.points += def.points
        if (def.construction > 0 && d.west.stage === 0) {
          d.west.construction = Math.min(
            WEST_CONSTRUCTION_MAX,
            d.west.construction + def.construction,
          )
        }
        let text = ''
        if (def.kind === 'repair' && def.project) {
          d.west.projects[def.project] = Math.min(
            WEST_PROJECT_MAX,
            (d.west.projects[def.project] ?? 0) + 1,
          )
          const lines = WEST_REPAIR_TEXTS[def.project]
          text = lines[Math.min(beforeProject, lines.length - 1)]
        } else {
          text = WEST_COMMISSION_TEXTS[def.id] ?? def.desc
        }
        d.west.done.push(id)
        refreshWestSet(d)
        checkWestStage(d)
        pushLog(d, text)
        return `${text} 你得到了 ${def.money} 铜，支援点 +${def.points}。`
      })
      if (def.battleChance && def.battleEnemy && Math.random() < def.battleChance) {
        get().startWildBattle(def.battleEnemy, def.battleBonus ?? 0)
      }
    },

    doWestGeneric: (id) => {
      const { data } = get()
      const def = WEST_GENERICS.find((g) => g.id === id)
      if (!def) return
      if (!supportPeriodAt(data.day)) {
        set({ message: '现在不是建设周。' })
        return
      }
      if (data.location !== def.location) {
        set({ message: '你不在这里。' })
        return
      }
      if (data.stamina < WEST_GENERIC_STAMINA) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        advanceTime(d, WEST_GENERIC_MINUTES)
        d.stamina = clamp(
          d.stamina - WEST_GENERIC_STAMINA,
          0,
          maxStamina(d.skills.physique.tier),
        )
        d.west.points += WEST_GENERIC_POINTS
        const before = d.west.construction
        if (d.west.stage === 0) {
          d.west.construction = Math.min(
            WEST_CONSTRUCTION_MAX,
            d.west.construction + WEST_GENERIC_CONSTRUCTION,
          )
        }
        const gain = d.west.construction - before
        checkWestStage(d)
        pushLog(d, def.text)
        const reward = gain > 0
          ? ` 建设值 +${gain}，支援点 +${WEST_GENERIC_POINTS}。`
          : ` 支援点 +${WEST_GENERIC_POINTS}。`
        return `${def.text}${reward}`
      })
    },

    listenWestRumors: () => {
      const { data } = get()
      if (data.location !== 'westMarket') {
        set({ message: '这里没有镇民可问。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 15)
        const line = westRumor(d.west.stage)
        pushLog(d, line)
        return line
      })
    },

    westLookout: () => {
      const { data } = get()
      if (data.location !== 'westTower') {
        set({ message: '你不在这里。' })
        return
      }
      if (data.west.stage < 1) {
        set({ message: '哨塔还没修好。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 5)
        const text =
          '你走上哨塔。田野一直铺到灰蒙蒙的远处，木牌上的“未净化”在风里发白。'
        pushLog(d, text)
        return text
      })
    },

    westPatrol: () => {
      const { data } = get()
      if (data.location !== 'westTower') {
        set({ message: '你不在这里。' })
        return
      }
      if (data.west.stage < 1) {
        set({ message: '哨塔还没修好。' })
        return
      }
      if (data.stamina < 10) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 120)
        d.stamina = clamp(d.stamina - 10, 0, maxStamina(d.skills.physique.tier))
        d.money += 8
        d.west.points += 1
        const text = '你在哨塔附近巡逻了一圈。'
        pushLog(d, text)
        return `${text} 你得到了 8 铜，支援点 +1。`
      })
      if (Math.random() < 0.35) {
        get().startWildBattle('corrupted_dog', 3)
      }
    },

    acceptGuildJob: (id) => {
      const { data } = get()
      const jobs = guildJobsForDay(data.day)
      if (!jobs.includes(id as (typeof jobs)[number])) {
        set({ message: '本周没有这个委托。' })
        return
      }
      const next = structuredClone(data)
      syncGuildWeek(next)
      if (next.guild.accepted.includes(id) || next.guild.done.includes(id)) {
        set({ message: '这个委托已经接过了。' })
        return
      }
      next.guild.accepted.push(id)
      set({ data: next, message: '已接取商会委托。' })
    },

    doGuildJob: (id) => {
      const { data } = get()
      const def = GUILD_JOB_DEFS[id as keyof typeof GUILD_JOB_DEFS]
      if (!def) return
      if (!data.guild.accepted.includes(id) || data.guild.done.includes(id)) {
        set({ message: '你还没有接取这个委托。' })
        return
      }
      if (data.location !== def.location) {
        set({ message: `你需要去${getLocation(def.location).name}。` })
        return
      }
      if (data.stamina < def.stamina) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        advanceTime(d, def.minutes)
        d.stamina = clamp(d.stamina - def.stamina, 0, maxStamina(d.skills.physique.tier))
        d.money += def.money
        d.guild.done.push(id)
        const text =
          id === 'haul'
            ? '你把箱子搬进后院，按货单分开。'
            : id === 'errand'
              ? '你把信送到地方，又赶回商会。'
              : '你对着货单清点了一遍，把短少的数目记下来。'
        pushLog(d, text)
        return `${text} 你得到了 ${def.money} 铜。`
      })
    },

    startEscort: () => {
      const { data } = get()
      if (data.location !== 'gate') {
        set({ message: '你需要到城门才能出发。' })
        return
      }
      if (data.guild.escort) {
        set({ message: '你已经在护送途中了。' })
        return
      }
      if (!data.guild.accepted.includes('escort') || data.guild.done.includes('escort')) {
        set({ message: '你还没有接取护送委托。' })
        return
      }
      const def = guildEscortForDay(data.day)
      mutate((d) => {
        d.guild.escort = {
          destination: def.destination,
          segment: 0,
          totalSegments: def.segments,
          goodsDamaged: false,
        }
        pushLog(d, `你押着货车出发，前往${def.name}。`)
        return '货车已经装好。你们准备出发。'
      })
    },

    escortContinue: () => {
      const { data } = get()
      const escort = data.guild.escort
      if (!escort) return
      if (escort.segment >= escort.totalSegments) {
        set({ message: '已经到达了。' })
        return
      }
      const encounter = Math.random() < GUILD_ENCOUNTER_CHANCE
      mutate((d) => {
        advanceTime(d, GUILD_SEGMENT_MINUTES)
        const e = d.guild.escort
        if (!e) return ''
        e.segment += 1
        const text = GUILD_ROAD_TEXTS[Math.floor(Math.random() * GUILD_ROAD_TEXTS.length)]
        pushLog(d, text)
        if (e.segment >= e.totalSegments) {
          return `${text} 已经能看到${getLocation(e.destination).name}了。`
        }
        return text
      })
      if (encounter) {
        const def = GUILD_ESCORTS.find((x) => x.destination === escort.destination)
        if (def) get().startWildBattle(def.enemy, 4)
      }
    },

    escortArrive: () => {
      const { data } = get()
      const escort = data.guild.escort
      if (!escort || escort.segment < escort.totalSegments) return
      const def = GUILD_ESCORTS.find((x) => x.destination === escort.destination)
      if (!def) return
      const reward = escort.goodsDamaged ? Math.floor(def.money / 2) : def.money
      mutate((d) => {
        const e = d.guild.escort
        if (!e) return ''
        d.money += reward
        d.location = e.destination
        if (!d.guild.done.includes('escort')) d.guild.done.push('escort')
        const damage = e.goodsDamaged ? '货物有些损伤，' : ''
        const text = `你把货车送到了${getLocation(e.destination).name}。${damage}你拿到了 ${reward} 铜。`
        d.guild.escort = null
        pushLog(d, text)
        return text
      })
    },

    escortAbort: () => {
      const { data } = get()
      if (!data.guild.escort) return
      mutate((d) => {
        d.guild.escort = null
        if (!d.guild.done.includes('escort')) d.guild.done.push('escort')
        d.location = 'gate'
        const text = '你掉转车头，把货车带回了城门。商会没有给报酬。'
        pushLog(d, text)
        return text
      })
    },

    returnFromEscort: () => {
      const { data } = get()
      if (!['oldStation', 'forestDepot', 'eastFarm'].includes(data.location)) return
      mutate((d) => {
        advanceTime(d, GUILD_RETURN_MINUTES)
        d.location = 'gate'
        const text = '你搭上回程的货车，回到了城门。'
        pushLog(d, text)
        return text
      })
    },

    startWildBattle: (enemyId, bonusCopper) => {
      const { data, battle } = get()
      if (battle) return
      const enemy = ENEMIES[enemyId]
      if (!enemy) return
      set({
        battle: {
          kind: 'wild',
          enemyId,
          enemyHp: enemy.hp,
          playerHp: Math.max(1, data.hp),
          playerGauge: 0,
          enemyGauge: 0,
          elapsedTicks: 0,
          casting: null,
          actions: 0,
          log: [enemy.intro, '行动条开始充能。'],
          phase: 'filling',
          submenu: null,
          result: '',
          usedSkills: [],
        },
        battleBonusCopper: bonusCopper,
        modal: null,
        message: '',
      })
    },

    teleport: (to) => {
      const { data } = get()
      if (currentYear(data.day) < TELEPORT_YEAR) {
        set({ message: '传送阵还没有对你开放。' })
        return
      }
      if (to === 'west') {
        if (data.location !== 'teleportRoom') {
          set({ message: '你需要到学院的传送室。' })
          return
        }
        let forcedEvent: string | null = null
        mutate((d) => {
          d.location = 'westGate'
          if (!d.flags.west_arrived) {
            d.flags.west_arrived = true
            forcedEvent = 'west_arrival'
          }
          pushLog(d, '你站上传送阵，眼前一白，来到了边区小镇。')
          return '你站上传送阵，眼前一白，来到了边区小镇镇口。'
        })
        if (forcedEvent) {
          set({ pendingEvent: forcedEvent, eventResult: null, message: '' })
          return
        }
      } else {
        if (data.location !== 'westGate') {
          set({ message: '你需要到镇口的传送阵。' })
          return
        }
        mutate((d) => {
          d.location = 'teleportRoom'
          pushLog(d, '你通过传送阵回到了长明学院。')
          return '你通过传送阵回到了长明学院的传送室。'
        })
      }
      maybeEvent({ type: 'enter' })
    },

    eat: () => {
      const { data } = get()
      if (data.location !== 'canteen' && data.location !== 'orphanCanteen') {
        set({ message: '这里没有吃的。' })
        return
      }
      const meal = currentMeal(data.minutes)
      if (!meal) {
        set({ message: '现在不是用餐时间。' })
        return
      }
      const key = mealKeyFor(meal)
      if (key && data.meals.day === data.day && data.meals[key]) {
        set({ message: `你已经吃过${meal}了。` })
        return
      }
      const fee = data.location === 'canteen' && isVacation(data.day) ? ACADEMY_MEAL_FEE : 0
      if (fee > 0 && data.money < fee) {
        set({ message: data.money < 0 ? '你还欠着钱。' : '钱不够。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 30)
        if (key) d.meals[key] = true
        if (fee > 0) d.money -= fee
        d.stamina = clamp(d.stamina + 12, 0, maxStamina(d.skills.physique.tier))
        pushLog(d, `你吃了${meal}，体力恢复了一些。`)
        return fee > 0 ? `你吃了${meal}，付了 ${fee} 枚铜币。体力恢复。` : `你吃了${meal}。体力恢复。`
      })
      maybeEvent({ type: 'after', action: 'eat' })
    },

    rest: () => {
      const { data } = get()
      if (data.stamina >= REST_THRESHOLD) {
        set({ message: '你现在还不算太累。' })
        return
      }
      mutate((d) => {
        advanceTime(d, REST_MINUTES)
        d.stamina = clamp(d.stamina + REST_STAMINA, 0, maxStamina(d.skills.physique.tier))
        return '你靠着墙歇了一会儿，体力恢复了一点。'
      })
    },

    sleep: (hours) => {
      const { data } = get()
      const minutes = Math.round(hours * 60)
      if (!SLEEP_LOCATIONS.includes(data.location)) {
        set({ message: '这里不能睡觉。', modal: null })
        return
      }
      if (minutes < SLEEP_MIN_MINUTES || minutes > SLEEP_MAX_MINUTES) {
        set({ message: '睡眠时长不在允许范围内。', modal: null })
        return
      }
      if (data.day === 0 && minutes !== 480) {
        set({ message: '第一天只能睡 8 小时。', modal: null })
        return
      }
      mutate((d) => {
        advanceTime(d, minutes)
        const short = minutes < SLEEP_MIN_RECOVERY_MINUTES
        const h = minutes / 60
        const bonus = !short && minutes >= 420 ? 10 : 0
        const staminaGain = short ? 0 : h * 6 + bonus
        const spiritGain = short ? 0 : h * 8
        const hpGain = short ? 0 : h * 5
        const manaGain = short ? 0 : h * 2
        if (!short) {
          d.stamina = clamp(d.stamina + staminaGain, 0, maxStamina(d.skills.physique.tier))
          d.spirit = clamp(d.spirit + spiritGain, 0, maxSpirit(d.skills.will.tier))
          d.hp = clamp(d.hp + hpGain, 0, maxHp(d.skills.physique.tier))
          d.mana = clamp(d.mana + manaGain, 0, 100)
          if (minutes >= 420) d.mood = clamp(d.mood + 1, 0, 100)
        }
        pushLog(d, `你睡了 ${formatDuration(minutes)}。`)
        if (short) {
          return `你睡了 ${formatDuration(minutes)}。你睡得太短，醒来时没有恢复多少。`
        }
        return `你睡了 ${formatDuration(minutes)}。体力恢复 ${Math.round(staminaGain)}，精神恢复 ${Math.round(spiritGain)}，生命恢复 ${Math.round(hpGain)}，魔力恢复 ${Math.round(manaGain)}。`
      })
      set({ modal: null })
      saveGame('auto', get().player, get().data)
    },

    sleepUntil: (targetMinutes) => {
      const { data } = get()
      if (!SLEEP_LOCATIONS.includes(data.location)) {
        set({ message: '这里不能睡觉。', modal: null })
        return
      }
      let minutes = targetMinutes - data.minutes
      if (minutes <= 0) minutes += 1440
      if (minutes < SLEEP_MIN_MINUTES) {
        set({ message: '至少睡 1 小时。', modal: null })
        return
      }
      if (minutes > SLEEP_MAX_MINUTES) {
        set({ message: '最多只能睡 12 小时。', modal: null })
        return
      }
      get().sleep(minutes / 60)
    },

    attendClass: () => {
      const { data } = get()
      const segment = classSegmentAt(data.location, data.minutes, data.day)
      if (!segment) {
        set({ message: '现在不是上课时间，或者你不在上课的地方。' })
        return
      }
      const remaining = segment.segmentEnd - data.minutes
      const classEnded = segment.segmentEnd >= segment.end
      if (remaining < 15) {
        mutate((d) => {
          advanceTime(d, remaining)
          return '只剩几分钟，你没有听进去。'
        })
        if (classEnded) {
          maybeEvent({ type: 'after', action: 'class', subject: segment.subject })
        }
        return
      }
      const physical = courseById(segment.courseId)?.kind === 'physical'
      const cost = physical ? 3 : spiritCost(2, data.mood)
      if (physical && data.stamina < cost) {
        set({ message: '你太累了，先休息一下再上课。' })
        return
      }
      if (!physical && data.spirit <= cost) {
        mutate((d) => {
          applyFaint(d, getLocation(d.location).name)
          return '你没能撑住。'
        })
        return
      }
      const masteryGain = remaining >= 30 ? 0.5 : 0.25
      const skillGain = physical
        ? remaining >= 30
          ? 0.5
          : 0.25
        : remaining >= 30
          ? 1
          : 0.5
      const physiqueGain = physical ? (remaining >= 30 ? 1 : 0.5) : 0
      const gains = [`${SKILL_LABEL[segment.skill]}经验 +${formatGain(skillGain)}`]
      if (physical) gains.push(`体质经验 +${formatGain(physiqueGain)}`)
      const gainText = gains.join('，')
      const scene = classScene(segment, data.location)
      mutate((d) => {
        advanceTime(d, remaining)
        if (physical) {
          d.stamina = clamp(d.stamina - cost, 0, maxStamina(d.skills.physique.tier))
        } else {
          d.spirit = clamp(d.spirit - cost, 0, maxSpirit(d.skills.will.tier))
        }
        addExp(d, segment.skill, skillGain)
        if (physical) addExp(d, 'physique', physiqueGain)
        d.courseMastery[segment.courseId] = (d.courseMastery[segment.courseId] ?? 0) + masteryGain
        const summary = `你${physical ? '练' : '听'}了 ${remaining} 分钟${segment.label}。${gainText}。`
        const text = scene ? `${scene}\n${summary}` : summary
        pushLog(d, text)
        return text
      })
      if (classEnded) {
        maybeEvent({ type: 'after', action: 'class', subject: segment.subject })
      }
    },

    slackClass: () => {
      const { data } = get()
      const segment = classSegmentAt(data.location, data.minutes, data.day)
      if (!segment) {
        set({ message: '现在不是上课时间。' })
        return
      }
      const remaining = segment.segmentEnd - data.minutes
      const classEnded = segment.segmentEnd >= segment.end
      mutate((d) => {
        advanceTime(d, remaining)
        if (remaining >= 15) d.mood = clamp(d.mood + 1, 0, 100)
        return remaining >= 15 ? '你趴在桌上摸了一会儿鱼。' : '你坐着等下课。'
      })
      if (classEnded) {
        maybeEvent({ type: 'after', action: 'class', subject: segment.subject })
      }
    },

    study: (key) => {
      const { data } = get()
      if (data.location !== 'library') {
        set({ message: '这里不能自习。', modal: null })
        return
      }
      const allowed: SkillKey[] = ['knowledge', 'nature']
      if (!allowed.includes(key)) {
        set({ message: '现在只能自习学识或自然系。', modal: null })
        return
      }
      const duration = 30
      const courseId = masteryCourseForSkill(key, data.day)
      const cost = spiritCost(3, data.mood)
      if (data.spirit <= cost) {
        mutate((d) => {
          applyFaint(d, getLocation(d.location).name)
          return '你没能撑住。'
        })
        set({ modal: null })
        return
      }
      mutate((d) => {
        advanceTime(d, duration)
        d.spirit = clamp(d.spirit - cost, 0, maxSpirit(d.skills.will.tier))
        addExp(d, key, 2)
        if (courseId) d.courseMastery[courseId] = (d.courseMastery[courseId] ?? 0) + 0.25
        pushLog(d, '你在藏书阁自习了一会儿。')
        return '你自习了半小时。经验 +2。'
      })
      set({ modal: null })
      maybeEvent({ type: 'after', action: 'study' })
    },

    previewClass: () => {
      const { data } = get()
      if (data.location !== 'lecture') {
        set({ message: '这里不能预习。' })
        return
      }
      const plan = lecturePreviewPlan(data.day, data.minutes)
      if (!plan.ok) {
        set({ message: plan.reason })
        return
      }
      const cost = spiritCost(3, data.mood)
      if (data.spirit <= cost) {
        mutate((d) => {
          applyFaint(d, getLocation(d.location).name)
          return '你没能撑住。'
        })
        return
      }
      mutate((d) => {
        advanceTime(d, plan.minutes)
        d.spirit = clamp(d.spirit - cost, 0, maxSpirit(d.skills.will.tier))
        addExp(d, plan.skill, 2)
        d.courseMastery[plan.courseId] = (d.courseMastery[plan.courseId] ?? 0) + 0.25
        pushLog(d, `你预习了 ${plan.minutes} 分钟${plan.subject}。`)
        return `你预习了 ${plan.minutes} 分钟${plan.subject}。经验 +2。`
      })
    },

    practice: (key) => {
      const { data } = get()
      if (data.location !== 'yard' && data.location !== 'backyard') {
        set({ message: '这里不能练习。', modal: null })
        return
      }
      if (key !== 'brawl' && key !== 'sword') {
        set({ modal: null })
        return
      }
      const formal = data.location === 'yard'
      const courseId = formal ? masteryCourseForSkill(key, data.day) : null
      mutate((d) => {
        advanceTime(d, 30)
        addExp(d, key, 2)
        if (courseId) {
          d.courseMastery[courseId] = (d.courseMastery[courseId] ?? 0) + 0.25
        }
        d.stamina = clamp(d.stamina - 4, 0, maxStamina(d.skills.physique.tier))
        const place = formal ? '演武场' : '后院'
        pushLog(d, `你在${place}练习了${key === 'brawl' ? '格斗' : '剑术'}。`)
        return formal ? '你练习了半小时。经验 +2。' : '你在后院练了一会儿。经验 +2。'
      })
      set({ modal: null })
      maybeEvent({ type: 'after', action: 'practice' })
    },

    visitGreenhouse: () => {
      const { data } = get()
      if (data.location !== 'greenhouse') {
        set({ message: '这里不是温室。' })
        return
      }
      if (!greenhouseOpenAt(data.minutes)) {
        set({ message: '温室已经锁门了。' })
        return
      }
      mutate((d) => {
        advanceTime(d, GREENHOUSE_VISIT_MINUTES)
        const first = d.greenhouse.day !== d.day || !d.greenhouse.visited
        if (first) {
          d.mood = clamp(d.mood + GREENHOUSE_VISIT_MOOD, 0, 100)
          d.greenhouse = { day: d.day, visited: true }
        }
        const text = GREENHOUSE_VISIT_TEXTS[(d.day + Math.floor(d.minutes / 60)) % GREENHOUSE_VISIT_TEXTS.length]
        closeTimedLocation(d)
        const result = first ? `${text} 心情 +${GREENHOUSE_VISIT_MOOD}。` : text
        pushLog(d, result)
        return result
      })
    },

    identifyHerbs: () => {
      const { data } = get()
      if (data.location !== 'greenhouse') {
        set({ message: '这里不是温室。' })
        return
      }
      if (!greenhouseOpenAt(data.minutes)) {
        set({ message: '温室已经锁门了。' })
        return
      }
      if (data.spirit <= GREENHOUSE_IDENTIFY_SPIRIT) {
        set({ message: '精神不足，没法集中注意力。' })
        return
      }
      mutate((d) => {
        advanceTime(d, GREENHOUSE_IDENTIFY_MINUTES)
        d.spirit = clamp(d.spirit - GREENHOUSE_IDENTIFY_SPIRIT, 0, maxSpirit(d.skills.will.tier))
        addExp(d, 'cultivation', GREENHOUSE_IDENTIFY_EXP)
        const text = GREENHOUSE_IDENTIFY_TEXTS[(d.day + Math.floor(d.minutes / 30)) % GREENHOUSE_IDENTIFY_TEXTS.length]
        closeTimedLocation(d)
        const result = `${text} 种植经验 +${GREENHOUSE_IDENTIFY_EXP}。`
        pushLog(d, result)
        return result
      })
    },

    lookAtRunes: () => {
      const { data } = get()
      if (data.location !== 'runeShop') {
        set({ message: '这里不是符文工坊。' })
        return
      }
      if (!isTimeWindow(data.minutes, RUNE_SHOP_OPEN_START, RUNE_SHOP_OPEN_END)) {
        set({ message: '工坊已经关门了。' })
        return
      }
      mutate((d) => {
        advanceTime(d, RUNE_LOOK_MINUTES)
        const first = d.runeShop.day !== d.day || !d.runeShop.looked
        if (first) {
          d.mood = clamp(d.mood + RUNE_LOOK_MOOD, 0, 100)
          d.runeShop = { day: d.day, looked: true }
        }
        const text = RUNE_LOOK_TEXTS[(d.day + Math.floor(d.minutes / 15)) % RUNE_LOOK_TEXTS.length]
        closeTimedLocation(d)
        const result = first ? `${text} 心情 +${RUNE_LOOK_MOOD}。` : text
        pushLog(d, result)
        return result
      })
    },

    engraveRune: (itemId, runeId) => {
      const { data } = get()
      if (data.location !== 'runeShop') {
        set({ message: '这里不是符文工坊。' })
        return
      }
      if (!isTimeWindow(data.minutes, RUNE_SHOP_OPEN_START, RUNE_SHOP_OPEN_END)) {
        set({ message: '工坊已经关门了。' })
        return
      }
      const item = ITEMS[itemId]
      if (!item || item.type !== 'equipment') {
        set({ message: '这件东西不能刻印。' })
        return
      }
      const rune = runeById(runeId)
      if (!rune || !runeApplicable(item, rune)) {
        set({ message: '这件装备刻不了这道符文。' })
        return
      }
      const owned =
        (data.inventory[itemId] ?? 0) > 0 ||
        Object.values(data.equipment).includes(itemId)
      if (!owned) {
        set({ message: '你身上没有这件装备。' })
        return
      }
      if ((item.engravingSlots ?? 1) <= 0) {
        set({ message: '这件装备没有刻印槽。' })
        return
      }
      if (data.money < rune.price) {
        set({ message: '钱不够。' })
        return
      }
      mutate((d) => {
        advanceTime(d, RUNE_ENGRAVE_MINUTES)
        d.money -= rune.price
        d.engravings[itemId] = [runeId]
        const text = `赛拉斯在${item.name}上刻下了${rune.name}。花费 ${rune.price} 铜。`
        closeTimedLocation(d)
        pushLog(d, text)
        return text
      })
      if (get().data.location !== 'runeShop') set({ modal: null })
    },

    observeStars: () => {
      const { data } = get()
      if (data.location !== 'observatory') {
        set({ message: '这里不是星象台。' })
        return
      }
      if (!observatoryOpenAt(data.minutes)) {
        set({ message: '星象台已经关门了。' })
        return
      }
      if (data.spirit <= OBSERVE_SPIRIT) {
        set({ message: '精神不足，没法集中注意力。' })
        return
      }
      const observationDay = data.day
      const night = nightKey(data.day, data.minutes)
      const constellation = currentConstellation(observationDay)
      const recorded = data.starChart.includes(constellation.id)
      const blocked = weatherBlocksStars(night)
      mutate((d) => {
        advanceTime(d, OBSERVE_MINUTES)
        d.spirit = clamp(d.spirit - OBSERVE_SPIRIT, 0, maxSpirit(d.skills.will.tier))
        const first = d.starWatch.night !== night || !d.starWatch.watched
        if (first) {
          d.mood = clamp(d.mood + OBSERVE_MOOD, 0, 100)
          d.starWatch = { night, watched: true }
        }
        const base = OBSERVE_TEXTS[(d.day + Math.floor(d.minutes / 30)) % OBSERVE_TEXTS.length]
        let text = base
        if (!recorded && !blocked) {
          d.starChart = [...d.starChart, constellation.id]
          addExp(d, 'knowledge', OBSERVE_KNOWLEDGE)
          text += `\n\n${constellation.name}：${constellation.lore}\n知识经验 +${OBSERVE_KNOWLEDGE}。`
          if (
            d.starChart.length === CONSTELLATIONS.length &&
            !d.flags.star_chart_complete
          ) {
            d.flags.star_chart_complete = true
            text += '\n伊芙把最后一笔写完，看了你一眼：“四季都齐了。”'
          }
        } else if (!recorded && blocked) {
          text += '\n\n云太厚，今晚看不到星星。'
        }
        if (first) text += ` 心情 +${OBSERVE_MOOD}。`
        closeTimedLocation(d)
        pushLog(d, text)
        return text
      })
    },

    askCalendar: () => {
      const { data } = get()
      if (data.location !== 'observatory') {
        set({ message: '这里不是星象台。' })
        return
      }
      if (!observatoryOpenAt(data.minutes)) {
        set({ message: '星象台已经关门了。' })
        return
      }
      mutate((d) => {
        advanceTime(d, CALENDAR_MINUTES)
        closeTimedLocation(d)
        return '伊芙翻了翻星图。'
      })
      set({ modal: 'calendar' })
    },

    openStarChart: () => {
      const { data } = get()
      if (data.location !== 'observatory') {
        set({ message: '这里不是星象台。' })
        return
      }
      if (!observatoryOpenAt(data.minutes)) {
        set({ message: '星象台已经关门了。' })
        return
      }
      mutate((d) => {
        advanceTime(d, STAR_CHART_MINUTES)
        closeTimedLocation(d)
        return '你翻了翻伊芙的星图。'
      })
      set({ modal: 'starChart' })
    },

    helpBackyard: () => {
      const { data } = get()
      if (data.location !== 'backyard') {
        set({ message: '这里没有你能帮的忙。' })
        return
      }
      if (data.backyard.day === data.day && data.backyard.count >= 1) {
        set({ message: '今天已经打理过后院了。' })
        return
      }
      const wk = Math.floor(data.day / 7)
      if (data.weekly.week === wk && data.weekly.backyard >= 5) {
        set({ message: '这周已经打理得够多了。诺拉让你去忙自己的事。' })
        return
      }
      mutate((d) => {
        const currentWeek = Math.floor(d.day / 7)
        if (d.weekly.week !== currentWeek) {
          d.weekly = { week: currentWeek, backyard: 0 }
        }
        if (d.backyard.day !== d.day) {
          d.backyard = { day: d.day, count: 0 }
        }
        advanceTime(d, 120)
        d.stamina = clamp(d.stamina - 10, 0, maxStamina(d.skills.physique.tier))
        d.money += 5
        d.weekly.backyard += 1
        d.backyard.count += 1
        pushLog(d, '你打理了后院。')
        return '你打理了后院。诺拉塞给你 5 枚铜币。'
      })
      maybeEvent({ type: 'after', action: 'backyard' })
    },

    helpOrphanKids: () => {
      const { data } = get()
      if (data.location !== 'orphanage') {
        set({ message: '这里没有孩子要带。' })
        return
      }
      if (!isVacation(data.day)) {
        set({ message: '孩子们现在都在学院。' })
        return
      }
      if (data.vacation.day === data.day && data.vacation.kids) {
        set({ message: '今天已经陪过孩子们了。' })
        return
      }
      mutate((d) => {
        if (d.vacation.day !== d.day) d.vacation = { day: d.day, kids: false }
        advanceTime(d, 60)
        d.stamina = clamp(d.stamina - 3, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + 2, 0, 100)
        d.vacation.kids = true
        d.affinity.nora = Math.min(100, (d.affinity.nora ?? 0) + 1)
        pushLog(d, '你陪孤儿院的孩子们玩了一会儿。')
        return '你陪孩子们玩了一会儿。他们吵着要你明天再来。'
      })
    },

    joinRite: () => {
      const { data } = get()
      if (data.location !== 'chapel') {
        set({ message: '这里没有圣祷。' })
        return
      }
      const phase = ritePhaseAt(data.day, data.minutes)
      if (!phase) {
        set({ message: '现在没有圣祷。' })
        return
      }
      if (ritePhaseDone(data.rite, data.day, phase.key)) {
        set({ message: '这一段已经参加过了。' })
        return
      }
      const minutes = Math.min(RITE_PHASE_MINUTES, phase.end - data.minutes)
      if (minutes < 10) {
        set({ message: '这一段落快结束了。' })
        return
      }
      const gain = phase.night ? 2 : 1
      const riteName =
        phase.night === 'summer' ? '夏夜圣祷' : phase.night === 'winter' ? '冬夜圣祷' : '圣祷'
      mutate((d) => {
        if (d.rite.day !== d.day) d.rite = { day: d.day, phases: [] }
        advanceTime(d, minutes)
        d.spirit = clamp(d.spirit + gain, 0, maxSpirit(d.skills.will.tier))
        d.mood = clamp(d.mood + gain, 0, 100)
        d.rite.phases.push(phase.key)
        const text = `你在${riteName}的“${phase.name}”里待了 ${minutes} 分钟。精神 +${gain}，心情 +${gain}。`
        pushLog(d, text)
        return text
      })
    },

    prepareRite: () => {
      const { data } = get()
      if (data.location !== 'chapel') {
        set({ message: '这里没有需要准备的圣祷。' })
        return
      }
      const prep = ritePrepAt(data.day, data.minutes)
      if (!prep) {
        set({ message: '现在没有需要准备的圣祷。' })
        return
      }
      const end = prep.night === 'summer' ? 19 * 60 : prep.night === 'winter' ? 18 * 60 : 9 * 60
      const minutes = end - data.minutes
      if (minutes < 15) {
        set({ message: '已经来不及准备了。' })
        return
      }
      const staminaCost = prep.night ? 7 : 4
      const moodGain = prep.night ? 2 : 1
      mutate((d) => {
        advanceTime(d, minutes)
        d.stamina = clamp(d.stamina - staminaCost, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + moodGain, 0, 100)
        const text =
          prep.night === 'summer'
            ? `你帮着把长椅搬到教堂外，又点起了灯。`
            : prep.night === 'winter'
              ? `你帮着扫开石阶上的雪，把灯一盏盏点上。`
              : `你帮着摆好长椅，擦净烛台。`
        pushLog(d, text)
        return text
      })
    },

    sweepGrave: () => {
      const { data } = get()
      if (data.location !== 'cemetery') {
        set({ message: '这里没有需要打扫的墓。' })
        return
      }
      mutate((d) => {
        advanceTime(d, CEMETERY_SWEEP_MINUTES)
        d.stamina = clamp(d.stamina - CEMETERY_SWEEP_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + CEMETERY_SWEEP_MOOD, 0, 100)
        pushLog(d, '你在墓园扫了一会儿墓。')
        return '你把墓碑前的落叶扫到一边。守墓人看了你一眼，没有说话。'
      })
    },

    walkForest: () => {
      const { data } = get()
      if (data.location !== 'forest') {
        set({ message: '这里没有林子可走。' })
        return
      }
      const encounter = Math.random() < FOREST_ENCOUNTER_CHANCE
      mutate((d) => {
        advanceTime(d, FOREST_WALK_MINUTES)
        d.stamina = clamp(d.stamina - FOREST_WALK_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + FOREST_WALK_MOOD, 0, 100)
        pushLog(d, '你在林子里走了一会儿。')
        return encounter ? '灌木里传来黏腻的声响。' : '林子里很安静，只有枝叶晃动的声音。'
      })
      if (encounter) {
        const enemy = ENEMIES.slime
        const state = get()
        set({
          battle: {
            kind: 'wild',
            enemyId: 'slime',
            enemyHp: enemy.hp,
            playerHp: Math.max(1, state.data.hp),
            playerGauge: 0,
            enemyGauge: 0,
            elapsedTicks: 0,
            casting: null,
            actions: 0,
            log: [enemy.intro, '行动条开始充能。'],
            phase: 'filling',
            submenu: null,
            result: '',
            usedSkills: [],
          },
          message: '',
        })
      }
    },

    exploreForestDeep: () => {
      const { data } = get()
      if (data.location !== 'forestDeep') {
        set({ message: '这里不是森林深处。' })
        return
      }
      if (data.stamina < 6) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      const encounter = Math.random() < FOREST_DEEP_ENCOUNTER_CHANCE
      mutate((d) => {
        advanceTime(d, 30)
        d.stamina = clamp(d.stamina - 6, 0, maxStamina(d.skills.physique.tier))
        const text = encounter
          ? '前面的灌木被什么东西撞开，枝叶还在晃。'
          : '你往林子深处走了一段。除了被踩倒的草和新泥印，什么也没发现。'
        pushLog(d, text)
        return text
      })
      if (encounter) {
        const enemyId = Math.random() < 0.6 ? 'boar' : 'gray_wolf'
        get().startWildBattle(enemyId, 0)
      }
    },

    gatherHerbs: () => {
      const { data } = get()
      if (data.location !== 'forestDeep') {
        set({ message: '这里不是森林深处。' })
        return
      }
      if (data.stamina < 3) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      const success = Math.random() < HERB_GATHER_SUCCESS_CHANCE
      const herbId = Math.random() < 0.5 ? 'bloodherb' : 'bitterleaf'
      mutate((d) => {
        advanceTime(d, 30)
        d.stamina = clamp(d.stamina - 3, 0, maxStamina(d.skills.physique.tier))
        addExp(d, 'cultivation', 1)
        if (success) {
          d.inventory[herbId] = (d.inventory[herbId] ?? 0) + 1
          const def = ITEMS[herbId]
          const text =
            herbId === 'bloodherb'
              ? '你在树根边找到了止血草。'
              : '你摘了几片苦叶。'
          pushLog(d, text)
          return `${text} 获得${def.name} ×1。种植经验 +1。`
        }
        const text = '你蹲在林子里找了一会儿，只翻到几片不能用的叶子。'
        pushLog(d, text)
        return text + ' 种植经验 +1。'
      })
    },

    careHerbs: () => {
      const { data } = get()
      if (data.location !== 'herbGarden') {
        set({ message: '这里没有药草可照料。' })
        return
      }
      if (classSegmentAt(data.location, data.minutes, data.day)) {
        set({ message: '正在上课，等下课再来。' })
        return
      }
      if (data.stamina < 2) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 30)
        d.stamina = clamp(d.stamina - 2, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + 1, 0, 100)
        addExp(d, 'cultivation', 1)
        const text = '你蹲在畦边松了松土，又把歪掉的木牌插正。'
        pushLog(d, text)
        return `${text}种植经验 +1，心情 +1。`
      })
    },

    brewPotion: (recipeId) => {
      const { data } = get()
      const atBrewery = data.location === 'brewery'
      const atDorm = data.location === 'dorm' && data.workshop.brewKitUntilDay > data.day
      if (!atBrewery && !atDorm) {
        set({ message: '这里不能炼药。' })
        return
      }
      if (atBrewery && classSegmentAt(data.location, data.minutes, data.day)) {
        set({ message: '正在上课，等下课再来。' })
        return
      }
      const recipe = recipeById(recipeId)
      if (!recipe) return
      if (!recipeUnlocked(recipe, data.skills.alchemy)) {
        set({ message: '你还没掌握这个配方。' })
        return
      }
      if (data.stamina < 2) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      if (data.spirit < 1) {
        set({ message: '精神不足，没法集中注意力。' })
        return
      }
      const missing = Object.entries(recipe.inputs).find(
        ([id, qty]) => (data.inventory[id] ?? 0) < qty,
      )
      if (missing) {
        set({ message: `材料不够：${ITEMS[missing[0]]?.name ?? missing[0]}。` })
        return
      }
      const success = Math.random() * 100 < brewSuccessChance(recipe, data.skills.alchemy)
      const fine =
        success && Math.random() * 100 < brewFineChance(recipe, data.skills.alchemy)
      mutate((d) => {
        advanceTime(d, 30)
        d.stamina = clamp(d.stamina - 2, 0, maxStamina(d.skills.physique.tier))
        d.spirit = clamp(d.spirit - 1, 0, maxSpirit(d.skills.will.tier))
        for (const [id, qty] of Object.entries(recipe.inputs)) {
          d.inventory[id] = (d.inventory[id] ?? 0) - qty
          if (d.inventory[id] <= 0) delete d.inventory[id]
        }
        if (!success) {
          addExp(d, 'alchemy', 1)
          const text = '火候没压住，锅里的药糊成了一团。材料全废了。炼药经验 +1。'
          pushLog(d, text)
          return text
        }
        const outputId = fine ? recipe.fine : recipe.standard
        const def = ITEMS[outputId]
        d.inventory[outputId] = (d.inventory[outputId] ?? 0) + 1
        addExp(d, 'alchemy', 3)
        const text = `你炼出了一份${def.name}。炼药经验 +3。`
        pushLog(d, text)
        return text
      })
    },

    chatWithNpc: (id) => {
      const { data } = get()
      const npc = npcById(id)
      if (!npc) return false
      if (npcLocationAt(npc, data.day, data.minutes) !== data.location) {
        set({ message: `${npc.name}不在这里。` })
        return false
      }
      let stillHere = true
      mutate((d) => {
        if (d.social.day !== d.day) d.social = { day: d.day, counts: {} }
        const count = d.social.counts[id] ?? 0
        const isFamiliarity = npc.relationship === 'familiarity'
        const current = isFamiliarity ? d.familiarity[id] ?? 0 : d.affinity[id] ?? 0
        const lines = npc.lines[socialTier(current)]
        const line = lines[count % lines.length]
        const beforeLocation = d.location
        advanceTime(d, SOCIAL_MINUTES)
        closeTimedLocation(d)
        const closed = d.location !== beforeLocation
        d.social.counts[id] = count + 1
        if (count < 1) {
          if (isFamiliarity) {
            d.familiarity[id] = Math.min(100, current + 1)
          } else {
            d.affinity[id] = Math.min(100, current + 1)
          }
          pushLog(d, `你和${npc.short}聊了一会儿。`)
        } else {
          pushLog(d, `你和${npc.short}又聊了一会儿。`)
        }
        stillHere = !closed && npcLocationAt(npc, d.day, d.minutes) === d.location
        if (!stillHere && !closed) pushLog(d, `${npc.short}先走了。`)
        return closed
          ? `“${line}” ${npc.short}把门锁上。`
          : stillHere
            ? `“${line}”`
            : `“${line}” ${npc.short}看了看钟，先走了。`
      })
      return stillHere
    },

    wait: (minutes) => {
      mutate((d) => {
        advanceTime(d, minutes)
        closeTimedLocation(d)
        return minutes >= 60 ? `你等了 ${minutes / 60} 小时。` : `你等了 ${minutes} 分钟。`
      })
      set({ modal: null })
    },

    workShop: () => {
      const { data } = get()
      if (data.location !== 'shop') {
        set({ message: '这里没有你能打的工。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 120)
        d.money += 10
        d.stamina = clamp(d.stamina - 10, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood - 5, 0, 100)
        pushLog(d, '你在杂货店打了两个小时的工。')
        return '你在杂货店打了两个小时的工，拿到 10 枚铜币。'
      })
      maybeEvent({ type: 'after', action: 'work' })
    },

    workPotionWorkshop: () => {
      const { data } = get()
      if (data.location !== 'potionWorkshop') {
        set({ message: '这里没有你能打的工。' })
        return
      }
      if (!isTimeWindow(data.minutes, WORKSHOP_OPEN_START, WORKSHOP_OPEN_END)) {
        set({ message: '工坊已经关门了。' })
        return
      }
      if (data.stamina < WORKSHOP_WORK_STAMINA) {
        set({ message: '体力不足，先休息一下。' })
        return
      }
      if (data.spirit < WORKSHOP_WORK_SPIRIT) {
        set({ message: '精神不足，先休息一下。' })
        return
      }
      const tier = data.skills.alchemy.tier
      const pay = workshopPayForTier(tier)
      const text = WORKSHOP_WORK_TEXTS[Math.max(0, Math.min(4, tier))]
      mutate((d) => {
        advanceTime(d, WORKSHOP_WORK_MINUTES)
        d.stamina = clamp(d.stamina - WORKSHOP_WORK_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.spirit = clamp(d.spirit - WORKSHOP_WORK_SPIRIT, 0, maxSpirit(d.skills.will.tier))
        d.mood = clamp(d.mood - WORKSHOP_WORK_MOOD, 0, 100)
        d.money += pay
        addExp(d, 'alchemy', WORKSHOP_WORK_EXP)
        pushLog(d, `${text} 你拿到 ${pay} 枚铜币。`)
        return `${text} 炼药经验 +${WORKSHOP_WORK_EXP}，报酬 ${pay} 铜。`
      })
      maybeEvent({ type: 'after', action: 'work' })
    },

    rentBrewKit: () => {
      const { data } = get()
      if (data.location !== 'potionWorkshop') {
        set({ message: '这里不租借炼药工具。' })
        return
      }
      if (!isTimeWindow(data.minutes, WORKSHOP_OPEN_START, WORKSHOP_OPEN_END)) {
        set({ message: '工坊已经关门了。' })
        return
      }
      if (data.money < WORKSHOP_RENT_COST) {
        set({ message: '钱不够。' })
        return
      }
      mutate((d) => {
        d.money -= WORKSHOP_RENT_COST
        const base = Math.max(d.day, d.workshop.brewKitUntilDay)
        d.workshop.brewKitUntilDay = base + WORKSHOP_RENT_DAYS
        const text = `你租下了一套便携炼药工具，可以用到第 ${d.workshop.brewKitUntilDay} 天。`
        pushLog(d, text)
        return text
      })
    },

    learnAlchemyAtWorkshop: () => {
      const { data } = get()
      if (data.location !== 'potionWorkshop') {
        set({ message: '这里不能请教炼药。' })
        return
      }
      if (!isTimeWindow(data.minutes, WORKSHOP_OPEN_START, WORKSHOP_OPEN_END)) {
        set({ message: '工坊已经关门了。' })
        return
      }
      if (data.workshop.lessonDay === data.day) {
        set({ message: '今天已经请教过了。' })
        return
      }
      if (data.money < WORKSHOP_LESSON_COST) {
        set({ message: '钱不够。' })
        return
      }
      if (data.spirit < WORKSHOP_LESSON_SPIRIT) {
        set({ message: '精神不足，没法集中注意力。' })
        return
      }
      mutate((d) => {
        d.money -= WORKSHOP_LESSON_COST
        advanceTime(d, WORKSHOP_LESSON_MINUTES)
        d.spirit = clamp(d.spirit - WORKSHOP_LESSON_SPIRIT, 0, maxSpirit(d.skills.will.tier))
        addExp(d, 'alchemy', WORKSHOP_LESSON_EXP)
        d.workshop.lessonDay = d.day
        const text = '托比亚斯带你过了一遍基础的火候和顺序。'
        pushLog(d, `${text} 炼药经验 +${WORKSHOP_LESSON_EXP}。`)
        return `${text} 炼药经验 +${WORKSHOP_LESSON_EXP}。`
      })
    },

    workTavern: () => {
      const { data } = get()
      if (data.location !== 'tavern') {
        set({ message: '这里没有你能打的工。' })
        return
      }
      if (!isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_OPEN_END)) {
        set({ message: '酒馆已经打烊了。' })
        return
      }
      if (!isTimeWindow(data.minutes, TAVERN_WORK_START, TAVERN_WORK_END)) {
        set({ message: '今晚的活已经干完了。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 120)
        d.money += 12
        d.stamina = clamp(d.stamina - 10, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood - 3, 0, 100)
        pushLog(d, '你在酒馆帮了两个小时的忙。')
        return '你在酒馆帮了两个小时的忙，拿到 12 枚铜币。'
      })
    },

    orderDrink: (id) => {
      const { data } = get()
      if (data.location !== 'tavern') {
        set({ message: '这里不是酒馆。', modal: null })
        return
      }
      if (!isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_OPEN_END)) {
        set({ message: '酒馆已经打烊了。', modal: null })
        return
      }
      if (!isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_DRINK_END)) {
        set({ message: '快打烊了，不能再点单。', modal: null })
        return
      }
      const drink = DRINKS.find((d) => d.id === id)
      if (!drink) return
      if (data.money < drink.price) {
        set({ message: data.money < 0 ? '你还欠着钱。' : '钱不够。' })
        return
      }
      mutate((d) => {
        advanceTime(d, drink.minutes)
        d.money -= drink.price
        if (drink.effect.mood) d.mood = clamp(d.mood + drink.effect.mood, 0, 100)
        if (drink.effect.spirit) {
          d.spirit = clamp(d.spirit + drink.effect.spirit, 0, maxSpirit(d.skills.will.tier))
        }
        if (drink.effect.stamina) {
          d.stamina = clamp(d.stamina + drink.effect.stamina, 0, maxStamina(d.skills.physique.tier))
        }
        pushLog(d, `你在酒馆要了一杯${drink.name}。`)
        return `你要了一杯${drink.name}。`
      })
      set({ modal: null })
    },

    listenTavern: () => {
      const { data } = get()
      if (data.location !== 'tavern') {
        set({ message: '这里不是酒馆。' })
        return
      }
      if (!isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_OPEN_END)) {
        set({ message: '酒馆已经打烊了。' })
        return
      }
      if (!isTimeWindow(data.minutes, TAVERN_TALK_START, TAVERN_TALK_END)) {
        set({ message: '这个时间酒馆里没什么人。' })
        return
      }
      mutate((d) => {
        advanceTime(d, 15)
        d.mood = clamp(d.mood + 1, 0, 100)
        const scene = TAVERN_LISTEN_SCENES[Math.floor(Math.random() * TAVERN_LISTEN_SCENES.length)]
        const canLearn = d.skills.knowledge.tier < 1
        const learned = scene.knowledge && canLearn
        if (learned) addExp(d, 'knowledge', 1)
        pushLog(d, '你在酒馆里听了一会儿。')
        const note =
          scene.knowledge && !canLearn
            ? '\n\n你已经懂得够多了，闲谈里很难再学到新东西。'
            : ''
        return `${scene.text}${note}\n\n15 分钟 · 心情 +1${learned ? ' · 学识经验 +1' : ''}`
      })
    },

    buyItem: (id) => {
      const { data } = get()
      const stockMap = shopStockAt(data.location)
      const def = ITEMS[id]
      const stock = stockMap[id]
      if (!def || !stock) {
        set({ message: '这里不卖这个。' })
        return
      }
      if (
        def.type === 'book' &&
        ((data.inventory[id] ?? 0) > 0 || data.bookshelf.includes(id))
      ) {
        set({ message: '你已经有一本了。' })
        return
      }
      const soldKey = `${data.location}:${id}`
      const sold = data.shop.day === data.day ? data.shop.sold[soldKey] ?? 0 : 0
      if (sold >= stock) {
        set({ message: '今天的货已经卖完了。' })
        return
      }
      const price = shopPriceAt(data.location, id, data.west.stage)
      if (data.money < price) {
        set({ message: data.money < 0 ? '你还欠着钱。' : '钱不够。' })
        return
      }
      mutate((d) => {
        if (d.shop.day !== d.day) d.shop = { day: d.day, sold: {} }
        d.money -= price
        d.inventory[id] = (d.inventory[id] ?? 0) + 1
        d.shop.sold[soldKey] = (d.shop.sold[soldKey] ?? 0) + 1
        pushLog(d, `你买了${def.name}。`)
        return `你买了${def.name}。`
      })
    },

    sellItem: (id, all) => {
      const { data } = get()
      if (data.location !== 'shop' && data.location !== 'westMarket' && data.location !== 'potionWorkshop') {
        set({ message: '这里不收东西。' })
        return
      }
      const def = ITEMS[id]
      const have = data.inventory[id] ?? 0
      if (!def || !canSellAt(data.location, id) || have <= 0) return
      const count = all ? have : 1
      const price = sellPriceAt(data.location, id)
      mutate((d) => {
        d.inventory[id] = Math.max(0, (d.inventory[id] ?? 0) - count)
        d.money += price * count
        if ((d.inventory[id] ?? 0) <= 0 && !Object.values(d.equipment).includes(id)) {
          delete d.engravings[id]
        }
        const text = `你卖出${def.name} ×${count}，得到 ${price * count} 枚铜币。`
        pushLog(d, text)
        return text
      })
    },

    useItem: (id) => {
      const { data, battle } = get()
      if (battle) {
        set({ message: '战斗中请使用战斗物品。' })
        return
      }
      const def = ITEMS[id]
      if (!def || (data.inventory[id] ?? 0) <= 0) return
      if (def.type === 'equipment') {
        get().equipItem(id)
        return
      }
      const buffKey = def.effect?.combatBuff
      if (buffKey) {
        const now = absoluteMinutes(data.day, data.minutes)
        const untilKey = combatBuffUntilKey(buffKey)
        if (data.combatBuffs[untilKey] > now) {
          set({
            message: `${COMBAT_BUFF_LABEL[buffKey]}药剂已生效（剩余 ${buffHours(
              data.combatBuffs[untilKey] - now,
            )}）。`,
          })
          return
        }
        mutate((d) => {
          if ((d.inventory[id] ?? 0) <= 0) return '你没有这个物品。'
          d.inventory[id] -= 1
          if (d.inventory[id] <= 0) delete d.inventory[id]
          setCombatBuff(d.combatBuffs, buffKey, absoluteMinutes(d.day, d.minutes))
          const text = `你喝下${def.name}。24 小时内${COMBAT_BUFF_LABEL[buffKey]}生效。`
          pushLog(d, text)
          return text
        })
        return
      }
      if (def.effect?.hp && data.hp >= maxHp(data.skills.physique.tier)) {
        set({ message: '生命已经满了。' })
        return
      }
      mutate((d) => {
        if ((d.inventory[id] ?? 0) <= 0) return '你没有这个物品。'
        d.inventory[id] -= 1
        if (d.inventory[id] <= 0) delete d.inventory[id]
        if (def.effect?.mana) d.mana = clamp(d.mana + def.effect.mana, 0, 100)
        if (def.effect?.stamina) d.stamina = clamp(d.stamina + def.effect.stamina, 0, maxStamina(d.skills.physique.tier))
        if (def.effect?.hp) d.hp = clamp(d.hp + def.effect.hp, 0, maxHp(d.skills.physique.tier))
        pushLog(d, `你使用了${def.name}。`)
        return `你使用了${def.name}。`
      })
    },

    equipItem: (id) => {
      const { data, battle } = get()
      if (battle) {
        set({ message: '战斗中无法更换装备。' })
        return
      }
      const def = ITEMS[id]
      if (!def || def.type !== 'equipment' || !def.slot || (data.inventory[id] ?? 0) <= 0) return
      mutate((d) => {
        d.equipment[def.slot!] = id
        pushLog(d, `你装备了${def.name}。`)
        return `你装备了${def.name}。`
      })
    },

    unequipSlot: (slot) => {
      if (get().battle) {
        set({ message: '战斗中无法更换装备。' })
        return
      }
      const id = get().data.equipment[slot]
      const name = id ? ITEMS[id]?.name ?? '装备' : '装备'
      mutate((d) => {
        d.equipment[slot] = null
        pushLog(d, `你卸下了${name}。`)
        return `你卸下了${name}。`
      })
    },

    pray: () => {
      const { data } = get()
      if (data.location !== 'chapel') {
        set({ message: '这里不是祷告的地方。' })
        return
      }
      mutate((d) => {
        if (d.prayers.day !== d.day) d.prayers = { day: d.day, count: 0 }
        if (d.prayers.count >= 3) {
          advanceTime(d, 30)
          pushLog(d, '你在祷告厅里坐了一会儿。')
          return '你已经祷告过三次了。这次只是坐了一会儿。'
        }
        const effects = [
          { spirit: 6, mana: 10 },
          { spirit: 4, mana: 6 },
          { spirit: 2, mana: 3 },
        ][d.prayers.count]
        advanceTime(d, 30)
        d.spirit = clamp(d.spirit + effects.spirit, 0, maxSpirit(d.skills.will.tier))
        d.mana = clamp(d.mana + effects.mana, 0, 100)
        d.prayers.count += 1
        pushLog(d, '你在祷告厅里安静地坐了一会儿。')
        return `你祷告了一会儿。精神 +${effects.spirit}，魔力 +${effects.mana}。`
      })
      maybeEvent({ type: 'after', action: 'pray' })
    },

    meditate: () => {
      const { data } = get()
      if (!MEDITATION_LOCATIONS.includes(data.location)) {
        set({ message: '这里不适合冥想。', modal: null })
        return
      }
      const scene = meditationScene(data.location, data.minutes)
      mutate((d) => {
        advanceTime(d, MEDITATION_MINUTES)
        addExp(d, 'will', MEDITATION_WILL_GAIN)
        const text = `${scene} 意志经验 +${MEDITATION_WILL_GAIN}。`
        pushLog(d, text)
        return text
      })
      set({ modal: null })
    },

    tidyDonations: () => {
      const { data } = get()
      if (data.location !== 'relief') {
        set({ message: '这里不是救济院。' })
        return
      }
      if (!isTimeWindow(data.minutes, RELIEF_OPEN_START, RELIEF_OPEN_END)) {
        set({ message: '救济院已经熄灯了。' })
        return
      }
      if (data.stamina < RELIEF_TIDY_STAMINA) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        advanceTime(d, RELIEF_TIDY_MINUTES)
        d.stamina = clamp(d.stamina - RELIEF_TIDY_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + RELIEF_TIDY_MOOD, 0, 100)
        pushLog(d, '你在救济院整理了捐赠。')
        return '你把旧衣服按大小叠好，又把面粉搬到架子上。玛尔塔看了一眼，说了句“放那边就行”。'
      })
    },

    careForPatients: () => {
      const { data } = get()
      if (data.location !== 'relief') {
        set({ message: '这里不是救济院。' })
        return
      }
      if (!isTimeWindow(data.minutes, RELIEF_OPEN_START, RELIEF_OPEN_END)) {
        set({ message: '救济院已经熄灯了。' })
        return
      }
      if (!reliefHasPatients(data.day)) {
        set({ message: '今天救济院很安静，床位都空着。' })
        return
      }
      if (data.relief.day === data.day && data.relief.cared) {
        set({ message: '今天已经照顾过了。病人已经休息了。' })
        return
      }
      if (data.stamina < RELIEF_CARE_STAMINA) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        resetReliefDay(d)
        advanceTime(d, RELIEF_CARE_MINUTES)
        d.stamina = clamp(d.stamina - RELIEF_CARE_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + RELIEF_CARE_MOOD, 0, 100)
        d.relief.cared = true
        const scene = RELIEF_PATIENT_SCENES[Math.floor(Math.random() * RELIEF_PATIENT_SCENES.length)]
        pushLog(d, '你在救济院照顾了病人。')
        return `${scene}\n\n1 小时 · 体力 -${RELIEF_CARE_STAMINA} · 心情 +${RELIEF_CARE_MOOD}`
      })
    },

    treatAtRelief: () => {
      const { data } = get()
      if (data.location !== 'relief') {
        set({ message: '这里不是救济院。' })
        return
      }
      if (!isTimeWindow(data.minutes, RELIEF_OPEN_START, RELIEF_OPEN_END)) {
        set({ message: '玛尔塔不在，救济院已经熄灯了。' })
        return
      }
      if (data.relief.day === data.day && data.relief.treated) {
        set({ message: '今天已经接受过治疗了。' })
        return
      }
      if (data.hp >= maxHp(data.skills.physique.tier)) {
        set({ message: '你现在不需要治疗。' })
        return
      }
      if (data.money < RELIEF_TREAT_COST) {
        set({ message: data.money < 0 ? '你还欠着钱。' : '钱不够。' })
        return
      }
      mutate((d) => {
        resetReliefDay(d)
        advanceTime(d, RELIEF_TREAT_MINUTES)
        d.money -= RELIEF_TREAT_COST
        d.hp = clamp(d.hp + RELIEF_TREAT_HP, 0, maxHp(d.skills.physique.tier))
        d.relief.treated = true
        pushLog(d, '玛尔塔替你处理了伤口。')
        return `玛尔塔替你处理了伤口。生命 +${RELIEF_TREAT_HP}，花费 ${RELIEF_TREAT_COST} 铜。`
      })
    },

    volunteerAtRelief: () => {
      const { data } = get()
      if (data.location !== 'relief') {
        set({ message: '这里不是救济院。' })
        return
      }
      if (!data.flags.church_volunteer) {
        set({ message: '你还没有和诺拉谈过救济院的活。' })
        return
      }
      if (!isTimeWindow(data.minutes, RELIEF_VOLUNTEER_START, RELIEF_VOLUNTEER_END)) {
        set({ message: '这个时间救济院不需要帮手。' })
        return
      }
      if (data.relief.day === data.day && data.relief.volunteered) {
        set({ message: '今天已经帮过忙了。' })
        return
      }
      if (data.stamina < RELIEF_VOLUNTEER_STAMINA) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        resetReliefDay(d)
        advanceTime(d, RELIEF_VOLUNTEER_MINUTES)
        d.money += RELIEF_VOLUNTEER_PAY
        d.stamina = clamp(d.stamina - RELIEF_VOLUNTEER_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + RELIEF_VOLUNTEER_MOOD, 0, 100)
        d.relief.volunteered = true
        pushLog(d, '你在救济院帮了两个小时。')
        return `你在救济院帮了两个小时，玛尔塔给了你 ${RELIEF_VOLUNTEER_PAY} 枚铜币。`
      })
    },

    climbBellTower: () => {
      const { data } = get()
      if (data.location !== 'bellTower') {
        set({ message: '这里不是钟楼。' })
        return
      }
      if (!isTimeWindow(data.minutes, BELL_TOWER_OPEN_START, BELL_TOWER_OPEN_END)) {
        set({ message: '钟楼的门锁着。' })
        return
      }
      if (data.stamina < BELL_TOWER_STAMINA) {
        set({ message: '你太累了，先休息一下。' })
        return
      }
      mutate((d) => {
        const first = !d.flags.bell_viewed
        advanceTime(d, BELL_TOWER_MINUTES)
        d.stamina = clamp(d.stamina - BELL_TOWER_STAMINA, 0, maxStamina(d.skills.physique.tier))
        d.mood = clamp(d.mood + BELL_TOWER_MOOD, 0, 100)
        d.flags.bell_viewed = true
        pushLog(d, '你登上了钟楼。')
        if (first) {
          return '你沿着窄楼梯爬上钟楼。风从钟绳边穿过去，整座银月城铺在脚下，屋顶一直延伸到雾里。'
        }
        return '你在钟楼上站了一会儿。风从钟绳边吹过，远处有人沿街叫卖。'
      })
    },

    saveSlot: (slot) => {
      const { player, data, battle } = get()
      if (battle) {
        set({ message: '战斗中无法存档。' })
        return
      }
      if (data.guild?.escort) {
        set({ message: '护送途中无法存档。' })
        return
      }
      if (saveGame(slot, player, data)) {
        set({ savesRev: get().savesRev + 1, message: `已保存到${slot === 'auto' ? '自动存档' : `槽位 ${slot}`}。` })
      } else {
        set({ message: '保存失败。' })
      }
    },
    loadSlot: (slot) => {
      if (get().battle || get().data.guild?.escort) {
        set({ message: get().battle ? '战斗中无法读档。' : '护送途中无法读档。' })
        return
      }
      const s = loadGame(slot)
      if (!s) {
        set({ message: '这个槽位是空的。' })
        return
      }
      set({
        screen: 'game',
        player: s.player,
        data: normalizeData(s.data),
        modal: null,
        titlePanel: null,
        message: '读取成功。',
        storyReply: null,
        storyNext: null,
        storyRoute: [],
        storyTarget: null,
        pendingEvent: null,
        eventResult: null,
        battle: null,
        activePackageId: null,
        examCourseId: null,
        battleBonusCopper: 0,
      })
    },
    removeSlot: (slot) => {
      deleteSave(slot)
      set({ savesRev: get().savesRev + 1, message: '已删除存档。' })
    },
    refreshSaves: () => set({ savesRev: get().savesRev + 1 }),
    autosave: () => {
      const { screen, battle, player, data } = get()
      if (screen !== 'game' || battle || data.guild?.escort) return
      saveGame('auto', player, data)
    },

    debugMoney: () => mutate((d) => {
      d.money += 100
      pushLog(d, '（调试）金钱 +100。')
      return '金钱 +100。'
    }),
    debugExp: () => mutate((d) => {
      ;(['physique', 'knowledge', 'will', 'brawl', 'sword', 'nature', 'divine', 'cultivation', 'alchemy'] as SkillKey[]).forEach((k) => addExp(d, k, 50))
      pushLog(d, '（调试）全技能经验 +50。')
      return '全技能经验 +50。'
    }),
    debugHour: () => mutate((d) => {
      advanceTime(d, 60)
      pushLog(d, '（调试）时间 +1 小时。')
      return '时间 +1 小时。'
    }),
    debugSpell: () => mutate((d) => {
      if (!d.spells.includes('fireball')) d.spells.push('fireball')
      pushLog(d, '（调试）学会火球术。')
      return '已学会火球术。'
    }),
    debugHeal: () => {
      mutate((d) => {
        d.hp = maxHp(d.skills.physique.tier)
        pushLog(d, '（调试）生命回满。')
        return '生命已回满。'
      })
      const current = get().battle
      if (current) {
        const hpMax = maxHp(get().data.skills.physique.tier)
        set({ battle: { ...current, playerHp: hpMax } })
      }
    },
    debugDay: () => mutate((d) => {
      advanceTime(d, 24 * 60)
      d.minutes = 6 * 60
      d.stamina = maxStamina(d.skills.physique.tier)
      d.spirit = maxSpirit(d.skills.will.tier)
      d.hp = maxHp(d.skills.physique.tier)
      pushLog(d, '（调试）跳到第二天早上。')
      return '跳到第二天早上。'
    }),
    debugEvent: (id) => {
      const event = eventById(id)
      if (!event) return
      set({ modal: null, pendingEvent: id, eventResult: null, message: '' })
    },
    resetGame: () => {
      set({
        screen: 'title',
        data: freshData(),
        player: { name: '', gender: 'male' },
        modal: null,
        titlePanel: null,
        message: '',
        storyReply: null,
        storyNext: null,
        storyRoute: [],
        storyTarget: null,
        pendingEvent: null,
        eventResult: null,
        battle: null,
        activePackageId: null,
        examCourseId: null,
        battleBonusCopper: 0,
      })
    },
  }
})

export { formatDate, formatMoney, formatTime }

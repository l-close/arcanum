export type Gender = 'male' | 'female'

export type SkillKey =
  | 'physique'
  | 'knowledge'
  | 'will'
  | 'brawl'
  | 'sword'
  | 'nature'
  | 'divine'
  | 'cultivation'
  | 'alchemy'

export type Skill = { tier: number; exp: number }

export type EquipmentSlot = 'mainHand' | 'offHand' | 'armor' | 'accessory'

export type Equipment = Record<EquipmentSlot, string | null>

export type WestProjectKey = 'wall' | 'ditch' | 'lamp'

export type WestState = {
  stage: 0 | 1
  construction: number
  projects: Record<WestProjectKey, number>
  points: number
  period: string | null
  setIndex: number
  accepted: string[]
  done: string[]
}

export type GuildEscortState = {
  destination: string
  segment: number
  totalSegments: number
  goodsDamaged: boolean
}

export type GuildState = {
  week: number
  accepted: string[]
  done: string[]
  escort: GuildEscortState | null
}

export type ExamResult = 'pass' | 'fail' | 'absent'

export type ExamPackage = {
  id: string
  kind: 'monthly' | 'semester'
  day: number
  availableAt: number
  results: Record<string, ExamResult>
  year?: number
  semester?: 1 | 2
  received: boolean
  opened: boolean
}

export type GameData = {
  version: number
  day: number
  minutes: number
  location: string
  money: number
  stamina: number
  spirit: number
  mood: number
  mana: number
  hp: number
  spells: string[]
  skills: Record<SkillKey, Skill>
  affinity: Record<string, number>
  familiarity: Record<string, number>
  flags: Record<string, boolean>
  weekly: { week: number; backyard: number }
  backyard: { day: number; count: number }
  rite: { day: number; phases: string[] }
  vacation: { day: number; kids: boolean }
  training: { week: number; skills: SkillKey[] }
  social: { day: number; counts: Record<string, number> }
  courseMastery: Record<string, number>
  classBonus: string | null
  inventory: Record<string, number>
  equipment: Equipment
  shop: { day: number; sold: Record<string, number> }
  books: Record<string, { progress: number; completed: boolean }>
  bookshelf: string[]
  west: WestState
  guild: GuildState
  prayers: { day: number; count: number }
  plaza: { day: number; fed: boolean }
  meals: { day: number; breakfast: boolean; lunch: boolean; dinner: boolean }
  relief: { day: number; cared: boolean; treated: boolean; volunteered: boolean }
  events: {
    day: number
    count: number
    today: string[]
    lastSeen: Record<string, number>
    lastAt: number
    seen: string[]
  }
  examPackages: ExamPackage[]
  examStartDay: number
  notice: string
  log: string[]
  prologueSeen: boolean
  storyStep: number
  storyDone: boolean
}

export type Player = { name: string; gender: Gender }

export type SaveData = {
  ts: number
  player: Player
  data: GameData
}

export type BattlePhase = 'filling' | 'casting' | 'player' | 'submenu' | 'victory' | 'defeat'

export type BattleSubmenu = 'attack' | 'spell' | 'item' | null

export type BattleCasting = {
  spellId: string
  progress: number
  manaDrained: number
}

export type BattleState = {
  kind: 'spar' | 'wild'
  enemyId: string
  enemyHp: number
  playerHp: number
  playerGauge: number
  enemyGauge: number
  elapsedTicks: number
  casting: BattleCasting | null
  actions: number
  log: string[]
  phase: BattlePhase
  submenu: BattleSubmenu
  result: string
  usedSkills: SkillKey[]
}

export type Screen = 'title' | 'create' | 'game'

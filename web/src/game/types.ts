export type Gender = 'male' | 'female'

export type SkillKey =
  | 'physique'
  | 'knowledge'
  | 'will'
  | 'brawl'
  | 'sword'
  | 'nature'
  | 'divine'

export type Skill = { tier: number; exp: number }

export type EquipmentSlot = 'mainHand' | 'offHand' | 'armor' | 'accessory'

export type Equipment = Record<EquipmentSlot, string | null>

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
  pendingReport: { year: number; semester: 1 | 2 } | null
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

export type BattlePhase = 'filling' | 'player' | 'submenu' | 'victory' | 'defeat'

export type BattleSubmenu = 'attack' | 'spell' | 'item' | null

export type BattleState = {
  kind: 'spar' | 'wild'
  enemyId: string
  enemyHp: number
  playerHp: number
  playerGauge: number
  enemyGauge: number
  round: number
  actions: number
  log: string[]
  phase: BattlePhase
  submenu: BattleSubmenu
  result: string
  usedSkills: SkillKey[]
}

export type Screen = 'title' | 'create' | 'game'

// arcanum: social
import { SUMMER_RITE_DAY, WINTER_RITE_DAY } from './life'
import { hash01 } from './rng'
import { isTimeWindow, semesterState, weekday } from './time'
import { NPCS } from './npcs'

export type SocialTier = 'far' | 'familiar' | 'close'

export type NpcSlot = {
  location: string
  days: 'workday' | 'weekend' | 'all' | 'sunday'
  start: number
  end: number
  chance?: number
  only?: 'school' | 'vacation'
  onlyDay?: number
}

export type NpcDef = {
  id: string
  name: string
  short: string
  title: string
  status: string
  relationship?: 'bond' | 'familiarity'
  schedule: NpcSlot[]
  impression: Record<SocialTier, string>
  lines: Record<SocialTier, string[]>
}

export const SOCIAL_MINUTES = 15

export const SOCIAL_DAILY_GAIN = 1

export function socialTier(affinity: number): SocialTier {
  if (affinity >= 60) return 'close'
  if (affinity >= 20) return 'familiar'
  return 'far'
}

export function heartsText(affinity: number): string {
  const full = Math.max(0, Math.min(5, Math.floor(affinity / 20)))
  return '♥'.repeat(full) + '♡'.repeat(5 - full)
}

export function npcById(id: string): NpcDef | undefined {
  return NPCS.find((n) => n.id === id)
}

export function npcLocationAt(npc: NpcDef, day: number, minutes: number): string | null {
  const workday = weekday(day) < 5
  const sunday = weekday(day) === 6
  const summer = semesterState(day) === 'summer'
  const vacation = summer || semesterState(day) === 'winter'
  for (const slot of npc.schedule) {
    if (slot.only === 'school' && vacation) continue
    if (slot.only === 'vacation' && !vacation) continue
    if (slot.onlyDay !== undefined && day !== slot.onlyDay) continue
    if (slot.days === 'workday' && !workday) continue
    if (slot.days === 'weekend' && workday) continue
    if (slot.days === 'sunday' && !sunday) continue
    if (!isTimeWindow(minutes, slot.start, slot.end)) continue
    if (!slotPresent(npc.id, day, slot)) continue
    return slot.location
  }
  return null
}

function slotPresent(npcId: string, day: number, slot: NpcSlot): boolean {
  const chance = slot.chance ?? 1
  if (chance >= 1) return true
  let h = day * 2654435761 + slot.start * 97 + slot.end
  for (let i = 0; i < npcId.length; i++) {
    h = Math.imul(h ^ npcId.charCodeAt(i), 16777619)
  }
  return hash01(h) < chance
}

export function npcsAt(location: string, day: number, minutes: number): NpcDef[] {
  return NPCS.filter((n) => npcLocationAt(n, day, minutes) === location)
}

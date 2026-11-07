import type { GameData, Player, SaveData } from './types'

export const SLOT_COUNT = 10

function key(slot: number | 'auto'): string {
  return `arcanum_save_${slot}`
}

export function saveGame(slot: number | 'auto', player: Player, data: GameData): boolean {
  try {
    const payload: SaveData = {
      ts: Date.now(),
      player,
      data: structuredClone(data),
    }
    localStorage.setItem(key(slot), JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function loadGame(slot: number | 'auto'): SaveData | null {
  try {
    const raw = localStorage.getItem(key(slot))
    if (!raw) return null
    const parsed = JSON.parse(raw) as SaveData
    if (!parsed?.data || !parsed?.player) return null
    return parsed
  } catch {
    return null
  }
}

export function deleteSave(slot: number | 'auto'): void {
  try {
    localStorage.removeItem(key(slot))
  } catch {
    // ignore
  }
}

export function listSaves(): Array<{ slot: number | 'auto'; ts: number; name: string } | null> {
  const out: Array<{ slot: number | 'auto'; ts: number; name: string } | null> = []
  for (let i = 1; i <= SLOT_COUNT; i += 1) {
    const s = loadGame(i)
    out.push(s ? { slot: i, ts: s.ts, name: s.player.name } : null)
  }
  const auto = loadGame('auto')
  out.push(auto ? { slot: 'auto', ts: auto.ts, name: auto.player.name } : null)
  return out
}

export function hasSave(): boolean {
  return listSaves().some((s) => s !== null)
}

export function formatSaveTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

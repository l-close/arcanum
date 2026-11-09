import LZString from 'lz-string'
import type { GameData, Player, SaveData } from './types'
import { APP_VERSION } from '../version'

export const SLOT_COUNT = 10
export const SAVE_APP_ID = 'arcanum'
export const SAVE_TEXT_PREFIX = 'ARCANUM1:'

export type SaveSlot = number | 'auto'

export type SaveBundle = {
  app: 'arcanum'
  version: string
  kind: 'current' | 'all'
  exportedAt: string
  player?: Player
  data?: GameData
  saves?: Record<string, SaveData>
}

function key(slot: SaveSlot): string {
  return `arcanum_save_${slot}`
}

export function saveGame(
  slot: SaveSlot,
  player: Player,
  data: GameData,
  ts: number = Date.now(),
): boolean {
  try {
    const payload: SaveData = {
      ts,
      player: structuredClone(player),
      data: structuredClone(data),
    }
    localStorage.setItem(key(slot), JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function loadGame(slot: SaveSlot): SaveData | null {
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

export function deleteSave(slot: SaveSlot): void {
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

const LAST_EXPORT_KEY = 'arcanum_last_export'

export function getLastExport(): number | null {
  try {
    const raw = localStorage.getItem(LAST_EXPORT_KEY)
    if (!raw) return null
    const ts = Number(raw)
    return Number.isFinite(ts) && ts > 0 ? ts : null
  } catch {
    return null
  }
}

export function markExported(): void {
  try {
    localStorage.setItem(LAST_EXPORT_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

export function isAndroidRuntime(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}

export function buildCurrentBundle(player: Player, data: GameData): SaveBundle {
  return {
    app: 'arcanum',
    version: APP_VERSION,
    kind: 'current',
    exportedAt: new Date().toISOString(),
    player: structuredClone(player),
    data: structuredClone(data),
  }
}

export function buildAllBundle(): SaveBundle {
  const saves: Record<string, SaveData> = {}
  for (let i = 1; i <= SLOT_COUNT; i += 1) {
    const s = loadGame(i)
    if (s) saves[String(i)] = s
  }
  return {
    app: 'arcanum',
    version: APP_VERSION,
    kind: 'all',
    exportedAt: new Date().toISOString(),
    saves,
  }
}

export function encodeBundle(bundle: SaveBundle): string {
  return SAVE_TEXT_PREFIX + LZString.compressToBase64(JSON.stringify(bundle))
}

export type BundleParseResult =
  | { ok: true; bundle: SaveBundle; upgraded: boolean }
  | { ok: false; reason: string }

function parseVersion(value: string): number[] | null {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value.trim())
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function compareVersion(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1
  }
  return 0
}

export function parseBundleText(text: string): BundleParseResult {
  const trimmed = text.trim()
  if (!trimmed) return { ok: false, reason: '还没有存档内容。' }
  let raw: unknown
  try {
    const body = trimmed.startsWith(SAVE_TEXT_PREFIX)
      ? LZString.decompressFromBase64(trimmed.slice(SAVE_TEXT_PREFIX.length))
      : trimmed
    if (!body) return { ok: false, reason: '存档文本不完整，无法解压。' }
    raw = JSON.parse(body)
  } catch {
    return { ok: false, reason: '这段文本不是有效的存档。' }
  }
  const bundle = raw as SaveBundle
  if (!bundle || bundle.app !== SAVE_APP_ID) {
    return { ok: false, reason: '这不是 arcanum 的存档。' }
  }

  const savedRaw = typeof bundle.version === 'string' ? bundle.version : ''
  const saved = parseVersion(savedRaw)
  const current = parseVersion(APP_VERSION)
  let upgraded = false
  if (saved && current) {
    if (saved[0] !== current[0]) {
      return {
        ok: false,
        reason: `存档主版本 ${saved[0]}，当前主版本 ${current[0]}，无法导入。`,
      }
    }
    const order = compareVersion(saved, current)
    if (order > 0) {
      return {
        ok: false,
        reason: `存档版本 ${savedRaw} 高于当前版本 ${APP_VERSION}，请更新游戏后再导入。`,
      }
    }
    upgraded = order < 0
  } else if (savedRaw !== APP_VERSION) {
    return {
      ok: false,
      reason: `存档版本 ${savedRaw || '未知'}，当前版本 ${APP_VERSION}，无法导入。`,
    }
  }

  if (bundle.kind !== 'current' && bundle.kind !== 'all') {
    return { ok: false, reason: '存档类型无法识别。' }
  }
  if (bundle.kind === 'current' && (!bundle.player || !bundle.data)) {
    return { ok: false, reason: '存档内容不完整。' }
  }
  if (bundle.kind === 'all' && (!bundle.saves || typeof bundle.saves !== 'object')) {
    return { ok: false, reason: '存档内容不完整。' }
  }
  return { ok: true, bundle, upgraded }
}

export function importCurrentToSlot(bundle: SaveBundle, slot: number): boolean {
  if (!bundle.player || !bundle.data) return false
  return saveGame(slot, bundle.player, bundle.data)
}

export type ImportPlan = { written: number[]; removed: number[] }

export function planAllImport(bundle: SaveBundle): ImportPlan {
  const written: number[] = []
  const removed: number[] = []
  for (let i = 1; i <= SLOT_COUNT; i += 1) {
    if (bundle.saves?.[String(i)]) written.push(i)
    else if (loadGame(i)) removed.push(i)
  }
  return { written, removed }
}

export function importAllSlots(bundle: SaveBundle): ImportPlan {
  const plan = planAllImport(bundle)
  for (let i = 1; i <= SLOT_COUNT; i += 1) {
    const s = bundle.saves?.[String(i)]
    if (s?.player && s?.data) saveGame(i, s.player, s.data, s.ts)
    else deleteSave(i)
  }
  return plan
}

export function downloadText(filename: string, text: string, mime = 'application/json'): boolean {
  try {
    const blob = new Blob([text], { type: `${mime};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}

export function stampForFile(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
}

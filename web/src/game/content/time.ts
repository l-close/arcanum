// arcanum: time

export const REST_THRESHOLD = 20

export const REST_MINUTES = 30

export const REST_STAMINA = 5

export const SLEEP_MIN_RECOVERY_MINUTES = 240

export const SLEEP_MIN_MINUTES = 60

export const SLEEP_MAX_MINUTES = 720

export const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function weekday(day: number): number {
  return ((day % 7) + 7) % 7
}

export function formatDate(day: number): string {
  return `${calendarYearLabel(currentYear(day))} · ${formatMonthDay(day)}`
}

export function calendarYearLabel(year: number): string {
  return `第${chineseNumber(year)}年`
}

export function formatMonthDay(day: number): string {
  const dayInYear = ((day % YEAR_DAYS) + YEAR_DAYS) % YEAR_DAYS
  const month = Math.floor(dayInYear / 28) + 1
  const d = (dayInYear % 28) + 1
  return `${chineseNumber(month)}月${chineseNumber(d)}日 · ${WEEKDAYS[weekday(day)]}`
}

const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export function chineseNumber(n: number): string {
  if (n <= 10) return CN_NUM[n]
  if (n < 20) return `十${CN_NUM[n - 10]}`
  if (n < 100) {
    const tens = Math.floor(n / 10)
    const ones = n % 10
    return `${CN_NUM[tens]}十${ones === 0 ? '' : CN_NUM[ones]}`
  }
  return String(n)
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = Math.floor(minutes) % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatMoney(copper: number): string {
  const sign = copper < 0 ? '-' : ''
  const v = Math.abs(Math.floor(copper))
  const gold = Math.floor(v / 10000)
  const silver = Math.floor((v % 10000) / 100)
  const bronze = v % 100
  const parts: string[] = []
  if (gold > 0) parts.push(`${gold} 金`)
  if (silver > 0) parts.push(`${silver} 银`)
  if (bronze > 0 || parts.length === 0) parts.push(`${bronze} 铜`)
  return sign + parts.join(' ')
}

export function isTimeWindow(minutes: number, start: number, end: number): boolean {
  if (start < end) return minutes >= start && minutes < end
  return minutes >= start || minutes < end
}

export const YEAR_DAYS = 224

export const SEMESTER_DAYS = 84

export const HOLIDAY_DAYS = 28

export const MAX_YEAR = 2

export type SemesterState = 'semester1' | 'summer' | 'semester2' | 'winter' | 'after'

const YEAR_LABEL: Record<number, string> = {
  1: '第一学年',
  2: '第二学年',
  3: '第三学年',
}

export function currentYear(day: number): number {
  return Math.floor(day / YEAR_DAYS) + 1
}

export function dayInYear(day: number): number {
  return day % YEAR_DAYS
}

export function ageOf(day: number): number {
  return 14 + Math.floor(day / YEAR_DAYS)
}

export function semesterState(day: number): SemesterState {
  if (currentYear(day) > MAX_YEAR) return 'after'
  const d = dayInYear(day)
  if (d < SEMESTER_DAYS) return 'semester1'
  if (d < SEMESTER_DAYS + HOLIDAY_DAYS) return 'summer'
  if (d < SEMESTER_DAYS * 2 + HOLIDAY_DAYS) return 'semester2'
  return 'winter'
}

export function yearLabel(year: number): string {
  return YEAR_LABEL[year] ?? `第${year}学年`
}

export function semesterLabel(day: number): string {
  const state = semesterState(day)
  if (state === 'after') return '第三学年尚未开放'
  const term =
    state === 'semester1'
      ? '第一学期'
      : state === 'summer'
        ? '暑假'
        : state === 'semester2'
          ? '第二学期'
          : '寒假'
  const year = currentYear(day)
  return year === 1 ? term : `${yearLabel(year)} · ${term}`
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function absoluteMinutes(day: number, minutes: number): number {
  return day * 1440 + minutes
}

export function nextRentTotal(day: number, minutes: number): number {
  const t = absoluteMinutes(day, minutes)
  const weekStart = Math.floor(t / 10080) * 10080
  let b = weekStart + 6 * 1440 + 22 * 60
  if (b <= t) b += 10080
  return b
}

export function daysUntil(total: number, day: number, minutes: number): number {
  return Math.max(0, Math.floor((total - absoluteMinutes(day, minutes)) / 1440))
}

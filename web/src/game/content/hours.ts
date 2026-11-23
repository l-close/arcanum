// arcanum: business hours text

import { formatTime } from './time'

export function formatHours(start: number, end: number): string {
  return end < start
    ? `${formatTime(start)}–次日 ${formatTime(end)}`
    : `${formatTime(start)}–${formatTime(end)}`
}

export function closedHint(name: string, start: number, end: number): string {
  return `${name}现在不在营业时间（${formatHours(start, end)}）。`
}

export function notOpenHint(name: string, start: number, end: number): string {
  return `${name}现在不开放（${formatHours(start, end)}）。`
}

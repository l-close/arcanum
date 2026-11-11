// arcanum: schedule

import type { SkillKey } from '../types'
import { SKILL_LABEL } from './skills'
import { HOLIDAY_DAYS, MAX_YEAR, SEMESTER_DAYS, YEAR_DAYS, absoluteMinutes, currentYear, dayInYear, semesterState, weekday } from './time'
import { isConstructionWeek } from './world'
import { CLASS_SCENES } from './textClassScenes'

export type CourseDef = {
  id: string
  year: number
  name: string
  skill: SkillKey
  kind: 'literature' | 'nature' | 'physical'
  location: string
  start: number
  end: number
  teacher: string
  /** 考试地点；不填则跟随当天的上课地点 */
  examLocation?: string
  /** 按星期指定上课地点，索引 0 = 周一 */
  locationByWeekday?: string[]
  /** 按星期指定上课技能，索引 0 = 周一 */
  skillByWeekday?: SkillKey[]
  /** 体术类课程在格斗与剑术之间轮换 */
  rotate?: boolean
  /** 按整周轮换，而不是按天轮换 */
  rotateWeekly?: boolean
  /** 单双周轮换预留，暂未启用 */
  weekParity?: 'odd' | 'even'
}

export const COURSES: CourseDef[] = [
  {
    id: 'y1_literature',
    year: 1,
    name: '古典文学',
    skill: 'knowledge',
    kind: 'literature',
    location: 'lecture',
    start: 9 * 60,
    end: 11 * 60,
    teacher: '伊莲娜',
  },
  {
    id: 'y1_nature',
    year: 1,
    name: '法术导论',
    skill: 'nature',
    kind: 'nature',
    location: 'lecture',
    start: 13 * 60,
    end: 15 * 60,
    teacher: '阿尔文·莱特',
  },
  {
    id: 'y1_physical',
    year: 1,
    name: '体术课',
    skill: 'brawl',
    kind: 'physical',
    location: 'yard',
    start: 15 * 60 + 30,
    end: 17 * 60 + 30,
    teacher: '格里高利·索恩',
    rotate: true,
    rotateWeekly: true,
  },
  {
    id: 'y2_history',
    year: 2,
    name: '王国史',
    skill: 'knowledge',
    kind: 'literature',
    location: 'lecture',
    start: 8 * 60,
    end: 9 * 60 + 30,
    teacher: '伊莲娜',
  },
  {
    id: 'y2_advanced_nature',
    year: 2,
    name: '法术进阶',
    skill: 'nature',
    kind: 'nature',
    location: 'lecture',
    start: 10 * 60,
    end: 11 * 60 + 30,
    teacher: '阿尔文·莱特',
  },
  {
    id: 'y2_sword',
    year: 2,
    name: '高阶剑术',
    skill: 'sword',
    kind: 'physical',
    location: 'yard',
    start: 13 * 60,
    end: 14 * 60 + 30,
    teacher: '格里高利·索恩',
  },
  {
    id: 'y2_course_4',
    year: 2,
    name: '草药学',
    skill: 'alchemy',
    kind: 'nature',
    location: 'brewery',
    start: 15 * 60,
    end: 16 * 60 + 30,
    teacher: '赛拉·莫恩',
    examLocation: 'lecture',
    locationByWeekday: ['brewery', 'brewery', 'brewery', 'herbGarden', 'herbGarden'],
    skillByWeekday: ['alchemy', 'alchemy', 'alchemy', 'cultivation', 'cultivation'],
  },
]

export const EXAM_DAYS_YEAR1 = [25, 53, 81, 137, 165, 193]

export const EXAM_DAYS_YEAR2 = [25, 53, 81, 137, 165, 193]

export function examDaysForYear(year: number): number[] {
  return year === 1 ? EXAM_DAYS_YEAR1 : EXAM_DAYS_YEAR2
}

export function isExamDay(day: number): boolean {
  const year = currentYear(day)
  if (year !== 1 && year !== 2) return false
  return examDaysForYear(year).includes(dayInYear(day))
}

/** 月考课程：按原本的上课时间开考。 */
const EXAM_COURSE_IDS: Record<number, string[]> = {
  1: ['y1_literature', 'y1_nature', 'y1_physical'],
  2: ['y2_history', 'y2_advanced_nature', 'y2_sword', 'y2_course_4'],
}

export function examCoursesForYear(year: number): CourseDef[] {
  const ids = EXAM_COURSE_IDS[year]
  if (!ids) return []
  return coursesForYear(year).filter((c) => ids.includes(c.id))
}

/** 月考包裹在考试后的周日 08:00 到达孤儿院。 */
export function examPackageTime(examDay: number): number {
  return (examDay + 2) * 1440 + 8 * 60
}

/** 学期成绩单在学期结束后的第一个周日 08:00 到达孤儿院。 */
export function semesterEndDay(year: number, semester: 1 | 2): number {
  return (year - 1) * YEAR_DAYS + (semester === 1 ? SEMESTER_DAYS : SEMESTER_DAYS * 2 + HOLIDAY_DAYS)
}

export function semesterPackageTime(endDay: number): number {
  const wd = weekday(endDay)
  const add = (6 - wd + 7) % 7 || 7
  return (endDay + add) * 1440 + 8 * 60
}

/** 学期最后一次月考所在的一天，用于学期成绩单的掌握度线。 */
export function semesterLastExamDay(year: number, semester: 1 | 2): number {
  const days = examDaysForYear(year)
  return (year - 1) * YEAR_DAYS + days[semester === 1 ? 2 : 5]
}

const YEAR_THRESHOLDS: Record<number, number[]> = {
  1: [20, 60, 100, 120, 160, 200],
  // 第二学年每月少一周课，考试线下调
  2: [15, 35, 60, 80, 100, 120],
}

export function isClassDay(day: number): boolean {
  if (isExamDay(day) || isConstructionWeek(day)) return false
  const state = semesterState(day)
  return weekday(day) < 5 && (state === 'semester1' || state === 'semester2')
}

export function coursesForYear(year: number): CourseDef[] {
  return COURSES.filter((c) => c.year === year)
}

export function courseById(id: string): CourseDef | undefined {
  return COURSES.find((c) => c.id === id)
}

/** 某门课当天的上课地点 */
export function courseLocationOn(course: CourseDef, day: number): string {
  const wd = weekday(day)
  if (course.locationByWeekday && wd >= 0 && wd < 5) {
    return course.locationByWeekday[wd] ?? course.location
  }
  return course.location
}

/** 某门课当天实际训练的的技能 */
export function courseSkillOn(course: CourseDef, day: number): SkillKey {
  const wd = weekday(day)
  if (course.skillByWeekday && wd >= 0 && wd < 5) {
    return course.skillByWeekday[wd] ?? course.skill
  }
  if (course.rotate) {
    if (course.rotateWeekly) {
      return Math.floor(day / 7) % 2 === 0 ? 'brawl' : 'sword'
    }
    return wd === 0 || wd === 2 || wd === 4 ? 'brawl' : 'sword'
  }
  return course.skill
}

/** 某门课考试当天的地点 */
export function courseExamLocationOn(course: CourseDef, day: number): string {
  return course.examLocation ?? courseLocationOn(course, day)
}

export function examThresholdForDay(day: number): number {
  const year = currentYear(day)
  const days = examDaysForYear(year)
  const idx = days.indexOf(dayInYear(day))
  const table = YEAR_THRESHOLDS[year] ?? YEAR_THRESHOLDS[1]
  return table[idx < 0 ? table.length - 1 : idx]
}

export function nextExamThreshold(day: number, minutes: number): number | null {
  const total = nextExamTotal(day, minutes)
  if (total === null) return null
  return examThresholdForDay(Math.floor(total / 1440))
}

export type ClassSegment = {
  subject: string
  label: string
  skill: SkillKey
  extraSkill?: SkillKey
  courseId: string
  start: number
  end: number
  segmentStart: number
  segmentEnd: number
  index: number
}

export function classSegmentAt(location: string, minutes: number, day: number): ClassSegment | null {
  if (!isClassDay(day)) return null
  const wd = weekday(day)
  if (wd >= 5) return null

  const course = coursesForYear(currentYear(day)).find(
    (c) => courseLocationOn(c, day) === location && minutes >= c.start && minutes < c.end,
  )
  if (!course) return null

  const skill = courseSkillOn(course, day)
  const extraSkill: SkillKey | undefined = course.kind === 'physical' ? 'physique' : undefined
  const rotating = Boolean(course.rotate || course.skillByWeekday)
  const label = rotating ? `${course.name} · ${SKILL_LABEL[skill]}` : course.name

  const index = Math.floor((minutes - course.start) / 30)
  const segmentStart = course.start + index * 30
  const segmentEnd = Math.min(segmentStart + 30, course.end)
  return {
    subject: course.name,
    label,
    skill,
    extraSkill,
    courseId: course.id,
    start: course.start,
    end: course.end,
    segmentStart,
    segmentEnd,
    index,
  }
}

/** 当前 30 分钟分段的课堂场景文本；没有对应文本时返回空串 */
export function classScene(segment: ClassSegment, location: string): string {
  const variant =
    segment.courseId === 'y1_physical'
      ? segment.skill
      : segment.courseId === 'y2_course_4'
        ? location
        : ''
  const lines = CLASS_SCENES[variant ? `${segment.courseId}:${variant}` : segment.courseId] ?? []
  if (lines.length === 0) return ''
  return lines[segment.index % lines.length]
}

/** 自习与练习对应的当前学年课程；没有对应课程时返回 null */
export function masteryCourseForSkill(skill: SkillKey, day: number): string | null {
  const courses = coursesForYear(currentYear(day))
  if (skill === 'brawl' || skill === 'sword') {
    const physical = courses.find(
      (c) => c.kind === 'physical' && (c.rotate || c.skill === skill),
    )
    return physical?.id ?? null
  }
  const match = courses.find(
    (c) =>
      c.kind !== 'physical' &&
      (c.skill === skill || c.skillByWeekday?.includes(skill)),
  )
  return match?.id ?? null
}

export function classWindowAt(
  location: string,
  day: number,
  minutes: number,
): { start: number; end: number } | null {
  if (!isClassDay(day)) return null
  const course = coursesForYear(currentYear(day)).find(
    (c) => courseLocationOn(c, day) === location && minutes >= c.start && minutes < c.end,
  )
  return course ? { start: course.start, end: course.end } : null
}

export function nextClassStart(location: string, day: number, minutes: number): number | null {
  if (!isClassDay(day)) return null
  const starts = coursesForYear(currentYear(day))
    .filter((c) => courseLocationOn(c, day) === location)
    .map((c) => c.start)
    .sort((a, b) => a - b)
  return starts.find((s) => s > minutes) ?? null
}

export type LecturePreviewPlan =
  | {
      ok: true
      minutes: number
      subject: string
      skill: SkillKey
      courseId: string
    }
  | { ok: false; reason: string }

export function lecturePreviewPlan(day: number, minutes: number): LecturePreviewPlan {
  if (!isClassDay(day)) {
    return { ok: false, reason: '今天讲堂不开门。' }
  }
  if (classWindowAt('lecture', day, minutes)) {
    return { ok: false, reason: '这节课还在上，等下课吧。' }
  }
  const next = nextClassStart('lecture', day, minutes)
  if (next === null) {
    return { ok: false, reason: '今天没有下一节课了。' }
  }
  const available = Math.min(30, next - minutes)
  if (available < 15) {
    return { ok: false, reason: `还有 ${available} 分钟上课，来不及预习了。` }
  }
  const course = coursesForYear(currentYear(day)).find(
    (c) => c.location === 'lecture' && c.start === next,
  )
  if (!course) {
    return { ok: false, reason: '今天没有下一节课了。' }
  }
  return {
    ok: true,
    minutes: available,
    subject: course.name,
    skill: course.skill,
    courseId: course.id,
  }
}

export function nextExamTotal(day: number, minutes: number): number | null {
  if (isExamDay(day) && minutes < 20 * 60) {
    return day * 1440 + (currentYear(day) === 1 ? 9 * 60 : 8 * 60)
  }
  const t = absoluteMinutes(day, minutes)
  const year = currentYear(day)
  const candidates: number[] = []
  for (let y = year; y <= Math.min(MAX_YEAR, year + 1); y++) {
    const start = y === 1 ? 9 * 60 : 8 * 60
    for (const offset of examDaysForYear(y)) {
      candidates.push(((y - 1) * YEAR_DAYS + offset) * 1440 + start)
    }
  }
  return candidates.filter((x) => x > t).sort((a, b) => a - b)[0] ?? null
}

export type ReportKey = { year: number; semester: 1 | 2 }

export function semesterEndFor(prevDay: number, day: number): ReportKey | null {
  for (let y = currentYear(prevDay); y <= currentYear(day); y++) {
    const ends: Array<{ at: number; semester: 1 | 2 }> = [
      { at: (y - 1) * YEAR_DAYS + SEMESTER_DAYS, semester: 1 },
      { at: (y - 1) * YEAR_DAYS + SEMESTER_DAYS * 2 + HOLIDAY_DAYS, semester: 2 },
    ]
    for (const end of ends) {
      if (prevDay < end.at && day >= end.at) return { year: y, semester: end.semester }
    }
  }
  return null
}

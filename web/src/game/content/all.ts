import type {
  CombatBuffKey,
  CombatBuffs,
  EquipmentSlot,
  Skill,
  SkillKey,
  WestProjectKey,
} from '../types'
import { hash01 } from './rng'
import { TIER_REQ, SKILL_LABEL } from './skills'
import { ITEMS } from './items'
import type { Location } from './locations'
import { timePeriod } from './locations'
import { SUMMER_RITE_DAY, WINTER_RITE_DAY } from './life'
import { isConstructionWeek } from './world'
import { Season, seasonOf } from './weather'
import {
  absoluteMinutes,
  chineseNumber,
  currentYear,
  dayInYear,
  HOLIDAY_DAYS,
  isTimeWindow,
  MAX_YEAR,
  SEMESTER_DAYS,
  semesterState,
  weekday,
  YEAR_DAYS,
} from './time'

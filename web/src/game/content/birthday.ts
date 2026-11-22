// arcanum: birthday

/** 诺拉捡到主角的日子，孤儿院把这天当作生日。六月十六日。 */
export const FOUND_DAY = 155

/** 生日强制事件：不进随机事件池。 */
export const BIRTHDAY_EVENT_ID = 'birthday'

/** 只有进到孤儿院建筑里面才算回来；街区不算。 */
export const BIRTHDAY_LOCATIONS: string[] = [
  'orphanage',
  'dorm',
  'orphanCanteen',
  'backyard',
  'office',
]

/** 当天不在孤儿院时的提示。 */
export const BIRTHDAY_NOTICE = '今天是你的生日。回孤儿院看看吧。'

// arcanum: notices
import { currentYear } from './time'

export type PlazaNotice = { id: string; title: string; text: string }

const PLAZA_NOTICES_BASE: PlazaNotice[] = [
  {
    id: 'gate_hours',
    title: '城门时刻',
    text: '城门 22:00 关闭，次日 06:00 开启。夜间入城请走侧门，并出示文书。\n——城门卫队',
  },
  {
    id: 'night_patrol',
    title: '夜间巡逻',
    text: '城南夜间有窃案，骑士团已加派巡骑。请居民夜间关好门窗。',
  },
  {
    id: 'lost_bag',
    title: '失物招领',
    text: '城门卫队拾到一只旧皮袋，内有铜币若干。失主请至城门认领。',
  },
  {
    id: 'road_repair',
    title: '道路修补',
    text: '中央广场东侧石板修补中，行人请绕行。',
  },
  {
    id: 'prayer',
    title: '圣祷公告',
    text: '每周日 09:00–11:00 于教堂举行圣祷，欢迎信徒参加。',
  },
  {
    id: 'relief_donation',
    title: '救济院募捐',
    text: '救济院征集旧衣、面粉与柴火，请送至教堂救济院。',
  },
  {
    id: 'bell_open',
    title: '钟楼开放',
    text: '钟楼 07:00–19:00 开放。登楼请勿敲钟。',
  },
  {
    id: 'caravan_arrive',
    title: '商队到城',
    text: '北境商队已抵银月城。杂货店新到香料、毛皮与药品。',
  },
  {
    id: 'weekend_market',
    title: '周末集市',
    text: '每逢周六 09:00–17:00 于中央广场设集市，招募摊主与帮工。',
  },
  {
    id: 'tavern_job',
    title: '酒馆招工',
    text: '酒馆招晚间帮工，负责端送与清理。工钱面议，供一餐。',
  },
  {
    id: 'guild_hiring',
    title: '商会招工',
    text: '商会招募临时帮工，负责搬运与清点。工钱日结，至商会办事处登记。',
  },
  {
    id: 'workshop_herbs',
    title: '工坊收药',
    text: '药剂工坊收购止血草与苦叶，按品相计价，长期有效。',
  },
  {
    id: 'greenhouse_stock',
    title: '温室供药',
    text: '温室供应常见药草，数量有限，售完即止。',
  },
  {
    id: 'weapon_orders',
    title: '武具店接单',
    text: '武具店接受打造订单。来料请先交柜台过目，按件计工。',
  },
  {
    id: 'rune_orders',
    title: '符文刻印',
    text: '符文工坊接受武器与护甲刻印，需自备刻印材料。',
  },
  {
    id: 'academy_exam',
    title: '学院月考',
    text: '月考按课程表在原课时进行，讲堂与演武场按课程安排使用。',
  },
  {
    id: 'cemetery_notice',
    title: '墓园提醒',
    text: '墓园开放至黄昏。请勿在闭园后逗留，勿移动墓碑前的供物。',
  },
  {
    id: 'rite_prep',
    title: '圣祷准备',
    text: '教堂征集周日圣祷的布置人手，需提前半小时到场。',
  },
  {
    id: 'herb_buy',
    title: '草药收购',
    text: '商会收购森林边缘的草药，按份计价。',
  },
  {
    id: 'lost_cat',
    title: '寻猫',
    text: '遗失一只灰猫，右耳有缺口，常在广场讨食。见者请告知孤儿院附近住户。',
  },
  {
    id: 'missing_traveler',
    title: '寻人',
    text: '寻找一名走失的旅人，最后出现在商业区。',
  },
  {
    id: 'room_rent',
    title: '房屋出租',
    text: '孤儿院附近有一间小屋出租，租金面议。',
  },
]

const PLAZA_NOTICES_WEST: PlazaNotice[] = [
  {
    id: 'west_supplies',
    title: '西境物资募集',
    text: '商会征集药品、绷带与干粮，送往西境。按件计价，送至商业区仓库。',
  },
  {
    id: 'west_move',
    title: '西境迁居登记',
    text: '西境部分村镇开放迁居登记，有意者请至商会办事处。',
  },
  {
    id: 'west_labor',
    title: '商会招募搬运帮工',
    text: '西境物资装车，需临时帮工。08:00–10:00 到商会办事处集合，工钱日结，管一顿早饭。',
  },
  {
    id: 'west_delay',
    title: '西境商队延期',
    text: '因道路不宁，西境商队延期出发。已登记的货物与人员请等候通知。',
  },
  {
    id: 'west_tower_watch',
    title: '哨塔换岗',
    text: '西镇哨塔夜间换岗，镇外路口请结伴通行。',
  },
]

export function plazaNotices(day: number, flags: Record<string, boolean>): PlazaNotice[] {
  const pool = [...PLAZA_NOTICES_BASE]
  if (currentYear(day) >= 2 && flags.west_support_started) {
    pool.push(...PLAZA_NOTICES_WEST)
  }
  const start = (day * 5) % pool.length
  const picked: PlazaNotice[] = []
  for (let i = 0; i < 3 && i < pool.length; i += 1) {
    const notice = pool[(start + i) % pool.length]
    if (!picked.some((n) => n.id === notice.id)) picked.push(notice)
  }
  return picked
}

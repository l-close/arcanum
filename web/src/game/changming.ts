// arcanum: 长明夜

import type { ChangmingRole, GameData, SkillKey } from './types'
import { currentYear, dayInYear } from './content/time'

export type ChangmingEffects = {
  mood?: number
  exp?: Partial<Record<SkillKey, number>>
  affinity?: Record<string, number>
}

export type ChangmingChoice = {
  label: string
  effects?: ChangmingEffects
  next: string
  /** 记录角色选择的选项，用于当晚回收。 */
  setChoice?: string
  /** 小插曲的选择，与角色选择分开。 */
  setIncident?: string
  /** 记录去过的自由时间地点。 */
  addFreeVisit?: string
}

export type ChangmingScene = {
  id: string
  text: (data: GameData) => string[]
  choices?: (data: GameData) => ChangmingChoice[]
  next?: (data: GameData) => string
  /** prep_done / prep_again / ending 由 store 特殊处理。 */
  close?: boolean
}

export const CHANGMING_START = 'arrival'

export const CHANGMING_DAY = 117

export const CHANGMING_PREP_DAYS: [number, number] = [116, 117]

export const CHANGMING_PREP_DEADLINE = 17 * 60

export const CHANGMING_START_MINUTES = 18 * 60

export const CHANGMING_LATE_MINUTES = 19 * 60

export const CHANGMING_END_MINUTES = 21 * 60

export const CHANGMING_ROLES: ChangmingRole[] = [
  'lantern',
  'keeper',
  'storyteller',
  'watch',
  'singer',
  'logistics',
]

export const CHANGMING_ROLE_LABEL: Record<ChangmingRole, string> = {
  lantern: '灯匠',
  keeper: '守灯人',
  storyteller: '讲述者',
  watch: '巡夜',
  singer: '领唱',
  logistics: '后勤',
}

export const CHANGMING_ROLE_DESC: Record<ChangmingRole, string> = {
  lantern: '做灯、修灯、排灯，让每一盏都亮得稳。',
  keeper: '守主灯，风大的时候别让它灭。',
  storyteller: '在讲堂讲一段学院旧事。',
  watch: '沿走廊检查窗户和灯，把风挡在外面。',
  singer: '在前庭领一段短歌。',
  logistics: '烧水、温杯，把热饮送到各处。',
}

export const CHANGMING_ROLE_ROOM: Record<ChangmingRole, string> = {
  lantern: 'canteen',
  keeper: 'academy',
  storyteller: 'library',
  watch: 'yard',
  singer: 'lecture',
  logistics: 'canteen',
}

export const CHANGMING_ROLE_ROOM_LABEL: Record<ChangmingRole, string> = {
  lantern: '食堂',
  keeper: '学院前庭',
  storyteller: '藏书阁',
  watch: '演武场',
  singer: '讲堂',
  logistics: '食堂',
}

/**
 * 准备窗口：长明夜前一天全天，以及当天 17:00 前。
 * 传入本次准备要花费的分钟数，保证结束时间不越过截止点。
 */
export function canPrepChangming(data: GameData, cost = 60): boolean {
  if (currentYear(data.day) !== 1) return false
  const day = dayInYear(data.day)
  if (day < CHANGMING_PREP_DAYS[0] || day > CHANGMING_PREP_DAYS[1]) return false
  const cutoff = day === CHANGMING_PREP_DAYS[1] ? CHANGMING_PREP_DEADLINE : 22 * 60
  return data.minutes + cost <= cutoff
}

const role = (data: GameData) => data.changming.role
const choice = (data: GameData) => data.changming.choice
const incident = (data: GameData) => data.changming.incident

const roleLine = (data: GameData, lines: Partial<Record<ChangmingRole, string>>, fallback: string) => {
  const current = role(data)
  return current ? lines[current] ?? fallback : fallback
}

const wishText = (data: GameData) => {
  switch (choice(data)) {
    case 'wish_year':
      return '你把这句话写在灯纸上，字被灯烤得有点卷。'
    case 'wish_together':
      return '你写完，抬头看了一眼前庭。米娅在台阶下，卢卡在廊柱边。'
    case 'wish_none':
      return '你把笔放下，看着灯纸空着。'
    default:
      return '你把灯纸折了一下，夹在灯罩旁边。'
  }
}

const wishChoices = (next: string): ChangmingChoice[] => [
  { label: '希望这一年别太快过去。', setChoice: 'wish_year', next, effects: { mood: 1 } },
  { label: '希望明年还能一起点灯。', setChoice: 'wish_together', next, effects: { mood: 1 } },
  { label: '不写。', setChoice: 'wish_none', next, effects: { mood: 1 } },
]

const freeInfo: Record<
  string,
  { label: string; effects: ChangmingEffects; text: string[] }
> = {
  free_lecture: {
    label: '去讲堂听故事',
    effects: { mood: 1, exp: { knowledge: 1 } },
    text: [
      '讲堂里还坐着几个人。椅子没有完全收好，桌上留着裁下来的灯纸，边角翘着。',
      '伊莲娜坐在最后一排，听一个学生讲刚才没讲完的故事。她偶尔点一下头，不急着接话。讲到一处含糊的地方，她也没有打断，只等那个学生自己想起来。',
      '故事说的是一个学生在冬天丢了手套，最后在讲堂的炉子边上找到。讲的人自己先笑了，说这算什么故事。伊莲娜说，记得住就算。',
      '有人在门口问还能不能进来听。伊莲娜往旁边挪了挪，让出一把椅子。',
      '你在门边找了个位置坐下。椅子还是温的，桌上留着一小片灯纸。',
      '故事讲到一半，有人笑了一声，又很快安静下来。窗外的灯透过纸照进来，把桌面分成一块一块的亮。',
      '故事讲完，伊莲娜没有点评，只把窗边的灯芯拨低了一点。讲堂里暗下来，外面的灯光反而更清楚了。',
      '有人问那个丢手套的学生后来怎么样了。伊莲娜说，后来他毕业了，去过哪里没有人记下来。',
      '“记不住也没关系。”她说，“今晚记住这个故事就行。”',
      '没有人马上走。大家坐了一会儿，听外面的风从窗缝里过去。',
      '伊莲娜把灯留在桌上，说最后走的人把它带回藏书阁。',
      '你离开讲堂时，身后的灯还亮着，照着一圈空椅子。',
    ],
  },
  free_courtyard: {
    label: '去前庭看灯',
    effects: { mood: 2 },
    text: [
      '前庭的灯已经全亮了。米娅和卢卡在台阶边，米娅手里还拿着半张灯纸，正拿它扇风。',
      '有人在灯纸上写字，写完就塞进灯罩下面。风小了，主灯的火很稳。卢卡把一盏被碰歪的灯扶正，退开两步看了看，又伸手挪了一点。',
      '米娅看见你，朝主灯那边抬了抬下巴，说刚才有一盏灯差点灭，被守灯的人按住了。她说得很轻，像在讲一件已经过去很久的事。',
      '台阶上坐着一个低年级学生，手里捧着没写完的灯纸。卢卡在他旁边站了一会儿，没有催，等他自己把最后一句写完。',
      '你站了一会儿，觉得前庭比刚才安静。远处有人在收杯子，杯口碰在一起，声音很轻。',
      '风从回廊穿过来，所有灯一起晃了一下，又一起稳住。',
      '米娅把手里的半张灯纸折成一条，夹在灯罩旁边。她说这样能看出风从哪边来。',
      '主灯的光落在台阶上，卢卡用鞋尖把一块松动的石板踩实。',
      '有个学生从回廊那头跑来，在台阶前停住，问还来不来得及写灯纸。米娅说来得及，把手里剩下的纸分给他。',
      '那个学生蹲在台阶上写，写完把纸折成很小的一块，塞进灯罩下面。',
      '他站起来，看了看主灯，又看了看自己那盏，像是确认两盏灯都还亮着。',
      '你离开前庭时，主灯的光落在台阶上，把每一级都照得很清楚。',
    ],
  },
  free_corridor: {
    label: '去西侧走廊',
    effects: { mood: 1, exp: { physique: 1 } },
    text: [
      '西侧走廊比前庭冷。窗户关好了，风还在缝里响。灯一盏隔一盏地亮着，把墙上的影子拉得很长。',
      '格里高利从尽头走过来，手里提着一盏小灯。他看见你，只点了点头，继续往前走。你跟上去，替他把走廊尽头那扇窗又推了一下。',
      '窗框比白天更涩。你们一起用力，窗才往里合了一点。格里高利看了看合页，说今天先这样，明天上油。',
      '走廊中间有一扇门开着，里面没有点灯。格里高利伸手把门带上，说风就是从这儿灌进来的。',
      '你们一起看了一遍剩下的窗。有一扇窗框还是有点松，但今晚不会再开了。格里高利把灯放在窗台上，说这盏留在这儿。',
      '往回走的时候，你听见前庭那边的声音传过来，隔着一层墙，听不真切。',
      '走到走廊尽头，格里高利又停下来，看了看那盏灯的位置。他说这盏灯今晚不灭，让晚回去的人看得见路。',
      '你回头看了一眼。那盏小灯在走廊尽头亮着，比前庭的灯暗得多。',
      '格里高利没有马上走。他站在灯旁边，听了一会儿走廊里的风。',
      '你陪他站了一会儿。走廊里很静，前庭的声音从远处传来，像隔着一层门。',
      '他说改天要记得带油来，合页响得比去年厉害。',
      '你往前庭走的时候，走廊尽头那盏小灯还亮着，光落在空窗台上。',
    ],
  },
  free_canteen: {
    label: '去食堂喝一杯',
    effects: { mood: 2 },
    text: [
      '食堂的锅还温着。桌上摆着空杯子，米娅在收拾托盘，把剩下的杯子一只只摞起来。',
      '卢卡把剩下的灯纸叠成一小摞，放在桌角。他看见你，把其中一张推过来，说可以留着。纸边还带着一点浆糊的痕迹。',
      '锅底还有一点热饮，米娅给你倒进杯子里。她说这是最后一杯，再晚就没有了。',
      '你坐下来，喝了一口。杯壁已经不太烫了。米娅在你对面坐下，把托盘放在腿上，说今天晚上总算快结束了。',
      '卢卡没有坐，靠在桌边听你们说话。他偶尔往窗外看一眼，确认前庭的灯还亮着。',
      '食堂里比前庭安静。锅里的水响了一声，米娅伸手把火关小。',
      '米娅说今天晚上她数错了一次人数，后来重新数了一遍才对。卢卡说没关系，反正人都回来了。',
      '你把杯子喝完，放在桌上。杯底还剩一点温热。',
      '米娅把空杯收进托盘，说再坐一会儿也没关系，反正外面还有灯。',
      '你又坐了一会儿。食堂的窗口透进前庭的光，落在桌面上，慢慢移动。',
      '米娅把托盘放回架子上，说等外面散了，她们也要回去了。',
      '你走出食堂时，前庭的灯从门缝里照进来，落在门槛上。',
    ],
  },
}

const incidentFor = (data: GameData): string => {
  const current = role(data)
  if (current === 'lantern' || current === 'keeper' || current === 'logistics') {
    return 'incident_wind'
  }
  return 'incident_classmate'
}

const freeNext = (data: GameData) => {
  if (data.changming.freeVisits.length < 2) return 'free_choice'
  return incidentFor(data)
}

const roleChoiceText: Record<string, string[]> = {
  lantern_wick: [
    '你拨了灯芯，火苗立起来。米娅在下面说，行了。',
    '风再过来时，你修过的那盏灯只晃了一下。',
  ],
  lantern_mia: [
    '米娅扶着灯罩，你腾出手去拨灯芯。她的手指被灯纸染了一点黄。',
    '灯亮起来时，她先看见那盏灯晃，隔着人群喊了你一声。',
  ],
  lantern_alvin: [
    '阿尔文没有接手，只让你把灯罩侧一点。你照做，火稳了。',
    '他站到了主灯旁边。风起来时，他抬手替你挡了一下。',
  ],
  keeper_shield: [
    '你没有离开主灯。风从背后过去，火苗低了一下，又直起来。',
    '风起来时，你本来就在位置上，第一个侧过身。',
  ],
  keeper_luca: [
    '卢卡从食堂后面拖来一块旧布。你们把布绑在廊柱上，风被挡住一半。',
    '主灯旁边的风小了一半。卢卡没有走。',
  ],
  keeper_gregory: [
    '格里高利搬来一块木板，靠在主灯旁边。他说：“下次自己先找东西挡。”',
    '木板留在主灯旁边。风再大，你也不慌。',
  ],
  storyteller_history: [
    '你把册子翻到夹着书签的那一页，接着往下讲。有人往前挪了挪椅子。',
    '那个不敢点灯的同学后来记得你讲的那句。',
  ],
  storyteller_mia: [
    '米娅走上来讲了一个你漏掉的细节。她讲得比你快，底下有人笑。',
    '结尾时，她说：“你刚才把年份讲错了。不过没人发现。”',
  ],
  storyteller_elena: [
    '伊莲娜从最后一排站起来。她没有纠正你，只接着你的话往下说。',
    '结尾时，她说：“故事讲完就够了，不用每句都对。”',
  ],
  watch_self: [
    '你用肩膀顶住窗框，往里推。窗框响了一声，关上了。',
    '结尾时，风从西侧走廊过去，没有再撞那扇窗。',
  ],
  watch_luca: [
    '卢卡从楼梯口过来，帮你扶住窗框。你们一起把窗推回去。',
    '他留在走廊里，说再站一会儿。他没有多问。',
  ],
  watch_gregory: [
    '你走到走廊尽头，把窗的事说了。格里高利放下手里的东西，跟你过来。',
    '他把窗框重新压紧，说：“下次先看合页。”',
  ],
  singer_self: [
    '你往前半步，把最后一句接住。声音有点抖，但没有断。',
    '结尾时，前庭安静下来，最后一句还在你耳朵里。',
  ],
  singer_mia: [
    '你和米娅并排站着。她起了半个调，你跟上去，底下的人慢慢跟齐。',
    '米娅说：“你刚才差点跑调。”她说得很轻，没有笑你。',
  ],
  singer_elena: [
    '伊莲娜抬手，轻轻起了个头。你们跟着她重新唱了一遍。',
    '她说：“唱齐比唱准难。今天算齐了。”',
  ],
  logistics_main: [
    '你端起托盘，先往前庭走。杯子在盘里轻轻碰了一下。',
    '守灯人接过第一杯，说：“放边上吧。灯不能离人。”',
  ],
  logistics_mia: [
    '米娅从你手里拿走一半杯子。她说这样快一点，果然快了一点。',
    '她把最后一只杯子放回托盘，说：“下次少拿两只。”',
  ],
  logistics_run: [
    '你先往走廊跑了一趟。回来时托盘上少了两只杯子，风从门缝里灌进来，你把托盘压低，没让杯子翻。',
    '巡夜的人拿到的是第一杯。主灯那杯放了一会儿，守灯人说没关系，灯还热着。',
  ],
  guest_cups: [
    '你帮后勤端了几只杯子。托盘比看起来重，杯口的热气扑在手腕上，你走得很慢，怕拐弯时杯子碰在一起。走到廊下时，手臂已经开始发酸，杯口的热气却一直没有散。',
    '米娅从你身边经过，顺手替你扶正了一只快倒的杯子。她没有停下来，只说了句“看着脚下”。你把托盘换了个手，继续往前走。走廊里有人接过杯子，道了声谢。',
  ],
  guest_corridor: [
    '你去了西侧走廊。巡夜的人正把一扇窗推回去，窗框响了一声。你走过去，替他把灯举高了一点。窗框上有陈年的漆，被灯一照，裂成细小的纹。',
    '你帮不上什么，只在旁边照了一会儿灯。走廊尽头还有一扇窗没有关严，你们一起看了看，决定留到明天再修。他把那扇窗的位置记在纸上，又画了一道线，说今晚先别硬关。',
  ],
  guest_lights: [
    '你留在前庭看灯。主灯亮着，窗一扇一扇亮着。有人从你身边经过，把一只空杯子放在台阶上。风一吹，杯口发出很轻的响声。',
    '米娅在不远处叫你，声音很轻，像怕惊动什么。你走过去，她把手里多出来的一张灯纸递给你。纸还是温的，边角有点卷。她没有问你要写什么，只把笔也递了过来。',
  ],
}

const prepDoneText: Record<ChangmingRole, string[]> = {
  lantern: [
    '你把做好的灯放在窗边。灯纸还有点皱，米娅说等会儿再压一压。',
    '伊莲娜看了一眼，没有说好，也没有说不好，只说别放在风口。',
  ],
  keeper: [
    '你把主灯的角度记下来。阿尔文没有再示范，只让你自己做一遍。',
    '火亮起来的时候，他没有夸你，只说今晚风不大。',
  ],
  storyteller: [
    '你把要讲的那段又看了一遍。伊莲娜把书签往后挪了一页。',
    '“不用背。”她说，“记住你为什么要讲它。”',
  ],
  watch: [
    '你把路线记在心里。格里高利说长明夜走廊会留一盏小灯。',
    '你走到西侧尽头，确认那扇窗关严了。',
  ],
  singer: [
    '你和米娅、卢卡又合了一遍。最后一句还是有点乱，但米娅说可以了。',
    '伊莲娜在门口听了一会儿，没有进来。',
  ],
  logistics: [
    '你把杯子摆回托盘。米娅说晚上会冷，热饮要趁早送。',
    '卢卡把路线写在一张小纸上，塞进你手里。',
  ],
}

const prepAgainText: Record<ChangmingRole, string[]> = {
  lantern: [
    '你又去食堂试了一次灯。灯纸换了新的，火比刚才稳。',
    '米娅在旁边看了一会儿，说这次不会皱了。',
  ],
  keeper: [
    '你又站在主灯旁边练了一次。风从门廊穿过来，你没有急着伸手。',
    '阿尔文在不远处看着，没有出声。',
  ],
  storyteller: [
    '你把故事讲给自己听了一遍。有些句子还是不顺，但你知道该在哪里停。',
    '藏书阁的窗关着，声音没有传出去。',
  ],
  watch: [
    '你又走了一遍西侧走廊。哪扇窗容易关不严，你已经不用想。',
    '格里高利把一盏小灯放在尽头，说长明夜用它照路。',
  ],
  singer: [
    '你又和米娅、卢卡合了一遍。米娅起了个头，你没有等她数拍。',
    '卢卡在旁边轻轻跟上来。',
  ],
  logistics: [
    '你空手走了一遍送热饮的路线。前庭、走廊、讲堂、食堂，拐角都记住了。',
    '米娅说这次你不会把杯子端翻。',
  ],
}

const prepExp: Record<ChangmingRole, SkillKey> = {
  lantern: 'nature',
  keeper: 'will',
  storyteller: 'knowledge',
  watch: 'physique',
  singer: 'will',
  logistics: 'physique',
}

const teacherEnding: Record<ChangmingRole, string> = {
  lantern: '阿尔文站在主灯旁边，说：“灯亮着就行。剩下的明天收。”',
  keeper: '阿尔文把手从灯罩边收回来，说：“今晚风不大。你站得住。”',
  storyteller: '伊莲娜把册子合上，说：“故事讲完，灯还亮着。这样就够了。”',
  watch: '格里高利把走廊的钥匙收进口袋，说：“窗都关好了。回去睡。”',
  singer: '伊莲娜站在台阶边，说：“唱齐了。最后一句没有人抢。”',
  logistics: '伊莲娜接过一只空杯子，说：“热的送到手上，就算送到了。”',
}

export const CHANGMING_SCENES: Record<string, ChangmingScene> = {
  prep_lantern: {
    id: 'prep_lantern',
    text: () => [
      '食堂的长桌上摊着灯纸、浆糊和一小捆细竹条。米娅从你手边抽走一张，举起来对着窗看，说这张裁歪了。',
      '你低头看，边缘确实斜了一截。伊莲娜从桌边经过，停了一下。“灯骨别扎太紧。”她说，“纸会皱。”她没有伸手，只看着你把竹条重新摆正。',
      '你把纸蒙上去，边角还是皱了一点。米娅说这样也能亮，只要别放在风口。她把手里的灯纸翻了个面，指给你看哪一边应该朝外。',
      '食堂里有人搬锅，铁勺碰到锅沿，响了一声。你把做好的灯排在窗边，和另外几盏比了比。有一盏的骨架比你的直，有一盏的纸比你的白。',
      '米娅把浆糊盖上，说别看了，长明夜谁也顾不上看灯纸皱不皱。',
      '你把剩下的竹条捆好，放回桌角。食堂的窗没有关严，风吹进来，做好的灯轻轻晃了一下。',
      '伊莲娜在门口看了一眼，说做好的灯先别拿走，等会儿还要再检查一遍。',
    ],
    next: () => 'prep_done',
  },
  prep_keeper: {
    id: 'prep_keeper',
    text: () => [
      '前庭中央的主灯还没有点。阿尔文让你把手放在灯罩侧面，风从门廊穿过来，火苗偏了一下。',
      '他让你侧过身，不要用手直接挡光。你试了一次，火还是晃。',
      '“别急。”他说，“先看风从哪边来。”',
      '你蹲下来，顺着廊柱看过去。风从西侧两道门之间进来，绕过台阶，才到主灯这里。阿尔文等你指对了方向，才把灯罩重新摆正。',
      '格里高利搬着梯子从旁边经过，没有停，只说了一句：“别站在门口。”你往旁边让了让，再看主灯，火果然稳了一点。',
      '阿尔文让你再做一遍。这一次你没有急着伸手，先侧过身，把风让开。',
      '火稳下来以后，他把灯罩扣回去，让你自己听一会儿。风还在，但你已经知道它会从哪边来。',
      '阿尔文说，长明夜不用一直盯着火，听声音就够了。',
    ],
    next: () => 'prep_done',
  },
  prep_storyteller: {
    id: 'prep_storyteller',
    text: () => [
      '藏书阁的窗关着，旧册子摊在桌上。伊莲娜把书签夹在一页，说不用讲完整的院史，讲一个你记得住的细节。',
      '你翻到一段写学院早年冬天的记录。字很密，纸边发脆。上面说，最早的时候，学院没有现在这么多灯，学生晚上读书，要把灯放在桌子中间，几个人共用一盏。',
      '“讲错了也没关系。”她说，“先讲完。”',
      '你把那段读了一遍，又读了一遍。伊莲娜没有催，只在你说到一半停住的时候，把窗边的灯往你这边推了推。',
      '“这一句你自己信吗？”她问。你愣了一下，重新看了一遍册子，把那个不太确定的说法改掉了。',
      '她没有说改得对不对，只把书签往后挪了一页，让你接着往下看。',
      '你又读了一段。藏书阁外面有人走过，脚步声停在门口，又远了。伊莲娜没有抬头。',
      '她把书签夹好，说讲的时候不用看册子，看前面的人。',
    ],
    next: () => 'prep_done',
  },
  prep_watch: {
    id: 'prep_watch',
    text: () => [
      '演武场的木桩还没收。格里高利带你沿走廊走了一遍，告诉你哪几扇窗容易关不严。',
      '“走慢点。”他说，“别跑。看到窗没关，记下来。”',
      '走廊尽头有一扇窗，风从缝里进来，灯罩里的火很小。你伸手推了一下，窗框响了一声，又弹回来。',
      '格里高利没有替你推。他让你看合页，说先看哪边松，再用力。你照做，窗框往里合了一点，但没有完全关上。',
      '“今晚先这样。”他说，“别硬掰。掰坏了，往后更漏风。”',
      '你记下窗的位置，又记下哪一盏灯离它最近。回演武场的时候，格里高利把一盏小灯放在走廊尽头，说长明夜用它照路。',
      '你们往回走。他走得很慢，每经过一扇窗都看一眼。你也跟着看，慢慢看出哪几扇窗的插销松了。',
      '格里高利说，长明夜不用跑，按今晚的路线走一遍就行。',
    ],
    next: () => 'prep_done',
  },
  prep_singer: {
    id: 'prep_singer',
    text: () => [
      '讲堂里的椅子被推到墙边。米娅起了一个调，卢卡低声跟着。伊莲娜坐在最后一排听。',
      '“不用唱得准。”她说，“先唱齐。”',
      '米娅唱到一半停了，说这里总有人跟不上。卢卡想了想，说可以把最后一句放慢半拍，让后面的人有时间接上来。',
      '你们试了一遍。米娅起头，卢卡跟，你在最后一句压住声音。唱完以后，讲堂里安静了一下，米娅说比刚才好。',
      '伊莲娜没有站起来，也没有跟着唱。她只说：“最后一句别抢。等别人。”',
      '你们又唱了一遍。这一次你听见卢卡在旁边换气，米娅的声音也没有往前冲。',
      '唱完第三遍，米娅说可以了。伊莲娜这才站起来，把讲堂的窗推开一条缝，让外面的风吹进来。',
      '米娅说，长明夜要是有人跟不上，就再唱一遍，不用停。',
    ],
    next: () => 'prep_done',
  },
  prep_logistics: {
    id: 'prep_logistics',
    text: () => [
      '食堂的锅还没完全开，杯口浮着一层白汽。你把杯子一只只摆开，米娅拿走一只缺口的，卢卡把缺口的换到最里面。',
      '你记下前庭、走廊、讲堂、食堂的位置。卢卡在一张小纸上画了路线，从前庭到西侧走廊要拐两个弯，从讲堂回来要下一段台阶。',
      '“先送哪儿？”米娅问。',
      '你端起空托盘，沿着路线走了一遍。托盘比看起来稳，但拐弯的时候还是会晃。卢卡在后面提醒你，杯子不要摆得太靠边。',
      '米娅把一块干布垫在托盘底下，说这样杯子不会滑。她又数了一遍杯子，把多出来的一只放回桌上。',
      '你把路线纸折好，塞进口袋。食堂的锅开始响了，白汽从锅沿冒出来。',
      '卢卡又检查了一遍杯口，把两只缺口朝里的杯子换到外面。米娅说不用那么仔细，他还是换完了。',
      '米娅把路线纸上的两个拐角圈出来，说长明夜灯暗，到这里慢一点。',
    ],
    next: () => 'prep_done',
  },
  prep_done: {
    id: 'prep_done',
    text: (data) => {
      const current = role(data)
      if (!current) return ['你把东西收拾好，往前庭走。']
      return [
        ...prepDoneText[current],
        '你把手上的东西放回原处。出门时，你又回头看了一眼。',
        '长明夜之前，你还会再想一遍。',
      ]
    },
    close: true,
  },
  prep_again: {
    id: 'prep_again',
    text: (data) => {
      const current = role(data)
      if (!current) return ['你又看了一遍前庭的灯。']
      return [
        ...prepAgainText[current],
        '这一次你没有那么急了。',
        '你收拾好东西，把门带上。外面有人在走动。',
      ]
    },
    close: true,
  },

  arrival: {
    id: 'arrival',
    text: (data) => [
      '学院前庭的石板还带着白天的凉气。长桌从食堂抬出来，桌脚在石缝里磕了一下，卢卡扶住桌沿，米娅在旁边笑了一声，又弯腰去捡散开的灯纸。',
      '伊莲娜把一叠裁好的纸压在镇纸下面，说今晚风不大，但别把灯挂在廊柱外侧。阿尔文在检查灯芯，指尖亮了一下，又熄掉。格里高利把梯子搬到西侧，回头问谁负责那排高窗。',
      '一个学生抱着一卷灯纸从回廊跑来，纸卷太长，拐弯时撞在廊柱上。米娅伸手扶住，卢卡弯腰把散开的那截捡起来。',
      '伊莲娜让他把纸放在长桌上，先裁再挂。那个学生喘着气点头，把纸卷慢慢展开，边角还带着压过的折痕。',
      '阿尔文把主灯的灯芯拨了拨，火没有点，只让灯芯露出合适的长度。他做得很慢，旁边几个学生都停下来看。',
      '伊莲娜让灯匠先把回廊的灯排好，再点主灯。她说主灯一亮，别的灯就该各就各位。',
      '有人把灯挂在廊柱外侧，被格里高利看见，让他挪到里侧。那个学生不太服气，米娅在旁边说，外侧风大，灯纸会破。',
      roleLine(
        data,
        {
          lantern: '你把最后一盏灯挂在廊下，米娅在下面扶着梯子。',
          keeper: '你站在主灯旁边，手一直没离开灯罩。',
          storyteller: '你把那本旧册子抱在怀里，准备往讲堂去。',
          watch: '你从西侧走廊回来，鞋底带着一点灰。',
          singer: '你站在前庭边上，米娅在你旁边起调。',
          logistics: '你端着一托盘杯子从食堂出来。',
        },
        '你站在人群边上，手里没有灯，也没有杯子。',
      ),
      '学生们从回廊两头过来。有人抱着灯纸，有人提着水桶，还有人只是来看。长桌很快摆满了东西，浆糊罐被推到中间，谁用谁拿。',
      '长桌另一头，有人在试灯芯。火点着了，又吹灭，再点。阿尔文从旁边经过，没有停，只说：“别对着纸吹。”那个学生把灯举远了一点。',
      '米娅把散开的灯纸按大小叠好，最小的一叠压在浆糊罐下面。卢卡从食堂搬来第二张长桌，桌脚还是不平，他折了一张纸垫在下面。',
      '格里高利把梯子架在西侧，试了试稳不稳。一个学生问主灯什么时候点，他朝台阶那边抬了抬下巴，说等人到齐。',
      '伊莲娜在台阶上数人数，数到一半停下来，让你们先把手上的东西放下。她说今晚不用急，灯一盏一盏点，人一个一个来。',
      '你经过长桌时，手指蹭到一点浆糊。米娅从你身后探过头来，说这盏灯歪了。你抬头看，灯确实歪向一边，像还没决定要不要亮。',
      '前庭上方的天色还没有全暗，回廊里先亮起了一盏试火的灯。有人抬头看了一眼，又低头继续手里的活。',
      '阿尔文走过来，把歪掉的灯扶正，没有多说什么。伊莲娜把人数数完，让各人到自己该去的位置。',
    ],
    next: () => 'lighting',
  },
  lighting: {
    id: 'lighting',
    text: () => [
      '前庭安静下来。有人把最后一盏灯递上梯子，下面的人往后退了半步，怕挡住光。',
      '第一扇窗亮起来的时候，前庭里有人轻轻叫了一声。然后是第二扇、第三扇，光沿着回廊一间接一间地铺过去。',
      '中间有一盏灯冒了烟。格里高利伸手把灯罩抬高，阿尔文过去看了一眼，说灯芯压得太低。两个人没有多话，一个扶灯，一个拨芯，火很快稳了。',
      '阿尔文把主灯的火调小了一点，说先别急。伊莲娜站在台阶上，看着最后一扇窗。格里高利把梯子挪开，免得挡住廊下的灯。',
      '米娅在你旁边小声数着，数到最后一盏时，她没数下去。卢卡替她数完，声音很轻。主灯亮起来，前庭一下子比刚才暖了。',
      '阿尔文没有马上离开。他站在主灯旁边，看了一会儿火，才把火钳放下。',
      '伊莲娜从台阶上走下来，在人群边上站住。她没有说灯点得好，只说今晚的风比昨天小。',
      '米娅把手里的灯纸举到眼前，对着主灯看。纸被光照透，她眯起眼睛，说这样能看见纸里细细的纹路。',
      '有人把手里的灯举高了一点，光晃过廊柱，又落回石板上。回廊尽头的窗也亮了，光线从里面透出来，把窗棂的影子投在墙上。',
      '前庭里没有人急着说话。灯光把每个人的影子拉长，又叠在一起，分不清谁是谁的。',
      '伊莲娜让站在廊下的人往后退一步，免得挡住灯。她自己站在台阶边，没有往灯前站。',
      '米娅把最后一盏灯的灯罩转了半圈，让开口背风。她做完这件事，才回到你旁边。',
      '伊莲娜没有说可以了，只等所有人都把手里的东西放下。然后她从袖子里抽出一叠裁好的灯纸，分给站在前面的人。',
      '阿尔文把火钳放回桶里，补了一句：“写完别把纸凑到火上。”',
      '伊莲娜把一张灯纸递给你，说可以写一句。',
    ],
    choices: () => wishChoices('lighting_after'),
  },
  lighting_after: {
    id: 'lighting_after',
    text: (data) => [wishText(data), '你把灯纸放好，回到人群里。'],
    next: () => 'gathering',
  },
  gathering: {
    id: 'gathering',
    text: (data) => [
      '学生围在前庭。米娅和卢卡站在人群里，米娅还在小声哼刚才的调子。卢卡没有唱，只在她停下来的地方轻轻接了半句。',
      '伊莲娜站在台阶上，说：“长明不是灯一直亮。是它灭的时候，有人愿意再点一次。”',
      '她没有提高声音，前庭却慢慢静了。有人把手里的灯放低，有人把没写完的灯纸折起来。',
      '阿尔文补了一句：“别让纸碰到火。”格里高利把梯子收起来，说：“走廊那几扇窗，风大。巡夜的人走慢点。”',
      '伊莲娜把今晚要做的事一件件说下去：灯匠留在廊下，守灯人不要离开主灯，讲述者去讲堂，巡夜从西侧走到东侧，领唱在台阶前，后勤把热饮送到。',
      '“做完自己的事，就可以歇一会儿。”她说，“今晚不用每个人都忙到最后。”',
      '有人问灯要亮到什么时候。伊莲娜说，亮到该灭的时候。那人还想再问，旁边的人拉了他一下。',
      '又有人问为什么叫长明。伊莲娜说，不是因为灯一直亮，是因为每年都有人重新点。',
      '问的人点点头，没有再问。前庭里有人把这句话重复了一遍，声音很轻。',
      '“灯不用一直盯着。”她说，“人也不用一直站着。”',
      '米娅把袖子挽到手肘，问谁跟她去廊下。卢卡已经往台阶边走了，走了两步又停下，回头等你。',
      '学生们慢慢散开，有人往讲堂去，有人往西侧走廊去，长桌旁边只剩下几个收东西的人。',
      '有人笑了一声，气氛松下来。米娅朝你这边看了一眼，像是在确认你还在。卢卡把一只空杯子从台阶上拿开，免得有人踢到。',
      roleLine(
        data,
        {
          lantern: '你看了一眼自己那盏灯，纸边还有一点皱。',
          keeper: '主灯的火稳下来了。',
          storyteller: '你把册子翻开，夹着书签的那一页在风里动了一下。',
          watch: '你把手里的路线图折好，塞进口袋。',
          singer: '米娅清了清嗓子，卢卡往后退了半步。',
          logistics: '你把托盘放在桌边，杯口还冒着白汽。',
        },
        '你站在人群边上，听见有人叫你名字。',
      ),
    ],
    next: (data) => (data.changming.role ? `role_${data.changming.role}` : 'guest'),
  },
  arrival_late: {
    id: 'arrival_late',
    text: (data) => [
      '你走进前庭的时候，窗已经亮了一片。主灯也点着了，火稳下来，光落在石板上。',
      '回廊里比平时安静。你从西侧过来，路上只遇见一个抱着空水桶的学生，他跑得很快，水在桶底晃出声音。',
      '走廊的窗都关着，灯一盏隔一盏地亮。你经过时，灯罩里的火往一边偏，又慢慢直起来。',
      '台阶下已经站了不少人。有人仰头看灯，有人低头整理灯纸。你从人群后面绕过去，鞋底在石板上蹭出一点声音。',
      '有人在台阶边小声说话，说主灯点亮的时候，前庭一下子亮得像白天。另一个人说没有那么亮，只是眼睛习惯了暗。',
      '你走到台阶下，停了一会儿。主灯的火很稳，光落在每个人的肩上，也落在你还没站稳的脚边。',
      '米娅从人群里探出头，看见你，朝旁边挪了挪，给你留出一个位置。卢卡没有回头，只把挡在台阶前的一只空桶挪开。',
      '你站过去，听见旁边的人正在说刚才点灯的事。有人说第一扇窗亮得太快，有人说是主灯先亮的。没有人提起你不在。',
      '你抬头看了一圈。每扇窗后面都有人影，有的在走动，有的只是站着。灯把那些影子压在窗纸上，看不分明。',
      '伊莲娜站在台阶边，手里还提着一盏小灯。她没有问你为什么来晚，只把灯递过来。',
      '“还剩这一盏。”她说。',
      '前庭里有人在说话，声音隔着一层光，听起来很远。你朝米娅那边点了点头，她把手放下来，没有再招手。',
      roleLine(
        data,
        {
          lantern: '灯阵已经排好，你只来得及把歪掉的那盏扶正。',
          keeper: '主灯已经点了，你把手放在灯罩旁边，试了试温度。',
          storyteller: '你把册子抱在怀里，准备往讲堂去。',
          watch: '你从西侧走廊过来，鞋底还带着灰。',
          singer: '米娅已经起了调，你站到她旁边接上。',
          logistics: '你把空托盘放在桌边，准备再回食堂。',
        },
        '你站在人群后面，看了一会儿灯。',
      ),
      '你把小灯接过来，灯罩还是温的。伊莲娜没有催你，只往旁边让了让，让你站到台阶下。',
      '你站定以后，才发现自己一路走得有点急。前庭的灯很稳，没有一盏因为你晚到而灭。',
      '你把呼吸放慢，跟着人群看了一会儿主灯。',
    ],
    next: () => 'late_lighting',
  },
  late_lighting: {
    id: 'late_lighting',
    text: () => [
      '你接过那盏小灯。灯纸有点潮，火点了一次没着。',
      '你划第二根火柴的时候，手稍微挡了一下风。火凑到灯芯上，先缩了一下，才慢慢立起来。',
      '灯罩上有一道细小的划痕，火光照过去，像一条很浅的线。你把灯举高了一点，风从廊柱那边过来，火苗往旁边偏。',
      '你把手移到灯罩另一侧，火苗跟着正回来。这个动作让你想起刚才在走廊里看到的那些窗。',
      '灯亮稳以后，你把灯罩扣好，又看了一遍灯芯。火不大，但足够照见脚下的路。',
      '前庭里有人在说话，声音隔着一层光，听起来很远。你把手拢在灯罩旁边，火苗立起来，照见脚边一小块石板。',
      '离你最近的两个学生正在分一张灯纸。他们看见你手里的灯，往旁边让了让，给你腾出一点位置。',
      '其中一个问你从哪边过来，你说西侧。他点点头，说那边风大，难怪灯纸有点潮。',
      '主灯已经亮着，别的窗也亮着。你没有赶上大家一起点灯的时候，但手里这一盏是你的。',
      '你低头看灯罩，火光把纸里的竹骨照出来，一根一根，很细。',
      '伊莲娜站在台阶边，没有催你。她把灯纸递过来，说还可以写一句。',
      '你接过灯纸，发现背面已经印了一点灯罩的灰。你用手指把它擦掉，纸面上留下一条浅浅的痕。',
      '旁边的人往你这边看了一眼，又转回去看主灯。',
    ],
    choices: () => wishChoices('late_lighting_after'),
  },
  late_lighting_after: {
    id: 'late_lighting_after',
    text: (data) => [
      wishText(data),
      '灯已经亮了一片，只有你手里这一盏是新点的。你把它放到台阶边，火光和别的灯连在一起。',
      '有人从旁边经过，看了一眼你放的灯，说这盏位置好，风碰不到。',
      '你退开半步，站在台阶下。主灯在你前面，小灯在你脚边。',
      '前庭里有人开始唱第一句。你来得晚，没有赶上开头，但跟上了后面。',
    ],
    next: () => 'gathering',
  },
  guest: {
    id: 'guest',
    text: () => [
      '你没有选角色，站在前庭边上。长桌上还有几只空杯子，灯纸被风吹得翻了一角。',
      '各人都在忙自己的事。灯匠在廊下试火，守灯人站在主灯旁边，讲述者抱着册子往讲堂走，巡夜的人已经拐进西侧走廊。',
      '米娅从你身边经过，问你要不要帮忙。卢卡在台阶边扶着一盏歪掉的灯，没有回头，只把灯往你这边递了递。',
      '你没有非做不可的事。前庭里还有很多小活，谁看见谁做。',
      '一个学生抱着一摞空杯子从你面前经过，杯子叠得太高，最上面那只晃了一下。你伸手扶住，他道了声谢。',
      '米娅在台阶那边叫你，问你要不要一起去送一轮杯子。卢卡已经把托盘从桌上端起来了，但没有催你。',
      '你看了看长桌，也看了看回廊那边。两边都有人，都还缺一双手。',
      '廊下的灯照在杯口上，白汽一层一层往上走。米娅和卢卡站在长桌边，等你决定。',
      '米娅说，没有选角色也没什么，今晚的活本来就不是按角色分的。卢卡点头，把托盘放回桌边。',
      '你站了一会儿，听见主灯那边有人在调灯罩。声音很轻，像有人在敲一只空杯。',
      '你还有一点时间，可以做点什么。',
    ],
    choices: () => [
      {
        label: '帮后勤端杯子',
        setChoice: 'guest_cups',
        effects: { mood: 1 },
        next: 'guest_after',
      },
      {
        label: '去走廊看巡夜的人',
        setChoice: 'guest_corridor',
        effects: { mood: 1 },
        next: 'guest_after',
      },
      {
        label: '留在前庭看灯',
        setChoice: 'guest_lights',
        effects: { mood: 1 },
        next: 'guest_after',
      },
    ],
    next: () => 'guest_after',
  },
  guest_after: {
    id: 'guest_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [callback[0] ?? '你在前庭站了一会儿。']
    },
    next: () => 'free_choice',
  },

  role_lantern: {
    id: 'role_lantern',
    text: () => [
      '灯阵沿着回廊排开。你从第一盏走到最后一盏，风从廊柱之间穿过来，灯纸轻轻响。',
      '灯与灯之间隔着差不多的距离，有的挂在廊柱内侧，有的放在窗台上。你伸手试了试每一盏的灯罩，确认没有被风吹歪。',
      '最后一盏在拐角，火点了两次都没着。米娅在下面扶着梯子，说是不是灯芯太短。',
      '阿尔文从旁边经过，手里拿着另一盏灯。他看了一眼，没有接手，只说：“先别加火。”',
      '你凑近看，灯芯确实短了一截，火苗够不到灯纸。拐角的风比别处大，火刚立起来，又被压下去。',
      '米娅把梯子往墙边挪了挪，让你站得更稳。她仰着头，灯纸的光落在她脸上，照出一点不耐烦，又不像真的在催。',
      '下面有学生经过，抬头问这盏灯是不是不亮了。米娅说还在修，让他们先往前走。',
      '阿尔文没有走远。他站在下一盏灯旁边，像是在看别处，但你每次抬头，他都在视线里。',
      '你把手放在灯罩边，没有急着点火。灯芯短的那一截就在眼前，风又从拐角过来了。',
    ],
    choices: () => [
      {
        label: '自己修灯芯',
        setChoice: 'lantern_wick',
        effects: { exp: { nature: 2 } },
        next: 'role_lantern_after',
      },
      {
        label: '和米娅一起调整',
        setChoice: 'lantern_mia',
        effects: { affinity: { mia: 1 }, mood: 1 },
        next: 'role_lantern_after',
      },
      {
        label: '问阿尔文',
        setChoice: 'lantern_alvin',
        effects: { exp: { knowledge: 1, nature: 1 } },
        next: 'role_lantern_after',
      },
    ],
    next: () => 'role_lantern_after',
  },
  role_lantern_after: {
    id: 'role_lantern_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [
        callback[0] ?? '灯亮起来了。',
        '你从梯子上下来，米娅把梯子往墙边收。拐角的灯亮着，风过去时只晃了一下。',
        ...(data.changming.prep === 2
          ? ['你之前试过这盏灯，知道拐角有风。你没有急着点火，先把灯罩侧了一点。']
          : []),
      ]
    },
    next: () => 'free_choice',
  },
  role_keeper: {
    id: 'role_keeper',
    text: () => [
      '主灯比别的灯都高。风从门廊穿过来，火苗往一边倒。',
      '你站在主灯旁边，能感觉到灯罩散出来的热。火没有灭，但一直稳不下来。',
      '阿尔文说过，别用手直接挡光。你侧过身，把肩膀对着风来的方向，火苗低了一下，又慢慢直起来。',
      '格里高利搬着梯子从旁边经过，看了一眼，说：“别离人。”他没有停，把梯子放到廊下就走了。',
      '前庭的人来来去去，有人从主灯旁边经过，带起一阵风。你往旁边挪了半步，火苗跟着晃。',
      '米娅从台阶那边走过来，问你要不要喝水。你说不用，她就把杯子放在你够得到的地方，没有再多问。',
      '主灯的火照着你脚边一小块石板。你站了一会儿，开始能分辨风从哪一道门进来。',
      '米娅没有走远。她在台阶边坐下，把杯子放在脚边，像是打算陪你站一会儿。',
      '台阶下有个学生问她主灯会不会灭。米娅说不会，只要有人在这里。',
    ],
    choices: () => [
      {
        label: '侧身挡风',
        setChoice: 'keeper_shield',
        effects: { exp: { will: 2 } },
        next: 'role_keeper_after',
      },
      {
        label: '找挡风布，卢卡帮忙',
        setChoice: 'keeper_luca',
        effects: { affinity: { luca: 1 }, mood: 1 },
        next: 'role_keeper_after',
      },
      {
        label: '叫格里高利',
        setChoice: 'keeper_gregory',
        effects: { exp: { knowledge: 1, will: 1 } },
        next: 'role_keeper_after',
      },
    ],
    next: () => 'role_keeper_after',
  },
  role_keeper_after: {
    id: 'role_keeper_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [
        callback[0] ?? '主灯稳下来了。',
        '你退开半步，又看了一会儿。主灯的火没有再往一边倒。',
        ...(data.changming.prep === 2
          ? ['你之前练过这个角度。侧身的时候不用想，火苗只偏了一下。']
          : []),
      ]
    },
    next: () => 'free_choice',
  },
  role_storyteller: {
    id: 'role_storyteller',
    text: () => [
      '讲堂里的椅子围成半圈。你站在前面，旧册子摊在手里。',
      '伊莲娜坐在最后一排。米娅和卢卡在前排，米娅用口型说了句什么，卢卡轻轻碰了她一下，让她别打岔。',
      '你从今晚的灯讲起，讲到学院早年的冬天。有人问：“那时候也点灯吗？”',
      '你翻到夹着书签的那一页。上面写着，最早的学生几个人共用一盏灯，灯放在桌子中间，谁要写字，就把本子往灯边挪。',
      '有人问那灯够不够亮。你说不够，所以大家写字都很快。前排有人笑了一声。',
      '伊莲娜没有笑，也没有提醒你继续。她只是看着你，等你自己决定下一句。',
      '讲堂里安静下来。你听见自己翻页的声音，也听见后排有人轻轻挪了一下椅子。',
      '你抬起头，看见米娅没有在打岔，卢卡也没有看别处。他们都在等你说下去。',
      '你翻到下一页，发现后面是空的。你停下来，等自己决定要不要往下讲。',
    ],
    choices: () => [
      {
        label: '自己讲完学院旧事',
        setChoice: 'storyteller_history',
        effects: { exp: { knowledge: 2 } },
        next: 'role_storyteller_after',
      },
      {
        label: '让米娅上来补充',
        setChoice: 'storyteller_mia',
        effects: { affinity: { mia: 1 }, mood: 1 },
        next: 'role_storyteller_after',
      },
      {
        label: '请伊莲娜接着讲',
        setChoice: 'storyteller_elena',
        effects: { exp: { knowledge: 1 }, mood: 1 },
        next: 'role_storyteller_after',
      },
    ],
    next: () => 'role_storyteller_after',
  },
  role_storyteller_after: {
    id: 'role_storyteller_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [
        callback[0] ?? '你把那一段讲完了。',
        '你合上册子，发现自己的手还按在书页上。讲堂里有人开始小声说话。',
        ...(data.changming.prep === 2
          ? ['你之前把这段故事讲给自己听过一遍。今晚开口的时候，句子比之前顺。']
          : []),
      ]
    },
    next: () => 'free_choice',
  },
  role_watch: {
    id: 'role_watch',
    text: () => [
      '西侧走廊比前庭冷。灯罩里的火很小，风从窗缝里进来。',
      '你从东往西走，一盏一盏看过去。有一扇窗关得严，有一扇只是虚掩，还有一扇关不严。',
      '那扇关不严的窗在走廊中段。你推了一下，窗框响了一声，又弹回来。',
      '你把手放在窗框上，能感觉到风从合页那边漏进来。走廊里的灯照着窗台，上面有一层细灰。',
      '格里高利在走廊尽头。楼下偶尔有人经过，脚步声从楼梯口传上来。',
      '前庭的声音从远处传来，有人在笑，有人在叫名字。走廊里只有风和你自己的脚步。',
      '你把松掉的窗记在心里，又试了试旁边那一扇。',
      '卢卡从楼梯口走过来，手里提着一盏灯。他没有问你在做什么，只把灯举高，替你照亮窗框。',
    ],
    choices: () => [
      {
        label: '自己用力关窗',
        setChoice: 'watch_self',
        effects: { exp: { physique: 2 } },
        next: 'role_watch_after',
      },
      {
        label: '叫卢卡帮忙',
        setChoice: 'watch_luca',
        effects: { affinity: { luca: 1 }, mood: 1 },
        next: 'role_watch_after',
      },
      {
        label: '去告诉格里高利',
        setChoice: 'watch_gregory',
        effects: { exp: { knowledge: 1 }, mood: 1 },
        next: 'role_watch_after',
      },
    ],
    next: () => 'role_watch_after',
  },
  role_watch_after: {
    id: 'role_watch_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [
        callback[0] ?? '窗关上了。',
        '你回到前庭时，身上的凉气还没有散。主灯的光从门廊那边照过来。',
        ...(data.changming.prep === 2
          ? ['你之前走过一遍这条走廊。哪扇窗容易关不严，你已经记住了。']
          : []),
      ]
    },
    next: () => 'free_choice',
  },
  role_singer: {
    id: 'role_singer',
    text: () => [
      '前庭的灯已经亮齐。学生围在台阶前，米娅起了一个调。',
      '卢卡跟着低声唱，有人跟不上，声音乱了一下。米娅没有停，只把调子压低了半度。',
      '伊莲娜站在台阶边，没有打断，只等你们自己找回调子。',
      '你听见自己的声音和米娅的贴在一起，又和卢卡的分开。唱到中间，有人从后面跟上来，声音越来越多。',
      '台阶下有个学生一直没开口，只看着别人的嘴。米娅唱到一半的时候，他试着跟了一句，声音很小。',
      '最后一句之前，有人吸了一口气。前庭里安静了一瞬，连灯纸的响声都听得见。',
      '她把手垂在身侧，没有打拍子。她只是在听。',
      '第二遍唱到一半，后面的人已经能跟上。米娅没有回头，只把声音放稳了一点。',
    ],
    choices: () => [
      {
        label: '自己把调子接下去',
        setChoice: 'singer_self',
        effects: { exp: { will: 2 } },
        next: 'role_singer_after',
      },
      {
        label: '和米娅一起领',
        setChoice: 'singer_mia',
        effects: { affinity: { mia: 1 }, mood: 1 },
        next: 'role_singer_after',
      },
      {
        label: '请伊莲娜帮你们起调',
        setChoice: 'singer_elena',
        effects: { exp: { knowledge: 1 }, mood: 1 },
        next: 'role_singer_after',
      },
    ],
    next: () => 'role_singer_after',
  },
  role_singer_after: {
    id: 'role_singer_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [
        callback[0] ?? '最后一句唱完了。',
        '唱完以后，前庭里没有人立刻说话。过了一会儿，才有人鼓起掌来。',
        ...(data.changming.prep === 2
          ? ['你之前和米娅、卢卡合过一次。今晚开口的时候，不需要先听别人。']
          : []),
      ]
    },
    next: () => 'free_choice',
  },
  role_logistics: {
    id: 'role_logistics',
    text: () => [
      '食堂的锅还温着。你把杯子摆上托盘，杯口冒着白汽。',
      '杯子是从架子上临时凑的，大小不一样。你把高的放在中间，矮的放在边上，免得走路时倒。',
      '前庭、走廊、讲堂都有人。热饮只有一托盘，先送给谁，是你今晚要决定的事。',
      '米娅在门口等你，卢卡把最后一只杯子放上来。他把一块干布垫在托盘底下，说这样不会滑。',
      '托盘比刚才沉。你把手放在底下，试着走了一步，杯子轻轻碰在一起。',
      '食堂门口有一道门槛。你抬脚的时候，杯口的热气扑到脸上，眼睛稍微眯了一下。',
      '米娅替你推开门。外面的风灌进来，白汽被吹散了一瞬。',
      '走廊里没有人，只有灯。你端着托盘往前走，杯口的热气在灯光里看得见。',
      '走到拐角时，你放慢脚步。杯子没有碰响，托盘也没有歪。',
    ],
    choices: () => [
      {
        label: '自己先送主灯',
        setChoice: 'logistics_main',
        effects: { exp: { will: 2 } },
        next: 'role_logistics_after',
      },
      {
        label: '和米娅一起送',
        setChoice: 'logistics_mia',
        effects: { affinity: { mia: 1 }, mood: 1 },
        next: 'role_logistics_after',
      },
      {
        label: '跑两趟，先送走廊再回前庭',
        setChoice: 'logistics_run',
        effects: { exp: { physique: 2 } },
        next: 'role_logistics_after',
      },
    ],
    next: () => 'role_logistics_after',
  },
  role_logistics_after: {
    id: 'role_logistics_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      return [
        callback[0] ?? '你把杯子送到了。',
        '你回到食堂时，托盘上只剩一只空杯。锅里的水还在响。',
        ...(data.changming.prep === 2
          ? ['你之前空手走过一遍路线。今晚端着托盘，也知道该先拐哪边。']
          : []),
      ]
    },
    next: () => 'free_choice',
  },

  free_choice: {
    id: 'free_choice',
    text: (data) => [
      data.changming.freeVisits.length === 0
        ? '你回到前庭。灯还亮着，你还有一点时间，可以再去一个地方。'
        : '你回到前庭。灯还亮着，你还可以再去一个地方，也可以留在这里等大家。',
    ],
    choices: (data) => {
      if (data.changming.freeVisits.length >= 2) return []
      const remaining = Object.keys(freeInfo).filter(
        (id) => !data.changming.freeVisits.includes(id),
      )
      const options: ChangmingChoice[] = remaining.map((id) => ({
        label: freeInfo[id].label,
        effects: freeInfo[id].effects,
        addFreeVisit: id,
        next: id,
      }))
      if (data.changming.freeVisits.length === 1) {
        options.push({ label: '回前庭等大家', next: incidentFor(data) })
      }
      return options
    },
    next: (data) => incidentFor(data),
  },
  free_lecture: {
    id: 'free_lecture',
    text: () => freeInfo.free_lecture.text,
    next: freeNext,
  },
  free_courtyard: {
    id: 'free_courtyard',
    text: () => freeInfo.free_courtyard.text,
    next: freeNext,
  },
  free_corridor: {
    id: 'free_corridor',
    text: () => freeInfo.free_corridor.text,
    next: freeNext,
  },
  free_canteen: {
    id: 'free_canteen',
    text: () => freeInfo.free_canteen.text,
    next: freeNext,
  },

  incident_wind: {
    id: 'incident_wind',
    text: () => [
      '风从门廊穿过来，主灯的火苗压得很低，最后灭了一下。',
      '前庭暗了一小块。有人“啊”了一声，随即又安静下来。回廊里的灯还亮着，光从侧面照过来，把主灯的影子投在石板上。',
      '米娅在你旁边，手里还端着半杯水。卢卡从走廊那头跑过来，在台阶前停住。阿尔文已经站在主灯旁边，没有伸手，先看风从哪边来。',
      '有人往后退，有人往前凑。格里高利把靠墙的木板踢正，让它挡住门廊那边的风。',
      '主灯的火只剩下一点。你听见灯纸被风吹得响，像有人在很近的地方翻书。',
      '阿尔文没有急着点火。他先抬手让周围的人退开，等门廊那边的风小下去。',
      '米娅把杯子放到地上，腾出手来扶住灯罩。卢卡站在台阶边，替后面的人挡住往前挤的脚步。',
      '阿尔文让你站到主灯另一侧。他没有解释为什么，只用手示意了一下。',
      '你照做，风从你背后过去，主灯的影子晃了晃，火苗没有跟着动。',
      '前庭里有人屏住呼吸。你听见灯纸轻轻响，像在等一个结果。',
      '主灯旁边的光很暗，但你没有退开。',
    ],
    choices: () => [
      {
        label: '自己护住主灯，重新点',
        setIncident: 'wind_self',
        effects: { exp: { will: 2 } },
        next: 'incident_wind_after',
      },
      {
        label: '调整灯罩和灯芯',
        setIncident: 'wind_adjust',
        effects: { exp: { nature: 2 } },
        next: 'incident_wind_after',
      },
      {
        label: '请阿尔文接手',
        setIncident: 'wind_teacher',
        effects: { exp: { knowledge: 1 }, mood: 1 },
        next: 'incident_wind_after',
      },
    ],
    next: () => 'incident_wind_after',
  },
  incident_wind_after: {
    id: 'incident_wind_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      const incidentText =
        incident(data) === 'wind_self'
          ? ['你侧过身，把火护在里侧，重新点了一次。主灯亮起来，火比刚才稳。']
          : incident(data) === 'wind_adjust'
            ? ['你把灯罩转了一点，让风从旁边过去。火苗低了一下，又直起来。']
            : ['阿尔文伸手把灯罩重新扣好。格里高利把木板挪到风口。']
      return [
        callback[1] ?? callback[0] ?? '你站在主灯旁边，没有走开。',
        ...incidentText,
        '前庭重新亮起来。有人继续说话，声音比刚才低了一点。',
        '阿尔文把手收回去，说：“记住刚才风从哪边来。”',
        '米娅把杯子从地上拿起来，长出一口气。卢卡站在台阶边，确认主灯不会再晃，才往后退开。',
        '前庭里有人重新开始说话。刚才那一下像没有发生过，只有主灯旁边的木板还挡在原处。',
        '有人把地上的杯子捡起来，递给旁边的人。杯子没有碎。',
        '主灯稳定下来以后，伊莲娜才从台阶上走开。她没有说刚才谁做得对，只让各人回到自己的位置。',
        '你退开时，阿尔文看了你一眼。他没有点头，但也没有再说什么。',
      ]
    },
    next: () => 'ending',
  },
  incident_classmate: {
    id: 'incident_classmate',
    text: () => [
      '一个同班同学站在窗下，手里拿着火柴，点了两次都没点着。',
      '他够不到灯罩，手有点抖。旁边的人在说话，没人注意他。',
      '你走近了一点，看见灯芯是干的，火柴也没潮。他只是手不稳。',
      '窗台上放着一盏还没挂好的灯，灯纸的一角垂下来。他每次把火凑过去，风就刚好从窗缝里进来。',
      '他看见你，愣了一下，把火柴往身后藏了藏。',
      '你听见前庭那边有人在叫好，声音离这里很远。窗下的灯还是暗的，灯纸被风掀起一角。',
      '他小声说，他只是想自己点一次。说完又觉得这句话没什么用，低下头去看手里的火柴。',
      '你没有马上说话。窗下的风一阵一阵，灯纸被吹得贴住灯骨，又松开。',
      '他把火柴盒打开又合上，里面的火柴只剩两根。',
      '火柴盒的边角已经磨得起了毛，像是被攥了很久。',
      '窗下的风没有刚才那么急了。灯纸垂下来，贴住灯骨。',
    ],
    choices: () => [
      {
        label: '陪他站一会儿，让他自己点',
        setIncident: 'classmate_stay',
        effects: { mood: 2 },
        next: 'incident_classmate_after',
      },
      {
        label: '帮他扶梯子 / 递火',
        setIncident: 'classmate_help',
        effects: { exp: { physique: 1 }, mood: 1 },
        next: 'incident_classmate_after',
      },
      {
        label: '去叫伊莲娜',
        setIncident: 'classmate_teacher',
        effects: { exp: { knowledge: 1 }, mood: 1 },
        next: 'incident_classmate_after',
      },
    ],
    next: () => 'incident_classmate_after',
  },
  incident_classmate_after: {
    id: 'incident_classmate_after',
    text: (data) => {
      const callback = roleChoiceText[choice(data) ?? ''] ?? []
      const incidentText =
        incident(data) === 'classmate_stay'
          ? ['你没有接火柴，只站在旁边。他点第三次的时候，手稳了。', '灯亮起来，他小声说了一句谢谢。']
          : incident(data) === 'classmate_help'
            ? ['你扶住梯子，他把火凑上去。灯纸亮了一下，着了。', '他说了一句谢谢，声音很小。']
            : ['伊莲娜走过来，没有问为什么，只把灯罩抬高了一点。', '灯亮了。他站在旁边，手还攥着火柴。']
      return [
        callback[1] ?? callback[0] ?? '你在窗下站了一会儿。',
        ...incidentText,
        '他把火柴收进口袋，又回头看了一眼那盏灯。',
        '前庭那边有人在叫他的名字。他应了一声，走了两步，又停下来等你。',
        '你们一起往回走。他没有再提刚才的事，只问你今晚是不是也要早点回去。',
        '前庭的灯从回廊尽头照过来，把两个人的影子拉在身后。',
        '走到台阶前，他停下来，把那盏灯交给你，说你拿回去照路。',
        '你接过灯，灯罩比你想象的轻。他已经往前走了几步，又回头确认你跟上了。',
      ]
    },
    next: () => 'ending',
  },
  ending: {
    id: 'ending',
    text: (data) => {
      const current = role(data)
      const teacher = current ? teacherEnding[current] : '伊莲娜站在台阶边，说：“你今晚也在这里。这样就好。”'
      return [
        '所有人回到前庭。主灯还亮着。风小了，有人开始收杯子。',
        '长桌被抬回食堂，桌脚在石阶上磕了一下。有人弯腰去捡掉在地上的灯纸，捡起来看了看，又放回桌上。',
        '主灯旁边的木板还没有收。格里高利说今晚先留着，明天再搬。',
        '伊莲娜让学生把没有烧完的灯纸收进篮子，不要留在窗台上。有人把写过的纸折好，自己收进口袋。',
        '阿尔文最后检查了一遍主灯，把灯罩扣紧。他经过你身边时，停了一下，没有说话，只点了一下头。',
        '有人问主灯今晚会不会灭。阿尔文说，等人都走了再灭。',
        teacher,
        '米娅把最后一只杯子摞好，朝主灯抬了抬下巴：“明年还点吗？”',
        '“明年还在。”卢卡说。他手里还拿着半张灯纸，说完才把它放进篮子。',
        '学生们三三两两地散了。回廊里的灯一盏盏灭下去，只剩主灯和前庭这一圈还亮着。',
        '米娅把篮子拎回食堂，走到一半又回头，朝你挥了一下手。卢卡跟在她后面，顺手把廊下的一盏灯扶正。',
        '前庭里只剩下几个人。有人把长桌的凳子一张张翻上去，准备明天再收。',
        '有人在台阶上坐下，把没写完的灯纸摊在膝盖上。伊莲娜没有催他，只把台阶边的灯往他那边挪了挪。',
        '你把手里的灯纸折好，放进口袋。纸边还带着一点灯罩的温度。',
        '前庭的灯没有刚才那么多了，但主灯还亮着。回廊里有人提着灯往宿舍走，光一点一点远下去。',
        '你站了一会儿，直到前庭里只剩主灯和几盏小灯。风从门廊过来，灯没有灭。',
        '你回头看了一眼主灯，前庭的窗一扇一扇亮着。',
      ]
    },
    close: true,
  },
}

/**
 * 场景图的静态边。动态 next 与选项 next 都列在这里，供内容校验使用。
 */
export const CHANGMING_LINKS: Record<string, string[]> = {
  prep_lantern: ['prep_done'],
  prep_keeper: ['prep_done'],
  prep_storyteller: ['prep_done'],
  prep_watch: ['prep_done'],
  prep_singer: ['prep_done'],
  prep_logistics: ['prep_done'],
  prep_done: [],
  prep_again: [],
  arrival: ['lighting'],
  lighting: ['lighting_after'],
  lighting_after: ['gathering'],
  gathering: [
    'role_lantern',
    'role_keeper',
    'role_storyteller',
    'role_watch',
    'role_singer',
    'role_logistics',
    'guest',
  ],
  arrival_late: ['late_lighting'],
  late_lighting: ['late_lighting_after'],
  late_lighting_after: ['gathering'],
  guest: ['guest_after'],
  guest_after: ['free_choice'],
  role_lantern: ['role_lantern_after'],
  role_lantern_after: ['free_choice'],
  role_keeper: ['role_keeper_after'],
  role_keeper_after: ['free_choice'],
  role_storyteller: ['role_storyteller_after'],
  role_storyteller_after: ['free_choice'],
  role_watch: ['role_watch_after'],
  role_watch_after: ['free_choice'],
  role_singer: ['role_singer_after'],
  role_singer_after: ['free_choice'],
  role_logistics: ['role_logistics_after'],
  role_logistics_after: ['free_choice'],
  free_choice: [
    'free_lecture',
    'free_courtyard',
    'free_corridor',
    'free_canteen',
    'incident_wind',
    'incident_classmate',
  ],
  free_lecture: ['free_choice', 'incident_wind', 'incident_classmate'],
  free_courtyard: ['free_choice', 'incident_wind', 'incident_classmate'],
  free_corridor: ['free_choice', 'incident_wind', 'incident_classmate'],
  free_canteen: ['free_choice', 'incident_wind', 'incident_classmate'],
  incident_wind: ['incident_wind_after'],
  incident_wind_after: ['ending'],
  incident_classmate: ['incident_classmate_after'],
  incident_classmate_after: ['ending'],
  ending: [],
}

export { prepExp }

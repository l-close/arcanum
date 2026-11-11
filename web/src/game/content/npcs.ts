// arcanum: npcs
import { SUMMER_RITE_DAY, WINTER_RITE_DAY } from './life'

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

export const NPCS: NpcDef[] = [
  {
    id: 'mia',
    name: '米娅·罗兰',
    short: '米娅',
    title: '同学',
    schedule: [
      { location: 'chapel', days: 'all', start: 18 * 60, end: 21 * 60, chance: 0.6, onlyDay: WINTER_RITE_DAY },
      { location: 'chapel', days: 'all', start: 19 * 60, end: 22 * 60, chance: 0.6, onlyDay: SUMMER_RITE_DAY },
      { location: 'chapel', days: 'sunday', start: 9 * 60, end: 11 * 60, chance: 0.4 },
      { location: 'canteen', days: 'all', start: 11 * 60 + 30, end: 12 * 60 + 30, only: 'school' },
      { location: 'commercial', days: 'all', start: 14 * 60, end: 17 * 60, chance: 0.7, only: 'vacation' },
    ],
    status: '她把面包撕成小块，腿在桌下轻轻晃。',
    impression: {
      far: '同班同学，还没说过几句话',
      familiar: '算得上朋友了',
      close: '无话不谈的同伴',
    },
    lines: {
      far: [
        '今天的课你听懂了？我一半都没听进去。',
        '你是那个刚入学的吧。食堂的炖菜别抱太大期望。',
        '演武场下午人多，想练的话早点去。',
        '有事？没事的话我先把这盘吃完。',
      ],
      familiar: [
        '你来得正好，帮我看看这个动作对不对。',
        '我跟你说，卢卡昨天又在藏书阁待到关门，他以为没人知道。',
        '别老闷着，吃完饭去演武场走两圈。',
        '你最近是不是又没好好吃饭？',
      ],
      close: [
        '……你坐近点。算了，也没什么，就是想让你坐近点。',
        '以后要是有人找你麻烦，报我名字。虽然不一定有用。',
        '我以前觉得学院里的人都挺没意思的，你不太一样。',
        '下次休息日，陪我去商业区逛逛？就逛逛。',
      ],
    },
  },
  {
    id: 'luca',
    name: '卢卡·维恩',
    short: '卢卡',
    title: '同学',
    schedule: [
      { location: 'chapel', days: 'all', start: 18 * 60, end: 21 * 60, chance: 0.5, onlyDay: WINTER_RITE_DAY },
      { location: 'chapel', days: 'all', start: 19 * 60, end: 22 * 60, chance: 0.5, onlyDay: SUMMER_RITE_DAY },
      { location: 'chapel', days: 'sunday', start: 9 * 60, end: 11 * 60, chance: 0.3 },
      { location: 'library', days: 'workday', start: 7 * 60 + 30, end: 8 * 60 + 30, only: 'school' },
      { location: 'library', days: 'workday', start: 18 * 60, end: 19 * 60, only: 'school' },
      { location: 'library', days: 'weekend', start: 9 * 60, end: 10 * 60, only: 'school' },
      { location: 'library', days: 'weekend', start: 14 * 60, end: 15 * 60, only: 'school' },
      { location: 'library', days: 'weekend', start: 20 * 60, end: 21 * 60, only: 'school' },
      { location: 'library', days: 'all', start: 9 * 60, end: 11 * 60, chance: 0.8, only: 'vacation' },
      { location: 'commercial', days: 'all', start: 14 * 60, end: 16 * 60, chance: 0.7, only: 'vacation' },
      { location: 'library', days: 'all', start: 19 * 60, end: 21 * 60, chance: 0.75, only: 'vacation' },
    ],
    status: '他背对着门口，桌上摊着两本书。',
    impression: {
      far: '安静的同学',
      familiar: '勉强算熟人',
      close: '难得的信任',
    },
    lines: {
      far: [
        '这本书的注释是错的。',
        '别挡光。',
        '藏书阁里说话小声点。',
        '你要找的书在最里面那排。',
      ],
      familiar: [
        '别跟别人说，我昨晚在藏书阁待到关门。',
        '这次的测验，你多少分？……随口问问。',
        '这本借你。别弄折页。',
        '我不喜欢输。就这么简单。',
      ],
      close: [
        '……你坐这边吧。这里安静。',
        '上次的事，谢谢。别让我说第二遍。',
        '如果哪天我超过你了，你不许不高兴。',
        '我家里……算了，以后再说。',
      ],
    },
  },
  {
    id: 'nora',
    name: '诺拉·霍尔',
    short: '诺拉',
    title: '院长',
    schedule: [
      { location: 'chapel', days: 'all', start: 18 * 60, end: 21 * 60, chance: 1, onlyDay: WINTER_RITE_DAY },
      { location: 'chapel', days: 'all', start: 19 * 60, end: 22 * 60, chance: 1, onlyDay: SUMMER_RITE_DAY },
      { location: 'chapel', days: 'sunday', start: 9 * 60, end: 11 * 60, chance: 1 },
      { location: 'office', days: 'all', start: 6 * 60 + 30, end: 21 * 60 + 30, chance: 0.95 },
    ],
    status: '她正低头核对册子，笔尖停在半空。',
    impression: {
      far: '把你养大的人',
      familiar: '像家人一样',
      close: '她把你当自己的孩子',
    },
    lines: {
      far: [
        '今天账上终于没赤字了。',
        '别总熬夜。',
        '钱够不够？不够就说。',
        '孩子们今天又把柴火堆弄塌了。',
      ],
      familiar: [
        '你今天脸色不好，是不是没吃饭？',
        '别学我，什么事都自己扛。',
        '学院的课跟得上吗？跟不上也别硬撑。',
        '这周的账我算了两遍，还是差一点。',
      ],
      close: [
        '……你小时候也这样，摔了不哭，自己爬起来。',
        '这个家不大，但总有你一间房。',
        '我没什么能给你的。你别嫌少。',
        '要是有一天你不想待在这儿了，跟我说一声就行。',
      ],
    },
  },
  {
    id: 'greta',
    name: '格蕾塔·霍恩',
    short: '格蕾塔',
    title: '酒馆老板娘',
    relationship: 'familiarity',
    schedule: [{ location: 'tavern', days: 'all', start: 17 * 60, end: 4 * 60 }],
    status: '她正擦着杯子，抬眼看你一下。',
    impression: {
      far: '酒馆老板娘，还没记住你的名字',
      familiar: '开始把你当熟客',
      close: '记得你的口味',
    },
    lines: {
      far: [
        '第一次来？位置自己找。',
        '麦酒两铜，蜂蜜水也两铜。',
        '打烊前半小时别点热食。',
        '你看起来不像常喝酒的。',
      ],
      familiar: [
        '又来了。老位置还空着。',
        '今天走了一天？先坐下。',
        '别光喝水，吃点东西。',
        '你朋友刚才也来过。',
      ],
      close: [
        '你的杯子我留着。',
        '这杯算我的。别声张。',
        '要是遇到麻烦，先来这儿。',
        '你比刚来的时候话多了点。',
      ],
    },
  },
  {
    id: 'august',
    name: '奥古斯特·瓦尔',
    short: '奥古斯特',
    title: '药剂工坊主人',
    relationship: 'familiarity',
    schedule: [{ location: 'potionWorkshop', days: 'all', start: 8 * 60, end: 20 * 60 }],
    status: '他正低头看一张订单，手指在桌面上敲了两下。',
    impression: {
      far: '工坊主人，忙着看订单',
      familiar: '开始记得你上一批药的质量',
      close: '愿意和你多谈两句配方',
    },
    lines: {
      far: [
        '订单放柜台上。急单不接。',
        '你挡光了。',
        '这锅火候不对。谁看的火？',
        '买药剂去柜台，找莉薇娅。',
      ],
      familiar: [
        '上次那批止血膏，收得还行。',
        '别省火。省下来的时间，后面要还。',
        '今天的单子多，手脚麻利点。',
        '你手稳了。再练练火候。',
      ],
      close: [
        '配方不是藏起来的。看懂了，就是你的。',
        '我年轻时也把一锅药熬糊过。别声张。',
        '莉薇娅比我更会跟人打交道。',
        '你要真想做这行，先把眼睛练出来。',
      ],
    },
  },
  {
    id: 'livia',
    name: '莉薇娅·瓦尔',
    short: '莉薇娅',
    title: '药剂工坊柜台',
    schedule: [
      { location: 'potionWorkshop', days: 'all', start: 10 * 60, end: 18 * 60, chance: 0.75 },
    ],
    status: '她把一叠订单按顺序码好，抬眼看你。',
    impression: {
      far: '工坊柜台，做事很利落',
      familiar: '开始把你当成熟面孔',
      close: '愿意和你多说几句工坊的事',
    },
    lines: {
      far: [
        '订单放这里。急单要加钱。',
        '师傅在里间。小事跟我说。',
        '学徒在左边，临时工在右边。别走错。',
        '你第一次来？名字写在这张单子上。',
      ],
      familiar: [
        '今天人手紧，你来得正好。',
        '托比亚斯说你手稳了不少。',
        '师傅记得你上一批药，不记得你名字。别介意。',
        '柜台这边我来。你去帮托比亚斯吧。',
      ],
      close: [
        '我父亲只谈配方。跟人打交道的事，归我。',
        '这间工坊看着乱，其实每一单都排得很清楚。',
        '你要是想学，别只盯着锅。也看看单子怎么写。',
        '……你比我认识的多数学徒都稳。',
      ],
    },
  },
  {
    id: 'tess',
    name: '苔丝·诺德',
    short: '苔丝',
    title: '植物学者',
    relationship: 'familiarity',
    schedule: [{ location: 'greenhouse', days: 'all', start: 8 * 60, end: 20 * 60 }],
    status: '她正蹲在砖台边，把一盆银叶草挪到光下。',
    impression: {
      far: '温室里的植物学者',
      familiar: '开始记得你认对了哪些草',
      close: '愿意让你碰她留种的那几盆',
    },
    lines: {
      far: [
        '小心脚下，砖台边滑。',
        '买药草去柜台。辨认的事，等我把手擦干。',
        '你身上有炼药室的味道。',
        '赛拉上周送来的苦叶，长得比我自己留的还快。',
      ],
      familiar: [
        '你来得正好。这盆银叶草今早开了，叶背比昨天亮。',
        '赛拉总说我浇水太随性。她来一趟，要念我半天。',
        '别急着认叶子。先看它朝着哪边长。',
        '我刚才在跟它说话。别笑。你也一样，缺水的时候叶子会卷。',
      ],
      close: [
        '这盆是我刚来银月城那年种的。那时候温室还只有半间。',
        '赛拉以前总说我种得太随意。后来她自己试了一回，就不说了。',
        '后头那扇门，你别去拧。不是防你，是里面还没收拾好。',
        '你站这儿别动。让我看看……嗯，气色比上个月好。',
      ],
    },
  },
  {
    id: 'silas',
    name: '赛拉斯·洛克',
    short: '赛拉斯',
    title: '符文师',
    relationship: 'familiarity',
    schedule: [{ location: 'runeShop', days: 'all', start: 10 * 60, end: 20 * 60 }],
    status: '他正低头看一块刻到一半的铜片，刻刀停在半空。',
    impression: {
      far: '符文工坊的匠人，话不多',
      familiar: '开始记得你拿来的装备',
      close: '愿意让你看没刻完的活',
    },
    lines: {
      far: [
        '东西放台上。急单不接。',
        '刻刀别碰。碰歪了，一整天白干。',
        '要刻什么，想清楚再说。',
        '你这把剑用过很久了。刃口都磨圆了。',
      ],
      familiar: [
        '上次那道锋刃，你用得还顺手？',
        '刻坏了就扔。留着也是害人。',
        '别只看花纹。看它能不能让东西记住该做什么。',
        '你手比上次稳了。刻印不是力气活。',
      ],
      close: [
        '我年轻时也刻坏过一整批。后来就学会了先停手。',
        '这间工坊小，但每一道刻痕我都记得。',
        '你要是想学，先从磨刻刀开始。别急着碰铜片。',
        '有些东西刻上去就磨不掉了。所以下刀前想清楚。',
      ],
    },
  },
  {
    id: 'eve',
    name: '伊芙·卡伦',
    short: '伊芙',
    title: '星象师',
    relationship: 'familiarity',
    schedule: [{ location: 'observatory', days: 'all', start: 19 * 60, end: 3 * 60 }],
    status: '她正抬头看天，手里的星图摊在桌上。',
    impression: {
      far: '城门上的星象师',
      familiar: '开始记得你上次看的是哪颗星',
      close: '愿意把没写完的星图给你看',
    },
    lines: {
      far: [
        '天还没黑透。再等一会儿。',
        '看星可以。别碰望远镜。',
        '你身上有城里的灯油味。刚从街上过来？',
        '今晚云不厚，能看见几颗。',
      ],
      familiar: [
        '你上次问的那颗，在西边。现在还没升上来。',
        '星星不预示什么。它们只是告诉你，季节走到哪儿了。',
        '城里的人只在过节时抬头。平时没人看。',
        '别急着记名字。先记住它旁边那颗。',
      ],
      close: [
        '我小时候在船上认星。那时候没有星图，只有天。',
        '你看，那颗今晚比昨天亮。不是它变了，是空气变了。',
        '有一天你离开银月城，抬头还能看见它们。',
        '……你坐这儿吧。风小一点。',
      ],
    },
  },
]

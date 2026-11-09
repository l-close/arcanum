import type { SkillKey } from './types'

export type StoryEffects = {
  stamina?: number
  spirit?: number
  mood?: number
  mana?: number
  money?: number
  exp?: Partial<Record<SkillKey, number>>
  affinity?: Record<string, number>
  flag?: string
  time?: number
  location?: string
}

export type StoryChoice = {
  label: string
  reply: string[]
  effects?: StoryEffects
  next?: number
}

export type StoryScene = {
  id: string
  time: number
  location: string
  duration?: number
  text: string[]
  choices?: StoryChoice[]
  continueLabel?: string
  next?: number
  sleep?: boolean
}

export const STORY: StoryScene[] = [
  {
    id: 'prologue',
    time: 7 * 60 + 30,
    location: 'dorm',
    text: [
      '十岁那年的事，你已经不记得了。',
      '你只知道，是诺拉修女在城外的雾里发现了你。',
      '四年过去，你十四岁。今天，你要去长明学院报到。',
    ],
    continueLabel: '开始第一天',
    next: 1,
  },
  {
    id: 'morning',
    time: 7 * 60 + 30,
    location: 'dorm',
    text: [
      '雾还没散。',
      '天光从窗帘缝里漏进来，灰白的一片。楼下传来碗碟碰撞的声音，还有孩子跑过走廊的脚步声。',
      '你坐起来，床板吱呀响了一声。',
      '床头放着一套叠好的衣服——孤儿院发的，洗得发白，但很干净。今天是入学第一天。',
      '楼梯口，诺拉修女抱着一本旧册子等你。她眼下有淡淡的青色，像是没睡好。',
      '“醒了？”她抬头，“先去吃饭。今天别迟到。”',
      '她合上册子，又想起什么：“还有——每周要还的钱，别忘了。”',
    ],
    choices: [
      {
        label: '“我知道。”',
        reply: ['诺拉点点头，没再多说。'],
        effects: { affinity: { nora: 1 } },
      },
      {
        label: '“能不能宽限几天？”',
        reply: ['“我也不是催你。只是账上不能一直空着。”她叹了口气。'],
        effects: { mood: -2 },
      },
      {
        label: '沉默地点头',
        reply: ['她多看了你一眼，把册子抱紧了些。'],
      },
    ],
    next: 2,
  },
  {
    id: 'breakfast',
    time: 7 * 60 + 45,
    location: 'orphanCanteen',
    duration: 30,
    text: [
      '食堂里已经坐了不少人。长桌上摆着面包、稀粥和一小碟盐。',
      '诺拉站在灶台边给最小的孩子分粥，袖子挽到手肘，额角被蒸汽熏得有点湿。',
      '你端着碗找了个空位。面包还剩最后几块，坐在你对面的是个七八岁的男孩，正盯着盘子看。',
    ],
    choices: [
      {
        label: '拿一块，吃饱',
        reply: ['你拿了一块面包，男孩移开了视线。'],
        effects: { stamina: 15 },
      },
      {
        label: '把最后一块推给他',
        reply: ['“你吃吧。”男孩愣了一下，小声说了句谢谢。'],
        effects: { stamina: 8, affinity: { nora: 2 } },
      },
      {
        label: '帮诺拉分粥',
        reply: ['你接过勺子，诺拉腾出手擦了擦额角。'],
        effects: { stamina: 10, affinity: { nora: 1 } },
      },
    ],
    next: 3,
  },
  {
    id: 'pack',
    time: 8 * 60 + 15,
    location: 'dorm',
    duration: 15,
    text: [
      '你回房间检查课本。册子很旧，边角卷起，是诺拉从教会的旧书堆里找出来的。',
      '楼下，诺拉叫住你，把一块用布包好的面包塞进你手里。',
      '“路上吃。”她说，“别迟到。”',
    ],
    continueLabel: '收好面包',
    next: 4,
  },
  {
    id: 'walk',
    time: 8 * 60 + 30,
    location: 'orphanage',
    duration: 5,
    text: [
      '你回房间收拾好课本。册子很旧，边角卷起。',
      '出门时，诺拉在门口叫住你，伸手替你理了理衣领。',
      '“路上小心。”',
      '雾散了一些，石板路还是湿的。你沿着孤儿院外的路往东走，经过中央广场，再往学院区。店铺刚开门，面包房飘出热气，有人把一桶水泼在门口的石板上。',
      '长明学院在坡上，石阶被晨露打湿。你走上去的时候，钟声正好响了一下。',
      '学院比你想的要安静。石墙修得整齐，墙根的藤蔓被修剪过，顺着墙面往上爬。',
      '正门上方刻着一行符号。不是通用文字，也不像你在教会见过的任何经文。你看了一会儿，没看出什么，便跟着人群往里走。',
    ],
    continueLabel: '继续',
    next: 5,
  },
  {
    id: 'literature',
    time: 9 * 60,
    location: 'lecture',
    duration: 120,
    text: [
      '讲堂里比外面暖。长桌一排排摆到窗边，十几个学生已经坐下，低声说着话。',
      '伊莲娜修女站在最前面，没有拿书。她看上去比诺拉还年轻，笑起来眼角弯弯的。',
      '“今天先不讲课本。”她说，“我想问你们一个问题。”',
      '她转身在黑板上写下两个字：归乡。',
      '“如果一个人离开家很多年，回来时发现一切都变了——他还算回家了吗？”',
      '教室里安静下来。有人低头翻书，有人看向窗外。',
    ],
    choices: [
      {
        label: '“算。人回来了，家就还在。”',
        reply: ['伊莲娜点点头，没有评价对错。'],
        effects: { exp: { knowledge: 3 }, affinity: { elena: 1 } },
      },
      {
        label: '“不算。家已经不是原来的家了。”',
        reply: ['她看了你一会儿，说：“这个答案很诚实。”'],
        effects: { exp: { knowledge: 3 }, affinity: { elena: 1 } },
      },
      {
        label: '不回答，听别人说',
        reply: ['米娅抢着说了什么，卢卡随后低声补充。你记住了这两张脸。'],
        effects: { exp: { knowledge: 2 } },
      },
    ],
    next: 6,
  },
  {
    id: 'lunch',
    time: 11 * 60,
    location: 'canteen',
    duration: 60,
    text: [
      '食堂里人很多，队伍从窗口一直排到门口。',
      '你端着餐盘找位置，忽然听见有人喊你的名字。',
      '“这里！”',
      '一个扎着短马尾的女生朝你挥手，桌上放着她的书和半块面包。',
      '“早上坐在窗边那个，对吧？”她笑了笑，“我叫米娅，米娅·罗兰。”',
      '她往旁边挪了挪，给你腾出位置。',
    ],
    choices: [
      {
        label: '“一起吧。”',
        reply: [
          '你坐下来。米娅立刻开始讲今天早上哪个老师看起来最不好惹。',
          '“理论课太无聊了，”她咬着面包，“我宁愿去演武场。”',
        ],
        effects: { affinity: { mia: 2 } },
      },
      {
        label: '“你怎么知道我的名字？”',
        reply: [
          '“名单上就那几个新面孔，看一眼就记住啦。”她理所当然地说。',
          '“理论课太无聊了，”她咬着面包，“我宁愿去演武场。”',
        ],
        effects: { affinity: { mia: 1 } },
      },
      {
        label: '“我想一个人吃。”',
        reply: ['米娅愣了一下，随即点点头：“哦，好。”她端着盘子走开了。'],
      },
    ],
    next: 7,
  },
  {
    id: 'magic',
    time: 13 * 60,
    location: 'lecture',
    duration: 120,
    text: [
      '下午的讲堂比上午安静。阿尔文·莱特站在讲台后，衣领扣到最上面一颗。',
      '他没有自我介绍，只在本子上写了一个名字，然后转过身。',
      '“今天只学一个法术。”他抬起右手，指尖亮起一小团白光，“引光。照明、信号、最基本的魔力控制，都从它开始。”',
      '光灭了。他放下手。',
      '“现在轮到你们。媒介拿出来，咒语三遍，手势不要省。”',
    ],
    choices: [
      {
        label: '按他说的做，一步一步来',
        reply: [
          '你照着步骤抬手、念咒。光比预想中早了一瞬亮起。',
          '阿尔文看了你一眼，什么也没说，在册子上记了一笔。',
          '下课前，他叫住你。“名字。”你说了。他写下，合上册子，没有再多问一个字。',
        ],
        effects: { exp: { nature: 3 } },
      },
      {
        label: '试着快一点',
        reply: [
          '你跳过了半个手势。这本该失败。',
          '咒语还没念完，光已经亮了。',
          '阿尔文看了你一眼，什么也没说，在册子上记了一笔。',
          '下课前，他叫住你。“名字。”你说了。他写下，合上册子，没有再多问一个字。',
        ],
        effects: { exp: { nature: 3 }, flag: 'talent_hint' },
      },
      {
        label: '先看别人怎么做',
        reply: [
          '米娅的光闪了两下就灭，卢卡很稳。轮到你时，光还是一下就亮了。',
          '阿尔文看了你一眼，在册子上记了一笔。',
          '下课前，他叫住你。“名字。”你说了。他写下，合上册子，没有再多问一个字。',
        ],
        effects: { exp: { nature: 2 }, flag: 'talent_hint' },
      },
    ],
    next: 8,
  },
  {
    id: 'pe',
    time: 15 * 60 + 30,
    location: 'yard',
    duration: 120,
    text: [
      '演武场在学院东侧，地面是压实的黄土，四周立着一圈木桩。',
      '格里高利·索恩站在场地中央，比周围的学生高出一个头。他脸上有一道旧疤，从左眉一直延伸到颧骨。',
      '没有人说话。',
      '“站好。”他说。声音不高，但整个场地都安静下来。',
      '他示范了一个最基础的架势：双脚分开，重心下沉，手抬到胸前。',
      '“学。”',
    ],
    choices: [
      {
        label: '照着他的样子站好',
        reply: [
          '你学得不算快，但没有偷懒。',
          '下课时，格里高利从你身边走过，停了一下。“明天还来。”他没有看你，说完就走了。',
        ],
        effects: { exp: { brawl: 3, physique: 1 } },
      },
      {
        label: '先看别人怎么站',
        reply: [
          '米娅站得歪歪扭扭，卢卡很稳。你照着卢卡的样子调整。',
          '下课时，格里高利从你身边走过，停了一下。“明天还来。”他没有看你，说完就走了。',
        ],
        effects: { exp: { brawl: 2, physique: 1 } },
      },
      {
        label: '站好后问他“这样对吗”',
        reply: [
          '他走过来，用一只手把你的肘部压低了一点：“再来。”',
          '下课时，格里高利从你身边走过，停了一下。“明天还来。”他没有看你，说完就走了。',
        ],
        effects: { exp: { brawl: 3, physique: 1 }, affinity: { gregory: 1 } },
      },
    ],
    next: 9,
  },
  {
    id: 'free',
    time: 17 * 60 + 30,
    location: 'yard',
    text: [
      '下课钟响过，学院里的人渐渐散了。',
      '离晚饭还有一个半小时。你可以去藏书阁看会儿书，也可以先回孤儿院，或者在学院里转转。',
    ],
    choices: [
      {
        label: '去藏书阁',
        reply: ['藏书阁比讲堂安静得多。你找了个靠窗的位置，把今天的课本翻开。'],
        effects: { exp: { knowledge: 2 }, stamina: -2, time: 18 * 60, location: 'library' },
      },
      {
        label: '回孤儿院帮忙',
        reply: [
          '你回到孤儿院时，诺拉正在厨房里忙。她看见你，愣了一下。',
          '“回来得这么早？”',
          '你卷起袖子，帮她搬了那袋土豆。',
        ],
        effects: { affinity: { nora: 2 }, stamina: -5, time: 18 * 60 + 30, location: 'orphanCanteen' },
      },
      {
        label: '在学院里转转',
        reply: [
          '你沿着回廊走了一圈。钟楼下面贴着一张告示，上面写着这一学年的考核安排。',
          '第一次月度考核在四周后。',
        ],
        effects: { mood: -1, flag: 'exam_notice', time: 18 * 60, location: 'academy' },
      },
    ],
    next: 10,
  },
  {
    id: 'dinner',
    time: 19 * 60,
    location: 'orphanCanteen',
    duration: 30,
    text: [
      '晚饭是炖菜和面包。孩子们围坐在长桌边，声音很大。',
      '诺拉坐在桌子另一头，一边吃一边给最小的孩子擦嘴。她抬头看见你，朝旁边的位置抬了抬下巴。',
      '“第一天怎么样？”',
    ],
    choices: [
      {
        label: '说说今天的事',
        reply: [
          '你提到伊莲娜、格里高利和阿尔文。诺拉听得很认真。',
          '“伊莲娜修女？”她想了想，像是在回忆一个不太熟的名字，“她也是教会的人，不过一直待在学院那边。我只在名册上见过她的名字。”',
          '“格里高利是骑士团的人，打过仗。”',
          '“看着吓人，但他不会为难学生。”',
          '她停了一下，才接着说：“阿尔文先生是审判庭的人。上课认真听就好，别多问。”',
          '孩子们陆续回房间。诺拉把最后一只碗放进水槽，叫住你。',
          '“钱的事，别太勉强。”她说，“实在不够，跟我说。”',
          '然后她摆摆手，让你去睡。',
        ],
        effects: { affinity: { nora: 2 } },
      },
    ],
    next: 11,
  },
  {
    id: 'evening',
    time: 19 * 60 + 35,
    location: 'dorm',
    duration: 10,
    text: [
      '你回到寝室，把课本摊在桌上。窗外还能听见孩子们的声音。',
      '过了一会儿，诺拉敲门，递进来一盏小灯。',
      '“晚上别熬太晚。”她说。',
      '灯放在桌上，光很小，但把房间照亮了一点。',
    ],
    continueLabel: '把灯放到床头',
    next: 12,
  },
  {
    id: 'end',
    time: 22 * 60,
    location: 'dorm',
    text: [
      '你回到寝室，把课本放在床头。',
      '窗外还能听见巡夜人的脚步声，远处偶尔有狗叫。',
      '你躺下来，盯着天花板。',
      '今天发生了很多事：新的学院、三个老师、一个记住你名字的人。',
      '一月一日 · 周一',
      '距离第一次月度考核：27 天。',
      '距离还款：6 天。',
    ],
    continueLabel: '睡 8 小时',
    sleep: true,
  },
]

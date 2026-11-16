// arcanum: textWeatherScenes
import type { SeasonSceneTable } from '../types'

export const WEATHER_SCENES: Record<string, SeasonSceneTable> = {
  town: {
    spring: {
      sunny: '喷泉池沿是干的。',
      cloudy: '石板路上留着半干的车轮印。',
      overcast: '井沿外侧干了，靠里还是湿的。',
      rain: '井盖凹下去的地方积了半指深的水。',
    },
    summer: {
      sunny: '只有井盖下沿还是湿的。',
      cloudy: '喷泉溅出来的水落在池沿上，那一片聚着水。',
      overcast: '石板路上踩过去发黏。',
      rain: '石板路上的水到街灯座底下就断了。',
    },
    autumn: {
      sunny: '井沿的凹口干到第二个。',
      cloudy: '石板路靠墙那一条没干。',
      overcast: '井盖一面潮，一面干。',
      rain: '井沿边上有一圈溅上去的泥点。',
    },
    winter: {
      sunny: '街灯座底下没结冰。',
      cloudy: '井盖边上还有两处踩得动。',
      overcast: '踩上井盖，声音是空的。',
      snow: '喷泉上盖着雪，池沿露在外面。',
    },
  },
  academyStreet: {
    spring: {
      sunny: '坡道踩上去发硬，树底下那截还软。',
      cloudy: '石墙底下那一条还湿，坡道干到大半。',
      overcast: '潮气留在石阶上，坡道是干的。',
      rain: '石阶上存着水，一脚踩下去溅开。',
    },
    summer: {
      sunny: '石阶踩上去硬邦邦的，鞋底硌得慌。',
      cloudy: '干硬的地方到树下就断了。',
      overcast: '比坡道低的石阶还湿着。',
      rain: '水从门楼那头往坡下走。',
    },
    autumn: {
      sunny: '书落在石阶上，书页干得卷起来。',
      cloudy: '石阶上留着半干的脚印。',
      overcast: '坡道中间干了，靠墙那条没干。',
      rain: '石阶上存着三处水。',
    },
    winter: {
      sunny: '坡道冻硬了，踩上去响。',
      cloudy: '石阶上还软，坡道冻住了。',
      overcast: '树挡着，树根底下那片没冻实。',
      snow: '只有石阶上没积住雪。',
    },
  },
  orphanStreet: {
    spring: {
      sunny: '只有墙根那块还软，其余踩上去发硬。',
      cloudy: '窗上的水汽还留着，屋檐底下干了。',
      overcast: '巷子这头还湿，那头干了半截。',
      rain: '屋檐短，水直接落在巷子里。',
    },
    summer: {
      sunny: '只有三处踩上去是硬的，屋檐底下那几块还软。',
      cloudy: '巷子干了，墙根那条还湿着。',
      overcast: '屋檐下的草底下软到陷脚。',
      rain: '水积在巷子靠墙那头。',
    },
    autumn: {
      sunny: '柴火干得发脆，一碰就响。',
      cloudy: '晾衣绳摸上去一手潮，衣服却是干的。',
      overcast: '巷子中间是干的，靠屋檐那头还湿。',
      rain: '比屋檐低的那段石阶积着水。',
    },
    winter: {
      sunny: '冻硬的地方在巷子中间。',
      cloudy: '巷子冻了，墙根还软。',
      overcast: '脚印边上塌下去，印子里还是软的。',
      snow: '雪盖住巷子，石阶那条还露着土。',
    },
  },
  churchStreet: {
    spring: {
      sunny: '石阶上留着水，扫过的地方干了一半。',
      cloudy: '靠钟楼那头还湿，石阶靠墙这条干了。',
      overcast: '募捐箱的锁上了潮，钥匙转不动。',
      rain: '伞架底下积着水，伞上的水还在滴。',
    },
    summer: {
      sunny: '石墙根那条踩上去发软，钟楼底下还没硬。',
      cloudy: '石阶上只有两处是硬的。',
      overcast: '门轴转起来没声，门缝里还潮。',
      rain: '石阶上积着水，伞架上干着。',
    },
    autumn: {
      sunny: '扫过一遍，石阶踩上去发脆。',
      cloudy: '干硬的在钟楼底下，湿的留在石阶上。',
      overcast: '踩上去还是软的，扫过的地方留着扫痕。',
      rain: '石阶上的水没退，鞋底踩过去打滑。',
    },
    winter: {
      sunny: '只有钟楼底下那级没冻硬。',
      cloudy: '比石阶高的石墙根冻得早。',
      overcast: '石墙摸上去湿手。',
      snow: '扫过的石阶上没积雪，边上还盖着。',
    },
  },
  academy: {
    spring: {
      sunny: '石板干到一踩就响。',
      cloudy: '中间干了，石墙根那条还湿。',
      overcast: '台阶边还有两处没干。',
      rain: '只有门廊底下那块没积水。',
    },
    summer: {
      sunny: '干硬的地方在扫过的石板那一带。',
      cloudy: '石板踩上去发涩，门廊底下还潮。',
      overcast: '台阶上还湿着，到门廊边就干了。',
      rain: '比台阶低的那片石板积着水。',
    },
    autumn: {
      sunny: '干硬的地方在门廊那头。',
      cloudy: '石板一半干了，一半还湿。',
      overcast: '脚印边上塌下去，印子里还是湿的。',
      rain: '石板上积着水，门廊底下没存住。',
    },
    winter: {
      sunny: '石板冻硬了，扫过的那几块结了薄冰。',
      cloudy: '石板冻了，门廊底下还软。',
      overcast: '台阶踩上去没声，底下是潮的。',
      snow: '藤蔓挡着，墙根那片雪薄。',
    },
  },
  commercial: {
    spring: {
      sunny: '摊前的压痕干得起了壳。',
      cloudy: '石板路这边干了，靠店门那侧还潮。',
      overcast: '门板底下压着的一道湿印没干透。',
      rain: '檐下的水在门槛前头积成一条。',
    },
    summer: {
      sunny: '棚外那块石板起了皮，遮棚底下还是干的。',
      cloudy: '遮棚挡着，棚下还是潮的，棚外干了。',
      overcast: '只有石板路中间那块是干的。',
      rain: '水从招牌的边角往下滴，一滴一滴打在筐底。',
    },
    autumn: {
      sunny: '石板路干到发脆，车轮碾过去有细响。',
      cloudy: '门槛摸上去还是潮的，门板那头干了。',
      overcast: '石板路上还有三处发潮。',
      rain: '遮棚底下没水，棚外积了一片。',
    },
    winter: {
      sunny: '冻硬的地方到遮棚就断了。',
      cloudy: '门槛这么高的地方冻住了，底下那块还软。',
      overcast: '石板路中间没冻实，踩上去发软。',
      snow: '遮棚上压着一层雪，中间凹下去。',
    },
  },
  yard: {
    spring: {
      sunny: '黄土表面结了一层干壳。',
      cloudy: '黄土踩上去，一半有响，一半没声。',
      overcast: '只有背阴那面的木桩还潮。',
      rain: '水淹到剑架最下面那格。',
    },
    summer: {
      sunny: '脚印只留下半圈，边上翘起。',
      cloudy: '桩顶是干的，桩脚还沾泥。',
      overcast: '剑架底下留着一片湿土，扫不开。',
      rain: '靠墙那排桩没泡到水。',
    },
    autumn: {
      sunny: '剑架的木条干了，接缝里还夹着泥。',
      cloudy: '黄土只干到一指深，下面发潮。',
      overcast: '墙根一带还是潮的。',
      rain: '土踩实了，水只能顺着桩脚走。',
    },
    winter: {
      sunny: '木桩摸上去发硬，敲一下声音是实的。',
      cloudy: '冰壳到门口为止，门里没结。',
      overcast: '木桩只冻住一半，另一半还能晃。',
      snow: '桩顶的雪比地上薄。',
    },
  },
  backyard: {
    spring: {
      sunny: '干硬的那片到墙根就断了，柴堆底下还软。',
      cloudy: '柴堆挡着，底下那片还软，边上硬了。',
      overcast: '土垄靠墙那头还软，踩下去留印。',
      rain: '木箱盖上积了一小片水。',
    },
    summer: {
      sunny: '园地上的脚印干得起了壳。',
      cloudy: '土垄上干一块湿一块。',
      overcast: '墙根一带还有三处是软的，踩下去陷脚。',
      rain: '柴堆外头湿了，里头还干着，水没渗进去。',
    },
    autumn: {
      sunny: '园地表面硬了，土垄缝里还夹着泥。',
      cloudy: '木箱底下那片还是潮的，箱板上凝着水珠。',
      overcast: '只有柴堆底下那块是干的。',
      rain: '水顺着晾衣绳往下滴，一滴一滴打在园地上。',
    },
    winter: {
      sunny: '土垄冻得发脆，一踩就碎。',
      cloudy: '冻硬的那片在木箱和墙根之间，两边还软。',
      overcast: '比柴堆底低的那块地还没冻实。',
      snow: '雪踩上去发松，底下是软的。',
    },
  },
  bellTower: {
    spring: {
      sunny: '塔门里还有三处发潮。',
      cloudy: '只有长凳面上没湿。',
      overcast: '铜钟上凝了一层水，一摸留个手印。',
      rain: '木楼梯踩上去发黏。',
    },
    summer: {
      sunny: '塔门里的地硬了，门外那级是湿的。',
      cloudy: '比长凳低的那级踏板是湿的。',
      overcast: '塔门里侧潮，外侧干。',
      rain: '水从钟室的窗打进来，木楼梯靠窗那侧积了水。',
    },
    autumn: {
      sunny: '木楼梯上的脚印干成了泥壳。',
      cloudy: '长凳面干了，凳腿还潮。',
      overcast: '钟绳上还挂着水珠。',
      rain: '水顺着钟绳往下淌，滴在铜钟上。',
    },
    winter: {
      sunny: '钟口下沿冻了一圈，钟身没有。',
      cloudy: '塔门关着，门里那块地没冻实。',
      overcast: '长凳底下那片没冻实，凳面上冻了。',
      snow: '雪只压在钟梁上，钟口朝下敞着。',
    },
  },
  gate: {
    spring: {
      sunny: '石阶踩上去发硬，鞋底沾不上泥。',
      cloudy: '第三级石阶干了，第四级还是湿的。',
      overcast: '潮气到门洞里就断了，外侧是干的。',
      rain: '门洞里滴水声一下接一下，石阶上那片水还在。',
    },
    summer: {
      sunny: '只有石墙背阴那块还发软。',
      cloudy: '门洞里的地干一块湿一块。',
      overcast: '踩出的圆痕边上还是湿的。',
      rain: '门洞里没积水，水都从门缝走了。',
    },
    autumn: {
      sunny: '车辙里剩一圈干泥。',
      cloudy: '石阶上只剩三处还潮，其余踩上去发硬。',
      overcast: '石阶扫过一遍，踩上去还是软的。',
      rain: '石阶上的水踩过去发滑。',
    },
    winter: {
      sunny: '门洞里的地硬了，石阶上踩下去还陷。',
      cloudy: '石阶上冻住了，靠墙那条还软。',
      overcast: '石墙上冻住的那层一抠就掉，底下还是湿的。',
      snow: '石墙根下的雪最厚。',
    },
  },
  outside: {
    spring: {
      sunny: '车轮碾过土路，声音是脆的。',
      cloudy: '草坡那头干了，土路中间还湿着。',
      overcast: '车辙深，洼底的水一直没干。',
      rain: '只有土路中间那一条积着水。',
    },
    summer: {
      sunny: '土路踩上去发硬，车辙里还软。',
      cloudy: '土路干得只差车辙那两道。',
      overcast: '潮气留在车辙里，路面上早干了。',
      rain: '车辙里存着水，路面干了辙底还是满的。',
    },
    autumn: {
      sunny: '土路踩上去发脆，鞋底带起一层壳。',
      cloudy: '干硬的路面到车辙就断了。',
      overcast: '城墙根那片土比路中间软。',
      rain: '车辙的壁冲塌了一角，泥水往低的那头走。',
    },
    winter: {
      sunny: '土路冻硬了，鞋底磕上去有响。',
      cloudy: '车辙冻上了，辙边的土还松。',
      overcast: '土路中间没冻实，踩下去陷一点。',
      snow: '雪盖了土路，只露着两道车辙。',
    },
  },
  forestDeep: {
    spring: {
      sunny: '苔踩上去发脆，倒木底下还是软的。',
      cloudy: '只有三处落叶踩着是硬的，其余都陷脚。',
      overcast: '潮气留在倒木底下，上面是干的。',
      rain: '水从树冠漏下来，树根底下是干的。',
    },
    summer: {
      sunny: '落叶脆到一踩就碎。',
      cloudy: '只有倒木顶上那块是干的。',
      overcast: '树冠挡着，树根底下那片没干。',
      rain: '落叶踩上去发黏，底下渗出水。',
    },
    autumn: {
      sunny: '干壳从落叶表层裂到倒木那头。',
      cloudy: '比倒木顶低的那层落叶还潮。',
      overcast: '落叶底下潮，面上是脆的。',
      rain: '倒木的凹处积着水，水面漂着两片落叶。',
    },
    winter: {
      sunny: '爪印踩碎了落叶上的薄冰。',
      cloudy: '倒木底下没冻，上面冻住了。',
      overcast: '倒木的凹处还存着水，没冻透。',
      snow: '雪压着落叶，听不见响。',
    },
  },
  cemetery: {
    spring: {
      sunny: '坡地靠石墙那头先硬。',
      cloudy: '碑座朝阳那面干了，背阴那面还湿着。',
      overcast: '碑脚留着踩过的泥印。',
      rain: '坡地低处积着水，碑脚那圈没存住。',
    },
    summer: {
      sunny: '碑座的石面结了一层壳。',
      cloudy: '草踩上去有响，靠墙那片没声。',
      overcast: '坡地表面硬了，草丛底下还软。',
      rain: '坡地斜着，碑脚那块土存不住水。',
    },
    autumn: {
      sunny: '硬壳从坡顶裂到碑脚。',
      cloudy: '石墙这侧踩上去是硬的，墙外那头还软。',
      overcast: '草根底下的土软，踩下去留个浅印。',
      rain: '只有碑座底下那块没积水。',
    },
    winter: {
      sunny: '坡地上还有三处没冻硬。',
      cloudy: '屋后这片踩着发硬，碑脚那圈还软。',
      overcast: '冻硬的地方到石墙根就断了。',
      snow: '雪盖到碑座那么高，碑顶还露在外面。',
    },
  },
  forest: {
    spring: {
      sunny: '只有小路上踩着是实的。',
      cloudy: '水积在树桩的凹处，路边那块干了。',
      overcast: '落叶踩上去发软，底下是湿的。',
      rain: '湿到树桩那一圈就断了，再往外是干的。',
    },
    summer: {
      sunny: '小路比林子里的地硬。',
      cloudy: '树底下干，灌木底下还潮。',
      overcast: '树桩的截面上积着水。',
      rain: '落叶上留着水冲出的沟。',
    },
    autumn: {
      sunny: '小路踩上去发脆，林子深处没声。',
      cloudy: '树挡着，树底下的落叶还潮，路那边脆了。',
      overcast: '落叶踩上去是软的，没有脆响。',
      rain: '小路上积着水，树桩顶上干着。',
    },
    winter: {
      sunny: '小路上只有三处踩上去是硬的。',
      cloudy: '树桩底下还留着一圈软的。',
      overcast: '小路冻上了，落叶底下还是软的。',
      snow: '雪没到脚踝。',
    },
  },
  craftDistrict: {
    spring: {
      sunny: '炉灰干得起了粉，鞋底蹭过去沙沙响。',
      cloudy: '槽底干一块湿一块。',
      overcast: '槽底没干，槽边倒是硬的。',
      rain: '槽里存着三处水。',
    },
    summer: {
      sunny: '铁屑踩着响，炉灰没声。',
      cloudy: '炉灰一边干了，一边还湿着。',
      overcast: '炉灰结成块，一踩就散。',
      rain: '只有槽底存住了水。',
    },
    autumn: {
      sunny: '招牌上的灰干得翘了边，钉子那头还紧。',
      cloudy: '木屑干到一捏就碎，底下那层还潮。',
      overcast: '潮气留在槽底，槽边是干的。',
      rain: '槽里的水没干，边上留着一圈灰印。',
    },
    winter: {
      sunny: '槽底冻住了，铁轮碾上去直打滑。',
      cloudy: '冻住的地方到槽口就断了。',
      overcast: '比槽底浅的地方还没冻实。',
      snow: '雪压在炉灰上，灰面洇湿一片。',
    },
  },
  herbGarden: {
    spring: {
      sunny: '比畦面低的沟里，土是硬的。',
      cloudy: '畦面上踩上去是硬的，畦沟里还发软。',
      overcast: '没干的地方到畦沟就断了。',
      rain: '畦沟里的水没走，土还泡着。',
    },
    summer: {
      sunny: '畦面中间结了壳，畦沟边上没有。',
      cloudy: '药畦一半干了，一半还是湿的。',
      overcast: '畦边留着水印，边上的土塌下去。',
      rain: '畦沟里积着水，畦面上没存住。',
    },
    autumn: {
      sunny: '畦面上只有三处踩上去是硬的。',
      cloudy: '药草干得沙沙响，碰一下掉渣。',
      overcast: '畦沟里还湿，畦面干了半截。',
      rain: '畦沟深，水都走沟里，畦面上没存住。',
    },
    winter: {
      sunny: '畦面上冻硬了，沟里还软。',
      cloudy: '只有畦面冻了，畦沟里还软。',
      overcast: '畦沟里的土软到踩下去陷半只鞋。',
      snow: '雪盖住畦沟，畦面还露着。',
    },
  },
}

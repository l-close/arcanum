# arcanum 文本批次进度

16 个户外地点取自 `web/src/game/content/weather.ts` 的 `OUTDOOR`：玩家站在那儿，头顶有天，走季节 16 格 + 天气 16 格。`id` 是唯一键；`地点` 列由 `locations.ts` 派生，不一致只报警告。

室内地点（`church`、`orphanage`）不走 32 格：`DESC_BY_TIME` 3 条 + 暮覆盖 1 条。

本表只记进度，不记逐格明细。逐格自检记录跟文本稿走，不进仓库。

## 状态值

```text
素材表：未开始 / 已有
季节：未开始 / 48 条 / 已锁
天气：未开始 / 48 条 / 已锁
季节自检：未开始 / 未过 / 通过
天气自检：未开始 / 未过 / 通过
```

整体锁定是派生概念：`季节` 与 `天气` 都 `已锁`，且两层自检都 `通过`。本表不再单列。

## 进度

| id | 地点 | 素材表 | 季节 | 天气 | 季节自检 | 天气自检 |
|---|---|---|---|---|---|---|
| town | 中央广场 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| academyStreet | 学院区 | 已有 | 已锁 | 未开始 | 通过 | 未开始 |
| orphanStreet | 孤儿院 | 已有 | 已锁 | 未开始 | 通过 | 未开始 |
| churchStreet | 教堂 | 已有 | 已锁 | 未开始 | 通过 | 未开始 |
| craftDistrict | 工坊区 | 未开始 | 未开始 | 未开始 | 未开始 | 未开始 |
| academy | 长明学院 | 已有 | 已锁 | 未开始 | 通过 | 未开始 |
| commercial | 商业区 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| yard | 演武场 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| herbGarden | 药草园 | 未开始 | 未开始 | 未开始 | 未开始 | 未开始 |
| backyard | 后院 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| bellTower | 钟楼 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| gate | 城门 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| outside | 城外 | 未开始 | 未开始 | 未开始 | 未开始 | 未开始 |
| cemetery | 墓园 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| forest | 森林 | 已有 | 已锁 | 已锁 | 通过 | 通过 |
| forestDeep | 森林深处 | 未开始 | 未开始 | 未开始 | 未开始 | 未开始 |

## 室内（各 4 条）

| id | 地点 | 时段描述 | 暮覆盖 |
|---|---|---|---|
| church | 教堂内堂 | 已有 | 已有 |
| orphanage | 孤儿院正厅 | 已有 | 已有 |

## 说明

- 素材表已有：`town`、`commercial`、`yard`、`gate`、`academy`、`backyard`、`bellTower`、`academyStreet`、`orphanStreet`、`churchStreet`。
- `yard`、`gate`、`town` 整体锁定。
- `academyStreet`、`orphanStreet`、`churchStreet`、`academy`、`commercial` 季节已锁、天气未开始。
- 其余 6 行全部 `未开始`。
- `已锁` 不等于整体锁定：`季节` 与 `天气` 都 `已锁`、两层自检都 `通过`，才算整体锁定。
- 已知弱配（复核时优先）：`yard` 冬·阴（4 数量，写成了程度）、`yard` 冬·雪（11 位置，写成了对比）、`bellTower` 夏·多云（`是湿的`，为避开 `还潮`／`发潮` 二元组连续换词三次，句子已被稀释）。
- baseline 静音项（写该地点时自行核分布）：`gate` 门洞、`town` 喷泉。
- desc 收尾（32 格全部写完后做）：
  - 4 处活文本（药剂工坊、炼药室、商会办事处、旧书铺）先补 3 条 `DESC_BY_TIME`，desc 退成一句简介；
  - 死文本不逐条重写，只在 `locations.ts` 数组上方加一段注释，标明“被遮蔽、未审、仅作参照”。
- `bellTower` 的 `DESC_BY_TIME` 仍是塔内视角，写 32 格之前要替换。

## 校验

- `npm run validate:style` 按 `id` 比对：本表的 id 集合必须正好 16 个（等于 `SCENE_LOCATIONS.length`），且与 `LOCKED.season` / `LOCKED.weather` 一致。
- 室内表在空行之后的独立小节，解析器只读第一张表，不参与 id 比对。
- `地点` 列与 `locations.ts` 派生名比对，不一致只报警告。
- 16 个派生名应互不相同；重复只报警告。
- 表格缺 `id` 列、行数不等于 `SCENE_LOCATIONS.length`、名字带空格，均按“表格格式异常”报错，不静默跳过。

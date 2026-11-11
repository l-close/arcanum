import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from './game/store'
import type { ContentIssue } from './game/content/validate'
import {
  BELL_TOWER_MINUTES,
  BELL_TOWER_OPEN_END,
  BELL_TOWER_OPEN_START,
  BELL_TOWER_STAMINA,
  BOOKS,
  ACADEMY_MEAL_FEE,
  CEMETERY_SWEEP_MINUTES,
  CEMETERY_SWEEP_MOOD,
  CEMETERY_SWEEP_STAMINA,
  DRINKS,
  ENEMIES,
  EQUIPMENT_SLOTS,
  FOREST_WALK_MINUTES,
  FOREST_WALK_MOOD,
  FOREST_WALK_STAMINA,
  ITEMS,
  LOCATIONS,
  NPCS,
  QUALITY,
  WEST_COMMISSIONS,
  WEST_GENERICS,
  WEST_CONSTRUCTION_MAX,
  WEST_PROJECT_MAX,
  WEST_GENERIC_MINUTES,
  WEST_GENERIC_STAMINA,
  WEST_GENERIC_CONSTRUCTION,
  WEST_GENERIC_POINTS,
  GUILD_JOB_DEFS,
  GUILD_ESCORTS,
  guildJobsForDay,
  guildEscortForDay,
  supportPeriodAt,
  nextSupportPeriod,
  isConstructionWeek,
  shopPriceAt,
  sellPriceAt,
  RELIEF_CARE_MINUTES,
  RELIEF_CARE_STAMINA,
  RELIEF_OPEN_END,
  RELIEF_OPEN_START,
  RELIEF_TIDY_MINUTES,
  RELIEF_TIDY_STAMINA,
  RELIEF_TREAT_COST,
  RELIEF_TREAT_HP,
  RELIEF_TREAT_MINUTES,
  RELIEF_VOLUNTEER_END,
  RELIEF_VOLUNTEER_MINUTES,
  RELIEF_VOLUNTEER_PAY,
  RELIEF_VOLUNTEER_START,
  RELIEF_VOLUNTEER_STAMINA,
  REST_THRESHOLD,
  SKILL_LABEL,
  SKILL_ORDER,
  SLEEP_MAX_MINUTES,
  SLEEP_MIN_MINUTES,
  SLEEP_MIN_RECOVERY_MINUTES,
  SPELLS,
  TAVERN_DRINK_END,
  TAVERN_OPEN_END,
  TAVERN_OPEN_START,
  TAVERN_TALK_END,
  TAVERN_TALK_START,
  TAVERN_WORK_END,
  TAVERN_WORK_START,
  attackDamageRange,
  areaNeighbors,
  classSegmentAt,
  courseById,
  courseExamLocationOn,
  courseLocationOn,
  coursesForYear,
  COMBAT_BUFF_EFFECT,
  COMBAT_BUFF_LABEL,
  combatBuffUntilKey,
  absoluteMinutes,
  canSellAt,
  WORKSHOP_OPEN_START,
  WORKSHOP_OPEN_END,
  WORKSHOP_WORK_MINUTES,
  WORKSHOP_WORK_STAMINA,
  WORKSHOP_WORK_SPIRIT,
  WORKSHOP_RENT_COST,
  WORKSHOP_RENT_DAYS,
  WORKSHOP_LESSON_COST,
  WORKSHOP_LESSON_MINUTES,
  WORKSHOP_LESSON_SPIRIT,
  WORKSHOP_LESSON_EXP,
  workshopPayForTier,
  RECIPES,
  recipeUnlocked,
  brewSuccessChance,
  brewFineChance,
  currentMeal,
  currentYear,
  ageOf,
  daysUntil,
  examThresholdForDay,
  examCoursesForYear,
  isExamDay,
  isClassDay,
  semesterEndDay,
  semesterLastExamDay,
  exitsOf,
  formatDate,
  formatMonthDay,
  formatMoney,
  formatPercent,
  formatTime,
  getLocation,
  heartsText,
  isGateOpen,
  isCityArea,
  isVacation,
  isTimeWindow,
  lecturePreviewPlan,
  locationDesc,
  maxHp,
  maxSpirit,
  maxStamina,
  mealKeyFor,
  nextClassStart,
  nextExamTotal,
  nextExamThreshold,
  nextRentTotal,
  npcById,
  npcsAt,
  plazaNotices,
  reliefHasPatients,
  ritePhaseAt,
  ritePhaseDone,
  ritePrepAt,
  semesterLabel,
  semesterState,
  shopStockAt,
  socialTier,
  skillPercent,
  spellDamageRange,
  spiritCost,
  TELEPORT_YEAR,
  tierName,
  yearLabel,
  weatherOf,
  weatherScene,
  WEATHER_LABEL,
} from './game/content'
import { formatSaveTime, listSaves, loadGame, SLOT_COUNT, getLastExport, markExported } from './game/save'
import {
  buildAllBundle,
  buildCurrentBundle,
  downloadText,
  encodeBundle,
  importAllSlots,
  importCurrentToSlot,
  isAndroidRuntime,
  parseBundleText,
  planAllImport,
  stampForFile,
} from './game/save'
import type { SaveBundle } from './game/save'
import { EVENTS, choiceBlockedReason, eventById, eventEffectSummary } from './game/events'
import { STORY } from './game/story'
import type { ExamPackage, GameData, Gender, SkillKey } from './game/types'
import type { Location } from './game/content'
import { ItemIcon } from './ui/icons'
import { APP_VERSION } from './version'

const CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export default function App() {
  const screen = useGame((s) => s.screen)

  useEffect(() => setupAndroidBackButton(), [])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') useGame.getState().autosave()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (screen === 'title') return <TitleScreen />
  if (screen === 'create') return <CreateScreen />
  return <GameScreen />
}

function setupAndroidBackButton(): () => void {
  let disposed = false
  let remove: (() => void) | null = null
  void (async () => {
    try {
      const { Capacitor } = await import('@capacitor/core')
      if (!Capacitor.isNativePlatform()) return
      const { App: NativeApp } = await import('@capacitor/app')
      const handleBack = () => {
        const state = useGame.getState()
        if (state.screen === 'title') {
          if (state.titlePanel) {
            state.setTitlePanel(null)
            return
          }
          void NativeApp.exitApp()
          return
        }
        if (state.screen !== 'game') {
          void NativeApp.minimizeApp()
          return
        }
        if (state.modal) {
          state.setModal(null)
          return
        }
        if (state.battle) {
          useGame.setState({ message: '战斗中无法离开。' })
          return
        }
        void NativeApp.minimizeApp()
      }
      const backListener = await NativeApp.addListener('backButton', handleBack)
      const stateListener = await NativeApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) useGame.getState().autosave()
      })
      remove = () => {
        void backListener.remove()
        void stateListener.remove()
      }
      if (disposed) remove()
    } catch {
      // 非安卓环境或插件不可用
    }
  })()
  return () => {
    disposed = true
    remove?.()
  }
}

function TitleScreen() {
  const setScreen = useGame((s) => s.setScreen)
  const continueGame = useGame((s) => s.continueGame)
  const savesRev = useGame((s) => s.savesRev)
  const titlePanel = useGame((s) => s.titlePanel)
  const setTitlePanel = useGame((s) => s.setTitlePanel)
  const [msg, setMsg] = useState('')
  const saves = useMemo(() => listSaves(), [savesRev])
  const auto = useMemo(() => loadGame('auto'), [savesRev])
  const hasAuto = auto !== null
  const hasAny = saves.some((s) => s !== null)

  return (
    <div className="title-screen">
      <div className="title-mark">ARCANUM</div>
      <div className="title-sub">长明学院 · 银月城</div>
      <div className="title-actions">
        <button className="menu-btn" onClick={() => setScreen('create')}>开始新游戏</button>
        <button
          className={`menu-btn${hasAuto ? ' highlight' : ''}`}
          disabled={!hasAuto}
          onClick={() => {
            if (!continueGame()) setMsg('没有可用的自动存档。')
          }}
        >
          继续
        </button>
        <button className="menu-btn" disabled={!hasAny} onClick={() => setTitlePanel('saves')}>
          读取存档
        </button>
      </div>
      {auto && (
        <div className="title-save-hint">
          上次存档：{formatMonthDay(auto.data.day)} · {semesterLabel(auto.data.day)} · {formatTime(auto.data.minutes)}
        </div>
      )}
      {msg && <div className="title-msg">{msg}</div>}
      <div className="title-foot">文字驱动的沙盒生活模拟 · v{APP_VERSION}</div>

      {titlePanel === 'saves' && (
        <ModalShell title="读取存档" onClose={() => setTitlePanel(null)}>
          <SaveSlots mode="title" onTransfer={(kind) => setTitlePanel(kind)} />
        </ModalShell>
      )}
      {titlePanel === 'export' && (
        <ModalShell title="导出存档" onClose={() => setTitlePanel('saves')}>
          <ExportPanel mode="title" />
        </ModalShell>
      )}
      {titlePanel === 'import' && (
        <ModalShell title="导入存档" onClose={() => setTitlePanel('saves')}>
          <ImportPanel mode="title" />
        </ModalShell>
      )}
    </div>
  )
}

function CreateScreen() {
  const startNewGame = useGame((s) => s.startNewGame)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('male')

  return (
    <div className="create-screen">
      <div className="panel create-panel">
        <h1>入学登记</h1>
        <p className="muted">十岁那年的事，你已经不记得了。你只知道，是诺拉修女在城外的雾里发现了你。</p>
        <label className="field">
          <span>姓名</span>
          <input
            value={name}
            maxLength={12}
            placeholder="输入你的名字"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <div className="field">
          <span>性别</span>
          <div className="seg">
            <button className={gender === 'male' ? 'seg-btn on' : 'seg-btn'} onClick={() => setGender('male')}>
              男
            </button>
            <button className={gender === 'female' ? 'seg-btn on' : 'seg-btn'} onClick={() => setGender('female')}>
              女
            </button>
          </div>
        </div>
        <button className="primary-btn" onClick={() => startNewGame(name, gender)}>
          进入长明学院
        </button>
      </div>
    </div>
  )
}

function GameScreen() {
  const data = useGame((s) => s.data)
  const sidebarOpen = useGame((s) => s.sidebarOpen)
  const modal = useGame((s) => s.modal)
  const message = useGame((s) => s.message)
  const toggleSidebar = useGame((s) => s.toggleSidebar)
  const playerName = useGame((s) => s.player.name)
  const storyTarget = useGame((s) => s.storyTarget)
  const storyRoute = useGame((s) => s.storyRoute)
  const pendingEvent = useGame((s) => s.pendingEvent)
  const battle = useGame((s) => s.battle)
  const clearNotice = useGame((s) => s.clearNotice)
  const clearMessage = useGame((s) => s.clearMessage)
  const checkExamPackages = useGame((s) => s.checkExamPackages)
  const [npcId, setNpcId] = useState<string | null>(null)

  useEffect(() => {
    setNpcId(null)
  }, [data.location])

  useEffect(() => {
    checkExamPackages()
  }, [data.location, data.day, data.minutes, modal, pendingEvent, battle, checkExamPackages])

  const loc = getLocation(data.location)
  const weather = weatherOf(data.day)
  const weatherText = weatherScene(data.location, data.day)
  const npcsHere = npcsAt(data.location, data.day, data.minutes)
  const segment = classSegmentAt(data.location, data.minutes, data.day)
  const meal = currentMeal(data.minutes)
  const auto = listSaves()
  const autoSave = auto[auto.length - 1]
  const rentDays = daysUntil(nextRentTotal(data.day, data.minutes), data.day, data.minutes)
  const examTotal = nextExamTotal(data.day, data.minutes)
  const examDays = examTotal === null ? null : daysUntil(examTotal, data.day, data.minutes)
  const semState = semesterState(data.day)
  const supportPeriod = supportPeriodAt(data.day)
  const inScene = data.storyStep >= 0 && data.storyStep < STORY.length && storyTarget === null
  const inTransition = storyTarget !== null
  const nextLeg = storyRoute[0] ? getLocation(storyRoute[0]) : null
  const targetScene = storyTarget !== null ? STORY[storyTarget] : null
  const objective = inTransition
    ? nextLeg
      ? `目标：前往${nextLeg.name}`
      : targetScene
        ? `目标：等到 ${formatTime(targetScene.time)}`
        : ''
    : ''

  return (
    <div className="game-shell">
      <header className="topbar">
        <div className="top-item">
          <span className="top-label">金钱</span>
          <span className={`top-value${data.money < 0 ? ' debt' : ''}`}>{formatMoney(data.money)}</span>
          {data.money < 0 && <span className="debt-tag">欠款</span>}
        </div>
        <div className="top-item">
          <span className="top-label">时间</span>
          <span className="top-value">{formatTime(data.minutes)}</span>
        </div>
        <div className="top-item">
          <span className="top-label">日期</span>
          <span className="top-value">{formatDate(data.day)} · {WEATHER_LABEL[weather]}</span>
        </div>
        <div className="top-spacer" />
        <div className="top-auto">{autoSave ? '自动存档可用' : '尚无存档'}</div>
      </header>

      <div className="game-body">
        {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar} />}
        {sidebarOpen && <StatusRail />}
        <main className="main-panel">
          {battle ? (
            <BattleView />
          ) : data.guild.escort ? (
            <EscortView />
          ) : (
            <>
              <div className="countdown">
                <span>{semesterLabel(data.day)}</span>
                <span>距离还款：{rentDays === 0 ? '今天' : `${rentDays} 天`}</span>
                <span>
                  {semState === 'summer' || semState === 'winter'
                    ? '假期中'
                    : semState === 'after'
                      ? '本学年已结束'
                      : `距离下一次考试：${examDays === null ? '本学期已结束' : examDays === 0 ? '今天' : `${examDays} 天`}`}
                </span>
                {supportPeriod && (
                  <span>{supportPeriod.kind === 'holiday' ? '本月' : '本周'}：边区支援</span>
                )}
              </div>
              <div className="loc-line">
                <span className="loc-name">{loc.name}</span>
              </div>
              {data.notice && (
                <div className="notice">
                  <span>{data.notice}</span>
                  <button className="mini-btn" onClick={clearNotice}>知道了</button>
                </div>
              )}
              {pendingEvent ? (
                <EventView />
              ) : inScene ? (
                <StorySceneView />
              ) : npcId ? (
                <NpcView
                  npcId={npcId}
                  onLeave={() => {
                    setNpcId(null)
                  }}
                />
              ) : (
                <>
                  <div className="narration">
                    {locationDesc(loc, data.minutes, data.day, data.west)}
                    {weatherText && <span className="weather-line">{weatherText}</span>}
                  </div>
                  {npcsHere.length > 0 && (
                    <div className="loc-npcs">现在在这里：{npcsHere.map((n) => n.short).join('、')}</div>
                  )}
                  {objective && <div className="objective">{objective}</div>}
                  {message && <div className="message">{message}</div>}
                  <Actions
                    segment={segment}
                    meal={meal}
                    onPickNpc={(id) => {
                      setNpcId(id)
                      clearMessage()
                    }}
                  />
                  {(!inTransition || storyRoute.length > 0) && (
                    <>
                      <div className="divider" />
                      <div className="section-title">去别处</div>
                      <MoveList restrictedTarget={inTransition ? storyRoute[0] ?? null : null} />
                    </>
                  )}
                  <CityMap location={data.location} />
                </>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="bottombar">
        <button className="foot-btn" onClick={toggleSidebar}>
          {sidebarOpen ? '收起状态' : '展开状态'}
        </button>
        <div className="foot-spacer" />
        <span className="foot-name">{playerName}</span>
      </footer>

      {modal === 'sleep' && <SleepModal />}
      {modal === 'study' && <StudyModal />}
      {modal === 'practice' && <PracticeModal />}
      {modal === 'battleSelect' && <BattleSelectModal />}
      {modal === 'wait' && <WaitModal />}
      {modal === 'inventory' && <InventoryModal />}
      {modal === 'relations' && <RelationsModal />}
      {modal === 'stats' && <StatsModal />}
      {modal === 'eventPicker' && <EventPickerModal />}
      {modal === 'plazaNotices' && <PlazaNoticesModal />}
      {modal === 'bookshelf' && <BookshelfModal />}
      {modal === 'reading' && <ReadingModal />}
      {modal === 'exam' && <ExamModal />}
      {modal === 'examHandoff' && <ExamHandoffModal />}
      {modal === 'examOpen' && <ExamOpenModal />}
      {modal === 'westBoard' && <WestBoardModal />}
      {modal === 'westRecord' && <WestRecordModal />}
      {modal === 'academyBoard' && <AcademyBoardModal />}
      {modal === 'guildBoard' && <GuildBoardModal />}
      {modal === 'shop' && <ShopModal />}
      {modal === 'brew' && <BrewModal />}
      {modal === 'workshop' && <WorkshopModal />}
      {modal === 'drinks' && <DrinkModal />}
      {modal === 'save' && <SavesModal />}
      {modal === 'export' && <ExportModal />}
      {modal === 'import' && <ImportModal />}
      {modal === 'log' && <LogModal />}
      {modal === 'debug' && <DebugModal />}
    </div>
  )
}

function formatBattleTime(ticks: number): string {
  const totalSeconds = Math.floor(ticks / 10)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function combatBuffText(data: GameData): string {
  const now = absoluteMinutes(data.day, data.minutes)
  return (['sharp', 'stone', 'swift'] as const)
    .map((key) => ({ key, until: data.combatBuffs[combatBuffUntilKey(key)] }))
    .filter((item) => item.until > now)
    .map(
      (item) =>
        `${COMBAT_BUFF_LABEL[item.key]} ${COMBAT_BUFF_EFFECT[item.key]}（${Math.ceil(
          (item.until - now) / 60,
        )}h）`,
    )
    .join(' · ')
}

function BattleView() {
  const battle = useGame((s) => s.battle)
  const data = useGame((s) => s.data)
  const modal = useGame((s) => s.modal)
  const locName = getLocation(data.location).name
  const playerName = useGame((s) => s.player.name)
  const tick = useGame((s) => s.battleTick)
  const openSubmenu = useGame((s) => s.battleOpenSubmenu)
  const back = useGame((s) => s.battleBack)
  const attack = useGame((s) => s.battleAttack)
  const cast = useGame((s) => s.battleCast)
  const useItem = useGame((s) => s.battleUseItem)
  const changeWeapon = useGame((s) => s.battleChangeWeapon)
  const yieldBattle = useGame((s) => s.battleYield)
  const close = useGame((s) => s.battleClose)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!battle || (battle.phase !== 'filling' && battle.phase !== 'casting') || modal !== null) return
    const id = window.setInterval(() => {
      if (!document.hidden) tick()
    }, 100)
    return () => window.clearInterval(id)
  }, [battle?.phase, modal, tick])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [battle?.log.length, battle?.actions])

  if (!battle) return null
  const enemy = ENEMIES[battle.enemyId]
  if (!enemy) return null

  const hpMax = maxHp(data.skills.physique.tier)
  const mainHand = data.equipment.mainHand
  const weapon = mainHand ? ITEMS[mainHand] : null
  const battleWeapons = Object.entries(data.inventory)
    .filter(([id, qty]) => {
      const def = ITEMS[id]
      return qty > 0 && def?.type === 'equipment' && def.slot === 'mainHand'
    })
    .sort(([a], [b]) => (a === mainHand ? -1 : b === mainHand ? 1 : 0))
  const hasOtherWeapon = battleWeapons.some(([id]) => id !== mainHand)
  const swordEquipped = weapon?.weapon === 'sword'
  const hasMedium = !!weapon?.medium
  const fireball = SPELLS.fireball
  const knownFireball = data.spells.includes('fireball')
  const canCast = knownFireball && hasMedium && data.mana >= fireball.mana
  const fireballRange = spellDamageRange(
    fireball,
    data.skills.nature.tier,
    enemy.defense,
    ITEMS[mainHand ?? '']?.spellPower ?? 0,
  )
  const brawlRange = attackDamageRange(
    'brawl',
    data.skills.brawl.tier,
    mainHand,
    enemy.defense,
    data.flags.book_brawl_manual ? 1 : 0,
  )
  const swordRange = attackDamageRange(
    'sword',
    data.skills.sword.tier,
    mainHand,
    enemy.defense,
    data.flags.book_sword_manual ? 1 : 0,
  )
  const battleItems = Object.entries(data.inventory).filter(([id, qty]) => {
    if (qty <= 0) return false
    const def = ITEMS[id]
    return (
      def?.type === 'consumable' &&
      !!(def.effect?.hp || def.effect?.mana || def.effect?.combatBuff)
    )
  })
  const rangeText = (range: [number, number]) => `${range[0]}–${range[1]}`
  const castReason = !knownFireball
    ? '尚未学会火球术'
    : !hasMedium
      ? '需要主手媒介'
      : data.mana < fireball.mana
        ? '魔力不足'
        : `${fireball.mana} 魔力`
  const phaseLabel =
    battle.phase === 'player'
      ? '可以行动'
      : battle.phase === 'submenu'
        ? '选择行动'
        : battle.phase === 'casting'
          ? '吟唱中'
          : battle.phase === 'victory'
            ? '胜利'
            : battle.phase === 'defeat'
              ? battle.kind === 'wild'
                ? '战斗结束'
                : '练习结束'
              : '行动条充能中'

  return (
    <div className="battle-screen">
      <div className="battle-head">
        <span className="battle-title">{battle.kind === 'wild' ? `${data.guild.escort ? '护送途中' : locName} · 遭遇` : '演武场 · 切磋'}</span>
        <span className="battle-round">战斗时间 {formatBattleTime(battle.elapsedTicks)} · {phaseLabel}</span>
      </div>

      <div className="battle-combatant enemy">
        <div className="battle-name-row">
          <span className="battle-name">{enemy.name}</span>
          <span className="battle-tag">{enemy.speed > 0 ? '会还手' : '不会还手'}</span>
        </div>
        <div className="battle-desc">{enemy.desc}</div>
        <BattleBar label="生命" value={battle.enemyHp} max={enemy.hp} kind="hp" />
        <BattleBar label="魔力" value={0} max={0} kind="mana" />
        <BattleBar
          label="行动"
          value={battle.enemyGauge}
          max={100}
          kind="gauge"
          ready={battle.enemyGauge >= 100}
        />
        <div className="battle-status">状态　{battle.enemyGauge >= 100 ? '行动就绪' : '—'}</div>
      </div>

      <div className="battle-log" ref={logRef}>
        {battle.log.map((line, i) => (
          <div className="battle-log-line" key={i}>{line}</div>
        ))}
      </div>

      <div className="battle-combatant player">
        <div className="battle-name-row">
          <span className="battle-name">{playerName}</span>
          <span className="battle-tag">{swordEquipped ? '持剑' : hasMedium ? '持杖' : '空手'}</span>
        </div>
        <BattleBar label="生命" value={battle.playerHp} max={hpMax} kind="hp" />
        <BattleBar label="魔力" value={data.mana} max={100} kind="mana" />
        <BattleBar
          label="行动"
          value={battle.playerGauge}
          max={100}
          kind="gauge"
          ready={battle.phase === 'player' || battle.phase === 'submenu'}
        />
        {battle.casting && (
          <BattleBar label="吟唱" value={battle.casting.progress} max={100} kind="gauge" ready={false} />
        )}
        <div className="battle-status">
          状态　{combatBuffText(data) || '—'}
        </div>
      </div>

      {battle.phase === 'filling' && (
        <div className="battle-hint">行动条充能中……充满后可以选择行动。</div>
      )}
      {battle.phase === 'casting' && (
        <div className="battle-hint">你正在吟唱。敌方行动条仍在充能。</div>
      )}

      {battle.phase === 'player' && (
        <div className="battle-actions">
          <button className="battle-action-btn" onClick={() => openSubmenu('attack')}>
            <span className="battle-action-label">攻击</span>
            <span className="battle-action-cost">格斗 / 剑术</span>
          </button>
          <button
            className="battle-action-btn"
            disabled={!canCast}
            onClick={() => openSubmenu('spell')}
          >
            <span className="battle-action-label">法术</span>
            <span className="battle-action-cost">{castReason}</span>
          </button>
          <button
            className="battle-action-btn"
            disabled={battleItems.length === 0}
            onClick={() => openSubmenu('item')}
          >
            <span className="battle-action-label">物品</span>
            <span className="battle-action-cost">
              {battleItems.length === 0 ? '没有可用物品' : `${battleItems.length} 种`}
            </span>
          </button>
          <button className="battle-action-btn" onClick={() => openSubmenu('weapon')}>
            <span className="battle-action-label">换武器</span>
            <span className="battle-action-cost">{weapon?.name ?? '未装备主手'}</span>
          </button>
          <button className="battle-action-btn danger" onClick={yieldBattle}>
            <span className="battle-action-label">{battle.kind === 'wild' ? '逃跑' : '认输'}</span>
            <span className="battle-action-cost">
              {battle.kind === 'wild' ? '退出战斗' : '结束练习'}
            </span>
          </button>
        </div>
      )}

      {battle.phase === 'submenu' && battle.submenu === 'attack' && (
        <div className="battle-subpanel">
          <div className="battle-sub-title">选择攻击方式</div>
          <button className="battle-sub-btn" onClick={() => attack('brawl')}>
            <span>格斗</span>
            <small>{weapon?.weapon === 'staff' ? '杖击' : '徒手'} · {rangeText(brawlRange)}</small>
          </button>
          <button
            className="battle-sub-btn"
            disabled={!swordEquipped}
            onClick={() => attack('sword')}
          >
            <span>剑术</span>
            <small>{swordEquipped ? `剑 · ${rangeText(swordRange)}` : '需要装备剑'}</small>
          </button>
          <button className="battle-back" onClick={back}>返回</button>
        </div>
      )}

      {battle.phase === 'submenu' && battle.submenu === 'weapon' && (
        <div className="battle-subpanel">
          <div className="battle-sub-title">换武器</div>
          {battleWeapons.length === 0 ? (
            <div className="hint">背包里没有主手武器。</div>
          ) : (
            <>
              {battleWeapons.map(([id, qty]) => {
                const def = ITEMS[id]
                const equipped = mainHand === id
                const kindLabel = def.medium
                  ? '施法媒介'
                  : def.weapon === 'sword'
                    ? '剑'
                    : '主手'
                return (
                  <button
                    key={id}
                    className="battle-sub-btn"
                    disabled={equipped}
                    onClick={() => changeWeapon(id)}
                  >
                    <span>
                      {def.name} ×{qty}
                    </span>
                    <small>
                      {equipped ? '已装备' : `${kindLabel} · 威力 ${def.power ?? 0}`}
                    </small>
                  </button>
                )
              })}
              {!hasOtherWeapon && <div className="hint">没有其他主手武器。</div>}
            </>
          )}
          <button className="battle-back" onClick={back}>
            返回
          </button>
        </div>
      )}

      {battle.phase === 'submenu' && battle.submenu === 'spell' && (
        <div className="battle-subpanel">
          <div className="battle-sub-title">选择法术</div>
          <button
            className="battle-sub-btn"
            disabled={!canCast}
            onClick={() => cast('fireball')}
          >
            <span>{fireball.name}</span>
            <small>
              {fireball.element} · {fireball.mana} 魔力 · 吟唱 {fireball.castTicks / 10} 秒 ·{' '}
              {rangeText(fireballRange)}
            </small>
          </button>
          <button className="battle-back" onClick={back}>返回</button>
        </div>
      )}

      {battle.phase === 'submenu' && battle.submenu === 'item' && (
        <div className="battle-subpanel">
          <div className="battle-sub-title">选择物品</div>
          {battleItems.length === 0 && <div className="hint">没有可以在战斗中使用的物品。</div>}
          {battleItems.map(([id, qty]) => {
            const def = ITEMS[id]
            const buffKey = def.effect?.combatBuff
            const healHp = def.effect?.hp ?? 0
            const healMana = def.effect?.mana ?? 0
            const hpFull = healHp > 0 && battle.playerHp >= hpMax && !healMana
            const manaFull = healMana > 0 && data.mana >= 100 && !healHp
            const buffActive = buffKey
              ? data.combatBuffs[combatBuffUntilKey(buffKey)] >
                absoluteMinutes(data.day, data.minutes)
              : false
            const disabled = hpFull || manaFull || buffActive
            const effectText = buffKey
              ? `${COMBAT_BUFF_LABEL[buffKey]} ${COMBAT_BUFF_EFFECT[buffKey]}`
              : `${healHp ? `生命 +${healHp}` : ''}${healHp && healMana ? ' · ' : ''}${
                  healMana ? `魔力 +${healMana}` : ''
                }`
            return (
              <button
                key={id}
                className="battle-sub-btn"
                disabled={disabled}
                onClick={() => useItem(id)}
              >
                <span>{def.name} ×{qty}</span>
                <small>
                  {disabled
                    ? buffActive
                      ? '已生效'
                      : hpFull
                        ? '生命已满'
                        : '魔力已满'
                    : effectText}
                </small>
              </button>
            )
          })}
          <button className="battle-back" onClick={back}>返回</button>
        </div>
      )}

      {(battle.phase === 'victory' || battle.phase === 'defeat') && (
        <div className="battle-result">
          <div className="battle-result-title">
            {battle.phase === 'victory'
              ? battle.kind === 'wild'
                ? '战斗结束'
                : '练习结束'
              : battle.kind === 'wild'
                ? '你退出了战斗'
                : '你认输了'}
          </div>
          <p>{battle.result}</p>
          <div className="battle-result-reward">
            获得：
            {battle.phase === 'victory' && battle.usedSkills.length > 0
              ? battle.usedSkills
                  .map((key) => `${SKILL_LABEL[key]}经验 +${enemy.expValue}`)
                  .join(' · ')
              : '未获得技能经验'}
          </div>
          <div className="battle-result-meta">
            用时约 {Math.max(1, battle.actions)} 分钟 · 生命 {Math.max(1, battle.playerHp)} / {hpMax}
          </div>
          <button className="primary-btn" onClick={close}>
            {battle.kind === 'wild' ? '结束战斗' : '结束练习'}
          </button>
        </div>
      )}
    </div>
  )
}

function BattleBar({
  label,
  value,
  max,
  kind,
  ready,
}: {
  label: string
  value: number
  max: number
  kind: 'hp' | 'mana' | 'gauge'
  ready?: boolean
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  const num = max > 0 ? `${Math.max(0, Math.round(value))} / ${max}` : '-- / --'
  return (
    <div className="battle-stat">
      <span className="battle-stat-label">{label}</span>
      <div className="battle-bar">
        <div
          className={`battle-bar-fill ${kind} ${ready ? 'ready' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`battle-stat-num ${ready ? 'ready' : ''}`}>
        {kind === 'gauge' && ready ? '行动就绪' : num}
      </span>
    </div>
  )
}

function StorySceneView() {
  const data = useGame((s) => s.data)
  const reply = useGame((s) => s.storyReply)
  const choose = useGame((s) => s.storyChoose)
  const cont = useGame((s) => s.storyContinue)
  const scene = STORY[data.storyStep]
  if (!scene) return null
  const paragraphs = reply ?? scene.text

  return (
    <div className="story">
      <div className="story-text">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {reply ? (
        <button className="primary-btn story-continue" onClick={cont}>继续</button>
      ) : scene.choices ? (
        <div className="story-choices">
          {scene.choices.map((c, i) => (
            <button key={i} className="story-choice" onClick={() => choose(i)}>
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <button className="primary-btn story-continue" onClick={cont}>
          {scene.continueLabel ?? '继续'}
        </button>
      )}
    </div>
  )
}

function EventView() {
  const data = useGame((s) => s.data)
  const pendingEvent = useGame((s) => s.pendingEvent)
  const eventResult = useGame((s) => s.eventResult)
  const choose = useGame((s) => s.eventChoose)
  const cont = useGame((s) => s.eventContinue)
  const event = pendingEvent ? eventById(pendingEvent) : null
  if (!event) return null

  return (
    <div className="event-view">
      <div className="event-title">{event.title}</div>
      <div className="story-text">
        {(eventResult ? [eventResult] : event.text).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {eventResult ? (
        <button className="primary-btn story-continue" onClick={cont}>继续</button>
      ) : (
        <div className="story-choices">
          {event.choices.map((c, i) => {
            const blocked = choiceBlockedReason(data, c.effects)
            return (
              <button
                key={i}
                className="story-choice"
                disabled={!!blocked}
                onClick={() => choose(i)}
              >
                <span className="story-choice-label">
                  {c.label}
                  {blocked && <span className="choice-note">（{blocked}）</span>}
                </span>
                <span className="choice-effects">
                  {eventEffectSummary(c.effects, data, event.expCapTier)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusRail() {
  const data = useGame((s) => s.data)
  const battle = useGame((s) => s.battle)
  const setModal = useGame((s) => s.setModal)
  const staminaMax = maxStamina(data.skills.physique.tier)
  const spiritMax = maxSpirit(data.skills.will.tier)
  const hpMax = maxHp(data.skills.physique.tier)
  return (
    <aside className="sidebar">
      <div className="side-title">状态</div>
      <Meter label="生命" value={battle ? battle.playerHp : data.hp} max={hpMax} kind="hp" />
      <Meter label="体力" value={data.stamina} max={staminaMax} kind="stamina" />
      <Meter label="精神" value={data.spirit} max={spiritMax} kind="spirit" />
      <Meter label="心情" value={data.mood} max={100} kind="mood" />
      <Meter label="魔力" value={data.mana} max={100} kind="mana" />
      <div className="side-buff">药剂　{combatBuffText(data) || '无'}</div>
      <div className="side-sep" />
      <div className="side-menu">
        <button className="side-menu-btn full" onClick={() => setModal('stats')}>属性</button>
        <button className="side-menu-btn full" onClick={() => setModal('relations')}>关系</button>
        <button className="side-menu-btn" onClick={() => setModal('inventory')}>物品</button>
        <button className="side-menu-btn" onClick={() => setModal('log')}>日志</button>
        <button className="side-menu-btn" onClick={() => setModal('save')}>存档</button>
        <button className="side-menu-btn" onClick={() => setModal('debug')}>调试</button>
      </div>
    </aside>
  )
}

type MeterKind = 'hp' | 'stamina' | 'spirit' | 'mood' | 'mana'

function Meter({ label, value, max, kind }: { label: string; value: number; max: number; kind: MeterKind }) {
  const desc = meterDesc(value, max, kind)
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))
  return (
    <div className="meter">
      <div className="meter-head">
        <span className="meter-label">{label}</span>
        <span className={`meter-desc ${desc.tone}`}>{desc.text}</span>
      </div>
      <div className="bar">
        <div className={`bar-fill ${desc.tone} ${kind}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="meter-num">{Math.round(value)} / {max}</div>
    </div>
  )
}

function meterDesc(value: number, max: number, kind: MeterKind) {
  if (kind === 'hp') {
    const pct = (value / Math.max(1, max)) * 100
    if (pct >= 80) return { text: '你身上没什么伤。', tone: 'good' }
    if (pct >= 50) return { text: '你身上有些擦伤。', tone: 'neutral' }
    if (pct >= 25) return { text: '你伤得不轻。', tone: 'warn' }
    return { text: '你快站不住了。', tone: 'bad' }
  }
  if (kind === 'mood') {
    if (value >= 80) return { text: '你心情不错。', tone: 'good' }
    if (value >= 50) return { text: '你还算平静。', tone: 'neutral' }
    if (value >= 30) return { text: '你有些提不起劲。', tone: 'warn' }
    return { text: '你心里堵得慌。', tone: 'bad' }
  }
  if (kind === 'mana') {
    if (value >= 80) return { text: '魔力充盈。', tone: 'good' }
    if (value >= 50) return { text: '魔力尚可。', tone: 'neutral' }
    if (value >= 25) return { text: '魔力有些枯竭。', tone: 'warn' }
    return { text: '魔力几乎见底。', tone: 'bad' }
  }
  const pct = (value / Math.max(1, max)) * 100
  if (kind === 'spirit') {
    if (pct >= 80) return { text: '你思路清晰。', tone: 'good' }
    if (pct >= 50) return { text: '你还能集中。', tone: 'neutral' }
    if (pct >= 25) return { text: '你有些头昏。', tone: 'warn' }
    return { text: '你几乎无法思考。', tone: 'bad' }
  }
  if (pct >= 80) return { text: '你体力充足。', tone: 'good' }
  if (pct >= 50) return { text: '你还有力气。', tone: 'neutral' }
  if (pct >= 25) return { text: '你有点累了。', tone: 'warn' }
  return { text: '你快撑不住了。', tone: 'bad' }
}

function Actions({
  segment,
  meal,
  onPickNpc,
}: {
  segment: ReturnType<typeof classSegmentAt>
  meal: string | null
  onPickNpc: (id: string) => void
}) {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const attendClass = useGame((s) => s.attendClass)
  const slackClass = useGame((s) => s.slackClass)
  const previewClass = useGame((s) => s.previewClass)
  const eat = useGame((s) => s.eat)
  const rest = useGame((s) => s.rest)
  const workShop = useGame((s) => s.workShop)
  const workPotionWorkshop = useGame((s) => s.workPotionWorkshop)
  const workTavern = useGame((s) => s.workTavern)
  const listenTavern = useGame((s) => s.listenTavern)
  const pray = useGame((s) => s.pray)
  const meditate = useGame((s) => s.meditate)
  const walkPlaza = useGame((s) => s.walkPlaza)
  const readPlazaNotices = useGame((s) => s.readPlazaNotices)
  const feedPigeons = useGame((s) => s.feedPigeons)
  const searchLibrary = useGame((s) => s.searchLibrary)
  const startExam = useGame((s) => s.startExam)
  const startOpenExamPackage = useGame((s) => s.startOpenExamPackage)
  const acceptWestCommission = useGame((s) => s.acceptWestCommission)
  const doWestCommission = useGame((s) => s.doWestCommission)
  const doWestGeneric = useGame((s) => s.doWestGeneric)
  const listenWestRumors = useGame((s) => s.listenWestRumors)
  const westLookout = useGame((s) => s.westLookout)
  const westPatrol = useGame((s) => s.westPatrol)
  const doGuildJob = useGame((s) => s.doGuildJob)
  const startEscort = useGame((s) => s.startEscort)
  const returnFromEscort = useGame((s) => s.returnFromEscort)
  const helpBackyard = useGame((s) => s.helpBackyard)
  const teleport = useGame((s) => s.teleport)
  const helpOrphanKids = useGame((s) => s.helpOrphanKids)
  const joinRite = useGame((s) => s.joinRite)
  const prepareRite = useGame((s) => s.prepareRite)
  const sweepGrave = useGame((s) => s.sweepGrave)
  const walkForest = useGame((s) => s.walkForest)
  const exploreForestDeep = useGame((s) => s.exploreForestDeep)
  const gatherHerbs = useGame((s) => s.gatherHerbs)
  const careHerbs = useGame((s) => s.careHerbs)
  const tidyDonations = useGame((s) => s.tidyDonations)
  const careForPatients = useGame((s) => s.careForPatients)
  const treatAtRelief = useGame((s) => s.treatAtRelief)
  const volunteerAtRelief = useGame((s) => s.volunteerAtRelief)
  const climbBellTower = useGame((s) => s.climbBellTower)
  const storyTarget = useGame((s) => s.storyTarget)
  const storyRoute = useGame((s) => s.storyRoute)
  const storyWait = useGame((s) => s.storyWait)
  const wait = useGame((s) => s.wait)
  const loc = data.location
  const examDay = isExamDay(data.day)
  const examCourses = examDay ? examCoursesForYear(currentYear(data.day)) : []
  const examResultFor = (courseId: string) =>
    data.examPackages.find((p) => p.kind === 'monthly' && p.day === data.day)?.results[
      courseId
    ]
  const examActions = (
    <>
      <div className="hint">今天是月考日，课程暂停。</div>
      {examCourses
        .filter((course) => courseExamLocationOn(course, data.day) === loc)
        .map((course) => {
          const result = examResultFor(course.id)
          if (result) {
            return (
              <div className="hint" key={course.id}>
                {course.name} 已考完。
              </div>
            )
          }
          if (data.minutes < course.start) {
            return (
              <div className="hint" key={course.id}>
                {course.name} 考试 {formatTime(course.start)} 开始。
              </div>
            )
          }
          if (data.minutes >= course.start + 30) {
            return (
              <div className="hint" key={course.id}>
                {course.name} 入场时间已过，按缺考处理。
              </div>
            )
          }
          return (
            <ActionBtn
              key={course.id}
              onClick={() => startExam(course.id)}
              label={`参加考试 · ${course.name}`}
              cost={`${(course.end - course.start) / 60} 小时 · 开考后 30 分钟内入场`}
            />
          )
        })}
    </>
  )
  const lecturePlan = loc === 'lecture' ? lecturePreviewPlan(data.day, data.minutes) : null
  const westPeriod = supportPeriodAt(data.day)
  const canDoWest = (id: string) =>
    data.west.accepted.includes(id) && !data.west.done.includes(id)
  const westCommissionBtn = (id: string) => {
    if (!canDoWest(id)) return null
    const def = WEST_COMMISSIONS[id]
    if (!def) return null
    return (
      <ActionBtn
        key={id}
        onClick={() => doWestCommission(id)}
        label={def.name}
        cost={`${def.minutes} 分钟 · 体力 -${def.stamina}`}
      />
    )
  }
  const westGenericBtns = (location: string) => {
    if (!westPeriod) return null
    return WEST_GENERICS.filter((g) => g.location === location).map((g) => (
      <ActionBtn
        key={g.id}
        onClick={() => doWestGeneric(g.id)}
        label={g.name}
        cost={
          data.west.stage === 0
            ? `${WEST_GENERIC_MINUTES} 分钟 · 体力 -${WEST_GENERIC_STAMINA} · 建设值 +${WEST_GENERIC_CONSTRUCTION} · 支援点 +${WEST_GENERIC_POINTS}`
            : `${WEST_GENERIC_MINUTES} 分钟 · 体力 -${WEST_GENERIC_STAMINA} · 支援点 +${WEST_GENERIC_POINTS}`
        }
      />
    ))
  }
  const guildEscort = guildEscortForDay(data.day)
  const guildJobBtn = (id: 'haul' | 'errand' | 'inventory') => {
    if (!data.guild.accepted.includes(id) || data.guild.done.includes(id)) return null
    const def = GUILD_JOB_DEFS[id]
    return (
      <ActionBtn
        key={id}
        onClick={() => doGuildJob(id)}
        label={def.name}
        cost={`${def.minutes} 分钟 · 体力 -${def.stamina} · ${def.money} 铜`}
      />
    )
  }
  const remain = segment ? segment.segmentEnd - data.minutes : 0
  const nextClass = nextClassStart(loc, data.day, data.minutes)
  const waitToClass = nextClass === null ? null : nextClass - data.minutes
  const canWaitToClass = waitToClass !== null && waitToClass > 0 && waitToClass <= 30
  const physicalClass = segment ? courseById(segment.courseId)?.kind === 'physical' : false
  const canteenFee = loc === 'canteen' && isVacation(data.day) ? ACADEMY_MEAL_FEE : 0
  const ritePhase = loc === 'chapel' ? ritePhaseAt(data.day, data.minutes) : null
  const riteDone = ritePhase ? ritePhaseDone(data.rite, data.day, ritePhase.key) : false
  const ritePrep = loc === 'chapel' ? ritePrepAt(data.day, data.minutes) : null
  const classActions = segment ? (
    <>
      <ActionBtn
        onClick={attendClass}
        label={`${physicalClass ? '训练' : '听课'} · ${segment.label}`}
        cost={
          remain >= 15
            ? `${remain} 分钟 · ${physicalClass ? '体力 -3' : `精神 -${spiritCost(2, data.mood)}`}`
            : `${remain} 分钟 · 无收益`
        }
      />
      <ActionBtn onClick={slackClass} label="摸鱼" cost={`${remain} 分钟`} />
    </>
  ) : null

  if (storyTarget !== null) {
    if (storyRoute.length > 0) return null
    const scene = STORY[storyTarget]
    const remain = Math.max(0, scene.time - data.minutes)
    return (
      <div className="actions">
        <div className="section-title">行动</div>
        <ActionBtn
          onClick={storyWait}
          label={`等到 ${formatTime(scene.time)}`}
          cost={`${remain} 分钟`}
        />
      </div>
    )
  }

  return (
    <div className="actions">
      <div className="section-title">行动</div>
      {examDay && loc !== 'lecture' && loc !== 'yard' && (
        <div className="hint">今天是月考日。考试在讲堂与演武场进行。</div>
      )}
      {loc === 'lecture' && (
        examDay ? (
          examActions
        ) : segment ? (
          classActions
        ) : lecturePlan?.ok ? (
          <ActionBtn
            onClick={previewClass}
            label={`预习 · ${lecturePlan.subject}`}
            cost={`${lecturePlan.minutes} 分钟 · 精神 -${spiritCost(3, data.mood)}`}
          />
        ) : (
          <>
            <div className="hint">{lecturePlan?.reason ?? '现在没有课。'}</div>
            {canWaitToClass && lecturePlan && !lecturePlan.ok && (
              <ActionBtn
                onClick={() => wait(waitToClass!)}
                label="等到上课"
                cost={`${waitToClass} 分钟 · ${formatTime(nextClass!)}`}
              />
            )}
          </>
        )
      )}
      {loc === 'library' && (
        <ActionBtn
          onClick={() => setModal('study')}
          label="自习"
          cost={`0.5 小时 · 精神 -${spiritCost(3, data.mood)}`}
        />
      )}
      {loc === 'library' && <ActionBtn onClick={() => setModal('reading')} label="阅读" cost="0.5 小时" />}
      {loc === 'library' && (
        <ActionBtn onClick={searchLibrary} label="翻阅藏书" cost="0.5 小时 · 体力 -2" />
      )}
      {(loc === 'canteen' || loc === 'orphanCanteen') &&
        (() => {
          if (!meal) return <div className="hint">现在不是用餐时间。</div>
          const key = mealKeyFor(meal)
          if (key && data.meals.day === data.day && data.meals[key]) {
            return <div className="hint">你已经吃过{meal}了。</div>
          }
          if (canteenFee > 0 && data.money < canteenFee) {
            return <div className="hint">吃饭需要 {canteenFee} 铜。</div>
          }
          return (
            <ActionBtn
              onClick={eat}
              label={`吃饭 · ${meal}`}
              cost={`0.5 小时 · 体力 +12${canteenFee > 0 ? ` · ${canteenFee} 铜` : ''}`}
            />
          )
        })()}
      {loc === 'yard' && (
        examDay ? (
          examActions
        ) : segment ? (
          classActions
        ) : (
          <>
            <div className="hint">现在没有体术课。</div>
            <ActionBtn onClick={() => setModal('practice')} label="练习" cost="0.5 小时 · 体力 -4" />
            <ActionBtn onClick={() => setModal('battleSelect')} label="切磋" cost="木桩 / 练习人偶" />
            {canWaitToClass && (
              <ActionBtn
                onClick={() => wait(waitToClass!)}
                label="等到上课"
                cost={`${waitToClass} 分钟 · ${formatTime(nextClass!)}`}
              />
            )}
          </>
        )
      )}
      {segment && (loc === 'brewery' || loc === 'herbGarden') && classActions}
      {loc === 'backyard' && (
        <>
          <ActionBtn onClick={helpBackyard} label="打理后院" cost="2 小时 · 体力 -10" />
          <ActionBtn onClick={() => setModal('practice')} label="练习" cost="0.5 小时" />
        </>
      )}
      {loc === 'town' && (
        <>
          <ActionBtn onClick={readPlazaNotices} label="看告示" cost="5 分钟" />
          <ActionBtn onClick={feedPigeons} label="喂鸽子" cost="5 分钟 · 1 铜" />
          <ActionBtn onClick={walkPlaza} label="散步" cost="15 分钟 · 体力 -1" />
        </>
      )}
      {(loc === 'dorm' || loc === 'westInn') && <ActionBtn onClick={() => setModal('sleep')} label="睡觉" cost="1 小时起" />}
      {loc === 'westGate' && <ActionBtn onClick={() => setModal('shop')} label="小摊" cost="—" />}
      {loc === 'westGate' && (
        <ActionBtn onClick={() => setModal('westBoard')} label="查看委托板" cost="—" />
      )}
      {loc === 'westGate' && westCommissionBtn('wall')}
      {loc === 'westGate' && westCommissionBtn('ditch')}
      {loc === 'westGate' && westCommissionBtn('maintenance')}
      {loc === 'westGate' && westGenericBtns('westGate')}
      {loc === 'westInn' && (
        <ActionBtn onClick={() => setModal('westRecord')} label="工程记录" cost="—" />
      )}
      {loc === 'westInn' && westCommissionBtn('care')}
      {loc === 'westInn' && westGenericBtns('westInn')}
      {loc === 'westMarket' && (
        <ActionBtn onClick={() => setModal('shop')} label="补给摊" cost="—" />
      )}
      {loc === 'westMarket' && (
        <ActionBtn onClick={listenWestRumors} label="听镇民说话" cost="15 分钟" />
      )}
      {loc === 'westMarket' && westCommissionBtn('lamp')}
      {loc === 'westMarket' && westGenericBtns('westMarket')}
      {loc === 'westEdge' && westCommissionBtn('patrol')}
      {loc === 'westTower' && data.west.stage < 1 && westGenericBtns('westTower')}
      {loc === 'westTower' && data.west.stage >= 1 && (
        <>
          <ActionBtn onClick={westLookout} label="远望" cost="5 分钟" />
          <ActionBtn onClick={westPatrol} label="巡逻" cost="2 小时 · 体力 -10" />
        </>
      )}
      {loc === 'academy' && (
        <ActionBtn onClick={() => setModal('academyBoard')} label="查看告示板" cost="—" />
      )}
      {loc === 'guild' && (
        <ActionBtn onClick={() => setModal('guildBoard')} label="查看委托板" cost="—" />
      )}
      {loc === 'guild' && guildJobBtn('haul')}
      {loc === 'guild' && guildJobBtn('errand')}
      {loc === 'guild' && guildJobBtn('inventory')}
      {loc === 'gate' &&
        data.guild.accepted.includes('escort') &&
        !data.guild.done.includes('escort') &&
        !data.guild.escort && (
          <ActionBtn
            onClick={startEscort}
            label={`开始护送 · ${guildEscort.name}`}
            cost={`${guildEscort.segments * 30} 分钟 · 体力 -12`}
          />
        )}
      {['oldStation', 'forestDepot', 'eastFarm'].includes(loc) && (
        <ActionBtn onClick={returnFromEscort} label="返回城门" cost="1 小时" />
      )}
      {loc === 'dorm' && <ActionBtn onClick={meditate} label="冥想" cost="1 小时" />}
      {loc === 'dorm' && <ActionBtn onClick={() => setModal('bookshelf')} label="书柜" cost="—" />}
      {loc === 'dorm' && data.workshop.brewKitUntilDay > data.day && (
        <ActionBtn
          onClick={() => setModal('brew')}
          label="炼药"
          cost={`30 分钟 · 炼药工具剩余 ${data.workshop.brewKitUntilDay - data.day} 天`}
        />
      )}
      {loc === 'dorm' &&
        (() => {
          const pkg = data.examPackages.find((p) => p.received && !p.opened)
          return pkg ? (
            <ActionBtn
              onClick={() => startOpenExamPackage(pkg.id)}
              label="拆开包裹"
              cost="—"
            />
          ) : null
        })()}
      {loc === 'shop' && (
        <>
          <ActionBtn onClick={() => setModal('shop')} label="购买" cost="—" />
          <ActionBtn onClick={workShop} label="打工" cost="2 小时 · 体力 -10" />
        </>
      )}
      {loc === 'potionWorkshop' &&
        (isTimeWindow(data.minutes, WORKSHOP_OPEN_START, WORKSHOP_OPEN_END) ? (
          <>
            <ActionBtn onClick={() => setModal('shop')} label="买卖药剂" cost="—" />
            <ActionBtn onClick={() => setModal('workshop')} label="租借与请教" cost="—" />
            <ActionBtn
              onClick={workPotionWorkshop}
              label="打临时工"
              cost={`${WORKSHOP_WORK_MINUTES / 60} 小时 · 体力 -${WORKSHOP_WORK_STAMINA} · 精神 -${WORKSHOP_WORK_SPIRIT} · 报酬 ${workshopPayForTier(
                data.skills.alchemy.tier,
              )} 铜`}
            />
          </>
        ) : (
          <div className="hint">工坊已经关门了。</div>
        ))}
      {loc === 'bookshop' && (
        <ActionBtn onClick={() => setModal('shop')} label="买书" cost="—" />
      )}
      {loc === 'weaponShop' && (
        <ActionBtn onClick={() => setModal('shop')} label="购买" cost="—" />
      )}
      {loc === 'tavern' &&
        (() => {
          if (!isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_OPEN_END)) {
            return <div className="hint">酒馆已经打烊了。</div>
          }
          if (!isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_DRINK_END)) {
            return <div className="hint">快打烊了。</div>
          }

          const workOpen = isTimeWindow(data.minutes, TAVERN_WORK_START, TAVERN_WORK_END)
          const talkOpen = isTimeWindow(data.minutes, TAVERN_TALK_START, TAVERN_TALK_END)
          const beforeWork = isTimeWindow(data.minutes, TAVERN_OPEN_START, TAVERN_WORK_START)
          const afterTalk = isTimeWindow(data.minutes, TAVERN_TALK_END, TAVERN_OPEN_END)

          return (
            <>
              {workOpen ? (
                <ActionBtn onClick={workTavern} label="打工" cost="2 小时 · 体力 -10" />
              ) : (
                <div className="hint">
                  {beforeWork ? '再晚一点才热闹。' : '今晚的活已经干完了。'}
                </div>
              )}
              <ActionBtn onClick={() => setModal('drinks')} label="来一杯" cost="10–15 分钟" />
              {talkOpen ? (
                <ActionBtn
                  onClick={listenTavern}
                  label="听人聊天"
                  cost={
                    data.skills.knowledge.tier < 1
                      ? '15 分钟 · 可能获得学识'
                      : '15 分钟 · 心情 +1'
                  }
                />
              ) : (
                <div className="hint">
                  {afterTalk ? '客人已经散得差不多了。' : '再晚一点才热闹。'}
                </div>
              )}
            </>
          )
        })()}
      {loc === 'chapel' && <ActionBtn onClick={pray} label="祷告" cost="0.5 小时" />}
      {loc === 'chapel' && <ActionBtn onClick={meditate} label="冥想" cost="1 小时" />}
      {loc === 'relief' &&
        (() => {
          if (!isTimeWindow(data.minutes, RELIEF_OPEN_START, RELIEF_OPEN_END)) {
            return <div className="hint">救济院已经熄灯了。</div>
          }
          const hasPatients = reliefHasPatients(data.day)
          const cared = data.relief.day === data.day && data.relief.cared
          const treated = data.relief.day === data.day && data.relief.treated
          const volunteered = data.relief.day === data.day && data.relief.volunteered
          const hpMax = maxHp(data.skills.physique.tier)
          return (
            <>
              <ActionBtn
                onClick={tidyDonations}
                label="整理捐赠"
                cost={`${RELIEF_TIDY_MINUTES} 分钟 · 体力 -${RELIEF_TIDY_STAMINA}`}
              />
              {hasPatients ? (
                cared ? (
                  <div className="hint">今天已经照顾过了。病人已经休息了。</div>
                ) : (
                  <ActionBtn
                    onClick={careForPatients}
                    label="照顾病人"
                    cost={`${RELIEF_CARE_MINUTES} 分钟 · 体力 -${RELIEF_CARE_STAMINA}`}
                  />
                )
              ) : (
                <div className="hint">今天救济院很安静，床位都空着。</div>
              )}
              {treated ? (
                <div className="hint">今天已经接受过治疗了。</div>
              ) : data.hp >= hpMax ? (
                <div className="hint">你现在不需要治疗。</div>
              ) : data.money < RELIEF_TREAT_COST ? (
                <div className="hint">治疗需要 {RELIEF_TREAT_COST} 铜。</div>
              ) : (
                <ActionBtn
                  onClick={treatAtRelief}
                  label="接受治疗"
                  cost={`${RELIEF_TREAT_MINUTES} 分钟 · ${RELIEF_TREAT_COST} 铜 · 生命 +${RELIEF_TREAT_HP}`}
                />
              )}
              {data.flags.church_volunteer &&
                (volunteered ? (
                  <div className="hint">今天已经帮过忙了。</div>
                ) : isTimeWindow(data.minutes, RELIEF_VOLUNTEER_START, RELIEF_VOLUNTEER_END) ? (
                  <ActionBtn
                    onClick={volunteerAtRelief}
                    label="义工"
                    cost={`${RELIEF_VOLUNTEER_MINUTES / 60} 小时 · +${RELIEF_VOLUNTEER_PAY} 铜`}
                  />
                ) : (
                  <div className="hint">这个时间救济院不需要帮手。</div>
                ))}
            </>
          )
        })()}
      {loc === 'orphanage' &&
        (isVacation(data.day) ? (
          data.vacation.day === data.day && data.vacation.kids ? (
            <div className="hint">今天已经陪过孩子们了。</div>
          ) : (
            <ActionBtn onClick={helpOrphanKids} label="陪孩子们" cost="1 小时 · 体力 -3 · 心情 +2" />
          )
        ) : null)}
      {loc === 'chapel' && ritePrep && (
        <ActionBtn
          onClick={prepareRite}
          label="圣祷准备"
          cost={`${ritePrep.night ? '2 小时' : '1 小时'} · 体力 -${ritePrep.night ? 7 : 4} · 心情 +${ritePrep.night ? 2 : 1}`}
        />
      )}
      {loc === 'chapel' &&
        ritePhase &&
        (riteDone ? (
          <div className="hint">这一段已经参加过了。</div>
        ) : (
          <ActionBtn
            onClick={joinRite}
            label={`参加${ritePhase.night === 'summer' ? '夏夜圣祷' : ritePhase.night === 'winter' ? '冬夜圣祷' : '圣祷'} · ${ritePhase.name}`}
            cost={`${Math.min(30, ritePhase.end - data.minutes)} 分钟 · 精神 +${ritePhase.night ? 2 : 1} · 心情 +${ritePhase.night ? 2 : 1}`}
          />
        ))}
      {loc === 'teleportRoom' &&
        (currentYear(data.day) >= TELEPORT_YEAR ? (
          <ActionBtn onClick={() => teleport('west')} label="前往边区小镇" cost="即时" />
        ) : (
          <div className="hint">传送阵还没有对你开放。</div>
        ))}
      {loc === 'westGate' && (
        <ActionBtn onClick={() => teleport('town')} label="返回长明学院" cost="即时" />
      )}
      {loc === 'bellTower' &&
        (isTimeWindow(data.minutes, BELL_TOWER_OPEN_START, BELL_TOWER_OPEN_END) ? (
          <ActionBtn
            onClick={climbBellTower}
            label="登钟楼"
            cost={`${BELL_TOWER_MINUTES} 分钟 · 体力 -${BELL_TOWER_STAMINA}`}
          />
        ) : (
          <div className="hint">钟楼的门锁着。</div>
        ))}
      {loc === 'gate' && !isGateOpen(data.minutes) && (
        <div className="hint">城门已经关了。</div>
      )}
      {loc === 'cemetery' && (
        <ActionBtn
          onClick={sweepGrave}
          label="扫墓"
          cost={`${CEMETERY_SWEEP_MINUTES} 分钟 · 体力 -${CEMETERY_SWEEP_STAMINA} · 心情 +${CEMETERY_SWEEP_MOOD}`}
        />
      )}
      {loc === 'forest' && (
        <ActionBtn
          onClick={walkForest}
          label="走走"
          cost={`${FOREST_WALK_MINUTES} 分钟 · 体力 -${FOREST_WALK_STAMINA} · 心情 +${FOREST_WALK_MOOD}`}
        />
      )}
      {loc === 'forestDeep' && (
        <>
          <ActionBtn onClick={exploreForestDeep} label="探索" cost="30 分钟 · 体力 -6" />
          <ActionBtn onClick={gatherHerbs} label="采药" cost="30 分钟 · 体力 -3 · 种植 +1" />
        </>
      )}
      {loc === 'herbGarden' && !segment && (
        <>
          <ActionBtn
            onClick={careHerbs}
            label="照料药草"
            cost="30 分钟 · 体力 -2 · 种植 +1 · 心情 +1"
          />
          {canWaitToClass && (
            <ActionBtn
              onClick={() => wait(waitToClass!)}
              label="等到上课"
              cost={`${waitToClass} 分钟 · ${formatTime(nextClass!)}`}
            />
          )}
        </>
      )}
      {loc === 'brewery' && !segment && (
        <>
          <ActionBtn onClick={() => setModal('brew')} label="炼药" cost="30 分钟 · 体力 -2 · 精神 -1" />
          {canWaitToClass && (
            <ActionBtn
              onClick={() => wait(waitToClass!)}
              label="等到上课"
              cost={`${waitToClass} 分钟 · ${formatTime(nextClass!)}`}
            />
          )}
        </>
      )}
      {data.stamina < REST_THRESHOLD && (
        <ActionBtn onClick={rest} label="原地休息" cost="30 分钟" />
      )}
      <ActionBtn onClick={() => setModal('wait')} label="等待" cost="5 分钟起" />
      <PeopleHere onPick={onPickNpc} />
    </div>
  )
}

function PeopleHere({ onPick }: { onPick: (id: string) => void }) {
  const data = useGame((s) => s.data)
  const people = npcsAt(data.location, data.day, data.minutes)
  if (people.length === 0) return null
  return (
    <>
      <div className="section-title">人物</div>
      <div className="people-list">
        {people.map((npc) => (
          <button key={npc.id} className="person-btn" onClick={() => onPick(npc.id)}>
            <span className="person-name">{npc.name}</span>
            <span className="person-title">{npc.title}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function NpcView({ npcId, onLeave }: { npcId: string; onLeave: () => void }) {
  const data = useGame((s) => s.data)
  const message = useGame((s) => s.message)
  const chat = useGame((s) => s.chatWithNpc)
  const npc = npcById(npcId)
  if (!npc) return null
  const isFamiliarity = npc.relationship === 'familiarity'
  const value = isFamiliarity ? data.familiarity[npc.id] ?? 0 : data.affinity[npc.id] ?? 0
  const tier = socialTier(value)
  const today = data.social.day === data.day ? data.social.counts[npc.id] ?? 0 : 0

  return (
    <div className="npc-view">
      <div className="npc-head">
        <span className="npc-name">{npc.name}</span>
        <span className="npc-title">{npc.title}</span>
      </div>
      <div className="npc-meta">
        {!isFamiliarity && (
          <>
            <span className="npc-aff">好感 {value}</span>
            <span className="npc-hearts">{heartsText(value)}</span>
          </>
        )}
        <span className="npc-today">今日{today >= 1 ? '已聊' : '未聊'}</span>
      </div>
      {!isFamiliarity && <div className="npc-impression">{npc.impression[tier]}</div>}
      <div className="narration">{npc.status}</div>
      {message && <div className="message">{message}</div>}
      <div className="actions">
        <div className="section-title">行动</div>
        <ActionBtn
          onClick={() => {
            if (!chat(npc.id)) onLeave()
          }}
          label="闲聊"
          cost="15 分钟"
        />
        <button className="action-btn" onClick={onLeave}>
          <span className="action-label">离开</span>
          <span className="action-cost">返回{getLocation(data.location).name}</span>
        </button>
      </div>
      {today >= 1 && (
        <div className="hint">
          {isFamiliarity ? '今天已经聊过了。再聊只是闲聊。' : '今天已经聊过了。再聊不会增加好感。'}
        </div>
      )}
    </div>
  )
}

function ActionBtn({ label, cost, onClick }: { label: string; cost: string; onClick: () => void }) {
  return (
    <button className="action-btn" onClick={onClick}>
      <span className="action-label">{label}</span>
      <span className="action-cost">{cost}</span>
    </button>
  )
}

function CityMap({ location }: { location: string }) {
  if (!isCityArea(location)) return null
  const near = new Set(areaNeighbors(location))
  const node = (id: string, cls = '') => {
    const loc = getLocation(id)
    const state = id === location ? 'current' : near.has(id) ? 'near' : 'far'
    return <span className={`map-node ${state} ${cls}`.trim()}>{loc.name}</span>
  }
  return (
    <div className="city-map" aria-label="银月城街区">
      {node('churchStreet', 'map-church')}
      {node('craftDistrict', 'map-craft')}
      <span className="map-line-v map-line-v-church" />
      <span className="map-line-v map-line-v-craft" />
      {node('orphanStreet', 'map-orphan')}
      <span className="map-line-h map-line-h-left" />
      {node('town', 'map-town')}
      <span className="map-line-h map-line-h-right" />
      {node('academyStreet', 'map-academy')}
      <span className="map-line-v map-line-v-town" />
      {node('commercial', 'map-commercial')}
      <span className="map-line-v map-line-v-gate" />
      {node('gate', 'map-gate')}
    </div>
  )
}

function MoveList({ restrictedTarget }: { restrictedTarget?: string | null }) {
  const data = useGame((s) => s.data)
  const moveTo = useGame((s) => s.moveTo)
  const storyTravel = useGame((s) => s.storyTravel)
  const loc = getLocation(data.location)

  if (restrictedTarget) {
    const target = getLocation(restrictedTarget)
    const step = exitsOf(data.location).find((e) => e.to === restrictedTarget)
    return (
      <div className="move-list">
        <div className="district">
          <div className="district-name">下一步</div>
          <button className="loc-btn" onClick={storyTravel}>
            <span>{target.name}</span>
            <span className="loc-cost">{step?.minutes ?? 5} 分</span>
          </button>
        </div>
      </div>
    )
  }

  const exits = exitsOf(data.location)
    .filter((e) => e.to !== data.location)
    .map((e) => ({ loc: getLocation(e.to), minutes: e.minutes }))

  const children = exits.filter((e) => e.loc.parent === loc.id)
  const back = exits.filter((e) => loc.parent !== undefined && e.loc.id === loc.parent)
  const adjacent = exits.filter((e) => loc.kind === 'area' && e.loc.kind === 'area')
  const shown = new Set([...children, ...back, ...adjacent].map((e) => e.loc.id))
  const others = exits.filter((e) => !shown.has(e.loc.id))
  const leave = [...back, ...others]

  const item = (target: Location, minutes: number) => (
    <button key={target.id} className="loc-btn" onClick={() => moveTo(target.id)}>
      <span>{target.name}</span>
      <span className="loc-cost">{minutes} 分</span>
    </button>
  )

  return (
    <div className="move-list">
      {children.length > 0 && (
        <div className="district">
          <div className="district-name">可访问地点</div>
          {children.map((e) => item(e.loc, e.minutes))}
        </div>
      )}
      {adjacent.length > 0 && (
        <div className="district">
          <div className="district-name">其他区域</div>
          {adjacent.map((e) => item(e.loc, e.minutes))}
        </div>
      )}
      {leave.length > 0 && (
        <div className="district">
          <div className="district-name">离开</div>
          {leave.map((e) => item(e.loc, e.minutes))}
        </div>
      )}
    </div>
  )
}

function ModalShell({
  title,
  children,
  onClose,
  wide,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className={`panel modal ${wide ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>{title}</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function defaultWakeTime(now: number): string {
  const target = Math.ceil((now + 480) / 5) * 5
  const m = ((target % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

function SleepModal() {
  const data = useGame((s) => s.data)
  const sleep = useGame((s) => s.sleep)
  const sleepUntil = useGame((s) => s.sleepUntil)
  const close = useGame((s) => s.setModal)
  const [wake, setWake] = useState(() => defaultWakeTime(data.minutes))
  const firstDay = data.day === 0
  const match = /^(\d{2}):(\d{2})$/.exec(wake)
  const target = match ? Number(match[1]) * 60 + Number(match[2]) : null
  let duration: number | null = null
  if (target !== null) {
    duration = target - data.minutes
    if (duration <= 0) duration += 1440
  }
  const timeError =
    duration === null
      ? '请选择时间。'
      : duration < SLEEP_MIN_MINUTES
        ? '至少睡 1 小时。'
        : duration > SLEEP_MAX_MINUTES
          ? '最多只能睡 12 小时。'
          : null

  return (
    <ModalShell title="睡觉" onClose={() => close(null)}>
      <p className="muted">
        可以在孤儿院寝室或支援队驻地睡觉。睡 7 小时以上会额外恢复体力与心情；少于{' '}
        {SLEEP_MIN_RECOVERY_MINUTES / 60} 小时只会跳过时间。
      </p>
      <div className="btn-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
          <button
            key={h}
            className="choice-btn"
            disabled={firstDay && h !== 8}
            onClick={() => sleep(h)}
          >
            {h} 小时
          </button>
        ))}
      </div>
      {firstDay ? (
        <p className="hint">第一天只能睡 8 小时。</p>
      ) : (
        <>
          <div className="sleep-time-row">
            <span className="sleep-time-label">睡到</span>
            <input
              className="sleep-time-input"
              type="time"
              step={300}
              value={wake}
              onChange={(e) => setWake(e.target.value)}
            />
            <button
              className="choice-btn sleep-time-btn"
              disabled={!!timeError}
              onClick={() => {
                if (target !== null && !timeError) sleepUntil(target)
              }}
            >
              睡觉
            </button>
          </div>
          {timeError && <p className="hint">{timeError}</p>}
        </>
      )}
    </ModalShell>
  )
}

function StudyModal() {
  const study = useGame((s) => s.study)
  const close = useGame((s) => s.setModal)
  return (
    <ModalShell title="自习" onClose={() => close(null)}>
      <p className="muted">选择一项内容，花 0.5 小时。</p>
      <div className="btn-grid">
        <button className="choice-btn" onClick={() => study('knowledge')}>学识</button>
        <button className="choice-btn" onClick={() => study('nature')}>自然系</button>
      </div>
    </ModalShell>
  )
}

function PracticeModal() {
  const practice = useGame((s) => s.practice)
  const location = useGame((s) => s.data.location)
  const close = useGame((s) => s.setModal)
  return (
    <ModalShell title="练习" onClose={() => close(null)}>
      <p className="muted">
        {location === 'backyard'
          ? '后院只能自行练习，不计入体术课程掌握度。'
          : '选择一项，花 0.5 小时，体力 -4。'}
      </p>
      <div className="btn-grid">
        <button className="choice-btn" onClick={() => practice('brawl')}>格斗</button>
        <button className="choice-btn" onClick={() => practice('sword')}>剑术</button>
      </div>
    </ModalShell>
  )
}

function BattleSelectModal() {
  const startBattle = useGame((s) => s.startBattle)
  const close = useGame((s) => s.setModal)
  return (
    <ModalShell title="演武场切磋" onClose={() => close(null)}>
      <p className="muted">切磋不会造成真正的伤害。生命归零只是判负。</p>
      <div className="battle-select-list">
        <button className="battle-select-row" onClick={() => startBattle('dummy')}>
          <span className="battle-select-name">木桩</span>
          <span className="battle-select-desc">不会还手。用来熟悉行动条和攻击方式。</span>
        </button>
        <button className="battle-select-row" onClick={() => startBattle('practice_dummy')}>
          <span className="battle-select-name">练习人偶</span>
          <span className="battle-select-desc">会还手。用来测试生命、魔力和火球术。</span>
        </button>
      </div>
    </ModalShell>
  )
}

function WaitModal() {
  const wait = useGame((s) => s.wait)
  const close = useGame((s) => s.setModal)
  return (
    <ModalShell title="等待" onClose={() => close(null)}>
      <p className="muted">推进时间，不会恢复或消耗体力、精神、心情、魔力。</p>
      <div className="btn-grid">
        {[5, 15, 30, 60].map((m) => (
          <button key={m} className="choice-btn" onClick={() => wait(m)}>
            {m === 60 ? '1 小时' : `${m} 分钟`}
          </button>
        ))}
      </div>
    </ModalShell>
  )
}

type PendingSaveAction = {
  action: 'overwrite' | 'load' | 'delete'
  slot: number | 'auto'
} | null

function SaveSlots({ mode, onTransfer }: { mode: 'title' | 'game'; onTransfer?: (kind: 'export' | 'import') => void }) {
  const battle = useGame((s) => s.battle)
  const saveSlot = useGame((s) => s.saveSlot)
  const loadSlot = useGame((s) => s.loadSlot)
  const removeSlot = useGame((s) => s.removeSlot)
  const setModal = useGame((s) => s.setModal)
  const savesRev = useGame((s) => s.savesRev)
  const saves = useMemo(() => listSaves(), [savesRev])
  const [pending, setPending] = useState<PendingSaveAction>(null)
  const isTitle = mode === 'title'

  const openTransfer = (kind: 'export' | 'import') => {
    if (onTransfer) onTransfer(kind)
    else setModal(kind)
  }

  const lastExport = getLastExport()
  const daysSinceExport =
    lastExport === null ? null : Math.floor((Date.now() - lastExport) / 86400000)
  const exportStale = lastExport === null || (daysSinceExport ?? 0) >= 7

  const slotLabel = (slot: number | 'auto') => (slot === 'auto' ? '自动存档' : `槽位 ${slot}`)

  const confirmPending = () => {
    if (!pending) return
    if (pending.action === 'overwrite' && typeof pending.slot === 'number') {
      saveSlot(pending.slot)
    } else if (pending.action === 'load') {
      loadSlot(pending.slot)
    } else if (pending.action === 'delete') {
      removeSlot(pending.slot)
    }
    setPending(null)
  }

  const confirmBlock = (slot: number | 'auto', oldSave: { name: string; ts: number } | null | undefined) => {
    if (!pending || pending.slot !== slot) return null
    const label = slotLabel(slot)
    let text = ''
    let confirmLabel = '确认'
    let danger = false
    if (pending.action === 'overwrite') {
      text = oldSave
        ? `${label} 已有存档：${oldSave.name} · ${formatSaveTime(oldSave.ts)}。覆盖后无法恢复。`
        : `${label} 已有存档，覆盖后无法恢复。`
      confirmLabel = '确认覆盖'
    } else if (pending.action === 'load') {
      text = `读取${label}？当前未保存的进度会丢失。`
      confirmLabel = '读取'
    } else {
      text = `删除${label}？删除后无法恢复。`
      confirmLabel = '确认删除'
      danger = true
    }
    return (
      <div className={`save-confirm ${danger ? 'danger' : ''}`}>
        <div className="save-confirm-text">{text}</div>
        <div className="save-confirm-actions">
          <button className={`mini-btn ${danger ? 'danger' : ''}`} onClick={confirmPending}>
            {confirmLabel}
          </button>
          <button className="mini-btn" onClick={() => setPending(null)}>
            取消
          </button>
        </div>
      </div>
    )
  }

  const doSave = (slot: number, existing: boolean) => {
    if (isTitle) return
    if (existing) setPending({ action: 'overwrite', slot })
    else saveSlot(slot)
  }

  const doLoad = (slot: number | 'auto') => {
    if (isTitle) loadSlot(slot)
    else setPending({ action: 'load', slot })
  }

  return (
    <>
      {battle && !isTitle && <p className="hint">战斗中无法存档或读档。</p>}
      <div className="save-export-status">
        <span>
          {lastExport === null ? '尚未导出过存档。' : `上次导出：${formatSaveTime(lastExport)}`}
        </span>
        {exportStale && (
          <button className="mini-btn" onClick={() => openTransfer('export')}>
            去导出
          </button>
        )}
      </div>
      {exportStale && (
        <p className="hint save-export-warn">
          {lastExport === null
            ? '建议导出一次。浏览器数据被清除时，存档无法恢复。'
            : `已经 ${daysSinceExport} 天没有导出存档了。`}
        </p>
      )}
      <div className="save-list">
        {Array.from({ length: SLOT_COUNT }, (_, i) => i + 1).map((slot) => {
          const s = saves[slot - 1]
          return (
            <div className="save-entry" key={slot}>
              <div className="save-row">
                <span className="save-slot">槽位 {slot}</span>
                <span className="save-info">{s ? `${s.name} · ${formatSaveTime(s.ts)}` : '空'}</span>
                <button
                  className="mini-btn"
                  onClick={() => doSave(slot, !!s)}
                  disabled={isTitle || !!battle}
                >
                  保存
                </button>
                <button
                  className="mini-btn"
                  onClick={() => doLoad(slot)}
                  disabled={!s || (!isTitle && !!battle)}
                >
                  读取
                </button>
                <button
                  className="mini-btn danger"
                  onClick={() => setPending({ action: 'delete', slot })}
                  disabled={!s}
                >
                  删
                </button>
              </div>
              {confirmBlock(slot, s)}
            </div>
          )
        })}
        <div className="save-entry">
          <div className="save-row auto">
            <span className="save-slot">自动</span>
            <span className="save-info">
              {saves[SLOT_COUNT] ? formatSaveTime(saves[SLOT_COUNT]!.ts) : '空'}
            </span>
            <button
              className="mini-btn"
              onClick={() => doLoad('auto')}
              disabled={!saves[SLOT_COUNT] || (!isTitle && !!battle)}
            >
              读取
            </button>
            <button
              className="mini-btn danger"
              onClick={() => setPending({ action: 'delete', slot: 'auto' })}
              disabled={!saves[SLOT_COUNT]}
            >
              删
            </button>
          </div>
          {confirmBlock('auto', saves[SLOT_COUNT])}
        </div>
        <div className="save-io-row">
          <button className="mini-btn" onClick={() => openTransfer('export')}>
            导出
          </button>
          <button className="mini-btn" onClick={() => openTransfer('import')}>
            导入
          </button>
        </div>
      </div>
    </>
  )
}

function PlazaNoticesModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const notices = plazaNotices(data.day, data.flags)
  return (
    <ModalShell title="广场告示" onClose={() => setModal(null)}>
      <div className="notice-list">
        {notices.map((n) => (
          <div className="notice-item" key={n.id}>
            <div className="notice-title">{n.title}</div>
            <div className="notice-body">{n.text}</div>
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

function BookshelfModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const takeBook = useGame((s) => s.takeBook)
  const storeBook = useGame((s) => s.storeBook)
  const shelf = Array.from({ length: 10 }, (_, i) => data.bookshelf[i] ?? null)
  const bagBooks = Object.entries(data.inventory).filter(
    ([id, qty]) => qty > 0 && !!BOOKS[id],
  )
  const progressOf = (id: string) => data.books[id]?.progress ?? 0

  return (
    <ModalShell title="书柜" wide onClose={() => setModal(null)}>
      <div className="book-section">
        <div className="inv-section-title">书柜（{data.bookshelf.length} / 10）</div>
        <div className="book-grid">
          {shelf.map((id, i) =>
            id ? (
              <button
                key={id}
                className="book-slot filled"
                title={`取出《${BOOKS[id]?.name ?? id}》`}
                onClick={() => takeBook(id)}
              >
                <ItemIcon id={id} size={30} />
                <span className="book-slot-name">{BOOKS[id]?.name ?? id}</span>
                <span className="book-slot-progress">{progressOf(id)}%</span>
              </button>
            ) : (
              <div className="book-slot empty" key={`empty-${i}`} />
            ),
          )}
        </div>
        <div className="hint">点击书柜里的书可以取出到背包。</div>
      </div>

      <div className="book-section">
        <div className="inv-section-title">背包里的书</div>
        {bagBooks.length === 0 ? (
          <div className="hint">背包里没有书。</div>
        ) : (
          <div className="book-bag-list">
            {bagBooks.map(([id]) => (
              <button
                key={id}
                className="book-row-btn"
                disabled={data.bookshelf.length >= 10}
                onClick={() => storeBook(id)}
              >
                <ItemIcon id={id} size={26} />
                <span>{BOOKS[id].name}</span>
                <span className="book-slot-progress">{progressOf(id)}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  )
}

function ReadingModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const readBook = useGame((s) => s.readBook)
  const books = Object.entries(data.inventory).filter(
    ([id, qty]) => qty > 0 && !!BOOKS[id],
  )

  return (
    <ModalShell title="阅读" onClose={() => setModal(null)}>
      {books.length === 0 ? (
        <p className="hint">你身上没有书。先回寝室书柜取一本。</p>
      ) : (
        <div className="reading-list">
          {books.map(([id]) => {
            const book = BOOKS[id]
            const state = data.books[id]
            const progress = state?.progress ?? 0
            const completed = !!state?.completed && !book.repeatable
            const locked = !!book.requiresFlag && !data.flags[book.requiresFlag]
            return (
              <div className="reading-item" key={id}>
                <div className="reading-head">
                  <span className="reading-name">{book.name}</span>
                  <span className="reading-progress">
                    {locked ? '看不懂' : completed ? '已读完' : `${progress}%`}
                  </span>
                </div>
                <div className="reading-desc">{book.desc}</div>
                <div className="reading-bar">
                  <div style={{ width: `${locked ? 0 : completed ? 100 : progress}%` }} />
                </div>
                <div className="reading-meta">
                  <span>30 分钟</span>
                  <span>{book.spiritCost ? `精神 -${book.spiritCost}` : '不耗精神'}</span>
                  <span>{book.repeatable ? '可重复阅读' : '一次性'}</span>
                </div>
                {locked && (
                  <div className="hint">
                    需要{book.requirementText ?? '更高的学识'}才能读懂。
                  </div>
                )}
                {completed && <div className="hint">已读完，重读没有收益。</div>}
                <button
                  className="primary-btn"
                  disabled={locked || completed}
                  onClick={() => readBook(id)}
                >
                  {locked ? '看不懂' : completed ? '重读 30 分钟' : '阅读 30 分钟'}
                </button>
              </div>
            )
          })}
        </div>
      )}
      <p className="hint">阅读会推进这本书的进度，达到 100% 时获得收益。</p>
    </ModalShell>
  )
}

function SavesModal() {
  const setModal = useGame((s) => s.setModal)
  return (
    <ModalShell title="存档" onClose={() => setModal(null)}>
      <SaveSlots mode="game" />
    </ModalShell>
  )
}

function ExportModal() {
  const setModal = useGame((s) => s.setModal)
  return (
    <ModalShell title="导出存档" onClose={() => setModal('save')}>
      <ExportPanel mode="game" />
    </ModalShell>
  )
}

function ImportModal() {
  const setModal = useGame((s) => s.setModal)
  return (
    <ModalShell title="导入存档" onClose={() => setModal('save')}>
      <ImportPanel mode="game" />
    </ModalShell>
  )
}

function ExportPanel({ mode }: { mode: 'title' | 'game' }) {
  const player = useGame((s) => s.player)
  const data = useGame((s) => s.data)
  const battle = useGame((s) => s.battle)
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)
  const android = isAndroidRuntime()
  const canCurrent = mode === 'game' && !battle

  const saveFile = (bundle: SaveBundle, name: string) => {
    const filename = `arcanum-${name}-${stampForFile()}.json`
    if (downloadText(filename, JSON.stringify(bundle, null, 2))) {
      markExported()
      setStatus(`已导出文件：${filename}`)
      setError('')
    } else {
      setError('文件导出失败，请改用文本导出。')
    }
  }

  const makeCurrentText = () => {
    setText(encodeBundle(buildCurrentBundle(player, data)))
    markExported()
    setStatus('已生成当前进度的存档文本。')
    setError('')
  }

  const makeAllText = () => {
    setText(encodeBundle(buildAllBundle()))
    markExported()
    setStatus('已生成全部手动槽位的存档文本。')
    setError('')
  }

  const copyText = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      markExported()
      setStatus('已复制到剪贴板。')
      setError('')
      return
    } catch {
      // 退回手动选中复制
    }
    const node = textRef.current
    if (node) {
      node.focus()
      node.select()
      try {
        if (document.execCommand('copy')) {
          markExported()
          setStatus('已复制到剪贴板。')
          setError('')
          return
        }
      } catch {
        // ignore
      }
    }
    setError('复制失败，请手动选中文本复制。')
  }

  const actionRow = (onFile: () => void, onText: () => void) => (
    <div className="io-actions">
      {!android && (
        <button className="mini-btn" onClick={onFile}>
          导出文件
        </button>
      )}
      <button className="mini-btn" onClick={onText}>
        生成文本
      </button>
      {android && (
        <button className="mini-btn" onClick={onFile}>
          导出文件
        </button>
      )}
    </div>
  )

  return (
    <>
      <div className="io-section">
        <div className="io-title">当前进度</div>
        {canCurrent ? (
          actionRow(
            () => saveFile(buildCurrentBundle(player, data), 'current'),
            makeCurrentText,
          )
        ) : (
          <div className="hint">
            {mode === 'title' ? '标题界面没有进行中的进度。' : '战斗中无法导出当前进度。'}
          </div>
        )}
      </div>

      <div className="io-section">
        <div className="io-title">全部手动槽位</div>
        {actionRow(() => saveFile(buildAllBundle(), 'slots'), makeAllText)}
      </div>

      <p className="hint">自动存档不参与导出，只会导出当前进度与 10 个手动槽位。</p>
      {android && <p className="hint">安卓上文件导出可能不可用，建议使用文本。</p>}

      {text && (
        <div className="io-section">
          <div className="io-title">存档文本</div>
          <textarea className="io-text" readOnly value={text} ref={textRef} />
          <div className="io-actions">
            <button className="mini-btn" onClick={copyText}>
              复制文本
            </button>
            <button
              className="mini-btn"
              onClick={() => {
                setText('')
                setStatus('')
              }}
            >
              清空
            </button>
          </div>
        </div>
      )}

      {status && <p className="hint">{status}</p>}
      {error && <p className="hint error-text">{error}</p>}
    </>
  )
}

type PendingImport =
  | { kind: 'current'; slot: number; bundle: SaveBundle; upgraded: boolean }
  | { kind: 'all'; bundle: SaveBundle; written: number[]; removed: number[]; upgraded: boolean }
  | null

function ImportPanel({ mode }: { mode: 'title' | 'game' }) {
  const refreshSaves = useGame((s) => s.refreshSaves)
  const [slot, setSlot] = useState(1)
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState<PendingImport>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const android = isAndroidRuntime()

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setText(String(reader.result ?? ''))
      setStatus(`已载入文件：${file.name}`)
      setError('')
      setPending(null)
    }
    reader.readAsText(file)
  }

  const applyCurrent = (bundle: SaveBundle, target: number, upgraded: boolean) => {
    if (!importCurrentToSlot(bundle, target)) {
      setError('写入失败，请检查浏览器存储空间。')
      return
    }
    refreshSaves()
    setText('')
    setPending(null)
    setStatus(
      `已导入当前进度到槽位 ${target}。${upgraded ? ' 旧版本存档已自动补全字段。' : ''}`,
    )
    setError('')
  }

  const startCurrent = () => {
    const parsed = parseBundleText(text)
    if (!parsed.ok) {
      setError(parsed.reason)
      return
    }
    if (parsed.bundle.kind !== 'current') {
      setError('这是全部槽位的备份，请用「导入全部手动槽位」。')
      return
    }
    if (loadGame(slot)) {
      setPending({
        kind: 'current',
        slot,
        bundle: parsed.bundle,
        upgraded: parsed.upgraded,
      })
      setError('')
      return
    }
    applyCurrent(parsed.bundle, slot, parsed.upgraded)
  }

  const applyAll = (bundle: SaveBundle, upgraded: boolean) => {
    const plan = importAllSlots(bundle)
    refreshSaves()
    setText('')
    setPending(null)
    setStatus(
      `已导入 ${plan.written.length} 个槽位${
        plan.removed.length ? `，并删除 ${plan.removed.length} 个本机多余槽位` : ''
      }。${upgraded ? ' 旧版本存档已自动补全字段。' : ''}`,
    )
    setError('')
  }

  const startAll = () => {
    const parsed = parseBundleText(text)
    if (!parsed.ok) {
      setError(parsed.reason)
      return
    }
    if (parsed.bundle.kind !== 'all') {
      setError('这是单个进度的存档，请先选择槽位再导入。')
      return
    }
    const plan = planAllImport(parsed.bundle)
    setPending({
      kind: 'all',
      bundle: parsed.bundle,
      ...plan,
      upgraded: parsed.upgraded,
    })
    setError('')
  }

  const fileBlock = (
    <div className="io-actions">
      <input
        ref={fileRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        onChange={readFile}
        style={{ display: 'none' }}
      />
      <button className="mini-btn" onClick={() => fileRef.current?.click()}>
        选择文件
      </button>
    </div>
  )

  const textBlock = (
    <textarea
      className="io-text"
      value={text}
      placeholder="粘贴存档文本（ARCANUM1: 开头）或完整的 JSON"
      onChange={(e) => {
        setText(e.target.value)
        setPending(null)
        setError('')
      }}
    />
  )

  return (
    <>
      <div className="io-section">
        <div className="io-title">导入到槽位</div>
        <select
          className="io-select"
          value={slot}
          onChange={(e) => {
            setSlot(Number(e.target.value))
            setPending(null)
          }}
        >
          {Array.from({ length: SLOT_COUNT }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              槽位 {n}
            </option>
          ))}
        </select>
      </div>

      <div className="io-section">
        <div className="io-title">存档来源</div>
        {android ? (
          <>
            {textBlock}
            {fileBlock}
          </>
        ) : (
          <>
            {fileBlock}
            {textBlock}
          </>
        )}
      </div>

      <div className="io-actions">
        <button className="primary-btn" onClick={startCurrent}>
          导入当前进度到槽位 {slot}
        </button>
        <button className="mini-btn" onClick={startAll}>
          导入全部手动槽位
        </button>
      </div>

      {pending?.kind === 'current' && (
        <div className="save-confirm danger">
          <div className="save-confirm-text">
            槽位 {pending.slot} 已有存档，导入后会覆盖，无法恢复。
            {pending.upgraded ? ' 这是旧版本存档，导入后会自动补全字段。' : ''}
          </div>
          <div className="save-confirm-actions">
            <button
              className="mini-btn danger"
              onClick={() => applyCurrent(pending.bundle, pending.slot, pending.upgraded)}
            >
              确认导入
            </button>
            <button className="mini-btn" onClick={() => setPending(null)}>
              取消
            </button>
          </div>
        </div>
      )}

      {pending?.kind === 'all' && (
        <div className="save-confirm danger">
          <div className="save-confirm-text">
            将导入 {pending.written.length} 个槽位
            {pending.written.length ? `（槽位 ${pending.written.join('、')}）` : ''}
            {pending.removed.length
              ? `，并删除本机 ${pending.removed.length} 个不在备份中的槽位（槽位 ${pending.removed.join('、')}）。`
              : '，本机其余槽位保留。'}
            {pending.upgraded ? ' 这是旧版本存档，导入后会自动补全字段。' : ''}
          </div>
          <div className="save-confirm-actions">
            <button className="mini-btn danger" onClick={() => applyAll(pending.bundle, pending.upgraded)}>
              确认导入
            </button>
            <button className="mini-btn" onClick={() => setPending(null)}>
              取消
            </button>
          </div>
        </div>
      )}

      <p className="hint">自动存档不会被导入或覆盖。导入只影响 1–10 手动槽位。</p>
      {mode === 'title' && <p className="hint">导入完成后，在列表里手动读取即可。</p>}
      {android && <p className="hint">安卓上文件导入可能不可用，建议使用文本。</p>}
      {status && <p className="hint">{status}</p>}
      {error && <p className="hint error-text">{error}</p>}
    </>
  )
}

function LogModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  return (
    <ModalShell title="日志" onClose={() => setModal(null)}>
      <div className="log-list">
        {[...data.log].reverse().map((l, i) => (
          <div className="log-line" key={i}>{l}</div>
        ))}
      </div>
    </ModalShell>
  )
}

function StatsModal() {
  const data = useGame((s) => s.data)
  const battle = useGame((s) => s.battle)
  const setModal = useGame((s) => s.setModal)
  const year = currentYear(data.day)
  const courses = coursesForYear(year)
  const nextThreshold = nextExamThreshold(data.day, data.minutes)

  const attributeDesc = (key: 'physique' | 'knowledge' | 'will', tier: number): string => {
    const tables = {
      physique: [
        '你身体单薄。',
        '你身体还算结实。',
        '你比同龄人强壮。',
        '你身体结实而耐久。',
        '你的身体远超常人。',
        '你的身体已经不像凡人。',
      ],
      knowledge: [
        '你还没读过多少书。',
        '你开始能读懂一些书。',
        '你读过不少书。',
        '你的知识已经相当扎实。',
        '你几乎什么都读过。',
        '你的学识深不见底。',
      ],
      will: [
        '你容易动摇。',
        '你尚能坚持。',
        '你比多数人坚定。',
        '你很难被撼动。',
        '你的意志像铁一样。',
        '你几乎不会动摇。',
      ],
    }
    return tables[key][Math.min(5, Math.max(0, tier))]
  }

  const attributeCard = (key: 'physique' | 'knowledge' | 'will') => {
    const skill = data.skills[key]
    const pct = skill.tier >= 5 ? 100 : skillPercent(skill.tier, skill.exp)
    return (
      <div className="stat-card" key={key}>
        <div className="stat-card-head">
          <span className="stat-name">{SKILL_LABEL[key]}</span>
          <span className="stat-tier">{tierName(key, skill.tier)}</span>
          <span className="stat-pct">{formatPercent(skill.tier, skill.exp)}</span>
        </div>
        <div className="stat-desc">{attributeDesc(key, skill.tier)}</div>
        <div className="stat-bar">
          <div className="stat-fill" style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
      </div>
    )
  }

  return (
    <ModalShell title="属性" wide onClose={() => setModal(null)}>
      <div className="stat-section">
        <div className="stat-section-title">核心属性</div>
        {attributeCard('physique')}
        {attributeCard('knowledge')}
        {attributeCard('will')}
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-name">年龄</span>
            <span className="stat-pct">{ageOf(data.day)} 岁</span>
          </div>
          <div className="stat-desc">按学年增长。</div>
        </div>
        {(() => {
          const hpMax = maxHp(data.skills.physique.tier)
          const hpValue = battle ? battle.playerHp : data.hp
          const pct = Math.max(0, Math.min(100, (hpValue / hpMax) * 100))
          return (
            <div className="stat-card">
              <div className="stat-card-head">
                <span className="stat-name">生命</span>
                <span className="stat-pct">{Math.round(hpValue)} / {hpMax}</span>
              </div>
              <div className="stat-desc">战斗中的生命值，与体力分开计算。</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${pct}%`, background: 'var(--red)' }} />
              </div>
            </div>
          )
        })()}
      </div>

      <div className="stat-section">
        <div className="stat-section-title">学校课程</div>
        {courses.length === 0 ? (
          <div className="hint">本学年课程尚未配置。</div>
        ) : (
          courses.map((course) => {
            const value = data.courseMastery[course.id] ?? 0
            const pct = nextThreshold === null ? 0 : Math.min(100, (value / nextThreshold) * 100)
            return (
              <div className="stat-card" key={course.id}>
                <div className="stat-card-head">
                  <span className="stat-name">{course.name}</span>
                  <span className="stat-pct">掌握度 {Math.floor(value)}</span>
                </div>
                <div className="stat-desc">
                  {course.teacher} · {nextThreshold === null ? '考试安排待定' : `下次考试：${nextThreshold}`}
                </div>
                <div className="stat-bar">
                  <div className="stat-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="stat-section">
        <div className="stat-section-title">法术</div>
        {data.spells.includes('fireball') ? (
          <div className="stat-card">
            <div className="stat-card-head">
              <span className="stat-name">火球术</span>
              <span className="stat-tier">自然系 · 火</span>
            </div>
            <div className="stat-desc">消耗 8 魔力，对单个目标造成伤害。需要主手施法媒介。</div>
          </div>
        ) : (
          <div className="hint">
            尚未学会战斗法术。在藏书阁翻阅《火球术》，并达到自然系 0 级进度 30% 后可以学会。
          </div>
        )}
      </div>

      <div className="stat-section">
        <div className="stat-section-title">技能</div>
        {SKILL_ORDER.filter((k) => !['physique', 'knowledge', 'will'].includes(k)).map((k) => {
          const skill = data.skills[k]
          const pct = skill.tier >= 5 ? 100 : skillPercent(skill.tier, skill.exp)
          return (
            <div className="stat-card" key={k}>
              <div className="stat-card-head">
                <span className="stat-name">{SKILL_LABEL[k]}</span>
                <span className="stat-tier">{tierName(k, skill.tier)}</span>
                <span className="stat-pct">{formatPercent(skill.tier, skill.exp)}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
            </div>
          )
        })}
        <div className="hint">
          种植暂未开放作物种植，目前通过草药学课程、采药和照料药草积累。
        </div>
      </div>
    </ModalShell>
  )
}

function RelationsModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  return (
    <ModalShell title="关系" onClose={() => setModal(null)}>
      <div className="relation-list">
        {NPCS.filter((n) => n.relationship !== 'familiarity').map((npc) => {
          const affinity = data.affinity[npc.id] ?? 0
          const tier = socialTier(affinity)
          const today = data.social.day === data.day ? data.social.counts[npc.id] ?? 0 : 0
          return (
            <div className="relation-row" key={npc.id}>
              <div className="relation-head">
                <span className="relation-name">{npc.name}</span>
                <span className="relation-title">{npc.title}</span>
                <span className="relation-aff">好感 {affinity}</span>
              </div>
              <div className="relation-meta">
                <span className="relation-hearts">{heartsText(affinity)}</span>
                <span className="relation-today">今日{today >= 1 ? '已聊' : '未聊'}</span>
              </div>
              <div className="relation-impression">{npc.impression[tier]}</div>
            </div>
          )
        })}
      </div>
      <p className="hint">每位人物每天第一次闲聊增加 1 点好感，之后仍可聊天但不再增加。</p>
    </ModalShell>
  )
}

function InventoryModal() {
  const data = useGame((s) => s.data)
  const battle = useGame((s) => s.battle)
  const setModal = useGame((s) => s.setModal)
  const useItem = useGame((s) => s.useItem)
  const equipItem = useGame((s) => s.equipItem)
  const unequipSlot = useGame((s) => s.unequipSlot)
  const storeBook = useGame((s) => s.storeBook)
  const [selected, setSelected] = useState<string | null>(null)
  const equippedIds = Object.values(data.equipment).filter((x): x is string => !!x)
  const entries = Object.entries(data.inventory).filter(
    ([id, qty]) => qty > 0 && !equippedIds.includes(id),
  )
  const slots: Array<[string, number] | null> = Array.from({ length: 24 }, (_, i) => entries[i] ?? null)
  const selectedDef = selected ? ITEMS[selected] : null
  const selectedQty = selected ? data.inventory[selected] ?? 0 : 0
  const selectedQuality = selectedDef ? QUALITY[selectedDef.quality] : null
  const selectedSlot = selectedDef?.slot
  const equippedInSlot = selectedSlot ? data.equipment[selectedSlot] === selectedDef?.id : false
  const selectedSlotLabel = selectedSlot
    ? EQUIPMENT_SLOTS.find((s) => s.key === selectedSlot)?.label
    : undefined
  const selectedBuffKey = selectedDef?.effect?.combatBuff
  const selectedBuffActive = selectedBuffKey
    ? data.combatBuffs[combatBuffUntilKey(selectedBuffKey)] >
      absoluteMinutes(data.day, data.minutes)
    : false

  useEffect(() => {
    if (selected && !equippedIds.includes(selected) && (data.inventory[selected] ?? 0) <= 0) {
      setSelected(null)
    }
  }, [data.inventory, equippedIds, selected])

  const qualityStyle = (color?: string) =>
    color ? { borderColor: color, background: `${color}18` } : undefined

  const slotButton = (slot: (typeof EQUIPMENT_SLOTS)[number]) => {
    const id = data.equipment[slot.key]
    const def = id ? ITEMS[id] : null
    const q = def ? QUALITY[def.quality] : null
    return (
      <div className="equip-block" key={slot.key}>
        <div className="equip-label">{slot.label}</div>
        <button
          className={`equip-slot ${def ? 'filled' : 'empty'} ${id && selected === id ? 'selected' : ''}`}
          style={qualityStyle(q?.color)}
          title={def ? def.name : '空'}
          onClick={() => id && setSelected(id)}
        >
          {def ? <ItemIcon id={def.id} size={38} /> : <span className="empty-text">空</span>}
        </button>
      </div>
    )
  }

  return (
    <ModalShell title="物品" wide onClose={() => setModal(null)}>
      {battle && <p className="hint">战斗中无法更换装备或使用普通物品。</p>}
      <div className="inventory-body">
        <div className="equip-area">
          <div className="inv-section-title">装备</div>
          <div className="equip-layout">
            <div className="equip-col">
              {slotButton(EQUIPMENT_SLOTS[0])}
              {slotButton(EQUIPMENT_SLOTS[1])}
            </div>
            <div className="equip-center" />
            <div className="equip-col">
              {slotButton(EQUIPMENT_SLOTS[2])}
              {slotButton(EQUIPMENT_SLOTS[3])}
            </div>
          </div>
        </div>

        <div className="bag-panel">
          <div className="inv-section-title">背包</div>
          <div className="bag-grid">
            {slots.map((entry, i) => {
              if (!entry) return <div className="inv-slot empty" key={`empty-${i}`} />
              const [id, qty] = entry
              const def = ITEMS[id]
              if (!def) return <div className="inv-slot empty" key={`empty-${i}`} />
              const q = QUALITY[def.quality]
              return (
                <button
                  key={id}
                  className={`inv-slot filled ${selected === id ? 'selected' : ''}`}
                  style={qualityStyle(q.color)}
                  title={def.name}
                  onClick={() => setSelected(id)}
                >
                  <ItemIcon id={id} size={30} />
                  {qty > 1 && <span className="inv-qty">×{qty}</span>}
                  <span className="slot-tip">{def.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="inv-details">
        {selectedDef && selectedQuality ? (
          <>
            <div className="detail-head">
              <span className="detail-name">{selectedDef.name}</span>
              <span className="detail-qty">×{selectedQty}</span>
              {selectedSlotLabel && <span className="detail-slot">{selectedSlotLabel}</span>}
              <span className="detail-quality" style={{ color: selectedQuality.color }}>
                {selectedQuality.name}
              </span>
            </div>
            <div className="detail-desc">
              {selectedDef.desc}
              {selectedDef.medium && <span className="detail-medium">可作为施法媒介</span>}
              {selectedDef.weapon === 'sword' && <span className="detail-medium">可作主手武器</span>}
            </div>
            {selectedDef.type === 'equipment' && selectedSlot ? (
              equippedInSlot ? (
                <button className="primary-btn detail-action" disabled={!!battle} onClick={() => unequipSlot(selectedSlot)}>卸下</button>
              ) : (
                <button className="primary-btn detail-action" disabled={!!battle} onClick={() => equipItem(selectedDef.id)}>装备</button>
              )
            ) : selectedDef.type === 'consumable' ? (
              <button
                className="primary-btn detail-action"
                disabled={!!battle || selectedBuffActive}
                onClick={() => useItem(selectedDef.id)}
              >
                {selectedBuffActive ? '已生效' : '使用'}
              </button>
            ) : selectedDef.type === 'book' ? (
              <>
                <div className="hint">
                  阅读进度 {data.books[selectedDef.id]?.progress ?? 0}%。在藏书阁阅读。
                </div>
                <button
                  className="primary-btn detail-action"
                  disabled={data.location !== 'dorm' || data.bookshelf.length >= 10}
                  onClick={() => storeBook(selectedDef.id)}
                >
                  放入书柜
                </button>
                {data.location !== 'dorm' && <div className="hint">书柜在寝室。</div>}
              </>
            ) : (
              <div className="hint">材料，可在杂货店出售。</div>
            )}
          </>
        ) : (
          <div className="hint">选择一件物品</div>
        )}
      </div>
    </ModalShell>
  )
}

function ShopModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const buyItem = useGame((s) => s.buyItem)
  const sellItem = useGame((s) => s.sellItem)
  const stock = shopStockAt(data.location)
  const soldToday = data.shop.day === data.day ? data.shop.sold : {}
  const sellable = Object.entries(data.inventory).filter(
    ([id, qty]) => qty > 0 && canSellAt(data.location, id),
  )

  return (
    <ModalShell title={getLocation(data.location).name} onClose={() => setModal(null)}>
      <div className={`shop-money${data.money < 0 ? ' debt' : ''}`}>持有：{formatMoney(data.money)}</div>
      <div className="shop-list">
        {Object.entries(stock).length === 0 && <div className="hint">这里今天没有货。</div>}
        {Object.entries(stock).map(([id, stockCount]) => {
          const def = ITEMS[id]
          if (!def) return null
          const sold = soldToday[`${data.location}:${id}`] ?? 0
          const left = Math.max(0, stockCount - sold)
          const price = shopPriceAt(data.location, id, data.west.stage)
          const owned =
            def.type === 'book' &&
            ((data.inventory[id] ?? 0) > 0 || data.bookshelf.includes(id))
          return (
            <div className="shop-row" key={id}>
              <div className="row-head">
                <span className="item-name">{def.name}</span>
                <span className="shop-price">{price} 铜</span>
                {owned ? (
                  <span className="shop-stock">已拥有</span>
                ) : (
                  <>
                    <span className="shop-stock">剩 {left}</span>
                    <button
                      className="mini-btn"
                      disabled={left <= 0 || data.money < price}
                      onClick={() => buyItem(id)}
                    >
                      购买
                    </button>
                  </>
                )}
              </div>
              <div className="item-desc">{def.desc}</div>
            </div>
          )
        })}
      </div>
      {(data.location === 'shop' ||
        data.location === 'westMarket' ||
        data.location === 'potionWorkshop') &&
        sellable.length > 0 && (
        <div className="shop-sell">
          <div className="section-title">收购</div>
          {sellable.map(([id, qty]) => {
            const def = ITEMS[id]
            const price = sellPriceAt(data.location, id)
            return (
              <div className="shop-row" key={id}>
                <div className="row-head">
                  <span className="item-name">{def.name} ×{qty}</span>
                  <span className="shop-price">{price} 铜 / 个</span>
                  <button className="mini-btn" onClick={() => sellItem(id, false)}>卖 1 个</button>
                  <button className="mini-btn" onClick={() => sellItem(id, true)}>全部卖出</button>
                </div>
                <div className="item-desc">全部卖出可得 {price * qty} 铜</div>
              </div>
            )
          })}
        </div>
      )}
    </ModalShell>
  )
}

function BrewModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const brewPotion = useGame((s) => s.brewPotion)
  const alchemy = data.skills.alchemy

  return (
    <ModalShell title="炼药" onClose={() => setModal(null)}>
      <div className="hint">每次 30 分钟，体力 -2，精神 -1。失败会消耗全部材料。</div>
      <div className="shop-list">
        {RECIPES.map((recipe) => {
          const unlocked = recipeUnlocked(recipe, alchemy)
          const success = brewSuccessChance(recipe, alchemy)
          const fine = brewFineChance(recipe, alchemy)
          const enough = Object.entries(recipe.inputs).every(
            ([id, qty]) => (data.inventory[id] ?? 0) >= qty,
          )
          const inputText = Object.entries(recipe.inputs)
            .map(([id, qty]) => `${ITEMS[id]?.name ?? id} ×${qty}`)
            .join(' + ')
          return (
            <div className="shop-row" key={recipe.id}>
              <div className="row-head">
                <span className="item-name">{recipe.name}</span>
                <span className="shop-price">{recipe.level} 级</span>
                {!unlocked && (
                  <span className="shop-stock">累计炼药经验 {recipe.unlockExp} 解锁</span>
                )}
              </div>
              <div className="item-desc">{recipe.desc}</div>
              <div className="item-desc">材料：{inputText}</div>
              <div className="item-desc">
                成功率 {Math.round(success)}% · 精制率 {Math.round(fine)}%
                {unlocked && !enough ? ' · 材料不足' : ''}
              </div>
              {unlocked && (
                <div className="row-head">
                  <button
                    className="mini-btn"
                    disabled={!enough || data.stamina < 2 || data.spirit < 1}
                    onClick={() => brewPotion(recipe.id)}
                  >
                    炼 1 份
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ModalShell>
  )
}

function WorkshopModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const rentBrewKit = useGame((s) => s.rentBrewKit)
  const learnAlchemy = useGame((s) => s.learnAlchemyAtWorkshop)
  const alchemy = data.skills.alchemy
  const kitDays = Math.max(0, data.workshop.brewKitUntilDay - data.day)
  const lessonDone = data.workshop.lessonDay === data.day

  return (
    <ModalShell title="工坊柜台" onClose={() => setModal(null)}>
      <div className="hint">师傅只接大单。基础的火候和顺序，由学徒长托比亚斯带你做。</div>
      <div className="shop-list">
        <div className="shop-row">
          <div className="row-head">
            <span className="item-name">租借炼药工具</span>
            <span className="shop-price">{WORKSHOP_RENT_COST} 铜</span>
          </div>
          <div className="item-desc">
            {WORKSHOP_RENT_DAYS} 天内可以在寝室炼药。
            {kitDays > 0 ? `当前还剩 ${kitDays} 天。` : '当前没有租借。'}
          </div>
          <div className="row-head">
            <button
              className="mini-btn"
              disabled={data.money < WORKSHOP_RENT_COST}
              onClick={rentBrewKit}
            >
              {kitDays > 0 ? `续租 ${WORKSHOP_RENT_DAYS} 天` : `租借 ${WORKSHOP_RENT_DAYS} 天`}
            </button>
          </div>
        </div>

        <div className="shop-row">
          <div className="row-head">
            <span className="item-name">向托比亚斯请教</span>
            <span className="shop-price">{WORKSHOP_LESSON_COST} 铜</span>
          </div>
          <div className="item-desc">
            {`${WORKSHOP_LESSON_MINUTES / 60} 小时，精神 -${WORKSHOP_LESSON_SPIRIT}，炼药经验 +${WORKSHOP_LESSON_EXP}。每天 1 次。当前炼药：${tierName(
              'alchemy',
              alchemy.tier,
            )} ${formatPercent(alchemy.tier, alchemy.exp)}。`}
          </div>
          <div className="row-head">
            <button
              className="mini-btn"
              disabled={lessonDone || data.money < WORKSHOP_LESSON_COST || data.spirit < WORKSHOP_LESSON_SPIRIT}
              onClick={learnAlchemy}
            >
              {lessonDone ? '今天已请教' : '请教 1 次'}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}

function DrinkModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const orderDrink = useGame((s) => s.orderDrink)
  return (
    <ModalShell title="来一杯" onClose={() => setModal(null)}>
      <div className={`shop-money${data.money < 0 ? ' debt' : ''}`}>持有：{formatMoney(data.money)}</div>
      <p className="muted">酒馆里没有烈酒。格蕾塔也不会给喝醉的人再倒一杯。</p>
      <div className="drink-list">
        {DRINKS.map((drink) => {
          const effects = [
            drink.effect.mood ? `心情 +${drink.effect.mood}` : '',
            drink.effect.spirit ? `精神 +${drink.effect.spirit}` : '',
            drink.effect.stamina ? `体力 +${drink.effect.stamina}` : '',
          ].filter(Boolean).join(' · ')
          return (
            <button
              key={drink.id}
              className="drink-row"
              disabled={data.money < drink.price}
              onClick={() => orderDrink(drink.id)}
            >
              <span className="drink-name">{drink.name}</span>
              <span className="drink-desc">{drink.desc}</span>
              <span className="drink-meta">
                {drink.price} 铜 · {drink.minutes} 分钟 · {effects}
              </span>
            </button>
          )
        })}
      </div>
    </ModalShell>
  )
}

function GuildBoardModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const acceptGuildJob = useGame((s) => s.acceptGuildJob)
  const jobs = guildJobsForDay(data.day)
  const escort = guildEscortForDay(data.day)
  const allDone = jobs.every((id) => data.guild.done.includes(id))

  const jobRow = (id: string) => {
    const isEscort = id === 'escort'
    const def = isEscort ? null : GUILD_JOB_DEFS[id as keyof typeof GUILD_JOB_DEFS]
    const name = isEscort ? `护送货车 · ${escort.name}` : def?.name ?? id
    const minutes = isEscort ? escort.minutes : def?.minutes ?? 0
    const stamina = isEscort ? 12 : def?.stamina ?? 0
    const money = isEscort ? escort.money : def?.money ?? 0
    const done = data.guild.done.includes(id)
    const accepted = data.guild.accepted.includes(id)
    return (
      <div className="guild-job" key={id}>
        <div className="row-head">
          <span className="item-name">{name}</span>
          <span className="shop-price">{money} 铜</span>
        </div>
        <div className="item-desc">
          {minutes} 分钟 · 体力 -{stamina}
          {isEscort ? ' · 途中可能遭遇战斗' : ''}
        </div>
        {done ? (
          <div className="hint">已完成</div>
        ) : accepted ? (
          <div className="hint">
            {isEscort ? '已接取 · 去城门开始护送' : '已接取'}
          </div>
        ) : (
          <button className="mini-btn" onClick={() => acceptGuildJob(id)}>
            接取
          </button>
        )}
      </div>
    )
  }

  return (
    <ModalShell title="商会委托板" onClose={() => setModal(null)}>
      <p className="hint">每周一刷新，每个委托只能接一次。</p>
      {allDone ? (
        <p className="package-text">本周委托已经全部完成。</p>
      ) : (
        <div className="guild-list">{jobs.map(jobRow)}</div>
      )}
    </ModalShell>
  )
}

function EscortView() {
  const data = useGame((s) => s.data)
  const message = useGame((s) => s.message)
  const setModal = useGame((s) => s.setModal)
  const escortContinue = useGame((s) => s.escortContinue)
  const escortArrive = useGame((s) => s.escortArrive)
  const escortAbort = useGame((s) => s.escortAbort)
  const escort = data.guild.escort
  if (!escort) return null
  const dest = getLocation(escort.destination)
  const def = GUILD_ESCORTS.find((x) => x.destination === escort.destination)
  const arrived = escort.segment >= escort.totalSegments

  return (
    <div className="escort-view">
      <div className="section-title">护送途中</div>
      <p className="package-text">目的地：{dest.name}</p>
      <p className="package-text">
        第 {escort.segment} / {escort.totalSegments} 段
      </p>
      <p className="package-text">
        货物状态：{escort.goodsDamaged ? '受损' : '完好'}
      </p>
      {message && <p className="hint">{message}</p>}
      <div className="actions">
        {arrived ? (
          <ActionBtn onClick={escortArrive} label="到达目的地" cost="—" />
        ) : (
          <ActionBtn onClick={escortContinue} label="继续赶路" cost="30 分钟" />
        )}
        <ActionBtn onClick={() => setModal('inventory')} label="使用物品" cost="—" />
        <ActionBtn onClick={escortAbort} label="中断护送" cost="回城门" />
      </div>
      <p className="hint">
        {def ? `${def.name} · 基础报酬 ${def.money} 铜` : ''}
      </p>
    </div>
  )
}

function WestBoardModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const acceptWestCommission = useGame((s) => s.acceptWestCommission)
  const period = supportPeriodAt(data.day)
  const next = nextSupportPeriod(data.day)
  const repairKeys = ['wall', 'ditch', 'lamp'] as const
  const repairAccepted = data.west.accepted.find(
    (id) => id === 'maintenance' || repairKeys.includes(id as (typeof repairKeys)[number]),
  )
  const repairDone = data.west.done.find(
    (id) => id === 'maintenance' || repairKeys.includes(id as (typeof repairKeys)[number]),
  )
  const availableProjects = repairKeys.filter(
    (key) => (data.west.projects[key] ?? 0) < WEST_PROJECT_MAX,
  )

  const commissionRow = (id: string) => {
    const def = WEST_COMMISSIONS[id]
    if (!def) return null
    const costText = `${def.minutes} 分钟 · 体力 -${def.stamina} · ${
      data.west.stage === 0 ? `+${def.construction} 建设值 · ` : ''
    }+${def.points} 支援点`
    if (data.west.done.includes(id)) {
      return <div className="hint" key={id}>已完成：{def.name}</div>
    }
    if (data.west.accepted.includes(id)) {
      return <div className="hint" key={id}>已接取：{def.name}</div>
    }
    return (
      <button className="choice-btn" key={id} onClick={() => acceptWestCommission(id)}>
        {def.name}
        <small>{costText}</small>
      </button>
    )
  }

  return (
    <ModalShell title="委托板" onClose={() => setModal(null)}>
      {!period ? (
        <>
          <p className="package-text">公告板上没有新的委托。</p>
          {next && <p className="hint">下次支援：{next.label}</p>}
        </>
      ) : (
        <>
          <p className="package-text">
            {period.label} · 第 {Math.min(data.west.setIndex + 1, period.maxSets)} / {period.maxSets} 组
          </p>
          {data.west.setIndex >= period.maxSets ? (
            <p className="hint">本月委托已经全部完成。</p>
          ) : (
            <>
              <div className="section-title">修复工程</div>
              {data.west.stage >= 1 ? (
                repairDone ? (
                  <div className="hint">已完成：日常维护</div>
                ) : repairAccepted ? (
                  <div className="hint">已接取：日常维护</div>
                ) : (
                  <button
                    className="choice-btn"
                    onClick={() => acceptWestCommission('maintenance')}
                  >
                    日常维护
                    <small>
                      {WEST_COMMISSIONS.maintenance.minutes} 分钟 · 体力 -
                      {WEST_COMMISSIONS.maintenance.stamina} · +
                      {WEST_COMMISSIONS.maintenance.points} 支援点
                    </small>
                  </button>
                )
              ) : repairDone ? (
                <div className="hint">已完成：{WEST_COMMISSIONS[repairDone]?.name ?? '修复工程'}</div>
              ) : repairAccepted ? (
                <div className="hint">已接取：{WEST_COMMISSIONS[repairAccepted]?.name ?? '修复工程'}</div>
              ) : availableProjects.length === 0 ? (
                <div className="hint">主项目已经全部完成。</div>
              ) : (
                <div className="choice-list">
                  {availableProjects.map((key) => commissionRow(key))}
                </div>
              )}
              <div className="section-title">其他委托</div>
              <div className="choice-list">
                {commissionRow('patrol')}
                {commissionRow('care')}
              </div>
              <p className="hint">镇里的零碎活可以直接做。</p>
            </>
          )}
        </>
      )}
    </ModalShell>
  )
}

function WestRecordModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  return (
    <ModalShell title="工程记录" onClose={() => setModal(null)}>
      <p className="package-text">
        阶段：{data.west.stage >= 1 ? '勉强维持' : '破败'}
      </p>
      <p className="package-text">
        建设值：{Math.floor(data.west.construction)} / {WEST_CONSTRUCTION_MAX}
      </p>
      <p className="package-text">支援点：{data.west.points}</p>
      {data.west.stage >= 1 ? (
        <p className="hint">镇子暂时不再继续坏下去。后续工程待第三学年。</p>
      ) : (
        <p className="hint">项目进度看地点描述。</p>
      )}
    </ModalShell>
  )
}

function AcademyBoardModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const year = currentYear(data.day)
  const examDay = isExamDay(data.day)
  const construction = isConstructionWeek(data.day)
  const classDay = isClassDay(data.day)
  const holiday = semesterState(data.day) === 'summer' || semesterState(data.day) === 'winter'
  const period = supportPeriodAt(data.day)
  const next = nextSupportPeriod(data.day)
  const examTotal = nextExamTotal(data.day, data.minutes)
  const examDays = examTotal === null ? null : daysUntil(examTotal, data.day, data.minutes)
  const courses = coursesForYear(year)

  return (
    <ModalShell title="学院告示板" onClose={() => setModal(null)}>
      <div className="section-title">今日课程</div>
      {examDay ? (
        <p className="hint">今日月考，课程暂停。</p>
      ) : holiday ? (
        <p className="hint">假期无课。</p>
      ) : construction ? (
        <p className="hint">本周建设周，停课。</p>
      ) : !classDay ? (
        <p className="hint">今日无课。</p>
      ) : (
        <div className="board-lines">
          {courses.map((course) => (
            <div className="board-line" key={course.id}>
              <span>
                {formatTime(course.start)}–{formatTime(course.end)}
              </span>
              <span>{course.name}</span>
              <span className="muted">{getLocation(courseLocationOn(course, data.day)).name}</span>
            </div>
          ))}
        </div>
      )}

      {year >= 2 && (
        <>
          <div className="section-title">本周支援</div>
          {period ? (
            <>
              <p className="package-text">{period.label}</p>
              <p className="hint">镇口委托板已更新。</p>
            </>
          ) : (
            <>
              <p className="hint">本周无支援安排。</p>
              {next && <p className="hint">下次支援：{next.label}</p>}
            </>
          )}
        </>
      )}

      <div className="section-title">学期与考核</div>
      <p className="package-text">{semesterLabel(data.day)}</p>
      <p className="hint">
        距离下一次考试：
        {examDays === null ? '本学期已结束' : examDays === 0 ? '今天' : `${examDays} 天`}
      </p>
    </ModalShell>
  )
}

function ExamModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const examCourseId = useGame((s) => s.examCourseId)
  const takeExam = useGame((s) => s.takeExam)
  const [step, setStep] = useState<'pre' | 'during'>('pre')
  const [prep, setPrep] = useState(false)
  const year = currentYear(data.day)
  const course = examCourseId
    ? examCoursesForYear(year).find((c) => c.id === examCourseId)
    : undefined
  if (!course) return null
  const physical = course.kind === 'physical'
  const intro = physical
    ? '演武场清空了，格里高利把木桩摆成一排。'
    : course.id === 'y1_nature' || course.id === 'y2_advanced_nature'
      ? '讲堂里比平时安静。阿尔文站在窗边，看着你们低头答题。'
      : course.id === 'y1_literature' || course.id === 'y2_history'
        ? '伊莲娜把试卷一份份发下去，教室里很安静。'
        : course.id === 'y2_course_4'
          ? '讲堂里摆着几盆药草。赛拉·莫恩站在讲台边，手里拿着一份名单。'
          : '长桌上摆着试卷，窗外的光落在纸边。'
  const canPrep = physical ? data.stamina >= 2 : data.spirit >= 1
  const duration = course.end - course.start
  const durationText = (m: number) => (m % 60 === 0 ? `${m / 60} 小时` : `${m} 分钟`)

  return (
    <ModalShell title={`${course.name} · 考试`} onClose={() => setModal(null)}>
      {step === 'pre' ? (
        <>
          <p className="package-text">{intro}</p>
          <div className="choice-list">
            <button
              className="choice-btn"
              disabled={!canPrep}
              onClick={() => {
                setPrep(true)
                setStep('during')
              }}
            >
              {physical ? '热身' : '翻一遍笔记'}
              <small>
                {physical
                  ? '多花 30 分钟 · 体力 -2 · 本门判定 +0.5'
                  : '多花 30 分钟 · 精神 -1 · 本门判定 +0.5'}
              </small>
            </button>
            <button
              className="choice-btn"
              onClick={() => {
                setPrep(false)
                setStep('during')
              }}
            >
              {physical ? '直接上场' : '直接进考场'}
              <small>不额外消耗 · 正常判定</small>
            </button>
          </div>
          {!canPrep && (
            <p className="hint">
              {physical ? '体力不足，无法热身。' : '精神不足，无法翻笔记。'}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="package-text">{physical ? '考核开始。' : '考试开始。'}</p>
          <div className="choice-list">
            <button
              className="choice-btn"
              onClick={() => takeExam(course.id, prep, false)}
            >
              {physical ? '正常完成' : '正常作答'}
              <small>{durationText(duration)} · 正常判定</small>
            </button>
            <button
              className="choice-btn"
              onClick={() => takeExam(course.id, prep, true)}
            >
              {physical ? '提前收手' : '提前交卷'}
              <small>{durationText(Math.round(duration / 2))} · 本门判定 -1</small>
            </button>
          </div>
        </>
      )}
    </ModalShell>
  )
}

function ExamHandoffModal() {
  const data = useGame((s) => s.data)
  const activePackageId = useGame((s) => s.activePackageId)
  const receiveExamPackage = useGame((s) => s.receiveExamPackage)
  const pkg = data.examPackages.find((p) => p.id === activePackageId)
  if (!pkg) return null
  return (
    <ModalShell title="诺拉" onClose={() => receiveExamPackage(pkg.id)}>
      <p className="package-text">
        诺拉叫住你，把一个用牛皮纸包着的小包裹递过来。
      </p>
      <p className="package-text">“学院寄来的，写着你的名字。”</p>
      <p className="package-text">
        细绳捆得很整齐，封口压着学院的蜡印。
      </p>
      <button className="primary-btn" onClick={() => receiveExamPackage(pkg.id)}>
        收下
      </button>
    </ModalShell>
  )
}

function ExamOpenModal() {
  const data = useGame((s) => s.data)
  const activePackageId = useGame((s) => s.activePackageId)
  const closeExamPackage = useGame((s) => s.closeExamPackage)
  const pkg = data.examPackages.find((p) => p.id === activePackageId)
  if (!pkg) return null

  if (pkg.kind === 'monthly') {
    const courses = examCoursesForYear(currentYear(pkg.day))
    const rows = courses.map((course) => ({
      course,
      result: pkg.results[course.id] ?? 'absent',
    }))
    const allPass = rows.every((r) => r.result === 'pass')
    return (
      <ModalShell
        title={`成绩单 · ${formatMonthDay(pkg.day).split(' · ')[0]}`}
        onClose={closeExamPackage}
      >
        <div className="report-list">
          {rows.map(({ course, result }) => (
            <div className="report-row" key={course.id}>
              <span className="report-name">{course.name}</span>
              <span
                className={`report-status ${result === 'pass' ? 'pass' : 'fail'}`}
              >
                {result === 'pass' ? '通过' : result === 'absent' ? '缺考' : '不及格'}
              </span>
            </div>
          ))}
        </div>
        <p className="report-result">
          {allPass
            ? '你把成绩单折好，放回纸袋里。'
            : '你把成绩单折好，坐在床边看了一会儿窗外。'}
        </p>
        <button className="primary-btn" onClick={closeExamPackage}>
          继续
        </button>
      </ModalShell>
    )
  }

  const year = pkg.year ?? 1
  const semester = pkg.semester ?? 1
  const threshold = examThresholdForDay(semesterLastExamDay(year, semester))
  const courses = coursesForYear(year)
  const rows = courses.map((course) => {
    const value = data.courseMastery[course.id] ?? 0
    return { course, value, pass: value >= threshold }
  })
  const allPass = rows.every((r) => r.pass)
  return (
    <ModalShell
      title={`${yearLabel(year)} · ${semester === 1 ? '第一学期' : '第二学期'}成绩单`}
      onClose={closeExamPackage}
    >
      <div className="report-list">
        {rows.map(({ course, value, pass }) => (
          <div className="report-row" key={course.id}>
            <span className="report-name">{course.name}</span>
            <span className="report-value">掌握度 {Math.floor(value)}</span>
            <span className={`report-status ${pass ? 'pass' : 'fail'}`}>
              {pass ? '及格' : '不及格'}
            </span>
          </div>
        ))}
      </div>
      <p className="report-result">{allPass ? '全部及格。' : '有课程未及格。'}</p>
      <button className="primary-btn" onClick={closeExamPackage}>
        继续
      </button>
    </ModalShell>
  )
}

function EventPickerModal() {
  const data = useGame((s) => s.data)
  const setModal = useGame((s) => s.setModal)
  const debugEvent = useGame((s) => s.debugEvent)
  const [filter, setFilter] = useState<'all' | 'npc'>('all')
  const filtered = EVENTS.filter((e) => filter === 'all' || !!e.requires?.npc)

  const triggerLabel = (event: (typeof EVENTS)[number]) => {
    if (event.trigger.type === 'enter') return '进入地点'
    const labels: Record<string, string> = {
      class: '上课结束',
      study: '自习结束',
      practice: '练习结束',
      work: '打工结束',
      pray: '祷告结束',
      eat: '吃饭结束',
      backyard: '帮后院结束',
    }
    const base = labels[event.trigger.action] ?? '行动结束'
    return event.trigger.subject ? `${base} · ${event.trigger.subject}` : base
  }

  const groups = LOCATIONS.map((loc) => ({
    loc,
    events: filtered.filter((e) => e.locations[0] === loc.id),
  })).filter((g) => g.events.length > 0)

  return (
    <ModalShell title="事件调试" wide onClose={() => setModal(null)}>
      <div className="event-picker-tabs">
        <button
          className={`event-picker-tab ${filter === 'all' ? 'on' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部
        </button>
        <button
          className={`event-picker-tab ${filter === 'npc' ? 'on' : ''}`}
          onClick={() => setFilter('npc')}
        >
          NPC 线
        </button>
      </div>
      <div className="event-picker-list">
        {groups.map((group) => (
          <div className="event-group" key={group.loc.id}>
            <div className="event-group-title">
              {group.loc.kind === 'room' && group.loc.parent
                ? `${getLocation(group.loc.parent).name} · ${group.loc.name}`
                : group.loc.name}
            </div>
            {group.events.map((event) => {
              const seen = data.events.seen.includes(event.id)
              const locations = event.locations
                .map((id) => getLocation(id).name)
                .join(' / ')
              const times = event.timeRanges
                ? event.timeRanges
                    .map(([start, end]) => `${formatTime(start)}–${formatTime(end)}`)
                    .join('，')
                : '全天'
              const days =
                event.days === 'workday' ? '工作日' : event.days === 'weekend' ? '周末' : '每天'
              return (
                <button className="event-pick-row" key={event.id} onClick={() => debugEvent(event.id)}>
                  <div className="event-pick-head">
                    <span className="event-pick-title">{event.title}</span>
                    {seen && <span className="event-seen">已触发</span>}
                  </div>
                  <div className="event-pick-meta">
                    {triggerLabel(event)} · {locations} · {days} {times}
                  </div>
                  <div className="event-pick-id">{event.id}</div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

function DebugModal() {
  const setModal = useGame((s) => s.setModal)
  const money = useGame((s) => s.debugMoney)
  const exp = useGame((s) => s.debugExp)
  const hour = useGame((s) => s.debugHour)
  const day = useGame((s) => s.debugDay)
  const spell = useGame((s) => s.debugSpell)
  const heal = useGame((s) => s.debugHeal)
  const reset = useGame((s) => s.resetGame)
  const [contentIssues, setContentIssues] = useState<ContentIssue[] | null>(null)
  const [checking, setChecking] = useState(false)
  const errors = contentIssues?.filter((i) => i.level === 'error').length ?? 0
  const warnings = contentIssues?.filter((i) => i.level === 'warning').length ?? 0
  const runContentCheck = async () => {
    setChecking(true)
    try {
      const { validateContent } = await import('./game/content/validate')
      setContentIssues(validateContent())
    } finally {
      setChecking(false)
    }
  }
  return (
    <ModalShell title="调试" onClose={() => setModal(null)}>
      <p className="hint">“选择事件…”会忽略地点、时间、好感与一次性记录。</p>
      <div className="btn-grid">
        <button className="choice-btn" onClick={money}>金钱 +100</button>
        <button className="choice-btn" onClick={exp}>全技能经验 +50</button>
        <button className="choice-btn" onClick={hour}>时间 +1 小时</button>
        <button className="choice-btn" onClick={day}>跳到第二天早上</button>
        <button className="choice-btn" onClick={spell}>学会火球术</button>
        <button className="choice-btn" onClick={heal}>生命回满</button>
        <button className="choice-btn" onClick={() => setModal('eventPicker')}>选择事件…</button>
        <button className="choice-btn" onClick={runContentCheck} disabled={checking}>
          {checking ? '内容检查中…' : '内容自检（开发）'}
        </button>
        <button className="choice-btn danger" onClick={reset}>回到标题</button>
      </div>
      {contentIssues && (
        <div className="content-check">
          <p className="hint">
            {contentIssues.length === 0
              ? '内容自检通过：0 错误 / 0 警告'
              : `内容自检：${errors} 错误 / ${warnings} 警告`}
          </p>
          {contentIssues.map((issue, index) => (
            <div key={`${issue.area}-${index}`} className={`content-issue ${issue.level}`}>
              <span>{issue.level === 'error' ? 'ERROR' : 'WARN'}</span> [{issue.area}] {issue.message}
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  )
}

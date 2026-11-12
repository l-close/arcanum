// arcanum: bestiary

export type BestiaryGroup = {
  id: string
  label: string
  enemyIds: string[]
}

export const BESTIARY_GROUPS: BestiaryGroup[] = [
  {
    id: 'yard',
    label: '演武场',
    enemyIds: ['dummy', 'practice_dummy'],
  },
  {
    id: 'forest',
    label: '森林',
    enemyIds: ['slime', 'viper'],
  },
  {
    id: 'forestDeep',
    label: '森林深处',
    enemyIds: ['gray_wolf', 'boar'],
  },
  {
    id: 'west',
    label: '西边',
    enemyIds: ['corrupted_dog', 'erosion_body', 'deserter'],
  },
  {
    id: 'elite',
    label: '悬赏目标',
    enemyIds: ['gray_wolf_alpha', 'boar_king'],
  },
]

export const BESTIARY_TOTAL = BESTIARY_GROUPS.reduce(
  (total, group) => total + group.enemyIds.length,
  0,
)

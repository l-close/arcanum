type IconProps = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  shapeRendering: 'crispEdges' as const,
})

export function WandIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="3" y="12" width="2" height="2" fill="#6b4126" />
      <rect x="5" y="10" width="2" height="2" fill="#8a5533" />
      <rect x="7" y="8" width="2" height="2" fill="#6b4126" />
      <rect x="9" y="6" width="2" height="2" fill="#8a5533" />
      <rect x="11" y="4" width="2" height="2" fill="#6b4126" />
      <rect x="12" y="2" width="2" height="2" fill="#f0d27a" />
      <rect x="11" y="3" width="1" height="1" fill="#fff2b8" />
      <rect x="14" y="3" width="1" height="1" fill="#fff2b8" />
      <rect x="12" y="1" width="1" height="1" fill="#fff2b8" />
      <rect x="12" y="6" width="1" height="1" fill="#fff2b8" />
    </svg>
  )
}

export function AdvancedWandIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="3" y="12" width="2" height="2" fill="#3f2a1b" />
      <rect x="5" y="10" width="2" height="2" fill="#5a3a22" />
      <rect x="7" y="8" width="2" height="2" fill="#3f2a1b" />
      <rect x="9" y="6" width="2" height="2" fill="#5a3a22" />
      <rect x="11" y="4" width="2" height="2" fill="#3f2a1b" />
      <rect x="11" y="2" width="4" height="4" fill="#2b5f9e" />
      <rect x="12" y="3" width="2" height="2" fill="#8fc4ff" />
      <rect x="12" y="2" width="1" height="1" fill="#d7ecff" />
    </svg>
  )
}

export function ManaPotionIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="1" width="2" height="2" fill="#b98a4a" />
      <rect x="6" y="3" width="4" height="2" fill="#c9d8e8" />
      <rect x="5" y="5" width="6" height="1" fill="#c9d8e8" />
      <rect x="4" y="6" width="8" height="2" fill="#c9d8e8" />
      <rect x="4" y="8" width="8" height="6" fill="#2c4f7c" />
      <rect x="5" y="13" width="6" height="1" fill="#1d3555" />
      <rect x="5" y="9" width="2" height="3" fill="#6da8ff" />
      <rect x="5" y="8" width="1" height="1" fill="#b9d9ff" />
    </svg>
  )
}

export function TonicIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="1" width="2" height="2" fill="#a77b46" />
      <rect x="7" y="3" width="2" height="2" fill="#c9d8e8" />
      <rect x="5" y="5" width="6" height="2" fill="#c9d8e8" />
      <rect x="5" y="7" width="6" height="7" fill="#2f5c35" />
      <rect x="6" y="13" width="4" height="1" fill="#1f3d23" />
      <rect x="6" y="8" width="1" height="4" fill="#8fd18f" />
      <rect x="5" y="7" width="1" height="1" fill="#c9f0c9" />
    </svg>
  )
}

export function SwordIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="12" y="1" width="2" height="2" fill="#d9e2ec" />
      <rect x="11" y="3" width="2" height="2" fill="#aebbc9" />
      <rect x="10" y="5" width="2" height="2" fill="#d9e2ec" />
      <rect x="9" y="7" width="2" height="2" fill="#aebbc9" />
      <rect x="8" y="9" width="2" height="2" fill="#d9e2ec" />
      <rect x="6" y="10" width="4" height="1" fill="#b98a4a" />
      <rect x="5" y="11" width="2" height="2" fill="#6b4126" />
      <rect x="4" y="12" width="2" height="2" fill="#8a5533" />
      <rect x="3" y="13" width="2" height="1" fill="#6b4126" />
    </svg>
  )
}

export function HealingPotionIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="1" width="2" height="2" fill="#b98a4a" />
      <rect x="6" y="3" width="4" height="2" fill="#c9d8e8" />
      <rect x="5" y="5" width="6" height="1" fill="#c9d8e8" />
      <rect x="4" y="6" width="8" height="2" fill="#c9d8e8" />
      <rect x="4" y="8" width="8" height="6" fill="#7c2f2f" />
      <rect x="5" y="13" width="6" height="1" fill="#511f1f" />
      <rect x="7" y="9" width="2" height="4" fill="#e08a8a" />
      <rect x="6" y="10" width="4" height="2" fill="#e08a8a" />
    </svg>
  )
}

export function SlimeGelIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="5" y="4" width="6" height="1" fill="#7fbf8f" />
      <rect x="4" y="5" width="8" height="2" fill="#8fd6a0" />
      <rect x="3" y="7" width="10" height="5" fill="#6fbf86" />
      <rect x="4" y="12" width="8" height="1" fill="#4f9a68" />
      <rect x="5" y="6" width="2" height="1" fill="#d6f5df" />
      <rect x="6" y="9" width="1" height="1" fill="#c8f0d4" />
      <rect x="10" y="10" width="1" height="1" fill="#b7e6c6" />
    </svg>
  )
}

export function BookIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="3" y="3" width="10" height="10" fill="#6b4f36" />
      <rect x="4" y="3" width="1" height="10" fill="#d8b45a" />
      <rect x="5" y="4" width="7" height="8" fill="#e6dcc8" />
      <rect x="6" y="5" width="5" height="1" fill="#b8a888" />
      <rect x="6" y="7" width="4" height="1" fill="#b8a888" />
      <rect x="6" y="9" width="3" height="1" fill="#b8a888" />
    </svg>
  )
}

export function BeastHideIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="4" y="3" width="8" height="2" fill="#8a623f" />
      <rect x="3" y="5" width="10" height="6" fill="#a8784f" />
      <rect x="4" y="11" width="8" height="2" fill="#7a5538" />
      <rect x="5" y="6" width="3" height="1" fill="#c9a06e" />
      <rect x="8" y="8" width="3" height="1" fill="#c9a06e" />
    </svg>
  )
}

export function BoarTuskIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="4" y="10" width="2" height="3" fill="#d8c9a8" />
      <rect x="6" y="7" width="2" height="4" fill="#e8dcc0" />
      <rect x="8" y="4" width="2" height="4" fill="#f0e8d2" />
      <rect x="10" y="3" width="2" height="2" fill="#f7f1e0" />
    </svg>
  )
}

export function BloodHerbIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="4" width="2" height="9" fill="#5f7a46" />
      <rect x="4" y="6" width="3" height="2" fill="#6f9a52" />
      <rect x="9" y="8" width="3" height="2" fill="#6f9a52" />
      <rect x="5" y="10" width="2" height="2" fill="#8a4a42" />
      <rect x="9" y="11" width="2" height="1" fill="#8a4a42" />
    </svg>
  )
}

export function BitterleafIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="4" width="2" height="9" fill="#537044" />
      <rect x="4" y="5" width="3" height="3" fill="#6f9a52" />
      <rect x="9" y="7" width="3" height="3" fill="#6f9a52" />
      <rect x="5" y="10" width="3" height="2" fill="#5f8448" />
    </svg>
  )
}

export function DryRationIcon({ size = 32 }: IconProps) {  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="3" y="5" width="10" height="6" fill="#b08a58" />
      <rect x="4" y="6" width="8" height="1" fill="#d8b47a" />
      <rect x="5" y="8" width="2" height="1" fill="#8a6a40" />
      <rect x="8" y="9" width="3" height="1" fill="#8a6a40" />
    </svg>
  )
}

export function ArmorIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="5" y="2" width="6" height="2" fill="#7a5538" />
      <rect x="3" y="4" width="10" height="8" fill="#a8784f" />
      <rect x="4" y="5" width="2" height="1" fill="#c9a06e" />
      <rect x="10" y="5" width="2" height="1" fill="#c9a06e" />
      <rect x="7" y="4" width="2" height="7" fill="#8a623f" />
      <rect x="3" y="12" width="3" height="1" fill="#7a5538" />
      <rect x="10" y="12" width="3" height="1" fill="#7a5538" />
    </svg>
  )
}

export function StuddedArmorIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="5" y="2" width="6" height="2" fill="#6d4a30" />
      <rect x="3" y="4" width="10" height="8" fill="#96703f" />
      <rect x="4" y="5" width="1" height="1" fill="#c8cdd4" />
      <rect x="11" y="5" width="1" height="1" fill="#c8cdd4" />
      <rect x="4" y="8" width="1" height="1" fill="#c8cdd4" />
      <rect x="11" y="8" width="1" height="1" fill="#c8cdd4" />
      <rect x="5" y="11" width="1" height="1" fill="#c8cdd4" />
      <rect x="10" y="11" width="1" height="1" fill="#c8cdd4" />
      <rect x="7" y="4" width="2" height="7" fill="#7a5538" />
    </svg>
  )
}

export function CloakIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="6" y="2" width="4" height="1" fill="#4a3d55" />
      <rect x="5" y="3" width="6" height="2" fill="#6d5a7c" />
      <rect x="4" y="5" width="8" height="8" fill="#5c4c69" />
      <rect x="5" y="5" width="1" height="8" fill="#7d6a8e" />
      <rect x="10" y="5" width="1" height="8" fill="#4a3d55" />
      <rect x="3" y="13" width="10" height="1" fill="#3d3247" />
    </svg>
  )
}

export function CharmIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="1" width="2" height="3" fill="#8a7a4a" />
      <rect x="5" y="4" width="6" height="1" fill="#c9a227" />
      <rect x="4" y="5" width="8" height="6" fill="#8a6a1e" />
      <rect x="6" y="6" width="4" height="4" fill="#d8b45a" />
      <rect x="7" y="7" width="2" height="2" fill="#fff0b8" />
      <rect x="7" y="11" width="2" height="2" fill="#a8873a" />
    </svg>
  )
}

export function PrayerCharmIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="7" y="1" width="2" height="3" fill="#8a8a80" />
      <rect x="4" y="4" width="8" height="7" fill="#b8b4a2" />
      <rect x="5" y="5" width="6" height="5" fill="#d8d2bc" />
      <rect x="7" y="5" width="1" height="5" fill="#8a8a80" />
      <rect x="5" y="7" width="5" height="1" fill="#8a8a80" />
      <rect x="7" y="11" width="2" height="2" fill="#9a9684" />
    </svg>
  )
}

export function NecklaceIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="3" y="2" width="1" height="3" fill="#8a623f" />
      <rect x="12" y="2" width="1" height="3" fill="#8a623f" />
      <rect x="4" y="5" width="1" height="2" fill="#8a623f" />
      <rect x="11" y="5" width="1" height="2" fill="#8a623f" />
      <rect x="5" y="7" width="6" height="1" fill="#8a623f" />
      <rect x="7" y="8" width="2" height="4" fill="#e8dcc0" />
      <rect x="6" y="10" width="1" height="3" fill="#d8c9a8" />
      <rect x="7" y="8" width="1" height="2" fill="#f7f1e0" />
    </svg>
  )
}

export function BootsIcon({ size = 32 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="6" y="2" width="4" height="7" fill="#6a4a32" />
      <rect x="6" y="4" width="4" height="1" fill="#c9a06e" />
      <rect x="6" y="9" width="7" height="3" fill="#8a623f" />
      <rect x="6" y="12" width="8" height="1" fill="#4a3322" />
      <rect x="7" y="9" width="2" height="1" fill="#a8784f" />
    </svg>
  )
}

export function ItemIcon({ id, size = 32 }: { id: string; size?: number }) {
  switch (id) {
    case 'basic_wand':
      return <WandIcon size={size} />
    case 'advanced_wand':
      return <AdvancedWandIcon size={size} />
    case 'practice_sword':
    case 'iron_sword':
    case 'hunter_sword':
    case 'knight_sword':
      return <SwordIcon size={size} />
    case 'leather_armor':
      return <ArmorIcon size={size} />
    case 'studded_leather':
      return <StuddedArmorIcon size={size} />
    case 'travel_cloak':
      return <CloakIcon size={size} />
    case 'apprentice_charm':
      return <CharmIcon size={size} />
    case 'old_prayer_charm':
      return <PrayerCharmIcon size={size} />
    case 'tusk_necklace':
      return <NecklaceIcon size={size} />
    case 'light_boots':
      return <BootsIcon size={size} />
    case 'mana_potion':
      return <ManaPotionIcon size={size} />
    case 'salve':
    case 'salve_fine':
    case 'bandage':
      return <HealingPotionIcon size={size} />
    case 'stimulant':
    case 'stimulant_fine':
      return <TonicIcon size={size} />
    case 'sharp_draught':
      return <HealingPotionIcon size={size} />
    case 'stone_draught':
      return <ManaPotionIcon size={size} />
    case 'swift_draught':
      return <TonicIcon size={size} />
    case 'antidote':
      return <TonicIcon size={size} />
    case 'antidote_fine':
      return <HealingPotionIcon size={size} />
    case 'regen_potion':
      return <HealingPotionIcon size={size} />
    case 'dry_ration':
      return <DryRationIcon size={size} />
    case 'slime_gel':
      return <SlimeGelIcon size={size} />
    case 'beast_hide':
      return <BeastHideIcon size={size} />
    case 'boar_tusk':
    case 'wolf_fang':
    case 'boar_king_tusk':
    case 'venom_fang':
      return <BoarTuskIcon size={size} />
    case 'bloodherb':
      return <BloodHerbIcon size={size} />
    case 'bitterleaf':
      return <BitterleafIcon size={size} />
    case 'picture_book':
      return <BookIcon size={size} />
    case 'sword_manual':
      return <BookIcon size={size} />
    case 'fireball_book':
      return <BookIcon size={size} />
    case 'brawl_manual':
    case 'old_city_stories':
    case 'silver_moon_lore':
    case 'hundred_crafts':
    case 'frontier_notes':
    case 'star_primer':
    case 'hearth_tales':
    case 'old_letters':
      return <BookIcon size={size} />
    default:
      return (
        <svg {...base(size)} aria-hidden="true">
          <rect x="3" y="3" width="10" height="10" fill="#3a3f47" />
        </svg>
      )
  }
}

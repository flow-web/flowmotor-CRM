import { useState } from 'react'
import { Check, X, Shield, ShieldCheck, Star } from 'lucide-react'

/**
 * ComparisonTable - Comparison component (e.g. Gold vs Platinum warranties)
 * Interactive tier selector with animated transitions
 * Reusable: accepts tiers[] and features[] as props
 */

const DEFAULT_TIERS = [
  {
    id: 'gold',
    label: 'Gold',
    icon: Shield,
    sublabel: 'Incluse 6 mois',
    price: 'Incluse',
    priceSub: "a l'achat",
    accentColor: '#F59E0B',
    recommended: false,
  },
  {
    id: 'platinum',
    label: 'Platinum',
    icon: ShieldCheck,
    sublabel: '12 ou 24 mois',
    price: 'Sur devis',
    priceSub: 'selon vehicule',
    accentColor: '#C4A484',
    recommended: true,
  },
]

const DEFAULT_FEATURES = [
  { label: 'Moteur (bloc, culasse, joints)', gold: true, platinum: true },
  { label: 'Boite de vitesses', gold: true, platinum: true },
  { label: 'Transmission (cardans, differentiel)', gold: true, platinum: true },
  { label: 'Systeme de refroidissement', gold: true, platinum: true },
  { label: 'Circuit electrique principal', gold: true, platinum: true },
  { label: 'Direction assistee', gold: true, platinum: true },
  { label: 'Turbo / Compresseur', gold: false, platinum: true },
  { label: 'Climatisation (compresseur)', gold: false, platinum: true },
  { label: 'Electronique embarquee', gold: false, platinum: true },
  { label: 'Suspension & Amortisseurs', gold: false, platinum: true },
  { label: 'Assistance depannage 24/7', gold: false, platinum: true },
  { label: 'Vehicule de remplacement', gold: false, platinum: true },
]

export default function ComparisonTable({
  tiers = DEFAULT_TIERS,
  features = DEFAULT_FEATURES,
}) {
  const [selected, setSelected] = useState(tiers.find(t => t.recommended)?.id || tiers[0]?.id)

  return (
    <div className="my-10">
      {/* Tier selector */}
      <div className="flex items-center gap-3 mb-8">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isActive = selected === tier.id
          return (
            <button
              key={tier.id}
              onClick={() => setSelected(tier.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-300 ${
                isActive
                  ? `bg-[${tier.accentColor}]/15 border shadow-lg`
                  : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:border-white/10 hover:text-white/60'
              }`}
              style={isActive ? {
                color: tier.accentColor,
                borderColor: `${tier.accentColor}40`,
                backgroundColor: `${tier.accentColor}15`,
                boxShadow: `0 4px 20px ${tier.accentColor}10`,
              } : {}}
            >
              <Icon size={16} />
              {tier.label}
            </button>
          )
        })}
      </div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isActive = selected === tier.id
          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                isActive
                  ? 'shadow-lg'
                  : 'border-white/[0.06] bg-white/[0.02] opacity-50'
              }`}
              style={isActive ? {
                borderColor: `${tier.accentColor}30`,
                backgroundColor: `${tier.accentColor}08`,
                boxShadow: `0 4px 24px ${tier.accentColor}08`,
              } : {}}
            >
              {tier.recommended && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4A484] text-[#1A0F0F] text-[10px] font-bold uppercase tracking-wider">
                    <Star size={10} />
                    Recommande
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ backgroundColor: `${tier.accentColor}15` }}
                >
                  <Icon size={20} style={{ color: tier.accentColor }} />
                </div>
                <div>
                  <h4 className="font-display text-lg text-white">{tier.label}</h4>
                  <p className="text-xs text-white/40 font-sans">{tier.sublabel}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-3xl text-white">{tier.price}</span>
                <span className="text-sm text-white/30 font-sans">{tier.priceSub}</span>
              </div>

              <div className="space-y-2.5">
                {features.map((feature, i) => {
                  const included = feature[tier.id]
                  return (
                    <div key={i} className="flex items-center gap-3">
                      {included ? (
                        <Check size={14} className="text-emerald-400 shrink-0" />
                      ) : (
                        <X size={14} className="text-white/15 shrink-0" />
                      )}
                      <span className={`text-sm font-sans ${included ? 'text-white/70' : 'text-white/25'}`}>
                        {feature.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

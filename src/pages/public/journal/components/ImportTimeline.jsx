import { Search, Ship, FileCheck, Stamp, Key } from 'lucide-react'

/**
 * ImportTimeline - Horizontal step-by-step visual for the Import Process
 * Steps: Projet > Recherche > Import > Homologation > Livraison
 * Gold accent on completed steps, subtle connector lines
 */

const STEPS = [
  {
    icon: Search,
    label: 'Projet',
    sublabel: 'Definition des criteres',
    detail: 'Budget, modele, options souhaitees, pays cible.',
  },
  {
    icon: Ship,
    label: 'Recherche',
    sublabel: 'Sourcing international',
    detail: 'Inspection du vehicule, negociation, achat securise.',
  },
  {
    icon: FileCheck,
    label: 'Import',
    sublabel: 'Transport & douanes',
    detail: 'Acheminement, dedouanement, controle technique.',
  },
  {
    icon: Stamp,
    label: 'Homologation',
    sublabel: 'Mise en conformite',
    detail: 'DREAL, carte grise francaise, plaques definitives.',
  },
  {
    icon: Key,
    label: 'Livraison',
    sublabel: 'Remise des cles',
    detail: 'Preparation finale, garantie, mise a la route.',
  },
]

export default function ImportTimeline() {
  return (
    <div className="my-10">
      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between relative">
          {/* Connector line */}
          <div className="absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#C4A484]/25 to-transparent" />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex flex-col items-center text-center relative z-10 w-1/5 px-2">
                {/* Circle */}
                <div className="w-12 h-12 rounded-full border-2 border-[#C4A484]/30 bg-[#1A0F0F] flex items-center justify-center mb-4 group-hover:border-[#C4A484] transition-colors">
                  <Icon size={20} className="text-[#C4A484]" />
                </div>

                {/* Step number */}
                <span className="text-[10px] text-[#C4A484]/60 font-mono font-bold mb-1.5">
                  0{i + 1}
                </span>

                {/* Label */}
                <p className="font-sans font-semibold text-white/80 text-sm mb-1">{step.label}</p>
                <p className="text-[11px] text-[#C4A484]/60 font-sans mb-2">{step.sublabel}</p>
                <p className="text-xs text-white/35 font-sans leading-relaxed">{step.detail}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isLast = i === STEPS.length - 1
          return (
            <div key={i} className="flex gap-4">
              {/* Connector column */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#C4A484]/30 bg-[#1A0F0F] flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#C4A484]" />
                </div>
                {!isLast && (
                  <div className="w-px h-full min-h-[40px] bg-[#C4A484]/15" />
                )}
              </div>

              {/* Content */}
              <div className="pb-6">
                <span className="text-[10px] text-[#C4A484]/50 font-mono font-bold">0{i + 1}</span>
                <p className="font-sans font-semibold text-white/80 text-sm">{step.label}</p>
                <p className="text-xs text-white/35 font-sans leading-relaxed mt-1">{step.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

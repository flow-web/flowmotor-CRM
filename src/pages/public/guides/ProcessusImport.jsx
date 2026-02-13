import {
  Search, ClipboardCheck, Truck, FileCheck, Package,
  ArrowRight, Shield, Clock, Globe, CheckCircle2
} from 'lucide-react'
import ArticleLayout from './ArticleLayout'

/**
 * ProcessusImport - Article: "Le processus d'import en 5 etapes"
 * Timeline visual with 5 steps: Recherche > Inspection > Import > Homologation > Livraison
 */

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'etape-1', title: '1. Recherche du vehicule' },
  { id: 'etape-2', title: '2. Inspection & Expertise' },
  { id: 'etape-3', title: '3. Import & Logistique' },
  { id: 'etape-4', title: '4. Homologation' },
  { id: 'etape-5', title: '5. Livraison' },
  { id: 'delais', title: 'Delais & Tarifs' },
]

const STEPS = [
  {
    number: '01',
    title: 'Recherche du vehicule',
    id: 'etape-1',
    icon: Search,
    duration: '3-7 jours',
    description:
      'Notre equipe de chasseurs identifie votre vehicule ideal sur les marches internationaux. ' +
      'Nous explorons nos reseaux en Suisse, Allemagne, Belgique et Japon pour trouver les meilleures ' +
      'opportunites en termes de prix, kilometrage et historique.',
    details: [
      'Analyse de vos criteres (marque, modele, budget, couleur)',
      'Recherche sur les marches de confiance en Europe et au Japon',
      'Verification de l\'historique et des rapports d\'entretien',
      'Pre-selection de 3 a 5 candidats avec comparatif detaille',
    ],
    highlight: 'Vous validez le vehicule avant toute avancee — zero engagement.',
  },
  {
    number: '02',
    title: 'Inspection & Expertise',
    id: 'etape-2',
    icon: ClipboardCheck,
    duration: '1-3 jours',
    description:
      'Chaque vehicule est soumis a une inspection rigoreuse en 120 points. ' +
      'Nous ne laissons rien au hasard : mecanique, carrosserie, interieur, historique administratif.',
    details: [
      'Inspection mecanique en 120 points par un expert certifie',
      'Verification carrosserie (peinture, alignement, anti-corrosion)',
      'Controle des fluides, freins, pneus et suspension',
      'Rapport photographique complet envoye sous 24h',
    ],
    highlight: 'Rapport d\'inspection complet avec photos HD — inclus dans nos frais.',
  },
  {
    number: '03',
    title: 'Import & Logistique',
    id: 'etape-3',
    icon: Truck,
    duration: '5-15 jours (UE) / 6-8 sem. (Japon)',
    description:
      'Le vehicule est transporte en securite jusqu\'a notre plateforme en France. ' +
      'Nous gerons l\'ensemble de la logistique : transport, dedouanement, TVA, et formalites.',
    details: [
      'Transport sur camion plateau ferme (Europe) ou conteneur maritime (Japon)',
      'Dedouanement et paiement des droits de douane',
      'Calcul et paiement de la TVA (regime marge ou TVA classique)',
      'Assurance transport tous risques incluse',
    ],
    highlight: 'Assurance tous risques incluse pendant tout le transport.',
  },
  {
    number: '04',
    title: 'Homologation DREAL',
    id: 'etape-4',
    icon: FileCheck,
    duration: '5-10 jours',
    description:
      'Pour les vehicules hors UE ou necessitant une mise en conformite, nous prenons en charge ' +
      'l\'homologation aupres de la DREAL (Direction Regionale de l\'Environnement). ' +
      'Le vehicule recoit sa carte grise francaise.',
    details: [
      'Constitution du dossier technique complet',
      'Passage au controle technique francais',
      'Demande de reception a titre isole (RTI) si necessaire',
      'Obtention de la carte grise definitive',
    ],
    highlight: 'Nos equipes maitrisent parfaitement les procedures DREAL et prefectorales.',
  },
  {
    number: '05',
    title: 'Livraison & Remise',
    id: 'etape-5',
    icon: Package,
    duration: '1-3 jours',
    description:
      'Le grand jour ! Votre vehicule est prepare, nettoye, et pret pour la remise. ' +
      'Livraison a domicile ou retrait dans notre showroom a Lyon.',
    details: [
      'Preparation esthetique complete (detailing interieur/exterieur)',
      'Verification mecanique finale avant remise',
      'Livraison a domicile partout en France (sur devis)',
      'Remise des cles, documents et carnet d\'entretien',
    ],
    highlight: 'Garantie mecanique 6 mois incluse, extensible jusqu\'a 24 mois.',
  },
]

function TimelineStep({ step, index, isLast }) {
  const Icon = step.icon

  return (
    <div id={step.id} className="scroll-mt-28">
      <div className="relative flex gap-6 sm:gap-8">
        {/* Timeline Line + Dot */}
        <div className="flex flex-col items-center shrink-0">
          {/* Dot */}
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#C4A484]/40 bg-[#C4A484]/10 z-10 relative">
              <Icon size={20} className="text-[#C4A484]" />
            </div>
            {/* Number badge */}
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#C4A484] text-[#1A0F0F] text-[10px] font-bold font-sans z-20">
              {step.number}
            </span>
          </div>
          {/* Connector line */}
          {!isLast && (
            <div className="w-px flex-1 bg-gradient-to-b from-[#C4A484]/30 to-[#C4A484]/5 min-h-[40px]" />
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 ${!isLast ? 'pb-12' : 'pb-0'}`}>
          {/* Title + Duration */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="font-display text-xl sm:text-2xl text-white">
              {step.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/40 font-sans">
              <Clock size={11} className="text-[#C4A484]/60" />
              {step.duration}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/50 font-sans leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Details list */}
          <div className="space-y-2.5 mb-5">
            {step.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={14} className="text-[#C4A484]/60 mt-0.5 shrink-0" />
                <span className="text-sm text-white/60 font-sans">{detail}</span>
              </div>
            ))}
          </div>

          {/* Highlight box */}
          {step.highlight && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#C4A484]/15 bg-[#C4A484]/[0.05]">
              <Shield size={16} className="text-[#C4A484] mt-0.5 shrink-0" />
              <p className="text-sm text-[#C4A484]/80 font-sans font-medium">
                {step.highlight}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProcessusImport() {
  return (
    <ArticleLayout
      title="Le processus d'import en 5 etapes"
      subtitle="De la recherche du vehicule a la remise des cles, decouvrez comment nous importons votre voiture de reve en toute transparence."
      readTime={8}
      seoTitle="Processus d'importation automobile - Guide complet"
      seoDescription="Decouvrez les 5 etapes de l'importation automobile avec Flow Motor : recherche, inspection, import, homologation DREAL et livraison. Guide complet."
      seoUrl="/guides/processus-import"
      sections={SECTIONS}
      prevArticle={null}
      nextArticle={{ title: 'Nos garanties', path: '/guides/garanties' }}
    >
      {/* ── Introduction ── */}
      <section id="introduction" className="scroll-mt-28 mb-12">
        <p className="text-base sm:text-lg text-white/60 font-sans leading-relaxed mb-6">
          L'importation d'un vehicule peut sembler complexe : logistique internationale, dedouanement,
          homologation... Chez Flow Motor, nous avons simplifie ce processus en <strong className="text-white/80">5 etapes claires et transparentes</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Globe, label: 'Suisse, Allemagne, Japon', sublabel: 'Marches sources' },
            { icon: Shield, label: 'Garantie 6-24 mois', sublabel: 'Protection incluse' },
            { icon: Clock, label: '2-8 semaines', sublabel: 'Delai moyen' },
          ].map(({ icon: ItemIcon, label, sublabel }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#C4A484]/10 shrink-0">
                <ItemIcon size={18} className="text-[#C4A484]" />
              </div>
              <div>
                <p className="text-sm font-sans font-medium text-white/80">{label}</p>
                <p className="text-xs text-white/30 font-sans">{sublabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gold separator */}
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent" />
      </section>

      {/* ── Timeline ── */}
      <section className="space-y-0">
        {STEPS.map((step, index) => (
          <TimelineStep
            key={step.id}
            step={step}
            index={index}
            isLast={index === STEPS.length - 1}
          />
        ))}
      </section>

      {/* ── Delais & Tarifs ── */}
      <section id="delais" className="scroll-mt-28 mt-16">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2 className="font-display text-2xl sm:text-3xl text-white mb-6">
          Delais & Tarifs indicatifs
        </h2>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#C4A484]/20">
                <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.15em] text-[#C4A484] font-sans font-semibold">
                  Origine
                </th>
                <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.15em] text-[#C4A484] font-sans font-semibold">
                  Delai total
                </th>
                <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.15em] text-[#C4A484] font-sans font-semibold">
                  Transport
                </th>
                <th className="text-left py-4 px-4 text-xs uppercase tracking-[0.15em] text-[#C4A484] font-sans font-semibold">
                  Homologation
                </th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {[
                { origin: 'Suisse', flag: 'CH', delay: '2-3 semaines', transport: 'Camion plateau', homologation: 'Simplifiee' },
                { origin: 'Allemagne', flag: 'DE', delay: '2-3 semaines', transport: 'Camion plateau', homologation: 'Intra-UE' },
                { origin: 'Belgique', flag: 'BE', delay: '10-15 jours', transport: 'Camion plateau', homologation: 'Intra-UE' },
                { origin: 'Japon', flag: 'JP', delay: '6-8 semaines', transport: 'Maritime conteneur', homologation: 'RTI obligatoire' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-white/80 font-medium">
                    <span className="mr-2">{row.flag === 'CH' ? '🇨🇭' : row.flag === 'DE' ? '🇩🇪' : row.flag === 'BE' ? '🇧🇪' : '🇯🇵'}</span>
                    {row.origin}
                  </td>
                  <td className="py-4 px-4 text-white/60">{row.delay}</td>
                  <td className="py-4 px-4 text-white/60">{row.transport}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      row.flag === 'JP'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {row.homologation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-white/30 font-sans">
          * Les delais sont indicatifs et peuvent varier selon la disponibilite du vehicule
          et les conditions de transport. Contactez-nous pour un devis personnalise.
        </p>
      </section>
    </ArticleLayout>
  )
}

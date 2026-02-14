import { Link } from 'react-router-dom'
import { Scale, AlertTriangle, TrendingDown, Euro, Calculator, Leaf } from 'lucide-react'
import JournalArticleLayout from './JournalArticleLayout'
import FAQAccordion from './components/FAQAccordion'

/**
 * FiscaliteMalus - Article: "Fiscalite auto 2026 : malus CO2 et TVA"
 * Includes comparison tables for TVA regimes and malus baremes
 */

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'malus-2026', title: 'Malus CO2 en 2026' },
  { id: 'tva-regimes', title: 'TVA Marge vs Apparente' },
  { id: 'optimisation', title: 'Strategies d\'optimisation' },
  { id: 'faq-fiscalite', title: 'Questions frequentes' },
]

const MALUS_BAREME = [
  { co2: '< 118 g/km', malus: '0 EUR', level: 'green' },
  { co2: '118 - 130 g/km', malus: '50 - 540 EUR', level: 'green' },
  { co2: '131 - 150 g/km', malus: '983 - 4 279 EUR', level: 'yellow' },
  { co2: '151 - 170 g/km', malus: '5 047 - 12 500 EUR', level: 'yellow' },
  { co2: '171 - 190 g/km', malus: '14 881 - 30 000 EUR', level: 'orange' },
  { co2: '191 - 225 g/km', malus: '33 125 - 50 000 EUR', level: 'red' },
  { co2: '> 225 g/km', malus: '60 000 EUR+', level: 'red' },
]

const FAQ_ITEMS = [
  {
    q: "La TVA sur marge, c'est legal ?",
    a: "Absolument. La TVA sur marge (art. 297 A du CGI) est le regime normal pour les vehicules d'occasion achetes a un vendeur qui n'a pas pu deduire la TVA a l'achat. C'est le cas de la majorite des vehicules UE d'occasion.",
  },
  {
    q: "Comment connaitre le taux de CO2 exact de mon vehicule ?",
    a: "Le taux de CO2 figure sur le certificat de conformite (COC) et sur la carte grise (champ V.7). Attention : le taux WLTP (norme actuelle) est generalement plus eleve que l'ancien taux NEDC.",
  },
  {
    q: "Le malus est-il deductible pour une entreprise ?",
    a: "Non, le malus ecologique n'est pas deductible fiscalement. C'est une taxe non recuperable, meme pour les entreprises assujetties a la TVA. C'est pourquoi il est essentiel de l'integrer dans le cout total.",
  },
  {
    q: "Existe-t-il des vehicules premium exoneres de malus ?",
    a: "Les vehicules hybrides rechargeables avec moins de 50 g/km de CO2 et les vehicules 100% electriques sont exoneres. Certains SUV premium electriques (BMW iX, Mercedes EQS, Audi e-tron) echappent donc au malus.",
  },
  {
    q: "Le quitus fiscal est-il payant ?",
    a: "Le quitus fiscal est gratuit pour les vehicules UE d'occasion. Il atteste que la TVA a bien ete payee dans le pays d'origine. Il est delivre par le service des impots des entreprises (SIE) de votre departement.",
  },
]

export default function FiscaliteMalus() {
  return (
    <JournalArticleLayout
      title="Fiscalite auto 2026 : malus CO2 et TVA, ce qui change"
      subtitle="Bareme du malus ecologique, TVA sur marge vs TVA apparente, et strategies d'optimisation pour votre import automobile."
      readTime={8}
      date="2026-01-22"
      category="Fiscalite & Malus"
      seoTitle="Fiscalite automobile 2026 - Malus CO2, TVA sur marge, optimisation"
      seoDescription="Guide complet de la fiscalite automobile 2026 : nouveau bareme du malus CO2, regimes TVA (marge vs apparente), strategies d'optimisation pour l'import."
      seoUrl="/journal/fiscalite-malus-co2"
      sections={SECTIONS}
      prevArticle={{ title: 'Importer sans risque', path: '/journal/comment-importer-sans-risque' }}
      nextArticle={{ title: 'Entretien vehicule premium', path: '/journal/entretien-vehicule-premium' }}
    >
      {/* ── Introduction ── */}
      <section id="introduction" className="scroll-mt-28 mb-12">
        <p>
          La fiscalite automobile francaise evolue chaque annee, et 2026 ne fait pas exception.
          Le malus ecologique atteint des niveaux records, rendant <strong>certains vehicules
          sportifs ou SUV quasi inabordables</strong> a cause d'une taxe qui peut depasser le prix
          du vehicule lui-meme.
        </p>
        <p>
          Parallelement, le choix entre <strong>TVA sur marge</strong> et <strong>TVA apparente</strong> impacte
          directement le prix final pour l'acheteur — et la rentabilite pour le vendeur.
          Comprendre ces mecanismes, c'est pouvoir optimiser son achat.
        </p>

        {/* Alert box */}
        <div className="not-prose my-8 p-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-semibold text-amber-400/90 text-sm mb-1">
                Point de vigilance 2026
              </p>
              <p className="text-sm text-white/50 font-sans leading-relaxed">
                Le seuil de declenchement du malus descend a 118 g/km CO2 (WLTP) en 2026.
                Un vehicule exonere en 2025 peut etre taxe en 2026. Verifiez avant d'acheter.
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent" />
      </section>

      {/* ── Malus 2026 ── */}
      <section id="malus-2026" className="scroll-mt-28 mb-12">
        <h2>Le malus CO2 en 2026</h2>
        <p>
          Le malus ecologique est calcule a partir du taux d'emission de CO2 en norme WLTP,
          indique sur le certificat de conformite du vehicule.
        </p>

        {/* Malus barème table */}
        <div className="not-prose my-8 rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.04] bg-white/[0.02]">
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-sans font-semibold flex items-center gap-2">
              <Scale size={12} className="text-[#C4A484]" />
              Bareme indicatif du malus 2026 (WLTP)
            </p>
          </div>
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Emissions CO2</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Malus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {MALUS_BAREME.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-white/70">{row.co2}</td>
                  <td className="px-5 py-3">
                    <span className={`font-medium ${
                      row.level === 'green' ? 'text-emerald-400' :
                      row.level === 'yellow' ? 'text-yellow-400' :
                      row.level === 'orange' ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {row.malus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Impact examples */}
        <h3>Exemples concrets</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {[
            { model: 'BMW M3 Competition', co2: '205 g/km', malus: '~40 000 EUR', level: 'red' },
            { model: 'Mercedes C300d AMG', co2: '148 g/km', malus: '~3 800 EUR', level: 'yellow' },
            { model: 'Audi A4 40 TDI', co2: '132 g/km', malus: '~1 100 EUR', level: 'green' },
            { model: 'BMW 330e Hybride', co2: '32 g/km', malus: '0 EUR', level: 'green' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div>
                <p className="text-sm font-sans font-medium text-white/80">{item.model}</p>
                <p className="text-xs text-white/35 font-sans">{item.co2}</p>
              </div>
              <span className={`text-sm font-mono font-semibold ${
                item.level === 'green' ? 'text-emerald-400' :
                item.level === 'yellow' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {item.malus}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TVA Regimes ── */}
      <section id="tva-regimes" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>TVA sur Marge vs TVA Apparente</h2>
        <p>
          Le regime de TVA applique a la vente depend de l'origine du vehicule et des conditions
          d'achat. Cette distinction est <strong>cruciale</strong> car elle impacte le prix final
          de plusieurs milliers d'euros.
        </p>

        {/* Comparison */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {/* TVA sur Marge */}
          <div className="rounded-2xl border border-[#C4A484]/20 bg-[#C4A484]/[0.04] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C4A484]/15 flex items-center justify-center">
                <Euro size={18} className="text-[#C4A484]" />
              </div>
              <div>
                <h4 className="font-display text-lg text-white">TVA sur Marge</h4>
                <p className="text-xs text-white/40 font-sans">Art. 297 A du CGI</p>
              </div>
            </div>
            <div className="space-y-3 text-sm font-sans">
              <p className="text-white/50 leading-relaxed">
                La TVA est calculee uniquement sur la <strong className="text-white/80">marge du revendeur</strong>,
                pas sur le prix total. L'acheteur paie un prix TTC unique.
              </p>
              <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider text-[#C4A484] font-semibold mb-2">Exemple</p>
                <p className="text-white/50">Achat : 25 000 EUR | Vente : 30 000 EUR</p>
                <p className="text-white/50">Marge : 5 000 EUR | TVA due : 833 EUR</p>
                <p className="text-[#C4A484] font-medium mt-1">Prix client : 30 000 EUR TTC</p>
              </div>
              <p className="text-emerald-400/70 text-xs">Applicable : vehicules UE d'occasion</p>
            </div>
          </div>

          {/* TVA Apparente */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                <Calculator size={18} className="text-white/60" />
              </div>
              <div>
                <h4 className="font-display text-lg text-white">TVA Apparente</h4>
                <p className="text-xs text-white/40 font-sans">Regime standard</p>
              </div>
            </div>
            <div className="space-y-3 text-sm font-sans">
              <p className="text-white/50 leading-relaxed">
                La TVA de 20% est appliquee sur le <strong className="text-white/80">prix total HT</strong>.
                Le prix HT et la TVA sont detailles sur la facture.
              </p>
              <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">Exemple</p>
                <p className="text-white/50">Prix HT : 25 000 EUR</p>
                <p className="text-white/50">TVA 20% : 5 000 EUR</p>
                <p className="text-white/70 font-medium mt-1">Prix client : 30 000 EUR TTC</p>
              </div>
              <p className="text-amber-400/70 text-xs">Applicable : vehicules hors UE / TVA recuperable</p>
            </div>
          </div>
        </div>

        <blockquote>
          En resume : la TVA sur marge beneficie au client (prix plus bas) tandis que
          la TVA apparente permet a un acheteur professionnel de recuperer la TVA.
        </blockquote>
      </section>

      {/* ── Optimisation ── */}
      <section id="optimisation" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Strategies d'optimisation</h2>

        <div className="not-prose space-y-4 my-8">
          {[
            {
              icon: Leaf,
              title: 'Privilegier les hybrides rechargeables',
              desc: 'Les PHEV avec moins de 50 g/km CO2 sont exoneres de malus. Un BMW 330e ou Mercedes C300e offre la performance sans la taxe.',
            },
            {
              icon: TrendingDown,
              title: 'Anticiper la premiere immatriculation',
              desc: 'Le malus est du a la premiere immatriculation en France. Si le vehicule a deja une carte grise francaise, pas de malus supplementaire.',
            },
            {
              icon: Euro,
              title: 'Comparer TVA marge vs achat hors UE',
              desc: 'Un vehicule UE en TVA marge peut revenir moins cher qu\'un vehicule Suisse meme si le prix d\'achat est superieur, grace a l\'economie de TVA.',
            },
            {
              icon: Calculator,
              title: 'Integrer TOUS les couts dans le calcul',
              desc: 'Transport, douane, CT, homologation, carte grise, malus : seul le cout final compte. Utilisez notre simulateur ou contactez-nous pour une estimation.',
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C4A484]/15 transition-all duration-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C4A484]/10 shrink-0 mt-0.5">
                  <Icon size={18} className="text-[#C4A484]" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-white/80 text-sm mb-1">{item.title}</p>
                  <p className="text-sm text-white/40 font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq-fiscalite" className="scroll-mt-28">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Questions frequentes</h2>

        <div className="not-prose">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </JournalArticleLayout>
  )
}

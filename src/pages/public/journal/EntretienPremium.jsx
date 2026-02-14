import {
  Wrench, Droplets, Thermometer, Gauge, Battery,
  Timer, ShieldCheck, AlertTriangle, CheckCircle, Disc
} from 'lucide-react'
import JournalArticleLayout from './JournalArticleLayout'
import FAQAccordion from './components/FAQAccordion'

/**
 * EntretienPremium - Article: "Entretenir un vehicule premium : les 10 commandements"
 * Practical maintenance guide with checklists and FAQ
 */

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'commandements', title: 'Les 10 commandements' },
  { id: 'calendrier', title: 'Calendrier d\'entretien' },
  { id: 'couts', title: 'Budget a prevoir' },
  { id: 'faq-entretien', title: 'Questions frequentes' },
]

const COMMANDMENTS = [
  {
    icon: Droplets,
    title: 'Respecter les intervalles de vidange',
    desc: "Sur un vehicule premium, l'huile moteur est la ligne de vie du groupe motopropulseur. BMW preconise 15 000 a 30 000 km (Long Life), mais en usage mixte, un intervalle de 15 000 km ou 1 an est plus prudent.",
  },
  {
    icon: Thermometer,
    title: 'Surveiller le liquide de refroidissement',
    desc: "Le liquide de refroidissement doit etre remplace tous les 2 ans. Un liquide degrade peut provoquer une surchauffe — reparation a 3 000 EUR+ sur un moteur alu.",
  },
  {
    icon: Disc,
    title: 'Ne pas negliger le freinage',
    desc: "Disques et plaquettes s'usent plus vite sur un vehicule lourd (SUV). Prevoyez un jeu de plaquettes avant tous les 30 000 km et des disques tous les 60 000 km.",
  },
  {
    icon: Battery,
    title: 'Remplacer la batterie preventivement',
    desc: "Les batteries de vehicules modernes durent 4 a 5 ans. Un remplacement preventif (180-300 EUR) evite une panne au pire moment et preserve l'electronique.",
  },
  {
    icon: Timer,
    title: 'Courroie ou chaine : connaitre son moteur',
    desc: "Les moteurs a courroie de distribution necessitent un remplacement tous les 100 000 - 150 000 km (800-1 500 EUR). Les chaines durent plus longtemps mais doivent etre inspectees apres 200 000 km.",
  },
  {
    icon: Gauge,
    title: 'Controler la pression des pneus',
    desc: "Des pneus sous-gonfles augmentent la consommation de 5% et usent les flancs. Verifiez la pression tous les mois et avant chaque long trajet.",
  },
  {
    icon: ShieldCheck,
    title: 'Utiliser des pieces d\'origine',
    desc: "Sur un vehicule premium, les pieces generiques peuvent impacter les performances et la fiabilite. Privilegiez les pieces OEM (constructeur) ou equivalentes homologuees.",
  },
  {
    icon: Wrench,
    title: 'Conserver l\'historique complet',
    desc: "Chaque intervention doit etre documentee avec factures et photos. Un historique complet valorise le vehicule de 10 a 15% a la revente.",
  },
  {
    icon: AlertTriangle,
    title: 'Ne pas ignorer les voyants',
    desc: "Un voyant moteur allume sur un vehicule premium peut signaler un simple capteur (50 EUR) ou un probleme grave (5 000 EUR). Diagnostiquez rapidement.",
  },
  {
    icon: CheckCircle,
    title: 'Faire un bilan annuel complet',
    desc: "Au-dela des revisions constructeur, faites inspecter les soubassements, la suspension et la direction une fois par an — surtout sur les vehicules importes.",
  },
]

const FAQ_ITEMS = [
  {
    q: "Puis-je faire l'entretien hors reseau constructeur ?",
    a: "Oui, depuis le reglement europeen CE 461/2010, vous pouvez faire entretenir votre vehicule chez un garagiste independant sans perdre la garantie, a condition qu'il utilise des pieces equivalentes et respecte le plan d'entretien.",
  },
  {
    q: "Quel budget annuel prevoir pour un vehicule premium ?",
    a: "Comptez en moyenne 1 200 a 2 500 EUR/an pour un vehicule premium (BMW Serie 3, Mercedes Classe C, Audi A4). Ce budget couvre la revision annuelle, les consommables, et une provision pour l'imprévu.",
  },
  {
    q: "Les vehicules importes ont-ils besoin d'un entretien specifique ?",
    a: "Pas specifiquement. Un vehicule allemand ou suisse recoit le meme entretien qu'un vehicule achete en France. En revanche, verifiez le carnet d'entretien et les intervalles appliques dans le pays d'origine.",
  },
  {
    q: "Comment savoir si l'entretien a ete fait sur un vehicule d'occasion ?",
    a: "Demandez le carnet d'entretien (physique ou numerique), les factures des interventions, et consultez l'historique constructeur via le VIN. Chez Flow Motor, nous verifions systematiquement l'historique complet.",
  },
  {
    q: "La garantie Flow Motor couvre-t-elle l'entretien courant ?",
    a: "Non, nos garanties Gold et Platinum couvrent les pannes mecaniques, pas l'usure normale (vidange, plaquettes, pneus). Cependant, un vehicule bien entretenu a beaucoup moins de risque de panne.",
  },
]

export default function EntretienPremium() {
  return (
    <JournalArticleLayout
      title="Entretenir un vehicule premium : les 10 commandements"
      subtitle="BMW, Mercedes, Audi : les points de vigilance pour preserver la valeur et la fiabilite de votre investissement automobile."
      readTime={7}
      date="2025-12-10"
      category="Mecanique & Entretien"
      seoTitle="Entretien vehicule premium - Guide complet BMW Mercedes Audi"
      seoDescription="Guide d'entretien pour vehicules premium : 10 regles d'or, calendrier de revision, budget a prevoir. Conseils experts Flow Motor."
      seoUrl="/journal/entretien-vehicule-premium"
      sections={SECTIONS}
      prevArticle={{ title: 'Fiscalite auto 2026', path: '/journal/fiscalite-malus-co2' }}
    >
      {/* ── Introduction ── */}
      <section id="introduction" className="scroll-mt-28 mb-12">
        <p>
          Un vehicule premium est un investissement. Une BMW Serie 5, une Mercedes Classe E
          ou une Audi A6 representent <strong>40 000 a 80 000 EUR</strong> — et leur valeur de
          revente depend directement de la qualite de l'entretien.
        </p>
        <p>
          Un vehicule premium bien entretenu conserve 60 a 70% de sa valeur apres 3 ans.
          Un vehicule neglige peut perdre 15 a 20% supplementaires. La difference se chiffre
          en milliers d'euros.
        </p>

        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mt-8" />
      </section>

      {/* ── Les 10 commandements ── */}
      <section id="commandements" className="scroll-mt-28 mb-12">
        <h2>Les 10 commandements</h2>

        <div className="not-prose space-y-4 my-8">
          {COMMANDMENTS.map((cmd, i) => {
            const Icon = cmd.icon
            return (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C4A484]/15 transition-all duration-300">
                {/* Number + Icon */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] text-[#C4A484]/50 font-mono font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <div className="w-10 h-10 rounded-xl bg-[#C4A484]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#C4A484]" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-1">
                  <p className="font-sans font-semibold text-white/80 text-sm mb-1.5">{cmd.title}</p>
                  <p className="text-sm text-white/40 font-sans leading-relaxed">{cmd.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Calendrier d'entretien ── */}
      <section id="calendrier" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Calendrier d'entretien type</h2>
        <p>
          Ce calendrier s'applique aux vehicules premium a moteur thermique en usage mixte
          (ville + route). Adaptez selon votre utilisation.
        </p>

        <div className="not-prose my-8 rounded-xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Intervention</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Frequence</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Cout moyen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                ['Vidange + filtres', '15 000 km / 1 an', '200 - 400 EUR'],
                ['Plaquettes de frein', '30 000 km', '250 - 500 EUR'],
                ['Disques de frein', '60 000 km', '400 - 800 EUR'],
                ['Liquide de frein', '2 ans', '80 - 150 EUR'],
                ['Liquide de refroidissement', '2 ans', '100 - 200 EUR'],
                ['Bougies d\'allumage', '60 000 km', '80 - 200 EUR'],
                ['Courroie de distribution', '100 000 - 150 000 km', '800 - 1 500 EUR'],
                ['Batterie', '4 - 5 ans', '180 - 300 EUR'],
                ['Pneus (jeu de 4)', '30 000 - 50 000 km', '600 - 1 200 EUR'],
                ['Amortisseurs', '80 000 - 120 000 km', '600 - 1 200 EUR'],
              ].map(([intervention, freq, cout], i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-white/70 font-medium">{intervention}</td>
                  <td className="px-5 py-3 text-white/50">{freq}</td>
                  <td className="px-5 py-3 text-[#C4A484]">{cout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Budget a prevoir ── */}
      <section id="couts" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Budget annuel a prevoir</h2>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {[
            {
              segment: 'Compacte Premium',
              examples: 'BMW Serie 1, Audi A3, Mercedes Classe A',
              budget: '800 - 1 500 EUR/an',
              color: 'emerald',
            },
            {
              segment: 'Berline / SUV',
              examples: 'BMW Serie 3/X3, Audi A4/Q5, Mercedes Classe C/GLC',
              budget: '1 200 - 2 500 EUR/an',
              color: 'amber',
            },
            {
              segment: 'Sport / Luxe',
              examples: 'BMW M3/M4, AMG, RS, Porsche',
              budget: '2 000 - 5 000 EUR/an',
              color: 'red',
            },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="font-sans font-semibold text-white/80 text-sm mb-1">{item.segment}</p>
              <p className="text-xs text-white/35 font-sans mb-3">{item.examples}</p>
              <p className={`text-lg font-display ${
                item.color === 'emerald' ? 'text-emerald-400' :
                item.color === 'amber' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {item.budget}
              </p>
            </div>
          ))}
        </div>

        <blockquote>
          Conseil : provisionnez 100 a 200 EUR par mois pour couvrir l'entretien courant
          et constituer une reserve pour les grosses interventions. C'est le prix de la serenite.
        </blockquote>
      </section>

      {/* ── FAQ ── */}
      <section id="faq-entretien" className="scroll-mt-28">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Questions frequentes</h2>

        <div className="not-prose">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </JournalArticleLayout>
  )
}

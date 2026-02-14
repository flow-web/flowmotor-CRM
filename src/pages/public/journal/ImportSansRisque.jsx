import { Link } from 'react-router-dom'
import {
  Shield, AlertTriangle, CheckCircle, Euro,
  FileText, Globe, Truck, Scale
} from 'lucide-react'
import JournalArticleLayout from './JournalArticleLayout'
import ImportTimeline from './components/ImportTimeline'
import FAQAccordion from './components/FAQAccordion'

/**
 * ImportSansRisque - Featured article: "Comment importer sans risque en 2026 ?"
 * Includes ImportTimeline + FAQ Accordion
 */

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'etapes', title: 'Les 5 etapes cles' },
  { id: 'pays', title: 'Choisir le bon pays' },
  { id: 'pieges', title: 'Les pieges a eviter' },
  { id: 'fiscalite', title: 'Fiscalite & couts' },
  { id: 'faq', title: 'Questions frequentes' },
]

const FAQ_ITEMS = [
  {
    q: "Combien de temps prend un import complet ?",
    a: "En moyenne 3 a 6 semaines entre l'achat et la remise des cles, selon le pays d'origine. Un import Allemagne est plus rapide (2-3 semaines) qu'un import Japon (5-8 semaines incluant le transport maritime).",
  },
  {
    q: "Dois-je me deplacer a l'etranger pour acheter ?",
    a: "Non. Flow Motor se charge de tout : inspection sur place, negociation, paiement securise et transport. Vous restez en France pendant toute la procedure.",
  },
  {
    q: "Quels documents sont necessaires pour immatriculation ?",
    a: "Le certificat de conformite europeen (COC), le certificat de dedouanement (846A), le controle technique francais, le quitus fiscal, et la demande d'immatriculation sur l'ANTS.",
  },
  {
    q: "Y a-t-il des risques de kilometrage trafique ?",
    a: "C'est le risque principal de l'import amateur. Chez Flow Motor, chaque vehicule fait l'objet d'un historique complet (CarVertical, AutoDNA) et d'une inspection physique par un expert independant.",
  },
  {
    q: "La garantie constructeur est-elle valable en France ?",
    a: "Oui, pour les vehicules de marques europeennes (BMW, Mercedes, Audi, etc.), la garantie constructeur est valable dans toute l'Union Europeenne. Nous verifions systematiquement le statut de garantie avant achat.",
  },
  {
    q: "Puis-je importer un vehicule non europeen (USA, Japon) ?",
    a: "Oui, mais la procedure est plus complexe : homologation DREAL obligatoire, modifications eventuelles (phares, compteur km), et delais plus longs. Nous vous accompagnons sur ces imports specifiques.",
  },
]

export default function ImportSansRisque() {
  return (
    <JournalArticleLayout
      title="Comment importer sans risque en 2026 ?"
      subtitle="Le guide complet pour acheter votre vehicule a l'etranger en toute serenite. De la recherche a l'immatriculation, chaque etape decryptee par nos experts."
      readTime={12}
      date="2026-01-15"
      category="Guides Import"
      seoTitle="Comment importer un vehicule sans risque en 2026 - Guide complet"
      seoDescription="Guide complet de l'importation automobile en 2026 : etapes, fiscalite, pieges a eviter, pays recommandes. Conseils d'experts par Flow Motor."
      seoUrl="/journal/comment-importer-sans-risque"
      sections={SECTIONS}
      nextArticle={{ title: 'Fiscalite auto 2026', path: '/journal/fiscalite-malus-co2' }}
    >
      {/* ── Introduction ── */}
      <section id="introduction" className="scroll-mt-28 mb-12">
        <p>
          Importer un vehicule depuis l'etranger peut vous faire economiser
          entre <strong>3 000 et 15 000 EUR</strong> selon le modele et le pays d'origine. Mais sans
          methode rigoureuse, cette economie peut se transformer en cauchemar administratif
          et financier.
        </p>
        <p>
          Chez Flow Motor, nous avons importe plus de 200 vehicules premium depuis 2020.
          Ce guide resume tout ce que nous avons appris — pour que vous puissiez acheter
          en connaissance de cause, que vous passiez par un professionnel ou que vous
          tentiez l'aventure seul.
        </p>

        {/* Key stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 not-prose">
          {[
            { icon: Euro, value: '5 000 - 15 000 EUR', label: "Economie moyenne sur un vehicule premium" },
            { icon: Globe, value: '3 a 6 semaines', label: 'Delai moyen d\'un import complet' },
            { icon: Shield, value: '6 a 24 mois', label: 'Garantie mecanique Flow Motor' },
          ].map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#C4A484]/10 shrink-0 mt-0.5">
                <Icon size={16} className="text-[#C4A484]" />
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-white/80">{value}</p>
                <p className="text-xs text-white/35 font-sans leading-relaxed">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent" />
      </section>

      {/* ── Les 5 etapes ── */}
      <section id="etapes" className="scroll-mt-28 mb-12">
        <h2>Les 5 etapes cles de l'import</h2>
        <p>
          L'importation d'un vehicule suit un processus lineaire en 5 etapes. Chaque etape
          est critique — un oubli a l'etape 3 peut bloquer l'immatriculation a l'etape 5.
        </p>

        {/* Timeline component */}
        <div className="not-prose">
          <ImportTimeline />
        </div>

        <h3>Etape 1 : Definir son projet</h3>
        <p>
          Avant de chercher un vehicule, clarifiez votre budget <strong>tout compris</strong> :
          prix d'achat + transport + douane + homologation + mise en circulation.
          Pour un vehicule a 30 000 EUR, prevoyez 2 000 a 4 000 EUR de frais supplementaires.
        </p>

        <h3>Etape 2 : Sourcing et inspection</h3>
        <p>
          Ne jamais acheter un vehicule a distance sans inspection physique. Les annonces
          en ligne cachent souvent des defauts cosmetiques ou mecaniques. Faites appel a un
          expert local ou a un mandataire qui inspectera le vehicule avant l'achat.
        </p>

        <h3>Etape 3 : Transport et dedouanement</h3>
        <p>
          Le transport se fait par camion (Europe) ou conteneur maritime (hors UE).
          Le dedouanement implique le paiement de la TVA (20%) et, pour les vehicules
          hors UE, des droits de douane (6,5% pour les voitures).
        </p>

        <h3>Etape 4 : Homologation</h3>
        <p>
          Pour les vehicules UE avec COC (Certificat de Conformite), la procedure est simple.
          Pour les vehicules hors UE ou sans COC, une reception DREAL est necessaire —
          plus longue et plus couteuse.
        </p>

        <h3>Etape 5 : Immatriculation et livraison</h3>
        <p>
          Demande de carte grise sur l'ANTS avec le quitus fiscal, le CT francais,
          et le certificat de conformite. Comptez 5 a 10 jours pour recevoir
          votre carte grise definitive.
        </p>
      </section>

      {/* ── Choisir le bon pays ── */}
      <section id="pays" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Choisir le bon pays d'import</h2>
        <p>
          Tous les pays ne sont pas equivalents en termes de rapport qualite-prix
          et de facilite administrative.
        </p>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {[
            {
              flag: 'DE',
              country: 'Allemagne',
              pros: 'Grand marche, delai court, COC facile',
              cons: 'Vehicules souvent a fort kilometrage',
              best: 'BMW, Mercedes, Audi, Porsche',
            },
            {
              flag: 'CH',
              country: 'Suisse',
              pros: 'Vehicules bien entretenus, bas km',
              cons: 'Prix plus eleves, pas UE (douane)',
              best: 'Tous segments premium',
            },
            {
              flag: 'BE',
              country: 'Belgique',
              pros: 'Proximite, procedure simple UE',
              cons: 'Marche plus petit',
              best: 'Vehicules francais et allemands',
            },
            {
              flag: 'JP',
              country: 'Japon',
              pros: 'Vehicules impeccables, prix bas',
              cons: 'Delai long, homologation DREAL',
              best: 'Toyota, Lexus, Nissan GT-R, JDM',
            },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.flag === 'DE' ? '\uD83C\uDDE9\uD83C\uDDEA' : item.flag === 'CH' ? '\uD83C\uDDE8\uD83C\uDDED' : item.flag === 'BE' ? '\uD83C\uDDE7\uD83C\uDDEA' : '\uD83C\uDDEF\uD83C\uDDF5'}</span>
                <h4 className="font-sans font-semibold text-white/80 text-sm">{item.country}</h4>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <p className="text-emerald-400/70 flex items-start gap-2">
                  <CheckCircle size={12} className="shrink-0 mt-0.5" />
                  {item.pros}
                </p>
                <p className="text-red-400/60 flex items-start gap-2">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                  {item.cons}
                </p>
                <p className="text-white/40 mt-2">Ideal pour : {item.best}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pieges a eviter ── */}
      <section id="pieges" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Les 5 pieges a eviter</h2>

        <div className="not-prose space-y-4 my-8">
          {[
            {
              title: 'Ne pas verifier le kilometrage',
              desc: 'Le "compteur tourne" est frequent sur les vehicules allemands. Verifiez systematiquement l\'historique via CarVertical ou AutoDNA.',
            },
            {
              title: 'Oublier les frais annexes',
              desc: 'TVA, transport, CT, homologation, malus CO2, carte grise : ces frais peuvent atteindre 20% du prix d\'achat.',
            },
            {
              title: 'Acheter sans COC',
              desc: 'Sans Certificat de Conformite europeen, l\'homologation DREAL coutera 500 a 2 000 EUR et prendra plusieurs semaines.',
            },
            {
              title: 'Ignorer le malus ecologique',
              desc: 'En 2026, le malus peut depasser 50 000 EUR pour les vehicules les plus polluants. Verifiez le taux de CO2 avant l\'achat.',
            },
            {
              title: 'Payer sans escrow securise',
              desc: 'Ne payez jamais par virement direct a un particulier etranger. Utilisez un service d\'escrow ou passez par un mandataire qui securise la transaction.',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-red-500/10 bg-red-500/[0.03]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 shrink-0 mt-0.5">
                <AlertTriangle size={14} className="text-red-400/70" />
              </div>
              <div>
                <p className="font-sans font-semibold text-white/80 text-sm mb-1">{item.title}</p>
                <p className="text-xs text-white/40 font-sans leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fiscalite ── */}
      <section id="fiscalite" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Fiscalite et couts a prevoir</h2>
        <p>
          Le cout total d'un import depend du pays d'origine et du type de vehicule.
          Voici un recapitulatif des principaux postes de depense.
        </p>

        <div className="not-prose my-8 rounded-xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Poste</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">UE</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-white/40 font-semibold">Hors UE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                ['TVA', '20%', '20%'],
                ['Droits de douane', '0%', '6,5%'],
                ['Transport', '300 - 1 200 EUR', '1 500 - 3 500 EUR'],
                ['Homologation', '0 - 200 EUR (COC)', '500 - 2 000 EUR (DREAL)'],
                ['Controle technique', '80 - 120 EUR', '80 - 120 EUR'],
                ['Carte grise', 'Variable region', 'Variable region'],
                ['Malus CO2', 'Selon emissions', 'Selon emissions'],
              ].map(([label, eu, hors], i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-white/70 font-medium">{label}</td>
                  <td className="px-5 py-3 text-white/50">{eu}</td>
                  <td className="px-5 py-3 text-white/50">{hors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <blockquote>
          Conseil Flow Motor : pour estimer le cout total, ajoutez systematiquement 15 a 20%
          au prix d'achat brut. Mieux vaut surestimer et avoir une bonne surprise que l'inverse.
        </blockquote>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-28">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2>Questions frequentes</h2>

        <div className="not-prose">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </JournalArticleLayout>
  )
}

import { useState } from 'react'
import {
  Shield, ShieldCheck, Check, X, Star, Wrench,
  Car, Clock, Phone, ChevronDown, Zap, Heart
} from 'lucide-react'
import ArticleLayout from './ArticleLayout'

/**
 * Garanties - Article: "Nos garanties : Gold vs Platinum"
 * Comparative table of warranty tiers with detailed coverage
 */

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'comparatif', title: 'Comparatif Gold / Platinum' },
  { id: 'couverture', title: 'Couverture detaillee' },
  { id: 'exclusions', title: 'Exclusions' },
  { id: 'faq-garantie', title: 'Questions frequentes' },
]

const GOLD_FEATURES = [
  { label: 'Moteur (bloc, culasse, joints)', included: true },
  { label: 'Boite de vitesses', included: true },
  { label: 'Transmission (cardans, differentiel)', included: true },
  { label: 'Systeme de refroidissement', included: true },
  { label: 'Circuit electrique principal', included: true },
  { label: 'Direction assistee', included: true },
  { label: 'Turbo / Compresseur', included: false },
  { label: 'Climatisation (compresseur)', included: false },
  { label: 'Electronique embarquee', included: false },
  { label: 'Suspension & Amortisseurs', included: false },
  { label: 'Assistance depannage 24/7', included: false },
  { label: 'Vehicule de remplacement', included: false },
]

const PLATINUM_FEATURES = [
  { label: 'Moteur (bloc, culasse, joints)', included: true },
  { label: 'Boite de vitesses', included: true },
  { label: 'Transmission (cardans, differentiel)', included: true },
  { label: 'Systeme de refroidissement', included: true },
  { label: 'Circuit electrique principal', included: true },
  { label: 'Direction assistee', included: true },
  { label: 'Turbo / Compresseur', included: true },
  { label: 'Climatisation (compresseur)', included: true },
  { label: 'Electronique embarquee', included: true },
  { label: 'Suspension & Amortisseurs', included: true },
  { label: 'Assistance depannage 24/7', included: true },
  { label: 'Vehicule de remplacement', included: true },
]

const FAQ_ITEMS = [
  {
    q: 'La garantie est-elle transferable en cas de revente ?',
    a: 'Oui, nos garanties Gold et Platinum sont transferables au nouveau proprietaire, ce qui valorise votre vehicule en cas de revente.',
  },
  {
    q: 'Ou puis-je faire reparer mon vehicule sous garantie ?',
    a: 'Les reparations sous garantie peuvent etre effectuees dans notre atelier a Lyon ou chez tout garage agree de notre reseau en France.',
  },
  {
    q: 'Y a-t-il un plafond de remboursement ?',
    a: 'La garantie Gold couvre jusqu\'a 3 000 EUR par sinistre. La Platinum couvre jusqu\'a 6 000 EUR par sinistre, sans limite de nombre d\'interventions.',
  },
  {
    q: 'Comment activer la garantie en cas de panne ?',
    a: 'Contactez-nous par telephone au +33 4 12 34 56 78. Un conseiller vous orientera vers le garage le plus proche et prendra en charge la procedure.',
  },
  {
    q: 'Peut-on passer de Gold a Platinum apres l\'achat ?',
    a: 'Oui, le passage de Gold a Platinum est possible dans les 30 jours suivant l\'achat, sous reserve d\'un controle de l\'etat du vehicule.',
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 rounded-xl"
        aria-expanded={open}
      >
        <span className="font-sans font-medium text-white/80 text-sm">{question}</span>
        <ChevronDown
          size={18}
          className={`text-[#C4A484] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '250px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="px-5 pb-4 text-sm text-white/50 font-sans leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function Garanties() {
  const [selectedTier, setSelectedTier] = useState('platinum')

  return (
    <ArticleLayout
      title="Nos garanties : Gold & Platinum"
      subtitle="Parce que la confiance ne s'achete pas, elle se merite. Decouvrez nos deux niveaux de protection mecanique pour rouler l'esprit tranquille."
      readTime={6}
      seoTitle="Garanties mecaniques automobile - Gold vs Platinum"
      seoDescription="Comparez nos garanties mecaniques Gold et Platinum pour vehicules importes. Couverture complete, assistance 24/7, vehicule de remplacement."
      seoUrl="/guides/garanties"
      sections={SECTIONS}
      prevArticle={{ title: 'Le processus d\'import', path: '/guides/processus-import' }}
      nextArticle={{ title: 'Comment acheter', path: '/guides/comment-acheter' }}
    >
      {/* ── Introduction ── */}
      <section id="introduction" className="scroll-mt-28 mb-12">
        <p className="text-base sm:text-lg text-white/60 font-sans leading-relaxed mb-6">
          Acheter un vehicule importe ne doit pas etre un pari. C'est pourquoi chaque vehicule vendu
          par Flow Motor est couvert par une <strong className="text-white/80">garantie mecanique de 6 a 24 mois</strong>,
          extensible selon vos besoins.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, label: '6 a 24 mois', sublabel: 'Duree de couverture' },
            { icon: Wrench, label: 'Reseau agree France', sublabel: 'Reparations partout' },
            { icon: Heart, label: 'Transferable', sublabel: 'Valorise la revente' },
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

        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent" />
      </section>

      {/* ── Comparatif ── */}
      <section id="comparatif" className="scroll-mt-28 mb-12">
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-8">
          Comparatif Gold / Platinum
        </h2>

        {/* Tier selector — No Write, Just Click */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setSelectedTier('gold')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-300 ${
              selectedTier === 'gold'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:border-white/10 hover:text-white/60'
            }`}
          >
            <Shield size={16} />
            Gold
          </button>
          <button
            onClick={() => setSelectedTier('platinum')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-300 ${
              selectedTier === 'platinum'
                ? 'bg-[#C4A484]/15 text-[#C4A484] border border-[#C4A484]/30 shadow-lg shadow-[#C4A484]/10'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:border-white/10 hover:text-white/60'
            }`}
          >
            <ShieldCheck size={16} />
            Platinum
          </button>
        </div>

        {/* Comparison cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gold card */}
          <div className={`rounded-2xl border p-6 transition-all duration-300 ${
            selectedTier === 'gold'
              ? 'border-amber-500/30 bg-amber-500/[0.04] shadow-lg shadow-amber-500/5'
              : 'border-white/[0.06] bg-white/[0.02] opacity-60'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/15">
                <Shield size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white">Gold</h3>
                <p className="text-xs text-white/40 font-sans">Incluse 6 mois</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-3xl text-white">Incluse</span>
              <span className="text-sm text-white/30 font-sans">a l'achat</span>
            </div>

            <div className="space-y-2.5">
              {GOLD_FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <X size={14} className="text-white/15 shrink-0" />
                  )}
                  <span className={`text-sm font-sans ${feature.included ? 'text-white/70' : 'text-white/25'}`}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Platinum card */}
          <div className={`relative rounded-2xl border p-6 transition-all duration-300 ${
            selectedTier === 'platinum'
              ? 'border-[#C4A484]/30 bg-[#C4A484]/[0.04] shadow-lg shadow-[#C4A484]/5'
              : 'border-white/[0.06] bg-white/[0.02] opacity-60'
          }`}>
            {/* Recommended badge */}
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4A484] text-[#1A0F0F] text-[10px] font-bold uppercase tracking-wider">
                <Star size={10} />
                Recommande
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C4A484]/15">
                <ShieldCheck size={20} className="text-[#C4A484]" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white">Platinum</h3>
                <p className="text-xs text-white/40 font-sans">12 ou 24 mois</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-3xl text-white">Sur devis</span>
              <span className="text-sm text-white/30 font-sans">selon vehicule</span>
            </div>

            <div className="space-y-2.5">
              {PLATINUM_FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-sm font-sans text-white/70">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Couverture detaillee ── */}
      <section id="couverture" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2 className="font-display text-2xl sm:text-3xl text-white mb-6">
          Ce que couvrent nos garanties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Car,
              title: 'Groupe motopropulseur',
              desc: 'Moteur, boite de vitesses, embrayage, transmission. Les organes vitaux de votre vehicule.',
              tier: 'Gold + Platinum',
            },
            {
              icon: Zap,
              title: 'Systemes electriques',
              desc: 'Alternateur, demarreur, faisceaux principaux. Platinum ajoute l\'electronique embarquee.',
              tier: 'Gold + Platinum',
            },
            {
              icon: Wrench,
              title: 'Turbo & Climatisation',
              desc: 'Compresseur turbo, echangeur, compresseur de climatisation et condenseur.',
              tier: 'Platinum uniquement',
            },
            {
              icon: Phone,
              title: 'Assistance 24/7',
              desc: 'Depannage, remorquage, vehicule de remplacement pendant la reparation.',
              tier: 'Platinum uniquement',
            },
          ].map(({ icon: ItemIcon, title, desc, tier }, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#C4A484]/10">
                  <ItemIcon size={16} className="text-[#C4A484]" />
                </div>
                <h4 className="font-sans font-semibold text-white/80 text-sm">{title}</h4>
              </div>
              <p className="text-sm text-white/40 font-sans leading-relaxed mb-3">{desc}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider ${
                tier.includes('Gold')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-[#C4A484]/10 text-[#C4A484] border border-[#C4A484]/20'
              }`}>
                {tier}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Exclusions ── */}
      <section id="exclusions" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2 className="font-display text-2xl sm:text-3xl text-white mb-6">
          Exclusions
        </h2>

        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-sm text-white/50 font-sans leading-relaxed mb-4">
            Nos garanties ne couvrent pas les elements suivants, consideres comme de l'usure normale :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Pieces d\'usure (plaquettes, disques, pneus)',
              'Entretien courant (vidange, filtres, bougies)',
              'Carrosserie et peinture',
              'Elements esthetiques (sellerie, plastiques)',
              'Dommages lies a un accident',
              'Modifications non homologuees',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <X size={12} className="text-red-400/40 shrink-0" />
                <span className="text-sm text-white/40 font-sans">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq-garantie" className="scroll-mt-28">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2 className="font-display text-2xl sm:text-3xl text-white mb-6">
          Questions frequentes
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>
    </ArticleLayout>
  )
}

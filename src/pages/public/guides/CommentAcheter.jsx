import { useState } from 'react'
import {
  ChevronDown, Search, CreditCard, FileText, Truck,
  Shield, MessageSquare, ArrowRight, Banknote, Clock,
  CheckCircle2, Star, Users, Handshake
} from 'lucide-react'
import ArticleLayout from './ArticleLayout'

/**
 * CommentAcheter - Article: "Comment acheter un vehicule chez Flow Motor"
 * FAQ-style accordion with buying steps and practical info
 */

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'parcours-achat', title: 'Parcours d\'achat' },
  { id: 'financement', title: 'Options de financement' },
  { id: 'faq', title: 'Questions frequentes' },
]

const BUYING_STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Trouvez votre vehicule',
    description: 'Parcourez notre stock en ligne ou confiez-nous une recherche personnalisee. Notre showroom virtuel presente chaque vehicule avec photos HD, historique et rapport d\'inspection.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Echangez avec notre equipe',
    description: 'Contactez-nous par telephone, email ou via le formulaire. Un conseiller dedie repond a toutes vos questions et organise un rendez-vous si vous souhaitez voir le vehicule.',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Reservez votre vehicule',
    description: 'Un acompte de 10% securise votre vehicule. Nous preparons le bon de commande avec tous les details : prix, options, delais, et modalites de paiement.',
  },
  {
    number: '04',
    icon: CreditCard,
    title: 'Choisissez votre financement',
    description: 'Paiement comptant, credit auto classique ou LOA : nous vous accompagnons pour trouver la solution la plus adaptee a votre budget.',
  },
  {
    number: '05',
    icon: FileText,
    title: 'Signez les documents',
    description: 'Bon de commande, certificat de cession, demande d\'immatriculation... Nous preparons l\'ensemble des documents et vous guidons a chaque etape.',
  },
  {
    number: '06',
    icon: Truck,
    title: 'Recevez votre vehicule',
    description: 'Retrait en showroom ou livraison a domicile. Le vehicule est prepare, nettoye et verifie. Vous repartez avec votre carte grise et votre garantie.',
  },
]

const FINANCING_OPTIONS = [
  {
    icon: Banknote,
    title: 'Paiement comptant',
    description: 'Virement bancaire ou cheque de banque. Remise de 2% pour tout paiement comptant integral.',
    advantages: ['Aucun frais financier', 'Livraison plus rapide', 'Remise 2% sur le prix'],
    tag: 'Le plus avantageux',
    tagColor: 'emerald',
  },
  {
    icon: CreditCard,
    title: 'Credit auto classique',
    description: 'Financement sur 12 a 84 mois via nos partenaires bancaires. Taux competitifs et reponse sous 48h.',
    advantages: ['Taux a partir de 3,9%', 'Duree flexible (12-84 mois)', 'Reponse sous 48h'],
    tag: 'Le plus populaire',
    tagColor: 'blue',
  },
  {
    icon: Clock,
    title: 'LOA / LLD',
    description: 'Location avec option d\'achat ou longue duree. Loyers reduits avec possibilite de rachat en fin de contrat.',
    advantages: ['Loyers reduits', 'Option de rachat en fin', 'Entretien inclus (LLD)'],
    tag: 'Le plus flexible',
    tagColor: 'amber',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Puis-je voir le vehicule avant d\'acheter ?',
    a: 'Absolument. Nous organisons des rendez-vous dans notre showroom a Lyon. Pour les vehicules encore a l\'etranger, nous fournissons un rapport photo/video detaille et proposons des visioconferences avec le vendeur source.',
  },
  {
    q: 'Quel est le montant de l\'acompte ?',
    a: 'L\'acompte de reservation est de 10% du prix du vehicule. Il est integralement deductible du prix final et remboursable si le vehicule ne correspond pas au descriptif annonce.',
  },
  {
    q: 'Combien de temps prend la livraison ?',
    a: 'Pour un vehicule en stock, comptez 3 a 5 jours ouvrables. Pour un import, les delais varient de 2 semaines (Europe) a 8 semaines (Japon). Nous vous tenons informe a chaque etape.',
  },
  {
    q: 'Acceptez-vous les reprises ?',
    a: 'Oui, nous reprenons votre ancien vehicule. La valeur de reprise est deduite du prix du nouveau vehicule. Utilisez notre outil d\'estimation flash pour obtenir une cotation gratuite en 30 secondes.',
  },
  {
    q: 'Les prix affiches sont-ils negociables ?',
    a: 'Nos prix sont calcules pour offrir le meilleur rapport qualite/prix du marche. Neanmoins, nous sommes ouverts a la discussion, surtout en cas de reprise ou de paiement comptant.',
  },
  {
    q: 'Quelle garantie est incluse ?',
    a: 'Chaque vehicule est couvert par notre garantie Gold (6 mois, moteur et boite de vitesses). Vous pouvez opter pour la garantie Platinum (12-24 mois, couverture etendue) pour une protection maximale.',
  },
  {
    q: 'Le vehicule est-il controle avant la vente ?',
    a: 'Oui, chaque vehicule passe une inspection en 120 points. Le rapport d\'inspection detaille est disponible avant l\'achat et inclut photos, mesures et historique d\'entretien verifie.',
  },
  {
    q: 'Puis-je financer un vehicule importe ?',
    a: 'Oui, nos solutions de financement s\'appliquent aux vehicules en stock comme aux imports sur commande. Le financement est mis en place des la validation du bon de commande.',
  },
]

function AccordionItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 rounded-xl"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-[#C4A484]/40 font-sans font-bold tabular-nums shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-sans font-medium text-white/80 text-sm">{question}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-[#C4A484] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '300px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="px-5 pb-4 pl-12 text-sm text-white/50 font-sans leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function CommentAcheter() {
  return (
    <ArticleLayout
      title="Comment acheter chez Flow Motor"
      subtitle="Du premier clic a la remise des cles : tout ce que vous devez savoir pour acheter votre vehicule en toute serenite."
      readTime={5}
      seoTitle="Comment acheter un vehicule - Guide d'achat Flow Motor"
      seoDescription="Guide complet pour acheter un vehicule chez Flow Motor : parcours d'achat, options de financement, reprise, et FAQ. Livraison partout en France."
      seoUrl="/guides/comment-acheter"
      sections={SECTIONS}
      prevArticle={{ title: 'Nos garanties', path: '/guides/garanties' }}
      nextArticle={null}
    >
      {/* ── Introduction ── */}
      <section id="introduction" className="scroll-mt-28 mb-12">
        <p className="text-base sm:text-lg text-white/60 font-sans leading-relaxed mb-6">
          Acheter un vehicule d'exception doit etre un plaisir, pas un parcours du combattant.
          Chez Flow Motor, nous avons concu un <strong className="text-white/80">parcours d'achat simple et transparent</strong>,
          du premier contact a la livraison.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: 'Conseiller dedie', sublabel: 'Un seul interlocuteur' },
            { icon: Shield, label: 'Garantie incluse', sublabel: 'Gold 6 mois minimum' },
            { icon: Star, label: '4.9/5 Google', sublabel: '50+ avis verifies' },
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

      {/* ── Parcours d'achat ── */}
      <section id="parcours-achat" className="scroll-mt-28 mb-12">
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-8">
          Votre parcours d'achat en 6 etapes
        </h2>

        <div className="space-y-4">
          {BUYING_STEPS.map((step, i) => {
            const StepIcon = step.icon
            return (
              <div
                key={i}
                className="group flex gap-4 sm:gap-5 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]
                           hover:border-[#C4A484]/15 hover:bg-white/[0.03] transition-all duration-300"
              >
                {/* Step number + icon */}
                <div className="relative shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C4A484]/10 group-hover:bg-[#C4A484]/15 transition-colors duration-300">
                    <StepIcon size={20} className="text-[#C4A484]" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#C4A484] text-[#1A0F0F] text-[9px] font-bold font-sans">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-semibold text-white/85 text-sm sm:text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/45 font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Options de financement ── */}
      <section id="financement" className="scroll-mt-28 mb-12">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2 className="font-display text-2xl sm:text-3xl text-white mb-8">
          Options de financement
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {FINANCING_OPTIONS.map((option, i) => {
            const OptionIcon = option.icon
            const tagColors = {
              emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            }

            return (
              <div
                key={i}
                className="relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]
                           hover:border-white/10 transition-all duration-300"
              >
                {/* Tag */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider border ${tagColors[option.tagColor]}`}>
                    {option.tag}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#C4A484]/10 shrink-0">
                    <OptionIcon size={20} className="text-[#C4A484]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-white mb-2">{option.title}</h3>
                    <p className="text-sm text-white/45 font-sans leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {option.advantages.map((adv, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-[#C4A484]/60 shrink-0" />
                          <span className="text-xs text-white/50 font-sans">{adv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl border border-[#C4A484]/15 bg-[#C4A484]/[0.05]">
          <Shield size={16} className="text-[#C4A484] mt-0.5 shrink-0" />
          <p className="text-sm text-[#C4A484]/80 font-sans">
            <strong>Reprise possible :</strong> la valeur de votre ancien vehicule peut servir d'apport
            pour reduire vos mensualites. Estimez sa valeur avec notre outil{' '}
            <a href="/atelier" className="underline underline-offset-2 hover:text-[#C4A484] transition-colors">
              Estimation Flash
            </a>.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-28">
        <div className="h-px bg-gradient-to-r from-[#C4A484]/30 via-[#C4A484]/10 to-transparent mb-10" />

        <h2 className="font-display text-2xl sm:text-3xl text-white mb-8">
          Questions frequentes
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} question={item.q} answer={item.a} index={i} />
          ))}
        </div>
      </section>
    </ArticleLayout>
  )
}

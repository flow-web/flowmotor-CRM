import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

/**
 * FAQAccordion - Clean dark expandable FAQ component
 * Accepts items[] with q (question) and a (answer) properties
 * Dark luxury theme with smooth animations
 */

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
      isOpen ? 'border-[#C4A484]/20 bg-[#C4A484]/[0.03]' : 'border-white/[0.06] hover:border-white/10'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4.5 text-left focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 rounded-xl"
        aria-expanded={isOpen}
      >
        <span className={`font-sans font-medium text-sm transition-colors duration-300 ${
          isOpen ? 'text-[#C4A484]' : 'text-white/80'
        }`}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-all duration-300 ${
            isOpen ? 'text-[#C4A484] rotate-180' : 'text-white/25'
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-5 pb-5 pt-0">
          <p className="text-sm text-white/50 font-sans leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQAccordion({ items = [], title }) {
  const [openIndex, setOpenIndex] = useState(null)

  if (items.length === 0) return null

  return (
    <div className="my-10">
      {title && (
        <div className="flex items-center gap-2.5 mb-6">
          <HelpCircle size={18} className="text-[#C4A484]" />
          <h3 className="font-display text-xl text-white">{title}</h3>
        </div>
      )}
      <div className="space-y-3">
        {items.map((item, i) => (
          <FAQItem
            key={i}
            question={item.q}
            answer={item.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}

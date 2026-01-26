import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function NotFound() {
  return (
    <main className="bg-base-100 min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Watermark Engine SVG */}
      <img
        src="/assets/engine-white.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-auto opacity-[0.08] pointer-events-none select-none"
        style={{ filter: 'invert(12%) sepia(15%) saturate(1500%) hue-rotate(314deg) brightness(90%) contrast(90%)' }}
      />

      <div className="relative text-center px-6 py-24">
        {/* 404 Number */}
        <p className="text-[120px] md:text-[180px] font-display font-bold text-primary/10 leading-none select-none">
          404
        </p>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold font-display text-primary -mt-8 md:-mt-12">
          Sortie de route ?
        </h1>

        {/* Description */}
        <p className="mt-4 text-base-content/60 max-w-md mx-auto leading-relaxed">
          La page que vous cherchez n'est pas dans notre concession.
          Elle a peut-être été déplacée ou n'existe plus.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            to="/"
            className="btn bg-[#5C3A2E] border-0 text-white px-8 py-4 h-auto rounded-xl hover:bg-[#5C3A2E]/90 shadow-lg shadow-[#5C3A2E]/25 inline-flex items-center gap-2"
          >
            Retourner au Showroom
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Secondary Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/stock" className="text-primary hover:text-accent transition-colors">
            Voir le stock
          </Link>
          <Link to="/contact" className="text-primary hover:text-accent transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound

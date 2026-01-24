import { ArrowRight, Shield, Truck, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import VehicleCard from '../../components/VehicleCard'
import ImageWithPreload from '../../components/ImageWithPreload'

/**
 * Home - Page d'accueil FLOW MOTOR
 * 
 * Structure:
 * 1. Hero Section - Grande image + titre aligné à gauche
 * 2. Derniers Arrivages - Grille de 3 véhicules
 * 3. Section Atelier
 * 4. Section Services
 * 
 * Alignement: Texte à gauche, conteneur max-w-7xl avec padding cohérent
 */
function Home() {
  // Données mockées - 3 véhicules d'exception
  const featuredVehicles = [
    {
      slug: 'porsche-911-gt3-2023',
      make: 'Porsche',
      model: '911 GT3',
      year: 2023,
      price: 189900,
      mileage: 8500,
      image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&q=80',
      status: 'DISPONIBLE'
    },
    {
      slug: 'audi-rs6-avant-2022',
      make: 'Audi',
      model: 'RS6 Avant',
      year: 2022,
      price: 134900,
      mileage: 12000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      status: 'ARRIVAGE'
    },
    {
      slug: 'bmw-m4-competition-2023',
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      price: 98900,
      mileage: 6500,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      status: 'DISPONIBLE'
    }
  ]

  return (
    <main className="bg-cream relative">
      {/* Texture de fond subtile */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/pattern-tires.svg)',
          backgroundRepeat: 'repeat',
          opacity: 0.02
        }}
      />
      
      {/* ===== HERO SECTION - Effet Cinéma ===== */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden z-10">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <ImageWithPreload
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80"
            alt="Véhicule de luxe"
          />
          {/* Overlay gradient cinématique - Gauche sombre, droite lumineuse */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        </div>
        
        {/* Contenu Hero - Aligné à gauche avec effet gouttière */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            {/* Largeur max 60% sur desktop pour lisibilité */}
            <div className="md:max-w-[60%]">
              {/* Badge - Avec animation */}
              <span className="inline-block px-4 py-2 bg-brown text-cream text-xs uppercase tracking-widest rounded-full mb-6 animate-fade-in-up animate-delay-100">
                Import Suisse & Japon
              </span>
              
              {/* Titre principal - Avec animation */}
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream font-bold leading-tight mb-6 animate-fade-in-up animate-delay-200">
                L'Excellence<br />
                <span className="text-cream/80">Automobile</span>
              </h1>
              
              {/* Sous-titre - Avec animation */}
              <p className="font-roboto text-cream/70 text-base md:text-lg lg:text-xl mb-8 max-w-lg animate-fade-in-up animate-delay-300">
                Découvrez notre sélection exclusive de véhicules d'exception, 
                importés avec soin pour les passionnés exigeants.
              </p>
              
              {/* CTA Buttons - Améliorés avec animation */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-400">
                <Link
                  to="/stock"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] bg-brown text-cream font-roboto font-semibold rounded-xl hover:bg-brown/90 transition-all duration-300 shadow-lg hover:shadow-brown/20"
                >
                  Voir le Stock
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] border-2 border-cream text-cream font-roboto font-semibold rounded-xl hover:bg-cream hover:text-aubergine transition-all duration-300"
                >
                  Nous Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Séparateur Route SVG - Corrigé pour éviter barre blanche */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
          <img 
            src="/assets/road.svg" 
            alt="" 
            className="w-full h-16 md:h-24 object-cover object-top opacity-40"
          />
        </div>
      </section>

      {/* ===== DERNIERS ARRIVAGES ===== */}
      <section className="py-32 md:py-40 relative z-10 bg-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section - Aligné à gauche */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-16">
            <div className="relative">
              <span className="text-brown/60 font-roboto text-xs uppercase tracking-widest">
                Notre Sélection
              </span>
              <div className="flex items-center gap-4 mt-3">
                <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold">
                  Derniers Arrivages
                </h2>
                <img 
                  src="/assets/gears.svg" 
                  alt="" 
                  className="h-8 md:h-12 w-auto opacity-40 hover:rotate-45 transition-transform duration-500"
                />
              </div>
            </div>
            <Link
              to="/stock"
              className="group inline-flex items-center gap-2 min-h-[48px] text-brown font-roboto font-medium mt-6 md:mt-0 hover:gap-3 transition-all duration-300"
            >
              Voir tout le stock
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Grille de véhicules - Vraies données */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION ATELIER ===== */}
      <section 
        className="py-32 md:py-40 bg-black-tech relative overflow-hidden z-10"
        style={{
          backgroundImage: 'url(/assets/engine-white.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: 'auto 90%'
        }}
      >
        {/* Overlay opacité 95% = moteur visible à 5% (texture technique subtile) */}
        <div className="absolute inset-0 bg-black-tech opacity-95 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-2xl">
            <span className="text-brown/80 font-roboto text-xs uppercase tracking-widest">
              Préparation & Performance
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-cream font-bold mt-4 mb-8">
              L'Atelier FLOW MOTOR
            </h2>
            <p className="font-roboto text-cream/70 text-base md:text-lg leading-relaxed mb-10">
              Notre atelier spécialisé prend en charge la préparation mécanique complète 
              de chaque véhicule. Diagnostic approfondi, révision technique et optimisation 
              des performances pour garantir votre sécurité et votre plaisir de conduite.
            </p>
            
            <div className="flex items-start gap-5 bg-cream/5 p-6 md:p-8 rounded-xl border border-cream/10 hover:bg-cream/10 transition-colors duration-300">
              <img 
                src="/assets/gear-motion.svg" 
                alt="" 
                className="h-12 w-auto flex-shrink-0 hover:rotate-180 transition-transform duration-700"
              />
              <div>
                <h3 className="font-playfair text-xl text-cream font-semibold mb-3">
                  Rapidité & Expertise
                </h3>
                <p className="font-roboto text-cream/60 text-sm leading-relaxed">
                  Nos techniciens certifiés interviennent avec précision pour une remise 
                  en état rapide et conforme aux standards les plus exigeants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION SERVICES ===== */}
      <section className="py-32 md:py-40 bg-aubergine relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img 
            src="/assets/pattern-tires.svg" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            
            {/* Service 1 */}
            <div className="text-center md:text-left group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brown rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-cream" size={32} />
              </div>
              <h3 className="font-playfair text-xl text-cream font-semibold mb-3">
                Garantie Premium
              </h3>
              <p className="font-roboto text-cream/60 text-sm leading-relaxed">
                Tous nos véhicules sont contrôlés et garantis pour votre tranquillité.
              </p>
            </div>
            
            {/* Service 2 */}
            <div className="text-center md:text-left group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brown rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-cream" size={32} />
              </div>
              <h3 className="font-playfair text-xl text-cream font-semibold mb-3">
                Import Direct
              </h3>
              <p className="font-roboto text-cream/60 text-sm leading-relaxed">
                Import direct Suisse & Japon pour des véhicules d'exception.
              </p>
            </div>
            
            {/* Service 3 */}
            <div className="text-center md:text-left group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brown rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300">
                <Award className="text-cream" size={32} />
              </div>
              <h3 className="font-playfair text-xl text-cream font-semibold mb-3">
                Expertise Reconnue
              </h3>
              <p className="font-roboto text-cream/60 text-sm leading-relaxed">
                Une équipe passionnée au service de votre projet automobile.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home

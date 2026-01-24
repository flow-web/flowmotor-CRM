import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/public/Home'
import Stock from './pages/public/Stock'
import Services from './pages/public/Services'
import VehicleDetail from './pages/public/VehicleDetail'
import Atelier from './pages/public/Atelier'
import Login from './pages/public/Login'
import Contact from './pages/public/Contact'

/**
 * App - Point d'entrée de l'application FLOW MOTOR
 * 
 * Structure:
 * - Navbar (toujours visible, sticky)
 * - Contenu des pages
 * - Footer (toujours visible)
 * 
 * Features:
 * - Smooth scroll CSS natif (optimisé navigateur)
 */
function App() {
  return (
    <Router>
      <div data-theme="flowmotor" className="min-h-screen bg-base-100 text-base-content flex flex-col">
        {/* Barre de progression du scroll */}
        <ScrollProgress />
        
        {/* Navigation principale */}
        <Navbar />
        
        {/* Contenu des pages */}
        <div className="flex-grow">
          <Routes>
            {/* === PAGES PUBLIQUES === */}
            <Route path="/" element={<Home />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/services" element={<Services />} />
            <Route path="/vehicule/:slug" element={<VehicleDetail />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Pages légales */}
            <Route path="/mentions-legales" element={<PlaceholderPage title="Mentions légales" />} />
            <Route path="/cgv" element={<PlaceholderPage title="Conditions générales de vente" />} />
            <Route path="/confidentialite" element={<PlaceholderPage title="Politique de confidentialité" />} />
            <Route path="/cookies" element={<PlaceholderPage title="Gestion des cookies" />} />
            
            {/* === PAGES ADMIN (CRM) === */}
            <Route path="/admin" element={<PlaceholderPage title="Espace Pro (CRM)" isAdmin />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

/**
 * PlaceholderPage - Page temporaire pour les routes non encore développées
 */
function PlaceholderPage({ title, isAdmin }) {
  return (
    <div className={`min-h-[60vh] flex items-center justify-center ${isAdmin ? 'bg-neutral text-neutral-content' : 'bg-base-100'}`}>
      <div className="text-center px-6">
        <h1 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${isAdmin ? 'text-neutral-content' : 'text-base-content'}`}>
          {title}
        </h1>
        <p className={`${isAdmin ? 'text-neutral-content/70' : 'text-base-content/70'}`}>
          Cette page sera bientôt disponible.
        </p>
      </div>
    </div>
  )
}

export default App

import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'

// Public Components (always loaded — above the fold)
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CookieConsent from './components/CookieConsent'

// Public Pages (always loaded — SEO critical)
import Home from './pages/public/Home'
import Showroom from './pages/public/Showroom'
import PublicVehicleDetails from './pages/public/PublicVehicleDetails'
import Services from './pages/public/Services'
import Atelier from './pages/public/Atelier'
import Login from './pages/public/Login'
import Contact from './pages/public/Contact'
import NotFound from './pages/public/NotFound'

// Lazy-loaded public pages (secondary)
const Guides = lazy(() => import('./pages/public/Guides'))
const ProcessusImport = lazy(() => import('./pages/public/guides/ProcessusImport'))
const Garanties = lazy(() => import('./pages/public/guides/Garanties'))
const CommentAcheter = lazy(() => import('./pages/public/guides/CommentAcheter'))
const Journal = lazy(() => import('./pages/public/Journal'))
const ImportSansRisque = lazy(() => import('./pages/public/journal/ImportSansRisque'))
const FiscaliteMalus = lazy(() => import('./pages/public/journal/FiscaliteMalus'))
const EntretienPremium = lazy(() => import('./pages/public/journal/EntretienPremium'))
const Legal = lazy(() => import('./pages/public/Legal'))

// Lazy-loaded companion
const CompanionLayout = lazy(() => import('./pages/companion/CompanionLayout'))

// Auth (always loaded)
import { AuthProvider } from './admin/context/AuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'

// Lazy-loaded admin (heavy — PDF, tables, AI)
const AdminProvider = lazy(() => import('./admin/context/AdminProvider'))
const AdminLayout = lazy(() => import('./admin/components/layout/AdminLayout'))
const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const AdminStock = lazy(() => import('./admin/pages/Stock'))
const Sourcing = lazy(() => import('./admin/pages/Sourcing'))
const VehicleCockpit = lazy(() => import('./admin/pages/VehicleCockpit'))
const Clients = lazy(() => import('./admin/pages/Clients'))
const Leads = lazy(() => import('./admin/pages/Leads'))
const Invoices = lazy(() => import('./admin/pages/Invoices'))
const PoliceRegister = lazy(() => import('./admin/pages/PoliceRegister'))
const Settings = lazy(() => import('./admin/pages/Settings'))

/** Spinner de chargement pour les routes lazy */
function RouteLoader() {
  return (
    <div className="min-h-screen bg-[#0F0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#C4A484] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Chargement...</p>
      </div>
    </div>
  )
}

/**
 * PublicLayout - Layout pour les pages publiques (avec Navbar/Footer)
 * pt-20 pour compenser la navbar fixed de 80px
 */
function PublicLayout() {
  return (
    <div data-theme="flowmotor" className="min-h-screen bg-[#F4E8D8] text-[#3D1E1E] flex flex-col">
      <ScrollProgress />
      <Navbar />
      <div className="flex-grow pt-20">
        <Outlet />
      </div>
      <Footer />
      <CookieConsent />
    </div>
  )
}

/**
 * App - Point d'entrée de l'application FLOW MOTOR
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* === PAGES PUBLIQUES === */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/showroom" element={<Showroom />} />
              <Route path="/stock" element={<Showroom />} />
              <Route path="/vehicule/:id" element={<PublicVehicleDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/atelier" element={<Atelier />} />
              <Route path="/contact" element={<Contact />} />

              {/* Guides */}
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/processus-import" element={<ProcessusImport />} />
              <Route path="/guides/garanties" element={<Garanties />} />
              <Route path="/guides/comment-acheter" element={<CommentAcheter />} />

              {/* Le Journal */}
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/comment-importer-sans-risque" element={<ImportSansRisque />} />
              <Route path="/journal/fiscalite-malus-co2" element={<FiscaliteMalus />} />
              <Route path="/journal/entretien-vehicule-premium" element={<EntretienPremium />} />

              {/* Pages légales */}
              <Route path="/mentions-legales" element={<Legal />} />
              <Route path="/cgv" element={<PlaceholderPage title="Conditions générales de vente" />} />
              <Route path="/confidentialite" element={<PlaceholderPage title="Politique de confidentialité" />} />
              <Route path="/cookies" element={<PlaceholderPage title="Gestion des cookies" />} />

              {/* 404 pour pages publiques */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* === FLOW COMPANION (protégé) === */}
            <Route element={<ProtectedRoute />}>
              <Route path="/companion" element={<CompanionLayout />} />
            </Route>

            {/* === LOGIN === */}
            <Route path="/login" element={<Login />} />

            {/* === ADMIN CRM (protégé) === */}
            <Route
              element={
                <AdminProvider>
                  <ProtectedRoute />
                </AdminProvider>
              }
            >
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/sourcing" element={<Sourcing />} />
                <Route path="/admin/stock" element={<AdminStock />} />
                <Route path="/admin/vehicle/:id" element={<VehicleCockpit />} />
                <Route path="/admin/clients" element={<Clients />} />
                <Route path="/admin/leads" element={<Leads />} />
                <Route path="/admin/invoices" element={<Invoices />} />
                <Route path="/admin/police" element={<PoliceRegister />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

/**
 * PlaceholderPage - Page temporaire pour les routes non encore développées
 */
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white font-[Playfair_Display]">
          {title}
        </h1>
        <p className="text-gray-400">
          Cette page sera bientôt disponible.
        </p>
      </div>
    </div>
  )
}

export default App

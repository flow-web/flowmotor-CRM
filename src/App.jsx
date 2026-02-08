import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'

// Public Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CookieConsent from './components/CookieConsent'

// Public Pages
import Home from './pages/public/Home'
import Stock from './pages/public/Stock'
import Services from './pages/public/Services'
import VehicleDetail from './pages/public/VehicleDetail'
import Atelier from './pages/public/Atelier'
import Login from './pages/public/Login'
import Contact from './pages/public/Contact'
import Legal from './pages/public/Legal'
import NotFound from './pages/public/NotFound'

// Admin
import AdminProvider from './admin/context/AdminProvider'
import { AuthProvider } from './admin/context/AuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLayout from './admin/components/layout/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import AdminStock from './admin/pages/Stock'
import Sourcing from './admin/pages/Sourcing'
import VehicleCockpit from './admin/pages/VehicleCockpit'
import Clients from './admin/pages/Clients'
import Settings from './admin/pages/Settings'

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
      <Routes>
        {/* === PAGES PUBLIQUES === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vehicule/:slug" element={<VehicleDetail />} />
          <Route path="/atelier" element={<Atelier />} />
          <Route path="/contact" element={<Contact />} />

          {/* Pages légales */}
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/cgv" element={<PlaceholderPage title="Conditions générales de vente" />} />
          <Route path="/confidentialite" element={<PlaceholderPage title="Politique de confidentialité" />} />
          <Route path="/cookies" element={<PlaceholderPage title="Gestion des cookies" />} />

          {/* 404 pour pages publiques */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* === LOGIN (avec AuthProvider) === */}
        <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />

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
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

/**
 * PlaceholderPage - Page temporaire pour les routes non encore développées
 */
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-base-100">
      <div className="text-center px-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-content">
          {title}
        </h1>
        <p className="text-base-content/70">
          Cette page sera bientôt disponible.
        </p>
      </div>
    </div>
  )
}

export default App

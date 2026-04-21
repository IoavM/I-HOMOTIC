import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './Styles/Global.css'
import Navbar from './components/Navbar/Navbar.tsx'
import Footer from './components/Footer/Footer.tsx'
import Home from './Pages/Home.tsx'
import Nosotros from './Pages/Nosotros.tsx'
import Proyectos from './Pages/Proyectos.tsx'
import Contacto from './Pages/Contacto.tsx'
import Servicios from './Pages/Servicios.tsx'
import { lazy, Suspense } from 'react'

const Mapa = lazy(() => import('./Pages/Mapa.tsx'))
import ScrollToTop from './components/ScrollToTop.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route 
          path="/mapa" 
          element={
            <Suspense fallback={
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#151a2a', color: '#fff', fontFamily: 'Sora, sans-serif' }}>
                <div className="mapa-loader" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderRadius: '50%', borderTopColor: '#e8721a', animation: 'spin 1s ease-in-out infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: 16, fontSize: '0.85rem', letterSpacing: 1, opacity: 0.7 }}>CARGANDO VISUALIZADOR 3D...</p>
              </div>
            }>
              <Mapa />
            </Suspense>
          } 
        />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)

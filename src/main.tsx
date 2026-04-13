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
import Mapa from './Pages/Mapa.tsx'
import Servicios from './Pages/Servicios.tsx'
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
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)

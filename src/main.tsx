import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './Styles/Global.css'
import Navbar from './components/TSX/Navbar.tsx'
import Footer from './components/TSX/Footer.tsx'
import Home from './Pages/Home.tsx'
import Servicios from './Pages/Servicios.tsx'
import Proyectos from './Pages/Proyectos.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/proyectos" element={<Proyectos />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)

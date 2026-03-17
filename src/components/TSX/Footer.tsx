import { Link } from 'react-router-dom'
import '../CSS/Footer.css'
import { SiInstagram, SiFacebook, SiX } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-content'>

        <div className='footer-marca'>
          <h2 className='footer-logo'><span>|</span>Homotic</h2>
          <p>Soluciones de domótica sostenibles y eficientes para hogares y empresas. Transformamos espacios con tecnología inteligente.</p>
          <div className='footer-redes'>
            <a href='#' className='footer-red'><SiInstagram size={24} /></a>
            <a href='#' className='footer-red'><SiFacebook size={24}/></a>
            <a href='#' className='footer-red'><SiX size={24}/></a>
          </div>
        </div>

        <div className='footer-columna'>
          <h3>Servicios</h3>
          <ul>
            <li><Link to='/servicios'>Automatización del Hogar</Link></li>
            <li><Link to='/servicios'>Iluminación Inteligente</Link></li>
            <li><Link to='/servicios'>Seguridad y CCTV</Link></li>
            <li className='/servicios'><Link to='/servicios'>Ahorro Energético</Link></li>
            <li><Link to='/servicios'>Control por Voz</Link></li>
            <li><Link to='/servicios'>Integración IoT</Link></li>
          </ul>
        </div>

        <div className='footer-columna'>
          <h3>Empresa</h3>
          <ul>
            <li><Link to='/about'>Nosotros</Link></li>
            <li><Link to='/proyectos'>Proyectos</Link></li>
            <li><Link to='/blog'>Blog</Link></li>
            <li><Link to='/faq'>Preguntas frecuentes</Link></li>
            <li><Link to='/contact'>Contacto</Link></li>
          </ul>
        </div>

        <div className='footer-columna'>
          <h3>Legal</h3>
          <ul>
            <li><Link to='/privacidad'>Política de Privacidad</Link></li>
            <li><Link to='/terminos'>Términos de Servicio</Link></li>
            <li><Link to='/cookies'>Política de Cookies</Link></li>
          </ul>
        </div>

      </div>

      <div className='footer-inferior'>
        <p>© 2026 IHomotic. All rights reserved.</p>
      </div>
    </footer>
  )
}


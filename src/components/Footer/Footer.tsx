import { Link } from 'react-router-dom'
import './Footer.css'
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className='footer'>
      <div className='footer-content'>

        <div className='footer-col-1'>
          <h2 className='footer-logo'>ihomotic</h2>
          <p dangerouslySetInnerHTML={{ __html: t('footer.slogan') }}></p>
          <div className='footer-redes'>
            <a href='#' className='footer-red'><SiInstagram size={30} /></a>
            <a href='#' className='footer-red'><SiFacebook size={30}/></a>
            <a href='#' className='footer-red'><SiYoutube size={30}/></a>
            <a href='#' className='footer-red'><FaLinkedin size={30}/></a>
          </div>
        </div>

        <div className='footer-columna'>
          <h3>{t('footer.company')}</h3>
          <ul>
            <li><Link to='/nosotros'>{t('footer.about')}</Link></li>
            <li><Link to='/proyectos'>{t('footer.projects')}</Link></li>
            <li><Link to='/contacto'>{t('footer.contact')}</Link></li>
          </ul>
        </div>

        <div className='footer-columna'>
          <h3>{t('footer.tools')}</h3>
          <ul>
            <li><Link to='/mapa'>{t('footer.experience3D')}</Link></li>
            <li><Link to='/proyectos'>{t('footer.calculator')}</Link></li>
          </ul>
        </div>

        <div className='footer-columna footer-contacto'>
          <h3>{t('footer.contact')}</h3>
          <ul>
            <li><FiPhone size={20} className="contacto-icon"/> <span>+21 999 123 456</span></li>
            <li><FiMail size={20} className="contacto-icon"/> <span>ihomotic@gmail.com</span></li>
            <li><FiMapPin size={20} className="contacto-icon"/> <span>Medellín, Colombia</span></li>
          </ul>
        </div>

      </div>

      <div className='footer-inferior'>
        <p>{t('footer.copyright')}</p>
        <div className="footer-links">
          <Link to='/privacidad'>{t('footer.privacy')}</Link>
          <Link to='/terminos'>{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  )
}

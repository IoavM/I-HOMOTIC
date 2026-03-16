import '../Styles/Home.css'
import { automatizacion, iluminacion, seguridad, casa } from '../assets/imagenes'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="hero">
        <div className="hero-content">
          <h1>{t('hero.title')}</h1>
          <h2>{t('hero.subtitle')}</h2>
          <p>{t('hero.description')}</p>
          <button
            className="hero-button"
            onClick={() =>
              Swal.fire({
                icon: 'success',
                title: t('hero.messageSent'),
                showConfirmButton: false,
                timer: 1500,
              })
            }
          >
            {t('hero.contact')}
          </button>
        </div>
        <div className="hero-image">
          <h1>I-HOMOTIC</h1>
          <p>I-HOMOTIC</p>
        </div>
      </section>

      <section className="servicios">
        <div className="servicios-content">
          <h1>{t('services.title')}</h1>
          <p>{t('services.description')}</p>
        </div>

        <div className="servicios-tarjetas">
          <div className="tarjetas-info">
            <img src={automatizacion} alt={t('services.automationTitle')} />
            <h2>{t('services.automationTitle')}</h2>
            <p>{t('services.automationDescription')}</p>
          </div>

          <div className="tarjetas-info">
            <img src={iluminacion} alt={t('services.lightingTitle')} />
            <h2>{t('services.lightingTitle')}</h2>
            <p>{t('services.lightingDescription')}</p>
          </div>

          <div className="tarjetas-info">
            <img src={seguridad} alt={t('services.securityTitle')} />
            <h2>{t('services.securityTitle')}</h2>
            <p>{t('services.securityDescription')}</p>
          </div>
        </div>
      </section>

      <section className="proyectos">
        <div className="proyectos-content">
          <div className="proyectos-info">
            <h2>{t('projects.title')}</h2>
            <h4>{t('projects.subtitle')}</h4>
            <div className="proyectos-tarjetas">
              <div className="proyectos-tarjetas-info">
                <h3>{t('projects.villaTitle')}</h3>
                <p>{t('projects.villaDescription')}</p>
                <button
                  className="proyectos-button"
                  onClick={() => navigate('/proyectos')}
                >
                  {t('projects.viewProject')}
                </button>
              </div>
            </div>
            <div className="proyectos-tarjetas">
              <div className="proyectos-tarjetas-info">
                <h3>{t('projects.hqTitle')}</h3>
                <p>{t('projects.hqDescription')}</p>
                <button
                  className="proyectos-button"
                  onClick={() => navigate('/proyectos')}
                >
                  {t('projects.viewProject')}
                </button>
              </div>
            </div>
          </div>
          <div className="proyectos-img">
            <img src={casa} alt={t('projects.title')} />
          </div>
        </div>
      </section>
    </motion.div>
  )
}
import '../Styles/Proyectos.css'
import { motion } from 'framer-motion'
import { CasaModerna } from '../assets/imagenes'
import { casa2 } from '../assets/imagenes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Proyectos() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
       <section className='inicio-proyectos' style={{backgroundImage: `url(${CasaModerna})`}}>
            <div className='inicio-content'>
                <h2>{t('projects.pageTitle')}</h2>
                <h3>{t('projects.pageSubtitle')}</h3>
                <p>{t('projects.pageDescription')}</p>
            </div>
       </section>

      <section className='proyecto-muestra'>
            <div className='muestra-imagen'>
                <img src={casa2} alt={t('projects.featuredAlt')} />
            </div>
            <div className='muestra-info'>
                <h2>{t('projects.featuredTitle')}</h2>
                <p>{t('projects.featuredDescription')}</p>               
                <button className='muestra-button' onClick={() => navigate('/proyectos')}>
                    {t('projects.viewProject')}
                </button>
            </div>  
        </section>
        <section className='otros-proyectos'>
            <div className='otros-proyectos-content'>
                <h2>{t('projects.otherProjects')}</h2>
                <p>{t('projects.otherProjectsDescription')}</p>
            </div>
            <div className='otros-proyectos-tarjetas'>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt={t('projects.project1Alt')} />
                    <h3>{t('projects.project1Title')}</h3>
                    <p>{t('projects.project1Description')}</p>
                    <button className='proyecto-tarjeta-button'>{t('projects.viewProject')}</button>
                </div>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt={t('projects.project2Alt')} />
                    <h3>{t('projects.project2Title')}</h3>
                    <p>{t('projects.project2Description')}</p>
                    <button className='proyecto-tarjeta-button'>{t('projects.viewProject')}</button>
                </div>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt={t('projects.project3Alt')} />
                    <h3>{t('projects.project3Title')}</h3>
                    <p>{t('projects.project3Description')}</p>
                    <button className='proyecto-tarjeta-button'>{t('projects.viewProject')}</button>
                </div>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt={t('projects.project4Alt')} />
                    <h3>{t('projects.project4Title')}</h3>
                    <p>{t('projects.project4Description')}</p>
                    <button className='proyecto-tarjeta-button'>{t('projects.viewProject')}</button>
                </div>
            </div>
        </section>
    </motion.div>
    )
}

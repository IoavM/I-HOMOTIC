import '../Styles/Proyectos.css'
import { motion } from 'framer-motion'
import { CasaModerna, casa2 } from '../assets/imagenes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import proyectos from '../components/Tarjetas2/otros-proyectos.json'
import TarjetaProyecto from '../components/Tarjetas2/Tarjeta2Info'
import CalculadoraPrecios from '../components/calculadora-precios/calculadora-precios'


const imagenesMap: Record<string, string> = {
    casa2,
}

export default function Proyectos() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className='inicio-proyectos' style={{ backgroundImage: `url(${CasaModerna})` }}>
                <div className='inicio-content'>
                    <h2>{t('projects.pageTitle')}</h2>
                    <h2>{t('projects.pageSubtitle')}</h2>
                    <p>{t('projects.pageDescription')}</p>
                </div>
            </section>

            <section className='proyecto-muestra'>
                <div className='muestra-imagen'>
                    <img src={casa2} alt="Imagen de muestra de un proyecto de casa inteligente" />
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
                    {proyectos.map((proyecto) => (
                        <TarjetaProyecto
                            key={proyecto.tituloKey}
                            imagen={imagenesMap[proyecto.imagen]}
                            tituloKey={proyecto.tituloKey}
                            descripcionKey={proyecto.descripcionKey}
                            altKey={proyecto.altKey}
                        />
                    ))}
                </div>
            </section>
            <CalculadoraPrecios />
        </motion.div>
    )
}
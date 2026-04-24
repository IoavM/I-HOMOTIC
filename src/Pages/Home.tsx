import '../Styles/Home.css'
import { automatizacion, iluminacion, seguridad, casa } from '../assets/imagenes'
import { motion } from 'framer-motion'
import Swal from "sweetalert2"
import { useTranslation } from 'react-i18next'
import servicios from '../components/Tarjetas1/servicios.json'
import TarjetaInfo from '../components/Tarjetas1/TarjetaInfo'
import proyectosHome from '../components/proyectos-imagen/proyectos-imagen-info.json'
import TarjetaProyectoHome from '../components/proyectos-imagen/proyectos-imagen'
import { useNavigate } from 'react-router-dom'


const imagenesMap: Record<string, string> = {
    automatizacion,
    iluminacion,
    seguridad,
}

export default function Home() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className='hero' id='hero'>
                <div className='hero-content'>
                    <h1>{t('hero.title')}</h1>
                    <h2>{t('hero.subtitle')}</h2>
                    <p>{t('hero.description')}</p>
                    <div className='hero-buttons'>
                        <button
                            className='hero-button'
                            tabIndex={4}
                            onClick={() => {
                                window.open(
                                    "https://wa.me/573014032120?text=Hola,%20quiero%20información%20sobre%20domótica",
                                    "_blank"
                                )
                                Swal.fire({
                                    title: t('hero.messageSent'),
                                    icon: "success",
                                    draggable: true,
                                    confirmButtonColor: "#2D6A2E"
                                })
                            }}
                        >
                            {t('hero.contact')} 
                        </button>
                        <button className='hero-button' tabIndex={5} onClick={() => navigate('/mapa')}>{t('hero.Explore')} </button>
                    </div>
                </div>
                <div className='hero-image'>
                    <img src={casa} alt="Casa inteligente y moderna, representación de domótica" fetchPriority="high" />
                </div>
            </section>

            <section className='servicios' id='home-servicios'>
                <div className='servicios-content'>
                    <h1>{t('services.title')}</h1>
                    <p>{t('services.description')}</p>
                </div>
                <div className='servicios-tarjetas'>
                    {servicios.map((servicio) => (
                        <TarjetaInfo
                            key={servicio.titulo}
                            imagen={imagenesMap[servicio.imagen]}
                            alt={servicio.alt}
                            titulo={servicio.titulo}
                            descripcion={servicio.descripcion}
                        />
                    ))}
                </div>
            </section>

            <section className='proyectos' id='home-proyectos'>
                <div className='proyectos-content'>
                    <div className='proyectos-info'>
                        <h2>{t('projects.title')}</h2>
                        <h4>{t('projects.subtitle')}</h4>
                        {proyectosHome.map((proyecto) => (
                            <TarjetaProyectoHome
                                key={proyecto.tituloKey}
                                tituloKey={proyecto.tituloKey}
                                descripcionKey={proyecto.descripcionKey}
                            />
                        ))}
                    </div>
                    <div className='proyectos-img'>
                        <img src={casa} alt="Ejemplo de proyectos de casas inteligentes realizados" loading="lazy" />
                    </div>
                </div>
            </section>

        </motion.div>
    )
}
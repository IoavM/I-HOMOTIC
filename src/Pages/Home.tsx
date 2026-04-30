import '../Styles/Home.css'
import { casa } from '../assets/imagenes'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import proyectosHome from '../components/proyectos-imagen/proyectos-imagen-info.json'
import TarjetaProyectoHome from '../components/proyectos-imagen/proyectos-imagen'
import HeroConImagen from '../components/hero-conImagen/hero-conImagen'
import GridDatos2 from '../components/grid-datos2/grid-datos2'
import Tarjeta4 from '../components/tarjeta4/tarjeta4'
import Ventajas from '../components/ventajas/ventajas'

export default function Home() {
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <HeroConImagen />

            <section className='i-homotic' id='home-i-homotic'>
                <div className='contenido-ihomotic'>
                    <h3>{t('home.ihomoticTitle')}</h3>
                    <h2>{t('home.ihomoticHeading')}
                        <br />
                        <span>{t('home.ihomoticHeadingSpan')}</span>
                    </h2>
                    <p>{t('home.ihomoticDesc')}</p>
                    <GridDatos2 />
                </div>
                <Tarjeta4 />
            </section>

            <section className='ventajas' id='home-ventajas'>
                <div className='ventajas-content'>
                    <h3>{t('home.ventajasHeading')} <span>{t('home.ventajasHeadingSpan')}</span></h3>
                </div>
                <Ventajas />
            </section>

            <section className='proyectos' id='home-proyectos'>
                <div className='proyectos-content'>
                    <div className='proyectos-info'>
                        <h2>{t('projects.title')}</h2>
                        <h4>{t('projects.subtitle')}</h4>
                        {proyectosHome.map((proyecto) => (
                            <TarjetaProyectoHome
                                key={proyecto.tituloKey}
                                id={proyecto.id}
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
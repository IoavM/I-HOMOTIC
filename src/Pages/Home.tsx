import '../Styles/Home.css'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import HeroConImagen from '../components/hero-conImagen/hero-conImagen'
import GridDatos2 from '../components/grid-datos2/grid-datos2'
import Tarjeta4 from '../components/tarjeta4/tarjeta4'
import Ventajas from '../components/ventajas/ventajas'
import proyectos from '../components/Tarjetas2-Variante/Tarjeta2Variante.json'
import TarjetaProyecto2 from '../components/Tarjetas2-Variante/Tarjeta2Variante'
import { casa2 } from '../assets/imagenes'
import { useNavigate } from 'react-router-dom'
import CTAHome from '../components/cta-home/cta-home'

const imagenesMap: Record<string, string> = {
    casa2,
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


            <section className='proyecto-home'>
                <div className='proyecto-parte1'>
                    <div className='proyecto-parte1-texto'>
                        <h2>Proyectos que <span>inspiran</span></h2>
                        <p>Conoce algunos de nuestros proyectos más recientes</p>
                    </div>
                    <div className='btn-ver-proyectos'>
                        <button className='btn-ver-proyectos-button' onClick={() => navigate('/proyectos')}>Ver todos los proyectos</button>
                    </div>
                </div>
                <div className='proyectos-home-grid'>
                    {proyectos.map((proyecto) => (
                        <TarjetaProyecto2
                            key={proyecto.id || proyecto.tituloKey}
                            imagen={imagenesMap[proyecto.imagen]}
                            tituloKey={proyecto.tituloKey}
                            descripcionKey={proyecto.descripcionKey}
                            altKey={proyecto.altKey}
                        />
                    ))}
                </div>

                <CTAHome />
                
            </section>

        </motion.div>
    )
}
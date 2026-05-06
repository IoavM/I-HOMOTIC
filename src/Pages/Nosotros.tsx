import '../Styles/Nosotros.css'
import { motion } from 'framer-motion'
import { integrantes } from '../integrantes'
import { useTranslation } from 'react-i18next'
import datos from '../components/grid-datos/grid-datos-info.json'
import TarjetaDato from '../components/grid-datos/grid-datos'
import DatosCTA2 from '../components/cta2/cta2Contacto.json'
import Swal from 'sweetalert2'
import { casa2 } from '../assets/imagenes'

export default function Nosotros() {
    const { t } = useTranslation()

    const handleCotizar = () => {
        window.open(DatosCTA2.whatsappUrl, "_blank")
        Swal.fire({
            title: t('hero.messageSent'),
            icon: "success",
            draggable: true,
            confirmButtonColor: "#2D6A2E"
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* ── Hero (estilo claro como Proyectos) ── */}
            <section className='hero-nosotros'>
                <div className='hero-nosotros-content'>
                    <h3>{t('nosotros.introLabel')}</h3>
                    <h2>{t('nosotros.introTitle').split(' ').slice(0, 3).join(' ')} <span>{t('nosotros.introTitle').split(' ').slice(3).join(' ')}</span></h2>
                    <p>{t('nosotros.introDescription')}</p>
                </div>
                <div className='hero-nosotros-image'>
                    <img src={casa2} alt="I-Homotic equipo" />
                </div>
            </section>

            {/* ── Stats ── */}
            <section className='nosotros-stats'>
                <div className='nosotros-stats-grid'>
                    <div className='nosotros-stats-texto'>
                        <p>{t('nosotros.aboutDescription')}</p>
                    </div>
                    <div className='nosotros-grid-datos'>
                        {datos.map((dato) => (
                            <TarjetaDato
                                key={dato.etiquetaKey}
                                valor={dato.valor}
                                etiquetaKey={dato.etiquetaKey}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Equipo ── */}
            <section className='equipo-seccion' id='equipo'>
                <div className='equipo-encabezado'>
                    <h3>{t('nosotros.equipoLabel')}</h3>
                    <h2>{t('nosotros.equipoTitle')}</h2>
                </div>
                <div className='equipo-miembros'>
                    {integrantes.map((persona) => (
                        <div className='miembro-card' key={persona.nombre}>
                            <div className='miembro-img-container'>
                                {persona.foto
                                    ? <img src={persona.foto} alt={persona.nombre} className='miembro-foto' loading="lazy" />
                                    : <div className='miembro-foto-placeholder'>{persona.iniciales}</div>
                                }
                            </div>
                            <div className='miembro-info'>
                                <h3>{persona.nombre}</h3>
                                <p>{persona.cargo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className='cta-nosotros'>
                <div className='cta-nosotros-inner'>
                    <h2>{t('nosotros.ctaTitle')}</h2>
                    <p>{t('nosotros.ctaSubtitle')}</p>
                    <button className='cta-nosotros-btn' onClick={handleCotizar}>
                        {DatosCTA2.botonTexto}
                    </button>
                </div>
            </section>
        </motion.div>
    )
}
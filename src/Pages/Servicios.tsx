import '../Styles/Servicios.css'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import pvs from '../components/TarjetasPV/PVinfo.json'
import TarjetaPV from '../components/TarjetasPV/TarjetaPV'
import DatosCTA2 from '../components/cta2/cta2Contacto.json'
import Swal from 'sweetalert2'
import Ventajas from '../components/ventajas/ventajas'
import GridDatos2 from '../components/grid-datos2/grid-datos2'
import { CasaModerna } from '../assets/imagenes'
import { useNavigate } from 'react-router-dom'

export default function Servicios() {
    const { t } = useTranslation()
    const navigate = useNavigate()

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

            <section className='hero2' id='hero-servicios' style={{ backgroundImage: `url(${CasaModerna})` }}>
                <div className='hero-content2'>
                    <h1>{t('servicios.title')}</h1>
                    <p>{t('servicios.subtitle')}</p>
                </div>
            </section>

            <section className='propuesta-valor-seccion' id='propuesta-valor'>
                <div className='contenido-propuesta'>
                    <h3>{t('servicios.propuestaLabel')}</h3>
                    <h2>{t('servicios.propuestaTitle')}</h2>
                    <div className='tarjetas-pv-container'>
                        {pvs.map((pv) => (
                            <TarjetaPV
                                key={pv.titulo}
                                emoji={pv.emoji}
                                titulo={pv.titulo}
                                descripcion={pv.descripcion}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className='servicios-ventajas' id='servicios-ventajas'>
                <div className='servicios-ventajas-content'>
                    <h3>{t('servicios.ventajasTitle')} <span>{t('servicios.ventajasTitleSpan')}</span></h3>
                </div>
                <Ventajas />
            </section>

            <section className='servicios-stats' id='servicios-stats'>
                <div className='servicios-stats-inner'>
                    <div className='servicios-stats-texto'>
                        <h3>{t('servicios.statsLabel')}</h3>
                        <h2>{t('servicios.statsTitle')} <span>{t('servicios.statsTitleSpan')}</span></h2>
                        <p>{t('servicios.statsDescription')}</p>
                    </div>
                    <GridDatos2 />
                </div>
            </section>

            <section className='cta-servicios'>
                <div className='cta-servicios-inner'>
                    <h2>{t('servicios.ctaTitle')}</h2>
                    <p>{t('servicios.ctaSubtitle')}</p>
                    <div className='cta-servicios-buttons'>
                        <button className='cta-btn-primary' onClick={handleCotizar}>
                            {t('servicios.ctaBtnPrimary')}
                        </button>
                        <button className='cta-btn-secondary' onClick={() => navigate('/calculadora')}>
                            {t('servicios.ctaBtnSecondary')}
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}
import '../Styles/Servicios.css'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import servicios from '../components/Tarjetas1/servicios.json'
import TarjetaInfo from '../components/Tarjetas1/TarjetaInfo'
import { automatizacion, iluminacion, seguridad} from '../assets/imagenes'
import pvs from '../components/Tarjetas3/PVinfo.json'
import TarjetaPV from '../components/Tarjetas3/TarjetaPV'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const imagenesMap: Record<string, string> = {
    automatizacion,
    iluminacion,
    seguridad,
}

export default function Servicios() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className='servicios-intro' id='servicios-intro'>
                <div className='servicios-intro-texto'>
                    <h2>{t('servicios.title')}</h2>
                    <p>{t('servicios.subtitle')}</p>
                </div>
            </section>

            <section className='servicios' id='servicios-lista'>
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

            <section className='propuesta-valor' id='propuesta-valor'>
                <div className='propuesta-valor-content'>
                    <h1>{t('servicios.PVTitle')}</h1>
                </div>
                <div className='tarjetas-pv'>
                    {pvs.map((pv) => (
                        <TarjetaPV
                            key={pv.titulo}
                            emoji={pv.emoji}
                            titulo={pv.titulo}
                            descripcion={pv.descripcion}
                        />
                    ))}
                </div>
            </section>

            <section className='servicios-final' id='servicios-cta'>
                <div className='servicios-final-content'>
                    <h1>{t('servicios.callToAction')}</h1>
                    <p>{t('servicios.callToActionDescription')}</p>
                </div>
                <div className='servicio-buttons'>
                    <button
                        className='servicio-button'
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
                    <button className='servicio-button' tabIndex={5} onClick={() => navigate('/mapa')}>{t('hero.Explore')} </button>
                </div>
            </section>

        </motion.div>
    )
}
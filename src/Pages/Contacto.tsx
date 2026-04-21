import '../Styles/Contacto.css'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ContactoFormulario from '../components/contacto-formulario/contacto-formulario'
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiOutlineClock } from 'react-icons/hi'

export default function Contacto() {
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className='contacto-hero' id='contacto-hero'>
                <div className='contacto-hero-content'>
                    <h2>{t('contacto.pageTitle')}</h2>
                    <p>{t('contacto.pageSubtitle')}</p>
                </div>
            </section>

            <section className='contacto-info' id='contacto-info'>
                <div className='contacto-info-grid'>
                    <div className='contacto-info-card'>
                        <div className='contacto-info-icon'>
                            <HiOutlineLocationMarker size={28} />
                        </div>
                        <h3>{t('contacto.locationTitle')}</h3>
                        <p>{t('contacto.locationValue')}</p>
                    </div>
                    <div className='contacto-info-card'>
                        <div className='contacto-info-icon'>
                            <HiOutlineMail size={28} />
                        </div>
                        <h3>{t('contacto.emailTitle')}</h3>
                        <p>{t('contacto.emailValue')}</p>
                    </div>
                    <div className='contacto-info-card'>
                        <div className='contacto-info-icon'>
                            <HiOutlinePhone size={28} />
                        </div>
                        <h3>{t('contacto.phoneTitle')}</h3>
                        <p>{t('contacto.phoneValue')}</p>
                    </div>
                    <div className='contacto-info-card'>
                        <div className='contacto-info-icon'>
                            <HiOutlineClock size={28} />
                        </div>
                        <h3>{t('contacto.scheduleTitle')}</h3>
                        <p>{t('contacto.scheduleValue')}</p>
                    </div>
                </div>
            </section>

            <ContactoFormulario />

        </motion.div>
    )
}
        

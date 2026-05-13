import '../Styles/Contacto.css'
import { motion } from 'framer-motion'
import ContactoFormulario from '../components/contacto-formulario/contacto-formulario'
import GridDatos4 from '../components/grid-datos4/grid-datos4'
import HeroConImagen2 from '../components/hero-conImagen2/hero-conImagen2'
import datosContactos from '../components/grid-datos4/grid-datos4.json'
import CTA2 from '../components/cta2/cta2.tsx'
import DatosCTA2 from '../components/cta2/cta2Contacto.json'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

export default function Contacto() {
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
            <section className='contacto-hero' id='contacto-hero'>
                <HeroConImagen2 />
            </section>

            <section className='contacto-formulario-info' id='contacto-formulario-info'>
                <div className='div-contacto-formulario'>
                    <ContactoFormulario />
                </div>
                <div className='div-contacto-info'>
                    <p className='info-contacto'>
                        {t('contacto.description')}
                    </p>
                    <div className="grid-datos4">
                        {datosContactos.map((dato, index) => (
                            <GridDatos4
                                key={index}
                                tituloKey={dato.tituloKey}
                                valorKey={dato.valorKey}
                                icono={dato.icono}
                            />
                        ))}
                    </div>
                    <div className='mapa-google'>
                       <div className='mapa-google'>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1966.1279701927683!2d-75.57775180606959!3d6.192611354624483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e468263b7c1e157%3A0x5265cd1503f345a2!2sUrbanizaci%C3%B3n%20Camino%20de%20Santamar%C3%ADa!5e0!3m2!1ses-419!2sco!4v1777777244452!5m2!1ses-419!2sco"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={t('contacto.mapTitle')}
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <div className='div-cta2'>
                    {[DatosCTA2].map((dato, index) => (
                        <CTA2
                            key={index}
                            titulo={t(dato.tituloKey)}
                            subtitulo={t(dato.subtituloKey)}
                            botonTexto={t(dato.botonTextoKey)}
                            onClick={handleCotizar}
                            colorTexto='var(--color-blanco)'
                        />
                    ))}
                </div>
            </section>
        </motion.div>
    )
}


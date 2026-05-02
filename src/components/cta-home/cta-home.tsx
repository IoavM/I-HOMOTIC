import './cta-home.css'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import DatosCTA from './cta-home.json'

export default function CTAHome() {
    const { t } = useTranslation()

    const handleCotizar = () => {
        window.open(DatosCTA.whatsappUrl, "_blank")
        Swal.fire({
            title: t('hero.messageSent'),
            icon: "success",
            draggable: true,
            confirmButtonColor: "#2D6A2E"
        })
    }

    return (
        <div className='CTA-home'>
            <div className='CTA-home-texto'>
                <h2>{DatosCTA.titulo}</h2>
                <p>{DatosCTA.subtitulo}</p>
            </div>
            <button className='btn-cotizar' onClick={handleCotizar}>
                {DatosCTA.botonTexto}
            </button>
        </div>
    )
}

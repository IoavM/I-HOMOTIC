import './cta2.css'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'
import DatosCTA2 from './cta2.json'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CTA2() {
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
        <div className='CTA-home2'>
            <div className='CTA2-content-left'>
                <div className='CTA2-icon-box'>
                    <CalendarMonthOutlinedIcon sx={{ fontSize: 45 }} className='CTA2-icon' />
                </div>
                <div className='CTA-home-texto2'>
                    <h2>{DatosCTA2.titulo}</h2>
                    <p>{DatosCTA2.subtitulo}</p>
                </div>
            </div>
            <button className='btn-cotizar2' onClick={handleCotizar}>
                {DatosCTA2.botonTexto} <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </button>
        </div>
    )
}

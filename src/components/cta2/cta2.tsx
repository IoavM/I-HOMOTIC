import './cta2.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Props {
    titulo: string
    subtitulo: string
    botonTexto: string
    onClick: () => void
    colorTexto?: string
}

export default function CTA2({ titulo, subtitulo, botonTexto, onClick, colorTexto = 'var(--color-texto-oscuro)' }: Props) {
    return (
        <div className='CTA-home2'>
            <div className='CTA2-content-left'>
                <div className='CTA2-icon-box'>
                    <CalendarMonthOutlinedIcon sx={{ fontSize: 45 }} className='CTA2-icon' />
                </div>
                <div className='CTA-home-texto2'>
                    <h2 style={{ color: colorTexto }}>{titulo}</h2>
                    <p style={{ color: colorTexto }}>{subtitulo}</p>
                </div>
            </div>
            <button className='btn-cotizar2' onClick={onClick}>
                {botonTexto} <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </button>
        </div>
    )
}
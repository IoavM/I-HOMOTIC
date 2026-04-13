import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Tarjeta2Info.css'

interface Props {
    imagen: string
    tituloKey: string
    descripcionKey: string
    altKey: string
}

export default function TarjetaProyecto({ imagen, tituloKey, descripcionKey, altKey }: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className='proyecto-tarjeta'>
            <img src={imagen} alt={t(altKey)} />
            <h3>{t(tituloKey)}</h3>
            <p>{t(descripcionKey)}</p>
            <button
                className='proyecto-tarjeta-button'
                onClick={() => navigate('/proyectos')}
            >
                {t('projects.viewProject')}
            </button>
        </div>
    )
}
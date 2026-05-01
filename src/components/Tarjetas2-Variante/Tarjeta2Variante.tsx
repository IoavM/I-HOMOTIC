import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Tarjeta2Variante.css'

interface Props {
    id?: string
    imagen: string
    tituloKey: string
    descripcionKey: string
    altKey: string
}

export default function TarjetaProyecto2({ id, imagen, tituloKey, descripcionKey, altKey }: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className='proyectos-home-grid'>
            <div className='proyecto-tarjeta2'>
                <img src={imagen} alt={t(altKey)} loading="lazy" />
                <div className='proyecto-info2'>
                    <h3>{t(tituloKey)}</h3>
                    <p>{t(descripcionKey)}</p>
                </div>
            </div>
        </div>
    )
}
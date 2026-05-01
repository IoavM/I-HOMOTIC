import { useTranslation } from 'react-i18next'
import './Tarjeta2Variante.css'

interface Props {
    imagen: string
    tituloKey: string
    descripcionKey: string
    altKey: string
}

export default function TarjetaProyecto2({ imagen, tituloKey, descripcionKey, altKey }: Props) {
    const { t } = useTranslation()
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
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Tarjeta2Info.css'
import { casa2 } from '../../assets/imagenes'


const imagenesMap: Record<string, string> = {
    casa2,
}

interface Props {
    id?: string
    imagen: string
    Etiqueta: string
    tituloKey: string
    descripcionKey: string
    altKey: string
}

export default function TarjetaProyecto({ id, imagen,Etiqueta, tituloKey, descripcionKey, altKey }: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className='proyecto-tarjeta'>
            <img src={imagenesMap[imagen] ?? imagen} alt={t(altKey)} loading="lazy" />
            <div className='proyecto-content'>
                <span className='proyecto-tarjeta-etiqueta'>{t(Etiqueta)}</span>
                <h3>{t(tituloKey)}</h3>
                <p>{t(descripcionKey)}</p>
                <button
                    className='proyecto-tarjeta-button'
                    tabIndex={11}
                    onClick={() => navigate(id ? `/proyectos/${id}` : '/proyectos')}
                >
                    Ver Proyecto →
                </button>
            </div>
        </div>
    )
}
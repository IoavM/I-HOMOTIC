import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../proyectos-imagen/proyectos-imagen.css'

interface Props {
    id?: string
    tituloKey: string
    descripcionKey: string
}

export default function TarjetaProyectoHome({ id, tituloKey, descripcionKey }: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className='proyectos-tarjetas'>
            <div className='proyectos-tarjetas-info'>
                <h3>{t(tituloKey)}</h3>
                <p>{t(descripcionKey)}</p>
                <button className='proyectos-button' tabIndex={11} onClick={() => navigate(id ? `/proyectos/${id}` : '/proyectos')}>
                    {t('projects.viewProject')}
                </button>
            </div>
        </div>
    )
}
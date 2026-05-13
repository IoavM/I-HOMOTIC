import { useTranslation } from 'react-i18next'
import './TarjetaPV.css'

interface TarjetaPVProps {
    emoji: string;
    titulo: string;
    descripcion: string;
}

export default function TarjetaPV({ emoji, titulo, descripcion }: TarjetaPVProps) {
    const { t } = useTranslation()

    return (
            <div className='tarjeta-pv'>
                <div className='tarjeta-pv-content'>
                    <span className='tarjeta-pv-emoji'>{emoji}</span>
                    <h2>{t(titulo)}</h2>
                    <p>{t(descripcion)}</p>
                </div>
            </div>
    )
}
import './ventajas.css'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import InstallMobileOutlinedIcon from '@mui/icons-material/InstallMobileOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import { useTranslation } from 'react-i18next'

const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'energia': return <EmojiObjectsOutlinedIcon sx={{ fontSize: 70, color: 'var(--color-acento-primario)' }} />
        case 'control': return <InstallMobileOutlinedIcon sx={{ fontSize: 70, color: 'var(--color-acento-primario)' }} />
        case 'seguridad': return <ShieldOutlinedIcon sx={{ fontSize: 70, color: 'var(--color-acento-primario)' }} />
        case 'confort': return <SensorsOutlinedIcon sx={{ fontSize: 70, color: 'var(--color-acento-primario)' }} />
        default: return null
    }
}

export default function Ventajas() {
    const { t } = useTranslation()
    const datos = t('ventajas.items', { returnObjects: true }) as Array<{icono: string, titulo: string, descripcion: string}>

    return (
        <div className="ventajas-grid">
            {datos.map((item, index) => (
                <div className="ventaja-item" key={index}>
                    <div className="ventaja-icon-circle">
                        {getIcon(item.icono)}
                    </div>
                    <h4>{item.titulo}</h4>
                    <p>{item.descripcion}</p>
                </div>
            ))}
        </div>
    )
}

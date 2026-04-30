import './tarjeta4.css'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import { useTranslation } from 'react-i18next'

const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'lightbulb': return <LightbulbOutlinedIcon sx={{ fontSize: 40, color: 'var(--color-blanco)' }} />
        case 'ac_unit': return <AcUnitOutlinedIcon sx={{ fontSize: 40, color: 'var(--color-blanco)' }} />
        case 'security': return <ShieldOutlinedIcon sx={{ fontSize: 40, color: 'var(--color-blanco)' }} />
        case 'volume_up': return <VolumeUpOutlinedIcon sx={{ fontSize: 40, color: 'var(--color-blanco)' }} />
        default: return null
    }
}

export default function Tarjeta4() {
    const { t } = useTranslation()
    const datos = t('tarjeta4.items', { returnObjects: true }) as Array<{icono: string, texto: string}>

    return (
        <div className='tarjeta4'>
            {datos.map((item, index) => (
                <div className='tarjeta4-info' key={index}>
                    <div className='tarjeta4-icon'>
                        {getIcon(item.icono)}
                    </div>
                    <div className='tarjeta4-texto'>
                        <h3>{item.texto}</h3>
                    </div>
                </div>
            ))}
        </div>
    )
}
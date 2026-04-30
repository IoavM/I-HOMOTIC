import './grid-datos2.css'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { useTranslation } from 'react-i18next'

const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'home': return <HomeOutlinedIcon sx={{ fontSize: 50, color: 'var(--color-blanco)' }} />
        case 'person': return <PersonOutlineOutlinedIcon sx={{ fontSize: 50, color: 'var(--color-blanco)' }} />
        case 'briefcase': return <WorkOutlineOutlinedIcon sx={{ fontSize: 50, color: 'var(--color-blanco)' }} />
        default: return null
    }
}

export default function GridDatos2() {
    const { t } = useTranslation()
    const datos = t('gridDatos2.items', { returnObjects: true }) as Array<{icono: string, numero: string, texto: string}>

    return (
        <div className="grid-datos2">
            {datos.map((item, index) => (
                <div className="grid-datos2-items" key={index}>
                    <div className='item-icon'>
                        {getIcon(item.icono)}
                    </div>
                    <div className='item-datos'>
                        <h2>{item.numero}</h2>
                        <p>{item.texto}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
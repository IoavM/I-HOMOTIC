import './grid-datos3.css'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import InstallMobileOutlinedIcon from '@mui/icons-material/InstallMobileOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import Datos3 from './grid-datos3.json'

const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'home': return <EmojiObjectsOutlinedIcon sx={{ fontSize: 60, color: 'var(--color-acento-primario)' }} />
        case 'person': return <InstallMobileOutlinedIcon sx={{ fontSize: 60, color: 'var(--color-acento-primario)' }} />
        case 'briefcase': return <ShieldOutlinedIcon sx={{ fontSize: 60, color: 'var(--color-acento-primario)' }} />
        default: return null
    }
}

export default function GridDatos3() {
    return (
        <div className="grid-datos3">
            {Datos3.map((dato, index) => (
                <div className="grid-datos3-items" key={index}>
                    <div className='item-icon3'>
                        {getIcon(dato.icono)}
                    </div>
                    <div className='item-datos3'>
                        <h2>{dato.numero}</h2>
                        <p>{dato.texto}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

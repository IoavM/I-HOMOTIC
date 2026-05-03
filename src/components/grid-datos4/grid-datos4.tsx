import './grid-datos4.css'
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

interface Props {
    titulo: string
    valor: string
    icono: string
}

const getIcon = (iconName: string) => {
    const iconStyle = { fontSize: 32, color: 'white' }
    switch(iconName) {
        case 'telefono': return <PhoneEnabledOutlinedIcon sx={iconStyle} />
        case 'email': return <EmailOutlinedIcon sx={iconStyle} />
        case 'whatsapp': return <WhatsAppIcon sx={iconStyle} />
        case 'ubicacion': return <LocationOnOutlinedIcon sx={iconStyle} />
        default: return null
    }
}

export default function GridDatos4({ titulo, valor, icono }: Props) {
    return (
        <div className="item-grid-datos4">
            <div className='icono-dato4'>
                {getIcon(icono)}
            </div>
            <div className='contenido-dato4'>
                <h3>{titulo}</h3>
                <p>{valor}</p>
            </div>
        </div>
    )
}

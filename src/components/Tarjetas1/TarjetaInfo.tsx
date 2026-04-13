import './TarjetaInfo.css'

interface Props {
    imagen: string
    alt?: string
    titulo: string
    descripcion: string
}

export default function TarjetaInfo({ imagen, alt, titulo, descripcion }: Props) {
    return (
        <div className='tarjetas-info'>
            <img src={imagen} alt={alt || titulo} />
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
        </div>
    )
}
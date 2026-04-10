interface Props {
    imagen: string
    titulo: string
    descripcion: string
}

export default function TarjetaInfo({ imagen, titulo, descripcion }: Props) {
    return (
        <div className='tarjetas-info'>
            <img src={imagen} alt={titulo} />
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
        </div>
    )
}
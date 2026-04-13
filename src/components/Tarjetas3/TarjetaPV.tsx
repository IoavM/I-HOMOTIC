import './TarjetaPV.css'

interface TarjetaPVProps {
    emoji: string;
    titulo: string;
    descripcion: string;
}

export default function TarjetaPV({ emoji, titulo, descripcion }: TarjetaPVProps) {
    return (
            <div className='tarjeta-pv'>
                <div className='tarjeta-pv-content'>
                    <span className='tarjeta-pv-emoji'>{emoji}</span>
                    <h2>{titulo}</h2>
                    <p>{descripcion}</p>
                </div>
            </div>
    )
}
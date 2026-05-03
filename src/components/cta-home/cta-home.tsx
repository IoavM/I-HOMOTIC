import './cta-home.css'

interface Props {
    titulo: string
    subtitulo: string
    botonTexto: string
    onClick: () => void
}

export default function CTAHome({ titulo, subtitulo, botonTexto, onClick }: Props) {
    return (
        <div className='CTA-home'>
            <div className='CTA-home-texto'>
                <h2>{titulo}</h2>
                <p>{subtitulo}</p>
            </div>
            <button className='btn-cotizar' onClick={onClick}>
                {botonTexto}
            </button>
        </div>
    )
}

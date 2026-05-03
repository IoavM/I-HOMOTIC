import './hero-conImagen2.css'
import { casa100 } from '../../assets/imagenes'

export default function HeroConImagen2() {

return(
    <section className='hero2' id='hero2' style={{ backgroundImage: `url(${casa100})` }}>
        <div className='hero-content2'>
                <h1>Contácta<span>nos</span></h1>
                <p>Estamos aquí para ayudarte a crear el hogar inteligente que siempre has imaginado</p>   
        </div>
    </section>
)
}

import '../Styles/Nosotros.css'
import { motion } from 'framer-motion'
import { integrantes } from '../integrantes'

export default function Nosotros() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
       <section className='introduccion'>
            <div className='introduccion-texto'>
                <h2>Sobre Nosotros</h2>
                <p>Liderando la transformación digital del hogar con soluciones sostenibles e innovadoras.</p>
            </div>
            <div className='mas-informacion'>
                <div className='introduccion-detalle'>
                    <p>En IHomotic nos dedicamos a crear espacios inteligentes que mejoran la calidad de vida. Con años de experiencia en el sector de la domótica, ofrecemos soluciones personalizadas que combinan tecnología de vanguardia con un compromiso firme por la sostenibilidad.</p>
                    <ul className='lista-valores'>
                        <h3>Nuestros Valores</h3>
                        <li className='valor'>Innovación constante en tecnología del hogar</li>
                        <li className='valor'>Compromiso con la sostenibilidad y el medio ambiente</li>
                        <li className='valor'>Calidad superior en cada instalación</li>
                        <li className='valor'>Atención personalizada y soporte continuo</li>
                    </ul>
                </div>
                <div className='datos'>
                    <div className='dato'>
                        <h3>350+</h3>
                        <p>Proyectos</p>
                    </div>
                    <div className='dato'>
                        <h3>500+</h3>
                        <p>Clientes Satisfechos</p>
                    </div>
                    <div className='dato'>
                        <h3>12+</h3>
                        <p>Años de Experiencia</p>
                    </div>
                    <div className='dato'>
                        <h3>25+</h3>
                        <p>Ciudades</p>
                    </div>
                </div>
            </div>
       </section>

       <section className='equipo'>
            <div className='equipo-texto'>
                <h3>Nuestro Equipo</h3>
                <p>Descubre a los expertos apasionados que hacen posible la magia de la domótica en cada proyecto.</p>
            </div>
            <div className='equipo-miembros'>
                {integrantes.map((persona) => (
                    <div className='miembro' key={persona.nombre}>
                        {persona.foto
                            ? <img src={persona.foto} alt={persona.nombre} className='miembro-foto' />
                            : <div className='miembro-foto'>{persona.iniciales}</div>
                        }
                        <h3>{persona.nombre}</h3>
                        <p>{persona.cargo}</p>
                    </div>
                ))}
            </div>
        </section>

        </motion.div>
    )
}
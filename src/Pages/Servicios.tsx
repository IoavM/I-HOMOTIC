import '../Styles/Home.css'
import { automatizacion, iluminacion, seguridad, casa } from '../assets/imagenes'
import { motion } from 'framer-motion'

export default function Servicios() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
       <section className='hero'>
            <div className='hero-content'>
                <h1>Servicios</h1>
                <h2>para hogares sostenibles</h2>
                <p>Transformamos espacios con automatización avanzada, eficiencia energética y soluciones IoT de última generación para un estilo de vida más cómodo y sostenible.</p>
                <button className='hero-button'>Contáctanos</button>
            </div>
            <div className='hero-image'>
              <h1>Servicios</h1>
                <p>I-HOMOTIC</p>  
            </div>
        </section>

        <section className='servicios'>
            <div className='servicios-content'>
                <h1>Nuestros Servicios</h1>
                <p>Soluciones integrales de domótica para hogares y empresas, diseñadas para maximizar la eficiencia y el confort.</p>
            </div>

            <div className='servicios-tarjetas'>
                <div className='tarjetas-info'>
                    <img src={automatizacion} alt="Automatización del Hogar" />
                    <h2>Automatización del Hogar</h2>
                    <p>Controla todos los sistemas de tu hogar desde una sola plataforma. Iluminación, climatización, persianas y electrodomésticos integrados de forma inteligente.</p>
                </div>

                <div className='tarjetas-info'>
                    <img src={iluminacion} alt="Iluminación Inteligente" />
                    <h2>Iluminación Inteligente</h2>
                    <p>Sistemas de iluminación adaptativos que ajustan intensidad y color según la hora del día, presencia y preferencias personales para máximo confort.</p>
                </div>

                <div className='tarjetas-info'>
                    <img src={seguridad} alt="Seguridad y CCTV" />
                    <h2>Seguridad y CCTV</h2>
                    <p>Vigilancia 24/7 con cámaras HD, sensores de movimiento, alarmas inteligentes y control de acceso remoto para la tranquilidad de tu familia.</p>
                </div>
            </div>
        </section>

        <section className='proyectos'>
            <div className='proyectos-content'>
                <div className='proyectos-info'>
                    <h2>Nuestros Proyectos</h2>
                    <h4>Descubre cómo hemos transformado espacios con soluciones de domótica inteligente.</h4>
                    <div className='proyectos-tarjetas'>
                        <div className='proyectos-tarjetas-info'>
                            <h3>Smart Villa North</h3>
                            <p>Automatización completa de villa de lujo con control de iluminación, climatización y seguridad integrada.</p>
                            <button className='proyectos-button'>Ver Proyecto</button>
                        </div>
                    </div>
                    <div className='proyectos-tarjetas'>
                        <div className='proyectos-tarjetas-info'>
                            <h3>Corporate HQ Automation</h3>
                            <p>Sistema integral de gestión de edificio inteligente con eficiencia energética y control de acceso avanzado.</p>
                            <button className='proyectos-button'>Ver Proyecto</button>
                        </div>
                    </div>
                </div>
                <div className='proyectos-img'>
                    <img src={casa} alt="Proyectos" />
                </div>
            </div>
        </section>
        </motion.div>
    )
}
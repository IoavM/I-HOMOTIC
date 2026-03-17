import '../Styles/Proyectos.css'
import { motion } from 'framer-motion'
import { CasaModerna } from '../assets/imagenes'
import { casa2 } from '../assets/imagenes'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

export default function Proyectos() {
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
       <section className='inicio-proyectos' style={{backgroundImage: `url(${CasaModerna})`}}>
            <div className='inicio-content'>
                <h2>Nuestros Proyectos</h2>
                <h2>Tecnología Inteligente y Eficiencia Energética</h2>
                <p>Descubre cómo hemos transformado espacios con soluciones de domótica inteligente.</p>
            </div>
       </section>

      <section className='proyecto-muestra'>
            <div className='muestra-imagen'>
                <img src={casa2} alt="proyecto" />
            </div>
            <div className='muestra-info'>
                <h2>Casa de lujo en Llanogrande</h2>
                <p>
                    Transformamos un exclusivo penthouse en un hogar completamente inteligente. 
                    El proyecto incluyó automatización total de iluminación con escenas personalizadas, 
                    climatización inteligente por zonas, sistema de audio multi-zona con altavoces 
                    empotrados en cada habitación y una sala de cine privada con proyector 4K y 
                    sonido envolvente Dolby Atmos. Todo controlado desde una sola aplicación móvil 
                    con acceso remoto desde cualquier parte del mundo.
                </p>                <button className='muestra-button' onClick={() => navigate('/proyectos')}>
                    {t('projects.viewProject')}
                </button>
            </div>  
        </section>
        <section className='otros-proyectos'>
            <div className='otros-proyectos-content'>
                <h2>Otros Proyectos</h2>
                <p>Descubre cómo hemos transformado espacios con soluciones de domótica inteligente.</p>
            </div>
            <div className='otros-proyectos-tarjetas'>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt="Proyecto 1" />
                    <h3>Villa Eco-Sostenible</h3>
                    <p>Automatización completa con paneles solares integrados, gestión energética inteligente y control total desde el móvil.</p>
                    <button className='proyecto-tarjeta-button'>Ver Proyecto</button>
                </div>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt="Proyecto 2" />
                    <h3>Residencia Smart Norte</h3>
                    <p>Sistema de seguridad avanzado con cámaras 4K, control de acceso biométrico e iluminación automatizada por zonas.</p>
                    <button className='proyecto-tarjeta-button'>Ver Proyecto</button>
                </div>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt="Proyecto 3" />
                    <h3>Apartamento Conectado</h3>
                    <p>Integración completa de electrodomésticos, climatización inteligente y sistema de audio multi-zona para máximo confort.</p>
                    <button className='proyecto-tarjeta-button'>Ver Proyecto</button>
                </div>
                <div className='proyecto-tarjeta'>
                    <img src={casa2} alt="Proyecto 3" />
                    <h3>Apartamento Conectado</h3>
                    <p>Integración completa de electrodomésticos, climatización inteligente y sistema de audio multi-zona para máximo confort.</p>
                    <button className='proyecto-tarjeta-button'>Ver Proyecto</button>
                </div>
              
            </div>
        </section>
    </motion.div>
    )
}
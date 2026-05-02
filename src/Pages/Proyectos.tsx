import '../Styles/Proyectos.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import HeroProyectos from '../components/hero-proyectos/hero-proyectos'
import TarjetaProyecto from '../components/Tarjetas2/Tarjeta2Info'
import Proyectos2Data from '../components/Tarjetas2/otros-proyectos.json'
import CTA2 from '../components/cta2/cta2'

export default function Proyectos() {
    const [filtro, setFiltro] = useState('Todos')

    const categorias = ['Todos', ...new Set(Proyectos2Data.map(p => p.Etiqueta))]

    const proyectosFiltrados = filtro === 'Todos' 
        ? Proyectos2Data 
        : Proyectos2Data.filter(p => p.Etiqueta === filtro)

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <section className='inicio-proyectos'>
                <HeroProyectos />
            </section>

            <section className='proyecto'>
                <div className='filtros-proyectos'>
                    {categorias.map(cat => (
                        <button 
                            key={cat} 
                            className={`btn-filtro ${filtro === cat ? 'active' : ''}`}
                            onClick={() => setFiltro(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className='otros-proyectos'>
                    <AnimatePresence mode='popLayout'>
                        {proyectosFiltrados.map((proyecto2) => (
                            <motion.div
                                key={proyecto2.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    opacity: { duration: 0.2 }
                                }}
                            >
                                <TarjetaProyecto
                                    id={proyecto2.id}
                                    imagen={proyecto2.imagen}
                                    Etiqueta={proyecto2.Etiqueta}
                                    tituloKey={proyecto2.tituloKey}
                                    descripcionKey={proyecto2.descripcionKey}
                                    altKey={proyecto2.altKey}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <CTA2 />
            </section>
        </motion.div>
    )
}
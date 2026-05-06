import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { casa, CasaModerna, casa2, casa3, casa100 } from '../../assets/imagenes'
import proyectosData from '../Tarjetas2/otros-proyectos.json'
import './pagina-proyectos.css'

const imageMap: Record<string, string> = {
    casa: casa,
    casaModerna: CasaModerna,
    casa2: casa2,
    casa3: casa3,
    casa100: casa100
}

interface CarruselItem {
    id: string
    imagen_antes: string
    imagen_despues: string
    descripcion: string
}

interface ProyectoDetalles {
    cliente: string
    ubicacion: string
    duracion: string
    fecha: string
    area_intervenida: string
    el_reto: string
    la_solucion: string
    resultados_clave: string[]
    sistemas_integrados: string[]
    carrusel_antes_despues: CarruselItem[]
    galeria: string[]
    testimonio: {
        texto: string
        autor: string
    }
}

interface Proyecto {
    id: string
    imagen: string
    tituloKey: string
    Etiqueta: string
    descripcionKey: string
    altKey: string
    detalles: ProyectoDetalles
}

export default function PaginaProyectos() {
    const { id } = useParams<{ id: string }>()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const proyecto = (proyectosData as Proyecto[]).find(p => p.id === id)

    const [carruselIndex, setCarruselIndex] = useState(0)
    const [mostrarDespues, setMostrarDespues] = useState(false)

    useEffect(() => {
        if (!proyecto) {
            navigate('/proyectos')
        }
    }, [proyecto, navigate])

    if (!proyecto) return null

    const det = proyecto.detalles
    const carruselItems = det.carrusel_antes_despues

    const handlePrevCarrusel = () => {
        setCarruselIndex(prev => (prev === 0 ? carruselItems.length - 1 : prev - 1))
        setMostrarDespues(false)
    }

    const handleNextCarrusel = () => {
        setCarruselIndex(prev => (prev === carruselItems.length - 1 ? 0 : prev + 1))
        setMostrarDespues(false)
    }

    return (
        <motion.div
            className='proy-det-page'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── Hero con imagen de fondo ── */}
            <div className='proy-det-hero' style={{ backgroundImage: `url(${casa2})` }}>
                <div className='proy-det-hero-overlay'>
                    <span className='proy-det-etiqueta'>{proyecto.Etiqueta}</span>
                    <h1>{proyecto.tituloKey}</h1>
                    <p className='proy-det-hero-sub'>{proyecto.descripcionKey}</p>
                </div>
            </div>

            <div className='proy-det-body'>
                <button className='proy-det-volver' onClick={() => navigate(-1)}>← {t('projects.viewProject', 'Volver')}</button>

                {/* ── Ficha técnica ── */}
                <section className='proy-det-ficha'>
                    <div className='ficha-item'>
                        <span className='ficha-label'>Cliente</span>
                        <span className='ficha-valor'>{det.cliente}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>Ubicación</span>
                        <span className='ficha-valor'>{det.ubicacion}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>Duración</span>
                        <span className='ficha-valor'>{det.duracion}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>Fecha</span>
                        <span className='ficha-valor'>{det.fecha}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>Área</span>
                        <span className='ficha-valor'>{det.area_intervenida}</span>
                    </div>
                </section>

                {/* ── Descripción Continua ── */}
                <section className='proy-det-seccion proy-det-continuo'>
                    <h2>El Reto</h2>
                    <p>{det.el_reto}</p>
                    
                    <h2 style={{ marginTop: '2.5rem' }}>La Solución</h2>
                    <p>{det.la_solucion}</p>
                </section>

                {/* ── Sistemas Integrados ── */}
                <section className='proy-det-seccion'>
                    <div className='proy-det-seccion-header'>
                        <h2>Sistemas Integrados</h2>
                    </div>
                    <div className='sistemas-grid'>
                        {det.sistemas_integrados.map((sistema, i) => (
                            <div className='sistema-card' key={i}>
                                <div className='sistema-icono'>⚡</div>
                                <span>{sistema}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Resultados Clave ── */}
                <section className='proy-det-seccion proy-det-resultados'>
                    <div className='proy-det-seccion-header'>
                        <h2>Resultados Clave</h2>
                    </div>
                    <div className='resultados-lista'>
                        {det.resultados_clave.map((resultado, i) => (
                            <div className='resultado-item' key={i}>
                                <span className='resultado-check'>✓</span>
                                <p>{resultado}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Carrusel Antes / Después ── */}
                {carruselItems.length > 0 && (
                    <section className='proy-det-seccion'>
                        <div className='proy-det-seccion-header'>
                            <h2>Antes y Después</h2>
                        </div>
                        <div className='carrusel-ad'>
                            <div className='carrusel-ad-viewer'>
                                <div className='carrusel-ad-img-container'>
                                    <img
                                        src={mostrarDespues ? imageMap[carruselItems[carruselIndex].imagen_despues] || casa2 : imageMap[carruselItems[carruselIndex].imagen_antes] || casa2}
                                        alt={mostrarDespues ? 'Después' : 'Antes'}
                                        className='carrusel-ad-img'
                                    />
                                    <span className={`carrusel-ad-badge ${mostrarDespues ? 'despues' : 'antes'}`}>
                                        {mostrarDespues ? 'DESPUÉS' : 'ANTES'}
                                    </span>
                                </div>
                                <div className='carrusel-ad-toggle'>
                                    <button
                                        className={`proy-toggle-btn ${!mostrarDespues ? 'active' : ''}`}
                                        onClick={() => setMostrarDespues(false)}
                                    >
                                        Antes
                                    </button>
                                    <button
                                        className={`proy-toggle-btn ${mostrarDespues ? 'active' : ''}`}
                                        onClick={() => setMostrarDespues(true)}
                                    >
                                        Después
                                    </button>
                                </div>
                            </div>
                            <div className='carrusel-ad-info'>
                                <p className='carrusel-ad-desc'>{carruselItems[carruselIndex].descripcion}</p>
                                {carruselItems.length > 1 && (
                                    <div className='carrusel-ad-nav-modern'>
                                        <button className='carrusel-nav-btn-text' onClick={handlePrevCarrusel}>
                                            <span className='nav-arrow'>←</span> Ver área anterior
                                        </button>
                                        <span className='carrusel-counter'>{carruselIndex + 1} / {carruselItems.length}</span>
                                        <button className='carrusel-nav-btn-text' onClick={handleNextCarrusel}>
                                            Siguiente área <span className='nav-arrow'>→</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Testimonio ── */}
                <section className='proy-det-testimonio'>
                    <div className='testimonio-comillas'>"</div>
                    <blockquote>{det.testimonio.texto}</blockquote>
                    <cite>— {det.testimonio.autor}</cite>
                </section>

                {/* ── CTA ── */}
                <section className='proy-det-cta'>
                    <h3>¿Quieres un proyecto así?</h3>
                    <p>Agenda una asesoría gratuita y cuéntanos sobre tu espacio</p>
                    <div className='proy-det-cta-btns'>
                        <button className='proy-cta-primary' onClick={() => navigate('/contacto')}>
                            {t('hero.contact')}
                        </button>
                        <button className='proy-cta-secondary' onClick={() => navigate('/calculadora')}>
                            Calcular presupuesto
                        </button>
                    </div>
                </section>
            </div>
        </motion.div>
    )
}

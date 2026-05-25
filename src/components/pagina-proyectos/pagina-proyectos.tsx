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

interface LocalizedString {
    es: string
    en: string
}

interface LocalizedArray {
    es: string[]
    en: string[]
}

interface CarruselItem {
    id: string
    imagen_antes: string
    imagen_despues: string
    descripcion: string | LocalizedString
}

interface ProyectoDetalles {
    cliente: string | LocalizedString
    ubicacion: string | LocalizedString
    duracion: string | LocalizedString
    fecha: string | LocalizedString
    area_intervenida: string | LocalizedString
    trabajo_realizado: string | LocalizedString
    inversion: string | LocalizedString
    el_reto: string | LocalizedString
    la_solucion: string | LocalizedString
    resultados_clave: string[] | LocalizedArray
    sistemas_integrados: string[] | LocalizedArray
    carrusel_antes_despues: CarruselItem[]
    galeria: string[]
    testimonio: {
        texto: string | LocalizedString
        autor: string | LocalizedString
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
    const { t, i18n } = useTranslation()
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

    // Auxiliares para resolver traducciones dinámicas en base al idioma seleccionado
    const getTranslation = (field: string | LocalizedString | undefined): string => {
        if (!field) return ''
        if (typeof field === 'object' && field !== null) {
            const lang = i18n.language.startsWith('en') ? 'en' : 'es'
            return field[lang] || field['es'] || ''
        }
        return field
    }

    const getTranslationArray = (field: string[] | LocalizedArray | undefined): string[] => {
        if (!field) return []
        if (typeof field === 'object' && !Array.isArray(field)) {
            const lang = i18n.language.startsWith('en') ? 'en' : 'es'
            return field[lang] || field['es'] || []
        }
        return field
    }

    return (
        <motion.div
            className='proy-det-page'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* ── Hero con imagen de fondo ── */}
            <link rel="preload" as="image" href={casa2} fetchPriority="high" />
            <div className='proy-det-hero' style={{ backgroundImage: `url(${casa2})` }}>
                <div className='proy-det-hero-overlay'>
                    <span className='proy-det-etiqueta'>{t(proyecto.Etiqueta)}</span>
                    <h1>{t(proyecto.tituloKey)}</h1>
                    <p className='proy-det-hero-sub'>{t(proyecto.descripcionKey)}</p>
                </div>
            </div>

            <div className='proy-det-body'>
                <button className='proy-det-volver' onClick={() => navigate(-1)}>← {t('projects.viewProject', 'Volver')}</button>

                {/* ── Ficha técnica ── */}
                <section className='proy-det-ficha'>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.client')}</span>
                        <span className='ficha-valor'>{getTranslation(det.cliente)}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.location')}</span>
                        <span className='ficha-valor'>{getTranslation(det.ubicacion)}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.duration')}</span>
                        <span className='ficha-valor'>{getTranslation(det.duracion)}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.date')}</span>
                        <span className='ficha-valor'>{getTranslation(det.fecha)}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.area')}</span>
                        <span className='ficha-valor'>{getTranslation(det.area_intervenida)}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.workDone')}</span>
                        <span className='ficha-valor'>{getTranslation(det.trabajo_realizado)}</span>
                    </div>
                    <div className='ficha-item'>
                        <span className='ficha-label'>{t('projects.detail.investment')}</span>
                        <span className='ficha-valor'>{getTranslation(det.inversion)}</span>
                    </div>
                </section>

                {/* ── Descripción Continua ── */}
                <section className='proy-det-seccion proy-det-continuo'>
                    <h2>{t('projects.detail.challenge')}</h2>
                    <p>{getTranslation(det.el_reto)}</p>
                    
                    <h2 style={{ marginTop: '2.5rem' }}>{t('projects.detail.solution')}</h2>
                    <p>{getTranslation(det.la_solucion)}</p>
                </section>

                {/* ── Sistemas Integrados ── */}
                <section className='proy-det-seccion'>
                    <div className='proy-det-seccion-header'>
                        <h2>{t('projects.detail.integratedSystems')}</h2>
                    </div>
                    <div className='sistemas-grid'>
                        {getTranslationArray(det.sistemas_integrados).map((sistema, i) => (
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
                        <h2>{t('projects.detail.keyResults')}</h2>
                    </div>
                    <div className='resultados-lista'>
                        {getTranslationArray(det.resultados_clave).map((resultado, i) => (
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
                            <h2>{t('projects.detail.beforeAfter')}</h2>
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
                                        {mostrarDespues ? t('projects.detail.after').toUpperCase() : t('projects.detail.before').toUpperCase()}
                                    </span>
                                </div>
                                <div className='carrusel-ad-toggle'>
                                    <button
                                        className={`proy-toggle-btn ${!mostrarDespues ? 'active' : ''}`}
                                        onClick={() => setMostrarDespues(false)}
                                    >
                                        {t('projects.detail.before')}
                                    </button>
                                    <button
                                        className={`proy-toggle-btn ${mostrarDespues ? 'active' : ''}`}
                                        onClick={() => setMostrarDespues(true)}
                                    >
                                        {t('projects.detail.after')}
                                    </button>
                                </div>
                            </div>
                            <div className='carrusel-ad-info'>
                                <p className='carrusel-ad-desc'>{getTranslation(carruselItems[carruselIndex].descripcion)}</p>
                                {carruselItems.length > 1 && (
                                    <div className='carrusel-ad-nav-modern'>
                                        <button className='carrusel-nav-btn-text' onClick={handlePrevCarrusel}>
                                            <span className='nav-arrow'>←</span> {t('projects.detail.prevArea')}
                                        </button>
                                        <span className='carrusel-counter'>{carruselIndex + 1} / {carruselItems.length}</span>
                                        <button className='carrusel-nav-btn-text' onClick={handleNextCarrusel}>
                                            {t('projects.detail.nextArea')} <span className='nav-arrow'>→</span>
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
                    <blockquote>{getTranslation(det.testimonio.texto)}</blockquote>
                    <cite>— {getTranslation(det.testimonio.autor)}</cite>
                </section>

                {/* ── CTA ── */}
                <section className='proy-det-cta'>
                    <h3>{t('projects.detail.ctaTitle')}</h3>
                    <p>{t('projects.detail.ctaSubtitle')}</p>
                    <div className='proy-det-cta-btns'>
                        <button className='proy-cta-primary' onClick={() => navigate('/contacto')}>
                            {t('hero.contact')}
                        </button>
                        <button className='proy-cta-secondary' onClick={() => navigate('/calculadora')}>
                            {t('projects.detail.calculateBudget')}
                        </button>
                    </div>
                </section>
            </div>
        </motion.div>
    )
}

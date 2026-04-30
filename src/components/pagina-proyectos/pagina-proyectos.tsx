import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { casa, casa2 } from '../../assets/imagenes'
import './pagina-proyectos.css'

const projectDatabase: Record<string, { tituloKey: string; descripcionKey: string; imagen: string }> = {
    'destacado': { tituloKey: 'projects.featuredTitle', descripcionKey: 'projects.featuredDescription', imagen: casa2 },
    '1': { tituloKey: 'projects.project1Title', descripcionKey: 'projects.project1Description', imagen: casa2 },
    '2': { tituloKey: 'projects.project2Title', descripcionKey: 'projects.project2Description', imagen: casa2 },
    '3': { tituloKey: 'projects.project3Title', descripcionKey: 'projects.project3Description', imagen: casa2 },
    '4': { tituloKey: 'projects.project4Title', descripcionKey: 'projects.project4Description', imagen: casa2 },
    'villa': { tituloKey: 'projects.villaTitle', descripcionKey: 'projects.villaDescription', imagen: casa },
    'hq': { tituloKey: 'projects.hqTitle', descripcionKey: 'projects.hqDescription', imagen: casa }
}

export default function PaginaProyectos() {
    const { id } = useParams<{ id: string }>()
    const { t } = useTranslation()
    const navigate = useNavigate()
    
    const project = id ? projectDatabase[id] : null

    useEffect(() => {
        if (!project) {
            navigate('/proyectos')
        }
    }, [project, navigate])

    if (!project) return null

    return (
        <motion.div 
            className='proyecto-detalle-pagina'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='proyecto-detalle-header' style={{ backgroundImage: `url(${project.imagen})` }}>
                <div className='proyecto-detalle-overlay'>
                    <h1>{t(project.tituloKey)}</h1>
                </div>
            </div>
            
            <div className='proyecto-detalle-contenido'>
                <button className='proyecto-btn-volver' tabIndex={11} onClick={() => navigate(-1)}>
                    ← Volver
                </button>
                
                <section className='proyecto-info-seccion'>
                    <div className='proyecto-texto'>
                        <h2>{t('projects.detailsTitle', 'Detalles del Proyecto')}</h2>
                        <p>{t(project.descripcionKey)}</p>
                    </div>
                    <div className='proyecto-galeria'>
                        <img src={project.imagen} alt={t(project.tituloKey)} loading="lazy" />
                    </div>
                </section>
                
                <section className='proyecto-contacto-cta'>
                    <h3>{t('servicios.callToAction', '¿Quieres un proyecto así?')}</h3>
                    <button className='proyecto-btn-cta' tabIndex={11} onClick={() => navigate('/contacto')}>
                        {t('hero.contact')}
                    </button>
                </section>
            </div>
        </motion.div>
    )
}

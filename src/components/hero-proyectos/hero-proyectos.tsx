import './hero-proyectos.css'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GridDatos3 from '../grid-datos3/grid-datos3';
import { casa3 } from '../../assets/imagenes';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';

export default function HeroProyectos() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleScrollToProyectos = () => {
        const el = document.getElementById('proyecto');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else navigate('/proyectos'); 
    };

    return (
        <div className='hero-proyectos'>
            <div className='hero-proyectos-content'>
                <h3>{t('projects.pageTitle').toUpperCase()}</h3>
                <h2>{t('home.projectsHeading')}<span>{t('home.projectsHeadingSpan')}</span></h2>
                <p>{t('projects.heroSubtitle')}</p>
                <button className='btn-proyectos' onClick={handleScrollToProyectos}>{t('home.projectsButton')}</button>
                <GridDatos3 />
            </div>

            <div className='hero-proyectos-image'>
                <img src={casa3} alt="Casa Inteligente" fetchPriority="high" loading="eager" />
                
                <div className='hero-image-card'>
                    <div className='hero-image-card-item'>
                        <div className='card-icon-box'>
                            <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-oscuro-primario)' }} />
                        </div>
                        <div className='card-text'>
                            <h4>{t('projects.card1Title')}</h4>
                            <p>{t('projects.card1Desc')}</p>
                        </div>
                    </div>
                    
                    <div className='hero-image-card-item'>
                        <div className='card-icon-box'>
                            <EnergySavingsLeafOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-acento-primario)' }} />
                        </div>
                        <div className='card-text'>
                            <h4>{t('projects.card2Title')}</h4>
                            <p>{t('projects.card2Desc')}</p>
                        </div>
                    </div>

                    <div className='hero-image-card-item'>
                        <div className='card-icon-box'>
                            <WeekendOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-acento-primario)' }} />
                        </div>
                        <div className='card-text'>
                            <h4>{t('projects.card3Title')}</h4>
                            <p>{t('projects.card3Desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
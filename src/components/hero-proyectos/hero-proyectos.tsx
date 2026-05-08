import './hero-proyectos.css'
import { useNavigate } from 'react-router-dom';
import GridDatos3 from '../grid-datos3/grid-datos3';
import { casa3 } from '../../assets/imagenes';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';

export default function HeroProyectos() {
    const navigate = useNavigate();

    const handleScrollToProyectos = () => {
        const el = document.getElementById('proyecto');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else navigate('/proyectos'); 
    };

    return (
        <div className='hero-proyectos'>
            <div className='hero-proyectos-content'>
                <h3>NUESTROS PROYECTOS</h3>
                <h2>Proyectos que <span>inspiran</span></h2>
                <p>Descubre cómo transformamos espacios en hogares inteligentes, conectando tecnología y confort</p>
                <button className='btn-proyectos' onClick={handleScrollToProyectos}>Ver todos los proyectos </button>
                <GridDatos3 />
            </div>

            <div className='hero-proyectos-image'>
                <img src={casa3} alt="Casa Inteligente" />
                
                <div className='hero-image-card'>
                    <div className='hero-image-card-item'>
                        <div className='card-icon-box'>
                            <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-oscuro-primario)' }} />
                        </div>
                        <div className='card-text'>
                            <h4>Tecnología avanzada</h4>
                            <p>Soluciones de última generación.</p>
                        </div>
                    </div>
                    
                    <div className='hero-image-card-item'>
                        <div className='card-icon-box'>
                            <EnergySavingsLeafOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-acento-primario)' }} />
                        </div>
                        <div className='card-text'>
                            <h4>Eficiencia energética</h4>
                            <p>Optimizamos el consumo y reducimos costos.</p>
                        </div>
                    </div>

                    <div className='hero-image-card-item'>
                        <div className='card-icon-box'>
                            <WeekendOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-acento-primario)' }} />
                        </div>
                        <div className='card-text'>
                            <h4>Confort total</h4>
                            <p>Control inteligente para una vida más cómoda.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
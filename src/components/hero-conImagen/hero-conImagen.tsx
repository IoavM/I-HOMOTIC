import '../hero-conImagen/hero-conIamgen.css'
import { CasaModerna} from '../../assets/imagenes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function HeroConImagen() {
const { t } = useTranslation()
const navigate = useNavigate()

return(
    <section className='hero' id='hero' style={{ backgroundImage: `url(${CasaModerna})` }}>
        <div className='hero-content'>
                <h1>Transforma</h1>
                <h1>tu hogar en un</h1>
                <h2>{t('hero.subtitle')}</h2>
                <p>Automatización, seguridad, confort y eficiencia en un solo lugar.</p>
                <div className='hero-buttons'>
                    <button className='hero-button' tabIndex={10} onClick={() => navigate('/mapa')}>{t('hero.Explore')} </button>
                    <button
                        className='hero-button'
                        tabIndex={11}
                        onClick={() => {
                            window.open(
                                "https://wa.me/573014032120?text=Hola,%20quiero%20información%20sobre%20domótica",
                                "_blank"
                            )
                            Swal.fire({
                                title: t('hero.messageSent'),
                                icon: "success",
                                draggable: true,
                                confirmButtonColor: "#2D6A2E"
                            })
                        }}
                    >
                        {t('hero.contact')} 
                    </button>
                </div>
        </div>
    </section>
)
}
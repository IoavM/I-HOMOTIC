import './hero-conImagen2.css'
import { casa100 } from '../../assets/imagenes'
import { useTranslation } from 'react-i18next'

export default function HeroConImagen2() {
    const { t } = useTranslation()

return(
    <>
        <link rel="preload" as="image" href={casa100} fetchPriority="high" />
        <section className='hero2' id='hero2' style={{ backgroundImage: `url(${casa100})` }}>
            <div className='hero-content2'>
                    <h1>{t('contacto.heroTitle')}<span>{t('contacto.heroTitleSpan')}</span></h1>
                    <p>{t('contacto.heroSubtitle')}</p>   
            </div>
        </section>
    </>
)
}

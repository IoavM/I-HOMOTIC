import '../Styles/Nosotros.css'
import { motion } from 'framer-motion'
import { integrantes } from '../integrantes'
import { useTranslation } from 'react-i18next'
import datos from '../components/grid-datos/grid-datos-info.json'
import TarjetaDato from '../components/grid-datos/grid-datos'

export default function Nosotros() {
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
       <section className='introduccion'>
            <div className='introduccion-texto'>
                <h2>{t('nosotros.aboutTitle')}</h2>
                <p>{t('nosotros.aboutSubtitle')}</p>
            </div>
            <div className='mas-informacion'>
                <div className='introduccion-detalle'>
                    <p>{t('nosotros.aboutDescription')}</p>
                    <ul className='lista-valores'>
                        <h3>{t('nosotros.valuesTitle')}</h3>
                        <li className='valor'>{t('nosotros.value1')}</li>
                        <li className='valor'>{t('nosotros.value2')}</li>
                        <li className='valor'>{t('nosotros.value3')}</li>
                        <li className='valor'>{t('nosotros.value4')}</li>
                    </ul>
                </div>
                <div className='datos'>
                    {datos.map((dato) => (
                        <TarjetaDato
                            key={dato.etiquetaKey}
                            valor={dato.valor}
                            etiquetaKey={dato.etiquetaKey}
                        />
                    ))}
                </div>
                
            </div>
       </section>

       <section className='equipo'>
            <div className='equipo-texto'>
                <h3>{t('nosotros.teamTitle')}</h3>
                <p>{t('nosotros.teamSubtitle')}</p>
            </div>
            <div className='equipo-miembros'>
                {integrantes.map((persona) => (
                    <div className='miembro' key={persona.nombre}>
                        {persona.foto
                            ? <img src={persona.foto} alt={persona.nombre} className='miembro-foto' />
                            : <div className='miembro-foto'>{persona.iniciales}</div>
                        }
                        <h3>{persona.nombre}</h3>
                        <p>{persona.cargo}</p>
                    </div>
                ))}
            </div>
        </section>

        </motion.div>
    )
}
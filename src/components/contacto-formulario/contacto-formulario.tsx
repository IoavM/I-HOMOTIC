import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './contacto-formulario.css'
import { FaWhatsapp } from 'react-icons/fa'
import campos from './campos-formulario.json'

export default function ContactoFormulario() {
    const { t } = useTranslation()

    const initialState: Record<string, string> = {}
    campos.forEach((campo) => { initialState[campo.id] = '' })
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleWhatsApp = (e: React.FormEvent) => {
        e.preventDefault()
        const texto = `Hola, soy *${formData.nombre}*.%0A📧 Email: ${formData.email}%0A📞 Teléfono: ${formData.telefono}%0A📍 Dirección: ${formData.direccion}%0A💬 Mensaje: ${formData.mensaje}`
        window.open(
            `https://wa.me/573014032120?text=${texto}`,
            '_blank'
        )
    }

    // Agrupa los campos no-fullWidth de a 2 para las filas
    const camposNormales = campos.filter((c) => !c.fullWidth)
    const camposFull = campos.filter((c) => c.fullWidth)
    const grupos: typeof campos[] = []
    for (let i = 0; i < camposNormales.length; i += 2) {
        grupos.push(camposNormales.slice(i, i + 2))
    }

    return (
        <section className='seccion-formulario'>
            <div className='div-formulario'>
                <div className='formulario-header'>
                    <h2>{t('contacto.formTitle')}</h2>
                    <p>{t('contacto.formSubtitle')}</p>
                </div>
                <form className='formulario' onSubmit={handleWhatsApp}>
                    {grupos.map((grupo, i) => (
                        <div className='formulario-grupo' key={i}>
                            {grupo.map((campo) => (
                                <div className='formulario-campo' key={campo.id}>
                                    <label htmlFor={campo.id}>{t(campo.labelKey)}</label>
                                    <input
                                        className='formulario-input'
                                        id={campo.id}
                                        name={campo.id}
                                        type={campo.type}
                                        placeholder={t(campo.placeholderKey)}
                                        value={formData[campo.id]}
                                        onChange={handleChange}
                                        required={campo.required}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}

                    {camposFull.map((campo) => (
                        <div className='formulario-campo formulario-campo-full' key={campo.id}>
                            <label htmlFor={campo.id}>{t(campo.labelKey)}</label>
                            <textarea
                                className='formulario-input formulario-textarea'
                                id={campo.id}
                                name={campo.id}
                                placeholder={t(campo.placeholderKey)}
                                value={formData[campo.id]}
                                onChange={handleChange}
                                rows={campo.rows ?? 5}
                                required={campo.required}
                            />
                        </div>
                    ))}

                    <button className='boton-whatsapp' type='submit'>
                        <FaWhatsapp size={22} />
                        {t('contacto.whatsappButton')}
                    </button>
                </form>
            </div>
        </section>
    )
}

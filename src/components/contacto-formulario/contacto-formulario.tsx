import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import './contacto-formulario.css'
import { FaWhatsapp } from 'react-icons/fa'
import campos from './campos-formulario.json'
import codigosPais from './country-codes.json'
import { useAddress } from '../../hooks/useAddress'


const WEBHOOK = 'https://auto.lubrifrenosnacional.com/webhook/0238ce80-7f1b-47da-aec0-17370f3e3429'

const SERVICIOS = [
  { key: 'services.automationTitle', value: 'Automatización' },
  { key: 'services.lightingTitle',   value: 'Iluminación'    },
  { key: 'services.securityTitle',   value: 'Seguridad'      },
]

export default function ContactoFormulario() {
  const { t } = useTranslation()
  const { countries, states, cities, loadingStates, loadingCities, loadStates, loadCities } = useAddress()
  const [sending, setSending] = useState(false)

  const initialState: Record<string, string> = {}
  campos.forEach((campo) => { initialState[campo.id] = '' })

  const [formData, setFormData] = useState<Record<string, string>>({
    ...initialState,
    codigoPais: '+57',
    pais:       '',
    estado:     '',
    ciudad:     '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pais = e.target.value
    setFormData(prev => ({ ...prev, pais, estado: '', ciudad: '' }))
    loadStates(pais)
  }

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estado = e.target.value
    setFormData(prev => ({ ...prev, estado, ciudad: '' }))
    loadCities(formData.pais, estado)
  }

  const handleWhatsApp = () => {
    const lineas: string[] = []
    if (formData.nombre)   lineas.push(`Hola, soy *${formData.nombre}*.`)
    if (formData.email)    lineas.push(`📧 Email: ${formData.email}`)
    if (formData.telefono) lineas.push(`📞 Teléfono: ${formData.codigoPais} ${formData.telefono}`)
    if (formData.interes)  lineas.push(`🏠 Interés: ${formData.interes}`)
    const dir = [formData.ciudad, formData.estado, formData.pais].filter(Boolean).join(', ')
    if (dir)               lineas.push(`📍 Ubicación: ${dir}`)
    if (formData.mensaje)  lineas.push(`💬 Mensaje: ${formData.mensaje}`)
    window.open(`https://wa.me/573014032120?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank')
  }

  const handleEmail = async () => {
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      Swal.fire({
        title: t('contacto.emailErrorTitle'),
        text: 'Por favor completa los campos obligatorios.',
        icon: 'warning',
        confirmButtonColor: '#07573B',
      })
      return
    }

    setSending(true)
    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:    formData.nombre,
          email:     formData.email,
          telefono:  `${formData.codigoPais} ${formData.telefono}`.trim(),
          ciudad:    formData.ciudad || formData.estado || formData.pais || '',
          interes:   formData.interes || '',
          mensaje:   formData.mensaje,
          timestamp: new Date().toISOString(),
          source:    'i-homotic-interactivos',
        }),
      })
      const empty: Record<string, string> = {}
      campos.forEach((c) => { empty[c.id] = '' })
      setFormData({ ...empty, codigoPais: '+57', pais: '', estado: '', ciudad: '' })
      Swal.fire({
        title: t('contacto.emailSentTitle'),
        text:  t('contacto.emailSentText'),
        icon:  'success',
        confirmButtonColor: '#07573B',
      })
    } catch {
      Swal.fire({
        title: t('contacto.emailErrorTitle'),
        text:  t('contacto.emailErrorText'),
        icon:  'error',
        confirmButtonColor: '#07573B',
      })
    } finally {
      setSending(false)
    }
  }

  const camposNormales = campos.filter((c) => !c.fullWidth)
  const camposFull     = campos.filter((c) => c.fullWidth)
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
        <form className='formulario'>

          {grupos.map((grupo, i) => (
            <div className='formulario-grupo' key={i}>
              {grupo.map((campo) => (
                <div className='formulario-campo' key={campo.id}>
                  <label htmlFor={campo.id}>
                    {t(campo.labelKey)}
                    {campo.required && <span className='campo-requerido' aria-hidden='true'> *</span>}
                  </label>
                  <input
                    className='formulario-input'
                    id={campo.id}
                    name={campo.id}
                    type={campo.type}
                    placeholder={campo.placeholderKey ? t(campo.placeholderKey) : ''}
                    value={formData[campo.id] ?? ''}
                    onChange={handleChange}
                    required={campo.required}
                  />
                </div>
              ))}
            </div>
          ))}

          {camposFull.map((campo) => {
            if (campo.type === 'phone') return (
              <div className='formulario-campo' key={campo.id}>
                <label htmlFor={campo.id}>
                  {t(campo.labelKey)}
                  {campo.required && <span className='campo-requerido' aria-hidden='true'> *</span>}
                </label>
                <div className='telefono-combo'>
                  <select
                    className='formulario-input telefono-codigo'
                    name='codigoPais'
                    value={formData.codigoPais}
                    onChange={handleChange}
                    aria-label={t('contacto.codigoPais')}
                  >
                    {codigosPais.map((c) => (
                      <option key={c.country} value={c.code}>
                        [{c.iso}] {c.code} — {c.country}
                      </option>
                    ))}
                  </select>
                  <input
                    className='formulario-input telefono-numero'
                    id={campo.id}
                    name={campo.id}
                    type='tel'
                    placeholder={campo.placeholderKey ? t(campo.placeholderKey) : ''}
                    value={formData[campo.id] ?? ''}
                    onChange={handleChange}
                    required={campo.required}
                  />
                </div>
              </div>
            )

            if (campo.type === 'service-select') return (
              <div className='formulario-campo' key={campo.id}>
                <label>
                  {t(campo.labelKey)}
                  {campo.required && <span className='campo-requerido' aria-hidden='true'> *</span>}
                </label>
                <select
                  className='formulario-input'
                  name='interes'
                  value={formData.interes}
                  onChange={handleChange}
                >
                  <option value=''>{t('contacto.interesPlaceholder')}</option>
                  {SERVICIOS.map(s => (
                    <option key={s.value} value={s.value}>{t(s.key)}</option>
                  ))}
                </select>
              </div>
            )

            if (campo.type === 'address-select') return (
              <div className='formulario-campo' key={campo.id}>
                <label>
                  {t(campo.labelKey)}
                  {campo.required && <span className='campo-requerido' aria-hidden='true'> *</span>}
                </label>
                <div className='direccion-selects'>
                  <select
                    className='formulario-input'
                    name='pais'
                    value={formData.pais}
                    onChange={handlePaisChange}
                    aria-label={t('contacto.pais')}
                  >
                    <option value=''>{t('contacto.seleccionaPais')}</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    className='formulario-input'
                    name='estado'
                    value={formData.estado}
                    onChange={handleEstadoChange}
                    disabled={!states.length && !loadingStates}
                    aria-label={t('contacto.estado')}
                  >
                    <option value=''>
                      {loadingStates ? t('contacto.cargando') : t('contacto.seleccionaEstado')}
                    </option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    className='formulario-input'
                    name='ciudad'
                    value={formData.ciudad}
                    onChange={handleChange}
                    disabled={!cities.length && !loadingCities}
                    aria-label={t('contacto.ciudad')}
                  >
                    <option value=''>
                      {loadingCities ? t('contacto.cargando') : t('contacto.seleccionaCiudad')}
                    </option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )

            return (
              <div className='formulario-campo formulario-campo-full' key={campo.id}>
                <label htmlFor={campo.id}>
                  {t(campo.labelKey)}
                  {campo.required && <span className='campo-requerido' aria-hidden='true'> *</span>}
                </label>
                <textarea
                  className='formulario-input formulario-textarea'
                  id={campo.id}
                  name={campo.id}
                  placeholder={campo.placeholderKey ? t(campo.placeholderKey) : ''}
                  value={formData[campo.id] ?? ''}
                  onChange={handleChange}
                  rows={campo.rows ?? 5}
                  required={campo.required}
                />
              </div>
            )
          })}

          <div className='formulario-botones'>
            <button
              className='boton-email'
              type='button'
              onClick={handleEmail}
              disabled={sending}
            >
              ✉️ {t('contacto.emailButton')}
            </button>
            <button
              className='boton-whatsapp'
              type='button'
              onClick={handleWhatsApp}
            >
              <FaWhatsapp size={22} />
              {t('contacto.whatsappButton')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
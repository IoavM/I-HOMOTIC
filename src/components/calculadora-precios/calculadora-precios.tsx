import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './calculadora-precios.css'
import data from './productos.json'
import { useTRM } from '../../hooks/useTRM'

type Modo = 'asistencia' | 'productos' | 'ahorro'

type TipoVivienda = 'casa' | 'departamento' | 'oficina'
type NivelAutomatizacion = 'basico' | 'intermedio' | 'completo'
type PasoGuiado = 1 | 2 | 3 | 4

interface RespuestasGuiado {
    tipoVivienda: TipoVivienda | null
    habitaciones: number | null
    automatizacion: NivelAutomatizacion | null
}

const PRECIOS_BASE: Record<TipoVivienda, number> = {
    casa: 1500000,
    departamento: 1000000,
    oficina: 1200000,
}

const MULTIPLICADOR_AUTO: Record<NivelAutomatizacion, number> = {
    basico: 1,
    intermedio: 1.8,
    completo: 2.5,
}

const VIVIENDA_OPTIONS: { id: TipoVivienda; icon: string; labelKey: string; descKey: string }[] = [
    { id: 'casa', icon: '🏠', labelKey: 'calculator.homeCasa', descKey: 'calculator.homeCasaDesc' },
    { id: 'departamento', icon: '🏢', labelKey: 'calculator.homeDepa', descKey: 'calculator.homeDepaDesc' },
    { id: 'oficina', icon: '🏬', labelKey: 'calculator.homeOffice', descKey: 'calculator.homeOfficeDesc' },
]

const NIVEL_OPTIONS: { id: NivelAutomatizacion; icon: string; labelKey: string; descKey: string }[] = [
    { id: 'basico', icon: '💡', labelKey: 'calculator.lvlBasic', descKey: 'calculator.lvlBasicDesc' },
    { id: 'intermedio', icon: '🛡️', labelKey: 'calculator.lvlInter', descKey: 'calculator.lvlInterDesc' },
    { id: 'completo', icon: '✨', labelKey: 'calculator.lvlPremium', descKey: 'calculator.lvlPremiumDesc' },
]

interface ProductoAgregado {
    id: string
    cantidad: number
}

type FlujoEstado =
    | { paso: 'cerrado' }
    | { paso: 'elegir_producto' }

export default function CalculadoraPrecios() {
    const { t } = useTranslation()
    const { trm, fecha, loading: trmLoading, error: trmError } = useTRM()
    const [modo, setModo] = useState<Modo>('asistencia')
    const [carrito, setCarrito] = useState<ProductoAgregado[]>([])
    const [flujo, setFlujo] = useState<FlujoEstado>({ paso: 'cerrado' })

    const [pasoActual, setPasoActual] = useState<PasoGuiado>(1)
    const [respuestas, setRespuestas] = useState<RespuestasGuiado>({
        tipoVivienda: null,
        habitaciones: null,
        automatizacion: null,
    })

    const [habitaciones, setHabitaciones] = useState(3)
    const [consumo, setConsumo] = useState(280)
    const [horas, setHoras] = useState(6)

    const abrirSeleccionProducto = () => {
        setFlujo({ paso: 'elegir_producto' })
    }

    const elegirProducto = (id: string) => {
        setCarrito((prev) => {
            if (prev.some((p) => p.id === id)) return prev
            return [...prev, { id, cantidad: 1 }]
        })
        setFlujo({ paso: 'cerrado' })
    }

    const cancelarFlujo = () => {
        setFlujo({ paso: 'cerrado' })
    }

    const aumentarCantidad = (id: string) => {
        setCarrito((prev) =>
            prev.map((p) => (p.id === id ? { ...p, cantidad: Math.min(99, p.cantidad + 1) } : p))
        )
    }

    const disminuirCantidad = (id: string) => {
        setCarrito((prev) =>
            prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p))
        )
    }

    const quitarProducto = (id: string) => {
        setCarrito((prev) => prev.filter((p) => p.id !== id))
    }

    const cambiarModo = (nuevoModo: Modo) => {
        setModo(nuevoModo)
        if (nuevoModo !== 'asistencia') {
            setCarrito([])
            setFlujo({ paso: 'cerrado' })
        }
    }

    const handleWizardNext = () => {
        if (pasoActual < 4) setPasoActual((p) => (p + 1) as PasoGuiado)
    }

    const reiniciarWizard = () => {
        setRespuestas({ tipoVivienda: null, habitaciones: null, automatizacion: null })
        setPasoActual(1)
    }

    const calcularEstimacion = () => {
        if (!respuestas.tipoVivienda) return 0
        const base = PRECIOS_BASE[respuestas.tipoVivienda]
        const multAmbientes = (respuestas.habitaciones ?? 1) * 0.5 + 0.5
        const multAuto = MULTIPLICADOR_AUTO[respuestas.automatizacion ?? 'basico']
        return base * multAmbientes * multAuto
    }

    const estimacionWizard = calcularEstimacion()

    const puedeAvanzar =
        (pasoActual === 1 && !!respuestas.tipoVivienda) ||
        (pasoActual === 2 && !!respuestas.habitaciones) ||
        (pasoActual === 3 && !!respuestas.automatizacion) ||
        pasoActual === 4

    const WIZARD_STEPS = [
        { n: 1 as PasoGuiado, label: t('calculator.stepType') },
        { n: 2 as PasoGuiado, label: t('calculator.stepRooms') },
        { n: 3 as PasoGuiado, label: t('calculator.stepLevel') },
        { n: 4 as PasoGuiado, label: t('calculator.stepResult') },
    ]

    const productosEnCarrito = new Set(carrito.map((p) => p.id))

    const todosLosProductos = data.productos

    const productosAgregados = data.productos.filter((p) => productosEnCarrito.has(p.id))

    const totalProductos = productosAgregados.reduce((sum, p) => {
        const item = carrito.find((c) => c.id === p.id)
        return sum + p.precio * (item?.cantidad ?? 1)
    }, 0)

    const costoSinDomotica = consumo * 1200
    const porcentajeAhorro = horas * 0.05
    const ahorroMensual = costoSinDomotica * porcentajeAhorro
    const inversionEstimada = habitaciones * 850000
    const mesesRecuperacion = ahorroMensual > 0 ? Math.ceil(inversionEstimada / ahorroMensual) : 0

    const formatPrecio = (valor: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor)

    return (
        <section className='calculadora' id='calculadora-precios'>
            <div className='calculadora-header'>
                <h2>{t('calculator.title')}</h2>
                <p>{t('calculator.subtitle')}</p>
            </div>

            <div className='calculadora-contenedor'>

                <div className='calculadora-toggle'>
                    <button
                        tabIndex={11}
                        className={`toggle-btn ${modo === 'asistencia' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('asistencia')}
                    >
                        {t('calculator.modeAssistance')}
                    </button>
                    <button
                        tabIndex={11}
                        className={`toggle-btn ${modo === 'productos' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('productos')}
                    >
                        {t('calculator.modeProducts')}
                    </button>
                    <button
                        tabIndex={11}
                        className={`toggle-btn ${modo === 'ahorro' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('ahorro')}
                    >
                        {t('calculator.modeSavings')}
                    </button>
                </div>

                {modo === 'asistencia' && (
                    <div className='wizard-container'>
                        <aside className='wizard-sidebar'>
                            <div className='wizard-sidebar-top'>
                                <h2 className='wizard-sidebar-title'>
                                    {t('calculator.wizardTitle1')}<br />
                                    {t('calculator.wizardTitle2')}<span>{t('calculator.wizardTitleSpan')}</span>
                                </h2>
                                <p className='wizard-sidebar-desc'>
                                    {t('calculator.wizardDesc')}
                                </p>
                            </div>

                            <nav className='wizard-nav'>
                                {WIZARD_STEPS.map((s) => (
                                    <div
                                        key={s.n}
                                        className={`wizard-nav-item ${pasoActual === s.n ? 'wizard-nav-item--active' : ''} ${pasoActual > s.n ? 'wizard-nav-item--done' : ''}`}
                                        onClick={() => pasoActual > s.n && setPasoActual(s.n)}
                                    >
                                        <span className='wizard-nav-number'>{pasoActual > s.n ? '✓' : s.n}</span>
                                        <span className='wizard-nav-label'>{s.label}</span>
                                    </div>
                                ))}
                            </nav>

                            <div className='wizard-sidebar-note'>
                                <span className='wizard-sidebar-note-icon'>🌱</span>
                                <p>{t('calculator.wizardNote')}</p>
                            </div>
                        </aside>

                        <main className='wizard-main'>
                            {pasoActual === 1 && (
                                <div className='wizard-step-content'>
                                    <h3 className='wizard-question'>{t('calculator.step1TitleStart')}<em>{t('calculator.step1TitleEm')}</em>{t('calculator.step1TitleEnd')}</h3>
                                    <p className='wizard-question-sub'>{t('calculator.step1Sub')}</p>
                                    <div className='wizard-options'>
                                        {VIVIENDA_OPTIONS.map((op) => (
                                            <button
                                                key={op.id}
                                                className={`wizard-option ${respuestas.tipoVivienda === op.id ? 'wizard-option--active' : ''}`}
                                                onClick={() => setRespuestas({ ...respuestas, tipoVivienda: op.id })}
                                            >
                                                {respuestas.tipoVivienda === op.id && <span className='wizard-option-check'>✓</span>}
                                                <span className='wizard-option-icon'>{op.icon}</span>
                                                <strong>{t(op.labelKey)}</strong>
                                                <p>{t(op.descKey)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pasoActual === 2 && (
                                <div className='wizard-step-content'>
                                    <h3 className='wizard-question'>{t('calculator.step2Title')}</h3>
                                    <p className='wizard-question-sub'>{t('calculator.step2Sub')}</p>
                                    <div className='wizard-options wizard-options--numbers'>
                                        {[1, 2, 3, 4, 5, 6].map((n) => (
                                            <button
                                                key={n}
                                                className={`wizard-option wizard-option--number ${respuestas.habitaciones === n ? 'wizard-option--active' : ''}`}
                                                onClick={() => setRespuestas({ ...respuestas, habitaciones: n })}
                                            >
                                                {respuestas.habitaciones === n && <span className='wizard-option-check'>✓</span>}
                                                <strong className='wizard-option-big-number'>{n}</strong>
                                                <p>{n === 1 ? t('calculator.roomSingular') : t('calculator.roomPlural')}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pasoActual === 3 && (
                                <div className='wizard-step-content'>
                                    <h3 className='wizard-question'>{t('calculator.step3Title')}</h3>
                                    <p className='wizard-question-sub'>{t('calculator.step3Sub')}</p>
                                    <div className='wizard-options'>
                                        {NIVEL_OPTIONS.map((op) => (
                                            <button
                                                key={op.id}
                                                className={`wizard-option ${respuestas.automatizacion === op.id ? 'wizard-option--active' : ''}`}
                                                onClick={() => setRespuestas({ ...respuestas, automatizacion: op.id })}
                                            >
                                                {respuestas.automatizacion === op.id && <span className='wizard-option-check'>✓</span>}
                                                <span className='wizard-option-icon'>{op.icon}</span>
                                                <strong>{t(op.labelKey)}</strong>
                                                <p>{t(op.descKey)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pasoActual === 4 && (
                                <div className='wizard-step-content wizard-result'>
                                    <h3 className='wizard-question'>{t('calculator.step4Title')}</h3>
                                    <p className='wizard-question-sub'>{t('calculator.step4Sub')}</p>
                                    <div className='wizard-result-card'>
                                        <span className='wizard-result-label'>{t('calculator.estimatedTotal')}</span>
                                        <span className='wizard-result-price'>{formatPrecio(estimacionWizard)}</span>
                                    </div>
                                    <div className='wizard-result-actions'>
                                        <a
                                            className='wizard-btn-whatsapp'
                                            href='https://wa.me/573014032120'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            {t('calculator.requestDetails')}
                                        </a>
                                        <button className='wizard-btn-reiniciar' onClick={reiniciarWizard}>
                                            {t('calculator.startOver')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {pasoActual < 4 && (
                                <div className='wizard-footer'>
                                    <button
                                        className='wizard-btn-next'
                                        disabled={!puedeAvanzar}
                                        onClick={handleWizardNext}
                                    >
                                        {t('calculator.nextStep')}
                                    </button>
                                </div>
                            )}
                        </main>

                        <aside className='wizard-summary'>
                            <div className='wizard-summary-card'>
                                <h4>{t('calculator.wizardSummaryTitle')}</h4>
                                <div className='wizard-summary-status'>
                                    <p className='wizard-summary-hint'>
                                        {estimacionWizard === 0 ? t('calculator.summaryNoSelection') : t('calculator.summaryCurrentSelection')}
                                    </p>
                                    <div className='wizard-summary-row'>
                                        <span>🏠 {t('calculator.summaryType')}</span>
                                        <span>{respuestas.tipoVivienda ? t(VIVIENDA_OPTIONS.find(o => o.id === respuestas.tipoVivienda)?.labelKey ?? '') : '—'}</span>
                                    </div>
                                    <div className='wizard-summary-row'>
                                        <span>🚪 {t('calculator.summaryRooms')}</span>
                                        <span>{respuestas.habitaciones ?? '—'}</span>
                                    </div>
                                    <div className='wizard-summary-row'>
                                        <span>⚡ {t('calculator.summaryLevel')}</span>
                                        <span>{respuestas.automatizacion ? t(NIVEL_OPTIONS.find(o => o.id === respuestas.automatizacion)?.labelKey ?? '') : '—'}</span>
                                    </div>
                                </div>

                                <div className='wizard-summary-estimation'>
                                    <span className='wizard-summary-est-label'>{t('calculator.summaryEstimation')}</span>
                                    <span className='wizard-summary-est-value'>{formatPrecio(estimacionWizard)}</span>
                                    {estimacionWizard === 0 && (
                                        <p className='wizard-summary-est-hint'>{t('calculator.summaryNoEstimation')}</p>
                                    )}
                                </div>
                            </div>

                            <div className='wizard-security-note'>
                                <span>✅</span> {t('calculator.summarySecureInfo')}
                            </div>
                        </aside>
                    </div>
                )}

                {modo !== 'asistencia' && (
                <div className='calculadora-body'>
                    <div className='calculadora-selector'>
                        {modo === 'productos' ? (
                            <>
                                {flujo.paso === 'cerrado' && (
                                    <button
                                        tabIndex={11}
                                        className='calc-dropdown-trigger'
                                        onClick={abrirSeleccionProducto}
                                    >
                                        <span>{t('calculator.addProduct')}</span>
                                        <span className='calc-dropdown-arrow'>▾</span>
                                    </button>
                                )}

                                {flujo.paso === 'elegir_producto' && (
                                    <div className='calc-flujo-panel'>
                                        <div className='calc-flujo-header'>
                                            <span className='calc-flujo-step-badge'>{t('calculator.step1')}</span>
                                            <span className='calc-flujo-title'>{t('calculator.selectProduct')}</span>
                                            <button tabIndex={11} className='calc-flujo-cerrar' onClick={cancelarFlujo} aria-label='Cerrar'>✕</button>
                                        </div>
                                        <div className='calc-dropdown-menu calc-dropdown-menu--open'>
                                            {todosLosProductos.length > 0 ? (
                                                todosLosProductos.map((prod) => {
                                                    const yaAgregado = productosEnCarrito.has(prod.id)
                                                    return (
                                                        <button
                                                            key={prod.id}
                                                            tabIndex={11}
                                                            className={`calc-dropdown-item ${yaAgregado ? 'calc-dropdown-item--en-carrito' : ''}`}
                                                            onClick={() => elegirProducto(prod.id)}
                                                        >
                                                            <span className='calc-dropdown-item-icon'>{prod.icon}</span>
                                                            <span className='calc-dropdown-item-info'>
                                                                <span className='calc-dropdown-item-name'>{t(prod.nombreKey)}</span>
                                                                <span className='calc-dropdown-item-desc'>{t(prod.descKey)}</span>
                                                            </span>
                                                            <div className='calc-dropdown-item-right'>
                                                                <span className='calc-dropdown-item-precio'>{formatPrecio(prod.precio)}</span>
                                                                {yaAgregado && (
                                                                    <span className='calc-item-badge-carrito'>
                                                                        ✓ ×{carrito.find((c) => c.id === prod.id)?.cantidad}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    )
                                                })
                                            ) : (
                                                <div className='calc-dropdown-empty'>{t('calculator.allAdded')}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {carrito.length > 0 && (
                                    <div className='calc-agregados'>
                                        {productosAgregados.map((prod) => {
                                            const item = carrito.find((c) => c.id === prod.id)!
                                            return (
                                                <div key={prod.id} className='calc-agregado-item'>
                                                    <span className='calc-agregado-icon'>{prod.icon}</span>
                                                    <span className='calc-agregado-nombre'>{t(prod.nombreKey)}</span>
                                                    <div className='calc-agregado-cantidad-controls'>
                                                        <button
                                                            className='calc-agregado-cantidad-btn'
                                                            tabIndex={11}
                                                            onClick={() => disminuirCantidad(prod.id)}
                                                            disabled={item.cantidad <= 1}
                                                            aria-label='Disminuir'
                                                        >
                                                            −
                                                        </button>
                                                        <span className='calc-agregado-cantidad-valor'>{item.cantidad}</span>
                                                        <button
                                                            className='calc-agregado-cantidad-btn'
                                                            tabIndex={11}
                                                            onClick={() => aumentarCantidad(prod.id)}
                                                            disabled={item.cantidad >= 99}
                                                            aria-label='Aumentar'
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span className='calc-agregado-precio'>
                                                        {formatPrecio(prod.precio * item.cantidad)}
                                                    </span>
                                                    <button
                                                        className='calc-agregado-quitar'
                                                        tabIndex={11}
                                                        onClick={() => quitarProducto(prod.id)}
                                                        aria-label={`Quitar ${t(prod.nombreKey)}`}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {carrito.length === 0 && flujo.paso === 'cerrado' && (
                                    <div className='calc-placeholder'>
                                        <span className='calc-placeholder-icon'>🛒</span>
                                        <p>{t('calculator.emptyMessage')}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className='calc-ahorro-config'>
                                <h3>{t('calculator.savingsConfigTitle')}</h3>

                                <div className='ahorro-slider-group'>
                                    <div className='ahorro-slider-header'>
                                        <label>{t('calculator.rooms')}</label>
                                        <span className='ahorro-slider-value'>{habitaciones}</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='1'
                                        max='10'
                                        value={habitaciones}
                                        onChange={(e) => setHabitaciones(Number(e.target.value))}
                                        className='ahorro-slider'
                                        style={{ '--progress': `${((habitaciones - 1) / 9) * 100}%` } as React.CSSProperties}
                                    />
                                </div>

                                <div className='ahorro-slider-group'>
                                    <div className='ahorro-slider-header'>
                                        <label>{t('calculator.currentConsumption')}</label>
                                        <span className='ahorro-slider-value'>{consumo} kWh</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='50'
                                        max='1000'
                                        step='10'
                                        value={consumo}
                                        onChange={(e) => setConsumo(Number(e.target.value))}
                                        className='ahorro-slider'
                                        style={{ '--progress': `${((consumo - 50) / 950) * 100}%` } as React.CSSProperties}
                                    />
                                </div>

                                <div className='ahorro-slider-group'>
                                    <div className='ahorro-slider-header'>
                                        <label>{t('calculator.lightingHours')}</label>
                                        <span className='ahorro-slider-value'>{horas} h</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='1'
                                        max='24'
                                        value={horas}
                                        onChange={(e) => setHoras(Number(e.target.value))}
                                        className='ahorro-slider'
                                        style={{ '--progress': `${((horas - 1) / 23) * 100}%` } as React.CSSProperties}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='calculadora-resumen'>
                        {modo === 'ahorro' ? (
                            <div className='resumen-ahorro-card'>
                                <h3>{t('calculator.savingsSummaryTitle')}</h3>

                                <div className='ahorro-resultado-box'>
                                    <p className='ahorro-resultado-label'>{t('calculator.monthlySavings')}</p>
                                    <p className='ahorro-resultado-valor'>
                                        {formatPrecio(ahorroMensual)}<span>{t('calculator.perMonth')}</span>
                                    </p>
                                    {trm && ahorroMensual > 0 && (
                                        <p className='ahorro-resultado-usd'>
                                            ≈ USD {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(ahorroMensual / trm)}{t('calculator.perMonth')}
                                        </p>
                                    )}
                                    <p className='ahorro-resultado-vs'>
                                        {t('calculator.vsCostWithoutDomotics')} {formatPrecio(costoSinDomotica)}{t('calculator.perMonth')}
                                    </p>
                                </div>

                                <div className='ahorro-resultado-box'>
                                    <p className='ahorro-resultado-label'>{t('calculator.estimatedInvestment')}</p>
                                    <p className='ahorro-resultado-valor'>
                                        {formatPrecio(inversionEstimada)}
                                    </p>
                                    {trm && (
                                        <p className='ahorro-resultado-usd'>
                                            ≈ USD {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(inversionEstimada / trm)}
                                        </p>
                                    )}
                                </div>

                                <div className='ahorro-meses-box'>
                                    <span className='ahorro-meses-icon'>⏱️</span>
                                    <div className='ahorro-meses-text'>
                                        <span className='ahorro-meses-numero'>{mesesRecuperacion} {t('calculator.monthsToRecover')}</span>
                                        <span className='ahorro-meses-desc'>{t('calculator.toRecoverInvestment')}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='resumen-card'>
                                <h3>{t('calculator.summaryTitle')}</h3>

                                {modo === 'productos' && productosAgregados.length > 0 && (
                                    <ul className='resumen-lista'>
                                        {productosAgregados.map((p) => {
                                            const item = carrito.find((c) => c.id === p.id)!
                                            return (
                                                <li key={p.id}>
                                                    <span>
                                                        {p.icon} {t(p.nombreKey)}
                                                        {item.cantidad > 1 && (
                                                            <span className='resumen-cantidad-badge'> ×{item.cantidad}</span>
                                                        )}
                                                    </span>
                                                    <span>{formatPrecio(p.precio * item.cantidad)}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}

                                {totalProductos === 0 && (
                                    <p className='resumen-vacio'>{t('calculator.emptyMessage')}</p>
                                )}

                                <div className='resumen-total'>
                                    <span>{t('calculator.total')}</span>
                                    <div className='resumen-total-precios'>
                                        <span className='resumen-total-precio'>
                                            {formatPrecio(totalProductos)}
                                        </span>
                                        {trm && totalProductos > 0 && (
                                            <span className='resumen-total-usd'>
                                                ≈ USD {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(totalProductos / trm)} {t('calculator.today')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className='resumen-nota'>{t('calculator.disclaimer')}</p>
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>

            {!trmError && (
                <div className='trm-widget'>
                    <div className='trm-widget-inner'>
                        <span className='trm-widget-label'>💱 {t('calculator.trmToday')}</span>
                        {trmLoading ? (
                            <span className='trm-widget-loading'>{t('calculator.loading')}</span>
                        ) : trm ? (
                            <>
                                <div className='trm-widget-rates'>
                                    <span className='trm-widget-rate'>
                                        1 USD = <strong>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(trm)}</strong>
                                    </span>
                                    <span className='trm-widget-sep'>·</span>
                                    <span className='trm-widget-rate'>
                                        1.000 COP ≈ <strong>USD {(1000 / trm).toFixed(4)}</strong>
                                    </span>
                                </div>
                                {fecha && <span className='trm-widget-fecha'>{t('calculator.trmDate', { date: fecha })}</span>}
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </section>
    )
}
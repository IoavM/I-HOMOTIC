import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './calculadora-precios.css'
import data from './productos.json'
import { useTRM } from '../../hooks/useTRM'

type Modo = 'productos' | 'paquetes' | 'ahorro'

// Producto en el carrito: id + cantidad
interface ProductoAgregado {
    id: string
    cantidad: number
}

// Estado del flujo de selección
type FlujoEstado =
    | { paso: 'cerrado' }
    | { paso: 'elegir_producto' }

export default function CalculadoraPrecios() {
    const { t } = useTranslation()
    const { trm, fecha, loading: trmLoading, error: trmError } = useTRM()
    const [modo, setModo] = useState<Modo>('productos')
    const [carrito, setCarrito] = useState<ProductoAgregado[]>([])
    const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<string | null>(null)
    const [flujo, setFlujo] = useState<FlujoEstado>({ paso: 'cerrado' })

    // Ahorro state
    const [habitaciones, setHabitaciones] = useState(3)
    const [consumo, setConsumo] = useState(280)
    const [horas, setHoras] = useState(6)

    // ── Flujo de selección ──

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

    const seleccionarPaquete = (id: string) => {
        setPaqueteSeleccionado((prev) => (prev === id ? null : id))
    }

    const cambiarModo = (nuevoModo: Modo) => {
        setModo(nuevoModo)
        setCarrito([])
        setPaqueteSeleccionado(null)
        setFlujo({ paso: 'cerrado' })
    }

    // Productos que ya están en el carrito (para mostrar badge)
    const productosEnCarrito = new Set(carrito.map((p) => p.id))

    // Todos los productos disponibles para elegir (incluyendo los ya agregados para editar cantidad)
    const todosLosProductos = data.productos

    const productosAgregados = data.productos.filter((p) => productosEnCarrito.has(p.id))

    const totalProductos = productosAgregados.reduce((sum, p) => {
        const item = carrito.find((c) => c.id === p.id)
        return sum + p.precio * (item?.cantidad ?? 1)
    }, 0)

    const paqueteActivo = data.paquetes.find((p) => p.id === paqueteSeleccionado)
    const totalFinal = modo === 'productos' ? totalProductos : (paqueteActivo?.precio ?? 0)

    // Ahorro logic
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
                        tabIndex={5}
                        className={`toggle-btn ${modo === 'productos' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('productos')}
                    >
                        {t('calculator.modeProducts')}
                    </button>
                    <button
                        tabIndex={5}
                        className={`toggle-btn ${modo === 'paquetes' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('paquetes')}
                    >
                        {t('calculator.modePackages')}
                    </button>
                    <button
                        tabIndex={5}
                        className={`toggle-btn ${modo === 'ahorro' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('ahorro')}
                    >
                        {t('calculator.modeSavings')}
                    </button>
                </div>

                <div className='calculadora-body'>
                    <div className='calculadora-selector'>
                        {modo === 'productos' ? (
                            <>
                                {/* ── Paso 1: Botón de apertura (flujo cerrado) ── */}
                                {flujo.paso === 'cerrado' && (
                                    <button
                                        tabIndex={5}
                                        className='calc-dropdown-trigger'
                                        onClick={abrirSeleccionProducto}
                                    >
                                        <span>{t('calculator.addProduct')}</span>
                                        <span className='calc-dropdown-arrow'>▾</span>
                                    </button>
                                )}

                                {/* ── Paso 1: Lista de productos para elegir ── */}
                                {flujo.paso === 'elegir_producto' && (
                                    <div className='calc-flujo-panel'>
                                        <div className='calc-flujo-header'>
                                            <span className='calc-flujo-step-badge'>{t('calculator.step1')}</span>
                                            <span className='calc-flujo-title'>{t('calculator.selectProduct')}</span>
                                            <button tabIndex={5} className='calc-flujo-cerrar' onClick={cancelarFlujo} aria-label='Cerrar'>✕</button>
                                        </div>
                                        <div className='calc-dropdown-menu calc-dropdown-menu--open'>
                                            {todosLosProductos.length > 0 ? (
                                                todosLosProductos.map((prod) => {
                                                    const yaAgregado = productosEnCarrito.has(prod.id)
                                                    return (
                                                        <button
                                                            key={prod.id}
                                                            tabIndex={5}
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


                                {/* Lista de productos agregados al carrito */}
                                {carrito.length > 0 && (
                                    <div className='calc-agregados'>
                                        {productosAgregados.map((prod) => {
                                            const item = carrito.find((c) => c.id === prod.id)!
                                            return (
                                                <div key={prod.id} className='calc-agregado-item'>
                                                    <span className='calc-agregado-icon'>{prod.icon}</span>
                                                    <span className='calc-agregado-nombre'>{t(prod.nombreKey)}</span>
                                                    {/* Controles de cantidad */}
                                                    <div className='calc-agregado-cantidad-controls'>
                                                        <button
                                                            className='calc-agregado-cantidad-btn'
                                                            tabIndex={5}
                                                            onClick={() => disminuirCantidad(prod.id)}
                                                            disabled={item.cantidad <= 1}
                                                            aria-label='Disminuir'
                                                        >
                                                            −
                                                        </button>
                                                        <span className='calc-agregado-cantidad-valor'>{item.cantidad}</span>
                                                        <button
                                                            className='calc-agregado-cantidad-btn'
                                                            tabIndex={5}
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
                                                        tabIndex={5}
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
                        ) : modo === 'paquetes' ? (
                            <div className='calc-paquetes'>
                                {data.paquetes.map((pkg) => {
                                    const activo = paqueteSeleccionado === pkg.id
                                    return (
                                        <button
                                            key={pkg.id}
                                            tabIndex={5}
                                            className={`calc-paquete-compact ${activo ? 'calc-paquete-compact-activo' : ''}`}
                                            onClick={() => seleccionarPaquete(pkg.id)}
                                        >
                                            <div className='calc-paquete-compact-top'>
                                                <span className='calc-paquete-compact-icon'>{pkg.icon}</span>
                                                <div className='calc-paquete-compact-info'>
                                                    <span className='calc-paquete-compact-nombre'>{t(pkg.nombreKey)}</span>
                                                    <span className='calc-paquete-compact-desc'>{t(pkg.descKey)}</span>
                                                </div>
                                                <span className='calc-paquete-compact-precio'>{formatPrecio(pkg.precio)}</span>
                                            </div>
                                            <div className='calc-paquete-compact-items'>
                                                {pkg.itemsKeys.map((key) => (
                                                    <span key={key} className='calc-paquete-compact-tag'>✓ {t(key)}</span>
                                                ))}
                                            </div>
                                            <div className='calc-paquete-compact-footer'>
                                                <span className='calc-paquete-compact-count'>
                                                    {pkg.itemsKeys.length} {t('calculator.productsIncluded')}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
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

                    {/* ── Tarjeta Resumen ── */}
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

                                {modo === 'paquetes' && paqueteActivo && (
                                    <div className='resumen-paquete'>
                                        <p className='resumen-pkg-nombre'>
                                            {paqueteActivo.icon} {t(paqueteActivo.nombreKey)}
                                        </p>
                                        <ul className='resumen-lista'>
                                            {paqueteActivo.itemsKeys.map((key) => (
                                                <li key={key}>
                                                    <span>✓ {t(key)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {totalFinal === 0 && (
                                    <p className='resumen-vacio'>{t('calculator.emptyMessage')}</p>
                                )}

                                <div className='resumen-total'>
                                    <span>{t('calculator.total')}</span>
                                    <div className='resumen-total-precios'>
                                        <span className='resumen-total-precio'>
                                            {formatPrecio(totalFinal)}
                                        </span>
                                        {trm && totalFinal > 0 && (
                                            <span className='resumen-total-usd'>
                                                ≈ USD {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(totalFinal / trm)} {t('calculator.today')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className='resumen-nota'>{t('calculator.disclaimer')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Widget TRM ── */}
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
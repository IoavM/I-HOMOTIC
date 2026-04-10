import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './calculadora-precios.css'
import data from './productos.json'

type Modo = 'productos' | 'paquetes' | 'ahorro'

export default function CalculadoraPrecios() {
    const { t } = useTranslation()
    const [modo, setModo] = useState<Modo>('productos')
    const [agregados, setAgregados] = useState<string[]>([])
    const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<string | null>(null)
    const [dropdownAbierto, setDropdownAbierto] = useState(false)

    // Ahorro state
    const [habitaciones, setHabitaciones] = useState(3)
    const [consumo, setConsumo] = useState(280)
    const [horas, setHoras] = useState(6)

    const agregarProducto = (id: string) => {
        if (!agregados.includes(id)) {
            setAgregados([...agregados, id])
        }
        setDropdownAbierto(false)
    }

    const quitarProducto = (id: string) => {
        setAgregados(agregados.filter((p) => p !== id))
    }

    const seleccionarPaquete = (id: string) => {
        setPaqueteSeleccionado((prev) => (prev === id ? null : id))
    }

    const cambiarModo = (nuevoModo: Modo) => {
        setModo(nuevoModo)
        setAgregados([])
        setPaqueteSeleccionado(null)
        setDropdownAbierto(false)
    }

    const productosDisponibles = data.productos.filter((p) => !agregados.includes(p.id))
    const productosAgregados = data.productos.filter((p) => agregados.includes(p.id))

    const totalProductos = productosAgregados.reduce((sum, p) => sum + p.precio, 0)
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
        <section className='calculadora'>
            <div className='calculadora-header'>
                <h2>{t('calculator.title')}</h2>
                <p>{t('calculator.subtitle')}</p>
            </div>

            <div className='calculadora-contenedor'>
                
                <div className='calculadora-toggle'>
                    <button
                        className={`toggle-btn ${modo === 'productos' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('productos')}
                    >
                        {t('calculator.modeProducts')}
                    </button>
                    <button
                        className={`toggle-btn ${modo === 'paquetes' ? 'toggle-activo' : ''}`}
                        onClick={() => cambiarModo('paquetes')}
                    >
                        {t('calculator.modePackages')}
                    </button>
                    <button
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
                                {/* Dropdown */}
                                <div className='calc-dropdown-wrapper'>
                                    <button
                                        className='calc-dropdown-trigger'
                                        onClick={() => setDropdownAbierto(!dropdownAbierto)}
                                    >
                                        <span>{t('calculator.addProduct')}</span>
                                        <span className={`calc-dropdown-arrow ${dropdownAbierto ? 'calc-arrow-up' : ''}`}>▾</span>
                                    </button>
                                    {dropdownAbierto && (
                                        <div className='calc-dropdown-menu'>
                                            {productosDisponibles.length > 0 ? (
                                                productosDisponibles.map((prod) => (
                                                    <button
                                                        key={prod.id}
                                                        className='calc-dropdown-item'
                                                        onClick={() => agregarProducto(prod.id)}
                                                    >
                                                        <span className='calc-dropdown-item-icon'>{prod.icon}</span>
                                                        <span className='calc-dropdown-item-info'>
                                                            <span className='calc-dropdown-item-name'>{t(prod.nombreKey)}</span>
                                                            <span className='calc-dropdown-item-desc'>{t(prod.descKey)}</span>
                                                        </span>
                                                        <span className='calc-dropdown-item-precio'>{formatPrecio(prod.precio)}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className='calc-dropdown-empty'>{t('calculator.allAdded')}</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Lista de agregados */}
                                {productosAgregados.length > 0 && (
                                    <div className='calc-agregados'>
                                        {productosAgregados.map((prod) => (
                                            <div key={prod.id} className='calc-agregado-item'>
                                                <span className='calc-agregado-icon'>{prod.icon}</span>
                                                <span className='calc-agregado-nombre'>{t(prod.nombreKey)}</span>
                                                <span className='calc-agregado-precio'>{formatPrecio(prod.precio)}</span>
                                                <button
                                                    className='calc-agregado-quitar'
                                                    onClick={() => quitarProducto(prod.id)}
                                                    aria-label={`Quitar ${t(prod.nombreKey)}`}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {productosAgregados.length === 0 && (
                                    <div className='calc-placeholder'>
                                        <span className='calc-placeholder-icon'>🛒</span>
                                        <p>{t('calculator.emptyMessage')}</p>
                                    </div>
                                )}
                            </>
                        ) : modo === 'paquetes' ? (
                            /* ── Paquetes con info ── */
                            <div className='calc-paquetes'>
                                {data.paquetes.map((pkg) => {
                                    const activo = paqueteSeleccionado === pkg.id
                                    return (
                                        <button
                                            key={pkg.id}
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
                            /* ── Ahorro Energético (Sliders) ── */
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
                                    <p className='ahorro-resultado-vs'>
                                        {t('calculator.vsCostWithoutDomotics')} {formatPrecio(costoSinDomotica)}{t('calculator.perMonth')}
                                    </p>
                                </div>

                                <div className='ahorro-resultado-box'>
                                    <p className='ahorro-resultado-label'>{t('calculator.estimatedInvestment')}</p>
                                    <p className='ahorro-resultado-valor'>
                                        {formatPrecio(inversionEstimada)}
                                    </p>
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
                                        {productosAgregados.map((p) => (
                                            <li key={p.id}>
                                                <span>{p.icon} {t(p.nombreKey)}</span>
                                                <span>{formatPrecio(p.precio)}</span>
                                            </li>
                                        ))}
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
                                    <span className='resumen-total-precio'>
                                        {formatPrecio(totalFinal)}
                                    </span>
                                </div>

                                <p className='resumen-nota'>{t('calculator.disclaimer')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

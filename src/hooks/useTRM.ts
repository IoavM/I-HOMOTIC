import { useEffect, useState } from 'react'

interface TRMResult {
  trm:     number | null
  fecha:   string | null
  loading: boolean
  error:   boolean
}

const CACHE_KEY      = 'ihomotic_trm'
const CACHE_DATE_KEY = 'ihomotic_trm_fecha'
const API_URL = 'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde DESC'

export function useTRM(): TRMResult {
  const [trm,     setTrm]     = useState<number | null>(null)
  const [fecha,   setFecha]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    const cached      = sessionStorage.getItem(CACHE_KEY)
    const cachedFecha = sessionStorage.getItem(CACHE_DATE_KEY)
    if (cached && cachedFecha) {
      setTrm(Number(cached))
      setFecha(cachedFecha)
      setLoading(false)
      return
    }

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const valor = Number(data[0]?.valor)
        const raw   = data[0]?.vigenciadesde as string | undefined
        if (!isNaN(valor) && valor > 0) {
          const fechaFormateada = raw
            ? new Date(raw).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
            : null
          sessionStorage.setItem(CACHE_KEY, String(valor))
          if (fechaFormateada) sessionStorage.setItem(CACHE_DATE_KEY, fechaFormateada)
          setTrm(valor)
          setFecha(fechaFormateada)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { trm, fecha, loading, error }
}
import { useState } from 'react'

const BASE = 'https://countriesnow.space/api/v0.1'

const COUNTRIES = ['Colombia', 'United States']

export function useAddress() {
  const countries = COUNTRIES
  const [states, setStates]       = useState<string[]>([])
  const [cities, setCities]       = useState<string[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const loadStates = async (country: string) => {
    setStates([])
    setCities([])
    if (!country) return
    setLoadingStates(true)
    try {
      const res  = await fetch(`${BASE}/countries/states`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ country }),
      })
      const data = await res.json()
      setStates((data.data.states as { name: string }[]).map(s => s.name))
    } catch {}
    setLoadingStates(false)
  }

  const loadCities = async (country: string, state: string) => {
    setCities([])
    if (!country || !state) return
    setLoadingCities(true)
    try {
      const res  = await fetch(`${BASE}/countries/state/cities`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ country, state }),
      })
      const data = await res.json()
      setCities(data.data as string[])
    } catch {}
    setLoadingCities(false)
  }

  return { countries, states, cities, loadingStates, loadingCities, loadStates, loadCities }
}
import * as React from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, alpha } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTranslation } from 'react-i18next'

const BLANCO = 'var(--color-blanco)'
const VERDE = 'var(--color-texto-oscuro)'
const VERDE_CLARO = 'var(--color-acento-primario)'
const NARANJA = 'var(--color-acento-secundario)'

const links = [
  { to: '/', key: 'navbar.home', tabIndex: -1 },
  { to: '/proyectos', key: 'navbar.projects', tabIndex: 2 },
  { to: '/servicios', key: 'navbar.servicios', tabIndex: 3 },
  { to: '/mapa', key: 'navbar.mapa', tabIndex: 4 },
  { to: '/nosotros', key: 'navbar.nosotros', tabIndex: 5 },
  { to: '/contacto', key: 'navbar.contacto', tabIndex: 6 },
]

// ─── Search Bar ───────────────────────────────────────────────────────────────
const SearchWrapper = styled('div')({
  position: 'relative',
  borderRadius: 999,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: `1.5px solid rgba(255, 255, 255, 0.2)`,
  display: 'flex',
  alignItems: 'center',
  transition: 'border-color 0.2s, background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&:focus-within': {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
})

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.2, 0, 1.5),
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  color: 'rgba(255, 255, 255, 0.8)',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#ffffff',
  fontSize: '0.9rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1rem',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.7, 1.5, 0.7, 0),
    width: '12ch',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 500,
    transition: theme.transitions.create('width'),
    '&::placeholder': { color: 'rgba(255, 255, 255, 0.6)', opacity: 1 },
    [theme.breakpoints.up('md')]: {
      width: '8ch', // Achicado para cualquier dispositivo menor a 1900px
      '&:focus': { width: '18ch' },
    },
    ['@media (min-width: 1900px)']: {
      width: '12ch', // En monitores muy grandes (1900px+) vuelve a su tamaño normal
      '&:focus': { width: '18ch' },
    },
  },
}))

// ─── Hook: scroll → fondo sólido ─────────────────────────────────────────────
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width:900px)')
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t, i18n } = useTranslation()
  const scrolled = useScrolled()

  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null)
  const langOpen = Boolean(langAnchor)

  const handleDrawerToggle = () => setMobileOpen((v) => !v)
  const closeDrawer = () => setMobileOpen(false)
  const openLangMenu = (e: React.MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget)
  const closeLangMenu = () => setLangAnchor(null)
  const selectLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    closeLangMenu()
    closeDrawer()
  }

  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en'
  const languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
  ]

  // ─── Búsqueda ────────────────────────────────────────────────────────────────
  const navigate = useNavigate()
  const searchRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState('')
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [activeIdx, setActiveIdx] = React.useState(-1)

  type SearchItem = {
    label: string
    sublabel: string
    to: string
    sectionId?: string
    category: 'page' | 'section' | 'element'
    keywords: string[]
  }

  const searchIndex: SearchItem[] = React.useMemo(() => [
    { label: t('navbar.home'), sublabel: t('navbar.sub_home'), to: '/', category: 'page', keywords: ['inicio', 'home', 'principal', 'bienvenida', 'landing'] },
    { label: t('navbar.servicios'), sublabel: t('navbar.sub_servicios'), to: '/servicios', category: 'page', keywords: ['servicios', 'services', 'domótica', 'oferta', 'soluciones'] },
    { label: t('navbar.nosotros'), sublabel: t('navbar.sub_nosotros'), to: '/nosotros', category: 'page', keywords: ['nosotros', 'about', 'equipo', 'empresa', 'team', 'historia', 'quiénes somos'] },
    { label: t('navbar.projects'), sublabel: t('navbar.sub_projects'), to: '/proyectos', category: 'page', keywords: ['proyectos', 'projects', 'obras', 'casos', 'portfolio'] },
    { label: t('navbar.mapa'), sublabel: t('navbar.sub_mapa'), to: '/mapa', category: 'page', keywords: ['mapa', 'map', '3d', 'visualizador', 'hogar', 'tour', 'habitaciones', 'casa'] },
    { label: t('navbar.contacto'), sublabel: t('navbar.sub_contacto'), to: '/contacto', category: 'page', keywords: ['contacto', 'contact', 'whatsapp', 'email', 'formulario', 'mensaje'] },
    { label: 'Hero — ' + t('hero.title'), sublabel: t('navbar.home'), to: '/', sectionId: 'hero', category: 'section', keywords: ['hero', 'banner', 'tecnología inteligente', 'smart technology', 'hogares sostenibles'] },
    { label: t('services.title'), sublabel: t('navbar.home'), to: '/', sectionId: 'home-servicios', category: 'section', keywords: ['servicios inicio', 'tarjetas servicios', 'our services', 'nuestros servicios'] },
    { label: t('projects.title') + ' — Inicio', sublabel: t('navbar.home'), to: '/', sectionId: 'home-proyectos', category: 'section', keywords: ['proyectos inicio', 'sección proyectos', 'our projects'] },
    { label: t('services.automationTitle'), sublabel: t('navbar.servicios'), to: '/servicios', sectionId: 'servicios-lista', category: 'element', keywords: ['automatización', 'automation', 'iot', 'inteligente', 'luces', 'control', 'hogar', 'home automation', 'plataforma'] },
    { label: t('services.lightingTitle'), sublabel: t('navbar.servicios'), to: '/servicios', sectionId: 'servicios-lista', category: 'element', keywords: ['iluminación', 'lighting', 'luz', 'led', 'lámparas', 'smart lighting', 'adaptativa'] },
    { label: t('services.securityTitle'), sublabel: t('navbar.servicios'), to: '/servicios', sectionId: 'servicios-lista', category: 'element', keywords: ['seguridad', 'security', 'cámara', 'cerradura', 'sensor', 'cctv', 'alarma', 'vigilancia', 'acceso'] },
    { label: t('servicios.PVTitle'), sublabel: t('navbar.servicios'), to: '/servicios', sectionId: 'propuesta-valor', category: 'section', keywords: ['por qué', 'propuesta', 'valor', 'why ihomotic', 'ventajas', 'beneficios'] },
    { label: t('servicios.callToAction'), sublabel: t('navbar.servicios'), to: '/servicios', sectionId: 'servicios-cta', category: 'section', keywords: ['transformar', 'asesoría', 'consulta', 'presupuesto', 'agendar', 'cta'] },
    { label: t('nosotros.aboutTitle'), sublabel: t('navbar.nosotros'), to: '/nosotros', sectionId: 'sobre-nosotros', category: 'section', keywords: ['sobre nosotros', 'about us', 'quiénes somos', 'empresa', 'descripción', 'misión'] },
    { label: t('nosotros.valuesTitle'), sublabel: t('navbar.nosotros'), to: '/nosotros', sectionId: 'sobre-nosotros', category: 'element', keywords: ['valores', 'values', 'innovación', 'sostenibilidad', 'calidad', 'atención'] },
    { label: t('nosotros.teamTitle'), sublabel: t('navbar.nosotros'), to: '/nosotros', sectionId: 'equipo', category: 'section', keywords: ['equipo', 'team', 'personas', 'integrantes', 'miembros', 'expertos', 'profesionales'] },
    { label: t('nosotros.projects'), sublabel: t('navbar.nosotros'), to: '/nosotros', sectionId: 'sobre-nosotros', category: 'element', keywords: ['proyectos realizados', 'estadísticas', 'datos', 'cifras', 'clientes', 'experiencia', 'ciudades'] },
    { label: t('projects.featuredTitle'), sublabel: t('navbar.projects'), to: '/proyectos', sectionId: 'proyecto-destacado', category: 'section', keywords: ['destacado', 'featured', 'llanogrande', 'penthouse', 'lujo', 'cine', 'dolby atmos', 'caso de éxito'] },
    { label: t('projects.otherProjects'), sublabel: t('navbar.projects'), to: '/proyectos', sectionId: 'otros-proyectos', category: 'section', keywords: ['otros proyectos', 'galería', 'portfolio', 'más proyectos'] },
    { label: t('projects.project1Title'), sublabel: t('navbar.projects'), to: '/proyectos', sectionId: 'otros-proyectos', category: 'element', keywords: ['eco', 'sostenible', 'solar', 'paneles', 'energía', 'villa eco'] },
    { label: t('projects.project2Title'), sublabel: t('navbar.projects'), to: '/proyectos', sectionId: 'otros-proyectos', category: 'element', keywords: ['smart norte', 'residencia', 'biométrico', '4k', 'security'] },
    { label: t('projects.project3Title'), sublabel: t('navbar.projects'), to: '/proyectos', sectionId: 'otros-proyectos', category: 'element', keywords: ['apartamento', 'connected', 'apartment', 'electrodomésticos', 'climatización'] },
    { label: t('calculator.title'), sublabel: t('navbar.projects'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'section', keywords: ['calculadora', 'precios', 'calculator', 'prices', 'cotizar', 'cotización', 'presupuesto', 'cuánto cuesta', 'cost'] },
    { label: t('calculator.prod_luces'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['luces led', 'iluminación inteligente', 'smart lighting', 'escenas'] },
    { label: t('calculator.prod_termostato'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['termostato', 'thermostat', 'climatización', 'temperatura', 'aire'] },
    { label: t('calculator.prod_camaras'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['cámaras', 'cameras', 'cctv', 'seguridad', 'vigilancia', 'visión nocturna'] },
    { label: t('calculator.prod_cerradura'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['cerradura', 'lock', 'acceso', 'biométrico', 'huella', 'fingerprint'] },
    { label: t('calculator.prod_asistente'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['asistente', 'voz', 'voice', 'alexa', 'google', 'siri', 'assistant'] },
    { label: t('calculator.prod_sensores'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['sensores', 'movimiento', 'motion', 'presencia', 'detector'] },
    { label: t('calculator.prod_persianas'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['persianas', 'cortinas', 'blinds', 'motorizada', 'automática'] },
    { label: t('calculator.prod_audio'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['audio', 'sonido', 'sound', 'altavoz', 'parlante', 'speaker', 'música', 'multi-zona'] },
    { label: t('calculator.pkg_basico'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['paquete básico', 'basic', 'starter', 'inicial'] },
    { label: t('calculator.pkg_premium'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['paquete premium', 'premium', 'completo', 'avanzado'] },
    { label: t('calculator.pkg_total'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['paquete total', 'total', 'definitivo', 'todo incluido'] },
    { label: t('calculator.modeSavings'), sublabel: t('calculator.title'), to: '/proyectos', sectionId: 'calculadora-precios', category: 'element', keywords: ['ahorro', 'savings', 'energía', 'energy', 'consumo', 'kwh', 'inversión'] },
    { label: t('contacto.locationTitle'), sublabel: t('navbar.contacto'), to: '/contacto', sectionId: 'contacto-info', category: 'element', keywords: ['ubicación', 'location', 'medellín', 'colombia', 'dirección', 'dónde'] },
    { label: t('contacto.emailTitle'), sublabel: t('navbar.contacto'), to: '/contacto', sectionId: 'contacto-info', category: 'element', keywords: ['correo', 'email', 'mail', 'contacto@ihomotic'] },
    { label: t('contacto.phoneTitle'), sublabel: t('navbar.contacto'), to: '/contacto', sectionId: 'contacto-info', category: 'element', keywords: ['teléfono', 'phone', 'llamar', 'cel', 'número', '301', 'whatsapp'] },
    { label: t('contacto.scheduleTitle'), sublabel: t('navbar.contacto'), to: '/contacto', sectionId: 'contacto-info', category: 'element', keywords: ['horario', 'schedule', 'horas', 'lunes', 'viernes', 'atención'] },
    { label: t('contacto.formTitle'), sublabel: t('navbar.contacto'), to: '/contacto', sectionId: 'formulario-contacto', category: 'section', keywords: ['formulario', 'form', 'mensaje', 'enviar', 'escribir', 'consulta'] },
    { label: t('mapa.rooms.sala'), sublabel: t('navbar.mapa'), to: '/mapa', category: 'element', keywords: ['sala', 'living', 'sofá', 'tv', 'sala de estar', 'iluminación led'] },
    { label: t('mapa.rooms.cocina'), sublabel: t('navbar.mapa'), to: '/mapa', category: 'element', keywords: ['cocina', 'kitchen', 'sensor gas', 'electrodomésticos', 'humo'] },
    { label: t('mapa.rooms.habitacion'), sublabel: t('navbar.mapa'), to: '/mapa', category: 'element', keywords: ['habitación', 'bedroom', 'dormitorio', 'climatización', 'persianas'] },
    { label: t('mapa.rooms.bano'), sublabel: t('navbar.mapa'), to: '/mapa', category: 'element', keywords: ['baño', 'bathroom', 'humedad', 'extractor', 'piso radiante'] },
    { label: t('mapa.rooms.entrada'), sublabel: t('navbar.mapa'), to: '/mapa', category: 'element', keywords: ['entrada', 'puerta', 'cerradura', 'cámara', 'videoportero', 'yale'] },
    { label: t('mapa.rooms.patio'), sublabel: t('navbar.mapa'), to: '/mapa', category: 'element', keywords: ['patio', 'jardín', 'garden', 'riego', 'exterior', 'perimetral'] },
  ], [t])

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const words = q.split(/\s+/)
    return searchIndex
      .filter(item =>
        words.every(w =>
          item.label.toLowerCase().includes(w) ||
          item.sublabel.toLowerCase().includes(w) ||
          item.keywords.some(k => k.includes(w))
        )
      )
      .slice(0, 8)
  }, [query, searchIndex])

  React.useEffect(() => { setActiveIdx(-1) }, [results])

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearchSelect = (item: SearchItem) => {
    const isAlreadyThere = location.pathname === item.to
    navigate(item.to)
    setQuery('')
    setSearchOpen(false)
    setActiveIdx(-1)
    if (item.sectionId) {
      const scrollTo = () => {
        const el = document.getElementById(item.sectionId!)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (isAlreadyThere) scrollTo()
      else setTimeout(scrollTo, 450)
    } else if (!isAlreadyThere) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSearchSelect(results[Math.max(activeIdx, 0)])
    } else if (e.key === 'Escape') {
      setQuery('')
      setSearchOpen(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: BLANCO }} role="presentation">
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          component={RouterLink}
          to="/"
          onClick={closeDrawer}
          sx={{
            textDecoration: 'none',
            color: VERDE_CLARO,
            fontWeight: 800,
            fontSize: '1.4rem',
            letterSpacing: 0.5,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          I-HOMOTIC
        </Typography>
        <IconButton onClick={closeDrawer} size="small" sx={{ color: VERDE }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: VERDE_CLARO, opacity: 0.3 }} />
      <List sx={{ py: 1.5, px: 1 }}>
        {links.map(({ to, key, tabIndex }) => {
          const active = location.pathname === to
          return (
            <ListItemButton
              key={to}
              component={RouterLink}
              to={to}
              tabIndex={tabIndex}
              onClick={closeDrawer}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                bgcolor: active ? VERDE_CLARO : 'transparent',
                color: active ? '#fff' : VERDE,
                '&:hover': {
                  bgcolor: active ? VERDE_CLARO : '#e8f1e5',
                  color: active ? '#fff' : VERDE_CLARO,
                },
              }}
            >
              <ListItemText
                primary={t(key)}
                primaryTypographyProps={{
                  fontWeight: active ? 700 : 500,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Divider sx={{ borderColor: VERDE_CLARO, opacity: 0.2, mx: 2 }} />
      <Box sx={{ px: 2, pt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={openLangMenu}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            borderRadius: '10px',
            borderColor: VERDE_CLARO,
            color: VERDE_CLARO,
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'none',
            fontWeight: 600,
            justifyContent: 'space-between',
            '&:hover': { borderColor: NARANJA, color: NARANJA, bgcolor: 'transparent' },
          }}
        >
          🌐 {currentLang.toUpperCase()}
        </Button>
      </Box>
    </Box>
  )

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'var(--color-texto-oscuro)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.25)' : 'none',
        transition: 'background-color 0.4s ease, box-shadow 0.4s ease, border-bottom 0.4s ease',
        zIndex: 1100,
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6, lg: 8 } }}>
        <Toolbar
          disableGutters
          sx={{ minHeight: { xs: 64, md: 72 } }}
        >
          {isMobile ? (
            <>
              <Typography
                component={RouterLink}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.45rem',
                  letterSpacing: 0.5,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                ihomotic
              </Typography>
              <IconButton
                aria-label="abrir menú"
                onClick={handleDrawerToggle}
                sx={{
                  color: '#ffffff',
                  border: `1.5px solid rgba(255, 255, 255, 0.3)`,
                  borderRadius: '10px',
                  p: '6px',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            // ── Desktop: grid 3 columnas ────────────────────────────────────
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* ── Columna 1: Logo — extremo izquierdo ─────────────────────── */}
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start' }}>
                <Typography
                  component={RouterLink}
                  to="/"
                  sx={{
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1.7rem',
                    letterSpacing: 0.5,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  ihomotic
                </Typography>
              </Box>

              {/* ── Columna 2: Links de navegación — centro exacto ────────────
                  Solo los links del menú. Buscador e idioma NO están aquí.     */}
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                {links.map(({ to, key, tabIndex }) => {
                  const active = location.pathname === to
                  const isContacto = to === '/contacto'
                  return (
                    <Button
                      key={to}
                      component={RouterLink}
                      to={to}
                      tabIndex={tabIndex}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: { md: '0.9rem', lg: '1rem', xl: '1.16rem' },
                        borderRadius: isContacto ? '8px' : (active ? '0' : '999px'),
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#ffffff',
                        bgcolor: isContacto ? VERDE_CLARO : 'transparent',
                        borderBottom: (!isContacto && active) ? `2px solid ${NARANJA}` : 'none',
                        paddingBottom: (!isContacto && active) ? '4px' : '6px',
                        px: 1.4,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          bgcolor: isContacto ? '#8ab351' : 'rgba(255,255,255,0.1)',
                          color: '#ffffff',
                        },
                      }}
                    >
                      {t(key)}
                    </Button>
                  )
                })}
              </Box>

              {/* ── Columna 3: Buscador + Idioma — extremo derecho ───────────
                  Elementos completamente independientes del menú de links.     */}
              <Box sx={{ display: 'flex', flex: 1, gap: 1.5, alignItems: 'center', justifyContent: 'flex-end' }}>

                {/* Buscador — elemento independiente */}
                <Box sx={{ position: 'relative' }} ref={searchRef}>
                  <SearchWrapper>
                    <SearchIconWrapper>
                      <SearchIcon fontSize="small" />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder={t('navbar.searchPlaceholder')}
                      inputProps={{ 'aria-label': 'buscar' }}
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSearchOpen(true) }}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => query && setSearchOpen(true)}
                    />
                  </SearchWrapper>
                  {searchOpen && results.length > 0 && (
                    <Paper
                      elevation={4}
                      sx={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        right: 0,
                        minWidth: 340,
                        maxHeight: 420,
                        overflowY: 'auto',
                        borderRadius: '14px',
                        zIndex: 1400,
                        boxShadow: '0 8px 32px rgba(5,31,25,0.16)',
                        py: 0.5,
                      }}
                    >
                      {results.map((r, idx) => (
                        <MenuItem
                          key={r.to + r.label + (r.sectionId || '')}
                          onClick={() => handleSearchSelect(r)}
                          selected={idx === activeIdx}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 0.3,
                            py: 1,
                            px: 2,
                            fontFamily: 'Montserrat, sans-serif',
                            color: VERDE,
                            '&:hover': { bgcolor: '#e8f1e5' },
                            '&.Mui-selected': { bgcolor: '#e8f1e5' },
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.label}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.48 }}>
                            {r.sectionId
                              ? `${r.sublabel} → ${r.sectionId.replace(/-/g, ' ')}`
                              : r.sublabel}
                          </span>
                        </MenuItem>
                      ))}
                    </Paper>
                  )}
                </Box>

                {/* Idioma — elemento independiente */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={openLangMenu}
                  endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                  sx={{
                    borderRadius: 999,
                    textTransform: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  🌐 {currentLang.toUpperCase()}
                </Button>

              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* ── Menú de idioma ──────────────────────────────────────────────────── */}
      <Menu
        anchorEl={langAnchor}
        open={langOpen}
        onClose={closeLangMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 180,
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(5,31,25,0.12)',
            },
          },
        }}
      >
        <Typography
          sx={{
            px: 2, py: 1,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: alpha('#081C35', 0.5),
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Cambiar idioma
        </Typography>
        <Divider sx={{ borderColor: alpha('#9BC462', 0.15) }} />
        {languages.map(({ code, label }) => (
          <MenuItem
            key={code}
            onClick={() => selectLanguage(code)}
            sx={{
              gap: 1,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: currentLang === code ? 700 : 400,
              color: VERDE,
              '&:hover': { bgcolor: '#e8f1e5' },
            }}
          >
            <Radio
              checked={currentLang === code}
              size="small"
              sx={{ p: 0, color: VERDE_CLARO, '&.Mui-checked': { color: VERDE_CLARO } }}
            />
            {label} — {code.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  )
}
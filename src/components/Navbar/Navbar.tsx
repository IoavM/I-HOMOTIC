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

const BLANCO        = '#f4f8f4'
const VERDE         = '#051F19'
const VERDE_CLARO   = '#0B5B46'
const NARANJA       = '#90AE2F'
const NARANJA_HOVER = '#7a9428'

const links = [
  { to: '/',           key: 'navbar.home'      },
  { to: '/servicios',  key: 'navbar.servicios' },
  { to: '/nosotros',   key: 'navbar.nosotros'  },
  { to: '/proyectos',  key: 'navbar.projects'  },
  { to: '/mapa',       key: 'navbar.mapa'      },
  { to: '/contacto',   key: 'navbar.contacto'  },
]

// ─── Search Bar ───────────────────────────────────────────────────────────────

// CORREGIDO: eliminado el parámetro 'theme' que no se usaba
const SearchWrapper = styled('div')({
  position:        'relative',
  borderRadius:    999,
  backgroundColor: alpha(VERDE_CLARO, 0.08),
  border:          `1.5px solid ${alpha(VERDE_CLARO, 0.25)}`,
  display:         'flex',
  alignItems:      'center',
  transition:      'border-color 0.2s, background-color 0.2s',
  '&:hover': {
    backgroundColor: alpha(VERDE_CLARO, 0.13),
    borderColor:     alpha(VERDE_CLARO, 0.5),
  },
  '&:focus-within': {
    borderColor:     VERDE_CLARO,
    backgroundColor: alpha(VERDE_CLARO, 0.06),
  },
})

// Este SÍ usa 'theme', así que se mantiene
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding:       theme.spacing(0, 1.2, 0, 1.5),
  pointerEvents: 'none',
  display:       'flex',
  alignItems:    'center',
  color:         alpha(VERDE_CLARO, 0.7),
}))

// Este SÍ usa 'theme', así que se mantiene
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color:    VERDE,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    padding:    theme.spacing(0.7, 1.5, 0.7, 0),
    width:      '14ch',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 500,
    transition: theme.transitions.create('width'),
    '&::placeholder': { color: alpha(VERDE, 0.45), opacity: 1 },
    [theme.breakpoints.up('md')]: {
      '&:focus': { width: '20ch' },
    },
  },
}))

// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width:900px)')
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t, i18n } = useTranslation()

  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null)
  const langOpen = Boolean(langAnchor)

  const handleDrawerToggle  = () => setMobileOpen((v) => !v)
  const closeDrawer         = () => setMobileOpen(false)
  const openLangMenu        = (e: React.MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget)
  const closeLangMenu       = () => setLangAnchor(null)
  const selectLanguage      = (lang: string) => {
    i18n.changeLanguage(lang)
    closeLangMenu()
    closeDrawer()
  }

  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en'

  const languages = [
    { code: 'es', label: 'español' },
    { code: 'en', label: 'English' },
  ]

  // ─── Búsqueda ────────────────────────────────────────────────────────────────
  const navigate   = useNavigate()
  const searchRef  = React.useRef<HTMLDivElement>(null)
  const [query, setQuery]           = React.useState('')
  const [searchOpen, setSearchOpen] = React.useState(false)

  const searchIndex = React.useMemo(() => [
    { label: t('navbar.home'),              sublabel: '/',           to: '/',          keywords: ['inicio', 'home', 'principal', 'bienvenida'] },
    { label: t('navbar.servicios'),         sublabel: '/servicios',  to: '/servicios', keywords: ['servicios', 'services', 'domótica', 'oferta'] },
    { label: t('services.automationTitle'), sublabel: t('navbar.servicios'), to: '/servicios', keywords: ['automatización', 'automation', 'iot', 'inteligente', 'luces', 'control'] },
    { label: t('services.lightingTitle'),   sublabel: t('navbar.servicios'), to: '/servicios', keywords: ['iluminación', 'lighting', 'luz', 'led', 'lámparas'] },
    { label: t('services.securityTitle'),   sublabel: t('navbar.servicios'), to: '/servicios', keywords: ['seguridad', 'security', 'cámara', 'cerradura', 'sensor'] },
    { label: t('navbar.nosotros'),          sublabel: '/nosotros',   to: '/nosotros',  keywords: ['nosotros', 'about', 'equipo', 'empresa', 'team', 'historia'] },
    { label: t('navbar.projects'),          sublabel: '/proyectos',  to: '/proyectos', keywords: ['proyectos', 'projects', 'obras', 'casos', 'calculadora', 'precios'] },
    { label: t('navbar.mapa'),              sublabel: '/mapa',       to: '/mapa',      keywords: ['mapa', 'map', '3d', 'visualizador', 'hogar', 'tour', 'habitaciones'] },
    { label: t('navbar.contacto'),          sublabel: '/contacto',   to: '/contacto',  keywords: ['contacto', 'contact', 'whatsapp', 'email', 'formulario', 'mensaje'] },
  ], [t])

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchIndex
      .filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.some(k => k.includes(q))
      )
      .slice(0, 5)
  }, [query, searchIndex])

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearchSelect = (to: string) => {
    navigate(to)
    setQuery('')
    setSearchOpen(false)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) handleSearchSelect(results[0].to)
    if (e.key === 'Escape') { setQuery(''); setSearchOpen(false) }
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
            color:          VERDE_CLARO,
            fontWeight:     800,
            fontSize:       '1.3rem',
            letterSpacing:  0.5,
            fontFamily:     'Montserrat, sans-serif',
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
        {links.map(({ to, key }) => {
          const active = location.pathname === to
          return (
            <ListItemButton
              key={to}
              component={RouterLink}
              to={to}
              onClick={closeDrawer}
              sx={{
                borderRadius: '10px',
                mb:      0.5,
                bgcolor: active ? VERDE_CLARO  : 'transparent',
                color:   active ? '#fff'        : VERDE,
                '&:hover': {
                  bgcolor: active ? VERDE_CLARO : '#e8f1e5',
                  color:   active ? '#fff'      : VERDE_CLARO,
                },
              }}
            >
              <ListItemText
                primary={t(key)}
                primaryTypographyProps={{
                  fontWeight: active ? 700 : 500,
                  fontFamily: 'Montserrat, sans-serif',
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
            borderRadius:  '10px',
            borderColor:   VERDE_CLARO,
            color:         VERDE_CLARO,
            fontFamily:    'Montserrat, sans-serif',
            textTransform: 'none',
            fontWeight:    600,
            justifyContent: 'space-between',
            '&:hover': {
              borderColor: NARANJA,
              color:       NARANJA,
              bgcolor:     'transparent',
            },
          }}
        >
          🌐 {currentLang.toUpperCase()}
        </Button>
      </Box>
    </Box>
  )

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor:      BLANCO,
        borderBottom: `1px solid ${VERDE_CLARO}33`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, minHeight: 72 }}>
          {isMobile ? (
            <>
              <Typography
                component={RouterLink}
                to="/"
                sx={{
                  flexGrow:       1,
                  textDecoration: 'none',
                  color:          VERDE_CLARO,
                  fontWeight:     800,
                  fontSize:       '1.3rem',
                  letterSpacing:  0.5,
                  fontFamily:     'Montserrat, sans-serif',
                }}
              >
                I-HOMOTIC
              </Typography>
              <IconButton
                aria-label="abrir menú"
                onClick={handleDrawerToggle}
                sx={{
                  color:        VERDE,
                  border:       `1.5px solid ${VERDE_CLARO}55`,
                  borderRadius: '10px',
                  p:            '6px',
                  '&:hover': { bgcolor: '#e8f1e5' },
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
            <>
              <Typography
                component={RouterLink}
                to="/"
                variant="h6"
                sx={{
                  textDecoration: 'none',
                  color:          VERDE_CLARO,
                  fontWeight:     800,
                  letterSpacing:  0.5,
                  mr:             3,
                  fontFamily:     'Montserrat, sans-serif',
                }}
              >
                I-HOMOTIC
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
                {links.map(({ to, key }) => {
                  const active = location.pathname === to
                  return (
                    <Button
                      key={to}
                      component={RouterLink}
                      to={to}
                      sx={{
                        textTransform: 'none',
                        fontWeight:    700,
                        borderRadius:  999,
                        fontFamily:    'Montserrat, sans-serif',
                        color:         active ? '#fff'      : VERDE,
                        bgcolor:       active ? VERDE_CLARO : 'transparent',
                        '&:hover': {
                          bgcolor: active ? VERDE_CLARO : '#e8f1e5',
                          color:   active ? '#fff'      : VERDE_CLARO,
                        },
                      }}
                    >
                      {t(key)}
                    </Button>
                  )
                })}

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
                        left: 0,
                        right: 0,
                        minWidth: 240,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        zIndex: 1400,
                        boxShadow: '0 8px 24px rgba(5,31,25,0.14)',
                      }}
                    >
                      {results.map((r) => (
                        <MenuItem
                          key={r.to + r.label}
                          onClick={() => handleSearchSelect(r.to)}
                          sx={{
                            display:    'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap:        0.2,
                            py:         1,
                            fontFamily: 'Montserrat, sans-serif',
                            color:      VERDE,
                            '&:hover':  { bgcolor: '#e8f1e5' },
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.label}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{r.sublabel}</span>
                        </MenuItem>
                      ))}
                    </Paper>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={openLangMenu}
                  endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                  sx={{
                    borderRadius:  999,
                    textTransform: 'none',
                    fontFamily:    'Montserrat, sans-serif',
                    fontWeight:    600,
                    borderColor:   VERDE_CLARO,
                    color:         VERDE_CLARO,
                    gap:           0.5,
                    '&:hover': {
                      borderColor: NARANJA_HOVER,
                      color:       NARANJA_HOVER,
                      bgcolor:     'transparent',
                    },
                  }}
                >
                  🌐 {currentLang.toUpperCase()}
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
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
            color: alpha(VERDE, 0.5),
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Cambiar idioma
        </Typography>
        <Divider sx={{ borderColor: alpha(VERDE_CLARO, 0.15) }} />
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
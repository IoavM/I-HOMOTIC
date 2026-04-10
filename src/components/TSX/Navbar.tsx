import * as React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
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
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, alpha, useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

const BLANCO        = '#f9fbf8'
const VERDE         = '#2d3a2d'
const VERDE_CLARO   = '#4c7b45'
const NARANJA       = '#E8721A'
const NARANJA_HOVER = '#F07F2A'

const links = [
  { to: '/',          key: 'navbar.home'     },
  { to: '/nosotros', key: 'navbar.nosotros' },
  { to: '/proyectos', key: 'navbar.projects' },
  { to: '/contacto', key: 'navbar.contacto' },
  { to: '/mapa', key: 'navbar.mapa' },
]

// ─── Search Bar (estilos propios, no toca nada del navbar) ───────────────────

const SearchWrapper = styled('div')(({ theme }) => ({
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
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding:       theme.spacing(0, 1.2, 0, 1.5),
  pointerEvents: 'none',
  display:       'flex',
  alignItems:    'center',
  color:         alpha(VERDE_CLARO, 0.7),
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color:    VERDE,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    padding:    theme.spacing(0.7, 1.5, 0.7, 0),
    width:      '14ch',
    fontFamily: 'Sora, sans-serif',
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
  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t, i18n } = useTranslation()

  const handleDrawerToggle = () => setMobileOpen((v) => !v)
  const closeDrawer        = ()  => setMobileOpen(false)
  const toggleLanguage     = ()  => {
    i18n.changeLanguage(i18n.language.startsWith('es') ? 'en' : 'es')
  }

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
            fontFamily:     'Sora, sans-serif',
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
                  fontFamily: 'Sora, sans-serif',
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
          onClick={() => { toggleLanguage(); closeDrawer() }}
          sx={{
            borderRadius:  '10px',
            borderColor:   VERDE_CLARO,
            color:         VERDE_CLARO,
            fontFamily:    'Sora, sans-serif',
            textTransform: 'none',
            fontWeight:    600,
            '&:hover': {
              borderColor: NARANJA,
              color:       NARANJA,
              bgcolor:     'transparent',
            },
          }}
        >
          {i18n.language.startsWith('es') ? '🌐 English' : '🌐 Español'}
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
                  fontFamily:     'Sora, sans-serif',
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
                  fontFamily:     'Sora, sans-serif',
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
                        fontFamily:    'Sora, sans-serif',
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

                {/* ── Buscador ── */}
                <SearchWrapper>
                  <SearchIconWrapper>
                    <SearchIcon fontSize="small" />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Buscar…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </SearchWrapper>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={toggleLanguage}
                  sx={{
                    borderRadius:  999,
                    textTransform: 'none',
                    fontFamily:    'Sora, sans-serif',
                    fontWeight:    600,
                    borderColor:   VERDE_CLARO,
                    color:         VERDE_CLARO,
                    '&:hover': {
                      borderColor: NARANJA_HOVER,
                      color:       NARANJA_HOVER,
                      bgcolor:     'transparent',
                    },
                  }}
                >
                  {i18n.language.startsWith('es') ? 'EN' : 'ES'}
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
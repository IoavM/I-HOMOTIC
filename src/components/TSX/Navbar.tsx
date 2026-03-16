import * as React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { useTranslation } from 'react-i18next'

const links = [
  { to: '/', key: 'navbar.home' },
  { to: '/servicios', key: 'navbar.services' },
  { to: '/proyectos', key: 'navbar.projects' },
]

export default function Navbar() {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t, i18n } = useTranslation()

  const handleDrawerToggle = () => setMobileOpen((v) => !v)
  const closeDrawer = () => setMobileOpen(false)

  const toggleLanguage = () => {
    const next = i18n.language.startsWith('es') ? 'en' : 'es'
    i18n.changeLanguage(next)
  }

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={closeDrawer}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 800,
            letterSpacing: 0.5,
          }}
          variant="h6"
        >
          I-HOMOTIC
        </Typography>
      </Box>
      <Divider />
      <List sx={{ py: 1 }}>
        {links.map(({ to, key }) => (
          <ListItemButton
            key={to}
            component={RouterLink}
            to={to}
            selected={location.pathname === to}
          >
            <ListItemText primary={t(key)} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, minHeight: 72 }}>
          {isMobile ? (
            <>
              <IconButton
                aria-label="open navigation menu"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component={RouterLink}
                to="/"
                variant="h6"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'text.primary',
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                I-HOMOTIC
              </Typography>
              <Drawer
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
                  color: 'text.primary',
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  mr: 3,
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
                      variant={active ? 'contained' : 'text'}
                      color={active ? 'success' : 'inherit'}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 999,
                      }}
                    >
                      {t(key)}
                    </Button>
                  )
                })}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={toggleLanguage}
                  sx={{ borderRadius: 999, textTransform: 'none' }}
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
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './Styles/Global.css'
import './i18n'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Navbar from './components/TSX/Navbar.tsx'
import Footer from './components/TSX/Footer.tsx'
import Home from './Pages/Home.tsx'
import Servicios from './Pages/Servicios.tsx'
import Proyectos from './Pages/Proyectos.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2D6A2E' },
    secondary: { main: '#E8721A' },
    success: { main: '#2D6A2E' },
    background: { default: '#f9fbf8', paper: '#ffffff' },
    text: { primary: '#2d3a2d' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Sora', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    button: { fontWeight: 700 },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <ScrollToTop />
          <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, md: 3 } }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/proyectos" element={<Proyectos />} />
              </Routes>
            </Container>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)

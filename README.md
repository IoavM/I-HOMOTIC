# I-HOMOTIC

I-HOMOTIC es una plataforma web interactiva de domótica colombiana que permite a propietarios y empresas simular y presupuestar la automatización de sus espacios. Resuelve la falta de visualización previa en proyectos inteligentes ofreciendo un visualizador interactivo 3D del hogar y una calculadora de presoupuesto y ahorro energético con amortización de la inversión.

---

## Tabla de contenidos
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue](#despliegue)
- [Contribución](#contribución)
- [Roadmap](#roadmap)
- [Autores](#autores)
- [Licencia](#licencia)

---

## Características

- **Visualizador interactivo 3D:** Renderizado tridimensional de una vivienda desarrollado con Three.js y React Three Fiber. Permite orbitar, realizar zoom, alternar entre modos Día y Noche, y hacer clic en áreas (Sala, Cocina, Habitación, Baño, Entrada, Patio) para visualizar los dispositivos instalados y simular escenas luminosas en tiempo real.
- **Calculadora de presupuesto en 4 pasos:** Asistente secuencial para estimar el costo de instalación según el tipo de propiedad (Casa, Departamento u Oficina), cantidad de ambientes y nivel de domótica seleccionado (Esencial, Confort o Premium).
- **Estimador de ahorro energético y ROI:** Lógica de cálculo que determina el ahorro mensual aproximado en dinero basándose en el consumo eléctrico actual (kWh/mes) y horas de luz diarias, estimando el tiempo de amortización.
- **Internacionalización completa (ES/EN):** Soporte bilingüe total implementado con i18next y react-i18next con selector rápido en la barra de navegación.
- **Analíticas cualitativas integradas:** Incorporación de SDKs de Hotjar y Microsoft Clarity para realizar seguimiento del comportamiento del usuario mediante mapas de calor y grabaciones de sesión.
- **Formulario y geo-selectores dinámicos:** Formulario de contacto con selector de ubicación jerárquico de Colombia (País, Departamento, Ciudad) e integración de contacto directo vía WhatsApp y correo electrónico.

---

## Tecnologías

- **Frontend:** React 19, TypeScript, Vite, React Router DOM v7.
- **Gráficos 3D:** Three.js, React Three Fiber (R3F), @react-three/drei (OrbitControls).
- **Estilos y animación:** Vanilla CSS, Framer Motion, Material UI Icons.
- **Herramientas de análisis:**  Microsoft Clarity SDK.
- **Librerías de soporte:** i18next, react-i18next (traducciones), SweetAlert2 (alertas interactivas).

---

## Requisitos previos

- Node.js (versión 18.x o superior recomendada).
- npm (versión 9.x o superior recomendada).

---

## Instalación

```bash
# 1) Clonar el repositorio
git clone [url-del-repo]

# 2) Entrar al proyecto
cd I-homotic

# 3) Instalar dependencias
npm install
```

---

## Ejecución

Para iniciar la aplicación en el entorno local de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible de forma predeterminada en: [http://localhost:5173](http://localhost:5173)

---

## Scripts disponibles

- `npm run dev`: Levanta el entorno de desarrollo local.
- `npm run build`: Compila los archivos TypeScript y genera el empaquetado de producción optimizado en `/dist`.
- `npm run preview`: Previsualiza localmente el build de producción generado.
- `npm run lint`: Ejecuta ESLint para comprobar errores de estilo y formato en el código.

---

## Estructura del proyecto

```text
.
├── public/                 # Recursos estáticos públicos (Favicon, Logo)
├── src/                    # Código fuente principal
│   ├── assets/             # Imágenes optimizadas (.webp) y mapeo de importaciones (imagenes.ts)
│   ├── components/         # Componentes reutilizables
│   │   ├── Footer/         # Pie de página con enlaces multilingües
│   │   ├── Navbar/         # Navegación con selector de idioma
│   │   ├── ScrollToTop.tsx # Reseteo de scroll al cambiar de página
│   │   ├── ScrollToTopButton/ # Botón flotante para regresar arriba
│   │   ├── Tarjetas2/      # Tarjetas de visualización de datos
│   │   ├── TarjetasPV/     # Tarjetas de propuesta de valor
│   │   ├── calculadora-precios/ # Componentes de cálculo de presupuestos
│   │   ├── contacto-formulario/ # Formulario con selectores de ubicación
│   │   ├── cta-home/       # Componentes de llamado a la acción
│   │   ├── grid-datos/     # Grid para estadísticas
│   │   ├── hero-conImagen/ # Banners configurables para cabeceras
│   │   ├── pagina-proyectos/ # Vista para el detalle individual de cada proyecto
│   │   └── ventajas/       # Tarjetas descriptivas de las ventajas de domótica
│   ├── hooks/              # Hooks de React personalizados
│   │   ├── useAddress.ts   # Carga y selección de países, departamentos y ciudades
│   │   └── useTRM.ts       # Consumo asíncrono de la TRM desde datos.gov.co
│   ├── Pages/              # Vistas o páginas principales
│   │   ├── Calculadora.tsx # Página de cotización interactiva y ahorro de energía
│   │   ├── Contacto.tsx    # Página de contacto
│   │   ├── Home.tsx        # Página de inicio
│   │   ├── Mapa.tsx        # Visualizador interactivo 3D (Three.js)
│   │   ├── Nosotros.tsx    # Sección informativa del equipo y la empresa
│   │   └── Proyectos.tsx   # Galería filtrable de proyectos
│   ├── Styles/             # Hojas de estilo estructuradas en Vanilla CSS
│   │   ├── Global.css      # Reglas globales, tipografías y variables de colores
│   │   └── [Modulos].css   # Estilos particulares por página y componente
│   ├── i18n.ts             # Configuración de traducción multilingüe (ES / EN)
│   └── main.tsx            # Enrutador e inicio de la aplicación
├── eslint.config.js        # Configuración de validaciones estéticas de ESLint
├── index.html              # Plantilla base HTML del portal
├── package.json            # Scripts de ejecución y lista de dependencias
├── tsconfig.json           # Configuración del compilador TypeScript
└── vercel.json             # Reglas de redirección de rutas para SPA en Vercel
```

---

## Variables de entorno

El portal puede configurarse con variables de entorno para externalizar claves en producción. Crea un archivo `.env` en la raíz de `I-homotic`:

```bash
cp .env.example .env
```

Define las siguientes variables según corresponda:

```env
VITE_HOTJAR_ID=798296
VITE_HOTJAR_SNIPPET_VERSION=6
VITE_CLARITY_ID=wm5lgd3493
VITE_TRM_API_URL=https://www.datos.gov.co/resource/32sa-8pi3.json
```

---

## Despliegue

1. Generar la compilación optimizada:
   ```bash
   npm run build
   ```
2. Subir el directorio de salida (`/dist`) al proveedor de hosting (ej. Vercel, Netlify).
3. Configurar las variables de entorno necesarias en el panel del servidor. El archivo `vercel.json` ya incluye las reglas necesarias para redirigir las rutas estáticas al `index.html`.

---

## Contribución

1. Crear una rama desde `main` (`git checkout -b feature/nombre-mejora`).
2. Implementar los cambios y realizar commits descriptivos.
3. Abrir un Pull Request detallando los ajustes aplicados y el entorno probado.

---

## Roadmap

- [ ] Optimizar mallas en Three.js para mejorar el rendimiento de carga y fotogramas en móviles.
- [ ] Implementar un portal privado de usuario para el monitoreo de consumos reales.
- [ ] Integrar pasarela de pago para reserva directa de paquetes domóticos desde la calculadora.
- [ ] Incorporar compatibilidad de voz en el navegador para simular el control del visualizador 3D.

---

## Autores

### Programación Front-End
- **Ioav Mizrachi Muñoz** - Programador Front-end Principal
- **Juan Camilo Bolaños García** - Programador Front-end
- **Laura Ortiz Caballero** - Programadora Front-end

### Diseñadores UX/UI
- **Ioav Mizrachi Muñoz** - Diseñador UX/UI
- **Laura Vanessa Ruiz Álvarez** - Diseñadora UX/UI
- **Sofía Lezcano Sanchez** - Diseñadora UX/UI
- **Andrea Rivas Martinez** - Diseñadora UX/UI
- **Laura Ortiz Caballero** - Diseñadora UX/UI

---

## Licencia

Este proyecto está bajo la licencia [MIT]. Consulta el archivo LICENSE para más detalles.

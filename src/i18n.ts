import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  es: {
    translation: {
      navbar: {
        home: 'Inicio',
        services: 'Servicios',
        projects: 'Proyectos',
      },
      hero: {
        title: 'Tecnología inteligente',
        subtitle: 'para hogares sostenibles',
        description:
          'Transformamos espacios con automatización avanzada, eficiencia energética y soluciones IoT de última generación para un estilo de vida más cómodo y sostenible.',
        contact: 'Contáctanos',
        messageSent: 'Tu mensaje ha sido enviado',
      },
      services: {
        title: 'Nuestros Servicios',
        description:
          'Soluciones integrales de domótica para hogares y empresas, diseñadas para maximizar la eficiencia y el confort.',
        automationTitle: 'Automatización del Hogar',
        automationDescription:
          'Controla todos los sistemas de tu hogar desde una sola plataforma. Iluminación, climatización, persianas y electrodomésticos integrados de forma inteligente.',
        lightingTitle: 'Iluminación Inteligente',
        lightingDescription:
          'Sistemas de iluminación adaptativos que ajustan intensidad y color según la hora del día, presencia y preferencias personales para máximo confort.',
        securityTitle: 'Seguridad y CCTV',
        securityDescription:
          'Vigilancia 24/7 con cámaras HD, sensores de movimiento, alarmas inteligentes y control de acceso remoto para la tranquilidad de tu familia.',
      },
      projects: {
        title: 'Nuestros Proyectos',
        subtitle:
          'Descubre cómo hemos transformado espacios con soluciones de domótica inteligente.',
        villaTitle: 'Smart Villa North',
        villaDescription:
          'Automatización completa de villa de lujo con control de iluminación, climatización y seguridad integrada.',
        hqTitle: 'Corporate HQ Automation',
        hqDescription:
          'Sistema integral de gestión de edificio inteligente con eficiencia energética y control de acceso avanzado.',
        viewProject: 'Ver Proyecto',
      },
    },
  },
  en: {
    translation: {
      navbar: {
        home: 'Home',
        services: 'Services',
        projects: 'Projects',
      },
      hero: {
        title: 'Smart technology',
        subtitle: 'for sustainable homes',
        description:
          'We transform spaces with advanced automation, energy efficiency, and cutting-edge IoT solutions for a more comfortable and sustainable lifestyle.',
        contact: 'Contact us',
        messageSent: 'Your message has been sent',
      },
      services: {
        title: 'Our Services',
        description:
          'End-to-end smart home solutions for homes and businesses, designed to maximize efficiency and comfort.',
        automationTitle: 'Home Automation',
        automationDescription:
          'Control all your home systems from a single platform. Lighting, climate, blinds, and appliances all working together intelligently.',
        lightingTitle: 'Smart Lighting',
        lightingDescription:
          'Adaptive lighting systems that adjust intensity and color based on time of day, presence, and personal preferences for maximum comfort.',
        securityTitle: 'Security & CCTV',
        securityDescription:
          '24/7 monitoring with HD cameras, motion sensors, smart alarms, and remote access control for complete peace of mind.',
      },
      projects: {
        title: 'Our Projects',
        subtitle:
          'Discover how we have transformed spaces with smart home automation solutions.',
        villaTitle: 'Smart Villa North',
        villaDescription:
          'Full automation of a luxury villa including lighting, climate, and integrated security control.',
        hqTitle: 'Corporate HQ Automation',
        hqDescription:
          'Comprehensive smart building management system with energy efficiency and advanced access control.',
        viewProject: 'View Project',
      },
    },
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n


import fs from 'fs';
import path from 'path';
import faqs_es from '../data_files/faqs_es.json';
import faqs_en from '../data_files/faqs.json';
import features_es from '../data_files/features_es.json';
import features_en from '../data_files/features.json';
import pricing_es from '../data_files/pricing_es.json';
import pricing_en from '../data_files/pricing.json';

const defaultPartners = [
  { icon: '<svg viewBox="0 0 100 42"><path d="M0 0h100v42H0z" fill="#ccc"/></svg>', name: 'Partner 1', href: '#' },
  { icon: '<svg viewBox="0 0 100 42"><path d="M0 0h100v42H0z" fill="#aaa"/></svg>', name: 'Partner 2', href: '#' }
];

const defaultFeatureTabs = [
  {
    heading: 'Cutting-Edge Tools',
    content: "Empower your business with Equipo Sakad's cutting-edge tools. Experience enhanced efficiency in enterprise management with our sophisticated automated solutions.",
    svg: 'tools',
    src: '/images/automated-tools.jpg',
    alt: 'Representation of automated tools',
    first: true,
  },
  {
    heading: 'Intuitive Dashboards',
    content: "Navigate with ease using Equipo Sakad's intuitive dashboards. Set up and oversee your operations seamlessly.",
    svg: 'dashboard',
    src: '/images/dashboard-image.avif',
    alt: 'Intuitive dashboard',
    second: true,
  },
  {
    heading: 'Robust Features',
    content: "Minimize complexity, maximize productivity. Equipo Sakad's robust features are engineered to streamline your business processes.",
    svg: 'house',
    src: '/images/automated-tools.jpg',
    alt: 'Robust features',
  },
];

const defaultTestimonials = [
  {
    content: 'Equipo Sakad dramatically boosted our business efficiency. Deployment was instant, and their rapid response times are phenomenal.',
    author: 'Samantha Ruiz',
    role: 'Chief Operating Officer | ConstructIt Inc.',
    avatarSrc: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?q=80&w=1453&auto=format&fit=crop&ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
  },
];

const defaultStats = [
  { count: '70k+', description: 'customers equipped' },
  { count: '35%', description: 'uptick in project efficiency' },
  { count: '15.3%', description: 'reduction in maintenance costs' },
  { count: '2x', description: 'quicker assembly' },
];

const defaultAvatars = [
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
];

const dbPath = path.resolve(process.cwd(), 'src/data/db.json');

const DEFAULT_DB = {
  legal: {
    privacyPolicy: `
  <div class="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Información que Recopilamos</h2>
    <p>Recopilamos información que nos proporcionas directamente cuando utilizas nuestro sitio web, te registras para obtener una cuenta, te suscribes a nuestro boletín informativo o nos contactas.</p>
  </div>
  <div class="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl mt-8">
    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">2. Cómo Utilizamos tu Información</h2>
    <p>Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios.</p>
  </div>`,
    privacyPolicy_en: `
  <div class="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Information We Collect</h2>
    <p>We collect information you provide directly to us when you use our website, register for an account, subscribe to our newsletter, or contact us.</p>
  </div>`,
    terms: `
  <div class="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Aceptación de los Términos</h2>
    <p>Al acceder o utilizar nuestro sitio web y servicios, aceptas estar sujeto a estos Términos y Condiciones.</p>
  </div>`,
    terms_en: `
  <div class="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
    <p>By accessing or using our website and services, you agree to be bound by these Terms and Conditions.</p>
  </div>`,
    cookiesTitle_es: 'Valoramos tu privacidad',
    cookiesText_es: 'Utilizamos cookies para mejorar tu experiencia de navegación, mostrar contenido personalizado y analizar nuestro tráfico. Al hacer clic en "Aceptar", aceptas nuestro uso de cookies.',
    cookiesAccept_es: 'Aceptar Cookies',
    cookiesDecline_es: 'Rechazar',
    cookiesTitle_en: 'We value your privacy',
    cookiesText_en: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
    cookiesAccept_en: 'Accept Cookies',
    cookiesDecline_en: 'Decline',
    cookiesEnabled: 'on'
  },
  site: {
    brandText: 'Angel Alegre',
    stickyHeader: 'on',
    footerText_es: '© 2026 Angel Alegre. Todos los derechos reservados.',
    footerText_en: '© 2026 Angel Alegre. All rights reserved.'
  },
  landing: {
    heroTitle_es: '<span class="word-reveal"><span>Gestiona</span></span> <span class="word-reveal"><span>tu</span></span> <span id="cycling-text" class="text-orange-500 dark:text-orange-400 inline-block transition-all duration-500">éxito</span> <span class="word-reveal"><span>con</span></span> <span class="word-reveal"><span>Angel</span></span> <span class="word-reveal"><span>Alegre</span></span>',
    heroSubtitle_es: 'Descubre las mejores herramientas y estrategias para escalar tu proyecto al siguiente nivel.',
    heroPrimaryBtn_es: 'Empezar ahora',
    heroSecondaryBtn_es: 'Saber más',
    heroTitle_en: '<span class="word-reveal"><span>Manage</span></span> <span class="word-reveal"><span>your</span></span> <span id="cycling-text" class="text-orange-500 dark:text-orange-400 inline-block transition-all duration-500">success</span> <span class="word-reveal"><span>with</span></span> <span class="word-reveal"><span>Angel</span></span> <span class="word-reveal"><span>Alegre</span></span>',
    heroSubtitle_en: 'Discover the best tools and strategies to scale your project to the next level.',
    heroPrimaryBtn_en: 'Get Started',
    heroSecondaryBtn_en: 'Learn More',

    announcementBtn_es: 'Explorar en GitHub',
    announcementUrl: 'https://github.com/angelalegredev2002-commits',
    clientsTitle_es: 'Confiado por Líderes de la Industria',
    clientsSubtitle_es: 'Experimenta la fiabilidad elegida por gigantes.',
    featuresTitle_es: 'Satisfaciendo las Demandas del Negocio',
    featuresSubtitle_es: 'Afrontamos los retos únicos encontrados en los sectores de tecnología y gestión.',
    featuresNavsTitle_es: 'Personaliza las ofertas de <span class="text-orange-500 dark:text-orange-400">Angel Alegre</span> para adaptarlas perfectamente a tus necesidades de software.',
    testimonialsTitle_es: 'Acelera tu Negocio',
    testimonialsSubtitle_es: 'Aseguramos un inicio rápido con despliegue instantáneo.',
    faqTitle_es: 'Preguntas<br />Frecuentes',
    pricingTitle_es: 'Precios Simples y Transparentes',
    pricingSubtitle_es: 'Impulsa la eficiencia con planes claros y diseñados para escalar con tu negocio.',
    pricingThirdOption_es: '¿Necesitas una solución personalizada?',
    pricingBtnText_es: 'Contactar a Angel',
    ctaTitle_es: 'Construyamos Juntos',
    ctaSubtitle_es: 'Una solución premium de software, meticulosamente creada.',

    announcementBtn_en: 'Explore on GitHub',
    clientsTitle_en: 'Trusted by Industry Leaders',
    clientsSubtitle_en: 'Experience the reliability chosen by industry giants.',
    featuresTitle_en: 'Meeting Business Demands',
    featuresSubtitle_en: 'We tackle the unique challenges encountered in the technology and management sectors.',
    featuresNavsTitle_en: 'Customize <span class="text-orange-500 dark:text-orange-400">Angel Alegre</span>\'s offerings to perfectly suit your software and business systems needs.',
    testimonialsTitle_en: 'Fast-Track Your Business',
    testimonialsSubtitle_en: 'We ensure a swift start with instant deployment.',
    faqTitle_en: 'Frequently<br />asked questions',
    pricingTitle_en: 'Simple, Transparent Pricing',
    pricingSubtitle_en: 'Boost efficiency with clear, value-driven plans designed to scale with your business.',
    pricingThirdOption_en: 'Need a custom solution?',
    pricingBtnText_en: 'Contact Angel',
    ctaTitle_en: 'Let\'s Build Together',
    ctaSubtitle_en: 'A premium software solution, meticulously crafted.',

    faqs_es,
    faqs_en,
    features_es,
    features_en,
    pricing_es,
    pricing_en,
    partners: defaultPartners,
    featureTabs: defaultFeatureTabs,
    testimonials: defaultTestimonials,
    statistics: defaultStats,
    heroAvatars: defaultAvatars
  }
};

export function getDB() {
  if (!fs.existsSync(dbPath)) {
    // Create default if missing
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
  
  try {
    const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    // Merge defaults with file data to ensure no missing schema keys
    return {
      legal: { ...DEFAULT_DB.legal, ...(fileData.legal || {}) },
      site: { ...DEFAULT_DB.site, ...(fileData.site || {}) },
      landing: { ...DEFAULT_DB.landing, ...(fileData.landing || {}) }
    };
  } catch (e) {
    return DEFAULT_DB;
  }
}

export function saveDB(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

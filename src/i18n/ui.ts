export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

const en = {
  // Site
  'site.title': 'Kenny He · Product Photography',
  'site.description':
    'Product photography for brands and online shops, in Madrid and across Spain.',
  'site.tagline': 'Product photography in Madrid & across Spain',

  // Navigation
  'nav.work': 'Work',
  'nav.services': 'Services',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.switchTo': 'ES',
  'nav.skip': 'Skip to content',
  'nav.primary': 'Primary',
  'nav.mobile': 'Mobile',

  // Footer
  'footer.rights': 'All rights reserved.',
  'footer.events': 'Event photography:',
  'footer.eventsLink': 'kennyhc.github.io/event-photographer',

  // Call to action band
  'cta.heading': "Have a product to shoot? Let's talk.",
  'cta.button': 'Get in touch',

  // Home
  'home.heroAlt': 'Kenny He, product photography',
  'home.scroll': 'Scroll',
  'home.intro':
    'Product photography for brands and online shops, in Madrid and across Spain.',
  'home.selectedWork': 'Selected work',
  'home.allWork': 'All work',
  'home.shootHeading': 'What I shoot',
  'home.servicesLink': 'Services and packages',

  // Shot types
  'shot.white': 'White background',
  'shot.lifestyle': 'Lifestyle',
  'shot.flatlay': 'Flat lay',
  'shot.detail': 'Detail',
  'shot.detailMacro': 'Detail · macro',

  // Project categories
  'category.ecommerce': 'E-commerce',
  'category.lifestyle': 'Lifestyle',
  'category.still-life': 'Still life',

  // Work filters
  'filter.all': 'All',
  'filter.label': 'Filter by category',

  // Work page
  'work.eyebrow': 'Portfolio',
  'work.heading': 'Work',
  'work.intro': 'Selected product work.',
  'work.viewProject': 'View project',

  // Project page
  'project.shots': 'Shots',
  'project.gallery': 'Gallery',
  'project.photoAlt': 'photo',
  'project.testimonial': 'What they said',
  'project.prev': 'Previous project',
  'project.next': 'Next project',
  'project.back': 'Back to all work',
  'project.nav': 'Project navigation',

  // Gallery (use {n} and {total} placeholders)
  'gallery.open': 'Open photo {n} of {total}',

  // Lightbox
  'lightbox.label': 'Photo viewer',
  'lightbox.close': 'Close',
  'lightbox.prev': 'Previous photo',
  'lightbox.next': 'Next photo',
  'lightbox.zoomIn': 'Zoom in',
  'lightbox.zoomOut': 'Zoom out',
  'lightbox.zoom': 'Zoom',
  'lightbox.counter': '{n} / {total}',
  'lightbox.hintClick': 'Click to zoom',
  'lightbox.hintTouch': 'Double-tap to zoom',

  // Before / after
  'ba.heading': 'Retouching',
  'ba.label': 'Before and after retouching comparison',
  'ba.before': 'Before',
  'ba.after': 'After',

  // Services
  'services.eyebrow': 'What to expect',
  'services.heading': 'Services',
  'services.packages.heading': 'Packages',
  'services.packages.quote': 'Request a quote',
  'services.pkg1.name': 'Starter',
  'services.pkg1.scope': 'Up to 5 products',
  'services.pkg1.ideal': 'Ideal for a new shop or a small product launch.',
  'services.pkg2.name': 'Collection',
  'services.pkg2.scope': 'Up to 15 products',
  'services.pkg2.ideal': 'Ideal for a full collection or a catalogue refresh.',
  'services.pkg3.name': 'Custom',
  'services.pkg3.scope': 'Larger or ongoing work',
  'services.pkg3.ideal': 'Ideal for big catalogues, regular new stock or lifestyle sets.',
  'services.included.heading': 'Included in every package',
  'services.included.1': '[Number] edited images per product, white background',
  'services.included.2': 'Colour-accurate editing and clean-up retouching',
  'services.included.3': 'Delivery within [number] working days',
  'services.included.4': 'Files sized for web and online shops ([formats to confirm])',
  'services.included.5': 'Delivered through a private Google Drive or WeTransfer link',
  'services.included.6': '[Usage rights to confirm]',
  'services.how.heading': 'How it works',
  'services.how.1.title': 'Get in touch',
  'services.how.1.text': 'Send the products, quantity and where the images will be used.',
  'services.how.2.title': 'Plan',
  'services.how.2.text': 'We agree on shots, angles and backgrounds before the shoot.',
  'services.how.3.title': 'Shoot',
  'services.how.3.text': 'On location, products shot to the agreed list.',
  'services.how.4.title': 'Delivery',
  'services.how.4.text': 'Edited images, named and sized, ready to upload.',
  'services.extras.heading': 'Extras',
  'services.extras.1': 'Lifestyle or in-context shots',
  'services.extras.2': 'Props and styling [to confirm]',
  'services.extras.3': 'Coloured backgrounds [to confirm]',
  'services.extras.4': 'Rush delivery [to confirm]',
  'services.extras.5': 'Travel across Spain, quoted separately',
  'services.faq.heading': 'Questions',
  'services.faq.1.q': 'Do I need to send the products?',
  'services.faq.1.a': '[Answer to confirm: shipping, pickup or shooting at your location.]',
  'services.faq.2.q': 'How many images will I get?',
  'services.faq.2.a':
    '[Number] edited images per product in the standard packages. More angles can be added.',
  'services.faq.3.q': 'Which file formats do you deliver?',
  'services.faq.3.a': '[Formats to confirm, e.g. high-resolution JPEG plus web-sized versions.]',
  'services.faq.4.q': 'How do I book?',
  'services.faq.4.a':
    "Send me a message with the products and dates, and I'll confirm availability.",

  // About
  'about.eyebrow': 'Based in Madrid',
  'about.heading': 'About',
  'about.portraitAlt': 'Kenny He',
  'about.p1':
    "I'm Kenny, a photographer based in Madrid. I photograph products for brands and online shops, on location across Spain.",
  'about.p2':
    'I was born in Peru and lived in China and Canada before settling in Spain. I speak Spanish, English and Mandarin.',
  'about.p3':
    "Before any shoot, I take the time to understand what you sell, who it's for and where the images will be used.",
  'about.closing': 'Want the details on packages and what’s included?',
  'about.closingLink': 'See Services',
  'about.events': 'I also photograph events.',
  'about.eventsLink': 'See event work',

  // Contact
  'contact.eyebrow': 'Get in touch',
  'contact.heading': 'Contact',
  'contact.intro':
    "Tell me what you sell, how many products and where the images will be used, and I'll get back to you shortly.",
  'contact.email': 'Email',
  'contact.whatsapp': 'WhatsApp',
  'contact.instagram': 'Instagram',
  'contact.based': 'Based in Madrid · Available across Spain',

  // 404
  'notfound.eyebrow': '404',
  'notfound.heading': 'Page not found',
  'notfound.body': 'The page you are looking for does not exist or has moved.',
  'notfound.back': 'Back to home',
} as const;

const es: Record<keyof typeof en, string> = {
  'site.title': 'Kenny He · Fotografía de producto',
  'site.description':
    'Fotografía de producto para marcas y tiendas online, en Madrid y en toda España.',
  'site.tagline': 'Fotografía de producto en Madrid y toda España',

  'nav.work': 'Trabajos',
  'nav.services': 'Servicios',
  'nav.about': 'Sobre mí',
  'nav.contact': 'Contacto',
  'nav.openMenu': 'Abrir menú',
  'nav.closeMenu': 'Cerrar menú',
  'nav.switchTo': 'EN',
  'nav.skip': 'Saltar al contenido',
  'nav.primary': 'Principal',
  'nav.mobile': 'Móvil',

  'footer.rights': 'Todos los derechos reservados.',
  'footer.events': 'Fotografía de eventos:',
  'footer.eventsLink': 'kennyhc.github.io/event-photographer',

  'cta.heading': '¿Tienes un producto que fotografiar? Hablemos.',
  'cta.button': 'Contacta conmigo',

  'home.heroAlt': 'Kenny He, fotografía de producto',
  'home.scroll': 'Desplázate',
  'home.intro':
    'Fotografía de producto para marcas y tiendas online, en Madrid y en toda España.',
  'home.selectedWork': 'Trabajos seleccionados',
  'home.allWork': 'Todos los trabajos',
  'home.shootHeading': 'Qué fotografío',
  'home.servicesLink': 'Servicios y paquetes',

  'shot.white': 'Fondo blanco',
  'shot.lifestyle': 'Lifestyle',
  'shot.flatlay': 'Flat lay',
  'shot.detail': 'Detalle',
  'shot.detailMacro': 'Detalle · macro',

  'category.ecommerce': 'E-commerce',
  'category.lifestyle': 'Lifestyle',
  'category.still-life': 'Bodegón',

  'filter.all': 'Todos',
  'filter.label': 'Filtrar por categoría',

  'work.eyebrow': 'Portfolio',
  'work.heading': 'Trabajos',
  'work.intro': 'Trabajos de producto seleccionados.',
  'work.viewProject': 'Ver proyecto',

  'project.shots': 'Tomas',
  'project.gallery': 'Galería',
  'project.photoAlt': 'foto',
  'project.testimonial': 'Lo que dijeron',
  'project.prev': 'Proyecto anterior',
  'project.next': 'Proyecto siguiente',
  'project.back': 'Volver a todos los trabajos',
  'project.nav': 'Navegación de proyectos',

  'gallery.open': 'Abrir foto {n} de {total}',

  'lightbox.label': 'Visor de fotos',
  'lightbox.close': 'Cerrar',
  'lightbox.prev': 'Foto anterior',
  'lightbox.next': 'Foto siguiente',
  'lightbox.zoomIn': 'Ampliar',
  'lightbox.zoomOut': 'Reducir',
  'lightbox.zoom': 'Zoom',
  'lightbox.counter': '{n} / {total}',
  'lightbox.hintClick': 'Haz clic para ampliar',
  'lightbox.hintTouch': 'Toca dos veces para ampliar',

  'ba.heading': 'Retoque',
  'ba.label': 'Comparación del retoque, antes y después',
  'ba.before': 'Antes',
  'ba.after': 'Después',

  'services.eyebrow': 'Qué esperar',
  'services.heading': 'Servicios',
  'services.packages.heading': 'Paquetes',
  'services.packages.quote': 'Pedir presupuesto',
  'services.pkg1.name': 'Inicial',
  'services.pkg1.scope': 'Hasta 5 productos',
  'services.pkg1.ideal': 'Ideal para una tienda nueva o un lanzamiento pequeño.',
  'services.pkg2.name': 'Colección',
  'services.pkg2.scope': 'Hasta 15 productos',
  'services.pkg2.ideal': 'Ideal para una colección completa o renovar el catálogo.',
  'services.pkg3.name': 'A medida',
  'services.pkg3.scope': 'Proyectos grandes o recurrentes',
  'services.pkg3.ideal':
    'Ideal para catálogos grandes, novedades periódicas o sesiones lifestyle.',
  'services.included.heading': 'Incluido en todos los paquetes',
  'services.included.1': '[Número] imágenes editadas por producto, fondo blanco',
  'services.included.2': 'Edición con color fiel y retoque de limpieza',
  'services.included.3': 'Entrega en [número] días laborables',
  'services.included.4':
    'Archivos adaptados a web y tiendas online ([formatos por confirmar])',
  'services.included.5': 'Entrega mediante un enlace privado de Google Drive o WeTransfer',
  'services.included.6': '[Derechos de uso por confirmar]',
  'services.how.heading': 'Cómo funciona',
  'services.how.1.title': 'Contacto',
  'services.how.1.text':
    'Envíame los productos, la cantidad y dónde se usarán las imágenes.',
  'services.how.2.title': 'Plan',
  'services.how.2.text': 'Acordamos tomas, ángulos y fondos antes de la sesión.',
  'services.how.3.title': 'Sesión',
  'services.how.3.text': 'En tu ubicación, con los productos fotografiados según la lista acordada.',
  'services.how.4.title': 'Entrega',
  'services.how.4.text': 'Imágenes editadas, con nombre y tamaño, listas para subir.',
  'services.extras.heading': 'Extras',
  'services.extras.1': 'Tomas lifestyle o en contexto',
  'services.extras.2': 'Atrezo y estilismo [por confirmar]',
  'services.extras.3': 'Fondos de color [por confirmar]',
  'services.extras.4': 'Entrega urgente [por confirmar]',
  'services.extras.5': 'Desplazamientos por España, presupuestados aparte',
  'services.faq.heading': 'Preguntas',
  'services.faq.1.q': '¿Tengo que enviar los productos?',
  'services.faq.1.a':
    '[Respuesta por confirmar: envío, recogida o sesión en tu ubicación.]',
  'services.faq.2.q': '¿Cuántas imágenes recibiré?',
  'services.faq.2.a':
    '[Número] imágenes editadas por producto en los paquetes estándar. Se pueden añadir más ángulos.',
  'services.faq.3.q': '¿En qué formatos entregas los archivos?',
  'services.faq.3.a':
    '[Formatos por confirmar, p. ej. JPEG de alta resolución y versiones para web.]',
  'services.faq.4.q': '¿Cómo reservo?',
  'services.faq.4.a':
    'Escríbeme con los productos y las fechas, y te confirmo la disponibilidad.',

  'about.eyebrow': 'Con base en Madrid',
  'about.heading': 'Sobre mí',
  'about.portraitAlt': 'Kenny He',
  'about.p1':
    'Soy Kenny, fotógrafo con base en Madrid. Fotografío productos para marcas y tiendas online, desplazándome por toda España.',
  'about.p2':
    'Nací en Perú y viví en China y Canadá antes de establecerme en España. Hablo español, inglés y mandarín.',
  'about.p3':
    'Antes de cada sesión, me tomo el tiempo de entender qué vendes, para quién es y dónde se usarán las imágenes.',
  'about.closing': '¿Quieres los detalles de los paquetes y lo que incluyen?',
  'about.closingLink': 'Ver Servicios',
  'about.events': 'También fotografío eventos.',
  'about.eventsLink': 'Ver trabajo de eventos',

  'contact.eyebrow': 'Hablemos',
  'contact.heading': 'Contacto',
  'contact.intro':
    'Cuéntame qué vendes, cuántos productos son y dónde se usarán las imágenes, y te responderé en breve.',
  'contact.email': 'Correo',
  'contact.whatsapp': 'WhatsApp',
  'contact.instagram': 'Instagram',
  'contact.based': 'Con base en Madrid · Disponible en toda España',

  'notfound.eyebrow': '404',
  'notfound.heading': 'Página no encontrada',
  'notfound.body': 'La página que buscas no existe o ha cambiado de lugar.',
  'notfound.back': 'Volver al inicio',
};

export const ui = { en, es } as const;

export type UiKey = keyof typeof en;

export function useTranslations(lang: Lang) {
  return function t(key: UiKey, vars?: Record<string, string | number>): string {
    let value: string = ui[lang][key] ?? ui[defaultLang][key];
    if (vars) {
      for (const [k, v] of Object.entries(vars)) value = value.replaceAll(`{${k}}`, String(v));
    }
    return value;
  };
}

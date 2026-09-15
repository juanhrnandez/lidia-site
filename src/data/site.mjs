// Datos globales del sitio — única fuente de verdad para constantes compartidas.

export const DOMAIN = 'https://dralidiachavez.com'

export const DOCTORA = {
  nombre: 'Dra. Lidia Chávez',
  nombreCompleto: 'Dra. Lidia Estela Chávez Buendía',
  subtitulo: 'GINECOLOGÍA Y COLPOSCOPÍA',
  telefono: '+525514767298',
  telefonoDisplay: '55 1476 7298',
  waNumero: '525514767298',
}

// Línea de credenciales del pie. El número de COFEPRIS va sin adjetivos, igual
// que las cédulas: COFEPRIS regula establecimientos y servicios de salud, no
// «avala» a un profesional, y la publicidad sanitaria en México se ciñe a lo que
// dice el documento. Si la doctora precisa de qué trámite es el folio (aviso de
// funcionamiento, licencia sanitaria), aquí se puede nombrar tal cual.
export const DATOS_PROFESIONALES =
  'Dra. Lidia Estela Chávez Buendía · Médico cirujano y partero – ENMyH-IPN · Cédula profesional 11505335 · Especialidad en Ginecología y Obstetricia – UAEMEX 14321195 · COFEPRIS 2509132002A00307'

export const DIRECCION = {
  lugar: 'Aurafem',
  calle: 'Cantú 11, Colonia Anzures',
  texto: 'Cantú 11, Colonia Anzures, Miguel Hidalgo, 11590 Ciudad de México, CDMX.',
  municipio: 'Miguel Hidalgo',
  region: 'CDMX',
  cp: '11590',
  pais: 'MX',
  lat: 19.4284101,
  lng: -99.177708,
  // Nombre con el que el consultorio está dado de alta en Google Maps. No
  // coincide con `lugar`, que es como se le nombra en el sitio.
  nombreMaps: 'AuraFem Health Care',
  // Identificador del lugar en Google Maps. Lo usa el mapa incrustado; el
  // enlace del botón no, ver abajo.
  mapsId: '0x85d1ff9dbb94facf:0xa5dc7bf9ebf15a61',
}

// Propiedad de GA4 (flujo 15466739327). Hasta ahora el sitio solo declaraba la
// etiqueta de Ads y GA4 recibía datos porque está enlazada como destino desde
// la interfaz de Google. Se declara aquí para no depender de esa configuración.
export const GA4_ID = 'G-J7MCYYV1TB'
export const GTAG_ID = 'AW-18297301316'
export const GTAG_CONVERSION = 'AW-18297301316/OBhzCLm2tcocEMTS6pRE'

export const FOTO_DRA = '/img/dra/dra-hero.webp'
export const LOGO = '/logo.webp'

export const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.7!2d-99.177708!3d19.4284101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff9dbb94facf%3A0xa5dc7bf9ebf15a61!2sAuraFem%20Health%20Care!5e0!3m2!1ses!2smx!4v1710000000000!5m2!1ses!2smx'

// Enlace del botón «Ver en Google Maps». Es la búsqueda documentada de la API
// de URLs de Maps (search/?api=1&query=), por nombre y dirección: es la única
// forma que resuelve a la ficha de AuraFem de manera estable. Antes apuntaba a
// una URL /maps/place/ con el bloque  de Google reconstruido a mano, y
// ese bloque es interno: Maps lo rechazaba y abría un mapa vacío.
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${DIRECCION.nombreMaps}, ${DIRECCION.texto}`
)}`

export const DISCLAIMER =
  'La información contenida en esta página web posee fines exclusivamente educativos e informativos y bajo ningún concepto sustituye una valoración médica profesional en consultorio. Para recibir orientación médica adecuada, agenda una consulta formal con la especialista.'

// Cifras de la banda de confianza. Solo afirmaciones que el sitio ya sostenía
// (valoración de Google y pacientes atendidas) más datos verificables del propio
// sitio. `animar` activa el conteo; sin él, el valor se pinta tal cual.
export const CIFRAS = [
  { valor: '5.0', animar: true, label: 'Valoración en Google' },
  { valor: '120', sufijo: '+', animar: true, label: 'Pacientes atendidas' },
  { valor: '7', sufijo: '+', animar: true, label: 'Servicios' },
  { valor: 'Minutos', texto: true, label: 'Respuesta por WhatsApp' },
]

// Los cuatro pilares de la propuesta de atención. Se usan en la home y dan
// contenido a la sección de «cómo se trabaja aquí».
export const PILARES = [
  {
    titulo: 'Trato humano, sin juicios',
    texto:
      'Un espacio donde puedes hablar con confianza de tu cuerpo, tu ciclo y tus dudas. La consulta se adapta a tu ritmo, no al revés.',
    icono: 'corazon',
  },
  {
    titulo: 'Explicaciones claras',
    texto:
      'Cada hallazgo, estudio y tratamiento se explica en lenguaje sencillo, para que tomes decisiones informadas sobre tu salud.',
    icono: 'chat',
  },
  {
    titulo: 'Confidencialidad total',
    texto:
      'Tu historial, tus resultados y lo que se conversa en consulta permanecen estrictamente entre tú y la especialista.',
    icono: 'escudo',
  },
  {
    titulo: 'Agenda fácilmente por WhatsApp',
    texto:
      'Sin formularios largos ni llamadas en espera. Escribes, revisamos disponibilidad y confirmas tu cita el mismo día.',
    icono: 'reloj',
  },
]

// Recorrido de la paciente, de la primera duda al seguimiento.
export const RECORRIDO = [
  {
    titulo: 'Escribes por WhatsApp',
    texto: 'Cuentas brevemente qué necesitas y revisamos juntas los horarios disponibles.',
  },
  {
    titulo: 'Consulta en Polanco',
    texto: 'Valoración sin prisas en Aurafem: historial, exploración y resolución de dudas.',
  },
  {
    titulo: 'Plan y seguimiento',
    texto: 'Recibes indicaciones claras por escrito y acompañamiento en las siguientes citas.',
  },
]

export function waLink(texto) {
  return `https://wa.me/${DOCTORA.waNumero}?text=${encodeURIComponent(texto)}`
}

export function physicianSchema(url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${DOMAIN}/#physician`,
    name: DOCTORA.nombre,
    medicalSpecialty: ['Gynecologic', 'Obstetric'],
    image: `${DOMAIN}${FOTO_DRA}`,
    telephone: DOCTORA.telefono,
    url,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: DIRECCION.calle,
      addressLocality: DIRECCION.municipio,
      addressRegion: DIRECCION.region,
      postalCode: DIRECCION.cp,
      addressCountry: DIRECCION.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: DIRECCION.lat,
      longitude: DIRECCION.lng,
    },
  }
}

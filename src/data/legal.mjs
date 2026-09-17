/**
 * Datos y estructura editorial de las páginas legales:
 *   - Aviso de Privacidad (/aviso-de-privacidad/)
 *   - Política de Cookies (/politica-de-cookies/)
 *
 * Estructura modular y clara conforme a la legislación aplicable (LFPDPPP).
 * Lista para incorporar el texto definitivo oficial en las secciones correspondientes.
 */

import { DIRECCION, DOCTORA } from './site.mjs'

export const AVISO_PRIVACIDAD = {
  slug: 'aviso-de-privacidad',
  title: 'Aviso de Privacidad | Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
  description:
    'Aviso de Privacidad integral de la Dra. Lidia Estela Chávez Buendía (Aurafem). Conoce el tratamiento y protección de tus datos personales conforme a la LFPDPPP.',
  ogAlt: 'Aviso de Privacidad - Dra. Lidia Estela Chávez Buendía',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',

  eyebrow: 'Transparencia y Privacidad',
  h1: 'Aviso de Privacidad',
  lead: 'En la consulta de la Dra. Lidia Estela Chávez Buendía, la confidencialidad, la seguridad y el tratamiento ético de tus datos personales y sensibles son una prioridad fundamental.',
  fechaActualizacion: 'Última actualización: Agosto 2026',

  secciones: [
    {
      id: 'responsable',
      titulo: '1. Identidad y Domicilio del Responsable',
      contenido: [
        `La <strong class="font-semibold text-marino">${DOCTORA.nombreCompleto}</strong>, médico especialista en Ginecología y Obstetricia con consultorio en <strong class="font-semibold text-marino">${DIRECCION.lugar}</strong>, ubicado en ${DIRECCION.texto}, es la persona responsable del uso, tratamiento y protección de sus datos personales.`,
        'El presente Aviso de Privacidad se emite en cumplimiento con lo dispuesto en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y demás normatividad aplicable en los Estados Unidos Mexicanos.',
      ],
    },
    {
      id: 'datos-recabados',
      titulo: '2. Datos Personales que se Recaban',
      contenido: [
        'Para la prestación de los servicios de consulta médica ginecológica, diagnóstico, seguimiento y atención obstétrica, se podrán recabar las siguientes categorías de datos personales:',
        '<strong>a) Datos de identificación y contacto:</strong> Nombre completo, edad, fecha de nacimiento, teléfono de contacto, correo electrónico y domicilio.',
        '<strong>b) Datos de salud y datos sensibles:</strong> Historial clínico, antecedentes médicos familiares y personales, sintomatología, diagnósticos médicos, estudios de laboratorio e imagenología (ultrasonido, colposcopía, citología/Papanicolaou) y tratamientos prescritos.',
        'Los datos personales sensibles son tratados bajo los más estrictos estándares de seguridad y estricto secreto médico profesional, garantizando su absoluta confidencialidad.',
      ],
    },
    {
      id: 'finalidades',
      titulo: '3. Finalidades del Tratamiento de los Datos',
      contenido: [
        'Sus datos personales serán utilizados para las siguientes <strong>finalidades primarias y necesarias</strong>:',
        '• Elaboración y actualización de su expediente clínico médico conforme a la NOM-004-SSA3-2012.<br>• Valoración, diagnóstico, tratamiento y seguimiento médico gineco-obstétrico.<br>• Comunicación directa para recordatorios, confirmación o reprogramación de citas médicas.<br>• Emisión de recetas médicas, órdenes de estudios y comprobantes fiscales correspondientes.',
        'Como <strong>finalidad secundaria</strong>, sus datos de contacto podrán ser utilizados únicamente para el envío de información sobre salud preventiva o encuestas breves de calidad en el servicio. Si no desea que sus datos sean tratados para finalidades secundarias, puede manifestarlo en cualquier momento.',
      ],
    },
    {
      id: 'derechos-arco',
      titulo: '4. Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)',
      contenido: [
        'Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros cuando considere que no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos para fines específicos (Oposición).',
        `Para el ejercicio de cualquiera de los derechos ARCO, podrá presentar la solicitud respectiva a través del teléfono <strong class="font-semibold text-marino">${DOCTORA.telefonoDisplay}</strong> o acudiendo directamente al consultorio en ${DIRECCION.calle}, Col. Anzures, Alcaldía Miguel Hidalgo, Ciudad de México.`,
      ],
    },
    {
      id: 'transferencias',
      titulo: '5. Transferencia de Datos Personales',
      contenido: [
        'Sus datos personales y médicos no serán compartidos ni transferidos a terceros sin su consentimiento previo y por escrito, salvo en las excepciones previstas por el artículo 37 de la LFPDPPP o por mandamiento de autoridad sanitaria/judicial competente, o cuando sea estrictamente necesario para la realización de estudios de laboratorio clínico solicitados por usted.',
      ],
    },
    {
      id: 'cookies',
      titulo: '6. Uso de Cookies y Tecnologías de Rastreo',
      contenido: [
        'Le informamos que en nuestro sitio web utilizamos cookies y tecnologías similares con fines técnicos indispensables para la navegación y herramientas de análisis anónimo de tráfico web (Google Analytics / Google Tag).',
        'Puede consultar los detalles completos sobre el uso de estas tecnologías, las finalidades de cada cookie y cómo desactivarlas en nuestra <a href="/politica-de-cookies/" class="font-semibold text-oro-rosa-profundo hover:underline">Política de Cookies</a>.',
      ],
    },
    {
      id: 'modificaciones',
      titulo: '7. Modificaciones al Aviso de Privacidad',
      contenido: [
        'El presente Aviso de Privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de requerimientos legales, de nuestras propias prácticas médicas o de cambios en la operación de este sitio web.',
        'Cualquier modificación será publicada y estará permanentemente disponible para su consulta a través de esta misma página web.',
      ],
    },
    {
      id: 'contacto-privacidad',
      titulo: '8. Dudas y Contacto de Privacidad',
      contenido: [
        `Si tiene alguna duda sobre el presente Aviso de Privacidad o el tratamiento de sus datos personales, puede ponerse en contacto directo a través de WhatsApp al <strong class="font-semibold text-marino">${DOCTORA.telefonoDisplay}</strong> o en la recepción del consultorio en ${DIRECCION.lugar}.`,
      ],
    },
  ],
}

export const POLITICA_COOKIES = {
  slug: 'politica-de-cookies',
  title: 'Política de Cookies | Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
  description:
    'Información sobre el uso de cookies en el sitio web de la Dra. Lidia Chávez. Conoce qué cookies utilizamos, su propósito y cómo administrarlas o desactivarlas.',
  ogAlt: 'Política de Cookies - Dra. Lidia Chávez',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',

  eyebrow: 'Transparencia Digital',
  h1: 'Política de Cookies',
  lead: 'Explicación clara y detallada sobre las cookies y tecnologías de almacenamiento que utiliza este sitio web para garantizar su funcionamiento y mejorar la experiencia de navegación.',
  fechaActualizacion: 'Última actualización: Agosto 2026',

  secciones: [
    {
      id: 'que-son',
      titulo: '1. ¿Qué son las cookies y el almacenamiento local?',
      contenido: [
        'Una cookie es un pequeño archivo de texto que los sitios web envían al navegador del usuario al visitarlos. Las cookies permiten a una página web almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo con el fin de facilitar la navegación, recordar preferencias o generar métricas de rendimiento.',
      ],
    },
    {
      id: 'tipos-cookies',
      titulo: '2. ¿Qué tipos de cookies utilizamos en este sitio?',
      contenido: [
        'En este sitio web utilizamos únicamente las cookies estrictamente necesarias para el funcionamiento del portal y herramientas de analítica web anónima:',
        '<strong>a) Cookies y almacenamiento técnico / esenciales:</strong> Son aquellas indispensables para que el sitio funcione correctamente, permitiendo la navegación fluida y la seguridad de la sesión.',
        '<strong>b) Cookies analíticas / de medición:</strong> A través de servicios como Google Tag (Google Analytics), recopilamos datos agregados y totalmente anónimos sobre el número de visitantes, páginas más consultadas, tiempo de permanencia y origen del tráfico. Esta información nos permite optimizar la velocidad y calidad del sitio.',
      ],
    },
    {
      id: 'tabla-cookies',
      titulo: '3. Detalle de tecnologías y almacenamiento',
      tabla: [
        {
          nombre: '_ga / _ga_*',
          proveedor: 'Google Analytics (Google LLC)',
          tipo: 'Cookie analítica / terceros',
          finalidad: 'Registra una identificación única anónima utilizada para generar datos estadísticos agregados sobre el uso del sitio web.',
          duracion: 'Hasta 2 años',
        },
        {
          nombre: 'AW-* / Conversiones',
          proveedor: 'Google Tag (Google LLC)',
          tipo: 'Medición de eventos / analítica',
          finalidad: 'Medición anónima de interacciones relevantes (como clics en el botón de WhatsApp para agendar consulta).',
          duracion: 'Sesión / 90 días',
        },
      ],
    },
    {
      id: 'desactivacion',
      titulo: '4. ¿Cómo desactivar o eliminar las cookies en su navegador?',
      contenido: [
        'Usted puede en cualquier momento permitir, bloquear o eliminar las cookies instaladas en su dispositivo mediante la configuración de las opciones del navegador que utilice. A continuación le facilitamos los enlaces a las guías oficiales de los principales navegadores:',
        '• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" class="font-semibold text-oro-rosa-profundo hover:underline">Google Chrome</a><br>• <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener" class="font-semibold text-oro-rosa-profundo hover:underline">Apple Safari</a><br>• <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener" class="font-semibold text-oro-rosa-profundo hover:underline">Mozilla Firefox</a><br>• <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" class="font-semibold text-oro-rosa-profundo hover:underline">Microsoft Edge</a>',
        'Tenga en cuenta que si desactiva las cookies esenciales, algunas funciones técnicas de navegación podrían verse afectadas.',
      ],
    },
  ],
}

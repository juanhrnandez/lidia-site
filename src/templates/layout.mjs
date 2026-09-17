// Bloques compartidos por todas las páginas: head, header, secciones comunes y footer.
import { RETRATO_2, img, imgServicio } from '../data/imagenes.mjs'
import {
  CIFRAS,
  DATOS_PROFESIONALES,
  DIRECCION,
  DISCLAIMER,
  DOCTORA,
  DOMAIN,
  GA4_ID,
  GTAG_ID,
  LOGO,
  MAPS_EMBED,
  MAPS_LINK,
  PILARES,
  waLink,
} from '../data/site.mjs'
import { SERVICES } from '../data/services.mjs'
import { ARTICULOS } from '../data/blog.mjs'
import { TESTIMONIOS, TESTIMONIOS_INTRO } from '../data/testimonios.mjs'
import {
  CONTAINER,
  H2,
  H3,
  acento,
  btnGhost,
  btnWa,
  bulletItem,
  escapeAttr,
  icono,
  marquesina,
  rotulo,
  titulo,
  waIcon,
} from './ui.mjs'

/* ═══════════════════════════════════════════════════════════════ <head> ══ */

/**
 * `ogImage`: ruta dentro de /og/, una por página, generada por
 * scripts/generar-og.sh. Son JPEG de 1200x630 a propósito: WhatsApp no
 * renderiza WebP en las vistas previas de enlaces (el enlace saldría sin
 * miniatura) y a 1.91:1 muestra la tarjeta grande en vez de la miniatura
 * pequeña. La URL tiene que ser absoluta: los rastreadores no resuelven
 * rutas relativas.
 */
export function head({
  title,
  description,
  canonical,
  ogType,
  ogAlt,
  ogImage = '/og/home.jpg',
  schema,
  preload,
}) {
  const imagen = `${DOMAIN}${ogImage}`
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#fbf7f4">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${LOGO}" type="image/webp">

  <!-- Open Graph -->
  <meta property="og:locale" content="es_MX">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Dra. Lidia Chávez - Ginecología y Colposcopía">
  <meta property="og:image" content="${imagen}">
  <meta property="og:image:secure_url" content="${imagen}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeAttr(ogAlt)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${imagen}">
  <meta name="twitter:image:alt" content="${escapeAttr(ogAlt)}">

  <!-- Tipografías oficiales locales: Against (display) + Champagne & Limousines (texto) -->
  ${preload ? `<link rel="preload" as="image" href="${preload}" fetchpriority="high">` : ''}

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
  <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA4_ID}'); gtag('config', '${GTAG_ID}'); </script>

  <!-- CSS en el head (render-blocking) para evitar FOUC; el JS solo trae interacción -->
  <link rel="stylesheet" href="/src/styles/main.css">
  <!-- Marca 'js' antes del primer paint: las animaciones solo aplican con JS activo -->
  <script>document.documentElement.classList.add('js')</script>
  <script type="module" src="/src/main.js"></script>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
}

/* ══════════════════════════════════════════════════════════════ header ══ */

// `tema`: 'claro' = texto oscuro sobre hero luminoso (home);
//         'oscuro' = texto blanco sobre hero oscuro (páginas de servicio).
export function header({ waText, waLabel, logoAlt, tema = 'claro', activo = '' }) {
  const oscuro = tema === 'oscuro'
  const tono = oscuro ? 'text-white data-solido:text-marino' : 'text-marino'
  // El oro rosa claro solo tiene contraste sobre el azul noche; en cuanto la
  // cabecera se vuelve sólida (lino) hay que pasar a la variante profunda.
  const tonoRotulo = oscuro
    ? 'text-oro-rosa-claro group-data-solido/cab:text-oro-rosa-profundo'
    : 'text-oro-rosa-profundo'

  const navLink = (href, texto, id) => `
        <li>
          <a href="${href}" class="relative block px-1 py-2 text-[0.92rem] font-semibold text-current no-underline after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-500 after:ease-suave hover:after:w-full max-lg:text-[1.6rem] max-lg:font-display max-lg:font-medium ${
            activo === id ? 'after:w-full' : ''
          }">${texto}</a>
        </li>`

  // Los testimonios tienen página propia: el enlace es una navegación normal,
  // no un ancla. Sin testimonios que mostrar, la página quedaría vacía y el
  // enlace no se pinta.
  const enlaceTestimonios = TESTIMONIOS.length
    ? navLink('/testimonios/', 'Testimonios', 'testimonios')
    : ''

  const megaItem = (s) => {
    const f = imgServicio(s.slug, 'tarjeta')
    return `
              <li>
                <a href="/${s.slug}/" class="group/it flex items-center gap-4 rounded-2xl p-2.5 no-underline transition duration-400 ease-suave hover:bg-arena/70">
                  <span class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-arena">
                    <img src="${f.src}" alt="" aria-hidden="true" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
                         class="h-full w-full object-cover transition-transform duration-700 ease-suave group-hover/it:scale-110">
                  </span>
                  <span class="min-w-0">
                    <span class="block text-[0.9rem] font-bold leading-tight text-marino">${s.nombre}</span>
                    <span class="mt-0.5 block truncate text-[0.75rem] text-humo">${s.tagline}</span>
                  </span>
                  <span aria-hidden="true" class="ml-auto shrink-0 -translate-x-1 text-oro-rosa opacity-0 transition duration-400 ease-suave group-hover/it:translate-x-0 group-hover/it:opacity-100 max-lg:hidden">${icono('flecha', 'h-4 w-4')}</span>
                </a>
              </li>`
  }

  const megaServicios = `
        <li class="group relative max-lg:w-full" data-dropdown>
          <div class="flex items-center justify-center gap-0.5">
            <a href="/#servicios" class="relative block px-1 py-2 text-[0.92rem] font-semibold text-current no-underline after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-500 after:ease-suave hover:after:w-full max-lg:text-[1.6rem] max-lg:font-display max-lg:font-medium">Servicios</a>
            <button type="button" data-dropdown-btn aria-expanded="false" aria-controls="mega-servicios" aria-label="Abrir submenú de servicios"
                    class="cursor-pointer p-1.5 text-current transition duration-500 ease-suave group-data-open:rotate-180 lg:group-hover:rotate-180">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          <div id="mega-servicios"
               class="invisible absolute left-1/2 top-full z-[1020] w-[min(46rem,calc(100vw-3rem))] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-500 ease-suave group-data-open:visible group-data-open:translate-y-0 group-data-open:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100 max-lg:static max-lg:grid max-lg:w-full max-lg:translate-x-0 max-lg:translate-y-0 max-lg:grid-rows-[0fr] max-lg:pt-0 max-lg:opacity-100 max-lg:transition-[grid-template-rows,visibility] group-data-open:max-lg:grid-rows-[1fr]">
            <div class="min-h-0 overflow-hidden lg:overflow-visible">
              <div class="rounded-[1.75rem] border border-marino/10 bg-lino/95 p-4 shadow-alta backdrop-blur-xl max-lg:mt-3 max-lg:border-0 max-lg:bg-transparent max-lg:p-0 max-lg:shadow-none">
                <div class="mb-2 flex items-center justify-between px-2.5 max-lg:justify-center">
                  ${rotulo('Servicios')}
                  <a href="/#servicios" class="text-[0.78rem] font-bold text-marino no-underline transition-colors duration-300 hover:text-oro-rosa-profundo max-lg:hidden">Ver todas</a>
                </div>
                <ul class="grid list-none gap-1 lg:grid-cols-2">
                  ${SERVICES.map(megaItem).join('')}
                </ul>
              </div>
            </div>
          </div>
        </li>`

  return `
  <a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[2100] focus:rounded-full focus:bg-marino focus:px-5 focus:py-3 focus:text-[0.9rem] focus:font-bold focus:text-lino">Saltar al contenido</a>

  <header data-cabecera
          class="group/cab fixed inset-x-0 top-0 z-[1000] ${tono} transition-[background-color,transform,box-shadow] duration-500 ease-suave data-solido:bg-lino/85 data-solido:shadow-[0_1px_0_rgba(29,61,97,0.09)] data-solido:backdrop-blur-xl data-oculta:-translate-y-full">
    <div class="${CONTAINER} relative flex items-center justify-between gap-6 py-4">
      <a href="/" class="relative z-[1010] flex items-center gap-3 no-underline text-current">
        <img src="${LOGO}" alt="${escapeAttr(logoAlt)}" width="640" height="641" loading="eager" class="h-11 w-11 rounded-full object-cover ring-1 ring-oro-rosa/70 ring-offset-2 ring-offset-transparent">
        <span class="leading-none">
          <span class="block font-display text-[1.02rem] font-semibold tracking-[-0.01em] text-current">${DOCTORA.nombre}</span>
          <span class="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.25em] ${tonoRotulo}">${DOCTORA.subtitulo}</span>
        </span>
      </a>

      <button class="group relative z-[1010] flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] lg:hidden" aria-label="Abrir menú" aria-expanded="false" data-menu-toggle>
        <span class="block h-px w-6 bg-current transition duration-500 ease-suave group-aria-expanded:translate-y-[6px] group-aria-expanded:rotate-45"></span>
        <span class="block h-px w-6 bg-current transition duration-500 ease-suave group-aria-expanded:opacity-0"></span>
        <span class="block h-px w-6 bg-current transition duration-500 ease-suave group-aria-expanded:-translate-y-[6px] group-aria-expanded:-rotate-45"></span>
      </button>

      <nav class="flex items-center gap-7" aria-label="Principal">
        <ul id="navLinks" class="flex list-none items-center gap-7 max-lg:invisible max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:z-[1000] max-lg:h-[100dvh] max-lg:translate-y-[-100%] max-lg:flex-col max-lg:items-center max-lg:justify-start max-lg:gap-6 max-lg:overflow-y-auto max-lg:bg-lino max-lg:px-6 max-lg:pb-28 max-lg:pt-28 max-lg:text-marino max-lg:transition-[transform,visibility] max-lg:duration-500 max-lg:ease-suave data-open:max-lg:visible data-open:max-lg:translate-y-0">
          ${megaServicios}
          ${navLink('/conoce/', 'La doctora', 'conoce')}
          ${enlaceTestimonios}
          ${ARTICULOS.length ? navLink('/blog/', 'Blog', 'blog') : ''}
          ${navLink('/contacto/', 'Contacto', 'contacto')}
          <li class="hidden max-lg:mt-4 max-lg:block">
            ${btnWa(waText, `${waLabel}_movil`, 'Agendar por WhatsApp')}
          </li>
        </ul>

        <a href="${waLink(waText)}" target="_blank" rel="noopener" data-wa-label="${waLabel}"
           class="group/wa relative hidden items-center gap-2.5 overflow-hidden rounded-full bg-wsp px-5 py-2.5 text-[0.85rem] font-bold text-white no-underline shadow-[0_8px_20px_-6px_rgba(37,211,102,0.7)] transition duration-500 ease-suave hover:-translate-y-0.5 hover:bg-[#1fbe5b] lg:flex">
          ${waIcon(18, 'blanco')}
          <span>WhatsApp</span>
        </a>
      </nav>
    </div>

    <!-- Progreso de lectura: lo anima el CSS (scroll-driven) o main.js. -->
    <span aria-hidden="true" data-progreso class="progreso-scroll absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-oro-rosa via-oro-rosa-oscuro to-marino"></span>
  </header>`
}

/* ═══════════════════════════════════════════════ banda de cifras ══════ */

export function bandaCifras() {
  // El valor real vive en el DOM: si el JS no corre, la cifra se ve igual.
  const celda = (c) => `
        <div class="relative min-w-0 px-5 py-10 text-center">
          <span class="block font-display font-medium leading-none tracking-[-0.03em] text-white ${
            c.texto ? 'text-[clamp(1.5rem,3vw,2.2rem)]' : 'text-[clamp(2.4rem,5vw,3.6rem)]'
          }">
            ${c.animar ? `<span data-contador>${c.valor}</span>` : c.valor}${c.sufijo || ''}
          </span>
          <span class="mt-3 block text-[0.7rem] font-bold uppercase leading-relaxed tracking-[0.18em] text-oro-rosa-claro">${c.label}</span>
        </div>`
  return `
  <section aria-label="Cifras de la consulta" class="relative overflow-hidden bg-noche">
    <span aria-hidden="true" class="halo -left-40 top-0 h-96 w-96 bg-oro-rosa/12"></span>
    <span aria-hidden="true" class="halo -bottom-48 right-0 h-96 w-96 bg-marino-claro/25"></span>
    <div class="${CONTAINER} relative">
      <div data-anim-grupo class="grid grid-cols-[repeat(2,minmax(0,1fr))] divide-x divide-y divide-white/10 md:grid-cols-[repeat(4,minmax(0,1fr))] md:divide-y-0">
        ${CIFRAS.map(celda).join('')}
      </div>
    </div>
  </section>`
}

/* ════════════════════════════════════════════════════════ testimonios ══ */

// Solo se renderiza cuando hay testimonios reales en `TESTIMONIOS`. Con el
// arreglo vacío devuelve '' y la página no muestra ningún hueco.
//
// Vive aquí, y no dentro de una plantilla, porque la usan dos páginas: la de
// testimonios (/testimonios/, con todos) y /conoce/, que muestra un adelanto y
// remite a la página completa.
//
// `limite`   reduce la lista a n testimonios repartidos (0 = todos).
// `verTodos` añade el enlace a /testimonios/ junto al encabezado.
export function testimonios({ limite = 0, verTodos = false } = {}) {
  if (!TESTIMONIOS.length) return ''

  // El adelanto no corta por la cabeza: el orden del arreglo está pensado para
  // el reparto en columnas, así que los primeros n son una columna entera —un
  // testimonio muy largo seguido de dos muy cortos—. Tomando uno de cada tramo
  // salen las cabezas de columna, que están escogidas para verse parejas.
  const n = Math.min(limite || TESTIMONIOS.length, TESTIMONIOS.length)
  const paso = Math.max(1, Math.floor(TESTIMONIOS.length / n))
  const lista =
    n === TESTIMONIOS.length
      ? TESTIMONIOS
      : Array.from({ length: n }, (_, i) => TESTIMONIOS[i * paso])

  // Reparto explícito en columnas, no `columns-*` de CSS: ahí el navegador
  // equilibra por altura y no hay forma de fijar en qué columna cae cada
  // testimonio. Repartiendo a mano, el orden del arreglo manda: los primeros
  // llenan la columna izquierda de arriba abajo, y así con el resto.
  //
  // Tres columnas solo cuando se llenan enteras: con cuatro tarjetas, `porCol`
  // sería 2 y la tercera columna quedaría vacía dentro de una rejilla de tres.
  const nCols = lista.length >= 5 || lista.length === 3 ? 3 : lista.length >= 2 ? 2 : 1
  const porCol = Math.ceil(lista.length / nCols)
  const columnas = Array.from({ length: nCols }, (_, i) =>
    lista.slice(i * porCol, (i + 1) * porCol)
  ).filter((c) => c.length)

  const rejilla =
    nCols === 1
      ? 'max-w-[760px] mx-auto'
      : nCols === 2
        ? 'md:grid-cols-2 max-w-[1000px] mx-auto'
        : 'md:grid-cols-2 lg:grid-cols-3'

  const estrellas = (n) =>
    !n
      ? ''
      : `<span class="mb-5 flex items-center gap-1 text-oro-rosa" aria-label="${escapeAttr(`${n} de 5 estrellas`)}">
            ${Array.from({ length: Math.min(5, Math.max(1, n)) }, () => icono('estrella', 'h-3.5 w-3.5')).join('')}
          </span>`

  const tarjeta = (t) => `
        <figure class="group relative overflow-hidden rounded-[1.5rem] border border-marino/8 bg-lino p-8 transition duration-500 ease-suave hover:-translate-y-2 hover:border-oro-rosa/40 hover:shadow-flotante">
          <span aria-hidden="true" class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-oro-rosa/0 blur-2xl transition-colors duration-700 group-hover:bg-oro-rosa/20"></span>
          <span aria-hidden="true" class="relative mb-5 block font-display text-[2.8rem] italic leading-none text-oro-rosa/35">&ldquo;</span>
          ${estrellas(t.estrellas)}
          <blockquote class="relative text-[1.2rem] leading-[1.75] text-tinta">${t.texto}</blockquote>
          <figcaption class="relative mt-7 border-t border-marino/10 pt-5">
            <span class="block font-display text-[1.2rem] font-semibold text-marino">${t.autora}</span>
            ${
              t.servicio || t.fuente
                ? `<span class="mt-1 block text-[0.96rem] text-humo">${[t.servicio, t.fuente ? `vía ${t.fuente}` : '']
                    .filter(Boolean)
                    .join(' · ')}</span>`
                : ''
            }
          </figcaption>
        </figure>`

  // Sin `id` propio: donde haga falta un ancla, la coloca la página con
  // `ancla()`, porque el punto desde el que conviene ver el bloque cambia según
  // lo que tenga encima.
  return `
  <section class="relative overflow-hidden bg-lino py-[clamp(72px,10vw,140px)]">
    <span aria-hidden="true" class="halo -right-32 top-0 h-[28rem] w-[28rem] bg-arena-2/60"></span>
    <div class="${CONTAINER} relative">
      <div class="mb-[clamp(38px,5.5vw,72px)] grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span data-anim>${rotulo(TESTIMONIOS_INTRO.rotulo)}</span>
          ${titulo(`${TESTIMONIOS_INTRO.titulo} ${acento(TESTIMONIOS_INTRO.tituloAcento)}`, {
            clase: `${H2} mt-5 text-marino`,
          })}
        </div>
        <div class="lg:pb-2">
          <p data-anim style="--d:.1s" class="text-[1.22rem] leading-[1.7] text-humo">
            ${TESTIMONIOS_INTRO.texto}
          </p>
          ${
            verTodos
              ? `<div data-anim style="--d:.18s" class="mt-7">
            ${btnGhost('/testimonios/', 'Ver todos los testimonios')}
          </div>`
              : ''
          }
        </div>
      </div>
      <div class="grid items-start gap-5 ${rejilla}">
        ${columnas
          .map(
            (col) => `<div data-anim-grupo class="grid content-start gap-5">
          ${col.map(tarjeta).join('\n')}
        </div>`
          )
          .join('\n')}
      </div>
    </div>
  </section>`
}

/* ══════════════════════════════════════════════ pilares de atención ═══ */

export function pilares() {
  const tarjeta = (p) => `
        <article class="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-marino/8 bg-lino p-7 transition duration-500 ease-suave hover:-translate-y-2 hover:border-oro-rosa/40 hover:shadow-flotante">
          <span aria-hidden="true" class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-oro-rosa/0 blur-2xl transition-colors duration-700 group-hover:bg-oro-rosa/20"></span>
          <span class="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-marino text-oro-rosa-claro transition duration-500 ease-suave group-hover:bg-oro-rosa group-hover:text-white">
            ${icono(p.icono, 'h-5 w-5')}
          </span>
          <h3 class="${H3} relative mb-3 hyphens-auto break-words text-marino">${p.titulo}</h3>
          <p class="relative text-[1.13rem] leading-[1.7] text-humo">${p.texto}</p>
        </article>`
  return `
  <section class="relative bg-arena/40 py-[clamp(72px,10vw,140px)]">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(38px,5.5vw,72px)] grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span data-anim>${rotulo('Cómo se trabaja aquí')}</span>
          ${titulo(`Medicina rigurosa con ${acento('trato humano')}`, { clase: `${H2} mt-5 text-marino` })}
        </div>
        <p data-anim style="--d:.1s" class="text-[1.22rem] leading-[1.7] text-humo lg:pb-2">
          La consulta ginecológica funciona cuando hay confianza. Estos son los cuatro compromisos que sostienen cada cita con la Dra. Lidia Chávez.
        </p>
      </div>
      <div data-anim-grupo class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        ${PILARES.map(tarjeta).join('')}
      </div>
    </div>
  </section>`
}

/* ════════════════════════════════════════ la doctora / espacio seguro ══ */

export function doctora({ waText, waLabel, bullet1, ctaTexto }) {
  const retrato = img(RETRATO_2)
  return `
  <section id="doctora" class="relative scroll-mt-[110px] overflow-hidden bg-lino py-[clamp(72px,10vw,140px)]">
    <span aria-hidden="true" class="halo -right-32 top-24 h-[28rem] w-[28rem] bg-arena-2/60"></span>

    <div class="${CONTAINER} relative">
      <div class="grid items-center gap-[clamp(40px,6vw,90px)] lg:grid-cols-[0.95fr_1.05fr]">

        <!-- Retrato en arco con la insignia de la valoración -->
        <div class="relative mx-auto w-full max-w-[520px]">
          <div data-anim="cortina" class="relative overflow-hidden rounded-t-[14rem] rounded-b-[2rem] bg-arena shadow-alta">
            <img src="${retrato.src}" alt="${escapeAttr(`${DOCTORA.nombreCompleto}, ginecóloga en Polanco CDMX`)}" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
                 class="zoom-scroll block aspect-[4/5] w-full object-cover">
          </div>

          <div data-anim style="--d:.3s" class="absolute -right-2 top-8 rounded-2xl border border-marino/10 bg-lino/90 px-4 py-3 shadow-cristal backdrop-blur-md sm:-right-6">
            <span class="block font-display text-[1.5rem] font-medium leading-none text-marino">5.0<span class="text-[0.9rem] text-oro-rosa">/5</span></span>
            <span class="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-humo">Google</span>
          </div>
        </div>

        <!-- Texto -->
        <div class="max-lg:text-center">
          <span data-anim>${rotulo('Espacio seguro')}</span>
          ${titulo(`Atención profesional, cercana y ${acento('confidencial')}`, {
            clase: `${H2} mt-5 text-marino`,
          })}

          <p data-anim style="--d:.1s" class="mt-6 max-w-[56ch] text-[1.26rem] leading-[1.75] text-tinta max-lg:mx-auto">
            La <strong class="font-semibold text-marino">${DOCTORA.nombreCompleto}</strong> brinda atención ginecológica en Polanco, CDMX, con un enfoque profesional, respetuoso y firmemente orientado al bienestar integral de cada paciente.
          </p>

          <ul data-anim-grupo class="mt-9 grid list-none gap-4 max-lg:mx-auto max-lg:inline-grid max-lg:text-left">
            ${bulletItem(bullet1)}
            ${bulletItem('Atención en Polanco, Miguel Hidalgo')}
            ${bulletItem('Agenda rápida por WhatsApp')}
          </ul>

          <div data-anim style="--d:.2s" class="mt-10 flex flex-wrap items-center gap-4 max-lg:justify-center">
            ${btnWa(waText, waLabel, ctaTexto)}
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* ═══════════════════════════════════════════════════════════ ubicación ══ */

export function ubicacion({ waText, waLabel }) {
  const dato = (ic, label, valor) => `
        <li class="flex items-start gap-4">
          <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-oro-rosa-claro">${icono(ic, 'h-4 w-4')}</span>
          <span>
            <span class="block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-claro">${label}</span>
            <span class="mt-1 block text-[1.16rem] leading-[1.6] text-white/85">${valor}</span>
          </span>
        </li>`

  return `
  <section id="ubicacion" class="relative scroll-mt-[110px] overflow-hidden bg-noche py-[clamp(72px,10vw,140px)] text-white">
    <span aria-hidden="true" class="halo -left-40 bottom-0 h-[30rem] w-[30rem] bg-marino-claro/25"></span>
    <span aria-hidden="true" class="halo right-1/4 -top-40 h-[26rem] w-[26rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <div class="grid items-center gap-[clamp(36px,5vw,72px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span data-anim>${rotulo('Ubicación y acceso', { claro: true })}</span>
          ${titulo(`Consulta en ${acento('Polanco', { claro: true })}, CDMX`, {
            clase: `${H2} mt-5 text-white`,
          })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[54ch] text-[1.22rem] leading-[1.75] text-white/70">
            Atención en zona Miguel Hidalgo, cerca de Polanco, con fácil acceso y conectividad desde Benito Juárez, Cuauhtémoc y zonas aledañas.
          </p>

          <ul data-anim-grupo class="mt-10 grid list-none gap-6 sm:grid-cols-2">
            ${dato('mapa', DIRECCION.lugar, DIRECCION.texto)}
            ${dato('reloj', 'Agenda', 'Confirmación de horarios por WhatsApp el mismo día.')}
          </ul>

          <div data-anim style="--d:.2s" class="mt-10 flex flex-wrap items-center gap-4">
            ${btnWa(waText, waLabel, 'Agendar por WhatsApp')}
            ${btnGhost(
              MAPS_LINK,
              'Ver en Google Maps',
              { claro: true, icono: 'flechaDiag', externo: true }
            )}
          </div>
        </div>

        <div data-anim="escalar" class="relative overflow-hidden rounded-[1.75rem] border border-white/12 shadow-alta">
          <iframe
            class="block h-[clamp(320px,44vw,520px)] w-full border-0 bg-marino/40"
            src="${MAPS_EMBED}"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Mapa del consultorio Aurafem en Anzures, CDMX">
          </iframe>
        </div>
      </div>
    </div>
  </section>`
}

/* ══════════════════════════════════════════ transparencia / claridad ══ */

export function claridad() {
  const dato = (label, valor) => `
        <div class="border-l border-marino/10 px-5 py-4 first:border-l-0 max-sm:border-l-0 max-sm:border-t max-sm:first:border-t-0">
          <span class="block text-[0.63rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo">${label}</span>
          <span class="mt-1.5 block text-[1.06rem] font-semibold leading-snug text-marino">${valor}</span>
        </div>`
  return `
  <section class="border-y border-marino/8 bg-gris-suave py-[clamp(48px,6vw,80px)]">
    <div class="${CONTAINER}">
      <div class="mx-auto max-w-[960px]">
        <div data-anim class="rounded-[1.5rem] border border-dashed border-oro-rosa/45 bg-lino p-[clamp(22px,3.5vw,36px)]">
          <span class="mb-3 block">${rotulo('Aviso')}</span>
          <p class="text-[1.1rem] leading-[1.75] text-humo">${DISCLAIMER}</p>
        </div>

        <div data-anim-grupo class="mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
          ${dato('Nombre', DOCTORA.nombre)}
          ${dato('Especialidad', 'Ginecología y Colposcopía')}
          ${dato('Ubicación', `${DIRECCION.municipio}, ${DIRECCION.region}`)}
          ${dato('Contacto', DOCTORA.telefonoDisplay)}
          ${dato('WhatsApp', DOCTORA.telefonoDisplay)}
        </div>
      </div>
    </div>
  </section>`
}

/* ═════════════════════════════════════════════════════════ cierre CTA ══ */

export function ctaFinal({ titulo: t, waText, waLabel, intro }) {
  return `
  <section id="agendar" class="relative scroll-mt-[110px] overflow-hidden bg-arena/60 py-[clamp(84px,11vw,160px)]">
    <span aria-hidden="true" class="halo left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 bg-oro-rosa/20"></span>
    <span aria-hidden="true" class="halo -bottom-40 right-10 h-80 w-80 bg-white/60"></span>

    <div class="${CONTAINER} relative text-center">
      <span data-anim class="inline-block">${rotulo('Agenda tu cita')}</span>
      ${titulo(t, {
        clase: 'font-display font-medium text-[clamp(2.2rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em] text-marino mt-6 mx-auto max-w-[16ch]',
      })}
      <p data-anim style="--d:.12s" class="mx-auto mt-7 max-w-[54ch] text-[1.26rem] leading-[1.75] text-humo">
        ${intro || 'Escríbele directamente a la Dra. Lidia Chávez para revisar fechas disponibles, horarios de atención y resolver tus dudas de forma rápida.'}
      </p>

      <div data-anim style="--d:.2s" class="mt-11 flex flex-col items-center gap-5">
        ${btnWa(waText, waLabel, 'Agendar ahora por WhatsApp', { grande: true })}
      </div>
    </div>
  </section>`
}

// `soloDesktop`: en páginas con barra de acción fija en móvil, el botón
// flotante se oculta ahí para no duplicar el mismo llamado a la acción.
export function floatingWa({ waText, waLabel, soloDesktop = false }) {
  return `
  <a href="${waLink(waText)}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp" data-wa-label="${waLabel}"
     class="group fixed bottom-6 right-6 z-[999] ${soloDesktop ? 'hidden lg:flex' : 'flex'} h-14 w-14 items-center justify-center rounded-full bg-wsp text-white shadow-[0_12px_30px_-6px_rgba(37,211,102,0.75)] transition duration-500 ease-suave hover:scale-110 max-sm:bottom-4 max-sm:right-4">
    <span aria-hidden="true" class="absolute inset-0 animate-ping rounded-full bg-wsp/40"></span>
    <span class="relative">${waIcon(30, 'glifo')}</span>
  </a>`
}

/* ═════════════════════════════════════════════════════════════ footer ══ */

/**
 * Arcos concéntricos en línea: el gesto del arco de las escenas reducido a
 * trazo. `n` arcos que nacen de la misma base, separados por `paso`.
 */
function arcos({ n = 4, paso = 46, base = 400, clase = '' } = {}) {
  const cx = 200
  const pierna = 118 // tramo recto antes de que abra la curva
  const paths = Array.from({ length: n }, (_, i) => {
    const r = 58 + i * paso
    const y = base - pierna
    return `<path d="M${cx - r} ${base} L${cx - r} ${y} A${r} ${r} 0 0 1 ${cx + r} ${y} L${cx + r} ${base}"
                  stroke-width="${(1.2 - i * 0.12).toFixed(2)}" opacity="${(0.9 - i * 0.16).toFixed(2)}"/>`
  }).join('')

  return `
    <svg class="arcos ${clase}" viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
      ${paths}
    </svg>`
}

export function footer({ logoAlt, espacioCtaFija = false }) {
  const enlace = (href, texto) =>
    `<li><a href="${href}" class="enlace-linea text-[0.9rem] text-white/65 no-underline transition-colors duration-400 hover:text-white">${texto}</a></li>`

  const cinta = marquesina(
    [
      'Ginecología',
      'Colposcopía',
      'Papanicolaou',
      'Control prenatal',
      'VPH',
      'Revisión preventiva',
      'Atención del embarazo',
    ].map(
      (t) =>
        `<span class="font-display text-[clamp(1.6rem,4vw,2.6rem)] font-medium text-arena/55">${t}</span>`
    ),
    { vel: '48s' }
  )

  return `
  <footer class="relative overflow-hidden bg-noche text-white ${espacioCtaFija ? 'max-lg:pb-24' : ''}">
    <span aria-hidden="true" class="halo -left-40 -top-32 h-96 w-96 bg-marino-claro/20"></span>
    <span aria-hidden="true" class="halo -right-24 top-1/3 h-[28rem] w-[28rem] bg-oro-rosa/10"></span>
    <span aria-hidden="true" class="halo -left-28 bottom-0 h-[22rem] w-[22rem] bg-oro-rosa/8"></span>
    ${arcos({ clase: '-bottom-28 -right-20 h-[34rem] w-[34rem] text-oro-rosa/45 max-lg:hidden' })}
    ${arcos({ n: 3, paso: 52, clase: '-bottom-24 left-[-7rem] h-[20rem] w-[20rem] text-oro-rosa/30 max-lg:hidden' })}

    <div aria-hidden="true" class="regla-oro"></div>
    <div class="relative border-b border-white/8 py-7">${cinta}</div>

    <div class="${CONTAINER} relative py-[clamp(48px,7vw,84px)]">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="/" class="flex items-center gap-3.5 no-underline">
            <img src="${LOGO}" alt="${escapeAttr(logoAlt)}" width="640" height="641" loading="lazy" class="h-14 w-14 rounded-full object-cover ring-1 ring-oro-rosa/60">
            <span>
              <span class="block font-display text-[1.2rem] font-semibold text-white">${DOCTORA.nombre}</span>
              <span class="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.25em] text-oro-rosa">${DOCTORA.subtitulo}</span>
            </span>
          </a>
          <p class="mt-6 max-w-[42ch] text-[1.1rem] leading-[1.7] text-white/60">
            Atención ginecológica profesional y confidencial en ${DIRECCION.lugar}, Col. Anzures, Miguel Hidalgo, CDMX.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="${waLink('Hola Dra. Lidia, quiero agendar una consulta.')}" target="_blank" rel="noopener" data-wa-label="wa_click_footer"
               class="inline-flex items-center gap-2.5 rounded-full bg-wsp px-5 py-2.5 text-[0.85rem] font-bold text-white no-underline transition duration-500 ease-suave hover:-translate-y-0.5 hover:bg-[#1fbe5b]">
              ${waIcon(18, 'blanco')} WhatsApp
            </a>
            <a href="tel:${DOCTORA.telefono}" class="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-5 py-2.5 text-[0.85rem] font-bold text-white no-underline transition duration-500 ease-suave hover:border-white hover:bg-white/10">
              ${DOCTORA.telefonoDisplay}
            </a>
          </div>
        </div>

        <nav aria-label="Servicios">
          <span class="mb-5 block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-oro-rosa">Servicios</span>
          <ul class="grid list-none gap-3">
            ${SERVICES.map((s) => enlace(`/${s.slug}/`, s.nombre)).join('')}
          </ul>
        </nav>

        <nav aria-label="Consultorio">
          <span class="mb-5 block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-oro-rosa">Consultorio</span>
          <ul class="grid list-none gap-3">
            ${enlace('/conoce/', 'La doctora')}
            ${TESTIMONIOS.length ? enlace('/testimonios/', 'Testimonios') : ''}
            ${ARTICULOS.length ? enlace('/blog/', 'Blog') : ''}
            ${enlace('/contacto/#comollegar', 'Ubicación y acceso')}
            ${enlace('/contacto/', 'Contacto y citas')}
            ${enlace('/#servicios', 'Todos los servicios')}
            ${enlace('/aviso-de-privacidad/', 'Aviso de Privacidad')}
            ${enlace('/politica-de-cookies/', 'Política de Cookies')}
          </ul>
          <address class="mt-7 not-italic text-[1.06rem] leading-[1.7] text-white/60">
            ${DIRECCION.calle}<br>${DIRECCION.municipio}, ${DIRECCION.cp}<br>${DIRECCION.region}, México
          </address>
        </nav>
      </div>
    </div>

    <div class="relative">
      <div aria-hidden="true" class="regla-oro opacity-70"></div>
      <div class="${CONTAINER} py-6">
        <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p class="text-[0.94rem] text-white/70">&copy; 2026 ${DOCTORA.nombreCompleto}. Todos los derechos reservados.</p>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.88rem] text-white/60">
            <a href="/aviso-de-privacidad/" class="enlace-linea hover:text-white transition-colors duration-300">Aviso de Privacidad</a>
            <span aria-hidden="true" class="text-white/20">·</span>
            <a href="/politica-de-cookies/" class="enlace-linea hover:text-white transition-colors duration-300">Política de Cookies</a>
          </div>
          <p class="flex items-center gap-2.5 text-[0.94rem] text-white/70">
            <span aria-hidden="true" class="text-oro-rosa">✦</span>
            Ginecóloga en Polanco, Ciudad de México.
          </p>
        </div>
        <div class="mt-4 border-t border-white/8 pt-4">
          <p class="text-[0.82rem] leading-relaxed text-white/55">
            ${DATOS_PROFESIONALES}
          </p>
        </div>
      </div>
    </div>
  </footer>`
}

/* ══════════════════════════════════════════════════════════════ shell ══ */

export function pageShell({ headHtml, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
${headHtml}
</head>
<body class="grano bg-lino antialiased">
${bodyHtml}
</body>
</html>`
}

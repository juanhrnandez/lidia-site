// Plantilla de Política de Cookies: /politica-de-cookies/
import { POLITICA_COOKIES } from '../data/legal.mjs'
import { DOCTORA, DOMAIN, physicianSchema } from '../data/site.mjs'
import {
  claridad,
  ctaFinal,
  footer,
  head,
  header,
  pageShell,
} from './layout.mjs'
import {
  CONTAINER,
  H1,
  H3,
  acento,
  btnGhost,
  btnWa,
  icono,
  rotulo,
  titulo,
} from './ui.mjs'

const PAD = 'py-[clamp(68px,9vw,130px)]'
const URL = `${DOMAIN}/politica-de-cookies/`

function cookiesSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: POLITICA_COOKIES.title,
      url: URL,
      description: POLITICA_COOKIES.description,
      mainEntity: { '@id': `${DOMAIN}/#physician` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Política de Cookies', item: URL },
      ],
    },
  ]
}

function hero() {
  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(36px,5vw,60px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -right-32 top-1/2 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-8">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">Política de Cookies</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[840px] text-center">
        <span class="entrada inline-block">${rotulo(POLITICA_COOKIES.eyebrow)}</span>

        ${titulo(`Política de ${acento('Cookies')}`, {
          tag: 'h1',
          modo: 'hero',
          clase: `${H1} text-marino mt-6`,
        })}

        <p class="entrada mx-auto mt-6 max-w-[56ch] text-[clamp(1.2rem,2vw,1.38rem)] font-medium leading-[1.65] text-tinta" style="--d:.4s">
          ${POLITICA_COOKIES.lead}
        </p>

        <div class="entrada mt-5 inline-flex items-center gap-2 rounded-full border border-marino/10 bg-white/70 px-4 py-1.5 text-[0.82rem] font-bold text-humo backdrop-blur-sm" style="--d:.5s">
          <span aria-hidden="true" class="h-2 w-2 rounded-full bg-oro-rosa"></span>
          <span>${POLITICA_COOKIES.fechaActualizacion}</span>
        </div>
      </div>
    </div>
  </section>`
}

function tablaCookies(filas) {
  return `
  <div class="mt-4 overflow-x-auto rounded-2xl border border-marino/10 bg-white">
    <table class="w-full min-w-[580px] text-left text-[0.96rem]">
      <thead>
        <tr class="border-b border-marino/10 bg-arena/60 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-marino">
          <th class="px-5 py-3.5">Nombre / Clave</th>
          <th class="px-5 py-3.5">Proveedor</th>
          <th class="px-5 py-3.5">Tipo</th>
          <th class="px-5 py-3.5">Finalidad</th>
          <th class="px-5 py-3.5">Duración</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-marino/8 text-humo">
        ${filas
          .map(
            (f) => `
          <tr class="transition-colors hover:bg-arena/30">
            <td class="px-5 py-3.5 font-mono text-[0.88rem] font-semibold text-marino">${f.nombre}</td>
            <td class="px-5 py-3.5">${f.proveedor}</td>
            <td class="px-5 py-3.5">${f.tipo}</td>
            <td class="px-5 py-3.5 leading-relaxed">${f.finalidad}</td>
            <td class="px-5 py-3.5 text-[0.85rem]">${f.duracion}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  </div>`
}

function cuerpoCookies() {
  const renderSeccion = (sec) => `
    <article id="${sec.id}" class="scroll-mt-[120px] rounded-[1.5rem] border border-marino/8 bg-lino p-[clamp(24px,4vw,42px)] shadow-suave transition duration-500 hover:border-oro-rosa/40 hover:shadow-flotante">
      <h2 class="${H3} mb-4 text-marino">${sec.titulo}</h2>
      ${
        sec.contenido
          ? `<div class="grid gap-4 text-[1.12rem] leading-[1.78] text-humo [&_strong]:text-marino [&_a]:transition-colors [&_a]:duration-300">
        ${sec.contenido.map((p) => `<p>${p}</p>`).join('')}
      </div>`
          : ''
      }
      ${sec.tabla ? tablaCookies(sec.tabla) : ''}
    </article>`

  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mx-auto max-w-[920px] grid gap-6" data-anim-grupo>
        ${POLITICA_COOKIES.secciones.map(renderSeccion).join('\n')}
      </div>
    </div>
  </section>`
}

export function renderPoliticaCookies() {
  const headHtml = head({
    title: POLITICA_COOKIES.title,
    description: POLITICA_COOKIES.description,
    canonical: URL,
    ogType: 'website',
    ogAlt: POLITICA_COOKIES.ogAlt,
    ogImage: '/og/home.jpg',
    schema: cookiesSchema(),
  })

  const main = [
    hero(),
    cuerpoCookies(),
    claridad(),
    ctaFinal({
      titulo: 'Consulta médica ginecológica en Polanco',
      intro:
        'Si deseas agendar una cita o conocer más sobre los estudios ginecológicos disponibles, escríbenos directamente por WhatsApp.',
      waText: 'Hola Dra. Lidia, quiero agendar una consulta.',
      waLabel: 'wa_click_cookies_cta',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: 'Hola Dra. Lidia, quiero agendar una consulta.',
      waLabel: 'wa_click_cookies_header',
      logoAlt: POLITICA_COOKIES.logoAlt,
      tema: 'claro',
      activo: '',
    }),
    `<main id="contenido">${main}</main>`,
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}

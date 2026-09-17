/**
 * Dra. Lidia Chávez — motor de interacción y movimiento.
 *
 * El CSS hace el trabajo pesado de la animación (scroll-driven donde el
 * navegador lo soporta). Este archivo aporta lo que el CSS no puede:
 *   · partir titulares en palabras para la tipografía cinética
 *   · fallback de revelado con IntersectionObserver (Firefox)
 *   · estado del encabezado, menús, acordeón, visor de galería
 *   · contadores, vista previa del índice de servicios, botones magnéticos
 *
 * Todo es aditivo: sin JS la página se ve completa y estática.
 */
const GTAG_CONVERSION = 'AW-18297301316/OBhzCLm2tcocEMTS6pRE'

const $ = (sel, ctx = document) => ctx.querySelector(sel)
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)]

const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const scrollNativo = CSS.supports('animation-timeline', 'view()')
const escritorio = window.matchMedia('(min-width: 1024px)')
const puedeHover = window.matchMedia('(hover: hover) and (pointer: fine)')

/* ═══════════════ Conversiones de WhatsApp (antes que nada) ══════════════ */

// Va al principio a propósito: es lo único de este archivo que mide dinero. El
// listener es delegado sobre `document` y no depende de ningún nodo, así que
// funciona igual de bien aquí arriba — y deja de estar a merced de que las ~500
// líneas de animación de más abajo se inicialicen sin lanzar. Si alguna de
// ellas fallara en algún navegador, el módulo abortaría y este registro nunca
// llegaría a ocurrir.
//
// Un solo nombre de evento con parámetros, en lugar de un nombre por botón. El
// esquema anterior generaba 139 nombres distintos: 35 pasaban de los 40
// caracteres que admite GA4 (que los corta) y 7 quedaban fusionados tras el
// corte. Como parámetros, el servicio y la ubicación caben holgados (100
// caracteres) y admiten guiones, que en un nombre de evento están fuera de
// especificación.
//
// Los `data-wa-label` de las plantillas se conservan tal cual y se descomponen
// aquí: `wa_click_<servicio>_<ubicacion>`. La lista va de sufijo más específico
// a más general, porque `_header_movil` debe ganarle a `_header` y `_ctafinal`
// a `_cta`.
const WA_UBICACIONES = [
  'header_movil', 'header', 'hero', 'landing', 'proceso', 'faq', 'doctora',
  'ubicacion', 'ctafinal', 'ctafija', 'floating', 'footer', 'escena',
  'recorrido', 'orientacion', 'direccion', 'canal', 'cta',
  'primera', 'revision', 'estudios', 'prenatal', 'resultado',
]

function desglosarWa(label) {
  const cuerpo = label.replace(/^wa_click_/, '')
  for (const u of WA_UBICACIONES) {
    if (cuerpo === u) return { servicio: 'general', ubicacion: u }
    if (cuerpo.endsWith(`_${u}`)) {
      return { servicio: cuerpo.slice(0, -(u.length + 1)), ubicacion: u }
    }
  }
  // El CTA dentro del cuerpo de un artículo es `wa_click_blog_<id>`, sin sufijo
  // de posición. Se le da el suyo para que no caiga en el cajón de sastre y para
  // que coincida con el servicio de su cabecera y su botón flotante.
  if (cuerpo.startsWith('blog_')) return { servicio: cuerpo, ubicacion: 'articulo' }
  return { servicio: cuerpo || 'general', ubicacion: 'otro' }
}

document.addEventListener('click', (e) => {
  const enlace = e.target.closest('[data-wa-label]')
  if (!enlace || typeof gtag !== 'function') return

  const label = enlace.dataset.waLabel
  const href = enlace.getAttribute('href') || ''

  // El botón de teléfono de /contacto/ comparte el atributo pero no es un clic
  // de WhatsApp: hasta ahora disparaba la conversión de Ads por una llamada.
  if (href.startsWith('tel:')) {
    gtag('event', 'telefono_click', {
      ubicacion: 'contacto',
      link_url: href,
      transport_type: 'beacon',
    })
    return
  }

  const { servicio, ubicacion } = desglosarWa(label)
  gtag('event', 'whatsapp_click', {
    servicio,
    ubicacion,
    link_url: href,
    pagina: location.pathname,
    label, // el nombre antiguo, para poder cruzar con los datos históricos
    transport_type: 'beacon',
  })

  gtag('event', 'conversion', {
    send_to: GTAG_CONVERSION,
    value: 1.0,
    currency: 'MXN',
    transport_type: 'beacon',
  })
})

/* ══════════════════════════════════════════ 1. Tipografía cinética ══════ */

// Envuelve cada palabra en `<span class="pal"><span>…</span></span>` sin
// destruir el marcado interno (los <em>/<strong> del titular se conservan).
function partirEnPalabras(raiz) {
  const textos = []
  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) textos.push(walker.currentNode)

  let i = 0
  for (const nodo of textos) {
    if (!nodo.nodeValue.trim()) continue
    const frag = document.createDocumentFragment()
    for (const trozo of nodo.nodeValue.split(/(\s+)/)) {
      if (!trozo) continue
      if (!trozo.trim()) {
        frag.appendChild(document.createTextNode(trozo))
        continue
      }
      const pal = document.createElement('span')
      pal.className = 'pal'
      pal.style.setProperty('--i', i++)
      const interior = document.createElement('span')
      interior.textContent = trozo
      pal.appendChild(interior)
      frag.appendChild(pal)
    }
    nodo.parentNode.replaceChild(frag, nodo)
  }
}

const cineticos = $$('[data-cinetico]')
if (!menosMovimiento) cineticos.forEach(partirEnPalabras)

/* ═══════════════════════════════ 2. Revelado al hacer scroll (fallback) ══ */

// Numera los hijos de cada grupo: el CSS usa `--i` para escalonar la entrada.
$$('[data-anim-grupo]').forEach((grupo) => {
  ;[...grupo.children].forEach((hijo, i) => hijo.style.setProperty('--i', i))
})

// Con soporte nativo el CSS ya se encarga; aquí solo cubrimos el resto.
if (!menosMovimiento && !scrollNativo && 'IntersectionObserver' in window) {
  const observados = $$('[data-anim], [data-anim-grupo], [data-cinetico="scroll"]')
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        entrada.target.classList.add('visible')
        observador.unobserve(entrada.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  observados.forEach((el) => observador.observe(el))
}

/* ══════════════════════════════════════ 3. Marquesinas infinitas ════════ */

// Se duplica la pista para que el bucle a -100 % no deje hueco.
$$('.marquesina').forEach((m) => {
  const pista = $('.marquesina__pista', m)
  if (!pista) return
  const copia = pista.cloneNode(true)
  copia.setAttribute('aria-hidden', 'true')
  m.appendChild(copia)
})

/* ══════════════════════════════════ 4. Encabezado: estado y menús ═══════ */

const cabecera = $('[data-cabecera]')
const barraProgreso = $('[data-progreso]')

if (cabecera) {
  // Umbrales de intención: comparar con el fotograma anterior hace parpadear la
  // barra, porque la inercia del trackpad manda muchos eventos de 1-2px y basta
  // uno "hacia arriba" para revelarla. Acumulamos recorrido por sentido y solo
  // cambiamos de estado al superar el umbral; un microrrebote no cuenta.
  const ESCONDER = 64
  const MOSTRAR = 28
  const SOLIDO_ON = 24
  const SOLIDO_OFF = 8

  let ultimoY = window.scrollY
  let acumulado = 0
  let oculta = false
  let solido = false
  let enCola = false

  const actualizarCabecera = () => {
    enCola = false
    const y = Math.max(0, window.scrollY)
    const d = y - ultimoY
    ultimoY = y

    // Histéresis también aquí: rebotando alrededor del umbral, el fondo con
    // blur entraba y salía.
    const nuevoSolido = solido ? y > SOLIDO_OFF : y > SOLIDO_ON
    if (nuevoSolido !== solido) {
      solido = nuevoSolido
      cabecera.toggleAttribute('data-solido', solido)
    }

    // Cerca del inicio siempre visible.
    if (y <= 420) {
      acumulado = 0
      if (oculta) {
        oculta = false
        cabecera.removeAttribute('data-oculta')
        document.documentElement.removeAttribute('data-cabecera-oculta')
      }
      return
    }

    if (d === 0) return
    // Al cambiar de sentido se reinicia el recorrido acumulado.
    if (d > 0 !== acumulado > 0) acumulado = 0
    acumulado += d

    const siguiente = oculta ? acumulado > -MOSTRAR : acumulado > ESCONDER
    if (siguiente === oculta) return

    oculta = siguiente
    acumulado = 0
    cabecera.toggleAttribute('data-oculta', oculta)
    // Espejo en <html> para que lo pegajoso de debajo (la subnav de servicios)
    // se ancle sin un `:has()` que invalide estilos en toda la página.
    document.documentElement.toggleAttribute('data-cabecera-oculta', oculta)
  }

  const alScroll = () => {
    if (enCola) return
    enCola = true
    requestAnimationFrame(actualizarCabecera)
  }

  window.addEventListener('scroll', alScroll, { passive: true })
  actualizarCabecera()
}

// --- Menú móvil ---
const botonMenu = $('[data-menu-toggle]')
const panelMenu = $('#navLinks')

function setMenu(abierto) {
  if (!botonMenu || !panelMenu) return
  botonMenu.setAttribute('aria-expanded', String(abierto))
  panelMenu.toggleAttribute('data-open', abierto)
  document.body.style.overflow = abierto ? 'hidden' : ''
}

botonMenu?.addEventListener('click', () => {
  setMenu(botonMenu.getAttribute('aria-expanded') !== 'true')
})

panelMenu?.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    setMenu(false)
    cerrarDropdowns()
  }
})

// --- Submenú de servicios ---
const dropdowns = $$('[data-dropdown]')

function cerrarDropdowns(excepto = null) {
  for (const dd of dropdowns) {
    if (dd === excepto) continue
    const btn = $('[data-dropdown-btn]', dd)
    // Devolver el foco al botón si estaba dentro del panel que se cierra.
    if (dd.hasAttribute('data-open') && dd.contains(document.activeElement)) btn?.focus()
    dd.removeAttribute('data-open')
    btn?.setAttribute('aria-expanded', 'false')
  }
}

dropdowns.forEach((dd) => {
  const btn = $('[data-dropdown-btn]', dd)
  if (!btn) return

  btn.addEventListener('click', () => {
    const abierto = dd.hasAttribute('data-open')
    cerrarDropdowns()
    if (!abierto) {
      dd.setAttribute('data-open', '')
      btn.setAttribute('aria-expanded', 'true')
    }
  })

  // En escritorio el panel también abre por :hover (CSS); mantenemos
  // aria-expanded sincronizado con ese estado visual.
  dd.addEventListener('pointerenter', () => {
    if (escritorio.matches) btn.setAttribute('aria-expanded', 'true')
  })
  dd.addEventListener('pointerleave', () => {
    if (escritorio.matches && !dd.hasAttribute('data-open')) {
      btn.setAttribute('aria-expanded', 'false')
    }
  })
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-dropdown]')) cerrarDropdowns()
})

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  cerrarDropdowns()
  if (botonMenu?.getAttribute('aria-expanded') === 'true') {
    setMenu(false)
    botonMenu.focus()
  }
})

/* ══════════════════════════════════════════ 5. Acordeón de preguntas ════ */

const faqs = $$('[data-faq]')

faqs.forEach((item) => {
  const btn = $('[data-faq-btn]', item)
  btn?.addEventListener('click', () => {
    const abierto = item.hasAttribute('data-abierto')
    for (const otro of faqs) {
      otro.removeAttribute('data-abierto')
      $('[data-faq-btn]', otro)?.setAttribute('aria-expanded', 'false')
    }
    if (!abierto) {
      item.setAttribute('data-abierto', '')
      btn.setAttribute('aria-expanded', 'true')
    }
  })
})

/* ═══════════════════════════════════ 6. Contadores de cifras ════════════ */

const contadores = $$('[data-contador]')

// La cifra final ya está escrita en el HTML: se lee de ahí y solo se pone a
// cero justo antes de animar, para que sin JS (o si algo falla) siga visible.
if (contadores.length && !menosMovimiento && 'IntersectionObserver' in window) {
  const animarNumero = (el) => {
    const texto = el.textContent.trim()
    const destino = Number(texto)
    if (!Number.isFinite(destino)) return
    const decimales = (texto.split('.')[1] || '').length
    const duracion = 1500
    let inicio = null
    const paso = (ahora) => {
      inicio ??= ahora
      const t = Math.min(1, (ahora - inicio) / duracion)
      // easeOutExpo: arranca rápido y aterriza con suavidad en la cifra final.
      const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      el.textContent = (destino * e).toFixed(decimales)
      if (t < 1) requestAnimationFrame(paso)
      else el.textContent = texto
    }
    el.textContent = (0).toFixed(decimales)
    requestAnimationFrame(paso)
  }

  const obsCifras = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        obsCifras.unobserve(e.target)
        animarNumero(e.target)
      }
    },
    { threshold: 0.4 }
  )
  contadores.forEach((el) => obsCifras.observe(el))
}

/* ═════════════════════════ 7. Vista previa del índice de servicios ══════ */

const indice = $('[data-indice]')

if (indice && puedeHover.matches && !menosMovimiento) {
  const filas = $$('[data-preview]', indice)
  const visor = document.createElement('div')
  visor.className = 'preview'
  visor.setAttribute('aria-hidden', 'true')
  visor.innerHTML = '<img alt="" decoding="async">'
  document.body.appendChild(visor)
  const imagen = $('img', visor)

  // La tarjeta ya no persigue al cursor. Iba pegada al puntero y, al recorrer
  // la lista, tapaba el texto de la fila que se estaba leyendo; la doctora pidió
  // que apareciera y se quedara quieta en una zona. Dónde se queda lo decide el
  // CSS (.preview): aquí solo se elige qué foto se ve.
  filas.forEach((fila) => {
    fila.addEventListener('pointerenter', () => {
      imagen.src = fila.dataset.preview
      visor.setAttribute('data-activo', '')
    })
    fila.addEventListener('pointerleave', () => visor.removeAttribute('data-activo'))
  })

  indice.addEventListener('pointerleave', () => visor.removeAttribute('data-activo'))
}

/* ═══════════════════════════ 8. Botones magnéticos y brillo del cursor ══ */

if (puedeHover.matches && !menosMovimiento) {
  $$('.magnetico').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.28
      el.style.translate = `${dx}px ${dy}px`
    })
    el.addEventListener('pointerleave', () => (el.style.translate = ''))
  })
}

$$('.brillo').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  })
})

/* ═══════════════════════════════════════════ 9. Visor de galería ════════ */

const disparadores = $$('[data-lightbox]')

if (disparadores.length) {
  const fotos = disparadores.map((btn) => ({
    src: btn.dataset.lightbox,
    caption: btn.dataset.caption || '',
    // Hay fotos sin pie visible a petición de la doctora: el visor las muestra
    // sin rótulo, pero el alt siempre describe la escena.
    alt: btn.dataset.alt || btn.dataset.caption || '',
  }))
  let indiceFoto = 0
  let focoPrevio = null

  const visor = document.createElement('div')
  visor.setAttribute('role', 'dialog')
  visor.setAttribute('aria-modal', 'true')
  visor.setAttribute('aria-label', 'Visor de galería')
  visor.className =
    'fixed inset-0 z-[2000] hidden items-center justify-center bg-noche/96 p-4 backdrop-blur-md'
  visor.innerHTML = `
    <figure class="flex max-h-full w-full max-w-5xl flex-col items-center gap-5">
      <img data-visor-img src="" alt="" class="max-h-[74vh] w-auto max-w-full rounded-3xl object-contain shadow-alta transition-opacity duration-300">
      <figcaption class="text-center" aria-live="polite">
        <span data-visor-caption class="block font-display text-[1.05rem] font-semibold text-white"></span>
        <span data-visor-counter class="mt-1.5 block text-[0.8rem] uppercase tracking-[3px] text-oro-rosa-claro"></span>
      </figcaption>
    </figure>
    <button type="button" data-visor-cerrar aria-label="Cerrar visor"
            class="absolute right-4 top-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <button type="button" data-visor-prev aria-label="Foto anterior"
            class="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white max-sm:left-1 max-sm:h-10 max-sm:w-10">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button type="button" data-visor-next aria-label="Foto siguiente"
            class="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white max-sm:right-1 max-sm:h-10 max-sm:w-10">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`
  document.body.appendChild(visor)

  const img = $('[data-visor-img]', visor)
  const caption = $('[data-visor-caption]', visor)
  const counter = $('[data-visor-counter]', visor)
  const btnCerrar = $('[data-visor-cerrar]', visor)

  function mostrarFoto(i) {
    indiceFoto = (i + fotos.length) % fotos.length
    img.style.opacity = '0'
    const foto = fotos[indiceFoto]
    const pintar = () => {
      img.alt = foto.alt
      caption.textContent = foto.caption
      counter.textContent = `${indiceFoto + 1} / ${fotos.length}`
      img.style.opacity = '1'
    }
    img.onload = pintar
    img.onerror = pintar
    img.src = foto.src
    if (img.complete) pintar()
  }

  function abrirVisor(i) {
    focoPrevio = document.activeElement
    visor.classList.remove('hidden')
    visor.classList.add('flex')
    document.body.style.overflow = 'hidden'
    mostrarFoto(i)
    btnCerrar.focus()
  }

  function cerrarVisor() {
    visor.classList.add('hidden')
    visor.classList.remove('flex')
    document.body.style.overflow = ''
    focoPrevio?.focus()
  }

  disparadores.forEach((btn, i) => btn.addEventListener('click', () => abrirVisor(i)))
  btnCerrar.addEventListener('click', cerrarVisor)
  $('[data-visor-prev]', visor).addEventListener('click', () => mostrarFoto(indiceFoto - 1))
  $('[data-visor-next]', visor).addEventListener('click', () => mostrarFoto(indiceFoto + 1))
  // Cierra al pulsar fuera de la foto: el <figure> ocupa más ancho que la
  // imagen, así que comprobar solo `e.target === visor` dejaba zonas muertas.
  visor.addEventListener('click', (e) => {
    if (!e.target.closest('img, button')) cerrarVisor()
  })

  document.addEventListener('keydown', (e) => {
    if (visor.classList.contains('hidden')) return
    if (e.key === 'Escape') cerrarVisor()
    if (e.key === 'ArrowLeft') mostrarFoto(indiceFoto - 1)
    if (e.key === 'ArrowRight') mostrarFoto(indiceFoto + 1)
    if (e.key === 'Tab') {
      // Trampa de foco: el ciclo no puede escapar al contenido de fondo.
      const focables = $$('button', visor)
      const primero = focables[0]
      const ultimo = focables[focables.length - 1]
      if (!visor.contains(document.activeElement)) {
        e.preventDefault()
        primero.focus()
      } else if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
  })
}

/* ═══════════════════ 10. Navegación interna, progreso y CTA fija ════════ */

const enlacesSpy = $$('[data-spy-link]')
const ctaFija = $('[data-cta-fija]')
// Con scroll-driven nativo la barra la anima el CSS; aquí solo el fallback.
const progresoJs = barraProgreso && !scrollNativo

if (enlacesSpy.length || progresoJs || ctaFija) {
  const secciones = enlacesSpy.map((a) => document.getElementById(a.dataset.spyLink)).filter(Boolean)
  const subnav = $('[data-subnav]')
  let pendiente = false

  function marcarActiva(id) {
    for (const a of enlacesSpy) {
      const activo = a.dataset.spyLink === id
      a.toggleAttribute('data-activo', activo)
      if (activo) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
      // Mantiene el enlace activo a la vista dentro del carrusel horizontal.
      if (activo && subnav && a.offsetParent) {
        const lista = a.closest('ul')
        if (lista && lista.scrollWidth > lista.clientWidth) {
          const destino = a.offsetLeft - lista.clientWidth / 2 + a.offsetWidth / 2
          lista.scrollTo({ left: destino, behavior: menosMovimiento ? 'auto' : 'smooth' })
        }
      }
    }
  }

  function actualizar() {
    pendiente = false

    if (progresoJs) {
      const alcance = document.documentElement.scrollHeight - window.innerHeight
      const pct = alcance > 0 ? Math.min(1, Math.max(0, window.scrollY / alcance)) : 0
      barraProgreso.style.transform = `scaleX(${pct})`
    }

    if (ctaFija) {
      const mostrar = window.scrollY > window.innerHeight * 0.7
      ctaFija.toggleAttribute('data-visible', mostrar)
      ctaFija.setAttribute('aria-hidden', String(!mostrar))
      const enlace = $('a', ctaFija)
      if (enlace) enlace.tabIndex = mostrar ? 0 : -1
    }

    if (secciones.length) {
      // Activa la última sección cuyo inicio ya pasó la línea de lectura.
      const linea = 210
      let activa = secciones[0]
      for (const sec of secciones) {
        if (sec.getBoundingClientRect().top <= linea) activa = sec
      }
      // Al final de la página gana siempre la última sección.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        activa = secciones[secciones.length - 1]
      }
      marcarActiva(activa.id)
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(actualizar)
    },
    { passive: true }
  )
  window.addEventListener('resize', actualizar, { passive: true })
  actualizar()
}

/* ═════════════════════════════ 11. Carruseles con flechas ═══════════════ */

$$('[data-carrusel]').forEach((bloque) => {
  const pista = $('.carrusel', bloque)
  if (!pista) return
  const paso = () => pista.firstElementChild?.getBoundingClientRect().width ?? 320
  $('[data-carrusel-prev]', bloque)?.addEventListener('click', () => {
    pista.scrollBy({ left: -(paso() + 20), behavior: menosMovimiento ? 'auto' : 'smooth' })
  })
  $('[data-carrusel-next]', bloque)?.addEventListener('click', () => {
    pista.scrollBy({ left: paso() + 20, behavior: menosMovimiento ? 'auto' : 'smooth' })
  })
})

/* ═══════════════════════════ 12. Transiciones entre páginas ═════════════ */

$$('a[href^="/"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const destino = link.getAttribute('href')
    if (!destino || destino.startsWith('#') || link.getAttribute('target') === '_blank') return
    // Un ancla de la propia página no es una navegación: los enlaces del menú
    // se escriben absolutos ('/#servicios') para que funcionen desde cualquier
    // página, pero cuando ya estamos en esa página recargarla sería absurdo. Se
    // deja pasar el clic y el navegador hace el salto interno.
    const url = new URL(destino, location.href)
    if (url.hash && url.pathname === location.pathname) return
    // Respeta abrir en pestaña/ventana nueva y los clics que no son del principal.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    // Si el navegador no soporta View Transitions, la salida se hace por CSS.
    if (!document.startViewTransition && !menosMovimiento) {
      e.preventDefault()
      document.body.classList.add('saliendo')
      setTimeout(() => {
        window.location.href = destino
      }, 200)
    }
  })
})

// Al volver con Atrás desde el bfcache el DOM se restaura tal cual quedó: hay
// que deshacer el estado de salida y el bloqueo de scroll del visor/menú.
window.addEventListener('pageshow', () => {
  document.body.classList.remove('saliendo')
  document.body.style.overflow = ''
})

/* ═══════════════════════════ 13. Anclas tras cargar fuentes ═════════════ */

// Al abrir un enlace con ancla, el navegador salta antes de que carguen las
// fuentes web; cuando estas cambian la altura del texto el destino se desplaza.
if (location.hash) {
  const id = decodeURIComponent(location.hash.slice(1))
  let intentos = 0
  let cancelado = false

  const cancelar = () => {
    cancelado = true
  }
  // Si la usuaria toma el control del scroll, dejamos de reposicionar.
  ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
    window.addEventListener(ev, cancelar, { once: true, passive: true })
  )

  const ajustar = () => {
    if (cancelado) return
    const destino = document.getElementById(id)
    if (!destino) return
    // 'instant' y no 'auto': con scroll-smooth en el html, 'auto' heredaría la
    // animación y cada reintento reiniciaría el desplazamiento.
    destino.scrollIntoView({ behavior: 'instant', block: 'start' })
    // El layout sigue asentándose durante los primeros cientos de ms;
    // repetimos hasta converger en la posición definitiva.
    if (++intentos < 6) setTimeout(ajustar, 120)
  }

  if (id) {
    ajustar()
    window.addEventListener('load', ajustar)
    document.fonts?.ready.then(ajustar)
  }
}

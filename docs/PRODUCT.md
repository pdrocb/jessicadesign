# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Novias y familias que planean una boda o una celebración en el Hudson Valley y ya vieron treinta sitios de bodas antes de llegar aquí. Llegan saturadas de opciones que se parecen entre sí, muchas veces desde el teléfono, y deciden por sensibilidad estética y confianza — no por lista de features ni por precio publicado.

La mayoría llega con un tablero de Pinterest ya armado y sin lenguaje técnico para describir lo que quiere. Su trabajo en este sitio es uno solo: decidir si el ojo de Jessica es el ojo correcto para su día, y pedir una conversación.

## Product Purpose

Posicionar a Jessica S. Designs en el rango premium/editorial del mercado de bodas del Hudson Valley y convertir visitas en *inquiries*. El éxito se mide en solicitudes de consulta de gente que ya entendió qué hace Jessica y qué no — no en volumen de tráfico.

El sitio anterior (Wix) se siente genérico y diluye el trabajo; también usa tres nombres distintos para el mismo negocio. Este rediseño existe para que la calidad del sitio iguale la calidad del trabajo fotografiado.

## Positioning

Jessica es **la capa de diseño de la celebración, y además es dueña del nivel de mesa**.

Tiene inventario propio de los detalles pequeños — mantelería, cubertería, velas, vajilla, caminos de mesa. No es propietaria de mesas ni sillas, pero puede conseguirlas y proveerlas. Eso significa que la superficie que el invitado toca y fotografía durante toda la noche es materialmente suya, no de una rentadora que interpretó un moodboard.

El límite es deliberado y es parte del posicionamiento, no una carencia: su trabajo **roza** el de una event planner, y ella no se vende así **por decisión propia** — no quiere la responsabilidad de llevar el evento completo. Trabaja junto al planner, florista y venue del cliente.

Esto tiene una consecuencia que todo trabajo futuro debe respetar: el sitio nunca debe sugerir que JSD dirige la logística, el timeline o los proveedores del evento. Prometer eso le vende un trabajo que ella rechazó a propósito.

**Quality over quantity** (brief de la clienta, ago 2026): toma deliberadamente menos bodas y eventos para dar una experiencia de diseño más personal y hands-on a cada cliente. Es el tono premium correcto — escasez sin hablar de precio — y el sitio puede decirlo explícitamente.

**Silk florals** (brief de la clienta, ago 2026): línea creciente de la marca. JSD ofrece florales de seda elevados — como alternativa a la flor fresca, como *rental* al cliente, o en diseños **híbridos** de seda + fresca. Matiz importante: para flor fresca Jessica sigue trabajando junto al florista del cliente; en seda, ella **sí es la proveedora**. Redactar sin invadir el rol del florista ni sugerir que dirige proveedores.

**El "vision gap" es el momento de venta.** La clienta lo dijo así: los clientes llegan con una visión — o sin saber cómo armarla — y ella desarrolla el look & feel completo y une todos los detalles con cohesión. La reacción que el sitio debe producir: *"This is more than decorating. She is going to take my vision, thoughtfully design the entire aesthetic, and make everything feel cohesive and beautiful."*

## Operating Context

- La entrada es un formulario de *inquiry* que agenda una **consulta gratuita de una hora**. Está confirmado: aparece textual en su sitio vigente — *"Head on over to our inquiry tab to schedule a free 1 hour consultation to learn more about our services!"*
- El formulario vigente (jessicasalomondesigns.com/contact) pide: nombre, email, tipo de celebración, teléfono de contacto para la consulta, fecha del evento, nombre y ubicación del venue, número de invitados, link al tablero de Pinterest, y una descripción libre de la visión. Lleva calendario integrado para elegir horario.
- **El tablero de Pinterest es un artefacto real de su proceso**, no un adorno: lo pide en el formulario y lo menciona en su propio "about" (*"My aim is to bring your Pinterest vision board to life, while adding some of my own expertise"*).
- La página "Book Online" del sitio vigente está vacía ("Nothing to book right now").

### El proceso de diseño (confirmado por la clienta, ago 2026)

La clienta definió su proceso completo y quiere que el sitio lo destaque — es parte central de la experiencia que vende. Seis pasos, en este orden:

1. Desarrollo del **concepto de diseño**.
2. **Design deck** a medida.
3. **Selección y sourcing** de décor y rentals.
4. **Floor plans**, cuando hacen falta.
5. **Mock-up presencial** — prueba diferenciadora fuerte; poquísimos competidores lo ofrecen.
6. **Styling y ejecución** el día del evento.

Esto sustituye la incógnita anterior de "qué ocurre después de la consulta": la consulta gratuita desemboca en este proceso. Lo que sigue sin definirse (y no se inventa) es la mecánica comercial — propuesta, cotización, contrato.

## Capabilities and Constraints

**Servicios confirmados** (cuatro, tal como los nombra su sitio vigente):

| Servicio         | Alcance                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| Weddings         | Diseño y styling completo, de concepto a ejecución                              |
| Celebrations     | Cumpleaños, bridal y baby showers, sweet 16, bar/bat mitzvahs, quinceañeras     |
| Luxury Picnics   | Picnics curados para cualquier ocasión                                          |
| Day-Of Set-Up    | Montaje del decor el día del evento, incluido decor DIY del cliente             |

**Tiene:** inventario propio de mantelería, cubertería, velas, vajilla, caminos de mesa y detalle pequeño de mesa. Además, **silk florals** propios para venta, rental al cliente y diseños híbridos.
**No tiene, pero puede conseguir:** mesas y sillas, y en general mobiliario y piezas mayores.
**No hace, por decisión:** planeación y responsabilidad integral del evento.

**El repertorio de detalle que el sitio debe mostrar** (brief de la clienta): tablescapes, velas, florales, signage, stationery, texturas, mobiliario, mantelería — todo lo que hace que el cuarto entero se sienta intencional.

**Regla de sourcing (PM, ago 2026):** al cliente final le es indiferente si una pieza es inventario propio o rentada de un tercero — y mucho probablemente se renta. El sitio **nunca expone esa mecánica**: no decir "lo rentamos" ni distinguir propio vs. conseguido. La única mención legítima de "rentals" es la inversa — los silk florals y piezas que JSD renta **al** cliente como parte de su oferta.

**Restricciones de información:**

- No hay precios ni mínimos publicados, ni en el sitio vigente ni acordados aquí. El sitio no debe insinuar rangos.
- **No se conoce una dirección de correo pública.** El único canal directo publicado es el teléfono `845-375-7820`. El formulario de inquiry **ya está construido** en `/inquire` (pantalla propia, nueve campos, estado de éxito), pero **no envía**: `handleSubmit` en `components/InquiryForm.tsx` es el único punto a conectar en cuanto exista el correo destino o un servicio de formularios. Hasta entonces el sitio no se puede publicar como canal de captación.
- **El auto-agendado del Wix no se reproduce** (decisión PM, ago 2026). El calendario público de la página vigente promete una disponibilidad que nadie mantiene; el horario de la consulta se acuerda en la respuesta al inquiry.
- Área de servicio: Hudson Valley, Nueva York — y viaja fuera.

## Brand Commitments

- **Nombre: "Jessica S. Designs", sigla "JSD". DECISIÓN CERRADA** (ago 2026) — la clienta entregó su logotipo y ahí está escrito. Sustituye a "J|S Events", que venía del handoff de diseño y nunca fue suyo. El sitio vigente usaba tres nombres distintos ("Jessica S. Designs", "JSE Event Design & Styling", "JS Design"); esta es la unificación.
- **Tagline: "Wedding & Event Design & Styling"**, también tomado del logotipo. Reemplaza al "+ Styling" del handoff.
- Razón social: J|S Events, Event Styling & Decorating Co. LLC. **No cambia** — es la entidad legal, y es normal que difiera del nombre comercial. Solo aparece en el aviso de copyright del footer y en `legalName` del JSON-LD.
- **Logotipo** (ago 2026): monograma J+S entrelazado, con "JESSICA S. DESIGNS" en versales serif cruzando el monograma a media altura, y debajo "Wedding & Event Design & Styling" en una sans ligera espaciada. **En el nav NO se usa esa línea inferior** (decisión PM): satura, y el tagline ya vive en el hero y en el footer.
- Voz: contenida, segura, sin superlativos huecos. Frases cortas. Nunca "¡El día de tus sueños!". El sitio va en **inglés**; la conversación con el PM, en español.
- Adjetivos de marca, en palabras de la clienta (ago 2026): *elevated, sophisticated, modern, warm, intentional — luxury, but still approachable*. Anti-referencias explícitas: corporativo, genérico, "traditional wedding décor company". Referencias visuales que ama: simplicityinmind.com (vintage-elegante) y nyflorale.com (flujo, color cálido con acentos) — quiere un punto medio entre vintage, elegante y moderno.
- Jessica Salomon, fundadora y creative director. Neoyorquina criada en el Bronx, madre de tres. Tiene experiencia previa en wedding y event planning, pero dejó la planeación para enfocarse exclusivamente en wedding design y styling.
- Canales existentes: Instagram [`jessicasalomondesigns__`](https://www.instagram.com/jessicasalomondesigns__) · Facebook [`celebratewithJess`](https://www.facebook.com/celebratewithJess) · teléfono 845-375-7820.

## Evidence on Hand

**Estado: preview para la clienta.** El material de abajo sigue sujeto a curaduría final. No hace falta volver a señalarlo en cada entrega.

- **Tres testimonios reales**, con nombre y contexto, en `lib/content.ts` (Brittney A., Yvette A., Emily G.). Son de clientas reales: no editar su texto.
- **Set general de fotografías** en `assets/`, descargadas del Wix vigente y complementadas por la clienta. Alimenta la home y las secciones de servicio.
- **Look Book inicial con 7 proyectos y 71 fotografías únicas**, importadas de la galería Wix en el orden publicado. Los originales se normalizaron a WebP, con 2000px máximos en el lado largo, y viven en `public/lookbook/`.
- **Existe más fotografía sin digitalizar** — archivo de eventos pasados fuera del Wix. Se incorporará al Look Book cuando se recopile.
- **Existe prensa o publicaciones reales**, aún sin recopilar. Hasta tener logos reales y permiso explícito, la sección "As Featured In" **no se publica**.

**Lo que NO existe y no se debe fabricar:** precios, paquetes, mínimos, número de bodas realizadas, premios, certificaciones, lista de venues asociados, casos de estudio, y cualquier testimonio más allá de los tres reales.

## Product Principles

1. **El diseño es el producto; la logística no.** Ninguna página debe implicar que JSD dirige el evento — ese trabajo ella lo rechaza a propósito.
2. **Nombrar lo específico gana a nombrar la categoría.** "Mantelería, velas y vajilla propias" prueba algo; "styling de lujo" no prueba nada y lo dice cualquiera.
3. **Se juzga por fotografías, no por adjetivos.** Cuando compitan espacio el copy y la imagen, gana la imagen.
4. **Todo camino lleva a una conversación, no a un precio.** El destino único es la consulta gratuita de una hora.
5. **Nunca fabricar prueba.** Sin logo real y permiso, no hay prensa; sin reseña real, no hay testimonio.

## Look Book

El Look Book es una sola página editorial en `/look-book`, no una colección de páginas individuales. Cada proyecto muestra una portada horizontal, contexto y una selección compacta de hasta cinco fotografías en el orden publicado. Las selecciones conservan ese orden en todas las resoluciones y usan marcos de proporción editorial con recorte suave: tres columnas como máximo en desktop y dos columnas proporcionales —no fijas— en tablet y mobile. Cualquier fotografía abre un visor de pantalla completa en su posición correspondiente; el CTA `View Full Gallery` abre el proyecto completo desde la primera fotografía.

El orden editorial es dato, no consecuencia del nombre del archivo: cada proyecto y cada fotografía tienen una posición explícita. La selección del home es una curaduría independiente con sus propias fotografías, formas, captions, orden y destinos; no cambia automáticamente al publicar proyectos. La implementación local del archivo vive en `lib/lookbook.ts` y la selección del home en `lib/content.ts`. Un CMS futuro deberá conservar ambos contratos para publicar, reordenar, administrar la portada horizontal de cada capítulo, curar el home, registrar dimensiones, focal point y tolerancia de recorte, y editar créditos sin cambiar los componentes del front.

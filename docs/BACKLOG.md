# Backlog de diseño y producto

Pendientes evaluados. Los ítems resueltos **se borran**, no se marcan como hechos.

## Bloquean producción

- **Formulario de inquiry.** Hoy el CTA "Inquire" marca por teléfono (`tel:`), el único canal real que da el handoff. Falta el overlay con formulario, endpoint, validación y confirmación. El molde está en `theclementine`: `components/Inquiry.tsx` + `app/api/inquiry/route.ts` + `emails/` (Resend + Neon).
- **Assets fotográficos propios.** Las fotos de `assets/` se descargaron del Wix vigente de la clienta. Sustituir por arte final optimizado antes de publicar.
- **Dominio propio.** Producción vive en `jessicadesign.vercel.app`, que ya es el `metadataBase` de `app/layout.tsx`. Actualizar ahí cuando se conecte un dominio real.
- **Favicon y open-graph.** Falta `app/icon.png` y `app/opengraph-image.png`. Depende de la decisión final sobre el logotipo.

## Pendientes de la fase impeccable

- **Escala tipográfica definitiva** — ¿escala modular o valores curados? Los actuales son interpolación anclada sobre los valores del handoff.
- **Sistema de motion** — reveals al scroll, transiciones de página, hover en imágenes.
- **Páginas internas** — Look Book, Luxury Picnics, Blog. Hoy los links del nav apuntan a anclas de la home o a `#`.
- **Dirección de fotografía** — color vs. monocromo, ratios oficiales, tratamiento. El prototipo tenía un toggle global de monocromo (`grayscale(1) contrast(1.02)`) que no se implementó por no tener decisión.
- **Faltan cuatro fotos del Look Book.** La clienta entregó tres (ago 13, 2026) que ya ocupan las dos celdas anchas y una cuadrada. Faltan **dos verticales 3/4** (hoy las cubren `hero-01-tablescape` y `hero-03-detail`, prestadas de otras secciones) y **dos cuadradas 1:1** (hoy `service-day-of` y `service-picnics`). Faltan también los **nombres reales de álbum** — los actuales describen la foto.
- **Estados de foco definitivos.** Hoy es provisional: `outline: 1px solid currentColor`.
- **Logotipo** — pendiente pedirle a su diseñador una **versión horizontal** (monograma a la izquierda, nombre a la derecha). El lockup apilado que entregó no cabe legible en una barra de nav; hoy se resuelve encogiéndolo al colapsar el nav, que es un parche. Falta además el favicon.
- **"As Featured In"** — solo se publica con logos reales y permiso.

## Decisiones tomadas que conviene recordar

- La fila 2 del nav mide 45px en mobile, no los 37px del handoff: los targets táctiles de 44px ganan.
- El H1 es uno solo en el documento; cambia de ancla (`relative` → `md:static`) en vez de duplicarse por breakpoint.

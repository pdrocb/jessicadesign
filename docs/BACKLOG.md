# Backlog de diseño y producto

Pendientes evaluados. Los ítems resueltos **se borran**, no se marcan como hechos.

## Bloquean producción

- **Entrega por correo de inquiries.** El formulario, endpoint, validación y persistencia en Neon ya están activos. Cuando el dominio y el remitente estén verificados, conectar Resend para enviar aviso interno y confirmación a la pareja, actualizando los campos `email_status`, `internal_email_id` y `client_email_id`.
- **Assets fotográficos propios.** Las fotos de `assets/` se descargaron del Wix vigente de la clienta. Sustituir por arte final optimizado antes de publicar.
- **Dominio propio.** Producción vive en `jessicadesign.vercel.app`. Actualizar la URL canónica desde Site Settings cuando se conecte el dominio real.

## Pendientes de la fase impeccable

- **Escala tipográfica definitiva** — ¿escala modular o valores curados? Los actuales son interpolación anclada sobre los valores del handoff.
- **Sistema de motion** — reveals al scroll, transiciones de página, hover en imágenes.
- **Páginas internas restantes** — Luxury Picnics y Blog. No se publican ni aparecen en el nav hasta tener contenido real.
- **Recuperación de contraseña del CMS.** Neon Auth ya soporta el cambio y recuperación; falta exponer la interfaz cerrada y conectar el correo mediante Resend cuando el dominio esté listo.
- **Dirección de fotografía** — color vs. monocromo, ratios oficiales, tratamiento. El prototipo tenía un toggle global de monocromo (`grayscale(1) contrast(1.02)`) que no se implementó por no tener decisión.
- **Estados de foco definitivos.** Hoy es provisional: `outline: 1px solid currentColor`.
- **Logotipo** — pendiente pedirle a su diseñador una **versión horizontal** (monograma a la izquierda, nombre a la derecha). El lockup apilado que entregó no cabe legible en una barra de nav; hoy se resuelve encogiéndolo al colapsar el nav, que es un parche. Falta además el favicon.
- **"As Featured In"** — solo se publica con logos reales y permiso.

## Decisiones tomadas que conviene recordar

- La fila 2 del nav mide 45px en mobile, no los 37px del handoff: los targets táctiles de 44px ganan.
- El H1 es uno solo en el documento; cambia de ancla (`relative` → `md:static`) en vez de duplicarse por breakpoint.

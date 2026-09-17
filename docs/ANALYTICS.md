# Analítica

Contrato operativo de Jessica S. Designs para `dataLayer` → Google Tag Manager → Google Analytics 4.

## Estado de implementación — 2026-09-16

- GTM: versión 2 publicada, `JSD GA4 routing and semantic events`, con 13 etiquetas, 13 activadores y 13 variables personalizadas.
- GA4 DEV y PROD: 12 dimensiones de alcance Evento creadas en cada propiedad; `generate_lead` registrado como evento clave, una vez por evento y sin valor monetario predeterminado; retención de eventos configurada a 14 meses.
- Medición mejorada: formularios desactivados en ambos streams; las vistas de página y navegación por historial permanecen activas.
- Validación local con Tag Assistant: destino DEV y disparo de `section_view`, `look_book_click`, `inquire_click`, `gallery_open`, `faq_open`, `form_view`, `form_start`, `form_error`, `contact_click` y `social_click`. DebugView DEV confirmó recepción de eventos. `/admin/login` no carga scripts de GTM.
- Pendiente: prueba de envío real para `form_submit` y `generate_lead`, con dirección de prueba confirmada por el PM.
- Pendiente: desplegar el código local de analítica. La página pública `jessicadesign.vercel.app` revisada en esta sesión todavía no cargaba GTM; redesplegar el mismo commit no incorpora archivos locales sin publicar. Validación del dominio definitivo pendiente de su conexión a Vercel.

## Arquitectura

- Contenedor único de GTM: `GTM-TBFTMNV7`.
- Dos propiedades GA4 independientes, cada una con su propio web data stream y Measurement ID:
  - `Jessica Designs - DEV`: `G-EC07MZ5MRN`.
  - `Jessica Designs - PROD`: `G-09YDVRT23T`.
- El sitio solo carga GTM en el route group público `app/(site)`. `/admin` y sus pantallas no cargan el contenedor.
- El código solo publica eventos semánticos al `dataLayer`; GTM decide el destino con una Lookup Table basada en `Page Hostname`.
- Hostnames desconocidos no tienen valor por defecto y, por lo tanto, no envían datos a ninguna propiedad.

## Routing por hostname

Crear una variable Lookup Table llamada `LT - GA4 Measurement ID` con `Page Hostname` como variable de entrada:

| Page Hostname | Salida |
| --- | --- |
| `localhost` | `G-EC07MZ5MRN` (DEV) |
| `127.0.0.1` | `G-EC07MZ5MRN` (DEV) |
| `jessicadesign.vercel.app` | `G-EC07MZ5MRN` (DEV) |
| `jessicasalomondesigns.com` | `G-09YDVRT23T` (PROD) |
| `www.jessicasalomondesigns.com` | `G-09YDVRT23T` (PROD) |

No activar `Set Default Value`. Las URLs temporales de deployments de Vercel quedan fuera deliberadamente.

## Contrato de eventos

| Evento | Cuándo ocurre | Parámetros |
| --- | --- | --- |
| `look_book_click` | Una visitante elige un enlace hacia el Look Book | `link_location` |
| `inquire_click` | Una visitante elige un CTA hacia Inquire | `link_location` |
| `section_view` | Al menos 15% de una sección entra al viewport por primera vez en esa visita de ruta | `section_name` |
| `gallery_open` | Se abre una galería del Look Book | `project_slug`, `gallery_entry_point` |
| `faq_open` | Se abre una pregunta que estaba cerrada | `faq_id` |
| `form_view` | Al menos 15% del formulario entra al viewport | — |
| `form_start` | Primera edición real de un campo | `form_field` |
| `form_submit` | Intento de envío que superó la validación nativa | — |
| `form_error` | Error de validación o entrega | `error_type`, `error_field` cuando aplica |
| `generate_lead` | Neon confirma que guardó el inquiry | `event_type`, `guest_range` |
| `contact_click` | Click en teléfono o correo | `contact_method`, `link_location` |
| `social_click` | Click hacia una red social | `social_network`, `link_location` |

`gallery_entry_point` usa `cover`, `preview` o `full_gallery`. `guest_range` usa `1_49`, `50_99`, `100_149`, `150_199` o `200_plus`.

El embudo primario es:

`page_view → inquire_click → form_view → form_start → form_submit → generate_lead`

El recorrido editorial es:

`page_view → look_book_click → gallery_open → inquire_click`

## Privacidad y calidad

Nunca se envían a GTM o GA4: nombre, email, teléfono, fecha exacta, venue, URL de Pinterest, texto de la visión ni ID interno del lead.

Cada `form_error` incluye explícitamente `error_field`, incluso cuando su valor es `undefined`, para limpiar el campo retenido por GTM tras un error anterior cuando el siguiente error no corresponde a ningún campo.

El endpoint responde `accepted: true` solo después de persistir en Neon. El honeypot responde `accepted: false`; la UI muestra el mismo estado de éxito para no revelar la defensa, pero no dispara `generate_lead`.

En ambos web data streams de GA4, desactivar **Form interactions** dentro de Enhanced Measurement. Los eventos `form_start` y `form_submit` son propios y dejar la detección automática activa los duplicaría. Mantener activados los page views y la detección de cambios en el historial del navegador para navegación App Router.

## Configuración en GTM

### 1. Variables integradas

En **Variables → Configure**, habilitar:

- `Page Hostname`
- `Page Path`
- `Page URL`
- `Event`

### 2. Variables del dataLayer

Crear una variable de tipo **Data Layer Variable**, versión 2, por cada nombre. Usar la convención `DLV - nombre`:

- `link_location`
- `section_name`
- `project_slug`
- `gallery_entry_point`
- `faq_id`
- `form_field`
- `error_type`
- `error_field`
- `event_type`
- `guest_range`
- `contact_method`
- `social_network`

No existe `form_id`: el proyecto solo tiene un formulario y no corre experimentos sobre él.

### 3. Activador del Google tag

Crear `Initialization - Known Hosts`:

- Tipo: **Initialization**.
- Seleccionar **Some Initialization Events**.
- Condición: `LT - GA4 Measurement ID` **matches RegEx** `^G-`.

### 4. Google tag base

Crear `GA4`:

- Tipo: **Google tag**.
- Tag ID: `{{LT - GA4 Measurement ID}}`.
- Trigger: `Initialization - Known Hosts`.

La propiedad DEV o PROD se decide en tiempo de ejecución; no se crean dos tags base. Esta etiqueta inicializa Analytics y permite el envío automático de `page_view` y la medición mejorada.

### 5. Activador de custom events

Crear un activador por evento con el nombre `CE - nombre_del_evento`, según la tabla siguiente:

- Tipo: **Custom Event**.
- Event name: nombre exacto del evento, sin el prefijo `CE -`.
- No activar **Use regex matching**.
- Seleccionar **Some Custom Events**.
- Condición adicional: `LT - GA4 Measurement ID` **matches RegEx** `^G-`.

### 6. Etiquetas individuales de eventos GA4

Crear una etiqueta por evento con el nombre `GA4 - nombre_del_evento`:

- Tipo: **Google Analytics: GA4 Event**.
- Measurement ID: `{{LT - GA4 Measurement ID}}`.
- Event Name: nombre exacto del evento, sin el prefijo `GA4 -`.
- Event Parameters: incluir únicamente los parámetros de esa fila. Cada parámetro `nombre` usa `{{DLV - nombre}}` como valor.

| Etiqueta | Activador | Parámetros |
| --- | --- | --- |
| `GA4 - look_book_click` | `CE - look_book_click` | `link_location` |
| `GA4 - inquire_click` | `CE - inquire_click` | `link_location` |
| `GA4 - section_view` | `CE - section_view` | `section_name` |
| `GA4 - gallery_open` | `CE - gallery_open` | `project_slug`, `gallery_entry_point` |
| `GA4 - faq_open` | `CE - faq_open` | `faq_id` |
| `GA4 - form_view` | `CE - form_view` | — |
| `GA4 - form_start` | `CE - form_start` | `form_field` |
| `GA4 - form_submit` | `CE - form_submit` | — |
| `GA4 - form_error` | `CE - form_error` | `error_type`, `error_field` cuando aplica |
| `GA4 - generate_lead` | `CE - generate_lead` | `event_type`, `guest_range` |
| `GA4 - contact_click` | `CE - contact_click` | `contact_method`, `link_location` |
| `GA4 - social_click` | `CE - social_click` | `social_network`, `link_location` |

No fijar valores por defecto a las variables del dataLayer. Los parámetros opcionales que no apliquen al evento actual no deben heredar datos de interacciones anteriores; verificar especialmente `error_field` en Preview.

## Configuración en GA4

Repetir en DEV y PROD:

1. En **Admin → Data display → Custom definitions**, crear dimensiones custom de alcance **Event** para los 12 parámetros del dataLayer.
2. En **Admin → Data display → Events/Key events**, marcar `generate_lead` como key event. Usar el conteo **Once per event**.
3. Desactivar Enhanced Measurement → **Form interactions**.
4. Mantener Enhanced Measurement → **Page views** y **Page changes based on browser history events**.
5. Mantener activas las demás opciones de medición mejorada configuradas por el PM: desplazamientos, clics de salida, búsquedas internas, videos y descargas.
6. Configurar la retención de datos de eventos en **14 meses**.

Los nombres visibles de las 12 dimensiones, todas de alcance **Event**, son:

| Nombre visible | Parámetro |
| --- | --- |
| Link location | `link_location` |
| Section name | `section_name` |
| Project slug | `project_slug` |
| Gallery entry point | `gallery_entry_point` |
| FAQ ID | `faq_id` |
| Form field | `form_field` |
| Error type | `error_type` |
| Error field | `error_field` |
| Event type | `event_type` |
| Guest range | `guest_range` |
| Contact method | `contact_method` |
| Social network | `social_network` |

El evento automático `click` de medición mejorada y los eventos semánticos `contact_click`/`social_click` pueden representar la misma interacción desde perspectivas distintas; no sumarlos como acciones independientes en los reportes. Del mismo modo, `scroll` mide profundidad general y `section_view` visibilidad de secciones.

## Validación antes de publicar GTM

1. Abrir **Preview** en GTM y conectar `http://localhost:<puerto>`.
2. Confirmar que `LT - GA4 Measurement ID` devuelve `G-EC07MZ5MRN` (DEV).
3. Recorrer Home, Look Book e Inquire; verificar en cada custom event que solo lleve sus parámetros permitidos.
4. Enviar un inquiry real de prueba y confirmar exactamente un `form_submit` y un `generate_lead`.
5. Confirmar en GA4 DEV → DebugView que llegan eventos y page views sin duplicados.
6. Repetir sobre `jessicadesign.vercel.app`; debe llegar a DEV.
7. Tras conectar el dominio, repetir en `www.jessicasalomondesigns.com`; debe llegar a `G-09YDVRT23T` (PROD).
8. Abrir `/admin`; no debe descargarse `gtm.js` ni aparecer ningún hit.
9. Publicar el contenedor con nombre de versión descriptivo, por ejemplo `JSD GA4 routing and semantic events`.

Este documento define la configuración aprobada y los criterios de aceptación; por sí mismo no certifica que la configuración externa esté publicada ni que la validación se haya completado.

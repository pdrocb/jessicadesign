# CMS interno

El sitio incluye un CMS mobile-first en `/admin`. Vive en `cms/` como un módulo interno separado de la marca para que su estructura pueda copiarse y adaptarse en proyectos futuros sin convertirlo en un producto multi-tenant.

## Alcance actual

- Login por correo y contraseña administrado por Neon Auth, con sesión firmada del CMS por 30 días.
- Lista privada `cms_access`: tener una identidad en Neon Auth no concede acceso al CMS.
- Varios usuarios con el mismo nivel operativo; no existen roles ni permisos en la interfaz.
- Edición integral de Home: copy, fotografías, textos alternativos y contenido del modal de Founder.
- Editores de página para Look Book e Inquire: encabezado, introducción, meta title y meta description; sus componentes operativos permanecen versionados.
- Colecciones fijas para Expertise y Process: sus elementos se editan, pero no se crean, eliminan ni reordenan.
- Colecciones ordenadas para Testimonials y FAQs: permiten editar, crear, eliminar y mover elementos sin copiar contenido entre campos.
- Creación, edición, publicación y orden de proyectos del Look Book, incluida la portada, la carga, el orden y la eliminación de fotografías.
- SEO por página para Home, Look Book e Inquire; Site Settings conserva la identidad canónica, un solo título e imagen Open Graph, favicon y datos públicos de contacto/social.
- Formulario público con sus nueve campos obligatorios conectado a `leads`, más bandeja operativa de inquiries con búsqueda, filtros, detalle, contacto y estado leído/nuevo.
- Fallback al contenido local si la base no está disponible, para que el sitio público siga funcionando.

Vercel Blob almacena todas las fotografías que se sustituyen desde el CMS: Home, Look Book, favicon y Open Graph. El sitio incluye un favicon inicial PNG en `public/favicon.png` y una imagen Open Graph inicial optimizada en `public/site/open-graph.webp`; Site Settings permite sustituir ambos sin cambios de código. Home reutiliza las portadas del mismo store de proyectos. Resend se conectará junto con el dominio para entregar inquiries y, posteriormente, recuperación de contraseña.

## Estructura reutilizable

```text
app/admin/                  rutas y layouts de Jessica
app/api/auth/               handler oficial de Neon Auth
app/api/inquiry/            endpoint público validado
cms/
  auth/                     Neon Auth, sesión firmada, autorización y acciones de acceso
  components/               shell y editores mobile-first
    ui/                     campos y controles neutrales reutilizados
  config/site.ts            nombre del sitio y esquema editable
  content/                  documentos de páginas
  database/                 cliente Neon
  inquiries/                validación, persistencia y consultas
  media/                    política, conversión WebP y validación compartida
  projects/                 repositorio y acciones del Look Book
  settings/                 identidad global, Open Graph, favicon y contacto
  styles/                   tokens semánticos y geometría de controles
db/migrations/              esquema SQL versionado
db/init.mjs                 inicialización idempotente
scripts/create-cms-user.mjs alta de identidades autorizadas
```

Para reutilizarlo en Florale o The Clementine se copia `cms/`, se cambia `cms/config/site.ts`, se crean rutas propias bajo `/admin` y se aplica la migración en la base Neon de ese proyecto. Las bases, sesiones y usuarios no se comparten entre marcas.

## Sistema visual

El CMS es una superficie operativa independiente del sistema visual del sitio público. Usa una interfaz neutral y reusable: tipografía de sistema, superficies grises cálidas, acción primaria en tinta, foco accesible y una retícula estable orientada a formularios. No hereda la serif, la paleta ni la composición editorial de Jessica S. Designs.

La marca aparece únicamente como contexto de la instalación mediante `CmsBrand`. Al copiar el módulo a otro proyecto se sustituye el asset del logotipo y `cms/config/site.ts`; la navegación, jerarquía, densidad y estados permanecen iguales. `CmsIcon` concentra la iconografía SVG funcional para evitar dependencias externas y símbolos tipográficos inconsistentes.

Los tokens neutrales viven en `cms/styles/tokens.css`; `controls.css` define la geometría y los estados compartidos. `CmsField` y `CmsButton` encapsulan el contrato accesible y visual usado por Home, Site Settings, Projects y Login. `CmsPageHeader`, `CmsEditorChrome` y `CmsUnsavedChangesGuard` unifican la jerarquía de página, los estados `Unsaved / Saving / Saved / Error` y la protección al abandonar cambios. Los layouts específicos continúan en `app/admin/admin.css` hasta que exista repetición suficiente para extraer otra primitiva.

`CmsImageField` presenta la imagen publicada —no su URL— como una miniatura compacta de referencia junto con recomendación, selector de archivo y texto alternativo cuando corresponde. La miniatura conserva el aspect ratio del archivo con `contain`; nunca crece al tamaño editorial ni recorta la imagen para simular su uso final. Toda carga de Home, Look Book y Site Settings pasa por `cms/media/`: acepta una fuente JPG, PNG cuando el campo lo permite, o WebP de hasta 10 MB, respeta su orientación, reduce su lado largo al máximo apropiado y genera un WebP nuevo en el navegador. El archivo original nunca se envía ni se conserva. El servidor vuelve a comprobar formato, peso y dimensiones y solo acepta el WebP normalizado. Si el resultado supera 1 MB, la interfaz recomienda una fuente menor sin bloquear el guardado. Todas las fotografías administradas de Home guardan archivo y alt en el documento `home`. Open Graph hace lo mismo en `site_settings`; las fotografías de proyectos conservan su archivo y permiten editar el `alt` existente. El favicon no lleva alt porque no es contenido renderizado para tecnologías asistivas.

Las rutas generadas por imports estáticos de Next (`/_next/...`) son específicas de cada build y nunca se persisten en Neon. Mientras una fotografía siga usando el asset incluido con el sitio, el documento omite esa clave y la lectura resuelve el fallback del deployment activo. Solo se guardan rutas públicas estables o URLs del Blob store; al subir un reemplazo, el CMS persiste esa URL durable.

El índice de Look Book es una superficie operativa: desde cada fila se cambia el orden, `Published` y `Show on Home`. `Published` controla el archivo público completo; `Show on Home` filtra hasta siete proyectos publicados para el mosaico de Home. No existe un segundo orden: ambos destinos obedecen `cms_projects.position`, y mover una fila actualiza los dos. Despublicar un proyecto también lo retira de Home. `New project` abre un flujo breve que exige título y primera portada, optimiza la fotografía antes de subirla y crea el proyecto como draft. Abrir una fila lleva a `/admin/projects/[projectId]`, donde una barra superior persistente reúne `All projects`, `View live project`, `Cancel` y la acción primaria `Save project`. La eliminación permanente vive separada al final, dentro de una zona de peligro y siempre mediante una confirmación explícita.

En cada proyecto, la fotografía en posición 1 es también `cover_image_id` y aparece como `Principal`. Las fotografías se presentan como una galería operativa —una columna en móvil, dos en tablet y tres en desktop— con la imagen completa, su orden, el alt y las acciones dentro de una sola unidad. La última tarjeta es `Add photographs`: acepta una o varias imágenes JPG o WebP de hasta 10 MB y crea inmediatamente una tarjeta de progreso por archivo. Optimiza hasta tres imágenes en paralelo mediante la política compartida y después publica los WebP secuencialmente en Vercel Blob para conservar el orden seleccionado y evitar colisiones de posición en Neon. Si un resultado todavía supera 1 MB, su tarjeta muestra una recomendación no bloqueante para usar una imagen menor. Al terminar, cada foto aparece como una tarjeta ordinaria con su alt editable. El número de posición, `Principal`, subir, bajar y los tres puntos forman una barra superpuesta dentro de la fotografía; el menú conserva únicamente `Make principal` y `Delete`. La principal permanece anclada; para reemplazarla se usa `Make principal`. Al eliminar una foto se borra tanto de `cms_project_images` como de Vercel Blob; si era principal, la siguiente ocupa la posición 1. Un proyecto nunca puede quedarse sin fotografías. La interfaz aplica el cambio inmediatamente y revierte el estado si Neon rechaza la operación.

`homeSections` es el contrato único del editor de SEO, copy e imágenes propias de Home. Cada sección declara campos generales, grupos fijos con etiqueta operativa (`Expertise 1`, `Step 1`) o una colección ordenada. `HomeEditor`, la lista de claves permitidas, la validación de imágenes y la sanitización de lectura se derivan de ese mismo contrato. Testimonials y FAQs se guardan como arrays nativos dentro del JSONB `home`, con IDs estables y orden explícito; los registros planos de la versión anterior se migran durante la lectura. Los controles subir/bajar reemplazan el drag and drop para conservar accesibilidad y precisión táctil. El mosaico Look Book no aparece en este editor: sus proyectos, portadas y orden se administran desde Projects.

Las páginas `Look Book` e `Inquire` tienen documentos independientes en `cms_documents`, con `heading`, `introduction`, `metaTitle` y `metaDescription`. El CMS los presenta bajo Pages; `Projects` administra el archivo fotográfico y `Inquiries` la bandeja operativa. Si un documento no existe o Neon no está disponible, la ruta pública usa su copy versionado. Guardar invalida tanto la página pública como su editor.

`createPageMetadata` recibe el meta title y la meta description del documento de cada página. Site Settings aporta un único `ogTitle` y una sola `ogImageUrl` para todo el sitio; la descripción Open Graph reutiliza la meta description de la ruta, de modo que compartir mantiene una identidad visual global sin perder contexto de página. Las instalaciones anteriores conservan en Home los valores `metaTitle` y `metaDescription` que estuvieran guardados en el documento histórico de Site Settings hasta que Home se vuelva a guardar.

Toda eliminación iniciada desde el CMS pasa por `CmsConfirmDialog`; no se usan diálogos del navegador. El componente nombra el objeto y la consecuencia, enfoca `Cancel` al abrir, conserva Escape y clic exterior, bloquea un segundo envío mientras una operación remota está pendiente y devuelve el foco al cerrar. Testimonials y FAQs aclaran que el cambio permanece en el borrador hasta guardar Home; las fotografías y los proyectos aclaran que la eliminación en Neon es inmediata. Las futuras eliminaciones de galerías reutilizarán el mismo contrato.

Home presenta SEO como sección propia y el contenido en cuatro capítulos operativos —Opening, Services, Story & Proof y Closing— sin modificar el resto del documento persistido. Home, Site Settings y Project Editor conservan cambios fallidos, abren la sección que contiene el campo inválido y enfocan ese control para corregirlo. Los enlaces internos interceptan una salida con cambios pendientes mediante una confirmación neutral; `beforeunload` cubre recargas y cierres de pestaña.

Inquiries carga hasta 100 registros recientes y filtra en cliente por nombre, email, teléfono, celebración o venue. La lista separa `New` y `Read`; el detalle reúne hechos, notas, moodboard y acciones `mailto:`/`tel:`. Cambiar el estado es una operación optimista que revierte y explica el fallo si Neon rechaza la actualización. Resend no es requisito para revisar o responder manualmente.

Eliminar un proyecto borra su registro y, mediante `ON DELETE CASCADE`, todas sus filas de `cms_project_images`; después compacta las posiciones restantes. Las URLs administradas se registran primero en `cms_blob_deletion_queue` dentro de la misma transacción. La limpieza elimina únicamente archivos que ya no estén referenciados por otra fotografía; si Vercel Blob falla, la fila permanece con el error y se reintenta al volver al índice. `cms_seed_state` distingue una base nunca inicializada de un Look Book vaciado deliberadamente, por lo que eliminar el último proyecto no vuelve a cargar el contenido semilla.

## Infraestructura

- Recurso Vercel Marketplace: `jessicadesign-db`.
- Neon project: `holy-forest-13064413`, región IAD, plan Free.
- Vercel Blob store público: `jessicadesign-media`, región IAD.
- Variables: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` y `BLOB_READ_WRITE_TOKEN`.
- `CMS_SITE_URL` es opcional para scripts locales; por defecto usa `http://localhost:3000` como origen, permitido por la configuración local de Neon Auth.
- Producción y Preview guardan el secreto como Sensitive. Vercel no permite esa marca en Development; en `NODE_ENV=development` la aplicación usa una clave local limitada a localhost, que nunca se emplea en un deployment.
- Neon Auth valida las credenciales. Después del login, el CMS emite una cookie `HttpOnly`, `SameSite=Lax` y firmada con `NEON_AUTH_COOKIE_SECRET`, válida durante 30 días. Cada request vuelve a comprobar `cms_access` y la fecha del hash de credenciales, por lo que desactivar el acceso o cambiar la contraseña revoca una cookie aunque todavía no haya vencido.

Para inicializar o actualizar el esquema:

```bash
npm run db:init
```

Las migraciones se ejecutan en orden, son idempotentes y preautorizan `pedro@productpedro.com` como acceso propietario. `is_owner` es un indicador interno: no existe una pantalla que exponga o administre esa cuenta.

`db/init.mjs` registra cada archivo aplicado en `cms_schema_migrations` y ejecuta cada migración nueva como una transacción. Las instalaciones anteriores al registro se reconocen por su esquema existente y se marcan con el baseline histórico, evitando que una migración de datos vuelva a sobrescribir cambios editoriales posteriores.

## Crear otro acceso

Neon Auth almacena la contraseña con hash; ni la aplicación ni la tabla pública guardan el password. El script recibe el password por entrada estándar para evitar incluirlo como argumento visible en el historial:

```bash
read -s CMS_PASSWORD
printf '%s' "$CMS_PASSWORD" | npm run cms:user -- "Jessica Salomon" "jessica@example.com"
unset CMS_PASSWORD
```

El script crea la identidad en Neon Auth y la agrega a `cms_access`. No hay registro público ni administración de usuarios en V1.

Mientras la recuperación por correo no esté conectada a Resend, una contraseña puede restablecerse localmente sin exponerla en argumentos ni guardarla en texto plano:

```bash
read -s CMS_PASSWORD
printf '%s' "$CMS_PASSWORD" | npm run cms:password -- "pedro@productpedro.com"
unset CMS_PASSWORD
```

El comando reemplaza el hash de la cuenta `credential` con el algoritmo de Better Auth y revoca sus sesiones anteriores. No crea usuarios ni cambia la lista de acceso.

## Leads y Resend

El endpoint `/api/inquiry` exige nombre, email, teléfono, celebración, fecha, venue, invitados, Pinterest y visión; filtra un honeypot básico y escribe primero en `leads`. Los límites y formatos se validan también en servidor, y la respuesta solo confirma éxito después de que Neon devuelve el ID insertado. Los registros nuevos permanecen con `email_status = 'not_configured'`; no se fuerza un `NOT NULL` retroactivo sobre las columnas históricas porque los leads capturados bajo el contrato anterior pueden contener valores nulos legítimos.

`emails/` contiene un aviso interno y una confirmación a la persona interesada, ambos con HTML responsive y alternativa plain text. `/api/emails/preview` permite revisarlos únicamente fuera de producción. Estos templates no se importan desde el submit y el proyecto no incluye un cliente de Resend, así que hoy no existe ninguna ruta de envío. Cuando se configuren dominio, inbox y remitente, la entrega actualizará `email_status`, `internal_email_id` y `client_email_id` sin cambiar el contrato DB-first del formulario.

## Evolución prevista

Neon Auth permite añadir cambio y recuperación de contraseña sin reemplazar el login. La recuperación se conectará a Resend cuando el dominio y el remitente estén verificados. También se podrá añadir una pantalla para invitar/desactivar usuarios; todos seguirán compartiendo el mismo nivel de acceso mientras no exista una necesidad real de roles.

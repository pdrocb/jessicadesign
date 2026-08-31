# CMS interno

El sitio incluye un CMS mobile-first en `/admin`. Vive en `cms/` como un módulo interno separado de la marca para que su estructura pueda copiarse y adaptarse en proyectos futuros sin convertirlo en un producto multi-tenant.

## Alcance actual

- Login por correo y contraseña administrado por Neon Auth, con sesión firmada del CMS por 30 días.
- Lista privada `cms_access`: tener una identidad en Neon Auth no concede acceso al CMS.
- Varios usuarios con el mismo nivel operativo; no existen roles ni permisos en la interfaz.
- Edición integral de Home: copy, fotografías, textos alternativos y contenido del modal de Founder.
- Colecciones fijas para Expertise y Process: sus elementos se editan, pero no se crean, eliminan ni reordenan.
- Colecciones ordenadas para Testimonials y FAQs: permiten editar, crear, eliminar y mover elementos sin copiar contenido entre campos.
- Edición, publicación y orden de proyectos del Look Book, incluida la portada, el orden y la eliminación de fotografías.
- Site Settings global para SEO, Open Graph, favicon y datos públicos de contacto/social.
- Formulario público conectado a `leads` y bandeja de inquiries de solo lectura.
- Fallback al contenido local si la base no está disponible, para que el sitio público siga funcionando.

Vercel Blob ya almacena el favicon y la imagen Open Graph desde Site Settings. La creación y eliminación de proyectos, la curaduría independiente del Look Book de Home, la carga y la sustitución de sus fotografías siguen pendientes de interfaz; usarán el mismo store. Resend se conectará junto con el dominio para entregar inquiries y, posteriormente, recuperación de contraseña.

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
  projects/                 repositorio y acciones del Look Book
  settings/                 documento global, uploads y validación SEO/contacto
  styles/                   tokens semánticos y geometría de controles
db/migrations/              esquema SQL versionado
db/init.mjs                 inicialización idempotente
scripts/create-cms-user.mjs alta de identidades autorizadas
```

Para reutilizarlo en Florale o The Clementine se copia `cms/`, se cambia `cms/config/site.ts`, se crean rutas propias bajo `/admin` y se aplica la migración en la base Neon de ese proyecto. Las bases, sesiones y usuarios no se comparten entre marcas.

## Sistema visual

El CMS es una superficie operativa independiente del sistema visual del sitio público. Usa una interfaz neutral y reusable: tipografía de sistema, superficies grises cálidas, acción primaria en tinta, foco accesible y una retícula estable orientada a formularios. No hereda la serif, la paleta ni la composición editorial de Jessica S. Designs.

La marca aparece únicamente como contexto de la instalación mediante `CmsBrand`. Al copiar el módulo a otro proyecto se sustituye el asset del logotipo y `cms/config/site.ts`; la navegación, jerarquía, densidad y estados permanecen iguales. `CmsIcon` concentra la iconografía SVG funcional para evitar dependencias externas y símbolos tipográficos inconsistentes.

Los tokens neutrales viven en `cms/styles/tokens.css`; `controls.css` define la geometría y los estados compartidos. `CmsField` y `CmsButton` encapsulan el contrato accesible y visual usado por Home, Site Settings, Projects y Login. Los layouts específicos continúan en `app/admin/admin.css` hasta que exista repetición suficiente para extraer otra primitiva.

`CmsImageField` presenta la imagen publicada —no su URL— como una miniatura compacta de referencia junto con recomendación, selector de archivo y texto alternativo cuando corresponde. La miniatura conserva el aspect ratio del archivo con `contain`; nunca crece al tamaño editorial ni recorta la imagen para simular su uso final. Todas las fotografías administradas de Home guardan archivo y alt en el documento `home`. Open Graph hace lo mismo en `site_settings`; las fotografías de proyectos conservan su archivo y permiten editar el `alt` existente. El favicon no lleva alt porque no es contenido renderizado para tecnologías asistivas.

Las rutas generadas por imports estáticos de Next (`/_next/...`) son específicas de cada build y nunca se persisten en Neon. Mientras una fotografía siga usando el asset incluido con el sitio, el documento omite esa clave y la lectura resuelve el fallback del deployment activo. Solo se guardan rutas públicas estables o URLs del Blob store; al subir un reemplazo, el CMS persiste esa URL durable.

En cada proyecto, la fotografía en posición 1 es también `cover_image_id` y aparece como `Principal`. Las fotografías se presentan como una galería operativa —una columna compacta en móvil, dos en tablet y tres en desktop— con la imagen completa, su orden, el alt y el menú de acciones dentro de una sola unidad. El menú contextual permite convertir otra fotografía en principal, subir o bajar las imágenes secundarias y eliminar una fila de `cms_project_images`. La principal permanece anclada; para reemplazarla se usa `Make principal`. Si se elimina, la siguiente fotografía ocupa la posición 1. Un proyecto nunca puede quedarse sin fotografías. La interfaz aplica el cambio inmediatamente y revierte el estado si Neon rechaza la operación.

`homeSections` es el contrato único del editor de Home. Cada sección declara campos generales, grupos fijos con etiqueta operativa (`Expertise 1`, `Step 1`) o una colección ordenada. `HomeEditor`, la lista de claves permitidas, la validación de imágenes y la sanitización de lectura se derivan de ese mismo contrato. Testimonials y FAQs se guardan como arrays nativos dentro del JSONB `home`, con IDs estables y orden explícito; los registros planos de la versión anterior se migran durante la lectura. Los controles subir/bajar reemplazan el drag and drop para conservar accesibilidad y precisión táctil. Featured Look Book queda deliberadamente fuera porque su curaduría tendrá un modelo independiente.

Toda eliminación iniciada desde el CMS pasa por `CmsConfirmDialog`; no se usan diálogos del navegador. El componente nombra el objeto y la consecuencia, enfoca `Cancel` al abrir, conserva Escape y clic exterior, bloquea un segundo envío mientras una operación remota está pendiente y devuelve el foco al cerrar. Testimonials y FAQs aclaran que el cambio permanece en el borrador hasta guardar Home; las fotografías aclaran que la eliminación en Neon es inmediata. Las futuras eliminaciones de proyectos y galerías reutilizarán el mismo contrato.

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

El endpoint `/api/inquiry` valida los campos, filtra un honeypot básico y escribe primero en `leads`. La base es la fuente de verdad; cuando se conecte Resend, el envío de correos actualizará `email_status`, `internal_email_id` y `client_email_id` sin cambiar el contrato del formulario.

## Evolución prevista

Neon Auth permite añadir cambio y recuperación de contraseña sin reemplazar el login. La recuperación se conectará a Resend cuando el dominio y el remitente estén verificados. También se podrá añadir una pantalla para invitar/desactivar usuarios; todos seguirán compartiendo el mismo nivel de acceso mientras no exista una necesidad real de roles.

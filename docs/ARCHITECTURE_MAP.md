# Mapa de arquitectura

Mapa operativo de entrypoints. Se actualiza cuando una ruta cambia de responsabilidad o cuando se introduce una nueva capa persistente.

## Sitio público

| Ruta | Composición | Datos y efectos |
| --- | --- | --- |
| `/` | `app/page.tsx` → `components/sections.tsx` | `cms/content/home.ts`, `cms/projects/repository.ts` y `cms/settings/repository.ts` |
| `/look-book` | `app/look-book/page.tsx` → introducción CMS + `components/LookBookExperience.tsx` | `cms/content/look-book.ts`, `cms/projects/repository.ts` y `cms/settings/repository.ts` |
| `/inquire` | `app/inquire/page.tsx` → introducción CMS + `components/InquiryForm.tsx` | `cms/content/inquire.ts`, `cms/settings/repository.ts`; submit: `app/api/inquiry/route.ts` → `handler.ts` → `cms/inquiries/delivery.ts` |
| `/api/emails/preview` | Preview local de `InquiryConfirmation` o `NewInquiry` | `emails/` → `@react-email/render`; responde 404 en producción y no envía correo |

## CMS

| Ruta | Editor/superficie | Escritura o lectura |
| --- | --- | --- |
| `/admin/login` | `cms/components/LoginForm.tsx` | `cms/auth/actions.ts` → Neon Auth |
| `/admin` | `cms/components/HomeEditor.tsx` | `cms/content/actions.ts` → documento `home` + Blob para imágenes |
| `/admin/look-book` | `cms/components/LookBookPageEditor.tsx` | `cms/content/look-book-actions.ts` → documento `look_book` |
| `/admin/inquire` | `cms/components/InquireEditor.tsx` | `cms/content/inquire-actions.ts` → documento `inquire` |
| `/admin/projects` | `cms/components/ProjectsEditor.tsx` | Índice de orden/visibilidad: `cms/projects/actions.ts` y `repository.ts` |
| `/admin/projects/new` | `cms/components/NewProjectEditor.tsx` | Creación draft + primera portada: `cms/projects/actions.ts` → Neon + Blob |
| `/admin/projects/[projectId]` | `cms/components/ProjectEditor.tsx` | Detalle, fotografías y guardado: `cms/projects/actions.ts` y `repository.ts` |
| `/admin/settings` | `cms/components/SiteSettingsEditor.tsx` | `cms/settings/actions.ts` → documento global + Blob para medios |
| `/admin/inquiries` | `cms/components/InquiriesEditor.tsx` | Lectura, búsqueda local y estado leído/nuevo: `cms/inquiries/repository.ts` + `actions.ts` |
| `/api/auth/[...path]` | proxy de autenticación | `cms/auth/neon.ts` |

## Capas compartidas del CMS

- `cms/config/`: contratos editoriales y secciones visibles.
- `cms/components/ui/`: controles neutrales repetidos con accesibilidad centralizada.
- `CmsPageHeader`, `CmsEditorChrome` y `CmsUnsavedChangesGuard`: jerarquía, feedback y navegación segura compartidos por editores.
- `cms/styles/tokens.css`: decisiones semánticas reutilizables.
- `cms/styles/controls.css`: geometría y estados de controles.
- `app/admin/admin.css`: shell, navegación y layouts específicos de las pantallas actuales.
- `cms/database/client.ts`: acceso común a Neon.
- `cms/media/`: política única de entrada, conversión WebP en navegador y validación defensiva previa a Blob.
- `lib/seo.ts`: composición de metadata con SEO por documento y Open Graph global desde Site Settings.
- `emails/`: templates responsive, tipos compartidos y alternativas plain text; no contiene integración de entrega.

## Límites

- El contenido público puede leer documentos del CMS; nunca importa componentes de administración.
- Los editores no importan el cliente de base de datos.
- Auth protege el layout de `/admin`; no se replica en cada página protegida.
- Los fallbacks de desarrollo pertenecen a repositorios/configuración, no a componentes visuales; las fotografías versionadas del Look Book conservan sus URLs públicas de Blob en `lib/lookbook-blob-sources.json`.

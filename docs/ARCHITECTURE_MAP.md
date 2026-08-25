# Mapa de arquitectura

Mapa operativo de entrypoints. Se actualiza cuando una ruta cambia de responsabilidad o cuando se introduce una nueva capa persistente.

## Sitio público

| Ruta | Composición | Datos y efectos |
| --- | --- | --- |
| `/` | `app/page.tsx` → `components/sections.tsx` | `cms/content/home.ts` y `cms/settings/repository.ts` |
| `/look-book` | `app/look-book/page.tsx` → `components/LookBookExperience.tsx` | `cms/projects/repository.ts` y `cms/settings/repository.ts` |
| `/inquire` | `app/inquire/page.tsx` → `components/InquiryForm.tsx` | `app/api/inquiry/route.ts` → `handler.ts` → `cms/inquiries/delivery.ts` |

## CMS

| Ruta | Editor/superficie | Escritura o lectura |
| --- | --- | --- |
| `/admin/login` | `cms/components/LoginForm.tsx` | `cms/auth/actions.ts` → Neon Auth |
| `/admin` | `cms/components/HomeEditor.tsx` | `cms/content/actions.ts` → documento `home` + Blob para imágenes |
| `/admin/projects` | `cms/components/ProjectsEditor.tsx` | `cms/projects/actions.ts` y `repository.ts`, incluida metadata de fotografías |
| `/admin/settings` | `cms/components/SiteSettingsEditor.tsx` | `cms/settings/actions.ts` → documento global + Blob para medios |
| `/admin/inquiries` | página read-only | `cms/inquiries/repository.ts` |
| `/api/auth/[...path]` | proxy de autenticación | `cms/auth/neon.ts` |

## Capas compartidas del CMS

- `cms/config/`: contratos editoriales y secciones visibles.
- `cms/components/ui/`: controles neutrales repetidos con accesibilidad centralizada.
- `cms/styles/tokens.css`: decisiones semánticas reutilizables.
- `cms/styles/controls.css`: geometría y estados de controles.
- `app/admin/admin.css`: shell, navegación y layouts específicos de las pantallas actuales.
- `cms/database/client.ts`: acceso común a Neon.

## Límites

- El contenido público puede leer documentos del CMS; nunca importa componentes de administración.
- Los editores no importan el cliente de base de datos.
- Auth protege el layout de `/admin`; no se replica en cada página protegida.
- Los fallbacks de desarrollo pertenecen a repositorios/configuración, no a componentes visuales.

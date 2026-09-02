# Ingeniería

Convenciones durables del proyecto. Este documento gobierna cómo se estructura y evoluciona el código; las decisiones de producto, marca y apariencia viven en `PRODUCT.md`, `CMS.md` y `DESIGN.md`.

## Dirección de dependencias

Cada flujo mantiene una sola dirección:

`route/page → component/editor → server action/handler → repository/service → Neon, Auth, Blob o Resend`

- Las páginas componen y cargan datos; no contienen reglas de persistencia.
- Los componentes renderizan estado y disparan acciones; no consultan la base de datos.
- Las acciones validan y coordinan; los repositorios encapsulan queries y fallbacks.
- Las integraciones externas no se importan directamente desde la UI.
- La persistencia nunca guarda rutas internas generadas por un build (`/_next/...`). Los assets incluidos en código se resuelven como fallbacks del deployment activo; los reemplazos editoriales usan URLs públicas durables.

El mapa concreto y sus entrypoints viven en `ARCHITECTURE_MAP.md`.

## Sistemas visuales separados

El sitio público y el CMS son productos visuales distintos:

- Sitio público: tokens en `app/globals.css`, especificación en `DESIGN.md`.
- CMS neutral: tokens en `cms/styles/tokens.css`, controles en `cms/styles/controls.css` y composición de superficies en `app/admin/admin.css`.

No se trasladan tokens de marca al CMS. El logo identifica la instalación, pero los controles deben poder reutilizarse en Florale o The Clementine sin cambiar su estructura.

## Tokens y primitivas del CMS

- Un valor visual repetido con significado se convierte en token semántico; no se tokeniza cada pixel aislado.
- TSX no introduce colores, radios o tamaños de control literales.
- Un patrón se extrae a `cms/components/ui/` cuando tiene al menos tres consumidores reales o cuando centraliza accesibilidad/estado crítico.
- Las variantes son explícitas y acotadas; se evita acumular booleanos que produzcan combinaciones ambiguas.
- Los campos de formulario se alinean al inicio de su celda. El texto de ayuda pertenece al campo, pero nunca cambia la geometría del control vecino.
- Labels, descripciones y errores se conectan con atributos accesibles desde la primitiva, no se reconstruyen en cada pantalla.
- Todo editor persistente comparte cuatro estados observables: `Unsaved`, `Saving`, `Saved` y `Error`. Un error nunca limpia `dirty`, permite reintento y, cuando identifica un campo, abre su sección y mueve el foco al control.
- Una salida interna con cambios pendientes usa `CmsUnsavedChangesGuard`; recargar o cerrar la pestaña conserva además la protección nativa `beforeunload`.
- Los encabezados operativos usan `CmsPageHeader`: título, una frase contextual y, como máximo, una acción primaria acompañada por una secundaria cuando aporta salida o preview.

## Feedback y mejora continua

El feedback actualiza la fuente de verdad más cercana:

| Tipo de aprendizaje | Destino |
| --- | --- |
| Alcance, copy o comportamiento público | `PRODUCT.md` |
| Comportamiento o evolución del CMS | `CMS.md` |
| Tokens y decisiones visuales públicas | `DESIGN.md` |
| Convención durable de código o arquitectura | `ENGINEERING.md` |
| Feature futura evaluada | `BACKLOG.md` |
| Limitación técnica pendiente | `TECH_DEBT.md` |

No se convierte cada corrección en una regla de agente. `AGENTS.md` solo cambia cuando cambia el proceso transversal de trabajo.

## Features y decisiones

- Una feature compleja activa puede tener una especificación en `docs/features/` con problema, alcance, estados, decisiones y criterios de aceptación.
- El backlog conserva intención futura, no planes de implementación en curso.
- Al terminar, el plan se archiva; el comportamiento vigente se integra a los documentos vivos y la deuda resuelta se elimina.

## Diagnóstico y verificación

- Corregir la causa raíz y validar los casos vecinos que comparten el mismo componente o token.
- Tras dos intentos fallidos sobre un síntoma, escribir hipótesis y evidencia antes de volver a editar.
- Cambiar una variable por vez cuando la causa no está demostrada.
- Código TypeScript: `npx tsc --noEmit`.
- UI: revisar 1440, 834 y 390 px, sin overflow horizontal y con targets táctiles de al menos 44 px.

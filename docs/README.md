# Documentación de Jessica S. Designs

Índice maestro. Los entrypoints para agentes de IA (`CLAUDE.md`, `AGENTS.md`) viven en la raíz del repo, no aquí.

## Documentos vivos

Se editan in-place y deben reflejar el estado actual del proyecto.

| Documento             | Qué es                                                  | Cuándo leerlo                                                     |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `DESIGN.md`           | Sistema visual del sitio público                        | Antes de cualquier cambio visual público                          |
| `PRODUCT.md`          | Producto, marca, clienta, audiencia y voz                | Antes de escribir copy o cambiar comportamiento                   |
| `CMS.md`              | Producto, configuración y evolución del CMS             | Antes de tocar `/admin`, Neon, Blob, usuarios o Resend             |
| `ENGINEERING.md`      | Convenciones durables de arquitectura, UI y calidad      | Antes de una abstracción, refactor o feature transversal          |
| `ARCHITECTURE_MAP.md` | Mapa de rutas, componentes, acciones y persistencia      | Antes de modificar un flujo de datos existente                    |
| `BACKLOG.md`          | Trabajo futuro evaluado de producto/diseño               | Al buscar qué sigue; los ítems resueltos se **borran**            |
| `TECH_DEBT.md`        | Problemas técnicos conocidos aún no resueltos            | Antes de un upgrade o al encontrar una limitación intencional     |

## Convención de ciclo de vida

- **Vivo** → vive en `docs/`, se edita in-place, se actualiza en el mismo commit que el cambio que lo afecta.
- **Feature compleja activa** → su especificación vive temporalmente en `docs/features/`; no duplica el backlog.
- **Terminado** → su plan se mueve a `docs/archive/YYYY-MM-DD-slug.md` y se registra en `docs/archive/README.md`. Nunca queda suelto en la raíz del repo.

## Skill `impeccable`: dónde viven sus archivos

`docs/` es una ubicación de primera clase para la skill, no una excepción tolerada. Su orden de resolución (verificado en `scripts/context.mjs` de la v4.0.4) es:

1. Raíz del proyecto
2. `.agents/context/` y luego **`docs/`** ← aquí
3. Raíz del repo, como fallback

Por eso `context.mjs` resuelve `docs/PRODUCT.md` y `docs/DESIGN.md` sin configuración. La advertencia anterior de este archivo — que la skill escribía en la raíz — venía de una versión previa y ya no aplica.

Lo que sí conviene vigilar: si alguna vez aparece un `PRODUCT.md` o `DESIGN.md` en la raíz, gana sobre el de `docs/` y el de aquí queda muerto sin avisar. Un solo archivo por documento.

`.impeccable/design.json` es el sidecar que consume el panel `live` (rampas tonales, tokens de motion, breakpoints y los snippets HTML/CSS de cada componente). Está en `.gitignore` porque se regenera desde `DESIGN.md` con `/impeccable document`.

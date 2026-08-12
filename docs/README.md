# Documentación de Jessica S. Designs

Índice maestro. Los entrypoints para agentes de IA (`CLAUDE.md`, `AGENTS.md`) viven en la raíz del repo, no aquí.

## Documentos vivos

Se editan in-place y deben reflejar el estado actual del proyecto.

| Documento      | Qué es                                                      | Cuándo leerlo                                                       |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `DESIGN.md`    | Sistema de diseño: tokens, tipografía, nav, breakpoints      | Antes de cualquier cambio visual                                     |
| `PRODUCT.md`   | Producto y marca: clienta, audiencia, voz                    | Antes de escribir o revisar copy                                     |
| `BACKLOG.md`   | Pendientes de diseño/producto evaluados                      | Al buscar qué sigue; los ítems resueltos se **borran**              |
| `TECH_DEBT.md` | Único hogar de la deuda técnica                              | Antes de un upgrade, o al toparse con algo que "está así por algo"   |

## Convención de ciclo de vida

- **Vivo** → vive en `docs/`, se edita in-place, se actualiza en el mismo commit que el cambio que lo afecta.
- **Terminado** → se mueve a `docs/archive/YYYY-MM-DD-slug.md` con un encabezado `Status: ARCHIVADO`. Nunca queda suelto en la raíz del repo.

## Skill `impeccable`: dónde viven sus archivos

`docs/` es una ubicación de primera clase para la skill, no una excepción tolerada. Su orden de resolución (verificado en `scripts/context.mjs` de la v4.0.4) es:

1. Raíz del proyecto
2. `.agents/context/` y luego **`docs/`** ← aquí
3. Raíz del repo, como fallback

Por eso `context.mjs` resuelve `docs/PRODUCT.md` y `docs/DESIGN.md` sin configuración. La advertencia anterior de este archivo — que la skill escribía en la raíz — venía de una versión previa y ya no aplica.

Lo que sí conviene vigilar: si alguna vez aparece un `PRODUCT.md` o `DESIGN.md` en la raíz, gana sobre el de `docs/` y el de aquí queda muerto sin avisar. Un solo archivo por documento.

`.impeccable/design.json` es el sidecar que consume el panel `live` (rampas tonales, tokens de motion, breakpoints y los snippets HTML/CSS de cada componente). Está en `.gitignore` porque se regenera desde `DESIGN.md` con `/impeccable document`.

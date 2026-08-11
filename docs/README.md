# Documentación de J|S Events

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

## Trampa conocida: skill `impeccable`

La skill de diseño `impeccable` escribe `PRODUCT.md` y `DESIGN.md` **en la raíz del repo** (visto en Florale). Cuando se corra aquí, fusionar/mover su contenido a los docs de `docs/` en el mismo flujo — si ambas copias existen, la de la raíz gana para la skill y la de `docs/` queda desactualizada sin que nadie lo note.

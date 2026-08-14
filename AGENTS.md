# AGENTS.md

Fuente única de verdad para agentes de código (Claude Code, Codex, Gemini CLI, u otros) en este repositorio. `CLAUDE.md` solo apunta aquí — no dupliques contenido entre ambos.

## Las dos personas

Este repo tiene dos personas distintas — no confundirlas:

1. **El usuario del agente** es el PM (abajo). Con él se habla en español y se negocia el trabajo.
2. **La dueña de la marca** es la clienta (Jessica Salomon, Jessica S. Designs). El sitio, su copy y su voz son de ELLA — inglés, contenido, seguro, sin superlativos huecos. Su perfil y audiencia viven en `docs/PRODUCT.md`; leerlo antes de escribir o revisar copy.

## Contexto del usuario

- **Senior Project Manager**, NO desarrollador. Entiende tecnología y arquitectura de alto nivel; no escribe código directamente.
- Delega la implementación al agente y valida el resultado por comportamiento observable, no leyendo diffs.
- **Idioma:** responder SIEMPRE en español. Código, identificadores y mensajes de commit se mantienen en inglés por convención de industria.
- Al citar código, explicar lo que hace en español — no asumir que el PM lee el código.

## Contexto del proyecto

One-pager de **Jessica S. Designs**, estudio de wedding & event design + styling en Hudson Valley, Nueva York. Una sola marca, un solo idioma (inglés en el sitio).

No es una empresa de planeación logística: es **la capa de diseño** de la celebración. Estética de revista editorial: mucho blanco, fotografía grande, serif con autoridad, radio 0 en todo, cero adorno. El sistema completo vive en `docs/DESIGN.md`.

Stack: Next.js 16 (App Router) + Tailwind v4, sin librerías extra. Repo `pdrocb/jessicadesign`. Deploy en Vercel: proyecto `jessicadesign`, scope `productcb` (Product Pedro), producción en **jessicadesign.vercel.app**.

**Estatus del diseño:** el handoff de diseño (`docs/DESIGN.md`) es un punto de partida validado visualmente, **no la verdad final**. La escala tipográfica, retícula, motion y arte de fotografía se cierran en la fase **impeccable**. Por eso todos los tokens viven en `app/globals.css` y ningún componente hardcodea valores — un cambio de escala o paleta se aplica en un solo archivo.

## Reading map

Para tocar X, lee/edita Y primero — no explores a ciegas:

| Tarea                             | Archivo                                        |
| --------------------------------- | ---------------------------------------------- |
| Copy/textos y fotos del sitio     | `lib/content.ts`                               |
| Diseño / tokens / escala          | `docs/DESIGN.md` · `app/globals.css`           |
| Nav de una fila y menú móvil      | `components/SiteHeader.tsx`                    |
| Secciones de la home              | `components/sections.tsx`                      |
| Acordeón de FAQs                  | `components/Faqs.tsx`                          |
| Primitivas (botones, links, logo) | `components/ui.tsx`                            |
| SEO, metadata, JSON-LD, fuentes   | `app/layout.tsx`                               |
| Composición de la página          | `app/page.tsx`                                 |
| Producto / marca / voz            | `docs/PRODUCT.md`                              |
| Pendientes de diseño/producto     | `docs/BACKLOG.md`                              |
| Deuda técnica                     | `docs/TECH_DEBT.md`                            |

## Working agreement

### 1. Plan-first agresivo

- **Entrar en plan mode automáticamente** si la tarea cumple cualquiera de estos criterios: 3+ pasos de implementación, 3+ archivos tocados, una decisión arquitectónica, o una feature nueva.
- **Ejecutar directo** si es trivial: typo, rename, ajuste de 1 línea, cambio de copy.
- El plan se presenta en español y el PM lo aprueba antes de tocar código.

### 2. Subagent strategy

- **Exploración de 3+ queries de búsqueda** → delegar a un subagente de exploración.
- **Research paralelo sobre áreas independientes** → lanzar múltiples agentes en un solo mensaje.
- **Una tarea por subagente**, con paths y preguntas concretas.

### 3. Verificación obligatoria antes de "listo"

Toda tarea cierra con CUATRO pasos fijos, en orden:

1. **TypeScript:** `npx tsc --noEmit` si se tocó código TS.
2. **Línea de paridad responsive:** si el cambio toca UI, declarar explícitamente `Desktop (1440): verificado / Tablet (834): verificado / Mobile (390): verificado | N/A`. Nunca debe haber overflow horizontal, y los targets táctiles en mobile son de 44px mínimo.
3. **Resumen de comportamiento** en español, 2-3 bullets, sobre _qué cambió en la app_ desde el punto de vista del usuario final.
4. **Pasos para probar manualmente** — qué abrir, qué observar, resultado esperado. Local: `npm run dev` (el puerto lo asigna el preview — ver Learned patterns).

Si no se puede verificar, decirlo explícitamente en vez de asumir éxito.

### 4. Bug fixing autónomo

- Cuando el PM reporta un bug: diagnosticar y arreglar sin ping-pong.
- Si hay 2+ arreglos viables con trade-offs reales → presentar opciones con pros/cons y recomendar una.

### 5. Captura de lecciones

Cuando el PM corrige al agente ("no, hazlo así"), esa corrección se escribe en **Learned patterns** (abajo), en el mismo commit del cambio que la originó.

## Learned patterns

Reglas nacidas de incidentes reales. Cada una lleva su caso de origen.

- **Esta máquina tiene dos identidades de GitHub por SSH.** `git@github.com` autentica como `pdrocb-46` y NO tiene acceso a este repo; la cuenta buena es `pdrocb`, que responde al alias `github-personal` (`~/.ssh/config`). El repo local guarda la URL canónica `git@github.com:pdrocb/...` — que es la que Vercel sabe leer — y un `url.insteadOf` **local** la reescribe al alias al conectar. No cambiar la URL del remoto al alias: Vercel entonces no puede parsear el repo. (Origen: primer push, ago 2026.)
- **Deployment Protection está activa en el equipo.** Las URLs de deployment (`jessicadesign-*-productcb.vercel.app`) devuelven 302 al SSO de Vercel. La única URL pública es `jessicadesign.vercel.app`; usar esa para smoke tests. (Origen: primer deploy, ago 2026.)
- **El puerto 3000 suele estar ocupado en esta máquina.** `.claude/launch.json` usa `autoPort: true`. No hardcodear 3000 en URLs de prueba. (Origen: primer preview, ago 2026.)
- **El pane del navegador puede estar oculto (`document.visibilityState === "hidden"`).** Con el pane oculto los screenshots salen en blanco Y los `IntersectionObserver` no disparan — no es un bug del código. Verificar geometría midiendo el DOM con `javascript_tool`, y decir explícitamente que la verificación visual quedó pendiente. (Origen: construcción inicial, ago 2026.)
- **La accesibilidad gana sobre las alturas del handoff.** Cuando los 44px de target táctil en mobile chocan con una altura declarada (p. ej. la fila 2 del nav a 37px), gana el target; la altura del handoff es provisional y así lo dice el propio documento. (Origen: nav mobile, ago 2026.)
- **Todo el CSS base va dentro de `@layer base`, sin excepción.** El CSS sin capa gana sobre TODAS las capas de Tailwind, incluida `utilities`. Con el bloque base sin envolver, `a { color: inherit }` derrotaba a `text-bone` y el CTA primario salía ink sobre ink — texto invisible. Los links del footer se salvaban por casualidad, porque heredaban `bone` del footer. Si una utilidad de color "no hace nada" sobre un elemento, sospechar de esto antes que del token. (Origen: CTAs del hero y del cierre, ago 2026.)
- **`w-full` en un elemento absoluto dentro de una caja con padding desborda.** Resuelve contra el padding-box pero arranca en el content-box: usar `inset-x-0`. (Origen: centinela del nav, ago 2026.)
- **Un H1 por página, también entre breakpoints.** No duplicar el H1 con `hidden`/`md:hidden`: cambiar el ancla de posición (`relative` → `md:static`) para que un solo H1 sirva a mobile y desktop. (Origen: hero, ago 2026.)
- **Florale es referencia de layout, no de identidad visual.** Cuando la clienta pida replicar su hero o navbar, copiar composición, breakpoints y comportamiento, pero conservar tipografía, colores, radios, copy y controles de Jessica. El lockup real puede reducirse aunque pierda legibilidad si la clienta prioriza una barra delgada; no sustituirlo ni importar los tokens de Florale. (Origen: réplica del hero/nav de Florale, ago 2026.)
- **El H1 del hero necesita respirar más en móvil.** La composición de tres líneas usa `line-height: 1.10`, tracking `0.005em` y 4px extra antes del lede; desde tablet vuelve al token compacto. No aplicar el `1.04` de desktop sin ajuste en teléfono. (Origen: revisión responsive del hero Florale, ago 2026.)
- **La pareja tipográfica de marca es Cormorant Garamond + Karla.** Cormorant lleva títulos, citas e itálicas; Karla lleva cuerpo, navegación, labels, botones y formularios. No volver a Playfair/Helvetica ni extender la serif a texto operativo: la clienta rechazó esa combinación por sentirse genérica. (Origen: feedback tipográfico de la clienta, ago 2026.)
- **La clienta prefiere ritmo orgánico, pero la asimetría tiene que ganarse el espacio.** Florale y Simplicity in Mind son referencia para encabezados, fotografía y secciones narrativas: alternar alineaciones, jerarquías, densidad y fondos entre bandas. Dos secciones contiguas con funciones distintas deben tener un rompimiento tonal intencionado. En información repetida y extensa, como Expertise o Process, conservar retículas compactas y regulares; desplazar tarjetas solo para “desacomodar” se percibe vacío, no artístico. En móvil, cualquier offset vuelve al orden lineal del DOM. (Origen: revisión de suavidad, layout y ritmo tonal con la clienta, ago 2026.)
- **En Philosophy, el copy separa alcance y síntesis.** La enumeración de elementos termina en un primer párrafo; la lectura de la celebración como un todo abre el segundo. La imagen secundaria puede ir escalonada, pero debe subir aproximadamente una cuarta parte de su altura hacia el título; anclarla al inicio del párrafo deja un vacío dominante que la clienta rechaza. (Origen: ajuste de ritmo de Philosophy, ago 2026.)

## Documentación

- En la raíz del repo solo viven `CLAUDE.md`, `AGENTS.md` y `README.md`. Todo lo demás va en `docs/` (índice: `docs/README.md`).
- Documentos **vivos** se editan in-place. Planes o checklists **terminados** se mueven a `docs/archive/YYYY-MM-DD-slug.md`.
- Si un cambio afecta lo que un doc describe, el doc se actualiza **en el mismo commit**.
- En `docs/BACKLOG.md` y `docs/TECH_DEBT.md` los ítems resueltos **se borran**, no se marcan como hechos.

## Git

- Nunca usar `--no-verify` ni saltar hooks. Hay un hook que bloquea `git commit` si `tsc --noEmit` falla.
- Stagear solo archivos que esta conversación tocó, por path explícito. Nunca `git add -A` ni `git add .`.
- Commits en inglés, formato `<type>: <summary>`.

## Core principles

- **Simplicity first** — el cambio mínimo que resuelve el problema. No añadir abstracciones para casos hipotéticos.
- **No laziness** — ir al root cause, no workarounds.
- **Minimal impact** — no tocar lo que no hay que tocar.
- **Demand elegance (balanceado)** — para cambios no triviales, pausar y preguntar "¿hay una forma más elegante?".

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

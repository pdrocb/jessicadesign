# Sistema de diseño — J|S Events

**Estatus:** punto de partida validado visualmente, **no la verdad final**. La escala definitiva, la retícula, el motion y la dirección de fotografía se cierran en la fase **impeccable**. Hasta entonces, todo token vive en `app/globals.css` y ningún componente hardcodea valores.

Origen: handoff de diseño v1.0 (agosto 2026), derivado de `Home.dc.html` y `Responsive Canvas.dc.html`.

---

## 1. Tipografía

| Rol                | Familia                | Fallback                | Uso                                              |
| ------------------ | ---------------------- | ----------------------- | ------------------------------------------------ |
| Display / headings | **Playfair Display**   | `Georgia, serif`        | H1–H3, citas, logotipo, numerales                |
| UI / cuerpo        | **Helvetica Neue**     | `Helvetica, Arial, ss`  | párrafos, nav, botones, labels, footer           |

Playfair se carga con `next/font/google` en pesos 400/500/600 + itálica 400. Helvetica Neue es de sistema: no viaja por la red.

**Regla de peso:** los ítems de navegación y labels en mayúsculas usan `font-weight: 500`, no 400. En cajas altas con letter-spacing amplio el 400 se lee anémico.

### Escala

Los tokens `--text-*` de `globals.css` usan **interpolación anclada**: cada uno vale exactamente su tamaño mobile a 390px y su tamaño desktop a 1440px. Una `clamp()` con solo `vw` no puede tocar ambos extremos — el término fijo la reancla.

```
pendiente = (max − min) / (1440 − 390)     base = min − 390 · pendiente
```

| Token           | 390 → 1440 | Familia   | Uso                          |
| --------------- | ---------- | --------- | ---------------------------- |
| `display-hero`  | 40 → 96    | Playfair  | H1 del hero                  |
| `display-lg`    | 32 → 64    | Playfair  | H2 del CTA                   |
| `display-md`    | 32 → 56    | Playfair  | H2 de sección oscura y FAQs  |
| `heading-lg`    | 30 → 44    | Playfair  | H2 de sección ("Expertise")  |
| `quote-xl`      | 26 → 40    | Playfair  | Manifiesto                   |
| `heading-md`    | 21 → 24    | Playfair  | H3 de tarjeta de servicio    |
| `quote-md`      | 17 → 21    | Playfair  | Testimonios                  |
| `quote-italic`  | 18 → 26    | Playfair  | Frases de apoyo              |
| `body-lg`       | 15 / 1.9   | Helvetica | Párrafos largos              |
| `body-md`       | 14 / 1.85  | Helvetica | Párrafos secundarios         |
| `body-sm`       | 13.5/1.75  | Helvetica | Copy de tarjeta              |
| `label`         | 11 · .30em | Helvetica | Eyebrows, botones, nav       |
| `label-sm`      | 10 · .26em | Helvetica | Nav de footer, captions      |
| `label-xs`      | 9 · .30em  | Helvetica | Bajada de logo               |

Todos los `label*` van en mayúsculas. El cuerpo nunca baja de 13px.

## 2. Color

| Token             | Hex                  | Uso                                     |
| ----------------- | -------------------- | --------------------------------------- |
| `ink`             | `#141312`            | Texto principal, fondos oscuros, CTA    |
| `ink-soft`        | `#2e2b27`            | Logos de prensa                         |
| `ink-muted`       | `#4a463f`            | Párrafos de cuerpo                      |
| `ink-subtle`      | `#6b6660`            | Eyebrows, copy secundario               |
| `ink-faint`       | `#8a8378`            | Numerales, meta sobre oscuro            |
| `paper`           | `#ffffff`            | Fondo base                              |
| `bone`            | `#faf8f3`            | Fondo alterno + texto sobre oscuro      |
| `cream`           | `#f4efe3`            | Fondo del bloque CTA                    |
| `line`            | `#e4dfd6`            | Divisores sobre claro                   |
| `line-warm`       | `#d8d2c5`            | Divisores de FAQ                        |
| `line-dark`       | `#33302c`            | Divisores sobre oscuro                  |
| `on-dark-muted`   | `#c9c2b4`            | Contacto en footer                      |

Máximo 2 fondos claros por página (`paper` + uno de `bone`/`cream`) más el bloque oscuro `ink`. Nada de gradientes decorativos ni sombras de color.

## 3. Espaciado y geometría

- Escala base 4px.
- Ancho máximo: **1280px** (`shell-wide`, grids de imagen) · **1180px** (`shell`, texto denso).
- Gutters (`--gutter`): 48 desktop · 32 tablet · 20 mobile.
- Padding vertical de sección (`--section-y`): 110 desktop · 80 tablet · 56 mobile.
- **Radio 0 en todo.** No existe token de radio, a propósito.
- **Sin sombras.** La única excepción del handoff era el canvas de presentación, que no se implementa.

## 4. Nav de dos filas

Componente con más reglas del sistema — `components/SiteHeader.tsx`.

- Fila 1: grid `1fr auto 1fr` — vacío / logo centrado / CTA "Inquire". Nunca se mueve.
- Fila 2: links centrados en desktop, scroll horizontal en mobile.
- Al pasar el hero, la fila 2 **colapsa** y solo reaparece al volver por encima del umbral (no con cualquier scroll hacia arriba a media página).
- El umbral es un centinela de 1px que `Hero` coloca 120px antes de su final; un `IntersectionObserver` lo observa. No hay listener de scroll.
- El colapso anima `grid-template-rows: 1fr → 0fr` en lugar de una `max-height` fija: la fila mide distinto por breakpoint y así no hay valor mágico que sincronizar.
- Colapsada, la fila lleva `inert`: no se puede tabular a un link invisible.
- Transición: 420ms `cubic-bezier(0.22,0.61,0.36,1)` en geometría, 260ms en opacidad. Con `prefers-reduced-motion` es instantánea.

## 5. Breakpoints

|                  | Desktop `≥1200`   | Tablet `768–1199` | Mobile `<768`        |
| ---------------- | ----------------- | ----------------- | -------------------- |
| Gutter           | 48                | 32                | 20                   |
| Hero             | collage de 3      | collage de 2      | 1 imagen, H1 en bone |
| Servicios        | 4 col             | 2 col             | 1 col                |
| Manifiesto       | 200 / 1fr / 200   | 150 / 1fr         | apilado, foto al final |
| Testimonios/FAQs | 0.8fr / 1.2fr     | apilado           | apilado              |
| Look Book        | 4 col             | 2 col             | 2 col                |
| Break editorial  | alto 640          | 420               | 320                  |
| Botones          | inline            | inline            | **ancho completo**   |

Regla general: una columna menos por breakpoint. **Targets táctiles en mobile: 44px mínimo** — esta regla gana sobre las alturas declaradas del handoff cuando chocan.

## 6. Fotografía

- Siempre `object-fit: cover`, sin esquinas redondeadas.
- Proporciones: `3/4` (tarjeta de servicio), `4/5` (look book y servicio en mobile), `4/3` (manifiesto en mobile), alturas fijas en el collage del hero.
- Texto sobre foto solo con `linear-gradient(to top, rgba(20,19,18,.45), transparent 55%)`.
- Las fotos actuales se descargaron del Wix vigente a `assets/` y se importan estáticamente para que `next/image` genere AVIF/WebP en build. **Sustituir por arte final** — ver `docs/BACKLOG.md`.

## 7. Estados y motion

- Hover en links de texto: `ink` → `ink-subtle`. Sobre oscuro: `bone` → `ink-faint`. Sin subrayado nuevo.
- Focus (provisional hasta impeccable): `outline: 1px solid currentColor; outline-offset: 3px`.
- Transición estándar: 180ms ease en color, 420ms `cubic-bezier(0.22,0.61,0.36,1)` en geometría.
- `prefers-reduced-motion` anula todas las transiciones y el scroll suave desde `globals.css`.

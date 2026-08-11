---
name: J|S Events
description: Wedding and event design in the Hudson Valley — editorial restraint built around photography.
colors:
  ink: "#141312"
  ink-soft: "#2e2b27"
  ink-muted: "#4a463f"
  ink-subtle: "#6b6660"
  ink-faint: "#8a8378"
  paper: "#ffffff"
  bone: "#faf8f3"
  cream: "#f4efe3"
  line: "#e4dfd6"
  line-warm: "#d8d2c5"
  line-dark: "#33302c"
  on-dark-muted: "#c9c2b4"
typography:
  display-hero:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(40px, 5.33vw + 19.2px, 96px)"
    fontWeight: 500
    lineHeight: 1.04
  display-lg:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(32px, 3.05vw + 20.1px, 64px)"
    fontWeight: 500
    lineHeight: 1.15
  display-md:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(32px, 2.29vw + 23.1px, 56px)"
    fontWeight: 400
    lineHeight: 1.15
  heading-lg:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(30px, 1.33vw + 24.8px, 44px)"
    fontWeight: 500
    lineHeight: 1.2
  heading-md:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(21px, 0.29vw + 19.9px, 24px)"
    fontWeight: 500
    lineHeight: 1.3
  quote-xl:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(26px, 1.33vw + 20.8px, 40px)"
    fontWeight: 400
    lineHeight: 1.45
  quote-md:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(17px, 0.38vw + 15.5px, 21px)"
    fontWeight: 400
    lineHeight: 1.6
  quote-italic:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(18px, 0.76vw + 15px, 26px)"
    fontWeight: 400
    lineHeight: 1.6
    fontStyle: "italic"
  body-lg:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.9
  body-md:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.85
  body-sm:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.3em"
  label-sm:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.26em"
  label-xs:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.3em"
rounded:
  none: "0px"
spacing:
  gutter-mobile: "20px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  section-mobile: "56px"
  section-tablet: "80px"
  section-desktop: "110px"
  content-max: "1536px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 56px"
  button-primary-hover:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "9px 24px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
  link-underline:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  link-underline-hover:
    textColor: "{colors.ink-subtle}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink-subtle}"
  eyebrow:
    textColor: "{colors.ink-subtle}"
    typography: "{typography.label}"
  quote-block:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
    typography: "{typography.quote-md}"
    padding: "44px 0"
---

# Design System: J|S Events

## Overview

**Creative North Star: "The Laid Table"**

The system behaves the way Jessica lays a table. The linen goes down first and it is deliberately quiet — off-white, warm, unpatterned — because everything placed on top of it is what people came to look at. Nothing sits on the table that does not earn its place. The luxury is in the placement and the restraint, never in ornament added afterward.

This is not a metaphor borrowed from the category; it is her actual product. She owns the tabletop layer — linens, flatware, candles, china, runners — and does not own the tables and chairs. The interface honors that same boundary: it builds the surface, sets the objects on it with intention, and gets out of the way. Where a generic wedding site decorates, this one arranges.

The practical consequence runs through every decision below: **the palette carries no accent color at all.** Twelve tokens, all neutral, all warm-shifted. The color in this product comes from the photographs — the peonies, the candlelight, the linen, the hour of the day. A brand accent would compete with the only thing that actually sells the work.

**Key Characteristics:**

- Warm neutrals only; zero chroma in the system, all chroma in the photography.
- Serif with authority for statement, neutral grotesque for everything operational.
- Radius zero everywhere. Hairline rules instead of boxes.
- Depth by tonal layering, never by shadow.
- Generous vertical air; horizontal discipline against a hard grid.

## Colors

Twelve warm neutrals running from a near-black umber to paper white. There is no primary accent, and that absence is the system's strongest decision.

### Neutral

- **Umber Black** (`#141312`): the system's ink. Body headlines, the dark section band, the primary button fill. Warm-shifted off true black so it sits beside cream without going cold.
- **Press Umber** (`#2e2b27`): reserved for press and partner marks on light ground. Currently unused — no press assets are cleared for publication.
- **Reading Umber** (`#4a463f`): long-form body copy. Steps back from the headline without losing contrast.
- **Quiet Stone** (`#6b6660`): eyebrows, captions, secondary copy, the hover destination for text links.
- **Faint Stone** (`#8a8378`): roman numerals, attributions, and meta on the dark band. The lightest text weight the system permits.
- **Paper White** (`#ffffff`): base ground.
- **Bone** (`#faf8f3`): the alternating section ground, and the text color on the dark band. Doing double duty is intentional — the warm off-white reads as the same material whether it is behind type or is the type.
- **Cream** (`#f4efe3`): reserved exclusively for the closing CTA block. Its one appearance is what makes the page feel like it arrives somewhere.
- **Hairline** (`#e4dfd6`): dividers and section boundaries on light ground.
- **Warm Hairline** (`#d8d2c5`): FAQ dividers only — a half-step warmer to separate a list of rules from a section boundary.
- **Dark Hairline** (`#33302c`): dividers inside the dark band.
- **Muted Bone** (`#c9c2b4`): contact details in the footer.

### Named Rules

**The Photograph Is the Palette Rule.** The system contributes no color. Every hue a visitor sees comes from a photograph. Never introduce a brand accent, a colored state, a tinted background, or a gradient that carries hue — the moment the interface has a color of its own, it starts competing with the work it exists to sell.

**The Two Grounds Rule.** A page uses `paper` plus exactly one of `bone`/`cream`, plus the `ink` band. Three light grounds turn an editorial rhythm into a swatch test.

## Typography

**Display Font:** Playfair Display (fallback `Georgia, serif`), weights 400/500/600 plus 400 italic.
**Body Font:** Helvetica Neue (fallback `Helvetica, Arial, sans-serif`), system-resident — nothing but Playfair crosses the network.

**Character:** A high-contrast transitional serif doing all the talking, against a neutral grotesque that never raises its voice. The serif carries emotion and scale; the grotesque handles anything operational — navigation, labels, body copy, the footer. The pairing works because the roles never blur: no serif buttons, no grotesque headlines.

### The scale is anchored, not fluid-by-eye

Every `--text-*` token is a `clamp()` with a fixed term, not a bare `vw` value. Each one lands **exactly** on its mobile size at 390px and its desktop size at 1440px:

```
slope = (max − min) / (1440 − 390)     base = min − 390 · slope
```

A `clamp()` with only a `vw` middle term cannot touch both ends — it drifted the hero to 95px at 1440 and 55px at 834. The fixed term re-anchors it. Any new type token joins the scale the same way.

### Hierarchy

- **display-hero** (500, 40→96px, 1.04): the single H1. One per document — it changes positioning anchor across breakpoints rather than duplicating itself.
- **display-lg** (500, 32→64px, 1.15): the closing CTA headline. The largest type after the hero, and the only other place that scale appears.
- **display-md** (400, 32→56px, 1.15): section headings on the dark band and in FAQs. Weight 400, not 500 — on `ink` ground the lighter weight reads correctly.
- **heading-lg** (500, 30→44px, 1.2): standard section headings on light ground.
- **heading-md** (500, 21→24px, 1.3): service card titles.
- **quote-xl** (400, 26→40px, 1.45): the manifesto statement. The loosest line-height in the system; it is meant to be read slowly.
- **quote-md** (400, 17→21px, 1.6): testimonials, in typographic quotes.
- **quote-italic** (400 italic, 18→26px, 1.6): supporting lines over photography and beside portraits.
- **body-lg / body-md / body-sm** (400, 15 / 14 / 13.5px, 1.9 / 1.85 / 1.75): long copy, secondary copy, card copy. Note the line-height rises as size rises.
- **label / label-sm / label-xs** (500, 11 / 10 / 9px, tracking .30 / .26 / .30em, uppercase): eyebrows, buttons, navigation, footer, logo subline.

### Named Rules

**The Medium-Not-Light Rule.** Every uppercase label sits at weight **500**, never 400. In tall caps with wide tracking, 400 goes anemic and the whole page reads cheap. This is the single most load-bearing typographic rule in the system.

**The Thirteen Floor Rule.** Body copy never goes below 13px at any breakpoint. Labels may — they are labels, not reading.

## Layout

A 4px base scale on a hard editorial grid.

**One content rail: `--layout-content-max: 1536px`**, shared with Florale and applied to every section without exception. There is deliberately no second, narrower container for text.

That is a real decision, not a simplification. A narrow container caps *everything* in the section — photographs included — to protect the measure of the paragraph inside it, which starves the imagery on wide monitors for the sake of one text block. Instead the rail stays wide and **reading measure is capped per block, in `ch`, where it actually matters**: the About paragraph at 66ch, testimonial quotes at 62ch, the manifesto body at 520px, FAQ answers at 60ch. Photography gets the full rail; prose gets a comfortable line.

Gutters and section rhythm are CSS variables that change at two breakpoints, so every section inherits the change without a media query of its own:

| | Mobile `<768` | Tablet `768–1199` | Desktop `≥1200` |
|---|---|---|---|
| `--gutter` | 20px | 32px | 48px |
| `--section-y` | 56px | 80px | 110px |
| Hero | 1 photograph | collage of 2 | collage of 3 |
| Services | 1 column | 2 columns | 4 columns |
| Manifesto | stacked, photo last | 150 / 1fr | 200 / 1fr / 200 |
| Testimonials, FAQs | stacked | stacked | 0.8fr / 1.2fr, sticky heading |
| Look Book | 2 columns | 2 columns | 4 columns |
| Editorial break | 320px tall | 420px | 640px |
| Buttons | **full width** | inline | inline |

The governing rule is **one column fewer per breakpoint down**, never a reflow into a different concept.

**Touch targets are 44px minimum on mobile, and that rule outranks any height in the original handoff.** Where the two collide — the second nav row was specified at 37px — the target wins and the row grows to 45px. Padding lives on the anchor; the active-state underline lives on an inner span so it hugs the text instead of the edge of the tap area.

## Elevation & Depth

**This system is flat and has no shadow vocabulary.** Nothing is lifted, nothing floats, no surface casts.

Depth is built two ways instead. First, **tonal layering**: consecutive full-width bands step through `paper → bone → paper → ink → cream`, so the page reads as stacked material rather than stacked cards. Second, **hairlines**: a single 1px rule in the appropriate divider token separates what a border-radius-and-shadow card would otherwise separate.

The one `box-shadow` in the entire codebase is not elevation. The primary button's hover state swaps to a light fill and needs an outline; a real `border` would change its box and shift the layout mid-transition, so it uses `inset 0 0 0 1px` as a border substitute. It reads as a hairline, not a shadow.

### Named Rules

**The No-Lift Rule.** Nothing in this system rises off the page. If an element needs separation, it gets a hairline, a tonal ground, or more space — in that order. A drop shadow anywhere is a defect.

## Shapes

**Radius is zero everywhere, and there is deliberately no radius scale to reach for** — buttons, images, cards, inputs, the dark band. The only `rounded` token is `none: 0px`, and it exists so components can reference the decision explicitly rather than omit the property by accident.

The form language is rectangles and hairlines. Photographs are hard-cropped with `object-fit: cover`, either full-bleed or locked to the grid, in three canonical ratios: **3/4** (service cards), **4/5** (look book, and service cards on mobile), **4/3** (manifesto on mobile). The hero collage is the one exception, using fixed pixel heights with deliberate vertical offsets so the three images sit at different altitudes.

### Scrims — two recipes, and only these

Text over photography is legible by scrim, never by a box or a plate. There are exactly two, and they solve different problems:

**1. Caption band** (`EditorialBreak`) — for a line sitting at the bottom edge:

```
absolute inset-x-0 bottom-0  h-28 md:h-36 lg:h-44
bg-linear-to-t from-ink/85 via-ink/30 to-transparent
```

Height-bounded to 112 / 144 / 176px — roughly the bottom third — so the photograph above it stays completely untouched. The caption sits low inside the band (`py-4 md:py-6 lg:py-8`), which is the whole trick: **put the text where the gradient is already dense, and the gradient itself can stay short.** A softer, taller wash needs far more total darkening to hit the same contrast. Pair it with `text-shadow-caption`.

**2. Headline wash** (`Hero`, mobile only) — for a headline centred over the image:

```
absolute inset-0 bg-linear-to-t from-ink/50 to-transparent to-60%
```

Full-height, because a vertically-centred H1 cannot be served by a bottom band.

Contrast over photography is **measured against the brightest pixel under the text**, not eyeballed — white linen and candlelight are the failure case in this library. Verified: 4.70:1 at 1440, 4.85:1 at 834, 5.04:1 at 390.

The logotype follows the same discipline: the bar in `J|S` is a 1px `<span>`, not the `|` character, so its height and spacing are controlled to the pixel instead of inheriting a font metric.

## Components

### Buttons

- **Shape:** square (`0px`), no exceptions.
- **Primary:** `ink` fill, `bone` text, `label` type, padding `18px 56px`. Full width below 768px.
- **Primary hover:** inverts to `bone` on `ink` text with an `inset 0 0 0 1px` hairline, 180ms. The inversion *is* the interaction — no lift, no scale, no shadow.
- **Outline (nav CTA):** 1px `ink` border, transparent fill, `label-sm`, padding `9px 24px`. Hover fills to `ink` with `bone` text. On mobile it takes `min-height: 44px` and drops its vertical padding.

### Links

- **Underline link:** `label` type with a 1px `ink` bottom border on an inner span, 4px below the text. Hover moves the text to `ink-subtle`; the rule stays. Never add a second underline on hover.
- **Text link on dark:** `bone` → `ink-faint` on hover.

### Navigation — the signature component

Two rows, and the rules here are stricter than anywhere else in the system.

- **Row 1** (`1fr auto 1fr`): empty / centered logotype / `Inquire` outline button. It never moves.
- **Row 2:** the four section links — centered from 1200px, horizontally scrollable and left-aligned below 768px.
- **Collapse:** past the hero, row 2 collapses and **only returns when the visitor scrolls back above the threshold** — not on any upward scroll mid-page. The threshold is a 1px sentinel the hero places 120px before its own end, watched by an `IntersectionObserver`. There is no scroll listener.
- **Mechanics:** the collapse animates `grid-template-rows: 1fr → 0fr`, not a fixed `max-height`, because the row is a different height at every breakpoint. The bottom hairline lives inside the clipped child so it disappears with the row instead of stranding a line under the logo. Collapsed, the row carries `inert` — no tabbing to an invisible link.
- **Motion:** 420ms `cubic-bezier(0.22, 0.61, 0.36, 1)` on geometry, 260ms on opacity. Instant under `prefers-reduced-motion`.

### Cards

There are no cards. Service entries are a photograph, a roman numeral in Playfair, a title, and copy — stacked in a column with no container, no border, and no background. The grid does the grouping.

### Quote block

Playfair at `quote-md` in typographic quotes (`" "`, never `"`), attribution beneath in `label-sm` uppercase `ink-faint`, separated by a `line-dark` hairline. Lives on the `ink` band.

### FAQ accordion

One open at a time. Trigger is a full-width button: lowercase roman numeral in `ink-faint`, question in Playfair 500, and a Playfair `+` / `−` at 22px on the right. The answer is capped at `60ch` and indented to align with the question, not the numeral.

### Inputs

**Not yet designed.** The inquiry form does not exist. When it does, it inherits: square corners, hairline strokes, `label` type for field labels, and focus handled by the system focus ring rather than a colored border.

## Do's and Don'ts

### Do:

- **Do** let photography carry every hue. The system's job is to frame, not to color.
- **Do** set uppercase labels at weight 500 and the tracking their token specifies.
- **Do** anchor any new type token with the `clamp(min, slope·vw + base, max)` formula so it lands exactly on its mobile and desktop sizes.
- **Do** separate with a hairline, a tonal ground, or space — in that order.
- **Do** cap reading measure on the paragraph itself in `ch`, never by narrowing the container. The rail belongs to the photography.
- **Do** give mobile controls 44px of height even when it breaks a specified row height. Put the padding on the anchor and the underline on an inner span.
- **Do** keep one `<h1>` per document; move its positioning anchor across breakpoints rather than duplicating it.
- **Do** use typographic quotes and the `·` separator the system already uses in meta lines.

### Don't:

- **Don't** introduce an accent color, a tinted surface, a colored state, or a hue-carrying gradient. The only permitted gradients are the two `ink` scrims in Shapes, and both exist for legibility, not for mood.
- **Don't** wash a whole photograph to make a caption readable. Bound the band and drop the caption into it.
- **Don't** add a border-radius anywhere, on anything, ever.
- **Don't** add a drop shadow or any lift. If it looks like it needs one, it needs space.
- **Don't** reach for the generic wedding-site vocabulary: hero carousels, vendor badges, script or handwritten typefaces, blush palettes, eucalyptus ornament, or "the day of your dreams" register.
- **Don't** signal luxury by accumulation — gold, marble, glinting serifs, dramatic entrance animation. Here luxury is restraint.
- **Don't** overcorrect into clinical minimalism either. This sells warmth and celebration, not a design-studio portfolio or a SaaS landing page. The warm neutrals and the generous line-heights are what keep it from going cold.
- **Don't** imply J|S runs the event. The visual system should never borrow the vocabulary of planning tools — timelines, checklists, coordination language.
- **Don't** publish a press or partner section until real logos and written permission exist.

---
name: J|S Events
description: Wedding and event design in the Hudson Valley — editorial restraint built around photography.
colors:
  ink: "#141312"
  ink-soft: "#2e2b27"
  ink-muted: "#4a463f"
  ink-subtle: "#6b6660"
  ink-faint: "#8a8378"
  paper: "#fefbf6"
  bone: "#faf8f3"
  cream: "#f4efe3"
  line: "#e4dfd6"
  line-warm: "#d8d2c5"
  line-dark: "#33302c"
  on-dark-muted: "#c9c2b4"
  petal: "#f3e7e2"
  petal-line: "#ddc9c2"
  rose-umber: "#8a5a52"
  sage: "#4f5a48"
  sage-deep: "#3c4536"
typography:
  display-hero:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(40px, 3.81vw + 25.14px, 80px)"
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
    backgroundColor: "{colors.sage}"
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 56px"
  button-primary-hover:
    backgroundColor: "{colors.sage-deep}"
    textColor: "{colors.bone}"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "9px 24px"
  button-outline-hover:
    backgroundColor: "{colors.sage}"
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
    backgroundColor: "{colors.petal}"
    textColor: "{colors.ink}"
    typography: "{typography.quote-md}"
    padding: "44px 0"
---

# Design System: J|S Events

## Overview

**Creative North Star: "The Laid Table"**

The system behaves the way Jessica lays a table. The linen goes down first and it is deliberately quiet — off-white, warm, unpatterned — because everything placed on top of it is what people came to look at. Nothing sits on the table that does not earn its place. The luxury is in the placement and the restraint, never in ornament added afterward.

This is not a metaphor borrowed from the category; it is her actual product. She owns the tabletop layer — linens, flatware, candles, china, runners — and does not own the tables and chairs. The interface honors that same boundary: it builds the surface, sets the objects on it with intention, and gets out of the way. Where a generic wedding site decorates, this one arranges.

The practical consequence runs through every decision below: **every hue in the interface is harvested from the photography, never invented beside it.** The system began with twelve warm neutrals and zero accent. The client's brief (Aug 2026) — *"elevated, warm, some vintage, colors are bright"*, with simplicityinmind.com and nyflorale.com as loved references — recalibrated that stance, tuned toward Simplicity in Mind's temperament: the canvas is now ivory instead of pure white, a pale blush ground (`petal`) carries atmosphere, and two harvested accents appear with strictly rationed jobs — **sage** (the foliage) as the single strong accent, **rose umber** (the dusty rose of her florals) as a quiet typographic inflection. A first pass with a deep wine was rejected by the PM as reading "old"; the rose lives in the grounds and the italics now, not in heavy ink.

**Key Characteristics:**

- Warm neutrals as the ground, no pure white anywhere; blush as atmosphere (`petal`), sage as the one strong accent, rose umber as an inflection; the loud chroma stays in the photography.
- Serif with authority for statement, neutral grotesque for everything operational.
- Radius zero everywhere. Hairline rules instead of boxes.
- Depth by tonal layering, never by shadow.
- Generous vertical air; horizontal discipline against a hard grid.

## Colors

Twelve warm neutrals running from a near-black umber to ivory, plus the Aug 2026 recalibration: a blush ground (`petal`), a dark sage accent, and a rose-umber inflection. The neutrals are still the system's spine; the accents are guests with assigned seats, never hosts.

### Neutral

- **Umber Black** (`#141312`): the system's ink. Body headlines, the dark section band, the primary button fill. Warm-shifted off true black so it sits beside cream without going cold.
- **Press Umber** (`#2e2b27`): reserved for press and partner marks on light ground. Currently unused — no press assets are cleared for publication.
- **Reading Umber** (`#4a463f`): long-form body copy. Steps back from the headline without losing contrast.
- **Quiet Stone** (`#6b6660`): eyebrows, captions, secondary copy, the hover destination for text links.
- **Faint Stone** (`#8a8378`): roman numerals, attributions, and meta on the `ink` footer. The lightest text weight the system permits.
- **Ivory** (`#fefbf6`, token still named `paper`): base ground, taken from Simplicity in Mind's canvas. **There is no pure white anywhere in the system** — the warm base is what keeps light-background photography from floating cut-out against the page.
- **Bone** (`#faf8f3`): the alternating section ground, and the text color on the `ink` footer. Doing double duty is intentional — the warm off-white reads as the same material whether it is behind type or is the type.
- **Cream** (`#f4efe3`): reserved exclusively for the closing CTA block. Its one appearance is what makes the page feel like it arrives somewhere.
- **Hairline** (`#e4dfd6`): dividers and section boundaries on light ground.
- **Warm Hairline** (`#d8d2c5`): FAQ dividers only — a half-step warmer to separate a list of rules from a section boundary.
- **Dark Hairline** (`#33302c`): dividers inside the `ink` footer.
- **Muted Bone** (`#c9c2b4`): contact details in the footer.

### Accent

- **Petal** (`#f3e7e2`): a pale blush ground harvested from her florals — the rose as *atmosphere, not ink*. One job: the testimonial band, which moves off the dark `ink` ground onto this luminous one. Text on petal is `ink` for quotes and `rose-umber` for attributions.
- **Petal Line** (`#ddc9c2`): hairlines on a petal ground only.
- **Rose Umber** (`#8a5a52`): the dusty rose of her florals, deepened to 5.5:1 on `bone`/`paper` — passes AA for its sizes. Exactly three jobs: the italic accent word inside a display headline, attributions/meta on petal ground, and `::selection`. Never a fill, never a button, never body copy.
- **Sage** (`#4f5a48`): the foliage behind the florals — the system's **only strong accent**, the role muted green plays on Simplicity in Mind. Exactly three jobs: the primary button fill, the outline button's hover fill, and small typographic marks (the fleuron, the FAQ `+`/`−`). Measures 7:1 against `bone` text and ground — both directions pass AA.
- **Deep Sage** (`#3c4536`): the primary button's hover fill. Never a text color.

### Named Rules

**The Harvested Palette Rule** *(supersedes "The Photograph Is the Palette", Aug 2026)*. The interface may only wear a hue the photography already contains. Rose and sage qualify because they are in the flowers and the foliage; a blue, a gold, a coral would not. Never introduce an accent that cannot be pointed to inside a photograph on the page, and never let an accent exceed its named jobs — scattered accents read as template, rationed accents read as intent.

**The Grounds Ladder Rule** *(supersedes "The Two Grounds", Aug 2026)*. The page steps through its grounds in one fixed ladder: `paper` (base) → `bone` (alternating band) → `petal` (testimonials, once) → `cream` (closing CTA, once) → `ink` (footer only). Each tinted ground appears exactly once; `ink` is no longer a mid-page band — lifting the dark slab out of the middle is part of what makes the page read bright.

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

- **display-hero** (500, 40→80px, 1.04): the single H1, one per document. It sits on paper, never on a photograph.

  **The floor here is not taste, it is hierarchy.** `display-lg` — the closing CTA headline — is 64px. The hero has to stay far enough above it that the page has one clear loudest voice; at 80px the step is 16px and holds. Below roughly 76px the two collapse into each other and the site loses its accent.
- **display-lg** (500, 32→64px, 1.15): the closing CTA headline. The largest type after the hero, and the only other place that scale appears.
- **display-md** (400, 32→56px, 1.15): section headings on the testimonial band and in FAQs. Weight 400, not 500 — at this scale the lighter weight reads correctly.
- **heading-lg** (500, 30→44px, 1.2): standard section headings on light ground.
- **heading-md** (500, 21→24px, 1.3): service card titles.
- **quote-xl** (400, 26→40px, 1.45): the manifesto statement. The loosest line-height in the system; it is meant to be read slowly.
- **quote-md** (400, 17→21px, 1.6): testimonials, in typographic quotes.
- **quote-italic** (400 italic, 18→26px, 1.6): supporting lines over photography and beside portraits.
- **body-lg / body-md / body-sm** (400, 15 / 14 / 13.5px, 1.9 / 1.85 / 1.75): long copy, secondary copy, card copy. Note the line-height rises as size rises.
- **label / label-sm / label-xs** (500, 11 / 10 / 9px, tracking .30 / .26 / .30em, uppercase): eyebrows, buttons, navigation, footer, logo subline.

### Named Rules

**The Italic Accent Word Rule** *(Aug 2026)*. A display headline may set **at most one word or phrase** in Playfair italic, optionally in `rose-umber` — the vintage inflection the client asked for. One per headline, never in body copy, never in labels. Two italic words in one headline is a costume. **Exception: the hero's italic stays `ink`.** A colored italic word beside the sage button on a warm ground is Florale's hero formula verbatim (PM call, Aug 2026); rose-umber in display type is reserved for headlines further down the page, where the echo dissolves.

**The Fleuron Rule** *(Aug 2026)*. The system permits a single ornament glyph — the fleuron `❋`, set in Playfair at `sage` or `ink-subtle` — as a section divider in place of a hairline. At most one per page. It is the only ornament the system will ever allow; it earns its place by being typographic, not decorative clip-art.

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
| Hero collage | 1 photograph | collage of 2 | collage of 3 |
| Services | 1 column | 2 columns | 4 columns |
| Manifesto | stacked, photo last | 150 / 1fr | 200 / 1fr / 200 |
| Testimonials, FAQs | stacked | stacked | 0.8fr / 1.2fr, sticky heading |
| Look Book | 2 columns | 2 columns | 4 columns |
| Editorial break | 320px tall | 420px | 640px |
| Buttons | **full width** | inline | inline |

The governing rule is **one column fewer per breakpoint down**, never a reflow into a different concept.

### The hero orders message before proof

Headline → location → CTA → collage, at every breakpoint. The headline never sits on a photograph.

This order is load-bearing, not stylistic. The original composition overlapped the headline on the collage, and that overlap was quietly doing two jobs: it looked editorial, and it compressed roughly 250px of height. Lifting the headline onto paper for contrast cost that compression and pushed the CTA off the fold — measured at 1144px on a 1440×900 screen. Shrinking the headline and the collage could not recover it without gutting both.

Moving location and CTA above the collage recovers it without gutting anything: the collage holds its full 560px, and the CTA lands at **464px on desktop, 367 on tablet, 309 on mobile** — inside the fold even on a laptop with browser chrome. The collage becomes the reward for scrolling rather than a gate in front of the ask, and the nav's persistent `Inquire` covers everyone who scrolls past.

**Touch targets are 44px minimum on mobile, and that rule outranks any height in the original handoff.** Where the two collide — the second nav row was specified at 37px — the target wins and the row grows to 45px. Padding lives on the anchor; the active-state underline lives on an inner span so it hugs the text instead of the edge of the tap area.

## Motion

*(Added Aug 2026 — the client asked for "movement"; the system answers with slow editorial reveals, not spectacle.)*

One easing, two speeds, one pattern:

- **Easing:** `cubic-bezier(0.22, 0.61, 0.36, 1)` — the same curve the nav already uses. Nothing bounces, nothing overshoots.
- **Durations:** 640ms for geometry (rise, scale), 400ms for opacity. Interactive states stay at the existing 180ms.
- **The Reveal:** sections and images fade in and rise 24px as they enter the viewport, once, via `IntersectionObserver`. Siblings stagger 80ms. Images may additionally settle from `scale(1.04)` to `1` — the photograph breathes into place.

**Named rules:**

**The Once Rule.** A reveal plays once per page load. Nothing re-animates on scroll-up, nothing loops, nothing moves while the visitor reads.

**The No-Parallax Rule.** No scroll-linked transforms, no parallax, no pinned sections. Movement here is arrival, not choreography.

Under `prefers-reduced-motion`, everything is instant — already enforced globally in `globals.css`.

## Elevation & Depth

**This system is flat and has no shadow vocabulary.** Nothing is lifted, nothing floats, no surface casts.

Depth is built two ways instead. First, **tonal layering**: consecutive full-width bands step through the Grounds Ladder — `paper → bone → petal → cream → ink` — so the page reads as stacked material rather than stacked cards. Second, **hairlines**: a single 1px rule in the appropriate divider token separates what a border-radius-and-shadow card would otherwise separate.

The one `box-shadow` in the entire codebase is not elevation. The primary button's hover state swaps to a light fill and needs an outline; a real `border` would change its box and shift the layout mid-transition, so it uses `inset 0 0 0 1px` as a border substitute. It reads as a hairline, not a shadow.

### Named Rules

**The No-Lift Rule.** Nothing in this system rises off the page. If an element needs separation, it gets a hairline, a tonal ground, or more space — in that order. A drop shadow anywhere is a defect.

## Shapes

**Radius is zero everywhere, and there is deliberately no radius scale to reach for** — buttons, images, cards, inputs, the dark band. The only `rounded` token is `none: 0px`, and it exists so components can reference the decision explicitly rather than omit the property by accident.

The form language is rectangles and hairlines. Photographs are hard-cropped with `object-fit: cover`, either full-bleed or locked to the grid, in three canonical ratios: **3/4** (service cards), **4/5** (look book, and service cards on mobile), **4/3** (manifesto on mobile). The hero collage is the one exception, using fixed pixel heights with deliberate vertical offsets so the three images sit at different altitudes.

### Captions sit below the plate, not on it

**The photograph is never scrimmed to make a caption readable.** A full-bleed image carries its caption underneath, on paper, the way a plate in a photography book carries its credit line:

```
<figure>
  <Image className="h-80 w-full object-cover md:h-[420px] lg:h-[640px]" />
  <figcaption className="gutter shell flex flex-col gap-1 pt-3.5
                         md:flex-row md:items-baseline md:justify-between md:pt-4 lg:pt-5">
```

The caption aligns to the same rail as every other section — its left and right edges land exactly on the Expertise header's — so a full-bleed image reads as part of the grid rather than as a floating banner. The statement goes left in `quote-italic`, the location right in `label-sm` `ink-subtle`. On mobile they stack.

A scrim buys legibility by damaging the only asset that sells the work. It also never looks expensive: a gradient over a photograph is the visual signature of a stock template. Below the plate, contrast is a solved problem (18.6:1 for the statement, 5.7:1 for the meta) and the photograph is untouched.

**`ink-faint` is a dark-ground token only.** On `paper` or `bone` it measures 3.75:1 and fails AA for anything under 24px. Numerals, meta, and captions on light ground use `ink-subtle`.

Contrast over photography, wherever it is unavoidable, is **measured against the actual pixels under the text** — sample the image, compose the overlay alpha, take the worst case. White linen and candlelight are the failure case in this library, and eyeballing a scrim is how you ship 1.6:1.

The logotype follows the same discipline: the bar in `J|S` is a 1px `<span>`, not the `|` character, so its height and spacing are controlled to the pixel instead of inheriting a font metric.

## Components

### Buttons

- **Shape:** square (`0px`), no exceptions — Florale's pills stay Florale's.
- **Primary:** `sage` fill, `bone` text, `label` type, padding `18px 56px`. Full width below 768px. *(Recolored from `ink` in the Aug 2026 recalibration — the one place the palette's warmth meets the one action that matters.)*
- **Primary hover:** deepens to `sage-deep`, 180ms. No lift, no scale, no shadow.
- **Outline (nav CTA):** 1px `ink` border, transparent fill, `label-sm`. Hover fills to `sage` with `bone` text. Its visible box is **32px** so it does not dominate a 53px nav row; the touch target reaches **44px** through an `::after` that extends the hit area 6px above and below. Visual size and touch surface are not the same rectangle, and forcing them to be is what makes a small control look bloated.

### Links

- **Underline link:** `label` type with a 1px `ink` bottom border on an inner span, 4px below the text. Hover moves the text to `ink-subtle`; the rule stays. Never add a second underline on hover.
- **Text link on dark:** `bone` → `ink-faint` on hover.

### Navigation — the signature component

Two rows, and the rules here are stricter than anywhere else in the system.

- **Row 1** (`1fr auto 1fr`): empty / centered logotype / `Inquire` outline button. It never moves.
- **Row 2:** the four section links, centred at every breakpoint via `justify-center-safe`. The `safe` keyword matters: on a narrow phone the links no longer fit, and a plain `center` inside an `overflow-x: auto` row pushes the first item past the left edge where scrolling cannot reach it. `safe` degrades to left alignment exactly when that would happen — verified centred at 390, falling back and still scrollable at 320.
- **Collapse:** past the hero, row 2 collapses and **only returns when the visitor scrolls back above the threshold** — not on any upward scroll mid-page. The threshold is a 1px sentinel the hero places 120px before its own end, watched by an `IntersectionObserver`. There is no scroll listener.
- **Mechanics:** the collapse animates `grid-template-rows: 1fr → 0fr`, not a fixed `max-height`, because the row is a different height at every breakpoint. The bottom hairline lives inside the clipped child so it disappears with the row instead of stranding a line under the logo. Collapsed, the row carries `inert` — no tabbing to an invisible link.
- **Motion:** 420ms `cubic-bezier(0.22, 0.61, 0.36, 1)` on geometry, 260ms on opacity. Instant under `prefers-reduced-motion`.

### Cards

There are no cards. Service entries are a photograph, a roman numeral in Playfair, a title, and copy — stacked in a column with no container, no border, and no background. The grid does the grouping.

### Quote block

Playfair at `quote-md` in typographic quotes (`" "`, never `"`), attribution beneath in `label-sm` uppercase `rose-umber`, separated by a `petal-line` hairline. Lives on the `petal` band — moved off `ink` in the Aug 2026 recalibration; the quotes now read luminous instead of solemn.

### FAQ accordion

One open at a time. Trigger is a full-width button: lowercase roman numeral in `ink-faint`, question in Playfair 500, and a Playfair `+` / `−` at 22px on the right. The answer is capped at `60ch` and indented to align with the question, not the numeral.

### Inputs

Square corners, no fills, and **a single hairline under each field** rather than a box. A boxed input is a form; an underlined one is a line on paper — the difference is the whole register of this page.

- **Field label:** `label-sm` uppercase in `ink-subtle`, above the control. Every field is labelled; no placeholder-as-label.
- **Control:** transparent ground, `border-bottom: 1px` in `line-warm`, `body-lg` type in `ink`, 44px minimum height. On focus the rule thickens to `sage` — the accent's one job in the form, and the only place it appears outside a button.
- **Optional fields** carry a lowercase `(optional)` beside the label in `ink-faint`; required fields are unmarked. Marking the exception rather than the rule keeps eight asterisks off the page.
- **Select:** the same underline; the native control, restyled — never a custom dropdown.
- **Error:** the rule turns `rose-umber` and the message sits beneath in `body-sm` `rose-umber`, naming the problem and the fix. Rose is the system's only alarm colour, and it is deliberately quiet — this form never scolds.
- **Success:** the form is replaced in place by a Playfair confirmation at `heading-lg`; no toast, no modal.

### The inquiry page is its own room

`/inquire` is a full-screen surface at every breakpoint, not a section and not a modal. It carries the **full two-row navigation**, and row 2 never collapses there — the collapse is driven by a sentinel the hero plants, and off the home page there is no sentinel, so the links simply stay.

A first pass gave the page row 1 only, on the theory that a conversion surface should not offer lateral escapes. That was wrong in practice (PM call, Aug 2026): **a centred logotype does not read as an exit.** Visitors did not perceive a way back at all, which is a worse failure than a few extra links — a trapped visitor leaves the site, not just the page. The nav anchors are therefore root-relative (`/#look-book`, not `#look-book`) so they resolve from any page.

The content column is **centred in the document** at `max-w-[900px]`, not hung off the left rail. The wide rail exists to feed photography; a form has none, and left-aligning it stranded half the viewport empty.

The scheduling calendar of the legacy Wix site is deliberately **not** reproduced. Times get negotiated in the reply; a public calendar promises an availability nobody is maintaining.

## Do's and Don'ts

### Do:

- **Do** harvest any interface hue from the photography — rose from the florals, sage from the foliage — and keep each accent inside its named jobs.
- **Do** set uppercase labels at weight 500 and the tracking their token specifies.
- **Do** anchor any new type token with the `clamp(min, slope·vw + base, max)` formula so it lands exactly on its mobile and desktop sizes.
- **Do** separate with a hairline, a tonal ground, or space — in that order.
- **Do** cap reading measure on the paragraph itself in `ch`, never by narrowing the container. The rail belongs to the photography.
- **Do** give mobile controls a 44px touch target — but reach it with an `::after` hit-area extension when 44px of *visible* box would overwhelm the composition. Put padding on the anchor and the underline on an inner span.
- **Do** keep one `<h1>` per document; move its positioning anchor across breakpoints rather than duplicating it.
- **Do** use typographic quotes and the `·` separator the system already uses in meta lines.

### Don't:

- **Don't** introduce any accent beyond `petal`, `rose-umber`, and `sage`, and don't let any exceed its named jobs. No hue-carrying gradients, no pure white, no tinted states outside the accents' assignments.
- **Don't** scrim a photograph to make a caption readable. Put the caption below the plate. A gradient over an image is the signature of a template, and it costs the one asset that sells the work.
- **Don't** use `ink-faint` on light ground — it fails AA below 24px. It is the dark-ground token.
- **Don't** add a border-radius anywhere, on anything, ever.
- **Don't** add a drop shadow or any lift. If it looks like it needs one, it needs space.
- **Don't** reach for the generic wedding-site vocabulary: hero carousels, vendor badges, script or handwritten typefaces, blush palettes, eucalyptus ornament, or "the day of your dreams" register.
- **Don't** signal luxury by accumulation — gold, marble, glinting serifs, dramatic entrance animation. Here luxury is restraint.
- **Don't** overcorrect into clinical minimalism either. This sells warmth and celebration, not a design-studio portfolio or a SaaS landing page. The warm neutrals and the generous line-heights are what keep it from going cold.
- **Don't** imply J|S runs the event. The visual system should never borrow the vocabulary of planning tools — timelines, checklists, coordination language.
- **Don't** publish a press or partner section until real logos and written permission exist.

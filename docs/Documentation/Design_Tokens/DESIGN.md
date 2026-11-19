---
name: Velvet & Cone
colors:
  alabaster: '#FAF6F0'
  cream: '#F3ECE1'
  espresso: '#1E1611'
  cocoa: '#382920'
  gold: '#C69C6D'
  gold-light: '#DFC097'
  taupe: '#8C7A6B'
  featured-panel: '#211711'
  hero-loader: '#17100c'
  hero-gradient-start: '#130d09'
  hero-gradient-mid: '#21150f'
  hero-gradient-end: '#120c09'
  glow-criollo: 'rgba(137, 79, 45, 0.34)'
  glow-vanilla: 'rgba(198, 156, 109, 0.3)'
  glow-pistachio: 'rgba(105, 127, 81, 0.3)'
  success: '#047857'
  warning: '#B45309'
  danger: '#BE123C'
typography:
  display-xl:
    fontFamily: Cormorant Garamond
    fontSize: 96px
    fontWeight: '500'
    lineHeight: 86px
  display-lg:
    fontFamily: Cormorant Garamond
    fontSize: 72px
    fontWeight: '500'
    lineHeight: 65px
  display-md:
    fontFamily: Cormorant Garamond
    fontSize: 60px
    fontWeight: '500'
    lineHeight: 60px
  headline-lg:
    fontFamily: Cormorant Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 48px
  headline-md:
    fontFamily: Cormorant Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 38px
  headline-sm:
    fontFamily: Cormorant Garamond
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 36px
  title-lg:
    fontFamily: Cormorant Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 30px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 29px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10-11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  full: 9999px
spacing:
  canvas-max: 1280px
  gutter: 1.5rem
  section-y: 6rem
  nav-height: 5rem
  card-gap: 1.25-2rem
  admin-margin: 1.5-2.5rem
motion:
  reveal: 700ms cubic-bezier(0.22, 1, 0.36, 1)
  hero-progress-lerp: 0.12
  hover: 200-300ms
---

## Brand & Style

Velvet & Cone is an artisanal small-batch gelato atelier: part neighborhood counter, part editorial tasting room. The visual language is **Editorial Indulgence & Copper Warmth** — restrained cream paper surfaces set against deep espresso brown, with antique gold as the single accent. The brand speaks in generous serif headlines and quiet, widely-tracked labels, letting product photography and a slowly rotating 3D cone carry the atmosphere.

The interface is deliberately unhurried: a 360vh scroll canvas on the homepage reveals the making process one chapter at a time, while the admin portal uses the same palette in a denser, operational layout.

## Colors

- **Alabaster (`#FAF6F0`)**: default page canvas, soft enough to read as warm paper rather than white.
- **Cream (`#F3ECE1`)**: alternate sections, card interiors, wells and inactive filter pills.
- **Espresso (`#1E1611`)**: primary ink, dark navigation/footer panels, admin sidebar, primary buttons.
- **Cocoa (`#382920`)**: hover state on espresso buttons, secondary dark surfaces, image scrims.
- **Gold (`#C69C6D`)**: brand accent for eyebrows, icons, focus borders and active navigation.
- **Gold Light (`#DFC097`)**: lighter accent for text on dark surfaces and button hovers.
- **Taupe (`#8C7A6B`)**: metadata, captions and labels — use above 18px or for non-essential text (see contrast note in the design documentation).

Fixed tints create depth inside dark surfaces: featured-churn cards `#211711`, hero loader `#17100c`, gradient stops `#130d09 / #21150f / #120c09`, and three procedural glows (`criollo`, `vanilla`, `pistachio`). Ember, emerald and rose are reserved for stock, success and error feedback.

## Typography

- **Headlines (`Cormorant Garamond`)**: editorial, high-contrast serif used for every `h1`–`h4`, hero copy, prices and metric values. Tight tracking, near-solid line height at display sizes.
- **Body & controls (`Plus Jakarta Sans`)**: geometric, highly legible sans for descriptions, forms, tables, navigation and uppercase micro-labels.
- **Numeric metadata (`font-mono`)**: chapter numbers, order IDs and the scroll progress indicator.

No third family is introduced. Hierarchy comes from scale, weight and the serif/sans contrast.

## Layout & Spacing

- **Desktop (12 columns)**: 1280px (`max-w-7xl`) content container, 24px horizontal gutters, 96px vertical section padding. Craft and Locations use a 5/7 column split; card grids run two or three across.
- **Tablet / mobile**: grids collapse to a single column; the fixed header switches to a slide-down menu; the admin sidebar becomes a horizontal tab strip.
- **Hero**: 360vh scroll container with a sticky 100svh frame — the only full-bleed dark zone on the public site.
- **Admin**: 288px (`w-72`) espresso sidebar beside a 24–40px padded content area.

## Elevation & Depth

- **Level 0**: flat alabaster canvas with hairline `espresso/10` borders.
- **Level 1**: `shadow-sm` on admin cards and tables.
- **Level 2**: `shadow-lg` on hovered flavor cards.
- **Level 3**: `shadow-xl` on selected chapter/location cards, `shadow-2xl` on the flavor modal and pickup drawer.
- **Dark surfaces**: depth comes from inset `alabaster/10` borders, radial gold glows, a dotted grain overlay and layered gradients rather than cast shadows.

## Shapes

- **Pill controls** (`rounded-full`): buttons, filter chips, stock pills, badges, the order badge and the cart drawer close button.
- **Soft cards** (`rounded-3xl` / 24px): flavor cards, craft and location selectors, chapter panels and the tasting modal.
- **Nested wells** (`rounded-2xl` / 16px): product image frames, metric tiles and confirmation panels.
- **Inputs & small tiles** (`rounded-xl` / 12px): fields, selects, pickup slots and swatches.

## Components

### Buttons
- **Primary pill**: `bg-espresso`, `text-alabaster`, uppercase 12px label with `0.14–0.18em` tracking; hover `bg-cocoa`.
- **Gold pill**: `bg-gold`, `text-espresso`; hover `bg-gold-light`. Used for "Explore Flavors" and "Publish to Menu".
- **Outline / ghost**: transparent or `bg-cream/60` with `border-espresso/15`; active filter turns `bg-espresso`/`text-alabaster`.
- **Disabled**: `bg-espresso/15` with `text-espresso/40` and `cursor-not-allowed`.

### Chips & Badges
- Uppercase 10–12px, `0.14–0.24em` tracking. Category chips use `bg-espresso/5`; dietary chips use `bg-gold/20`.
- Stock pills use Tailwind emerald/rose pairs with a 2px status dot; hero eyebrow uses a bordered `bg-espresso/55` pill on the 3D canvas.

### Input Fields
- `rounded-xl`, `border-espresso/15`, white fill, 14px text, `focus:border-gold`.
- Labels sit above in 11–12px uppercase taupe with `0.15–0.16em` tracking.
- Pickup slots and procedural palette choices are selectable tiles rather than radios.

### Product & Story Cards
- `rounded-3xl` with `border-espresso/10` and `bg-cream/60`; hover lifts with `hover:-translate-y-1` and a warmer border.
- Flavor swatch panels use the flavor's own `swatch` hex as the image area, with an espresso gradient scrim for availability and price overlays.

### Data & Operations
- Admin tables use a `bg-cream/60` header row, `divide-espresso/10` separators and inline price editing with dashed gold underline.
- The order board is a four-column kanban (Received → Churning → Ready for Pickup → Completed) with an arrow action to advance each order.

### Motion
- Scroll progress is eased with `requestAnimationFrame` (`0.12` lerp) and drives four editorial callouts plus the hero video scrub.
- Section reveals use IntersectionObserver and a 700ms `cubic-bezier(0.22, 1, 0.36, 1)` fade/rise.
- `prefers-reduced-motion` collapses all animation and forces revealed content visible.

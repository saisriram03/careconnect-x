# CareConnect X Design Brief

**Purpose:** Next-generation AI-powered healthcare platform with adaptive, predictive, and gamified user experience.

**Tone:** Sophisticated, intelligent, futuristic—feels alive and personalized. Bold cyan neural accents over refined black/pink foundation.

**Palette**

| Token | OKLCH | Usage |
|-------|-------|-------|
| Background | `0.06 0 0` (dark) / `0.97 0 0` (light) | Page backgrounds |
| Foreground | `0.97 0 0` (dark) / `0.1 0 0` (light) | Text |
| Primary/Accent | `0.78 0.12 350` | Baby pink (health, bookings) |
| AI Cyan | `0.65 0.16 270` | Neural, predictive, AI indicators |
| AI Green | `0.72 0.18 135` | Achievement unlock, success |
| AI Amber | `0.73 0.12 65` | Risk predictions, warnings |
| Border | `0.22 0 0` (dark) | Subtle structure |

**Typography**

| Layer | Font | Scale |
|-------|------|-------|
| Display | Plus Jakarta Sans | 2rem–3rem, 700 |
| Body | Inter | 0.875rem–1rem, 400–500 |
| Mono | System | Code, metrics |

**Elevation & Depth**

- **Glass cards**: `backdrop-filter: blur(16px)`, subtle cyan border in AI Hub, pink border in health
- **Glow shadows**: Cyan (`rgba(0,255,200,0.35)`), green unlock, amber warning
- **Borders**: Transparent + opacity layering (never solid black)

**Structural Zones**

| Zone | Styling |
|------|---------|
| Header | `bg-background` with subtle top border |
| Sidebar | `bg-sidebar` with glass-card sub-sections for AI Hub nav |
| Main content | `bg-background` gradient fill, alternating `bg-card` sections |
| AI Hub pages | Neural grid pattern (`radial-gradient`) overlay, glassmorphism cards |
| Cards in AI Hub | `.ai-card` with cyan border glow, `.prediction-card` with confidence scanner line |

**Spacing & Rhythm**

- Gap between sections: `1.5rem`
- Card padding: `1rem–1.5rem`
- Sidebar modules: stacked with `0.5rem` spacing between items
- Text hierarchy: `0.875rem` (labels), `1rem` (body), `1.25rem` (headings)

**Component Patterns**

- `.ai-card` — Cyan-bordered glass card for AI modules
- `.ai-badge` — Small cyan label for personality types, trust scores
- `.achievement-card` — Unlockable feature card, green glow on unlock
- `.prediction-card` — Forecast with confidence meter, cyan scanner line
- `.trust-meter` — Circular radial-fill progress (conic-gradient)

**Motion**

| Animation | Duration | Trigger |
|-----------|----------|---------|
| `ai-pulse` | 2s infinite | AI indicator presence |
| `unlock-burst` | 0.6s | Achievement unlock |
| `trust-fill` | 1.2s | Trust score calculated |
| `confidence-scan` | 2s infinite | Prediction card mounted |

**Constraints**

- No rounded corners > 16px except full circles
- No drop shadows; use glow and border only
- Cyan only in AI Hub; pink remains in health modules
- All motion must feel organic, not mechanical
- Light mode swaps cyan → teal (`rgba(0,150,200)`), green → forest green

**Signature Detail**

Neural grid pattern (`radial-gradient` dots) subtly animates behind AI Hub pages. Confidence scanner line sweeps across prediction cards. Achievement unlock triggers burst + glow cascade.

# Kaizentrix Design System (@kaizentrix/design-system)

The **Kaizentrix Enterprise Design System** provides the foundational brand tokens, typography scales, clinical status color systems, Tailwind CSS configuration, and WCAG 2.1 / 2.2 AA accessibility guidelines for the Kaizentrix Global Solutions (KGS) Enterprise Teleconsultation Platform.

---

## 1. Directory Structure

```text
design-system/
├── globals.css                # Base Tailwind imports & CSS custom properties (light & dark theme)
├── kaizentrix_design_system.md# Comprehensive 180KB+ design specification & component guidelines
├── package.json               # Design system dependencies, scripts, and package metadata
├── tailwind.config.ts         # Master Tailwind CSS configuration & extended brand token definitions
├── tokens.json                # Structured W3C Design Tokens Community Group (DTCG) tokens file
└── README.md                  # This documentation
```

---

## 2. Brand Identity & Color Architecture

The visual identity is derived directly from the official Kaizentrix corporate branding:

### Core Brand Palettes
- **Brand Blue (`brand-blue-600` / `#1158B0`)**: Primary brand anchor representing clinical trust, integrity, and enterprise stability.
  - Scale: `50` (`#EFF6FF`) to `950` (`#051833`).
- **Kaizen Green (`kaizen-green-500` / `#8AC048`)**: Vitality and continuous improvement arrow representing health, renewal, and growth.
  - Text-Accessible Variants: `kaizen-green-700` (`#538223`, 4.58:1 on white) and `kaizen-green-800` (`#3C6119`, 7.20:1 AAA on white).
- **Ambient Cyan (`ambient-cyan-500` / `#0EA5E9`)**: Modern teleconsultation digital accent representing connectivity and real-time interaction.
- **Neutral Slate (`neutral-slate-900` / `#0F172A`)**: High-readability grayscale for medical dashboards, typography, and borders.

### Healthcare & Clinical Status Colors
The design system includes dedicated semantic tokens for critical clinical workflows:
- **Clinical Emergency / Critical**: `#EF4444` (`red-500`) / `#DC2626` (`red-600`) — high-triage alerts, drug-drug contraindications.
- **Clinical Warning**: `#F59E0B` (`amber-500`) / `#D97706` (`amber-600`) — allergy notices, pending lab reviews.
- **Clinical Success**: `#10B981` (`emerald-500`) / `#059669` (`emerald-600`) — verified ABDM ABHA linking, signed prescriptions.
- **Clinical In-Progress / Info**: `#3B82F6` (`blue-500`) — active consultations, room waiting states.

---

## 3. Design Tokens Architecture (`tokens.json`)

The design tokens are organized semantically following W3C DTCG specifications:
- **Color Tokens**: Global raw palettes, functional theme mappings, and role-based aliases.
- **Typography**: Inter (Body & UI) and Plus Jakarta Sans (Headings & Metrics) font hierarchies.
- **Spacing & Layout**: 4px/8px modular base scale (`p-1` through `p-16`).
- **Elevation & Shadows**: Multi-layered soft shadows optimized for clinical elevation without visual distraction.
- **Border Radii**: Subtle clinical radius scales (`sm: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`, `full: 9999px`).

---

## 4. Integration with Frontend (`web/`)

The web application directly leverages the design system tokens:
1. **Tailwind Extension**: `web/tailwind.config.ts` extends standard utilities with the `@kaizentrix/design-system` color tokens and font families.
2. **CSS Variables**: `web/app/globals.css` mounts root HSL variables (`--background`, `--foreground`, `--primary`, `--secondary`, etc.) for seamless runtime dark mode support via `next-themes`.
3. **Component Consistency**: UI components in `web/components/ui/` (Radix UI primitives + Tailwind) adhere to tokenized states for focus rings, hover transitions, and contrast requirements.

---

## 5. Accessibility Compliance (WCAG 2.1 / 2.2 AA)

All color combinations and component tokens adhere to strict healthcare accessibility standards:
- **Normal Text**: Minimum contrast ratio of **4.5:1** against backgrounds.
- **Large Text (18pt+ or 14pt+ bold)**: Minimum contrast ratio of **3:1**.
- **Interactive UI Components & Focus Indicators**: Minimum contrast ratio of **3:1** against adjacent colors.
- **Touch Targets**: Minimum **44px × 44px** for mobile/tablet consultation interfaces.

---

## 6. Reference Specification

For full design specifications, component guidelines, layout wireframes, and token tables, refer to:
- [`kaizentrix_design_system.md`](file:///c:/Users/Admin/Desktop/tele-consultation%20market%20analysis/design-system/kaizentrix_design_system.md)


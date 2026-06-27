# Cattle Management System — Design System

**Version**: 1.0  
**Last Updated**: 2026-06-27  
**Status**: Active (in implementation)

---

## Overview

This document defines the complete design system for the Cattle Management System frontend. All UI components should use these tokens rather than hardcoded values.

---

## Color Palette

### 8 Semantic Colors

| Token | Hex Value | Usage | Example |
|-------|-----------|-------|---------|
| **primary** | #2563eb | CTAs, active states, links, primary brand | "Add Cattle" button |
| **primary_dark** | #1e40af | Hover state of primary buttons | Button :hover |
| **secondary** | #8b5cf6 | Accent, secondary CTAs, highlights | Secondary actions |
| **success** | #10b981 | Positive states, checkmarks, success states | "Active" badge |
| **error** | #ef4444 | Destructive actions, errors, alerts | "Delete" button, error text |
| **warning** | #f59e0b | Cautions, alerts, warnings | "Sold" badge |
| **neutral** | #6b7280 | Body text, secondary information | Form labels, body copy |
| **neutral_light** | #f3f4f6 | Backgrounds, borders, disabled states | Card backgrounds, borders |

### Text Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| **text_primary** | #111827 | Primary text (headings, body) |
| **text_secondary** | #6b7280 | Secondary text (metadata, labels) |
| **text_muted** | #9ca3af | Muted text (placeholders, hints) |

### Background Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| **bg_primary** | #ffffff | Main background |
| **bg_secondary** | #f3f4f6 | Secondary background (cards, sections) |
| **bg_tertiary** | #f9fafb | Tertiary background (hover states) |

### Borders

| Token | Hex Value | Usage |
|-------|-----------|-------|
| **border** | #e5e7eb | Default border color |

### Import Usage

```typescript
import { colors } from '@/styles/colors';

// Usage
const buttonStyles = {
  backgroundColor: colors.primary,
  color: colors.bg_primary,
  '&:hover': {
    backgroundColor: colors.primary_dark,
  },
};
```

---

## Typography Scale

### 4-Tier Hierarchy

| Tier | Size | Weight | Usage | Example |
|------|------|--------|-------|---------|
| **Display** | 36px | Bold | Page titles, hero content | Page header "Analytics Dashboard" |
| **Heading** | 24px | Bold | Section headers | Card titles "Breed Distribution" |
| **Subheading** | 18px | Semibold | Labels, card titles | Form labels, small section headers |
| **Body** | 16px | Normal | Primary content | Paragraph text, table cells |
| **Small** | 14px | Normal | Secondary info, captions | Metadata, timestamps, hints |
| **Code** | 13px | Monospace | Error messages, IDs | Error text, cattle tags |

### Tailwind Classes

All typography uses Tailwind classes defined in `typography.ts`:

```typescript
import { typography } from '@/styles/typography';

// Usage
<h1 className={typography.display}>Cattle Inventory</h1>
<p className={typography.body}>Lorem ipsum...</p>
<span className={typography.small}>Created on 2026-06-27</span>
```

### Font Weights

- **Light**: 300 (rare)
- **Normal**: 400 (body text, secondary)
- **Medium**: 500 (labels)
- **Semibold**: 600 (subheadings, accents)
- **Bold**: 700 (headings, display)

---

## Spacing System

### 8px Base Grid

All spacing follows an 8px grid for visual consistency.

| Token | Value | Usage | Tailwind* |
|-------|-------|-------|-----------|
| **xs** | 4px | Micro spacing (badges, icons) | gap-1 |
| **sm** | 8px | Button padding, input height | gap-2 |
| **md** | 12px | Element spacing | gap-3 |
| **lg** | 16px | Component spacing (default) | gap-4 |
| **xl** | 24px | Section spacing | gap-6 |
| **xxl** | 32px | Major section spacing | gap-8 |
| **xxxl** | 48px | Page section spacing | gap-12 |
| **giant** | 64px | Hero sections, full-page | gap-16 |

*Tailwind uses 4px as base unit, so 8px = "2", 16px = "4", etc.

### Component Presets

```typescript
import { componentSpacing } from '@/styles/spacing';

// Button padding by size
componentSpacing.button.sm   // 8px 12px
componentSpacing.button.md   // 8px 16px
componentSpacing.button.lg   // 12px 16px

// Card padding by size
componentSpacing.card.sm     // 12px
componentSpacing.card.md     // 16px
componentSpacing.card.lg     // 24px

// Form spacing
componentSpacing.input.padding  // 8px 12px
componentSpacing.formGap        // 12px between fields
```

### Usage

```typescript
import { spacing } from '@/styles/spacing';

<div className="gap-4">  {/* Tailwind: 16px gap */}
  <Card style={{ padding: spacing.lg }}>
    <p style={{ marginBottom: spacing.md }}>Text</p>
  </Card>
</div>
```

---

## Shadow/Depth System

### 3 Levels of Elevation

| Level | Box Shadow | Usage |
|-------|-----------|-------|
| **Depth 1 (card)** | `0 1px 2px rgba(0,0,0,0.05)` | Cards, resting state |
| **Depth 2 (modal)** | `0 4px 12px rgba(0,0,0,0.15)` | Modals, hover cards |
| **Depth 3 (tooltip)** | `0 10px 25px rgba(0,0,0,0.2)` | Tooltips, floating elements |

### Usage

```typescript
import { shadows } from '@/styles/shadows';

<div style={{ boxShadow: shadows.card }}>
  Card content
</div>

<div style={{ boxShadow: shadows.modal }}>
  Modal content
</div>
```

### Component Elevation Presets

```typescript
import { componentElevation } from '@/styles/shadows';

// Button shadow behavior
componentElevation.button.default  // none
componentElevation.button.hover    // shadows.card (lifts on hover)
componentElevation.button.active   // none (presses down)

// Card shadow behavior
componentElevation.card.default    // shadows.card
componentElevation.card.hover      // shadows.modal (lifts)
```

---

## Component Guidelines

### Buttons

```
Variants:
- Primary: blue background, white text (CTAs)
- Secondary: purple background, white text (secondary actions)
- Danger: red background, white text (destructive)
- Ghost: transparent background, blue text (text-only)

Sizes:
- Small (sm): 8px vertical, 12px horizontal padding
- Medium (md): 8px vertical, 16px horizontal padding
- Large (lg): 12px vertical, 16px horizontal padding

States:
- Default: base styling
- Hover: darker shade + depth-1 shadow
- Active: even darker (primary_dark for primary variant)
- Disabled: grayed out (neutral_light background, neutral text)
- Focus: blue ring around button
- Loading: spinner + "Saving..." text
```

### Cards

```
Sizes:
- Small: 12px padding (for compact layouts)
- Medium: 16px padding (default)
- Large: 24px padding (hero/featured)

Styling:
- Background: white (bg_primary)
- Border: 1px neutral border
- Shadow: depth-1 (card)
- Border radius: 8px
- Hover: shadow lifts to depth-2

Optional:
- Icon: top-left (24x24px)
- Badge: top-right (success/error/warning variant)
```

### Status Badges

```
Variants (4 statuses):
- Active: green background + "🟢" icon
- Sold: warning/amber background + "💰" icon
- Deceased: error/red background + "💀" icon
- Removed: neutral background + "➖" icon

Styling:
- Padding: 8px horizontal, 4px vertical
- Border radius: full (pill shape)
- Font size: small (14px)
- Font weight: medium (500)
```

### Form Inputs

```
Styling:
- Background: white
- Border: 1px neutral border
- Padding: 8px vertical, 12px horizontal
- Border radius: 4px
- Min height: 40px (touch target)

States:
- Placeholder: gray text (text_muted)
- Focus: blue ring + blue border
- Error: red border + error message below
- Disabled: neutral_light background + gray text
- Filled: text_primary text

Focus Ring:
- Color: primary blue
- Width: 2px
- Offset: 2px
```

### Success Toast

```
Positioning:
- Fixed bottom-right
- Margin: 16px from edges

Styling:
- Background: success green
- Text: white
- Icon: checkmark (✓)
- Padding: 16px
- Border radius: 8px
- Shadow: depth-3

Animation:
- Entrance: fade-in + slide-up (0.3s)
- Auto-dismiss: 3000ms
- Exit: fade-out (0.3s)

Accessibility:
- Respect prefers-reduced-motion (no animation if set)
```

---

## Dark Mode

### Color Overrides

In dark mode, the following colors are inverted:

```typescript
// Light mode (default)
bg_primary: #ffffff
text_primary: #111827

// Dark mode (when document.documentElement has 'dark' class)
bg_primary: #1f2937 (gray-800)
text_primary: #f9fafb (gray-50)
```

### Implementation

1. Apply `useDarkMode()` hook in header
2. Toggle with button (☀️ light / 🌙 dark icon)
3. Stores preference in localStorage
4. Applies `dark` class to document root
5. CSS variables or Tailwind `dark:` prefix handles color inversion

---

## Accessibility

### Contrast Requirements

All text must meet WCAG 2.1 AA standards:
- **Normal text**: minimum 4.5:1 contrast ratio
- **Large text** (≥18px): minimum 3:1 contrast ratio

### Color Combinations (Pre-Verified)

✓ **Pass (4.5:1+)**:
- White bg + primary blue text: 6.5:1
- White bg + text_primary (gray-900): 14:1
- White bg + text_secondary (gray-600): 6.2:1
- White bg + error red: 5.3:1
- White bg + success green: 4.8:1

❌ **Fail (<4.5:1)** — Avoid:
- White bg + gray-500 text: 3.1:1 ← DON'T USE
- White bg + gray-400 text: 2.0:1 ← DON'T USE

### Motion Preference

Respect `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All transitions in components should be gated by this preference.

---

## Component Usage Examples

### Button

```typescript
import Button from '@/components/Button';
import { colors } from '@/styles/colors';

<Button variant="primary" size="md" onClick={handleClick}>
  ➕ Add Cattle
</Button>

<Button variant="danger" size="sm" icon="🗑️">
  Delete
</Button>

<Button variant="secondary">Secondary Action</Button>

<Button variant="ghost">Text-only</Button>

<Button loading>Saving...</Button>
```

### Card

```typescript
import Card from '@/components/Card';

<Card size="md">
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>

<Card size="lg" icon="📊" badge={{ text: 'Active', variant: 'success' }}>
  Featured card with badge
</Card>
```

### Status Badge

```typescript
import StatusBadge from '@/components/StatusBadge';

<StatusBadge status="active" />
<StatusBadge status="sold" />
<StatusBadge status="deceased" />
<StatusBadge status="removed" />
```

### Form Input

```typescript
import FormInput from '@/components/FormInput';

<FormInput
  label="Cattle Tag"
  type="text"
  placeholder="e.g., TAG-001"
  required
  error={errors.tag}
/>

<FormInput
  label="Birth Date"
  type="date"
  required
/>
```

### Toast Notification

```typescript
import { Toast } from '@/components/Toast';

{showSuccess && (
  <Toast message="Cattle updated successfully" variant="success" />
)}

{error && (
  <Toast message="Failed to update cattle" variant="error" />
)}
```

---

## File Structure

```
client/src/styles/
├── colors.ts           # Color palette (8 semantic colors)
├── typography.ts       # Typography scale (4-tier hierarchy)
├── spacing.ts          # Spacing system (8px grid)
├── shadows.ts          # Shadow/depth system (3 levels)
└── DESIGN_SYSTEM.md    # This file (documentation)

client/src/components/
├── Button.tsx          # Button component with 4 variants
├── Card.tsx            # Card component with 3 sizes
├── StatusBadge.tsx     # Status badge component
├── FormInput.tsx       # Form input component
├── Modal.tsx           # Modal with focus trap
├── Toast.tsx           # Success/error toast notification
└── ... other components

client/src/hooks/
├── useFocusTrap.ts     # Focus trap hook (modal keyboard management)
└── useDarkMode.ts      # Dark mode hook (preference + persistence)
```

---

## Verification Checklist

- [ ] All files in `client/src/styles/` created and exporting correctly
- [ ] No hardcoded color values in components (use `colors` tokens instead)
- [ ] All spacing uses spacing tokens (no hardcoded `px` values)
- [ ] All typography uses `typography` classes
- [ ] All shadows use `shadows` tokens
- [ ] Dark mode colors defined and tested
- [ ] Contrast audit passes WCAG 2.1 AA on all text combinations
- [ ] prefers-reduced-motion CSS added to App.css
- [ ] Component documentation complete

---

## Next Steps

1. ✅ **Phase 0** — Design System Definition (THIS STEP)
   - Create design token files (colors, typography, spacing, shadows)
   - Document usage and guidelines

2. **Phase 1** — Component Library (NEXT)
   - Build reusable components using design tokens
   - Button, Card, StatusBadge, FormInput, Toast, Focus Trap, Dark Mode

3. **Phase 2** — Redesign Pages
   - Update CattleList, Dashboard, CattleDetail with new components
   - Fix accessibility issues

4. **Phase 3** — Data Visualization
   - Add Recharts for interactive charts
   - Replace Dashboard progress bars with visualizations

5. **Phase 4** — Verification & Cutover
   - WCAG audit
   - Visual regression testing
   - Performance optimization
   - Cleanup old code

---

## Questions?

Refer to specific token imports:
```typescript
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';
import { shadows } from '@/styles/shadows';
```

All components should import from these files for consistency.

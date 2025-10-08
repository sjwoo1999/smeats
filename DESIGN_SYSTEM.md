# SMEats Design System v1.0

Complete implementation guide for the SMEats Design System built with Next.js 15 and Tailwind CSS v4.

## 📋 Implementation Checklist

### ✅ Core Setup
- [x] Install dependencies (`clsx`, `tailwind-merge`)
- [x] Configure CSS design tokens (light/dark themes)
- [x] Setup Tailwind CSS v4 with semantic colors
- [x] Configure Inter + Noto Sans KR fonts
- [x] Create utility helper functions

### ✅ Base Components
- [x] Button component (5 variants, 3 sizes, loading state)
- [x] Input component (label, error, helper text, accessibility)
- [x] Badge component (5 variants, 2 sizes)
- [x] Card component (3 variants, composable sub-components)
- [x] ProductCard component (with lowest price badge)

### ✅ Design Tokens
- [x] 8pt spacing system
- [x] Border radius scale (xs to xl)
- [x] Shadow tokens (sm, md, lg)
- [x] Color system (primary, secondary, semantic, neutral)
- [x] Typography scale
- [x] Focus ring styles

### ✅ Accessibility
- [x] WCAG AA compliance
- [x] Focus-visible rings (2px with 2px offset)
- [x] ARIA attributes on forms
- [x] Semantic HTML
- [x] 40×40px minimum hit areas
- [x] Keyboard navigation support

### ✅ Features
- [x] Light/Dark mode auto-switching
- [x] Loading states (skeleton loaders)
- [x] Error states with messaging
- [x] Responsive design
- [x] `prefers-reduced-motion` support

## 🎨 Design Tokens

### Color Palette

#### Brand Colors
```css
--primary: #F76241    /* Main brand color */
--secondary: #147D6F  /* Secondary accent */
--success: #1AAE5E    /* Success states */
--warning: #F5A524    /* Warning states */
--danger: #E5484D     /* Error/destructive actions */
--info: #3B82F6       /* Informational */
```

#### Neutral Scale
```css
--neutral-50 to --neutral-900  /* 9-step grayscale */
```

### Spacing (8pt Grid System)
```css
--spacing-1: 2px
--spacing-2: 4px
--spacing-3: 8px
--spacing-4: 12px
--spacing-5: 16px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
--spacing-16: 64px
```

### Border Radius
```css
--radius-xs: 6px
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
--radius-full: 9999px
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

## 🧩 Component Usage

### Button

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `isLoading`: boolean
- All native button HTML attributes

**Accessibility:**
- 40×40px minimum hit area
- Focus ring: 2px solid with 2px offset
- `aria-busy` when loading
- Disabled state properly communicated

### Input

```tsx
import { Input } from "@/components/ui/input";

// Basic
<Input
  label="Email"
  type="email"
  placeholder="example@smeats.com"
/>

// With helper text
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
  required
/>

// Error state
<Input
  label="Phone"
  error="Invalid phone number format"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `required`: boolean
- All native input HTML attributes

**Accessibility:**
- Auto-generated IDs with `useId`
- Proper label association
- `aria-invalid` on errors
- `aria-describedby` for helper/error text
- Error messages with `role="alert"`

### Badge

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>

<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

**Props:**
- `variant`: "default" | "success" | "warning" | "danger" | "info"
- `size`: "sm" | "md"

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: "default" | "elevated" | "bordered"

**Composable Sub-components:**
- `CardHeader` - Header section with padding
- `CardTitle` - H3 heading
- `CardDescription` - Secondary text
- `CardContent` - Main content area
- `CardFooter` - Footer section for actions

### ProductCard

```tsx
import { ProductCard } from "@/components/product-card";

<ProductCard
  product={{
    id: "1",
    name: "프리미엄 한우 등심",
    description: "최고급 한우 등심 1등급",
    price: 45000,
    imageUrl: "https://...",
    imageAlt: "한우 등심",
    isLowestPrice: true,
    badge: "신선",
  }}
/>

// Loading state
<ProductCard
  product={{ id: "2", name: "Loading...", price: 0 }}
  isLoading={true}
/>
```

**Props:**
- `product`: Product object with fields:
  - `id`: string (required)
  - `name`: string (required)
  - `price`: number (required)
  - `description`: string (optional)
  - `imageUrl`: string (optional)
  - `imageAlt`: string (optional)
  - `isLowestPrice`: boolean (optional)
  - `badge`: string (optional)
- `isLoading`: boolean

**Features:**
- Skeleton loading state
- Lowest price badge in primary color
- Responsive image with Next.js Image optimization
- Hover effects (shadow + image scale)
- Price formatted with `Intl.NumberFormat` (KRW)
- Tabular-nums for price alignment

## 🎯 Accessibility Features

### Focus Management
All interactive elements have visible focus rings:
```css
focus-visible:outline
focus-visible:outline-2
focus-visible:outline-offset-2
focus-visible:outline-ring
```

### Color Contrast
- All text meets WCAG AA standards
- Focus rings are 2px with 2px offset for visibility
- Error states use sufficient contrast

### Touch Targets
- Minimum 40×40px for buttons (sm: 40px, md: 44px, lg: 48px)
- Adequate spacing between interactive elements

### Screen Reader Support
- Semantic HTML elements
- ARIA attributes where appropriate
- Loading states announced with `aria-busy`
- Error messages with `role="alert"` and `aria-live="polite"`

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus order follows visual order
- No keyboard traps

### Motion
Respects `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🌙 Dark Mode

Dark mode is automatically enabled based on system preferences using `prefers-color-scheme: dark`.

### Token Switching
All color tokens automatically switch between light and dark values:

```css
:root {
  --bg: #FFFFFF;
  --text: #1A1A1A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0A0A0A;
    --text: #FAFAFA;
  }
}
```

### Best Practices
- Always use semantic tokens (e.g., `bg-bg`, `text-text`)
- Never hardcode hex values in components
- Test components in both light and dark modes

## 📐 Layout Primitives

### Container
```tsx
<div className="container mx-auto px-6 max-w-7xl">
  {/* Content */}
</div>
```

### Grid System
```tsx
// Responsive product grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <ProductCard />
  <ProductCard />
  <ProductCard />
</div>
```

### Spacing
Use the 8pt spacing system:
```tsx
<div className="space-y-6">  {/* 24px vertical spacing */}
  <section className="p-6"> {/* 24px padding */}
    {/* Content */}
  </section>
</div>
```

## 🔧 Utilities

### `cn()` Helper
Combines class names with proper Tailwind precedence:

```tsx
import { cn } from "@/lib/cn";

<div className={cn(
  "base-classes",
  conditional && "conditional-classes",
  className // Props override
)} />
```

## 📱 Responsive Design

### Breakpoints
Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
```tsx
<Button className="w-full sm:w-auto">
  Responsive Button
</Button>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🚀 Performance

### Next.js Image Optimization
ProductCard uses Next.js `<Image>` component:
- Automatic image optimization
- Lazy loading by default
- Responsive sizes
- WebP/AVIF format support

### CSS Optimization
- Tailwind CSS v4 with Lightning CSS
- Minimal runtime overhead
- Tree-shaking of unused styles

## 🔍 Testing Checklist

- [ ] Components render in light mode
- [ ] Components render in dark mode
- [ ] Focus rings visible on all interactive elements
- [ ] Keyboard navigation works
- [ ] Touch targets ≥40×40px
- [ ] Loading states display correctly
- [ ] Error states show proper messages
- [ ] Responsive at all breakpoints
- [ ] Images load and optimize
- [ ] Animations respect `prefers-reduced-motion`

## 📝 File Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens & Tailwind config
│   ├── layout.tsx           # Font setup
│   └── page.tsx             # Example components page
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   └── product-card.tsx     # Domain-specific component
└── lib/
    └── cn.ts                # Class name utility
```

## 🎓 Best Practices

1. **Always use design tokens** - Never hardcode colors or spacing
2. **Compose components** - Use `cn()` for conditional styling
3. **Accessibility first** - Include ARIA attributes and semantic HTML
4. **Mobile responsive** - Test on mobile viewports
5. **Loading states** - Always provide skeleton/loading UI
6. **Error handling** - Show clear error messages to users
7. **Type safety** - Use TypeScript interfaces for props
8. **Semantic versioning** - Document breaking changes

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessible Components](https://www.w3.org/WAI/ARIA/apg/)

---

**Design System Version:** 1.0
**Last Updated:** October 2025
**Maintainers:** SMEats Development Team

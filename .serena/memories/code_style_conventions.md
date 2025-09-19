# Code Style and Conventions

## TypeScript Configuration
- **Strict mode**: Enabled
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path alias**: `@/*` maps to `./src/*`
- **JSX**: Preserve mode for Next.js

## Component Conventions

### File Naming
- React components: PascalCase (e.g., `HeroSection.tsx`)
- Utilities/hooks: camelCase (e.g., `useTheme.ts`)
- Configuration: lowercase with extensions (e.g., `tailwind.config.ts`)

### Component Structure
```tsx
// Default function export pattern
export default function ComponentName() {
  return (
    <element>
      {/* Content */}
    </element>
  );
}
```

### Styling Approach
- **Tailwind CSS** for utility classes
- **CSS variables** for theming (HSL color format)
- **Class Variance Authority (CVA)** for component variants
- **cn() utility** (clsx + tailwind-merge) for conditional classes

### Import Organization
1. External packages
2. Internal components/utilities with `@/` alias
3. Relative imports
4. Type imports

### Radix UI Pattern
- Use Radix primitives for accessible components
- Apply styling through Tailwind classes
- Maintain composition pattern

## CSS/Styling Conventions

### Color System
- HSL-based CSS variables
- Semantic naming: `--background`, `--foreground`, `--primary`, etc.
- Dark mode via `class` strategy

### Spacing
- Use Tailwind spacing utilities
- Consistent padding/margin scales

### Responsive Design
- Mobile-first approach
- Tailwind breakpoint system

## Best Practices
- No console.logs in production code
- Avoid inline styles except for dynamic values
- Use semantic HTML elements
- Keep components focused and single-purpose
- Extract reusable logic to custom hooks
- Type all props and return values
- Avoid `any` type
- Use ESLint rules from Next.js config

## File Organization
- Group related components in directories
- Keep component files close to where they're used
- Shared components in `components/shared/`
- UI primitives in `components/ui/`
- Page-specific components in respective page directories
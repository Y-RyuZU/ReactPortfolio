# Task Completion Checklist

When completing any coding task in this project, ensure you:

## 1. Code Quality Checks
- [ ] Run linting to catch any issues:
  ```bash
  yarn lint
  ```
- [ ] Ensure TypeScript types are correct (checked during build):
  ```bash
  yarn build
  ```
- [ ] Fix any linting errors or warnings before considering task complete

## 2. Visual Verification
- [ ] Start dev server and verify changes work as expected:
  ```bash
  yarn dev
  ```
- [ ] Test in both light and dark modes
- [ ] Check responsive behavior (mobile, tablet, desktop)

## 3. Code Review
- [ ] Follow existing code patterns and conventions
- [ ] No console.log statements left in code
- [ ] Props and return types are properly typed
- [ ] Imports use `@/` alias where applicable
- [ ] Component follows single responsibility principle

## 4. Style Consistency
- [ ] Using Tailwind utilities instead of inline styles
- [ ] Following the HSL color variable system
- [ ] Maintaining consistent spacing
- [ ] CSS classes use cn() utility for conditional styling

## 5. Final Build Test
- [ ] Ensure production build completes successfully:
  ```bash
  yarn build
  ```
- [ ] No TypeScript errors
- [ ] No build warnings that need addressing

## 6. Git Readiness (if committing)
- [ ] All changes are intentional
- [ ] No temporary/debug code included
- [ ] Commit message clearly describes changes

## Important Notes
- Since no test suite exists, manual verification is crucial
- Always run `yarn lint` before considering work complete
- Build process will catch TypeScript errors
- Development server with Turbopack provides fast feedback
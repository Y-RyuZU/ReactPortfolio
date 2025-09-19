# Repository Guidelines

## Project Structure & Module Organization
Core Next.js source lives in `src/`. `src/app` holds the App Router entry (`layout.tsx`, `page.tsx`, global providers). Reusable UI and section blocks sit under `src/components` with feature-specific subfolders (navigation, skills, projects, sections). Shared configuration, React context, hooks, and utilities are grouped in `src/config`, `src/contexts`, `src/hooks`, and `src/lib`. Brand assets and Tailwind helpers remain in `src/assets`. Static files (favicons, OG images) live in `public/`. Container and Kubernetes manifests live in `infra/docker` and `infra/k8s` for deployment work.

## Build, Test, and Development Commands
Run `yarn dev` for the local Turbopack dev server at http://localhost:3000. Use `yarn build` to produce the production bundle and `yarn start` to serve that build. Execute `yarn lint` before pushing to ensure the ESLint config in `eslint.config.mjs` passes.

## Coding Style & Naming Conventions
Write TypeScript-first modules with React function components. Favor PascalCase for components and hooks, camelCase for variables, and kebab-case for file names unless React conventions require PascalCase. Keep imports path-alias aware using the `@/` prefix from `tsconfig.json`. Tailwind classes drive styling; colocate screen-size variants instead of custom CSS when possible. Follow the existing two-space indentation and terminate statements with semicolons to match the codebase.

## Testing Guidelines
No automated test runner is configured yet; rely on `yarn lint` and manual verification for new features. When adding tests, place them alongside components using the `.test.tsx` suffix and document any required frameworks in this guide.

## Commit & Pull Request Guidelines
Commits follow a Conventional Commit style (`feat:`, `fix:`, `refactor:`). Keep messages in the imperative mood and scoped to a single concern. For pull requests, provide a concise summary, link relevant issues, and include UI screenshots or GIFs for visual changes. List verification steps (e.g., `yarn lint`, manual flows exercised) so reviewers can reproduce them quickly.

## Infrastructure Notes
If your change touches deployment, update `infra/docker/Dockerfile` or Helm chart values with matching documentation. Verify image builds locally before proposing cluster changes.

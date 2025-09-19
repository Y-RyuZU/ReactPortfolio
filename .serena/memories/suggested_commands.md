# Suggested Commands for Development

## Development Server
```bash
# Start development server with Turbopack (fast refresh)
yarn dev
# or
npm run dev
```
Opens at http://localhost:3000

## Build & Production
```bash
# Create production build
yarn build

# Start production server
yarn start
```

## Code Quality
```bash
# Run ESLint for code linting
yarn lint
# or
npm run lint
```

## Package Management
This project uses Yarn as the package manager:
```bash
# Install dependencies
yarn install

# Add new dependency
yarn add <package-name>

# Add dev dependency
yarn add -D <package-name>
```

## TypeScript
```bash
# Type checking (no dedicated script, but TypeScript is checked during build)
yarn build
```

## Git Commands (Linux)
```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "message"

# Push to remote
git push origin main
```

## File Navigation (Linux)
```bash
# List files
ls -la

# Change directory
cd <directory>

# Create directory
mkdir <directory>

# Remove file/directory
rm -rf <path>
```

## Important Notes
- The project uses **Yarn** as the primary package manager
- Development runs with **Turbopack** for faster HMR
- No test runner is currently configured
- ESLint is configured with Next.js rules
- No prettier configuration found (formatting handled by ESLint)
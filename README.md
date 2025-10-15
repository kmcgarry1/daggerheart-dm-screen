# Daggerheart DM Screen

A Vue 3 + Vite experience for running a Daggerheart-inspired digital Dungeon Master screen.

The project has been reorganized to follow a modern, domain-driven layout with clear boundaries between
application bootstrapping, feature modules, and shared utilities. Components, composables, and supporting
logic now live alongside the features they power, making it easier to navigate and extend the codebase.

## Project structure

```
src/
├─ app/                 # Application shell (entry point, router, global styles)
├─ features/            # Self-contained feature areas (dm-screen, tracker, countdown, etc.)
├─ shared/              # Cross-cutting UI primitives, utilities, and composables
└─ __tests__/           # Unit tests
```

Each feature exports its public API through an `index.ts`, enabling concise imports such as
`import { DMScreenPage } from '@/features/dm-screen'`.

## Scripts

Install dependencies and run the available commands with npm:

```bash
npm install

# Development server
npm run dev

# Production build
npm run build

# Unit tests
npm run test:unit

# Linting
npm run lint
```

Playwright end-to-end tests are still available via `npm run test:e2e` after installing the browsers with
`npx playwright install`.

## Tooling

- **Framework:** Vue 3 + Vite
- **Type checking:** TypeScript + Volar in editors
- **State management:** Pinia (registered in `src/app/index.ts`)
- **Testing:** Vitest, Vue Test Utils
- **Linting:** ESLint with the default Vue recommended rules

This structure keeps the application scalable while staying consistent with contemporary Vue
architecture practices.

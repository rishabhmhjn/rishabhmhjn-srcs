# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an **Nx monorepo** containing personal projects, libraries, and dotfiles. The workspace is organized into three top-level areas:

- `libs/packages/` — Reusable/publishable npm libraries (e.g., `kaomoji`)
- `packages/` — Local tool/config distributions (e.g., `dotfiles`)
- `projects/` — Applications and sites (Angular app, Astro blog, Playwright E2E tests)

## Setup

Requires Node.js 24.0.0 (see `.nvmrc`). The dotfiles package uses git submodules:

```bash
git clone --recurse-submodules <repo-url>
npm install
```

## Commands

All tasks run through Nx. Prefer project-scoped commands over root-level ones.

```bash
# Build
npx nx build <project>           # e.g., nx build kaomoji

# Test
npx nx test <project>            # Run Jest tests for a project
npx nx test <project> --configuration=ci  # CI mode (coverage enabled)
npx nx e2e ng-test-e2e           # Playwright E2E tests

# Lint
npx nx lint <project>            # ESLint for a single project
npx nx lint                      # All projects

# Serve (development)
npx nx serve ng-test             # Angular dev server
npx nx serve rishabhmhjn.com     # Astro dev server

# Cache/dist cleanup
npm run clean                    # Clears Nx cache + dist
npm run clean:cache              # Only Nx and Angular caches
```

## Architecture

### Nx Project Graph and Module Boundaries

ESLint enforces module boundaries via `@nx/enforce-module-boundaries`. Cross-project imports must go through the public API (`src/index.ts`) and respect the defined dependency constraints. Import paths are aliased in `tsconfig.base.json` (e.g., `kaomoji` → `libs/packages/kaomoji/src/index.ts`).

### Library: `libs/packages/kaomoji`

A CLI + library package published to npm. Built with Rollup (CJS + ESM output) using SWC for compilation. Release is managed via `nx release` — tags must follow the pattern `kaomoji-v*.*.*` to trigger the npm publish CI workflow.

### Application: `projects/ng-test`

Angular 21 app with SSR (Express server). Has a companion E2E project at `projects/ng-test-e2e` using Playwright.

### Site: `projects/rishabhmhjn.com`

Astro 5 blog using Starlight + blog plugin. Deployed to GitHub Pages on push to `main` via GitHub Actions.

### Package: `packages/dotfiles`

Shell dotfiles distribution managed as an npm package with git submodules for zsh plugins (autosuggestions, syntax-highlighting, nx-completion).

## Toolchain

- **TypeScript** 5.9.3 — root `tsconfig.base.json` is the single source of path aliases
- **ESLint** 9.8.0 — flat config format (`eslint.config.mjs`), single quote enforced via Prettier (`.prettierrc`)
- **Jest** 30 with `jest-preset-angular` — config in `jest.config.ts` and `jest.preset.js`
- **Rollup** 4 with `.swcrc` for library compilation

## CI/CD

Two GitHub Actions workflows:
- **`kaomoji-publish.yml`**: Triggered by `kaomoji-v*.*.*` tags → builds and publishes to npm using `nx release publish` with provenance
- **`rishabhmhjn.com.yml`**: Triggered on push to `main` → builds Astro site and deploys to GitHub Pages

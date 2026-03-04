# Maintain a Collection of Apps

Monorepo demonstrating how to manage an Astro app that uses the ArcGIS Maps SDK for JavaScript alongside a shared utilities package. Managed with pnpm workspaces.

## Packages

- [app](app): Astro app preconfigured with ArcGIS map, chart, and Calcite components. Depends on the shared utils package.
- [packages/utils](packages/utils): Shared utilities published in-workspace as `@devtech/utils` with a starter `hello` helper.
- [pnpm-workspace.yaml](pnpm-workspace.yaml): Declares workspace packages and build restrictions.

## Prerequisites

- pnpm 10.28.2 (automatically used via packageManager fields)
- A modern Node.js version compatible with pnpm 10 and Astro 6

## Install

```sh
pnpm install
```

## Run the app

- From the repo root: `pnpm dev` (runs the Astro app via the root script).
- Alternatively from app only: `pnpm --filter js-maps-sdk-astro-template dev`.

App will be served at http://localhost:4321 by default.

## Build and preview

- Build everything: `pnpm build:all`
- Preview the app: `pnpm --filter js-maps-sdk-astro-template preview`

## Using the shared utils package

`@devtech/utils` exports a simple hello helper located at [packages/utils/src/index.ts](packages/utils/src/index.ts).

```ts
import { hello } from "@devtech/utils";

console.log(hello("from utils"));
```

The Astro app already consumes this helper as the fallback description text in [app/src/pages/index.astro](app/src/pages/index.astro).

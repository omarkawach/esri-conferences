# ArcGIS Maps SDK for JavaScript Astro TypeScript template

This template demonstrates how to use the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) in an Astro TypeScript application.

## Get started

This template uses the following packages:

- [`@arcgis/core`](https://www.npmjs.com/package/@arcgis/core)
- [`@arcgis/map-components`](https://www.npmjs.com/package/@arcgis/map-components)
- [`@arcgis/charts-components`](https://www.npmjs.com/package/@arcgis/charts-components)
- [`@esri/calcite-components`](https://www.npmjs.com/package/@esri/calcite-components)

## TypeScript

This template is configured to use TypeScript. If you prefer to use JavaScript, you can:

- Remove the `tsconfig.json` file
- Convert the inline `<script lang="ts">` in `src/pages/index.astro` to JavaScript
- Remove the `typescript` dependency from `package.json`

## Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                      |
| :--------------- | :------------------------------------------ |
| `pnpm install`   | Installs dependencies                       |
| `pnpm dev`       | Starts local dev server at `localhost:4321` |
| `pnpm build`     | Builds the site to `./dist/`                |
| `pnpm preview`   | Previews the production build               |
| `pnpm astro ...` | Runs Astro CLI commands                     |

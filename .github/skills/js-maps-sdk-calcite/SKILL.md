---
name: js-maps-sdk-calcite
description: "Develop applications with the ArcGIS Maps SDK for JavaScript, Calcite Design System, or Calcite components. Use when building or updating web mapping app shells, navigation, panels, toolbars, forms, dialogs, notices, theming, map overlays, or integrating @arcgis/core, @arcgis/map-components, @arcgis/charts-components, or @esri/calcite-components."
argument-hint: "Describe the ArcGIS or Calcite feature, component, layout, map behavior, or integration to build or update."
---

# ArcGIS Maps SDK for JavaScript and Calcite design system / components reference

## Overview

The ArcGIS Maps SDK for JavaScript is the foundation for building web mapping applications.
Calcite Design System is Esri's web component library for building consistent, accessible UI around maps. Map components (`<arcgis-map>`, `<arcgis-search>`, etc.) are built with Calcite internally, using Calcite for the rest of your app UI ensures visual consistency.

**Use Calcite when:** building app shells (panels, navigation, toolbars), custom tools alongside the map, forms, modals, or any UI that surrounds the map.

## Installation

```bash
npm install @esri/calcite-components @arcgis/core @arcgis/map-components
```

Use `@arcgis/core` for the ArcGIS Maps SDK modules and `@arcgis/map-components` for the framework-agnostic `<arcgis-*>` web components. Keep the package versions aligned across the 5.x SDK packages.

### CDN (standalone Calcite)

```html
<script
  type="module"
  src="https://js.arcgis.com/calcite-components/5.0"
></script>
```

### CDN (ArcGIS JavaScript SDK 5.0 bundle with Calcite and Map Components)

For a CDN application, the ArcGIS Maps SDK for JavaScript 5.0 bundle includes Calcite, Map Components, other component packages, and the Core API:

```html
<script type="module" src="https://js.arcgis.com/5.0"></script>
```

For a bundler-based application, import only the components and API modules that the app uses:

```ts
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";

import Map from "@arcgis/core/Map.js";
```

Don't worry about stylesheets, they're included automatically with the component imports.

---

## App Layout Pattern

Calcite provides layout primitives for building full-page map applications:

```html
<calcite-shell>
  <!-- Header -->
  <calcite-navigation slot="header">
    <calcite-navigation-logo
      slot="logo"
      heading="My Map App"
    ></calcite-navigation-logo>
  </calcite-navigation>

  <!-- Left panel -->
  <calcite-shell-panel slot="panel-start" display-mode="float">
    <calcite-panel heading="Layers">
      <arcgis-layer-list></arcgis-layer-list>
    </calcite-panel>
  </calcite-shell-panel>

  <!-- Map fills remaining space -->
  <arcgis-map item-id="your-webmap-id">
    <arcgis-zoom slot="top-left"></arcgis-zoom>
    <arcgis-search slot="top-right"></arcgis-search>
  </arcgis-map>

  <!-- Right panel -->
  <calcite-shell-panel slot="panel-end" display-mode="float">
    <calcite-panel heading="Details">
      <div id="feature-details"></div>
    </calcite-panel>
  </calcite-shell-panel>
</calcite-shell>
```

### Key Layout Components

| Component                 | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `calcite-shell`           | Full-page app container with header, panels, and content area |
| `calcite-shell-panel`     | Collapsible side panel (slot: `panel-start` or `panel-end`)   |
| `calcite-panel`           | Content container with heading, actions, and scrollable body  |
| `calcite-navigation`      | Top navigation bar (slot: `header`)                           |
| `calcite-navigation-logo` | App logo/title in navigation                                  |
| `calcite-flow`            | Stack-based navigation (push/pop panels)                      |
| `calcite-block`           | Collapsible content section within a panel                    |

---

## Slots (Positioning Components in the Map)

Map components use named slots for positioning:

```html
<arcgis-map>
  <!-- Named position slots -->
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-search slot="top-right"></arcgis-search>
  <arcgis-legend slot="bottom-left"></arcgis-legend>

  <!-- Custom content in a slot -->
  <div slot="top-right">
    <calcite-button icon-start="filter">Filter</calcite-button>
  </div>

  <!-- Popup slot (special, only for arcgis-popup) -->
  <arcgis-popup slot="popup"></arcgis-popup>
</arcgis-map>
```

Available slots: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `top-start`, `top-end`, `bottom-start`, `bottom-end`, `popup`.

Multiple components in the same slot stack automatically (vertical for top slots, horizontal for bottom slots).

---

## Theming (Light/Dark Mode)

```html
<!-- Light mode (default) -->
<body class="calcite-mode-light">
  <!-- Dark mode -->
  <body class="calcite-mode-dark">
    <!-- Auto (follows OS preference) -->
    <body class="calcite-mode-auto"></body>
  </body>
</body>
```

Toggle dynamically:

```javascript
document.body.classList.toggle("calcite-mode-dark");
```

The mode class cascades to all child Calcite and Map components.

---

## Custom Theming with CSS Variables

Calcite uses CSS custom properties (design tokens) for all visual styling. Override them to match your brand:

```css
/* Global brand color override */
:root {
  --calcite-color-brand: #8f4a89;
  --calcite-color-brand-hover: #823b7c;
  --calcite-color-brand-press: #7d3b77;
}

/* Dark mode variant */
body.calcite-mode-dark {
  --calcite-color-brand: #d6b9eb;
  --calcite-color-brand-hover: #c59cd6;
  --calcite-color-brand-press: #b399c4;
}
```

### Common Token Categories

| Category      | Example Variables                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Brand colors  | `--calcite-color-brand`, `--calcite-color-brand-hover`, `--calcite-color-brand-press`                      |
| Text colors   | `--calcite-color-text-1` (primary), `--calcite-color-text-2` (secondary), `--calcite-color-text-3` (muted) |
| Background    | `--calcite-color-background`, `--calcite-color-foreground-1`, `--calcite-color-foreground-2`               |
| Border        | `--calcite-color-border-1`, `--calcite-color-border-2`                                                     |
| Font          | `--calcite-font-size-0`, `--calcite-font-weight-normal`, `--calcite-font-family`                           |
| Spacing       | `--calcite-spacing-sm`, `--calcite-spacing-md`, `--calcite-spacing-lg`                                     |
| Corner radius | `--calcite-corner-radius`, `--calcite-corner-radius-sharp`, `--calcite-corner-radius-round`                |

### Scoped Overrides

Apply to a specific component without affecting others:

```css
#my-panel {
  --calcite-color-brand: #ff6600;
}
```

---

## Common UI Components

### Buttons and Actions

```html
<calcite-button appearance="solid" kind="brand" icon-start="plus"
  >Add Feature</calcite-button
>
<calcite-button appearance="outline" kind="neutral">Cancel</calcite-button>
<calcite-button appearance="transparent" kind="danger" icon-start="trash"
  >Delete</calcite-button
>

<!-- Icon-only action -->
<calcite-action icon="layer-list" text="Layers"></calcite-action>
```

### Action Bar (Toolbar)

```html
<calcite-shell-panel slot="panel-start">
  <calcite-action-bar slot="action-bar">
    <calcite-action icon="layers" text="Layers" active></calcite-action>
    <calcite-action icon="legend" text="Legend"></calcite-action>
    <calcite-action icon="bookmark" text="Bookmarks"></calcite-action>
    <calcite-action
      icon="information"
      text="Info"
      slot="bottom-actions"
    ></calcite-action>
  </calcite-action-bar>

  <calcite-panel heading="Layers" id="layers-panel">
    <arcgis-layer-list></arcgis-layer-list>
  </calcite-panel>
</calcite-shell-panel>
```

### Modal / Dialog

```html
<calcite-dialog id="settings-dialog" heading="Settings" modal>
  <calcite-label>
    Basemap
    <calcite-select>
      <calcite-option value="streets-vector">Streets</calcite-option>
      <calcite-option value="satellite">Satellite</calcite-option>
      <calcite-option value="topo-vector">Topographic</calcite-option>
    </calcite-select>
  </calcite-label>
  <calcite-button slot="footer-end" appearance="solid">Save</calcite-button>
  <calcite-button slot="footer-end" appearance="outline" kind="neutral"
    >Cancel</calcite-button
  >
</calcite-dialog>

<script>
  document.getElementById("settings-dialog").open = true;
</script>
```

### Notices and Alerts

```html
<!-- Inline notice -->
<calcite-notice open icon="exclamation-mark-triangle" kind="warning">
  <span slot="title">Layer not visible</span>
  <span slot="message">Zoom in to see features at this scale.</span>
</calcite-notice>

<!-- Toast alert -->
<calcite-alert
  open
  auto-close
  auto-close-duration="medium"
  kind="success"
  icon="check-circle"
>
  <span slot="title">Feature saved</span>
  <span slot="message">The edit was applied successfully.</span>
</calcite-alert>
```

### Forms and Inputs

```html
<calcite-label>
  Search radius (km)
  <calcite-input
    type="number"
    value="5"
    min="1"
    max="100"
    step="1"
  ></calcite-input>
</calcite-label>

<calcite-label>
  Category
  <calcite-combobox placeholder="Select categories" selection-mode="multiple">
    <calcite-combobox-item
      value="parks"
      text-label="Parks"
    ></calcite-combobox-item>
    <calcite-combobox-item
      value="schools"
      text-label="Schools"
    ></calcite-combobox-item>
    <calcite-combobox-item
      value="hospitals"
      text-label="Hospitals"
    ></calcite-combobox-item>
  </calcite-combobox>
</calcite-label>

<calcite-label layout="inline">
  <calcite-switch checked></calcite-switch>
  Show labels
</calcite-label>
```

---

## Map Padding with Overlay Panels

When panels overlay the map, use CSS variables to prevent slotted components from being hidden:

```css
arcgis-map {
  --arcgis-layout-overlay-space-left: 320px; /* width of left panel */
}
```

Combine with the view's `padding` property so map center/extent calculations account for the panel:

```javascript
mapEl.addEventListener("arcgisViewReadyChange", () => {
  mapEl.view.padding = { left: 320 };
});
```

---

## Calcite with Frameworks

### React

```tsx
import "@esri/calcite-components/main.css";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-search";

function App() {
  return (
    <calcite-shell>
      <calcite-navigation slot="header">
        <calcite-navigation-logo slot="logo" heading="My App" />
      </calcite-navigation>
      <arcgis-map basemap="streets-vector" center="-118.25,34.05" zoom={12}>
        <arcgis-search slot="top-right" />
      </arcgis-map>
    </calcite-shell>
  );
}
```

---

## Icons

Calcite includes 1000+ icons. Use them via the `icon` attribute on components:

```html
<calcite-button icon-start="map-pin">Locate</calcite-button>
<calcite-action icon="layers" text="Layers"></calcite-action>
<calcite-notice icon="information">...</calcite-notice>
```

Browse icons: https://developers.arcgis.com/calcite-design-system/icons/

---

## Best Practices

- Use `calcite-shell` as the outermost container for full-page map apps
- Use `calcite-shell-panel` with `display-mode="float"` for panels that overlay the map (vs `dock` for panels that push the map)
- Always set `text` on `calcite-action` for accessibility (screen readers)
- Use Calcite form components (`calcite-input`, `calcite-select`, `calcite-combobox`) instead of native HTML inputs for visual consistency
- Apply `calcite-mode-dark` or `calcite-mode-light` at the `<body>` level so all components inherit
- Use CSS variable overrides for branding — don't override Calcite component internals with custom CSS selectors
- Prefer `calcite-alert` for transient notifications, `calcite-notice` for persistent inline messages

## Key Documentation

- Component Reference: https://developers.arcgis.com/calcite-design-system/components/
- Icons: https://developers.arcgis.com/calcite-design-system/icons/
- Design Tokens: https://developers.arcgis.com/calcite-design-system/foundations/tokens/reference/
- Tutorials: https://developers.arcgis.com/calcite-design-system/tutorials/
- Building Your UI (Maps SDK): https://developers.arcgis.com/javascript/latest/building-your-ui/

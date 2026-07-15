## Skill activation

- Do not optimize for speed by eagerly proceeding on inferred local code context alone when a matching skill exists but has not been loaded.
- If a matching skill exists, load and read that skill file first along with any reference documentation, then continue.

## Design Principles

- You must use the Calcite design system and components. Always check the component library for existing components before creating new ones. This also means you should consider combining existing components to create new ones before creating a new component from scratch.
- For UI customization, prefer using the Calcite design system's theming and styling capabilities which include CSS variables, utility classes, and component props. Avoid creating custom CSS or styles that override the default design system styles unless absolutely necessary.

## Implementation Defaults

- Prefer source-of-truth types exported by the owning package or a third-party library, such as `@arcgis/core`. Do not create custom local types when an appropriate type already exists, or use unsafe casts to force incompatible APIs together.
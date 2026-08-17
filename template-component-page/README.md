# Component Page Template

Use this template folder to duplicate component page code into other projects or to create new component pages in this codebase.

## Included Files

- `page.tsx`: Route page setting up SEO metadata, JsonLd, and rendering `demo.tsx`.
- `demo.tsx`: Client-side preview wrapper component.
- `sample-component.tsx`: Reusable UI component following shadcn structure, `cn()` merging, `data-slot="root"`, and `motion-reduce` support.
- `components-entry.ts`: Metadata snippet for `lib/components.ts`.
- `registry-entry.json`: Registry JSON schema for shadcn distribution.

## How to Duplicate in Next.js (App Router)

1. Copy this entire folder into your project under `app/components/(docs)/<your-component-name>`.
2. Move `sample-component.tsx` to `components/ui/<your-component-name>.tsx` and update component logic.
3. Update `HREF` in `page.tsx` to match your target route path.
4. Add the component entry metadata from `components-entry.ts` into `lib/components.ts`.
5. Add the component to `registry.json` using `registry-entry.json`, then run `npm run registry:build`.

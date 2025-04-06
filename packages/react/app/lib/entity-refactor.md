# Entity Logic Refactoring Plan (Revised) (`packages/react/app/lib/`)

## Goal
Refactor the entity-related logic currently residing in `entityConfig.ts` and `entityRetrieval.ts` into a more modular structure by creating a dedicated file for each entity type within `packages/react/app/lib/entities/`. This plan also incorporates the necessary data layer changes to support the new `areas` and `sites` structure (replacing `locations`) and standardizes on `name` as the primary identifier.

## Current Structure Issues
- `entityConfig.ts` and `entityRetrieval.ts` are monolithic, containing logic for all entities.
- Shared utilities (`addSlugs`, `unifyRelations`) are mixed with core entity logic.
- Logic needs updating for the `regions` -> `areas` -> `sites` hierarchy.
- Identifier field (`name` vs `title`) needs standardization.
- Opportunity to optimize list queries (`getAll*`) for performance.
- Opportunity to standardize error handling for retrieval functions.

## Proposed Directory Structure (Revised)

```
packages/react/app/lib/
├── db.ts               # Existing DB setup
├── utils/              # For shared utilities
│   ├── addSlugs.ts     # Moved & Updated (to only use 'name')
│   ├── unify.ts        # Moved
│   └── index.ts        # Optional: Re-exports utilities
├── entities/           # Root for entity-specific logic
│   ├── index.ts        # Re-exports all entity functions/types
│   ├── npcs.ts         # Combined NPC config, retrieval, type
│   ├── factions.ts     # Combined Faction config, retrieval, type
│   ├── regions.ts      # Combined Region config, retrieval, type
│   ├── areas.ts        # Combined Area config, retrieval, type
│   ├── sites.ts        # Combined Site config, retrieval, type
│   ├── quests.ts       # Combined Quest config, retrieval, type (+ stages logic)
│   ├── conflicts.ts    # Combined Conflict config, retrieval, type
│   ├── foreshadowing.ts# Combined Foreshadowing config, retrieval, type
│   ├── narrative.ts    # Combined Narrative Arc config, retrieval, type
│   ├── world.ts        # Combined World Change config, retrieval, type
│   └── retrievalUtils.ts # Shared retrieval helpers (getEntityNamesAndIds - updated)
├── entity-refactor.md  # This plan file
└── ... (other lib files)
```

## Refactoring Steps (Revised)

1.  **Create Directories & Move Utilities:**
    *   [x] Ensure `packages/react/app/lib/utils/` and `packages/react/app/lib/entities/` exist.
    *   [x] Move `addSlugs.ts` and `unify.ts` into `packages/react/app/lib/utils/`.
    *   [x] **Update `addSlugs.ts`:** Modify the `Sluggable` type definition and the `isSluggable` type guard to *only* check for `id` and `name` (remove checks for `title`).
    *   [ ] Update internal imports within utility files if necessary. (Skipped - no internal imports needed update)

2.  **Consolidate Entity Logic:**
    *   [x] For each entity (e.g., `npcs`, `factions`, `regions`, `areas`, `sites`, `quests`, `conflicts`, `foreshadowing`, `narrative`, `world`):
        *   Create `packages/react/app/lib/entities/[entityName].ts`.
        *   **Define Config:** Define and export an internal configuration object (e.g., `const npcConfig = { ... }`) within the file, extracting logic from the original `entityConfig.ts`.
            *   Add necessary imports (`db`, shared types).
            *   [x] Add necessary imports (`db`, shared types).
            *   [x] **Optimize `getAll`:** Review the `getAll` query definition (`with` clause). Ensure it only fetches data essential for list views (e.g., id, name, type).
            *   [x] **Standardize Identifier:** Ensure `getNamesAndIds` only selects `id` and `name`. Ensure `worldStateChanges` config uses `name` instead of `title`.
            *   [x] **Update Relations:** Ensure `regions` config fetches `areas`. Add `areas` and `sites` configs. Remove `locations` config logic entirely.
        *   **Define Retrieval:** Define and export `getAll*` and `get*` functions (e.g., `export const getAllNpcs = ...`, `export const getNpc = ...`) within the same file, extracting logic from the original `entityRetrieval.ts`.
            *   [x] Update functions to use the local config (e.g., `npcConfig`), utilities from `~/lib/utils`, and helpers from `../retrievalUtils`.
            *   [ ] **Error Handling:** Standardize error handling for `get*(slug)` functions (e.g., use custom `EntityNotFoundError` or structured return). (TODO)
        *   **Define Type:** Define and export the entity type (e.g., `export type NPC = ...`) within the same file, deriving it from the local `get*` function (e.g., `Awaited<ReturnType<typeof getNpc>>`). Create new types for `Area` and `Site`. Remove the `Location` type. (Done within entity files)
        *   [x] **Quest Stages:** Move the logic from `packages/react/app/lib/questStages.ts` into `packages/react/app/lib/entities/quests.ts`.

3.  **Update Shared Utilities (`retrievalUtils.ts`):**
    *   [x] Move the `categories`, `categorySchema`, `hasNonNullIdentifier`, and `getEntityNamesAndIds` logic from `entityConfig.ts` into `packages/react/app/lib/entities/retrievalUtils.ts`.
    *   [x] **Update `categories`:** Remove `'locations'`, add `'areas'`, add `'sites'`. (Used schema names instead)
    *   [x] **Update `hasNonNullIdentifier`:** Modify the function to only check for `id` and `name`.
    *   [x] **Update `getEntityNamesAndIds`:**
            *   [x] Import the individual entity configs (now defined within `../[entityName].ts`).
            *   [x] Update the `configMap` to reference these imports.
            *   [x] Ensure the logic correctly calls `getNamesAndIds` from the appropriate config based on the map.
            *   [x] Ensure the final return type only includes `{ id: number; name: string }`.

4.  **Create Index File:**
    *   [x] Create `packages/react/app/lib/entities/index.ts`.
    *   [x] Add exports for all functions and types from the entity files (e.g., `export * from './npcs'; export * from './factions'; ...`).
    *   [x] Also export necessary functions/types from `retrievalUtils.ts`.

5.  **Update Application Imports:**
    *   [ ] Search the entire `packages/react/app/` directory (especially `routes/`) for imports from the old `lib/` files (`entities`, `entityConfig`, `entityRetrieval`, `questStages`, `addSlugs`, `unify`). (TODO - After cleanup)
    *   [ ] Update these imports to point to the new locations (`~/lib/entities` for entity logic/types via the index, `~/lib/utils` for utilities). (TODO - After cleanup)

6.  **Cleanup:**
    *   [x] Delete the original files:
        *   `packages/react/app/lib/entities.ts`
        *   `packages/react/app/lib/entityConfig.ts`
        *   `packages/react/app/lib/entityRetrieval.ts`
        *   `packages/react/app/lib/questStages.ts`
        *   `packages/react/app/lib/addSlugs.ts` (Moved)
        *   `packages/react/app/lib/unify.ts` (Moved)
    *   [x] Double-check that all references to `locations` and `title` (as primary identifiers) have been removed or replaced correctly.

7.  **Testing:**
    *   [ ] Run type checking (`tsc` or via editor).
    *   [ ] Start the development server and thoroughly test all pages that fetch and display entity data.
    *   [ ] Verify data loading, slug generation (now only using `name`), relation unification, and links work correctly.
    *   [ ] Check browser console for errors.
    *   [ ] Verify optimized `getAll*` queries return only necessary data.
    *   [ ] Verify standardized error handling works.

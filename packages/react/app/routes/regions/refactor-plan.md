# Regions Module Refactoring Plan

## Current Issues
- The `components.tsx` file is too large and contains multiple components that should be separated
- Duplicated helper functions like `getDangerVariant` (in both components.tsx and $slug.tsx)
- Using a mix of Card, SimpleCard, and InfoCard components
- List component has a position prop that should be removed

## Refactor Plan:

1. Componentize the dashboard, breaking into smaller, reusable components
2. Standardize component usage (use InfoCard instead of Card/SimpleCard)
3. Create a consistent grid layout

## Component Structure:

1. Create individual files for each component:
- [x] RegionHeader.tsx
- [x] OverviewContent.tsx
- [x] DetailsContent.tsx
- [x] LocationsContent.tsx
- [x] LoreContent.tsx
- [x] ConnectionsContent.tsx

## Component Migration:

1. Move these components to their own files:
- [x] RegionHeader -> RegionHeader.tsx
- [x] OverviewCard, RegionTypeCard, KeyStatsCard -> OverviewContent.tsx
- [x] ListCards (Hazards, POIs, Security, Rumors) -> DetailsContent.tsx
- [x] LocationsCard, EconomyCard, CreativePrompts -> LocationsContent.tsx
- [x] Secrets, History -> LoreContent.tsx
- [x] FactionsCard, Relations -> ConnectionsContent.tsx

## Component State:

- [x] Replace Card with InfoCard where appropriate
- [x] Replace all `SimpleCard` instances with `InfoCard` in new components
- [x] Add SimpleCard component that uses InfoCard under the hood for backward compatibility
- [ ] Ensure all components use proper interfaces for props
- [x] Update to use BadgeWithTooltip and other components as needed

## Cleanup:

- [x] Update $slug.tsx to use the new component imports
- [x] Delete the old components.tsx file as all components have been migrated

## Testing:

- [ ] Verify all components render properly
- [ ] Check for console errors
- [ ] Verify all functionality works as expected
- [ ] Test responsive layout on mobile and desktop

## Requirements:

1. Regions page loads with the same functionality
2. Components are properly typed
3. Consistent styling across all components

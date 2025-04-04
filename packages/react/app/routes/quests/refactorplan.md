# Quest Components Refactoring Plan

## Goals

1. Create a modular component structure
2. Separate utility functions
3. Use shared UI components consistently
4. Improve documentation
5. Make components more reusable

## Implementation Steps

1. ✅ Replace Card components with InfoCard throughout the application
2. ✅ Create tab content components:
   - ✅ OverviewContent
   - ✅ StagesContent
   - ✅ ThemesContent
   - ✅ ConnectionsContent
   - ✅ TwistsContent
3. ✅ Extract QuestHeader component
4. ✅ Update $slug.tsx to use new components
5. ❌ Move helper functions to utils.tsx
6. ❌ Create component README.md with usage examples
7. ❌ Clean up unused code

## Component Structure

```
quests/
  ├── components/
  │   ├── OverviewContent.tsx   # Tab content for Overview tab
  │   ├── StagesContent.tsx     # Tab content for Stages tab
  │   ├── ThemesContent.tsx     # Tab content for Themes tab
  │   ├── ConnectionsContent.tsx # Tab content for Connections tab
  │   ├── TwistsContent.tsx     # Tab content for Twists tab
  │   └── QuestHeader.tsx       # Quest header component
  ├── components.tsx            # Shared components for quest-related features
  ├── index.tsx                 # Quests listing page
  └── $slug.tsx                 # Quest detail page
```

## UI Components Used

- InfoCard - Replaces Card, CardContent, CardDescription, CardFooter, CardHeader, and CardTitle
- List - Used for displaying arrays of strings
- BadgeWithTooltip - Used for displaying types, statuses with tooltips
- Tabs - Used for organizing content into tabs

## Outstanding Tasks

1. Move helper functions (getTypeVariant, getUrgencyVariant, getVisibilityVariant) to utils.tsx
2. Create README.md with usage examples
3. Clean up any unused code or imports
4. Fix any remaining linter errors

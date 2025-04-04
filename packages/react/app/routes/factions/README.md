# Faction Module Component Structure

This module handles the display and interaction with faction entities in the D&D Campaign Manager.

## Component Organization

### Main Components

- `$slug.tsx` - The main faction detail page with tabs
- `index.tsx` - The factions listing page

### Shared Components

- `FactionCard.tsx` - Base card component with versatile display options, used throughout the faction UI
- `FactionHeader.tsx` - Header component for faction detail pages

### Tab Content Components

Each tab shown on the faction detail page has its own dedicated component:

- `OverviewContent.tsx` - Shows faction stats, goals, headquarters, and notes
- `DetailsContent.tsx` - Displays faction history, description, values, resources, and recruitment
- `CultureContent.tsx` - Presents faction cultural information like symbols, rituals, taboos, etc.
- `OperationsContent.tsx` - Shows faction operations and missions
- `InfluenceContent.tsx` - Displays the faction's sphere of influence and regional presence
- `QuestsContent.tsx` - Lists quests associated with the faction
- `MembersContent.tsx` - Shows NPCs that are members of the faction

#### Component Colocating Strategy
Each tab content component file contains:
- The main exported component (e.g., `QuestsContent`)
- Any tab-specific card components as internal components (e.g., `RelatedQuestsCard` inside `QuestsContent.tsx`)

## Helper Functions

Reusable helper functions like `getAlignmentVariant`, `getWealthVariant`, etc. are stored in `components.tsx` as they are used across multiple components.

## Design Principles

1. **Consistent tab structure** - Each tab has its own content component file
2. **Colocated related components** - Components only used in one tab are defined in that tab's file
3. **Reuse over repetition** - Using a versatile `FactionCard` component to avoid duplicated UI code
4. **Dedicated files for truly shared components** - Only components used across multiple files have their own file
5. **Modular tabs** - Each tab's content is encapsulated in its own component for maintainability
6. **Consistent UI patterns** - Using shared `FactionCard` component for visual consistency

## Routing Structure

- `/factions` - Main factions listing page (index.tsx)
- `/factions/:slug` - Faction details page ($slug.tsx)
- `/factions/:slug/:tab` - Specific tab within faction details 
# Quest Module

The quest module provides a comprehensive interface for viewing and managing quests in the DND campaign assistant. Quests are structured into a modular component system that separates concerns and improves reusability.

## Directory Structure

```
quests/
  ├── components/              # Modular, reusable components
  │   ├── OverviewContent.tsx  # Tab content for Overview tab
  │   ├── StagesContent.tsx    # Tab content for Stages tab
  │   ├── ThemesContent.tsx    # Tab content for Themes tab
  │   ├── ConnectionsContent.tsx # Tab content for Connections tab
  │   ├── TwistsContent.tsx    # Tab content for Twists tab
  │   └── QuestHeader.tsx      # Quest header component
  ├── +types/                  # TypeScript type definitions
  ├── components.tsx           # Shared components for quest-related features
  ├── index.tsx                # Quests listing page
  ├── $slug.tsx                # Quest detail page
  ├── utils.tsx                # Utility functions
  └── README.md                # This documentation file
```

## Key Components

### Page Components

- `index.tsx` - Displays a searchable list of all quests 
- `$slug.tsx` - Displays detailed information about a specific quest with tabbed interface

### Tab Content Components

Each tab content component takes a complete `quest` object and renders a specific section:

- `OverviewContent` - Displays quest description, objectives, rewards, and outcomes
- `StagesContent` - Displays quest stages with tree viewer and detailed stage information
- `ThemesContent` - Displays themes, inspirations, and creative prompts
- `ConnectionsContent` - Displays related NPCs, factions, and connected quests
- `TwistsContent` - Displays plot twists and their details

### Utility Components

- `QuestHeader` - Renders the quest title, type badges, and related information
- `InfoCard` - Unified card component used throughout the module

## Usage Examples

### Displaying a Quest Overview

```tsx
import { OverviewContent } from "./components/OverviewContent"

// Inside your component
return <OverviewContent quest={quest} />
```

### Displaying Quest Stages

```tsx
import { StagesContent } from "./components/StagesContent"

// Inside your component with state management
const [selectedStageId, setSelectedStageId] = useState<number | null>(null)

return (
  <StagesContent 
    quest={quest}
    stages={stages}
    selectedStageId={selectedStageId}
    onStageSelect={setSelectedStageId}
  />
)
```

### Using the QuestHeader Component

```tsx
import { QuestHeader } from "./components"

// Inside your component
return (
  <QuestHeader
    name={quest.name}
    type={quest.type}
    urgency={quest.urgency}
    visibility={quest.visibility}
    mood={quest.mood}
    factions={quest.factions}
    region={quest.region}
  />
)
```

## UI Component Guidelines

- Use `InfoCard` instead of the shadcn/ui Card components for consistent styling
- Use `List` component for rendering arrays of strings with optional icons and styling
- Use `BadgeWithTooltip` for status indicators that need additional explanation 
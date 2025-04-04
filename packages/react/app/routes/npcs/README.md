# NPC Module

This module contains components and utilities for displaying Non-Player Character (NPC) information throughout the application.

## Directory Structure

```
routes/npcs/
├── components/            # Modular components for NPC display
│   ├── NPCHeader.tsx      # Header component with NPC name and badges
│   ├── OverviewContent.tsx # Overview tab content
│   ├── PersonalityContent.tsx # Personality tab content
│   ├── SocialContent.tsx  # Social tab content
│   ├── KnowledgeContent.tsx # Knowledge tab content
│   └── ConnectionsContent.tsx # Connections tab content
├── utils.tsx              # Helper functions for NPC display (badge variants, etc.)
├── $slug.tsx              # Detail page for individual NPCs
└── index.tsx              # List page for all NPCs
```

## Component Overview

### InfoCard Usage

All content components use the shared `InfoCard` component from the UI library to display NPC information in a consistent way:

```jsx
<InfoCard
  title="Personality Traits"
  icon={<Icons.UserCircle className="h-4 w-4 mr-2 text-indigo-600" />}
  emptyMessage="No personality traits specified."
>
  {personalityTraits && personalityTraits.length > 0 && (
    <List items={personalityTraits} spacing="sm" textColor="muted" />
  )}
</InfoCard>
```

### NPCHeader

Displays the NPC's name and essential information badges (race, alignment, trustworthiness, etc.).

```jsx
<NPCHeader npc={npc} />
```

### Content Components

The content components are modular pieces that render different tabs on the NPC detail page:

- **OverviewContent**: Displays basic information, background, and appearance
- **PersonalityContent**: Shows personality traits, biases, drives, and fears
- **SocialContent**: Presents dialogue examples, rumors, and conversation topics
- **KnowledgeContent**: Displays information and secrets the NPC possesses
- **ConnectionsContent**: Shows relationships with other NPCs, factions, locations, and quests

Each content component follows the same pattern:

```jsx
<TabsContent value="personality">
  <PersonalityContent npc={npc} />
</TabsContent>
```

## Utility Functions

Helper functions in `utils.tsx` provide consistent styling for badges based on NPC attributes:

- `getTrustLevelVariant`: Badge variant based on trustworthiness
- `getWealthVariant`: Badge variant based on economic status
- `getAlignmentVariant`: Badge variant based on moral alignment
- `getAdaptabilityVariant`: Badge variant based on flexibility
- `getRelationshipStrengthVariant`: Badge variant based on relationship strength
- `getRelationshipTypeVariant`: Badge variant based on relationship type (ally, enemy, etc.)

## Usage Example

In a detail page:

```jsx
import { NPCHeader } from "./components/NPCHeader"
import { OverviewContent } from "./components/OverviewContent"
import { PersonalityContent } from "./components/PersonalityContent"
// ...other imports

export default function NpcDetailPage({ loaderData }: Route.ComponentProps) {
  const npc = loaderData
  const { tab } = useParams()
  const activeTab = tab || "overview"
  
  return (
    <div className="container mx-auto py-6">
      <NPCHeader npc={npc} />
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          {/* ...other tabs */}
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewContent npc={npc} />
        </TabsContent>
        
        <TabsContent value="personality">
          <PersonalityContent npc={npc} />
        </TabsContent>
        
        {/* ...other tab content */}
      </Tabs>
    </div>
  )
}
``` 
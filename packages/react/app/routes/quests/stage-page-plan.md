Quest Stage Enhancement Plan
Route and Navigation Structure
[x] Update routes.ts to support stage-specific route parameters
[x] Modify the quest detail page to read stage ID from URL params
[x] Create a new StageTabsContainer component to host the stage tabs
Stage Tab Organization
[x] Determine appropriate tab categories (e.g., Overview, Decision Points, Encounters, Elements)
[x] Create a new StageTabsContent component with TabsList and TabsContent
[x] Move content from StagesContent into appropriate tab sections
Component Structure
[x] Keep StageTreeViewer at the top for navigation between stages
[x] Add "Stage Header" with name and dramatic question below tree
[x] Insert new tabs section after stage header
[x] Organize content cards by tab category
URL and State Management
[x] Update URL when changing stages or tabs (e.g., /quests/slug/stages/stageId/tab)
[x] Read tab value from URL params for initial state
[x] Handle tab change by updating URL
UI Improvements
[x] Apply consistent styling with location pages
[x] Add navigation breadcrumbs for quest > stage > tab
[x] Ensure responsive layout for different screen sizes
Data Organization
[x] Group stage content logically by tab category
[x] Consider further componentization of complex content (e.g., decision points)
[x] Ensure proper loading states and error handling
This plan will create a more organized and navigable interface for the complex quest stage data, following the same patterns you've established in the location pages.
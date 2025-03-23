// Export all entity components
export { default as EntityHeader } from "./EntityHeader.astro"
export { default as EntityInfoCard } from "./EntityInfoCard.astro"
export { default as QuickActionsCard } from "./QuickActionsCard.astro"
export { default as RelatedEntitiesList } from "./RelatedEntitiesList.astro"
export { default as DeleteEntityButton } from "./DeleteEntityButton.astro"
export { default as PropertyRow } from "./PropertyRow.astro"

// Also export types from components
export type { InfoItem } from "./EntityInfoCard.astro"
export type { QuickAction } from "./QuickActionsCard.astro"
export type { RelatedEntity } from "./RelatedEntitiesList.astro"

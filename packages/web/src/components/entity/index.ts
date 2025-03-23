// Export all entity components
export { default as EntityHeader } from "./EntityHeader.astro"
export { default as EntityInfoCard } from "./EntityInfoCard.astro"
export { default as QuickActionsCard } from "./QuickActionsCard.astro"
export { default as RelatedEntitiesList } from "./RelatedEntitiesList.astro"
export { default as DeleteEntityButton } from "./DeleteEntityButton.astro"
export { default as PropertyRow } from "./PropertyRow.astro"

// New components
export { default as ContentSection } from "./ContentSection.astro"
export { default as IconBulletList } from "./IconBulletList.astro"
export { default as StatusBadge } from "./StatusBadge.astro"
export { default as SecretContent } from "./SecretContent.astro"
export { default as CardGrid } from "./CardGrid.astro"
export { default as EntitySection } from "./EntitySection.astro"
export { default as IconTextPair } from "./IconTextPair.astro"

// Also export types from components
export type { InfoItem } from "./EntityInfoCard.astro"
export type { QuickAction } from "./QuickActionsCard.astro"
export type { RelatedEntity } from "./RelatedEntitiesList.astro"

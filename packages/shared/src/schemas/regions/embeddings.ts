import { getTextForEmbedding } from "../../lib/embeddings"
import type { areas, regions, siteEncounters, siteSecrets, sites } from "./tables"

export const embeddingTextForRegion = (region: typeof regions.$inferSelect) =>
	getTextForEmbedding(region, [
		"name",
		"type",
		"description",
		"history",
		"culturalNotes",
		"pointsOfInterest",
		"rumors",
		"secrets",
		"economy",
		"population",
		"hazards",
		"security",
		"dangerLevel",
		"creativePrompts",
	])

export const embeddingTextForArea = (area: typeof areas.$inferSelect) =>
	getTextForEmbedding(area, [
		"name",
		"type",
		"dangerLevel",
		"leadership",
		"population",
		"primaryActivity",
		"description",
		"culturalNotes",
		"creativePrompts",
		"hazards",
		"pointsOfInterest",
		"rumors",
		"defenses",
	])

export const embeddingTextForSite = (site: typeof sites.$inferSelect) =>
	getTextForEmbedding(site, [
		"name",
		"siteType",
		"terrain",
		"climate",
		"mood",
		"environment",
		"creativePrompts",
		"creatures",
		"description",
		"features",
		"treasures",
		"lightingDescription",
		"soundscape",
		"smells",
		"weather",
		"descriptors",
	])

export const embeddingTextForSiteEncounter = (encounter: typeof siteEncounters.$inferSelect) =>
	getTextForEmbedding(encounter, [
		"name",
		"encounterType",
		"dangerLevel",
		"difficulty",
		"description",
		"creativePrompts",
		"creatures",
		"treasure",
	])

export const embeddingTextForSiteSecret = (secret: typeof siteSecrets.$inferSelect) =>
	getTextForEmbedding(secret, [
		"secretType",
		"difficultyToDiscover",
		"discoveryMethod",
		"description",
		"creativePrompts",
		"consequences",
	])

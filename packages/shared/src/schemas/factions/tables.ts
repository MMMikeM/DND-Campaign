import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, manyOf, nullableFk, nullableOneOf, nullableString, oneOf, pk, string } from "../../db/utils"
import { embeddings } from "../embeddings/tables"
import { areas, regions, sites } from "../regions/tables"
import { alignments, relationshipStrengths, wealthLevels } from "../shared-enums"

const factionSizes = ["tiny", "small", "medium", "large", "massive"] as const
const reachLevels = ["local", "regional", "national", "continental", "global"] as const
const diplomaticStatuses = ["ally", "enemy", "neutral", "vassal", "suzerain", "rival", "trade"] as const
const agendaTypes = ["economic", "military", "political", "social", "occult", "technological"] as const
const agendaStages = ["preparatory", "active", "concluding", "resolved"] as const
const agendaImportance = ["peripheral", "significant", "central"] as const
const influenceLevels = ["contested", "minor", "influenced", "moderate", "strong", "controlled", "dominated"] as const
const factionTypes = [
	"guild",
	"cult",
	"tribe",
	"noble_house",
	"mercantile",
	"religious",
	"military",
	"criminal",
	"political",
	"arcane",
] as const

const transparencyLevels = ["transparent", "secretive", "deceptive"] as const

export const factions = pgTable(
	"factions",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		name: string("name").unique(),
		publicAlignment: oneOf("public_alignment", alignments),
		secretAlignment: nullableOneOf("secret_alignment", alignments),
		size: oneOf("size", factionSizes),
		wealth: oneOf("wealth", wealthLevels),
		reach: oneOf("reach", reachLevels),
		type: manyOf("type", factionTypes),
		publicGoal: string("public_goal"),
		secretGoal: nullableString("secret_goal"),

		publicPerception: string("public_perception"),
		transparencyLevel: oneOf("transparency_level", transparencyLevels),

		values: list("values"),
		history: list("history"),

		symbols: list("symbols"),
		rituals: list("rituals"),
		taboos: list("taboos"),
		aesthetics: list("aesthetics"),
		jargon: list("jargon"),
		recognitionSigns: list("recognition_signs"),

		primaryHqSiteId: nullableFk("primary_hq_site_id", () => sites.id),

		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [
		check(
			"chk_faction_transparency_rules",
			sql`NOT ((${t.transparencyLevel} = 'transparent') AND (${t.secretAlignment} IS NOT NULL OR ${t.secretGoal} IS NOT NULL))`,
		),
	],
)

export const factionAgendas = pgTable(
	"faction_agendas",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		name: string("name").unique(),
		agendaType: oneOf("agenda_type", agendaTypes),
		currentStage: oneOf("current_stage", agendaStages),
		importance: oneOf("importance", agendaImportance),
		ultimateAim: string("ultimate_aim"),
		moralAmbiguity: string("moral_ambiguity"),

		approach: list("approach"),
		storyHooks: list("story_hooks"),

		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [unique().on(t.factionId, t.name)],
)

export const factionDiplomacy = pgTable(
	"faction_diplomacy",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		otherFactionId: cascadeFk("other_faction_id", factions.id),
		strength: oneOf("strength", relationshipStrengths),
		diplomaticStatus: oneOf("diplomatic_status", diplomaticStatuses),
	},
	(t) => [unique().on(t.factionId, t.otherFactionId)],
)

export const factionInfluence = pgTable(
	"faction_influence",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		regionId: nullableFk("region_id", () => regions.id),
		areaId: nullableFk("area_id", () => areas.id),
		siteId: nullableFk("site_id", sites.id),
		influenceLevel: oneOf("influence_level", influenceLevels),

		presenceTypes: list("presence_types"),
		presenceDetails: list("presence_details"),
		priorities: list("priorities"),
	},
	(t) => [
		check(
			"region_or_area_or_site",
			sql`(${t.regionId} IS NOT NULL AND ${t.areaId} IS NULL AND ${t.siteId} IS NULL) 
			OR  (${t.regionId} IS NULL AND ${t.areaId} IS NOT NULL AND ${t.siteId} IS NULL) 
			OR  (${t.regionId} IS NULL AND ${t.areaId} IS NULL AND ${t.siteId} IS NOT NULL)`,
		),
	],
)

export const enums = {
	alignments,
	diplomaticStatuses,
	agendaImportance,
	agendaStages,
	agendaTypes,
	factionTypes,
	factionSizes,
	influenceLevels,
	reachLevels,
	relationshipStrengths,
	transparencyLevels,
	wealthLevels,
}

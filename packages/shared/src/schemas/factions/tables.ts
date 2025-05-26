import { pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../db/utils"
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

export const factions = pgTable("factions", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	name: string("name").unique(),
	alignment: oneOf("alignment", alignments),
	size: oneOf("size", factionSizes),
	wealth: oneOf("wealth", wealthLevels),
	reach: oneOf("reach", reachLevels),
	type: oneOf("type", factionTypes),
	publicGoal: string("public_goal"),
	publicPerception: string("public_perception"),
	secretGoal: nullableString("secret_goal"),

	transparencyLevel: oneOf("transparency_level", transparencyLevels),

	perceivedAlignment: nullableString("perceived_alignment"),

	values: list("values"),
	history: list("history"),
	notes: list("notes"),
	resources: list("resources"),
	recruitment: list("recruitment").notNull(),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const factionHeadquarters = pgTable(
	"faction_headquarters",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		siteId: cascadeFk("site_id", sites.id),
	},

	(t) => [unique().on(t.factionId, t.siteId)],
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

		hiddenCosts: list("hidden_costs"),
		keyOpponents: list("key_opponents"),
		internalConflicts: list("internal_conflicts"),
		approach: list("approach"),
		publicImage: list("public_image"),
		personalStakes: list("personal_stakes"),
		storyHooks: list("story_hooks"),

		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [unique().on(t.factionId, t.name)],
)

export const factionCulture = pgTable(
	"faction_culture",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		symbols: list("symbols"),
		rituals: list("rituals"),
		taboos: list("taboos"),
		aesthetics: list("aesthetics"),
		jargon: list("jargon"),
		recognitionSigns: list("recognition_signs"),
		embeddingId: nullableFk("embedding_id", embeddings.id),
	},
	(t) => [unique().on(t.factionId)],
)

export const factionRegionalControl = pgTable(
	"faction_regional_control",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		regionId: cascadeFk("region_id", regions.id),
		influenceLevel: oneOf("influence_level", influenceLevels),

		presenceTypes: list("presence_types"),
		presenceDetails: list("presence_details"),
		priorities: list("priorities"),
	},
	(t) => [unique().on(t.factionId, t.regionId)],
)

export const factionAreaControl = pgTable(
	"faction_area_control",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		areaId: cascadeFk("area_id", areas.id),
		influenceLevel: oneOf("influence_level", influenceLevels),

		presenceTypes: list("presence_types"),
		presenceDetails: list("presence_details"),
		priorities: list("priorities"),
	},
	(t) => [unique().on(t.factionId, t.areaId)],
)

export const factionSiteControl = pgTable(
	"faction_site_control",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		factionId: cascadeFk("faction_id", factions.id),
		siteId: cascadeFk("site_id", sites.id),
		controlLevel: oneOf("control_level", influenceLevels),

		presenceTypes: list("presence_types"),
		presenceDetails: list("presence_details"),
		priorities: list("priorities"),
	},
	(t) => [unique().on(t.factionId, t.siteId)],
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

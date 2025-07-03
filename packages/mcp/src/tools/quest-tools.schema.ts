import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, list, optionalId, type Schema } from "./utils/tool.utils"

const {
	questTables: { quests, questRelations, questHooks, questParticipants, enums },
} = tables

const {
	hookTypes,
	participantImportanceLevels,
	presentationStyles,
	questTypes,
	relationshipTypes,
	trustLevels,
	urgencyLevels,
	questHookSourceTypes,
	impactSeverity,
	eventTypes,
	narrativePlacements,
	rhythmEffects,
	emotionalShapes,
} = enums

type TableNames = CreateTableNames<typeof tables.questTables>

export const tableEnum = ["quests", "questRelations", "questHooks", "questParticipants"] as const satisfies TableNames

export const schemas = {
	quests: createInsertSchema(quests, {
		creativePrompts: list.describe("Ideas for plot developments and player involvement"),
		emotionalShape: z.enum(emotionalShapes).describe("Emotional shape of the quest"),
		eventType: z.enum(eventTypes).describe("Type of event (main, side, faction, character, generic)"),
		impactSeverity: z.enum(impactSeverity).describe("Severity of the impact of the quest"),
		intendedRhythmEffect: z.enum(rhythmEffects).describe("Rhythm effect of the quest"),

		narrativePlacement: z.enum(narrativePlacements).describe("Narrative placement of the quest"),
		payoff: (s) => s.describe("Payoff of the quest"),
		promise: (s) => s.describe("Promise of the quest"),
		stakes: list.describe("Stakes of the quest"),
		description: list.describe("Core narrative elements and storyline in point form"),
		objectives: list.describe("Specific tasks players must accomplish to progress"),
		rewards: list.describe("Items, reputation, and benefits for completion"),
		name: (s) => s.describe("Title or identifier revealed to players"),
		mood: (s) => s.describe("Emotional tone and atmosphere (tense, mysterious, celebratory, etc.)"),
		urgency: z.enum(urgencyLevels).describe("Time pressure (background, developing, urgent, critical)"),
		type: z.enum(questTypes).describe("Campaign significance (main, side, faction, character, generic)"),
		primaryPlayerExperienceGoal: (s) => s.describe("Primary experience goal for players"),
		prerequisiteQuestId: optionalId.describe("ID of quest that must be completed first"),
		otherUnlockConditionsNotes: (s) =>
			s.optional().describe("Additional unlock conditions not covered by prerequisite quest"),
		tags: list.describe("Tags for this quest"),
	})
		.omit({ id: true })
		.strict()
		.describe("Adventures with objectives, rewards, and narrative impact that drive the campaign forward"),

	questRelations: createInsertSchema(questRelations, {
		sourceQuestId: id.describe("ID of the source quest in this relationship"),
		targetQuestId: optionalId.describe("ID of the target quest in this relationship"),
		relationshipType: z
			.enum(relationshipTypes)
			.describe("Connection type (prerequisite, sequel, parallel, alternative, hidden_connection)"),
		description: list.describe("How these quests interconnect narratively in point form"),
		creativePrompts: list.describe("Ideas for emphasizing connections between quests"),
		tags: list.describe("Tags for this relationship"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links between quests that create narrative sequences, alternative paths, or cause-effect relationships"),

	questHooks: createInsertSchema(questHooks, {
		questId: id.describe("ID of quest this hook belongs to"),
		siteId: optionalId.describe("ID of site where this hook can be discovered"),
		factionId: optionalId.describe("ID of faction involved in this hook"),
		source: (s) => s.describe("Source of the hook information"),
		hookSourceType: z.enum(questHookSourceTypes).describe("Type of hook source"),
		name: (s) => s.describe("Name of the hook"),
		hookType: z.enum(hookTypes).describe("Type of hook (rumor, npc_interaction, location_discovery)"),
		presentationStyle: z.enum(presentationStyles).describe("How to present this hook"),
		hookContent: list.describe("Content of the hook"),
		discoveryConditions: list.describe("Conditions for discovering this hook"),
		deliveryNpcId: optionalId.describe("ID of NPC who delivers this hook"),
		npcRelationshipToParty: (s) => s.describe("Relationship of the delivery NPC to the party"),
		trustRequired: z.enum(trustLevels).describe("Trust level required for this hook"),
		dialogueHint: (s) => s.describe("Dialogue hint for this hook"),
		description: list.describe("Description of this hook"),
		creativePrompts: list.describe("Ideas for presenting this hook"),
		tags: list.describe("Tags for this hook"),
	})
		.omit({ id: true })
		.strict()
		.describe("Ways for players to discover and begin quests"),

	questParticipants: createInsertSchema(questParticipants, {
		questId: id.describe("ID of quest this involvement belongs to"),
		npcId: optionalId.describe("ID of NPC involved (either npcId or factionId must be provided)"),
		factionId: optionalId.describe("ID of faction involved (either npcId or factionId must be provided)"),
		roleInQuest: (s) => s.describe("Role of the participant in the quest"),
		importanceInQuest: z.enum(participantImportanceLevels).describe("Importance level of this participant"),
		involvementDetails: list.describe("Details about how this participant is involved"),
		creativePrompts: list.describe("Ideas for using this participant"),
		description: list.describe("Description of the participant's involvement"),
		tags: list.describe("Tags for this participant involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs and factions are involved in quests")
		.refine((data) => (data.npcId !== undefined) !== (data.factionId !== undefined), {
			message: "Either npcId or factionId must be provided, but not both",
			path: ["npcId", "factionId"],
		}),
} as const satisfies Schema<TableNames[number]>

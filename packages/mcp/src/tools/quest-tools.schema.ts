import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { type CreateTableNames, id, optionalId, type Schema } from "./utils/tool.utils"

const {
	questTables: { quests, questRelations, questHooks, questParticipants, enums },
} = tables

const {
	hookTypes,
	moralSpectrumFocus,
	pacingRoles,
	playerExperienceGoals,
	relationshipTypes,
	visibilityLevels,
	urgencyLevels,
	participantImportanceLevels,
	presentationStyles,
	questHookSourceTypes,
	questTypes,
	trustLevels,
} = enums

type TableNames = CreateTableNames<typeof tables.questTables>

export const tableEnum = ["quests", "questRelations", "questHooks", "questParticipants"] as const satisfies TableNames

export const schemas = {
	quests: createInsertSchema(quests, {
		creativePrompts: (s) => s.describe("Ideas for plot developments and player involvement"),
		description: (s) => s.describe("Core narrative elements and storyline in point form"),
		failureOutcomes: (s) => s.describe("Consequences if players fail to complete the quest"),
		successOutcomes: (s) => s.describe("Results and world changes upon successful completion"),
		inspirations: (s) => s.describe("Reference materials that influenced this quest design"),
		objectives: (s) => s.describe("Specific tasks players must accomplish to progress"),
		rewards: (s) => s.describe("Items, reputation, and benefits for completion"),
		themes: (s) => s.describe("Underlying motifs and emotional elements explored"),
		name: (s) => s.describe("Title or identifier revealed to players"),
		regionId: optionalId.describe("ID of region where quest primarily takes place"),
		mood: (s) => s.describe("Emotional tone and atmosphere (tense, mysterious, celebratory, etc.)"),
		urgency: z.enum(urgencyLevels).describe("Time pressure (background, developing, urgent, critical)"),
		visibility: z.enum(visibilityLevels).describe("How known this quest is (hidden, rumored, known, featured)"),
		type: z.enum(questTypes).describe("Campaign significance (main, side, faction, character, generic)"),
		moralSpectrumFocus: z.enum(moralSpectrumFocus).describe("Moral complexity of the quest"),
		intendedPacingRole: z.enum(pacingRoles).describe("Role in campaign pacing"),
		primaryPlayerExperienceGoal: z.enum(playerExperienceGoals).describe("Primary experience goal for players"),
		prerequisiteQuestId: optionalId.describe("ID of quest that must be completed first"),
		otherUnlockConditionsNotes: (s) =>
			s.optional().describe("Additional unlock conditions not covered by prerequisite quest"),
		gmNotes: (s) => s.describe("GM-only information about this quest"),
		tags: (s) => s.describe("Tags for this quest"),
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
		description: (s) => s.describe("How these quests interconnect narratively in point form"),
		creativePrompts: (s) => s.describe("Ideas for emphasizing connections between quests"),
		gmNotes: (s) => s.describe("GM-only notes about this relationship"),
		tags: (s) => s.describe("Tags for this relationship"),
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
		hookContent: (s) => s.describe("Content of the hook"),
		discoveryConditions: (s) => s.describe("Conditions for discovering this hook"),
		deliveryNpcId: optionalId.describe("ID of NPC who delivers this hook"),
		npcRelationshipToParty: (s) => s.describe("Relationship of the delivery NPC to the party"),
		trustRequired: z.enum(trustLevels).describe("Trust level required for this hook"),
		dialogueHint: (s) => s.describe("Dialogue hint for this hook"),
		description: (s) => s.describe("Description of this hook"),
		creativePrompts: (s) => s.describe("Ideas for presenting this hook"),
		gmNotes: (s) => s.describe("GM-only notes about this hook"),
		tags: (s) => s.describe("Tags for this hook"),
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
		involvementDetails: (s) => s.describe("Details about how this participant is involved"),
		creativePrompts: (s) => s.describe("Ideas for using this participant"),
		description: (s) => s.describe("Description of the participant's involvement"),
		gmNotes: (s) => s.describe("GM-only notes about this participant"),
		tags: (s) => s.describe("Tags for this participant involvement"),
	})
		.omit({ id: true })
		.strict()
		.describe("Defines how NPCs and factions are involved in quests")
		.refine((data) => (data.npcId !== undefined) !== (data.factionId !== undefined), {
			message: "Either npcId or factionId must be provided, but not both",
			path: ["npcId", "factionId"],
		}),
} as const satisfies Schema<TableNames[number]>

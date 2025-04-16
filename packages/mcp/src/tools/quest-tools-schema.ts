import { tables } from "@tome-master/shared"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import { CreateTableNames, id, optionalId, Schema } from "./tool.utils"

const {
	questTables: {
		quests,
		questDependencies,
		questStages,
		questTwists,
		questUnlockConditions,
		stageDecisions,
		decisionOutcomes,
		enums,
	},
} = tables

export type TableNames = CreateTableNames<typeof tables.questTables>

export const tableEnum = [
	"quests",
	"questDependencies",
	"questStages",
	"questTwists",
	"questUnlockConditions",
	"stageDecisions",
	"decisionOutcomes",
] as const satisfies TableNames

export const schemas = {
	quests: createInsertSchema(quests, {
		id: id.describe("ID of quest to manage (omit to create new, include alone to delete)"),
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
		urgency: z.enum(enums.urgencies).describe("Time pressure (background, developing, urgent, critical)"),
		visibility: z.enum(enums.visibilities).describe("How known this quest is (hidden, rumored, known, featured)"),
		type: z.enum(enums.questTypes).describe("Campaign significance (main, side, faction, character, generic)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Adventures with objectives, rewards, and narrative impact that drive the campaign forward"),

	questDependencies: createInsertSchema(questDependencies, {
		id: id.describe("ID of dependency to manage (omit to create new, include alone to delete)"),
		questId: id.describe("ID of the primary quest in this relationship"),
		relatedQuestId: id.describe("ID of the secondary quest in this relationship"),
		description: (s) => s.describe("How these quests interconnect narratively in point form"),
		creativePrompts: (s) => s.describe("Ideas for emphasizing connections between quests"),
		dependencyType: z
			.enum(enums.dependencyTypes)
			.describe("Connection type (prerequisite, sequel, parallel, alternative)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Links between quests that create narrative sequences, alternative paths, or cause-effect relationships"),

	questStages: createInsertSchema(questStages, {
		id: id.describe("ID of stage to manage (omit to create new, include alone to delete)"),
		questId: id.describe("ID of parent quest this stage belongs to"),
		siteId: optionalId.describe("ID of site where this stage takes place"),
		completionPaths: (s) => s.describe("Different approaches players might use to advance"),
		creativePrompts: (s) => s.describe("Ideas for running this stage or adapting to player approaches"),
		description: (s) => s.describe("Key events and plot developments in this segment in point form"),
		dramatic_moments: (s) => s.describe("Key emotional or high-tension scenes"),
		dramatic_question: (s) => s.describe("Central conflict or tension driving this stage"),
		encounters: (s) => s.describe("Challenges, combats, or social interactions in this stage"),
		name: (s) => s.describe("Title or identifier for this quest segment"),
		objectives: (s) => s.describe("Goals players need to complete in this stage"),
		sensory_elements: (s) => s.describe("Descriptive details for immersion (sights, sounds, smells)"),
		stage: (s) => s.describe("Numerical order or sequence position within quest"),
	})
		.omit({ id: true })
		.strict()
		.describe("Discrete chapters within quests that represent key locations, challenges, or narrative beats"),

	questTwists: createInsertSchema(questTwists, {
		id: id.describe("ID of twist to manage (omit to create new, include alone to delete)"),
		questId: id.describe("ID of quest this twist belongs to"),
		description: (s) => s.describe("The revelation or unexpected development in detail in point form"),
		creativePrompts: (s) => s.describe("Ideas for foreshadowing or maximizing impact"),
		impact: z
			.enum(enums.impactSeverity)
			.describe("How significantly this changes the narrative (minor, moderate, major)"),
		narrativePlacement: z
			.enum(enums.narrativePlacements)
			.describe("When twist occurs (early, middle, climax, denouement)"),
		twistType: z.enum(enums.twistTypes).describe("Nature of surprise (reversal, revelation, betrayal, complication)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Surprising developments that subvert player expectations and add depth to quest narratives"),

	questUnlockConditions: createInsertSchema(questUnlockConditions, {
		id: id.describe("ID of condition to manage (omit to create new, include alone to delete)"),
		questId: id.describe("ID of quest this condition applies to"),
		conditionDetails: (s) => s.describe("Requirements that must be met to unlock quest"),
		conditionType: z
			.enum(enums.unlockConditionTypes)
			.describe("Prerequisite category (item, faction, skill, decision, etc.)"),
		importance: z.enum(enums.importance).describe("Requirement level (critical, recommended, optional)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Prerequisites that determine when quests become available to players based on their actions"),

	stageDecisions: createInsertSchema(stageDecisions, {
		id: id.describe("ID of decision point to manage (omit to create new, include alone to delete)"),
		questId: id.describe("ID of quest this decision belongs to"),
		fromStageId: id.describe("ID of stage where this decision occurs"),
		toStageId: optionalId.describe("ID of stage this decision leads to if taken"),
		conditionValue: (s) => s.describe("Parameters, DCs, or requirements"),
		description: (s) => s.describe("The choice or dilemma presented to players in point form"),
		creativePrompts: (s) => s.describe("Ideas for presenting this dramatically or adapting to choices"),
		failureDescription: (s) => s.describe("Consequences when players fail or choose differently"),
		successDescription: (s) => s.describe("What happens when players succeed or take intended path"),
		narrativeTransition: (s) => s.describe("How story progresses based on this decision"),
		potential_player_reactions: (s) => s.describe("Likely player responses to this moment"),
		options: (s) => s.describe("Explicit choices available to players"),
		name: (s) => s.describe("Identifier for this pivotal moment"),
		conditionType: z
			.enum(enums.conditionTypes)
			.describe("Trigger type (choice, skill_check, item, npc, faction, etc.)"),
		decisionType: z.enum(enums.decisionTypes).describe("Nature of choice (moral, tactical, resource, identity, etc.)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Branching points where player choices affect the quest's direction, creating meaningful agency"),

	decisionOutcomes: createInsertSchema(decisionOutcomes, {
		id: id.describe("ID of outcome to manage (omit to create new, include alone to delete)"),
		decisionId: id.describe("ID of the decision that triggers this consequence"),
		affectedStageId: optionalId.describe("ID of quest stage impacted by this consequence"),
		description: (s) => s.describe("How this consequence manifests in the world in point form"),
		creativePrompts: (s) => s.describe("Ideas for representing this consequence meaningfully"),
		delayFactor: z.enum(enums.outcomeDelay).describe("When this occurs (immediate, next session, later in campaign)"),
		outcomeType: z
			.enum(enums.outcomeTypes)
			.describe("Effect type (reaction, world_change, relationship, reputation, etc.)"),
		severity: z.enum(enums.outcomeSeverity).describe("Impact magnitude (minor, moderate, major)"),
		visibility: z
			.enum(enums.outcomeVisibility)
			.describe("How apparent this consequence is to players (obvious, subtle, hidden)"),
	})
		.omit({ id: true })
		.strict()
		.describe("Long-term effects of player choices that shape the campaign world and future adventures"),
} as const satisfies Schema<TableNames[number]>

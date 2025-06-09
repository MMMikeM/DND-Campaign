/**
 * Quest Prompt Types
 *
 * Type definitions and schema for the enhanced quest creation system.
 */

import { z } from "zod/v4"

export const questCreationSchema = z.object({
	name: z.string().describe("Name for the new quest"),
	type_hint: z.string().optional().describe("Type of quest (main, side, faction, personal, etc.)"),
	level_hint: z.string().optional().describe("Difficulty level or character level range"),
	location_hint: z.string().optional().describe("Primary location or region for the quest"),
	faction_hint: z.string().optional().describe("Faction involved in or requesting the quest"),
	theme_hint: z.string().optional().describe("Quest theme (investigation, combat, diplomacy, etc.)"),
})

export type QuestCreationArgs = z.infer<typeof questCreationSchema>

export interface QuestContext {
	nameConflicts: Array<{
		id: string
		name: string
		type: string
	}>
	existingQuests: Array<{
		id: string
		name: string
		type: string
		description: string
	}>
	recentQuestStages: Array<{
		id: string
		questId: string
		name: string
		description: string
	}>
	availableLocations: Array<{
		id: string
		name: string
		type: string
		description: string
	}>
	availableFactions: Array<{
		id: string
		name: string
		type: string
		publicAlignment: string
		secretAlignment: string
		description: string
	}>
	availableNPCs: Array<{
		id: string
		name: string
		occupation: string
		alignment: string
	}>
	factionContext: {
		factions: Array<{
			id: string
			name: string
			type: string
			publicAlignment: string
			secretAlignment: string
			description: string
		}>
		members: Array<{
			id: string
			name: string
			occupation: string
			alignment: string
		}>
	} | null
	activeConflicts: Array<{
		id: string
		name: string
		natures: string[]
		description: string
	}>
	suggestedConnections: string[]
	questTypeAnalysis: string[]
	themeAnalysis: string[]
	rewardSuggestions: string[]
	complicationSuggestions: string[]
	futureHookSuggestions: string[]
}

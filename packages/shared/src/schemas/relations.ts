/**
 * Centralized relation definitions (drizzle RQB v2).
 *
 * Every relation states its own from/to columns, so both directions of a
 * relationship are independent — the v1 relationName pairing is gone.
 * Relation key names are load-bearing: they are the `with:` keys at every
 * db.query call site, so renaming one here is a breaking change downstream.
 */

import { defineRelations } from "drizzle-orm"
import { conflictParticipants, conflicts } from "./conflicts/tables"
import { consequences } from "./consequences/tables"
import { factionAgendas, factionDiplomacy, factionInfluence, factions } from "./factions/tables"
import { foreshadowing } from "./foreshadowing/tables"
import { itemConnections, items } from "./items/tables"
import { lore, loreLinks } from "./lore/tables"
import { mapFiles, mapGroups, mapVariants } from "./maps/tables"
import { npcDetails, npcFactionMemberships, npcRelations, npcs } from "./npcs/tables"
import { questHooks, questParticipants, questRelations, quests } from "./quests/tables"
import { areas, regionConnections, regions, siteEncounters, siteLinks, siteSecrets, sites } from "./regions/tables"
import { npcStageInvolvement, questStageDecisions, questStages } from "./stages/tables"

const schema = {
	conflicts,
	conflictParticipants,
	consequences,
	factions,
	factionAgendas,
	factionDiplomacy,
	factionInfluence,
	foreshadowing,
	items,
	itemConnections,
	lore,
	loreLinks,
	mapFiles,
	mapGroups,
	mapVariants,
	npcs,
	npcDetails,
	npcFactionMemberships,
	npcRelations,
	quests,
	questRelations,
	questHooks,
	questParticipants,
	regions,
	regionConnections,
	areas,
	sites,
	siteLinks,
	siteEncounters,
	siteSecrets,
	questStages,
	questStageDecisions,
	npcStageInvolvement,
}

export const relations = defineRelations(schema, (r) => ({
	// ── conflicts ────────────────────────────────────────────────────────
	conflicts: {
		region: r.one.regions({ from: r.conflicts.regionId, to: r.regions.id }),
		participants: r.many.conflictParticipants({ from: r.conflicts.id, to: r.conflictParticipants.conflictId }),
		affectingConsequences: r.many.consequences({ from: r.conflicts.id, to: r.consequences.affectedConflictId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.conflicts.id, to: r.foreshadowing.targetConflictId }),
		itemConnections: r.many.itemConnections({ from: r.conflicts.id, to: r.itemConnections.connectedConflictId }),
		loreLinks: r.many.loreLinks({ from: r.conflicts.id, to: r.loreLinks.conflictId }),
	},
	conflictParticipants: {
		conflict: r.one.conflicts({ from: r.conflictParticipants.conflictId, to: r.conflicts.id, optional: false }),
		faction: r.one.factions({ from: r.conflictParticipants.factionId, to: r.factions.id }),
		npc: r.one.npcs({ from: r.conflictParticipants.npcId, to: r.npcs.id }),
	},

	// ── consequences ─────────────────────────────────────────────────────
	consequences: {
		affectedConsequence: r.one.consequences({
			from: r.consequences.affectedConsequenceId,
			to: r.consequences.id,
		}),
		affectingConsequences: r.many.consequences({
			from: r.consequences.id,
			to: r.consequences.affectedConsequenceId,
		}),
		triggerQuest: r.one.quests({ from: r.consequences.triggerQuestId, to: r.quests.id }),
		triggerQuestStageDecision: r.one.questStageDecisions({
			from: r.consequences.triggerQuestStageDecisionId,
			to: r.questStageDecisions.id,
		}),
		affectedFaction: r.one.factions({ from: r.consequences.affectedFactionId, to: r.factions.id }),
		affectedRegion: r.one.regions({ from: r.consequences.affectedRegionId, to: r.regions.id }),
		affectedArea: r.one.areas({ from: r.consequences.affectedAreaId, to: r.areas.id }),
		affectedSite: r.one.sites({ from: r.consequences.affectedSiteId, to: r.sites.id }),
		affectedNpc: r.one.npcs({ from: r.consequences.affectedNpcId, to: r.npcs.id }),
		affectedConflict: r.one.conflicts({ from: r.consequences.affectedConflictId, to: r.conflicts.id }),
		affectedQuest: r.one.quests({ from: r.consequences.affectedQuestId, to: r.quests.id }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.consequences.id, to: r.foreshadowing.targetConsequenceId }),
	},

	// ── factions ─────────────────────────────────────────────────────────
	factions: {
		outgoingRelations: r.many.factionDiplomacy({ from: r.factions.id, to: r.factionDiplomacy.sourceFactionId }),
		incomingRelations: r.many.factionDiplomacy({ from: r.factions.id, to: r.factionDiplomacy.targetFactionId }),
		agendas: r.many.factionAgendas({ from: r.factions.id, to: r.factionAgendas.factionId }),
		members: r.many.npcFactionMemberships({ from: r.factions.id, to: r.npcFactionMemberships.factionId }),
		questHooks: r.many.questHooks({ from: r.factions.id, to: r.questHooks.factionId }),
		questParticipation: r.many.questParticipants({ from: r.factions.id, to: r.questParticipants.factionId }),
		influence: r.many.factionInfluence({ from: r.factions.id, to: r.factionInfluence.factionId }),
		conflicts: r.many.conflictParticipants({ from: r.factions.id, to: r.conflictParticipants.factionId }),
		affectingConsequences: r.many.consequences({ from: r.factions.id, to: r.consequences.affectedFactionId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.factions.id, to: r.foreshadowing.targetFactionId }),
		itemConnections: r.many.itemConnections({ from: r.factions.id, to: r.itemConnections.connectedFactionId }),
		loreLinks: r.many.loreLinks({ from: r.factions.id, to: r.loreLinks.factionId }),
		primaryHqSite: r.one.sites({ from: r.factions.hqSiteId, to: r.sites.id }),
	},
	factionDiplomacy: {
		sourceFaction: r.one.factions({ from: r.factionDiplomacy.sourceFactionId, to: r.factions.id, optional: false }),
		targetFaction: r.one.factions({ from: r.factionDiplomacy.targetFactionId, to: r.factions.id, optional: false }),
	},
	factionAgendas: {
		faction: r.one.factions({ from: r.factionAgendas.factionId, to: r.factions.id, optional: false }),
	},
	factionInfluence: {
		faction: r.one.factions({ from: r.factionInfluence.factionId, to: r.factions.id, optional: false }),
		region: r.one.regions({ from: r.factionInfluence.regionId, to: r.regions.id }),
		area: r.one.areas({ from: r.factionInfluence.areaId, to: r.areas.id }),
		site: r.one.sites({ from: r.factionInfluence.siteId, to: r.sites.id }),
	},

	// ── foreshadowing ────────────────────────────────────────────────────
	foreshadowing: {
		incomingLoreLinks: r.many.loreLinks({ from: r.foreshadowing.id, to: r.loreLinks.foreshadowingId }),
		targetQuest: r.one.quests({ from: r.foreshadowing.targetQuestId, to: r.quests.id }),
		targetNpc: r.one.npcs({ from: r.foreshadowing.targetNpcId, to: r.npcs.id }),
		targetConflict: r.one.conflicts({ from: r.foreshadowing.targetConflictId, to: r.conflicts.id }),
		targetItem: r.one.items({ from: r.foreshadowing.targetItemId, to: r.items.id }),
		targetLore: r.one.lore({ from: r.foreshadowing.targetLoreId, to: r.lore.id }),
		targetFaction: r.one.factions({ from: r.foreshadowing.targetFactionId, to: r.factions.id }),
		targetSite: r.one.sites({ from: r.foreshadowing.targetSiteId, to: r.sites.id }),
		targetConsequence: r.one.consequences({ from: r.foreshadowing.targetConsequenceId, to: r.consequences.id }),
		targetRegion: r.one.regions({ from: r.foreshadowing.targetRegionId, to: r.regions.id }),
		targetArea: r.one.areas({ from: r.foreshadowing.targetAreaId, to: r.areas.id }),
		sourceQuest: r.one.quests({ from: r.foreshadowing.sourceQuestId, to: r.quests.id }),
		sourceQuestStage: r.one.questStages({ from: r.foreshadowing.sourceQuestStageId, to: r.questStages.id }),
		sourceSite: r.one.sites({ from: r.foreshadowing.sourceSiteId, to: r.sites.id }),
		sourceNpc: r.one.npcs({ from: r.foreshadowing.sourceNpcId, to: r.npcs.id }),
		sourceLore: r.one.lore({ from: r.foreshadowing.sourceLoreId, to: r.lore.id }),
		sourceItem: r.one.items({ from: r.foreshadowing.sourceItemId, to: r.items.id }),
	},

	// ── items ────────────────────────────────────────────────────────────
	items: {
		outgoingRelations: r.many.itemConnections({ from: r.items.id, to: r.itemConnections.itemId }),
		incomingRelations: r.many.itemConnections({ from: r.items.id, to: r.itemConnections.connectedItemId }),
		outgoingForeshadowing: r.many.foreshadowing({ from: r.items.id, to: r.foreshadowing.sourceItemId }),
		loreLinks: r.many.loreLinks({ from: r.items.id, to: r.loreLinks.itemId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.items.id, to: r.foreshadowing.targetItemId }),
	},
	itemConnections: {
		sourceItem: r.one.items({ from: r.itemConnections.itemId, to: r.items.id, optional: false }),
		item: r.one.items({ from: r.itemConnections.connectedItemId, to: r.items.id }),
		npc: r.one.npcs({ from: r.itemConnections.connectedNpcId, to: r.npcs.id }),
		faction: r.one.factions({ from: r.itemConnections.connectedFactionId, to: r.factions.id }),
		site: r.one.sites({ from: r.itemConnections.connectedSiteId, to: r.sites.id }),
		quest: r.one.quests({ from: r.itemConnections.connectedQuestId, to: r.quests.id }),
		conflict: r.one.conflicts({ from: r.itemConnections.connectedConflictId, to: r.conflicts.id }),
		lore: r.one.lore({ from: r.itemConnections.connectedLoreId, to: r.lore.id }),
		questStage: r.one.questStages({ from: r.itemConnections.connectedQuestStageId, to: r.questStages.id }),
	},

	// ── lore ─────────────────────────────────────────────────────────────
	lore: {
		incomingForeshadowing: r.many.foreshadowing({ from: r.lore.id, to: r.foreshadowing.targetLoreId }),
		outgoingForeshadowing: r.many.foreshadowing({ from: r.lore.id, to: r.foreshadowing.sourceLoreId }),
		links: r.many.loreLinks({ from: r.lore.id, to: r.loreLinks.loreId }),
		relatedLinks: r.many.loreLinks({ from: r.lore.id, to: r.loreLinks.relatedLoreId }),
	},
	loreLinks: {
		lore: r.one.lore({ from: r.loreLinks.loreId, to: r.lore.id, optional: false }),
		region: r.one.regions({ from: r.loreLinks.regionId, to: r.regions.id }),
		faction: r.one.factions({ from: r.loreLinks.factionId, to: r.factions.id }),
		npc: r.one.npcs({ from: r.loreLinks.npcId, to: r.npcs.id }),
		conflict: r.one.conflicts({ from: r.loreLinks.conflictId, to: r.conflicts.id }),
		quest: r.one.quests({ from: r.loreLinks.questId, to: r.quests.id }),
		foreshadowing: r.one.foreshadowing({ from: r.loreLinks.foreshadowingId, to: r.foreshadowing.id }),
		item: r.one.items({ from: r.loreLinks.itemId, to: r.items.id }),
		relatedLore: r.one.lore({ from: r.loreLinks.relatedLoreId, to: r.lore.id }),
	},

	// ── maps ─────────────────────────────────────────────────────────────
	mapFiles: {
		variant: r.one.mapVariants({ from: r.mapFiles.id, to: r.mapVariants.mapFileId }),
	},
	mapGroups: {
		variants: r.many.mapVariants({ from: r.mapGroups.id, to: r.mapVariants.mapGroupId }),
		site: r.one.sites({ from: r.mapGroups.id, to: r.sites.mapGroupId }),
	},
	mapVariants: {
		mapGroup: r.one.mapGroups({ from: r.mapVariants.mapGroupId, to: r.mapGroups.id, optional: false }),
		mapFile: r.one.mapFiles({ from: r.mapVariants.mapFileId, to: r.mapFiles.id, optional: false }),
		siteEncounters: r.many.siteEncounters({ from: r.mapVariants.id, to: r.siteEncounters.mapVariantId }),
	},

	// ── npcs ─────────────────────────────────────────────────────────────
	npcs: {
		outgoingRelations: r.many.npcRelations({ from: r.npcs.id, to: r.npcRelations.sourceNpcId }),
		incomingRelations: r.many.npcRelations({ from: r.npcs.id, to: r.npcRelations.targetNpcId }),
		site: r.one.sites({ from: r.npcs.siteId, to: r.sites.id }),
		factionMemberships: r.one.npcFactionMemberships({ from: r.npcs.id, to: r.npcFactionMemberships.npcId }),
		conflictParticipation: r.many.conflictParticipants({ from: r.npcs.id, to: r.conflictParticipants.npcId }),
		affectingConsequences: r.many.consequences({ from: r.npcs.id, to: r.consequences.affectedNpcId }),
		outgoingForeshadowing: r.many.foreshadowing({ from: r.npcs.id, to: r.foreshadowing.sourceNpcId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.npcs.id, to: r.foreshadowing.targetNpcId }),
		itemConnections: r.many.itemConnections({ from: r.npcs.id, to: r.itemConnections.connectedNpcId }),
		questHooks: r.many.questHooks({ from: r.npcs.id, to: r.questHooks.deliveryNpcId }),
		questStageDeliveries: r.many.questStages({ from: r.npcs.id, to: r.questStages.deliveryNpcId }),
		questParticipants: r.many.questParticipants({ from: r.npcs.id, to: r.questParticipants.npcId }),
		stageInvolvement: r.many.npcStageInvolvement({ from: r.npcs.id, to: r.npcStageInvolvement.npcId }),
		loreLinks: r.many.loreLinks({ from: r.npcs.id, to: r.loreLinks.npcId }),
		details: r.one.npcDetails({ from: r.npcs.id, to: r.npcDetails.npcId }),
	},
	npcDetails: {
		npc: r.one.npcs({ from: r.npcDetails.npcId, to: r.npcs.id, optional: false }),
	},
	npcRelations: {
		sourceNpc: r.one.npcs({ from: r.npcRelations.sourceNpcId, to: r.npcs.id, optional: false }),
		targetNpc: r.one.npcs({ from: r.npcRelations.targetNpcId, to: r.npcs.id, optional: false }),
	},
	npcFactionMemberships: {
		npc: r.one.npcs({ from: r.npcFactionMemberships.npcId, to: r.npcs.id, optional: false }),
		faction: r.one.factions({ from: r.npcFactionMemberships.factionId, to: r.factions.id, optional: false }),
	},

	// ── quests ───────────────────────────────────────────────────────────
	quests: {
		prerequisiteQuest: r.one.quests({ from: r.quests.prerequisiteQuestId, to: r.quests.id }),
		dependentQuests: r.many.quests({ from: r.quests.id, to: r.quests.prerequisiteQuestId }),
		outgoingRelations: r.many.questRelations({ from: r.quests.id, to: r.questRelations.sourceQuestId }),
		incomingRelations: r.many.questRelations({ from: r.quests.id, to: r.questRelations.targetQuestId }),
		stages: r.many.questStages({ from: r.quests.id, to: r.questStages.questId }),
		stageDecisions: r.many.questStageDecisions({ from: r.quests.id, to: r.questStageDecisions.questId }),
		hooks: r.many.questHooks({ from: r.quests.id, to: r.questHooks.questId }),
		participants: r.many.questParticipants({ from: r.quests.id, to: r.questParticipants.questId }),
		triggeredConsequences: r.many.consequences({ from: r.quests.id, to: r.consequences.triggerQuestId }),
		affectingConsequences: r.many.consequences({ from: r.quests.id, to: r.consequences.affectedQuestId }),
		outgoingForeshadowing: r.many.foreshadowing({ from: r.quests.id, to: r.foreshadowing.sourceQuestId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.quests.id, to: r.foreshadowing.targetQuestId }),
		itemConnections: r.many.itemConnections({ from: r.quests.id, to: r.itemConnections.connectedQuestId }),
		loreLinks: r.many.loreLinks({ from: r.quests.id, to: r.loreLinks.questId }),
	},
	questRelations: {
		sourceQuest: r.one.quests({ from: r.questRelations.sourceQuestId, to: r.quests.id, optional: false }),
		targetQuest: r.one.quests({ from: r.questRelations.targetQuestId, to: r.quests.id, optional: false }),
	},
	questHooks: {
		quest: r.one.quests({ from: r.questHooks.questId, to: r.quests.id, optional: false }),
		site: r.one.sites({ from: r.questHooks.siteId, to: r.sites.id }),
		faction: r.one.factions({ from: r.questHooks.factionId, to: r.factions.id }),
		deliveryNpc: r.one.npcs({ from: r.questHooks.deliveryNpcId, to: r.npcs.id }),
	},
	questParticipants: {
		quest: r.one.quests({ from: r.questParticipants.questId, to: r.quests.id, optional: false }),
		npc: r.one.npcs({ from: r.questParticipants.npcId, to: r.npcs.id }),
		faction: r.one.factions({ from: r.questParticipants.factionId, to: r.factions.id }),
	},

	// ── regions ──────────────────────────────────────────────────────────
	regions: {
		outgoingRelations: r.many.regionConnections({ from: r.regions.id, to: r.regionConnections.sourceRegionId }),
		incomingRelations: r.many.regionConnections({ from: r.regions.id, to: r.regionConnections.targetRegionId }),
		areas: r.many.areas({ from: r.regions.id, to: r.areas.regionId }),
		conflicts: r.many.conflicts({ from: r.regions.id, to: r.conflicts.regionId }),
		consequences: r.many.consequences({ from: r.regions.id, to: r.consequences.affectedRegionId }),
		factionInfluence: r.many.factionInfluence({ from: r.regions.id, to: r.factionInfluence.regionId }),
		loreLinks: r.many.loreLinks({ from: r.regions.id, to: r.loreLinks.regionId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.regions.id, to: r.foreshadowing.targetRegionId }),
	},
	regionConnections: {
		sourceRegion: r.one.regions({ from: r.regionConnections.sourceRegionId, to: r.regions.id, optional: false }),
		targetRegion: r.one.regions({ from: r.regionConnections.targetRegionId, to: r.regions.id, optional: false }),
	},
	areas: {
		region: r.one.regions({ from: r.areas.regionId, to: r.regions.id, optional: false }),
		sites: r.many.sites({ from: r.areas.id, to: r.sites.areaId }),
		consequences: r.many.consequences({ from: r.areas.id, to: r.consequences.affectedAreaId }),
		factionInfluence: r.many.factionInfluence({ from: r.areas.id, to: r.factionInfluence.areaId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.areas.id, to: r.foreshadowing.targetAreaId }),
	},
	sites: {
		outgoingRelations: r.many.siteLinks({ from: r.sites.id, to: r.siteLinks.sourceSiteId }),
		incomingRelations: r.many.siteLinks({ from: r.sites.id, to: r.siteLinks.targetSiteId }),
		area: r.one.areas({ from: r.sites.areaId, to: r.areas.id, optional: false }),
		encounters: r.many.siteEncounters({ from: r.sites.id, to: r.siteEncounters.siteId }),
		secrets: r.many.siteSecrets({ from: r.sites.id, to: r.siteSecrets.siteId }),
		questStages: r.many.questStages({ from: r.sites.id, to: r.questStages.siteId }),
		questHooks: r.many.questHooks({ from: r.sites.id, to: r.questHooks.siteId }),
		consequences: r.many.consequences({ from: r.sites.id, to: r.consequences.affectedSiteId }),
		factionHqs: r.many.factions({ from: r.sites.id, to: r.factions.hqSiteId }),
		factionInfluence: r.many.factionInfluence({ from: r.sites.id, to: r.factionInfluence.siteId }),
		outgoingForeshadowing: r.many.foreshadowing({ from: r.sites.id, to: r.foreshadowing.sourceSiteId }),
		incomingForeshadowing: r.many.foreshadowing({ from: r.sites.id, to: r.foreshadowing.targetSiteId }),
		itemConnections: r.many.itemConnections({ from: r.sites.id, to: r.itemConnections.connectedSiteId }),
		mapGroup: r.one.mapGroups({ from: r.sites.mapGroupId, to: r.mapGroups.id }),
		npcs: r.many.npcs({ from: r.sites.id, to: r.npcs.siteId }),
	},
	siteLinks: {
		sourceSite: r.one.sites({ from: r.siteLinks.sourceSiteId, to: r.sites.id, optional: false }),
		targetSite: r.one.sites({ from: r.siteLinks.targetSiteId, to: r.sites.id, optional: false }),
	},
	siteEncounters: {
		site: r.one.sites({ from: r.siteEncounters.siteId, to: r.sites.id, optional: false }),
		mapVariant: r.one.mapVariants({ from: r.siteEncounters.mapVariantId, to: r.mapVariants.id, optional: false }),
	},
	siteSecrets: {
		site: r.one.sites({ from: r.siteSecrets.siteId, to: r.sites.id, optional: false }),
	},

	// ── stages ───────────────────────────────────────────────────────────
	questStages: {
		quest: r.one.quests({ from: r.questStages.questId, to: r.quests.id, optional: false }),
		site: r.one.sites({ from: r.questStages.siteId, to: r.sites.id }),
		deliveryNpc: r.one.npcs({ from: r.questStages.deliveryNpcId, to: r.npcs.id }),
		outgoingDecisions: r.many.questStageDecisions({
			from: r.questStages.id,
			to: r.questStageDecisions.fromQuestStageId,
		}),
		incomingDecisions: r.many.questStageDecisions({
			from: r.questStages.id,
			to: r.questStageDecisions.toQuestStageId,
		}),
		itemConnections: r.many.itemConnections({
			from: r.questStages.id,
			to: r.itemConnections.connectedQuestStageId,
		}),
		npcInvolvement: r.many.npcStageInvolvement({ from: r.questStages.id, to: r.npcStageInvolvement.questStageId }),
		outgoingForeshadowing: r.many.foreshadowing({ from: r.questStages.id, to: r.foreshadowing.sourceQuestStageId }),
	},
	questStageDecisions: {
		quest: r.one.quests({ from: r.questStageDecisions.questId, to: r.quests.id, optional: false }),
		sourceStage: r.one.questStages({
			from: r.questStageDecisions.fromQuestStageId,
			to: r.questStages.id,
			optional: false,
		}),
		targetStage: r.one.questStages({ from: r.questStageDecisions.toQuestStageId, to: r.questStages.id }),
		consequences: r.many.consequences({
			from: r.questStageDecisions.id,
			to: r.consequences.triggerQuestStageDecisionId,
		}),
	},
	npcStageInvolvement: {
		questStage: r.one.questStages({ from: r.npcStageInvolvement.questStageId, to: r.questStages.id, optional: false }),
		npc: r.one.npcs({ from: r.npcStageInvolvement.npcId, to: r.npcs.id, optional: false }),
	},
}))

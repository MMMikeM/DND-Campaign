import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { entityJson, entityJsonWhen } from "../view-utils"
import { foreshadowing } from "./tables"

// Every join here is many-to-one from foreshadowing, so there is no aggregation.
// Tables that are both a source and a target need an alias per role.
const sourceQuest = alias(quests, "source_quest")
const sourceStageQuest = alias(quests, "source_stage_quest")
const targetQuest = alias(quests, "target_quest")
const sourceSite = alias(sites, "source_site")
const targetSite = alias(sites, "target_site")
const sourceNpc = alias(npcs, "source_npc")
const targetNpc = alias(npcs, "target_npc")
const sourceLore = alias(lore, "source_lore")
const targetLore = alias(lore, "target_lore")
const sourceItem = alias(items, "source_item")
const targetItem = alias(items, "target_item")

export const foreshadowingSearchDataView = pgView("foreshadowing_search_data_view").as((qb) =>
	qb
		.select({
			id: foreshadowing.id,
			sourceTable: sql<string>`'foreshadowing'`.as("source_table"),
			entityMain: sql`to_jsonb(${foreshadowing}.*)`.as("entity_main"),
			sourceQuest: entityJsonWhen(foreshadowing.sourceQuestId, sourceQuest).as("source_quest"),
			sourceQuestStage: sql`CASE WHEN ${foreshadowing.sourceQuestStageId} IS NOT NULL THEN jsonb_build_object(
				'stage', ${entityJson(questStages)},
				'quest', ${entityJson(sourceStageQuest)}
			) END`.as("source_quest_stage"),
			sourceSite: entityJsonWhen(foreshadowing.sourceSiteId, sourceSite).as("source_site"),
			sourceNpc: entityJsonWhen(foreshadowing.sourceNpcId, sourceNpc).as("source_npc"),
			sourceLore: entityJsonWhen(foreshadowing.sourceLoreId, sourceLore).as("source_lore"),
			sourceItem: entityJsonWhen(foreshadowing.sourceItemId, sourceItem).as("source_item"),
			targetQuest: entityJsonWhen(foreshadowing.targetQuestId, targetQuest).as("target_quest"),
			targetNpc: entityJsonWhen(foreshadowing.targetNpcId, targetNpc).as("target_npc"),
			targetConflict: entityJsonWhen(foreshadowing.targetConflictId, conflicts).as("target_conflict"),
			targetItem: entityJsonWhen(foreshadowing.targetItemId, targetItem).as("target_item"),
			targetLore: entityJsonWhen(foreshadowing.targetLoreId, targetLore).as("target_lore"),
			targetFaction: entityJsonWhen(foreshadowing.targetFactionId, factions).as("target_faction"),
			targetSite: entityJsonWhen(foreshadowing.targetSiteId, targetSite).as("target_site"),
			targetConsequence: entityJsonWhen(foreshadowing.targetConsequenceId, consequences).as("target_consequence"),
			targetRegion: entityJsonWhen(foreshadowing.targetRegionId, regions).as("target_region"),
			targetArea: entityJsonWhen(foreshadowing.targetAreaId, areas).as("target_area"),
		})
		.from(foreshadowing)
		.leftJoin(sourceQuest, eq(foreshadowing.sourceQuestId, sourceQuest.id))
		.leftJoin(questStages, eq(foreshadowing.sourceQuestStageId, questStages.id))
		.leftJoin(sourceStageQuest, eq(questStages.questId, sourceStageQuest.id))
		.leftJoin(sourceSite, eq(foreshadowing.sourceSiteId, sourceSite.id))
		.leftJoin(sourceNpc, eq(foreshadowing.sourceNpcId, sourceNpc.id))
		.leftJoin(sourceLore, eq(foreshadowing.sourceLoreId, sourceLore.id))
		.leftJoin(sourceItem, eq(foreshadowing.sourceItemId, sourceItem.id))
		.leftJoin(targetQuest, eq(foreshadowing.targetQuestId, targetQuest.id))
		.leftJoin(targetNpc, eq(foreshadowing.targetNpcId, targetNpc.id))
		.leftJoin(conflicts, eq(foreshadowing.targetConflictId, conflicts.id))
		.leftJoin(targetItem, eq(foreshadowing.targetItemId, targetItem.id))
		.leftJoin(targetLore, eq(foreshadowing.targetLoreId, targetLore.id))
		.leftJoin(factions, eq(foreshadowing.targetFactionId, factions.id))
		.leftJoin(targetSite, eq(foreshadowing.targetSiteId, targetSite.id))
		.leftJoin(consequences, eq(foreshadowing.targetConsequenceId, consequences.id))
		.leftJoin(regions, eq(foreshadowing.targetRegionId, regions.id))
		.leftJoin(areas, eq(foreshadowing.targetAreaId, areas.id)),
)

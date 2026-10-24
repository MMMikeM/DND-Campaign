import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factionInfluence, factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { mapGroups } from "../maps/tables"
import { questHooks, quests } from "../quests/tables"
import { questStages } from "../stages/tables"
import { entityJson, entityJsonWhen, jsonAgg, jsonObject } from "../view-utils"
import { areas, regionConnections, regions, siteEncounters, siteLinks, siteSecrets, sites } from "./tables"

const consequenceJson = sql`jsonb_build_object('id', ${consequences.id}, 'name', ${consequences.name}, 'description', ${consequences.description})`

const outgoingConnections = alias(regionConnections, "outgoing_connections")
const targetRegion = alias(regions, "target_region")
const incomingConnections = alias(regionConnections, "incoming_connections")
const sourceRegion = alias(regions, "source_region")

export const regionSearchDataView = pgView("region_search_data_view").as((qb) =>
	qb
		.select({
			id: regions.id,
			sourceTable: sql<string>`'regions'`.as("source_table"),
			entityMain: sql`to_jsonb(${regions}.*)`.as("entity_main"),
			outgoingRelations: jsonAgg(
				jsonObject([
					sql`'connection', to_jsonb(${outgoingConnections}.*)`,
					sql`'targetRegion', ${entityJson(targetRegion)}`,
				]),
				outgoingConnections.id,
			).as("outgoing_relations"),
			incomingRelations: jsonAgg(
				jsonObject([
					sql`'connection', to_jsonb(${incomingConnections}.*)`,
					sql`'sourceRegion', ${entityJson(sourceRegion)}`,
				]),
				incomingConnections.id,
			).as("incoming_relations"),
			areas: jsonAgg(
				sql`jsonb_build_object('id', ${areas.id}, 'name', ${areas.name}, 'description', ${areas.description})`,
				areas.id,
			).as("areas"),
			conflicts: jsonAgg(entityJson(conflicts), conflicts.id).as("conflicts"),
			consequences: jsonAgg(consequenceJson, consequences.id).as("consequences"),
			factionInfluence: jsonAgg(sql`to_jsonb(${factionInfluence}.*)`, factionInfluence.id).as("faction_influence"),
			loreLinks: jsonAgg(
				sql`jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})`,
				loreLinks.id,
			).as("lore_links"),
		})
		.from(regions)
		.leftJoin(outgoingConnections, eq(outgoingConnections.sourceRegionId, regions.id))
		.leftJoin(targetRegion, eq(outgoingConnections.targetRegionId, targetRegion.id))
		.leftJoin(incomingConnections, eq(incomingConnections.targetRegionId, regions.id))
		.leftJoin(sourceRegion, eq(incomingConnections.sourceRegionId, sourceRegion.id))
		.leftJoin(areas, eq(areas.regionId, regions.id))
		.leftJoin(conflicts, eq(conflicts.regionId, regions.id))
		.leftJoin(consequences, eq(consequences.affectedRegionId, regions.id))
		.leftJoin(factionInfluence, eq(factionInfluence.regionId, regions.id))
		.leftJoin(loreLinks, eq(loreLinks.regionId, regions.id))
		.groupBy(regions.id),
)

export const areaSearchDataView = pgView("area_search_data_view").as((qb) =>
	qb
		.select({
			id: areas.id,
			sourceTable: sql<string>`'areas'`.as("source_table"),
			entityMain: sql`to_jsonb(${areas}.*)`.as("entity_main"),
			region: entityJson(regions).as("region"),
			sites: jsonAgg(
				sql`jsonb_build_object('id', ${sites.id}, 'name', ${sites.name}, 'description', ${sites.description})`,
				sites.id,
			).as("sites"),
			consequences: jsonAgg(consequenceJson, consequences.id).as("consequences"),
			factionInfluence: jsonAgg(sql`to_jsonb(${factionInfluence}.*)`, factionInfluence.id).as("faction_influence"),
		})
		.from(areas)
		.innerJoin(regions, eq(areas.regionId, regions.id))
		.leftJoin(sites, eq(sites.areaId, areas.id))
		.leftJoin(consequences, eq(consequences.affectedAreaId, areas.id))
		.leftJoin(factionInfluence, eq(factionInfluence.areaId, areas.id))
		.groupBy(areas.id, regions.id),
)

const outgoingLinks = alias(siteLinks, "outgoing_links")
const targetSite = alias(sites, "target_site")
const incomingLinks = alias(siteLinks, "incoming_links")
const sourceSite = alias(sites, "source_site")
const stageQuest = alias(quests, "stage_quest")
const hookQuest = alias(quests, "hook_quest")
const outgoingForeshadowing = alias(foreshadowing, "outgoing_foreshadowing")
const incomingForeshadowing = alias(foreshadowing, "incoming_foreshadowing")

export const siteSearchDataView = pgView("site_search_data_view").as((qb) =>
	qb
		.select({
			id: sites.id,
			sourceTable: sql<string>`'sites'`.as("source_table"),
			entityMain: sql`to_jsonb(${sites}.*)`.as("entity_main"),
			area: sql`jsonb_build_object('id', ${areas.id}, 'name', ${areas.name}, 'region', ${entityJson(regions)})`.as("area"),
			outgoingRelations: jsonAgg(
				jsonObject([sql`'link', to_jsonb(${outgoingLinks}.*)`, sql`'targetSite', ${entityJson(targetSite)}`]),
				outgoingLinks.id,
			).as("outgoing_relations"),
			incomingRelations: jsonAgg(
				jsonObject([sql`'link', to_jsonb(${incomingLinks}.*)`, sql`'sourceSite', ${entityJson(sourceSite)}`]),
				incomingLinks.id,
			).as("incoming_relations"),
			encounters: jsonAgg(sql`to_jsonb(${siteEncounters}.*)`, siteEncounters.id).as("encounters"),
			secrets: jsonAgg(sql`to_jsonb(${siteSecrets}.*)`, siteSecrets.id).as("secrets"),
			questStages: jsonAgg(
				sql`jsonb_build_object('id', ${questStages.id}, 'name', ${questStages.name}, 'quest', ${entityJson(stageQuest)})`,
				questStages.id,
			).as("quest_stages"),
			questHooks: jsonAgg(
				sql`jsonb_build_object('id', ${questHooks.id}, 'source', ${questHooks.source}, 'hook_content', ${questHooks.hookContent}, 'quest', ${entityJson(hookQuest)})`,
				questHooks.id,
			).as("quest_hooks"),
			consequences: jsonAgg(consequenceJson, consequences.id).as("consequences"),
			factionHqs: jsonAgg(entityJson(factions), factions.id).as("faction_hqs"),
			factionInfluence: jsonAgg(sql`to_jsonb(${factionInfluence}.*)`, factionInfluence.id).as("faction_influence"),
			outgoingForeshadowing: jsonAgg(sql`to_jsonb(${outgoingForeshadowing}.*)`, outgoingForeshadowing.id).as(
				"outgoing_foreshadowing",
			),
			incomingForeshadowing: jsonAgg(sql`to_jsonb(${incomingForeshadowing}.*)`, incomingForeshadowing.id).as(
				"incoming_foreshadowing",
			),
			itemRelations: jsonAgg(sql`to_jsonb(${itemConnections}.*)`, itemConnections.id).as("item_relations"),
			mapGroup: entityJsonWhen(sites.mapGroupId, mapGroups).as("map_group"),
		})
		.from(sites)
		.innerJoin(areas, eq(sites.areaId, areas.id))
		.innerJoin(regions, eq(areas.regionId, regions.id))
		.leftJoin(outgoingLinks, eq(outgoingLinks.sourceSiteId, sites.id))
		.leftJoin(targetSite, eq(outgoingLinks.targetSiteId, targetSite.id))
		.leftJoin(incomingLinks, eq(incomingLinks.targetSiteId, sites.id))
		.leftJoin(sourceSite, eq(incomingLinks.sourceSiteId, sourceSite.id))
		.leftJoin(siteEncounters, eq(siteEncounters.siteId, sites.id))
		.leftJoin(siteSecrets, eq(siteSecrets.siteId, sites.id))
		.leftJoin(questStages, eq(questStages.siteId, sites.id))
		.leftJoin(stageQuest, eq(questStages.questId, stageQuest.id))
		.leftJoin(questHooks, eq(questHooks.siteId, sites.id))
		.leftJoin(hookQuest, eq(questHooks.questId, hookQuest.id))
		.leftJoin(consequences, eq(consequences.affectedSiteId, sites.id))
		.leftJoin(factions, eq(factions.hqSiteId, sites.id))
		.leftJoin(factionInfluence, eq(factionInfluence.siteId, sites.id))
		.leftJoin(outgoingForeshadowing, eq(outgoingForeshadowing.sourceSiteId, sites.id))
		.leftJoin(incomingForeshadowing, eq(incomingForeshadowing.targetSiteId, sites.id))
		.leftJoin(itemConnections, eq(itemConnections.connectedSiteId, sites.id))
		.leftJoin(mapGroups, eq(sites.mapGroupId, mapGroups.id))
		.groupBy(sites.id, areas.id, regions.id, mapGroups.id),
)

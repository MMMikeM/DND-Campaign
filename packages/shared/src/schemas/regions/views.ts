import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factionInfluence, factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { mapGroups } from "../maps/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { npcSiteAssociations, npcs } from "../npcs/tables"
import { questHooks, quests } from "../quests/tables"
import { questStages } from "../stages/tables"
import { areas, regionConnections, regions, siteEncounters, siteLinks, siteSecrets, sites } from "./tables"

export const regionSearchDataView = pgView("region_search_data_view").as((qb) =>
	qb
		.select({
			id: regions.id,
			sourceTable: sql<string>`'regions'`.as("source_table"),
			entityMain: sql`to_jsonb(${regions}.*)`.as("entity_main"),
			outgoingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc_out.*), 'targetRegion', jsonb_build_object('id', tr.id, 'name', tr.name))) FILTER (WHERE rc_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_relations",
				),
			incomingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc_in.*), 'sourceRegion', jsonb_build_object('id', sr.id, 'name', sr.name))) FILTER (WHERE rc_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_relations",
				),
			areas:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${areas.id}, 'name', ${areas.name}, 'description', ${areas.description})) FILTER (WHERE ${areas.id} IS NOT NULL), '[]'::jsonb)`.as(
					"areas",
				),
			quests:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${quests.id}, 'name', ${quests.name})) FILTER (WHERE ${quests.id} IS NOT NULL), '[]'::jsonb)`.as(
					"quests",
				),
			conflicts:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${conflicts.id}, 'name', ${conflicts.name})) FILTER (WHERE ${conflicts.id} IS NOT NULL), '[]'::jsonb)`.as(
					"conflicts",
				),
			consequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${consequences.id}, 'description', ${consequences.description})) FILTER (WHERE ${consequences.id} IS NOT NULL), '[]'::jsonb)`.as(
					"consequences",
				),
			narrativeDestinations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${narrativeDestinations.id}, 'name', ${narrativeDestinations.name})) FILTER (WHERE ${narrativeDestinations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"narrative_destinations",
				),
			factionInfluence:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${factionInfluence}.*)) FILTER (WHERE ${factionInfluence.id} IS NOT NULL), '[]'::jsonb)`.as(
					"faction_influence",
				),
			loreLinks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"lore_links",
				),
		})
		.from(regions)
		.leftJoin(sql`${regionConnections} AS rc_out`, sql`rc_out.source_region_id = ${regions.id}`)
		.leftJoin(sql`${regions} AS tr`, sql`rc_out.target_region_id = tr.id`)
		.leftJoin(sql`${regionConnections} AS rc_in`, sql`rc_in.target_region_id = ${regions.id}`)
		.leftJoin(sql`${regions} AS sr`, sql`rc_in.source_region_id = sr.id`)
		.leftJoin(areas, sql`${areas.regionId} = ${regions.id}`)
		.leftJoin(quests, sql`${quests.regionId} = ${regions.id}`)
		.leftJoin(conflicts, sql`${conflicts.regionId} = ${regions.id}`)
		.leftJoin(consequences, sql`${consequences.affectedRegionId} = ${regions.id}`)
		.leftJoin(narrativeDestinations, sql`${narrativeDestinations.regionId} = ${regions.id}`)
		.leftJoin(factionInfluence, sql`${factionInfluence.regionId} = ${regions.id}`)
		.leftJoin(loreLinks, sql`${loreLinks.regionId} = ${regions.id}`)
		.groupBy(regions.id),
)

export const areaSearchDataView = pgView("area_search_data_view").as((qb) =>
	qb
		.select({
			id: areas.id,
			sourceTable: sql<string>`'areas'`.as("source_table"),
			entityMain: sql`to_jsonb(${areas}.*)`.as("entity_main"),
			region: sql`COALESCE(jsonb_build_object('id', ${regions.id}, 'name', ${regions.name}), '{}'::jsonb)`.as("region"),
			sites:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${sites.id}, 'name', ${sites.name}, 'description', ${sites.description})) FILTER (WHERE ${sites.id} IS NOT NULL), '[]'::jsonb)`.as(
					"sites",
				),
			consequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${consequences.id}, 'description', ${consequences.description})) FILTER (WHERE ${consequences.id} IS NOT NULL), '[]'::jsonb)`.as(
					"consequences",
				),
			factionInfluence:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${factionInfluence}.*)) FILTER (WHERE ${factionInfluence.id} IS NOT NULL), '[]'::jsonb)`.as(
					"faction_influence",
				),
		})
		.from(areas)
		.leftJoin(regions, sql`${areas.regionId} = ${regions.id}`)
		.leftJoin(sites, sql`${sites.areaId} = ${areas.id}`)
		.leftJoin(consequences, sql`${consequences.affectedAreaId} = ${areas.id}`)
		.leftJoin(factionInfluence, sql`${factionInfluence.areaId} = ${areas.id}`)
		.groupBy(areas.id, regions.id),
)

export const siteSearchDataView = pgView("site_search_data_view").as((qb) =>
	qb
		.select({
			id: sites.id,
			sourceTable: sql<string>`'sites'`.as("source_table"),
			entityMain: sql`to_jsonb(${sites}.*)`.as("entity_main"),
			area: sql`COALESCE(jsonb_build_object('id', ${areas.id}, 'name', ${areas.name}, 'region', jsonb_build_object('id', ${regions.id}, 'name', ${regions.name})), '{}'::jsonb)`.as(
				"area",
			),
			outgoingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_out.*), 'targetSite', jsonb_build_object('id', ts.id, 'name', ts.name))) FILTER (WHERE sl_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_relations",
				),
			incomingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_in.*), 'sourceSite', jsonb_build_object('id', ss.id, 'name', ss.name))) FILTER (WHERE sl_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_relations",
				),
			encounters:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${siteEncounters}.*)) FILTER (WHERE ${siteEncounters.id} IS NOT NULL), '[]'::jsonb)`.as(
					"encounters",
				),
			secrets:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${siteSecrets}.*)) FILTER (WHERE ${siteSecrets.id} IS NOT NULL), '[]'::jsonb)`.as(
					"secrets",
				),
			npcAssociations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb(${npcSiteAssociations}.*), 'npc', jsonb_build_object('id', ${npcs.id}, 'name', ${npcs.name}))) FILTER (WHERE ${npcSiteAssociations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"npc_associations",
				),
			questStages:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${questStages.id}, 'name', ${questStages.name}, 'quest', jsonb_build_object('id', qs_quest.id, 'name', qs_quest.name))) FILTER (WHERE ${questStages.id} IS NOT NULL), '[]'::jsonb)`.as(
					"quest_stages",
				),
			questHooks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${questHooks.id}, 'source', ${questHooks.source}, 'hook_content', ${questHooks.hookContent}, 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE ${questHooks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"quest_hooks",
				),
			consequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', site_consequences.id, 'description', site_consequences.description)) FILTER (WHERE site_consequences.id IS NOT NULL), '[]'::jsonb)`.as(
					"consequences",
				),
			factionHqs:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${factions.id}, 'name', ${factions.name})) FILTER (WHERE ${factions.id} IS NOT NULL), '[]'::jsonb)`.as(
					"faction_hqs",
				),
			factionInfluence:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(site_faction_influence.*)) FILTER (WHERE site_faction_influence.id IS NOT NULL), '[]'::jsonb)`.as(
					"faction_influence",
				),
			outgoingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_foreshadowing",
				),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
			itemHistory:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemNotableHistory}.*)) FILTER (WHERE ${itemNotableHistory.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_history",
				),
			itemRelations:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(site_item_relations.*)) FILTER (WHERE site_item_relations.id IS NOT NULL), '[]'::jsonb)`.as(
					"item_relations",
				),
			mapGroup: sql`COALESCE(jsonb_build_object('id', ${mapGroups.id}, 'name', ${mapGroups.name}), '{}'::jsonb)`.as(
				"map_group",
			),
		})
		.from(sites)
		.leftJoin(areas, sql`${sites.areaId} = ${areas.id}`)
		.leftJoin(regions, sql`${areas.regionId} = ${regions.id}`)
		.leftJoin(sql`${siteLinks} AS sl_out`, sql`sl_out.source_site_id = ${sites.id}`)
		.leftJoin(sql`${siteLinks} AS sl_in`, sql`sl_in.target_site_id = ${sites.id}`)
		.leftJoin(sql`${sites} AS ts`, sql`sl_out.target_site_id = ts.id`)
		.leftJoin(sql`${sites} AS ss`, sql`sl_in.source_site_id = ss.id`)
		.leftJoin(siteEncounters, sql`${siteEncounters.siteId} = ${sites.id}`)
		.leftJoin(siteSecrets, sql`${siteSecrets.siteId} = ${sites.id}`)
		.leftJoin(npcSiteAssociations, sql`${npcSiteAssociations.siteId} = ${sites.id}`)
		.leftJoin(npcs, sql`${npcSiteAssociations.npcId} = ${npcs.id}`)
		.leftJoin(questStages, sql`${questStages.siteId} = ${sites.id}`)
		.leftJoin(sql`${quests} AS qs_quest`, sql`${questStages.questId} = qs_quest.id`)
		.leftJoin(questHooks, sql`${questHooks.siteId} = ${sites.id}`)
		.leftJoin(sql`${quests} AS qh_quest`, sql`${questHooks.questId} = qh_quest.id`)
		.leftJoin(sql`${consequences} AS site_consequences`, sql`site_consequences.affected_site_id = ${sites.id}`)
		.leftJoin(factions, sql`${factions.hqSiteId} = ${sites.id}`)
		.leftJoin(sql`${factionInfluence} AS site_faction_influence`, sql`site_faction_influence.site_id = ${sites.id}`)
		.leftJoin(sql`${foreshadowing} AS fs_out`, sql`fs_out.source_site_id = ${sites.id}`)
		.leftJoin(sql`${foreshadowing} AS fs_in`, sql`fs_in.target_site_id = ${sites.id}`)
		.leftJoin(itemNotableHistory, sql`${itemNotableHistory.locationSiteId} = ${sites.id}`)
		.leftJoin(sql`${itemRelations} AS site_item_relations`, sql`site_item_relations.site_id = ${sites.id}`)
		.leftJoin(mapGroups, sql`${sites.mapGroupId} = ${mapGroups.id}`)
		.groupBy(sites.id, areas.id, regions.id, mapGroups.id),
)

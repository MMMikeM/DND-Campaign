CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "conflict_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"conflict_id" integer NOT NULL,
	"npc_id" integer,
	"faction_id" integer,
	"role" text NOT NULL,
	"motivation" text NOT NULL,
	"public_stance" text NOT NULL,
	"secret_stance" text,
	CONSTRAINT "npc_or_faction_participant_exclusive" CHECK (("conflict_participants"."npc_id" IS NOT NULL AND "conflict_participants"."faction_id" IS NULL) OR ("conflict_participants"."npc_id" IS NULL AND "conflict_participants"."faction_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "major_conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"primary_region_id" integer,
	"name" text NOT NULL,
	"scope" text NOT NULL,
	"natures" text[] NOT NULL,
	"status" text NOT NULL,
	"cause" text NOT NULL,
	"stakes" text[] NOT NULL,
	"moral_dilemma" text NOT NULL,
	"possible_outcomes" text[] NOT NULL,
	"hidden_truths" text[] NOT NULL,
	"clarity_of_right_wrong" text NOT NULL,
	"tension_level" text NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "major_conflicts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" vector(3072) NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consequences" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"consequence_type" text NOT NULL,
	"severity" text NOT NULL,
	"visibility" text NOT NULL,
	"timeframe" text NOT NULL,
	"source_type" text NOT NULL,
	"player_impact_feel" text NOT NULL,
	"trigger_decision_id" integer,
	"trigger_quest_id" integer,
	"trigger_conflict_id" integer,
	"affected_faction_id" integer,
	"affected_region_id" integer,
	"affected_area_id" integer,
	"affected_site_id" integer,
	"affected_npc_id" integer,
	"affected_destination_id" integer,
	"affected_conflict_id" integer,
	"conflict_impact_description" text,
	"future_quest_id" integer,
	"embedding_id" integer,
	CONSTRAINT "consequences_name_unique" UNIQUE("name"),
	CONSTRAINT "chk_consequence_has_a_trigger_source" CHECK (
			"consequences"."trigger_decision_id" IS NOT NULL OR
			"consequences"."trigger_quest_id" IS NOT NULL OR
			"consequences"."trigger_conflict_id" IS NOT NULL OR
			"consequences"."source_type" IN ('world_event', 'player_choice', 'time_passage', 'quest_completion_affecting_conflict')
			),
	CONSTRAINT "chk_consequence_has_an_effect_defined" CHECK (
			"consequences"."affected_faction_id" IS NOT NULL OR
			"consequences"."affected_region_id" IS NOT NULL OR
			"consequences"."affected_area_id" IS NOT NULL OR
			"consequences"."affected_site_id" IS NOT NULL OR
			"consequences"."affected_npc_id" IS NOT NULL OR
			"consequences"."affected_destination_id" IS NOT NULL OR
			"consequences"."affected_conflict_id" IS NOT NULL OR
			"consequences"."future_quest_id" IS NOT NULL OR
			"consequences"."consequence_type" IS NOT NULL 
			),
	CONSTRAINT "chk_consequence_conflict_impact_description_if_conflict_affected" CHECK (
			("consequences"."affected_conflict_id" IS NULL) OR ("consequences"."conflict_impact_description" IS NOT NULL)
			)
);
--> statement-breakpoint
CREATE TABLE "narrative_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"event_type" text NOT NULL,
	"intended_rhythm_effect" text NOT NULL,
	"quest_stage_id" integer,
	"triggering_decision_id" integer,
	"related_quest_id" integer,
	"narrative_placement" text NOT NULL,
	"impact_severity" text NOT NULL,
	"complication_details" text,
	"escalation_details" text,
	"twist_reveal_details" text,
	"embedding_id" integer,
	CONSTRAINT "narrative_events_name_unique" UNIQUE("name"),
	CONSTRAINT "chk_event_type_details_exclusive" CHECK (
		CASE "narrative_events"."event_type"
			WHEN 'complication' THEN ("narrative_events"."complication_details" IS NOT NULL AND "narrative_events"."escalation_details" IS NULL AND "narrative_events"."twist_reveal_details" IS NULL)
			WHEN 'escalation' THEN ("narrative_events"."complication_details" IS NULL AND "narrative_events"."escalation_details" IS NOT NULL AND "narrative_events"."twist_reveal_details" IS NULL)
			WHEN 'twist' THEN ("narrative_events"."complication_details" IS NULL AND "narrative_events"."escalation_details" IS NULL AND "narrative_events"."twist_reveal_details" IS NOT NULL)
			ELSE TRUE 
		END
		)
);
--> statement-breakpoint
CREATE TABLE "faction_agendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"faction_id" integer NOT NULL,
	"name" text NOT NULL,
	"agenda_type" text NOT NULL,
	"current_stage" text NOT NULL,
	"importance" text NOT NULL,
	"ultimate_aim" text NOT NULL,
	"moral_ambiguity" text NOT NULL,
	"approach" text[] NOT NULL,
	"story_hooks" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "faction_agendas_name_unique" UNIQUE("name"),
	CONSTRAINT "faction_agendas_faction_id_name_unique" UNIQUE("faction_id","name")
);
--> statement-breakpoint
CREATE TABLE "faction_diplomacy" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"faction_id" integer NOT NULL,
	"other_faction_id" integer NOT NULL,
	"strength" text NOT NULL,
	"diplomatic_status" text NOT NULL,
	CONSTRAINT "faction_diplomacy_faction_id_other_faction_id_unique" UNIQUE("faction_id","other_faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_influence" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"faction_id" integer NOT NULL,
	"region_id" integer,
	"area_id" integer,
	"site_id" integer,
	"influence_level" text NOT NULL,
	"presence_types" text[] NOT NULL,
	"presence_details" text[] NOT NULL,
	"priorities" text[] NOT NULL,
	CONSTRAINT "region_or_area_or_site" CHECK (("faction_influence"."region_id" IS NOT NULL AND "faction_influence"."area_id" IS NULL AND "faction_influence"."site_id" IS NULL) 
			OR  ("faction_influence"."region_id" IS NULL AND "faction_influence"."area_id" IS NOT NULL AND "faction_influence"."site_id" IS NULL) 
			OR  ("faction_influence"."region_id" IS NULL AND "faction_influence"."area_id" IS NULL AND "faction_influence"."site_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"public_alignment" text NOT NULL,
	"secret_alignment" text,
	"size" text NOT NULL,
	"wealth" text NOT NULL,
	"reach" text NOT NULL,
	"type" text[] NOT NULL,
	"public_goal" text NOT NULL,
	"secret_goal" text,
	"public_perception" text NOT NULL,
	"transparency_level" text NOT NULL,
	"values" text[] NOT NULL,
	"history" text[] NOT NULL,
	"symbols" text[] NOT NULL,
	"rituals" text[] NOT NULL,
	"taboos" text[] NOT NULL,
	"aesthetics" text[] NOT NULL,
	"jargon" text[] NOT NULL,
	"recognition_signs" text[] NOT NULL,
	"primary_hq_site_id" integer,
	"embedding_id" integer,
	CONSTRAINT "factions_name_unique" UNIQUE("name"),
	CONSTRAINT "chk_faction_transparency_rules" CHECK (NOT (("factions"."transparency_level" = 'transparent') AND ("factions"."secret_alignment" IS NOT NULL OR "factions"."secret_goal" IS NOT NULL)))
);
--> statement-breakpoint
CREATE TABLE "region_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"region_id" integer NOT NULL,
	"other_region_id" integer,
	"connection_type" text NOT NULL,
	"route_type" text NOT NULL,
	"travel_difficulty" text NOT NULL,
	"travel_time" text NOT NULL,
	"controlling_faction_id" integer,
	"travel_hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	CONSTRAINT "region_connections_region_id_other_region_id_connection_type_unique" UNIQUE("region_id","other_region_id","connection_type"),
	CONSTRAINT "chk_no_self_region_connection" CHECK (COALESCE("region_connections"."region_id" != "region_connections"."other_region_id", TRUE))
);
--> statement-breakpoint
CREATE TABLE "foreshadowing_seeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"target_entity_type" text NOT NULL,
	"target_quest_id" integer,
	"target_npc_id" integer,
	"target_narrative_event_id" integer,
	"target_major_conflict_id" integer,
	"target_item_id" integer,
	"target_narrative_destination_id" integer,
	"target_world_concept_id" integer,
	"target_faction_id" integer,
	"target_site_id" integer,
	"target_abstract_detail" text,
	"suggested_delivery_methods" text[] NOT NULL,
	"subtlety" text NOT NULL,
	"narrative_weight" text NOT NULL,
	"source_quest_id" integer,
	"source_quest_stage_id" integer,
	"source_site_id" integer,
	"source_npc_id" integer,
	"embedding_id" integer,
	CONSTRAINT "chk_foreshadowing_target_exclusive_and_correct" CHECK (
		CASE "foreshadowing_seeds"."target_entity_type"
			WHEN 'quest' THEN ("foreshadowing_seeds"."target_quest_id" IS NOT NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'npc' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NOT NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'narrative_event' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NOT NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'major_conflict' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NOT NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'item' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NOT NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'narrative_destination' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NOT NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'world_concept' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NOT NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'faction' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NOT NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'site' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NOT NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NULL)
			WHEN 'abstract_theme' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NOT NULL)
			WHEN 'specific_reveal' THEN ("foreshadowing_seeds"."target_quest_id" IS NULL AND "foreshadowing_seeds"."target_npc_id" IS NULL AND "foreshadowing_seeds"."target_narrative_event_id" IS NULL AND "foreshadowing_seeds"."target_major_conflict_id" IS NULL AND "foreshadowing_seeds"."target_item_id" IS NULL AND "foreshadowing_seeds"."target_narrative_destination_id" IS NULL AND "foreshadowing_seeds"."target_world_concept_id" IS NULL AND "foreshadowing_seeds"."target_faction_id" IS NULL AND "foreshadowing_seeds"."target_site_id" IS NULL AND "foreshadowing_seeds"."target_abstract_detail" IS NOT NULL)
			ELSE FALSE
		END
		)
);
--> statement-breakpoint
CREATE TABLE "item_notable_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"item_id" integer NOT NULL,
	"event_description" text NOT NULL,
	"timeframe" text NOT NULL,
	"key_npc_id" integer,
	"npc_role_in_event" text NOT NULL,
	"event_location_site_id" integer
);
--> statement-breakpoint
CREATE TABLE "item_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_item_id" integer NOT NULL,
	"target_entity_type" text NOT NULL,
	"target_item_id" integer,
	"target_npc_id" integer,
	"target_faction_id" integer,
	"target_site_id" integer,
	"target_quest_id" integer,
	"target_conflict_id" integer,
	"target_narrative_destination_id" integer,
	"target_world_concept_id" integer,
	"relationship_type" text NOT NULL,
	"relationship_details" text,
	CONSTRAINT "item_relationships_source_item_id_target_entity_type_target_item_id_target_npc_id_target_faction_id_target_site_id_target_quest_id_target_conflict_id_target_narrative_destination_id_target_world_concept_id_relationship_type_unique" UNIQUE("source_item_id","target_entity_type","target_item_id","target_npc_id","target_faction_id","target_site_id","target_quest_id","target_conflict_id","target_narrative_destination_id","target_world_concept_id","relationship_type"),
	CONSTRAINT "single_related_entity_exclusive_and_correct" CHECK (
			CASE "item_relationships"."target_entity_type"
				WHEN 'item' THEN ("item_relationships"."target_item_id" IS NOT NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'npc' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NOT NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'faction' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NOT NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'site' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NOT NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'quest' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NOT NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'conflict' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NOT NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'narrative_destination' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NOT NULL AND "item_relationships"."target_world_concept_id" IS NULL)
				WHEN 'world_concept' THEN ("item_relationships"."target_item_id" IS NULL AND "item_relationships"."target_npc_id" IS NULL AND "item_relationships"."target_faction_id" IS NULL AND "item_relationships"."target_site_id" IS NULL AND "item_relationships"."target_quest_id" IS NULL AND "item_relationships"."target_conflict_id" IS NULL AND "item_relationships"."target_narrative_destination_id" IS NULL AND "item_relationships"."target_world_concept_id" IS NOT NULL)
				ELSE FALSE
			END
			)
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"item_type" text NOT NULL,
	"rarity" text NOT NULL,
	"narrative_role" text NOT NULL,
	"perceived_simplicity" text NOT NULL,
	"significance" text NOT NULL,
	"lore_significance" text NOT NULL,
	"mechanical_effects" text[] NOT NULL,
	"creation_period" text,
	"place_of_origin" text,
	"related_quest_id" integer,
	"embedding_id" integer,
	CONSTRAINT "items_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "destination_participant_involvement" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"destination_id" integer NOT NULL,
	"npc_id" integer,
	"faction_id" integer,
	"role_in_arc" text NOT NULL,
	"arc_importance" text NOT NULL,
	"involvement_details" text[] NOT NULL,
	CONSTRAINT "npc_or_faction_exclusive_participant" CHECK (("destination_participant_involvement"."npc_id" IS NOT NULL AND "destination_participant_involvement"."faction_id" IS NULL)
			 OR ("destination_participant_involvement"."npc_id" IS NULL AND "destination_participant_involvement"."faction_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "destination_quest_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"destination_id" integer NOT NULL,
	"quest_id" integer NOT NULL,
	"role" text NOT NULL,
	"sequence_in_arc" integer,
	"contribution_details" text[] NOT NULL,
	CONSTRAINT "destination_quest_roles_destination_id_quest_id_unique" UNIQUE("destination_id","quest_id")
);
--> statement-breakpoint
CREATE TABLE "destination_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_destination_id" integer NOT NULL,
	"related_destination_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"relationship_details" text[] NOT NULL,
	CONSTRAINT "destination_relationships_source_destination_id_related_destination_id_unique" UNIQUE("source_destination_id","related_destination_id"),
	CONSTRAINT "chk_no_self_destination_relationship" CHECK ("destination_relationships"."source_destination_id" != "destination_relationships"."related_destination_id")
);
--> statement-breakpoint
CREATE TABLE "narrative_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"promise" text NOT NULL,
	"payoff" text NOT NULL,
	"themes" text[] NOT NULL,
	"foreshadowing_elements" text[] NOT NULL,
	"intended_emotional_arc" text NOT NULL,
	"primary_region_id" integer,
	"related_conflict_id" integer,
	"embedding_id" integer,
	CONSTRAINT "narrative_destinations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "npc_factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer NOT NULL,
	"faction_id" integer NOT NULL,
	"loyalty" text NOT NULL,
	"justification" text NOT NULL,
	"role" text NOT NULL,
	"rank" text NOT NULL,
	"secrets" text[] NOT NULL,
	CONSTRAINT "npc_factions_npc_id_faction_id_unique" UNIQUE("npc_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "npc_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer NOT NULL,
	"related_npc_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"strength" text NOT NULL,
	"history" text[] NOT NULL,
	"narrative_tensions" text[] NOT NULL,
	"shared_goals" text[] NOT NULL,
	"relationship_dynamics" text[] NOT NULL,
	"is_bidirectional" boolean DEFAULT false NOT NULL,
	CONSTRAINT "npc_relationships_npc_id_related_npc_id_relationship_type_unique" UNIQUE("npc_id","related_npc_id","relationship_type"),
	CONSTRAINT "no_self_relationship" CHECK ("npc_relationships"."npc_id" != "npc_relationships"."related_npc_id")
);
--> statement-breakpoint
CREATE TABLE "npc_sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer NOT NULL,
	"site_id" integer NOT NULL,
	"association_type" text NOT NULL,
	CONSTRAINT "npc_sites_npc_id_site_id_association_type_unique" UNIQUE("npc_id","site_id","association_type")
);
--> statement-breakpoint
CREATE TABLE "npcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"alignment" text NOT NULL,
	"disposition" text NOT NULL,
	"gender" text NOT NULL,
	"race" text NOT NULL,
	"trust_level" text NOT NULL,
	"wealth" text NOT NULL,
	"adaptability" text NOT NULL,
	"complexity_profile" text NOT NULL,
	"player_perception_goal" text NOT NULL,
	"age" text NOT NULL,
	"attitude" text NOT NULL,
	"occupation" text NOT NULL,
	"quirk" text NOT NULL,
	"social_status" text NOT NULL,
	"availability" text NOT NULL,
	"current_site_id" integer,
	"current_goals" text[] NOT NULL,
	"appearance" text[] NOT NULL,
	"avoid_topics" text[] NOT NULL,
	"background" text[] NOT NULL,
	"biases" text[] NOT NULL,
	"dialogue" text[] NOT NULL,
	"drives" text[] NOT NULL,
	"fears" text[] NOT NULL,
	"knowledge" text[] NOT NULL,
	"mannerisms" text[] NOT NULL,
	"personality_traits" text[] NOT NULL,
	"preferred_topics" text[] NOT NULL,
	"rumours" text[] NOT NULL,
	"secrets" text[] NOT NULL,
	"voice_notes" text[] NOT NULL,
	"capability" text NOT NULL,
	"proactivity" text NOT NULL,
	"relatability" text NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "npcs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "quest_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"site_id" integer,
	"stage_order" integer NOT NULL,
	"name" text NOT NULL,
	"dramatic_question" text NOT NULL,
	"stage_type" text NOT NULL,
	"intended_complexity_level" text NOT NULL,
	"objectives" text[] NOT NULL,
	"completion_paths" text[] NOT NULL,
	"encounters" text[] NOT NULL,
	"dramatic_moments" text[] NOT NULL,
	"sensory_elements" text[] NOT NULL,
	"stage_importance" text NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "quest_stages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "stage_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"from_stage_id" integer NOT NULL,
	"to_stage_id" integer,
	"condition_type" text NOT NULL,
	"decision_type" text NOT NULL,
	"name" text NOT NULL,
	"ambiguity_level" text NOT NULL,
	"condition_value" text NOT NULL,
	"success_description" text[] NOT NULL,
	"failure_description" text[] NOT NULL,
	"narrative_transition" text[] NOT NULL,
	"potential_player_reactions" text[] NOT NULL,
	"options" text[] NOT NULL,
	"failure_leads_to_retry" boolean DEFAULT false NOT NULL,
	"failure_lesson_learned" text,
	CONSTRAINT "stage_decisions_quest_id_from_stage_id_to_stage_id_unique" UNIQUE("quest_id","from_stage_id","to_stage_id"),
	CONSTRAINT "chk_stage_decision_no_self_loop" CHECK (COALESCE("stage_decisions"."from_stage_id" != "stage_decisions"."to_stage_id", TRUE)),
	CONSTRAINT "chk_failure_retry_lesson" CHECK (("stage_decisions"."failure_leads_to_retry" = FALSE) OR ("stage_decisions"."failure_lesson_learned" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "quest_hooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"site_id" integer,
	"faction_id" integer,
	"source" text NOT NULL,
	"hook_type" text NOT NULL,
	"presentation_style" text NOT NULL,
	"hook_content" text[] NOT NULL,
	"discovery_conditions" text[] NOT NULL,
	"delivery_npc_id" integer,
	"npc_relationship_to_party" text NOT NULL,
	"trust_required" text NOT NULL,
	"dialogue_hint" text NOT NULL,
	CONSTRAINT "quest_hooks_quest_id_source_hook_type_unique" UNIQUE("quest_id","source","hook_type")
);
--> statement-breakpoint
CREATE TABLE "quest_participant_involvement" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"npc_id" integer,
	"faction_id" integer,
	"role_in_quest" text NOT NULL,
	"importance_in_quest" text NOT NULL,
	"involvement_details" text[] NOT NULL,
	CONSTRAINT "chk_quest_participant_exclusive" CHECK (
		("quest_participant_involvement"."npc_id" IS NOT NULL AND "quest_participant_involvement"."faction_id" IS NULL) OR
		("quest_participant_involvement"."npc_id" IS NULL AND "quest_participant_involvement"."faction_id" IS NOT NULL)
		)
);
--> statement-breakpoint
CREATE TABLE "quest_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"related_quest_id" integer,
	"relationship_type" text NOT NULL,
	CONSTRAINT "quest_relationships_quest_id_related_quest_id_unique" UNIQUE("quest_id","related_quest_id")
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"region_id" integer,
	"type" text NOT NULL,
	"urgency" text NOT NULL,
	"visibility" text NOT NULL,
	"mood" text NOT NULL,
	"moral_spectrum_focus" text NOT NULL,
	"intended_pacing_role" text NOT NULL,
	"primary_player_experience_goal" text NOT NULL,
	"failure_outcomes" text[] NOT NULL,
	"success_outcomes" text[] NOT NULL,
	"objectives" text[] NOT NULL,
	"rewards" text[] NOT NULL,
	"themes" text[] NOT NULL,
	"inspirations" text[] NOT NULL,
	"parent_id" integer,
	"other_unlock_conditions_notes" text,
	"embedding_id" integer,
	CONSTRAINT "quests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"region_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"danger_level" text NOT NULL,
	"atmosphere_type" text NOT NULL,
	"revelation_layers_summary" text[] NOT NULL,
	"leadership" text NOT NULL,
	"population" text NOT NULL,
	"primary_activity" text NOT NULL,
	"cultural_notes" text[] NOT NULL,
	"hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	"rumors" text[] NOT NULL,
	"defenses" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"danger_level" text NOT NULL,
	"type" text NOT NULL,
	"atmosphere_type" text NOT NULL,
	"revelation_layers_summary" text[] NOT NULL,
	"economy" text NOT NULL,
	"history" text NOT NULL,
	"population" text NOT NULL,
	"cultural_notes" text[] NOT NULL,
	"hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	"rumors" text[] NOT NULL,
	"secrets" text[] NOT NULL,
	"defenses" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "regions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "site_encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"site_id" integer NOT NULL,
	"encounter_vibe" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"objective_type" text NOT NULL,
	"objective_details" text,
	"has_timer" boolean DEFAULT false NOT NULL,
	"timer_value" integer,
	"timer_unit" text,
	"timer_consequence" text,
	"core_enemy_groups" text[] NOT NULL,
	"synergy_description" text,
	"encounter_category" text NOT NULL,
	"recommended_proficiency_bonus" integer,
	"special_variations" text[] NOT NULL,
	"non_combat_options" text[] NOT NULL,
	"encounter_specific_environment_notes" text,
	"interactive_elements" text[] NOT NULL,
	"treasure_or_rewards" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "site_encounters_site_id_name_unique" UNIQUE("site_id","name"),
	CONSTRAINT "chk_timer_details_if_has_timer" CHECK (NOT "site_encounters"."has_timer" OR ("site_encounters"."timer_value" IS NOT NULL AND "site_encounters"."timer_unit" IS NOT NULL)),
	CONSTRAINT "chk_no_timer_details_if_no_timer" CHECK ("site_encounters"."has_timer" OR ("site_encounters"."timer_value" IS NULL AND "site_encounters"."timer_unit" IS NULL AND "site_encounters"."timer_consequence" IS NULL)),
	CONSTRAINT "chk_objective_details_for_non_deathmatch" CHECK ("site_encounters"."objective_type" = 'DEATHMATCH' OR "site_encounters"."objective_details" IS NOT NULL),
	CONSTRAINT "chk_proficiency_bonus_range" CHECK ("site_encounters"."recommended_proficiency_bonus" IS NULL OR ("site_encounters"."recommended_proficiency_bonus" >= 2 AND "site_encounters"."recommended_proficiency_bonus" <= 6))
);
--> statement-breakpoint
CREATE TABLE "site_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"site_id" integer NOT NULL,
	"other_site_id" integer,
	"link_type" text NOT NULL,
	CONSTRAINT "site_links_site_id_other_site_id_link_type_unique" UNIQUE("site_id","other_site_id","link_type"),
	CONSTRAINT "chk_no_self_site_link" CHECK (COALESCE("site_links"."site_id" != "site_links"."other_site_id", TRUE))
);
--> statement-breakpoint
CREATE TABLE "site_secrets" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"site_id" integer NOT NULL,
	"secret_type" text NOT NULL,
	"difficulty" text NOT NULL,
	"discovery_method" text[] NOT NULL,
	"consequences" text[] NOT NULL,
	"embedding_id" integer
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"area_id" integer NOT NULL,
	"site_type" text NOT NULL,
	"intended_site_function" text NOT NULL,
	"name" text NOT NULL,
	"terrain" text NOT NULL,
	"climate" text NOT NULL,
	"mood" text NOT NULL,
	"environment" text NOT NULL,
	"creatures" text[] NOT NULL,
	"features" text[] NOT NULL,
	"treasures" text[] NOT NULL,
	"lighting_description" text[] NOT NULL,
	"soundscape" text[] NOT NULL,
	"smells" text[] NOT NULL,
	"weather" text[] NOT NULL,
	"descriptors" text[] NOT NULL,
	"cover_options" text[] NOT NULL,
	"elevation_features" text[] NOT NULL,
	"movement_routes" text[] NOT NULL,
	"difficult_terrain" text[] NOT NULL,
	"choke_points" text[] NOT NULL,
	"sight_lines" text[] NOT NULL,
	"tactical_positions" text[] NOT NULL,
	"interactive_elements" text[] NOT NULL,
	"environmental_hazards" text[] NOT NULL,
	"battlemap_image" "bytea",
	"image_format" text NOT NULL,
	"image_size" integer,
	"image_width" integer,
	"image_height" integer,
	"embedding_id" integer,
	CONSTRAINT "sites_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "concept_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_concept_id" integer NOT NULL,
	"target_concept_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"relationship_details" text,
	"strength" text NOT NULL,
	"is_bidirectional" boolean,
	CONSTRAINT "concept_relationships_source_concept_id_target_concept_id_relationship_type_unique" UNIQUE("source_concept_id","target_concept_id","relationship_type"),
	CONSTRAINT "no_self_relationship" CHECK ("concept_relationships"."source_concept_id" != "concept_relationships"."target_concept_id")
);
--> statement-breakpoint
CREATE TABLE "world_concept_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"concept_id" integer NOT NULL,
	"region_id" integer,
	"faction_id" integer,
	"npc_id" integer,
	"conflict_id" integer,
	"quest_id" integer,
	"link_role_or_type_text" text NOT NULL,
	"link_strength" text NOT NULL,
	"link_details_text" text NOT NULL,
	CONSTRAINT "chk_world_concept_link_has_target" CHECK (
			"world_concept_links"."region_id" IS NOT NULL OR
			"world_concept_links"."faction_id" IS NOT NULL OR
			"world_concept_links"."npc_id" IS NOT NULL OR
			"world_concept_links"."conflict_id" IS NOT NULL OR
			"world_concept_links"."quest_id" IS NOT NULL
		)
);
--> statement-breakpoint
CREATE TABLE "world_concepts" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"name" text NOT NULL,
	"concept_type" text NOT NULL,
	"complexity_profile" text NOT NULL,
	"moral_clarity" text NOT NULL,
	"summary" text NOT NULL,
	"surface_impression" text,
	"lived_reality_details" text,
	"hidden_truths_or_depths" text,
	"additional_details" text[] NOT NULL,
	"social_structure" text,
	"core_values" text[] NOT NULL,
	"traditions" text[] NOT NULL,
	"languages" text[] NOT NULL,
	"adaptation_strategies" text[] NOT NULL,
	"defining_characteristics" text[] NOT NULL,
	"major_events" text[] NOT NULL,
	"lasting_institutions" text[] NOT NULL,
	"conflicting_narratives" text[] NOT NULL,
	"historical_grievances" text[] NOT NULL,
	"ending_causes" text[] NOT NULL,
	"historical_lessons" text[] NOT NULL,
	"purpose" text,
	"structure" text,
	"membership" text[] NOT NULL,
	"rules" text[] NOT NULL,
	"modern_adaptations" text[] NOT NULL,
	"current_effectiveness" text NOT NULL,
	"institutional_challenges" text[] NOT NULL,
	"cultural_evolution" text[] NOT NULL,
	"scope" text NOT NULL,
	"status" text NOT NULL,
	"timeframe" text NOT NULL,
	"start_year" integer,
	"end_year" integer,
	"modern_relevance" text NOT NULL,
	"current_challenges" text[] NOT NULL,
	"modern_consequences" text[] NOT NULL,
	"quest_hooks" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "world_concepts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_conflicts" ADD CONSTRAINT "major_conflicts_primary_region_id_regions_id_fk" FOREIGN KEY ("primary_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_conflicts" ADD CONSTRAINT "major_conflicts_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_trigger_decision_id_stage_decisions_id_fk" FOREIGN KEY ("trigger_decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_trigger_quest_id_quests_id_fk" FOREIGN KEY ("trigger_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_trigger_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("trigger_conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_faction_id_factions_id_fk" FOREIGN KEY ("affected_faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_region_id_regions_id_fk" FOREIGN KEY ("affected_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_area_id_areas_id_fk" FOREIGN KEY ("affected_area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_site_id_sites_id_fk" FOREIGN KEY ("affected_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_npc_id_npcs_id_fk" FOREIGN KEY ("affected_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("affected_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_affected_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("affected_conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_future_quest_id_quests_id_fk" FOREIGN KEY ("future_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_triggering_decision_id_stage_decisions_id_fk" FOREIGN KEY ("triggering_decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_agendas" ADD CONSTRAINT "faction_agendas_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_agendas" ADD CONSTRAINT "faction_agendas_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_other_faction_id_factions_id_fk" FOREIGN KEY ("other_faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factions" ADD CONSTRAINT "factions_primary_hq_site_id_sites_id_fk" FOREIGN KEY ("primary_hq_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factions" ADD CONSTRAINT "factions_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_other_region_id_regions_id_fk" FOREIGN KEY ("other_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_controlling_faction_id_factions_id_fk" FOREIGN KEY ("controlling_faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_quest_id_quests_id_fk" FOREIGN KEY ("target_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_npc_id_npcs_id_fk" FOREIGN KEY ("target_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_narrative_event_id_narrative_events_id_fk" FOREIGN KEY ("target_narrative_event_id") REFERENCES "public"."narrative_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_major_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("target_major_conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_item_id_items_id_fk" FOREIGN KEY ("target_item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("target_narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_world_concept_id_world_concepts_id_fk" FOREIGN KEY ("target_world_concept_id") REFERENCES "public"."world_concepts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_faction_id_factions_id_fk" FOREIGN KEY ("target_faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_target_site_id_sites_id_fk" FOREIGN KEY ("target_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_source_quest_id_quests_id_fk" FOREIGN KEY ("source_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_source_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("source_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_source_site_id_sites_id_fk" FOREIGN KEY ("source_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_source_npc_id_npcs_id_fk" FOREIGN KEY ("source_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foreshadowing_seeds" ADD CONSTRAINT "foreshadowing_seeds_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_notable_history" ADD CONSTRAINT "item_notable_history_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_notable_history" ADD CONSTRAINT "item_notable_history_key_npc_id_npcs_id_fk" FOREIGN KEY ("key_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_notable_history" ADD CONSTRAINT "item_notable_history_event_location_site_id_sites_id_fk" FOREIGN KEY ("event_location_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_source_item_id_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_item_id_items_id_fk" FOREIGN KEY ("target_item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_npc_id_npcs_id_fk" FOREIGN KEY ("target_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_faction_id_factions_id_fk" FOREIGN KEY ("target_faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_site_id_sites_id_fk" FOREIGN KEY ("target_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_quest_id_quests_id_fk" FOREIGN KEY ("target_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("target_conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("target_narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relationships" ADD CONSTRAINT "item_relationships_target_world_concept_id_world_concepts_id_fk" FOREIGN KEY ("target_world_concept_id") REFERENCES "public"."world_concepts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_participant_involvement" ADD CONSTRAINT "destination_participant_involvement_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_participant_involvement" ADD CONSTRAINT "destination_participant_involvement_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_participant_involvement" ADD CONSTRAINT "destination_participant_involvement_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_quest_roles" ADD CONSTRAINT "destination_quest_roles_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_quest_roles" ADD CONSTRAINT "destination_quest_roles_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_relationships" ADD CONSTRAINT "destination_relationships_source_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("source_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_relationships" ADD CONSTRAINT "destination_relationships_related_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("related_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_primary_region_id_regions_id_fk" FOREIGN KEY ("primary_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_related_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("related_conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_relationships" ADD CONSTRAINT "npc_relationships_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_relationships" ADD CONSTRAINT "npc_relationships_related_npc_id_npcs_id_fk" FOREIGN KEY ("related_npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_current_location_id_sites_id_fk" FOREIGN KEY ("current_location_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_from_stage_id_quest_stages_id_fk" FOREIGN KEY ("from_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_to_stage_id_quest_stages_id_fk" FOREIGN KEY ("to_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_delivery_npc_id_npcs_id_fk" FOREIGN KEY ("delivery_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_participant_involvement" ADD CONSTRAINT "quest_participant_involvement_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_participant_involvement" ADD CONSTRAINT "quest_participant_involvement_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_participant_involvement" ADD CONSTRAINT "quest_participant_involvement_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_relationships" ADD CONSTRAINT "quest_relationships_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_relationships" ADD CONSTRAINT "quest_relationships_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_parent_id_quests_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_other_site_id_sites_id_fk" FOREIGN KEY ("other_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_relationships" ADD CONSTRAINT "concept_relationships_source_concept_id_world_concepts_id_fk" FOREIGN KEY ("source_concept_id") REFERENCES "public"."world_concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_relationships" ADD CONSTRAINT "concept_relationships_target_concept_id_world_concepts_id_fk" FOREIGN KEY ("target_concept_id") REFERENCES "public"."world_concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concept_links" ADD CONSTRAINT "world_concept_links_concept_id_world_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."world_concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concept_links" ADD CONSTRAINT "world_concept_links_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concept_links" ADD CONSTRAINT "world_concept_links_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concept_links" ADD CONSTRAINT "world_concept_links_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concept_links" ADD CONSTRAINT "world_concept_links_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concept_links" ADD CONSTRAINT "world_concept_links_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_concepts" ADD CONSTRAINT "world_concepts_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;
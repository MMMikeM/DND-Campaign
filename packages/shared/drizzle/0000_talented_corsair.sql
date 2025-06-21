CREATE TABLE "conflict_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer,
	"faction_id" integer,
	"conflict_id" integer NOT NULL,
	"role" text NOT NULL,
	"motivation" text NOT NULL,
	"public_stance" text NOT NULL,
	"secret_stance" text,
	CONSTRAINT "npc_or_faction_participant_exclusive" CHECK (("conflict_participants"."npc_id" IS NOT NULL AND "conflict_participants"."faction_id" IS NULL) OR ("conflict_participants"."npc_id" IS NULL AND "conflict_participants"."faction_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"region_id" integer,
	"cause" text NOT NULL,
	"moral_dilemma" text NOT NULL,
	"stakes" text[] NOT NULL,
	"possible_outcomes" text[] NOT NULL,
	"hidden_truths" text[] NOT NULL,
	"scope" text NOT NULL,
	"status" text NOT NULL,
	"clarity_of_right_wrong" text NOT NULL,
	"tension_level" text NOT NULL,
	"natures" text[] NOT NULL,
	"quest_impacts" text[] NOT NULL,
	CONSTRAINT "conflicts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "faction_agendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"faction_id" integer NOT NULL,
	"agenda_type" text NOT NULL,
	"current_stage" text NOT NULL,
	"importance" text NOT NULL,
	"ultimate_aim" text NOT NULL,
	"moral_ambiguity" text NOT NULL,
	"approach" text[] NOT NULL,
	"story_hooks" text[] NOT NULL,
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
	"source_faction_id" integer NOT NULL,
	"target_faction_id" integer NOT NULL,
	"strength" text NOT NULL,
	"diplomatic_status" text NOT NULL,
	CONSTRAINT "faction_diplomacy_source_faction_id_target_faction_id_unique" UNIQUE("source_faction_id","target_faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_influence" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"faction_id" integer NOT NULL,
	"related_entity_type" text NOT NULL,
	"related_entity_id" integer,
	"influence_level" text NOT NULL,
	"presence_types" text[] NOT NULL,
	"presence_details" text[] NOT NULL,
	"priorities" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"hq_site_id" integer,
	"size" text NOT NULL,
	"wealth" text NOT NULL,
	"reach" text NOT NULL,
	"type" text[] NOT NULL,
	"transparency_level" text NOT NULL,
	"public_alignment" text NOT NULL,
	"secret_alignment" text,
	"public_perception" text NOT NULL,
	"public_goal" text NOT NULL,
	"secret_goal" text,
	"values" text[] NOT NULL,
	"history" text[] NOT NULL,
	"symbols" text[] NOT NULL,
	"rituals" text[] NOT NULL,
	"taboos" text[] NOT NULL,
	"aesthetics" text[] NOT NULL,
	"jargon" text[] NOT NULL,
	"recognition_signs" text[] NOT NULL,
	CONSTRAINT "factions_name_unique" UNIQUE("name"),
	CONSTRAINT "chk_faction_transparency_rules" CHECK (NOT (("factions"."transparency_level" = 'transparent') AND ("factions"."secret_alignment" IS NOT NULL OR "factions"."secret_goal" IS NOT NULL)))
);
--> statement-breakpoint
CREATE TABLE "foreshadowing" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"target_entity_type" text NOT NULL,
	"target_entity_id" integer,
	"source_entity_type" text,
	"source_entity_id" integer,
	"subtlety" text NOT NULL,
	"narrative_weight" text NOT NULL,
	"suggested_delivery_methods" text[] NOT NULL,
	CONSTRAINT "foreshadowing_name_unique" UNIQUE("name"),
	CONSTRAINT "chk_abstract_target_has_text" CHECK (
                CASE 
                    WHEN "foreshadowing"."target_entity_type" IN ('abstract_theme', 'specific_reveal') 
                    THEN ("foreshadowing"."target_entity_id" IS NOT NULL) -- For abstract, the text IS the ID.
                    ELSE TRUE
                END
            ),
	CONSTRAINT "chk_source_duo_validity" CHECK (("foreshadowing"."source_entity_type" IS NULL AND "foreshadowing"."source_entity_id" IS NULL) OR ("foreshadowing"."source_entity_type" IS NOT NULL AND "foreshadowing"."source_entity_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "item_notable_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"item_id" integer NOT NULL,
	"key_npc_id" integer,
	"location_site_id" integer,
	"event_description" text NOT NULL,
	"timeframe" text NOT NULL,
	"npc_role_in_event" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_item_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"target_entity_type" text NOT NULL,
	"target_entity_id" integer,
	"relationship_details" text,
	CONSTRAINT "item_relations_source_item_id_target_entity_type_target_entity_id_relationship_type_unique" UNIQUE("source_item_id","target_entity_type","target_entity_id","relationship_type")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer,
	"quest_stage_id" integer,
	"item_type" text NOT NULL,
	"rarity" text NOT NULL,
	"narrative_role" text NOT NULL,
	"perceived_simplicity" text NOT NULL,
	"significance" text NOT NULL,
	"lore_significance" text NOT NULL,
	"creation_period" text,
	"place_of_origin" text,
	"mechanical_effects" text[] NOT NULL,
	CONSTRAINT "items_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "lore" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"lore_type" text NOT NULL,
	"tags" text[] NOT NULL,
	"surface_impression" text NOT NULL,
	"lived_reality" text NOT NULL,
	"hidden_truths" text NOT NULL,
	"modern_relevance" text NOT NULL,
	"aesthetics_and_symbols" text[] NOT NULL,
	"interactions_and_rules" text[] NOT NULL,
	"connections_to_world" text[] NOT NULL,
	"core_tenets_and_traditions" text[] NOT NULL,
	"history_and_legacy" text[] NOT NULL,
	"conflicting_narratives" text[] NOT NULL,
	"quest_hooks" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	CONSTRAINT "lore_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "lore_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"lore_id" integer NOT NULL,
	"link_strength" text NOT NULL,
	"target_entity_type" text NOT NULL,
	"target_entity_id" integer,
	"link_role_or_type_text" text NOT NULL,
	"link_details_text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "map_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"map_image" "bytea" NOT NULL,
	"image_format" text NOT NULL,
	"image_size" integer NOT NULL,
	"image_width" integer NOT NULL,
	"image_height" integer NOT NULL,
	CONSTRAINT "map_files_file_name_unique" UNIQUE("file_name")
);
--> statement-breakpoint
CREATE TABLE "map_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"tags" text[] NOT NULL,
	CONSTRAINT "map_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "map_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"map_group_id" integer NOT NULL,
	"map_file_id" integer NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"cover_options" text[] NOT NULL,
	"elevation_features" text[] NOT NULL,
	"movement_routes" text[] NOT NULL,
	"difficult_terrain" text[] NOT NULL,
	"choke_points" text[] NOT NULL,
	"sight_lines" text[] NOT NULL,
	"tactical_positions" text[] NOT NULL,
	"interactive_elements" text[] NOT NULL,
	"environmental_hazards" text[] NOT NULL,
	CONSTRAINT "map_variants_map_file_id_unique" UNIQUE("map_file_id"),
	CONSTRAINT "map_id_variant_name_unique" UNIQUE("map_group_id","name")
);
--> statement-breakpoint
CREATE TABLE "narrative_destination_outcomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"narrative_destination_id" integer NOT NULL,
	"consequence_id" integer NOT NULL,
	"outcome_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "narrative_destination_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"narrative_destination_id" integer NOT NULL,
	"npc_id" integer,
	"faction_id" integer,
	"participant_type" text NOT NULL,
	"narrative_role" text NOT NULL,
	"importance" text NOT NULL,
	"involvement_details" text[] NOT NULL,
	CONSTRAINT "npc_or_faction_exclusive_participant" CHECK ( ("narrative_destination_participants"."participant_type" = 'npc' AND "narrative_destination_participants"."npc_id" IS NOT NULL AND "narrative_destination_participants"."faction_id" IS NULL)
        OR ("narrative_destination_participants"."participant_type" = 'faction' AND "narrative_destination_participants"."npc_id" IS NULL AND "narrative_destination_participants"."faction_id" IS NOT NULL)
            )
);
--> statement-breakpoint
CREATE TABLE "narrative_destination_quest_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"narrative_destination_id" integer NOT NULL,
	"quest_id" integer NOT NULL,
	"narrative_role" text NOT NULL,
	"sequence" integer,
	"contribution_details" text[] NOT NULL,
	CONSTRAINT "narrative_destination_quest_roles_narrative_destination_id_quest_id_unique" UNIQUE("narrative_destination_id","quest_id")
);
--> statement-breakpoint
CREATE TABLE "narrative_destination_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_destination_id" integer NOT NULL,
	"target_destination_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"relationship_details" text[] NOT NULL,
	CONSTRAINT "narrative_destination_relations_source_destination_id_target_destination_id_unique" UNIQUE("source_destination_id","target_destination_id"),
	CONSTRAINT "chk_no_self_destination_relationship" CHECK ("narrative_destination_relations"."source_destination_id" != "narrative_destination_relations"."target_destination_id")
);
--> statement-breakpoint
CREATE TABLE "narrative_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"region_id" integer,
	"conflict_id" integer,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"emotional_shape" text NOT NULL,
	"promise" text NOT NULL,
	"payoff" text NOT NULL,
	"stakes" text[] NOT NULL,
	"themes" text[] NOT NULL,
	CONSTRAINT "narrative_destinations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "consequences" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"consequence_type" text NOT NULL,
	"severity" text NOT NULL,
	"visibility" text NOT NULL,
	"timeframe" text NOT NULL,
	"player_impact_feel" text NOT NULL,
	"source_type" text NOT NULL,
	"trigger_entity_type" text,
	"trigger_entity_id" integer,
	"affected_entity_type" text NOT NULL,
	"affected_entity_id" integer,
	"conflict_impact_description" text,
	CONSTRAINT "consequences_name_unique" UNIQUE("name"),
	CONSTRAINT "chk_trigger_duo_validity" CHECK (("consequences"."trigger_entity_type" IS NULL AND "consequences"."trigger_entity_id" IS NULL) OR ("consequences"."trigger_entity_type" IS NOT NULL AND "consequences"."trigger_entity_id" IS NOT NULL)),
	CONSTRAINT "chk_conflict_impact_description_required" CHECK (("consequences"."affected_entity_type" != 'conflict') OR ("consequences"."conflict_impact_description" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "narrative_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"event_type" text NOT NULL,
	"intended_rhythm_effect" text NOT NULL,
	"narrative_placement" text NOT NULL,
	"impact_severity" text NOT NULL,
	"quest_stage_id" integer,
	"triggering_stage_decision_id" integer,
	"related_quest_id" integer,
	"complication_details" text,
	"escalation_details" text,
	"twist_reveal_details" text,
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
CREATE TABLE "npc_faction_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer NOT NULL,
	"faction_id" integer NOT NULL,
	"loyalty" text NOT NULL,
	"role" text NOT NULL,
	"justification" text NOT NULL,
	"rank" text NOT NULL,
	"secrets" text[] NOT NULL,
	CONSTRAINT "npc_faction_memberships_npc_id_faction_id_unique" UNIQUE("npc_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "npc_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_npc_id" integer NOT NULL,
	"target_npc_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"strength" text NOT NULL,
	"history" text[] NOT NULL,
	"narrative_tensions" text[] NOT NULL,
	"shared_goals" text[] NOT NULL,
	"relationship_dynamics" text[] NOT NULL,
	CONSTRAINT "npc_relations_source_npc_id_target_npc_id_relationship_type_unique" UNIQUE("source_npc_id","target_npc_id","relationship_type"),
	CONSTRAINT "no_self_relationship" CHECK ("npc_relations"."source_npc_id" != "npc_relations"."target_npc_id")
);
--> statement-breakpoint
CREATE TABLE "npc_site_associations" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer NOT NULL,
	"site_id" integer NOT NULL,
	"association_type" text NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	CONSTRAINT "npc_site_associations_npc_id_site_id_association_type_unique" UNIQUE("npc_id","site_id","association_type")
);
--> statement-breakpoint
CREATE TABLE "npcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"alignment" text NOT NULL,
	"gender" text NOT NULL,
	"race" text NOT NULL,
	"trust_level" text NOT NULL,
	"wealth" text NOT NULL,
	"adaptability" text NOT NULL,
	"complexity_profile" text NOT NULL,
	"player_perception_goal" text NOT NULL,
	"availability" text NOT NULL,
	"capability" text NOT NULL,
	"proactivity" text NOT NULL,
	"relatability" text NOT NULL,
	"disposition" text NOT NULL,
	"age" text NOT NULL,
	"attitude" text NOT NULL,
	"occupation" text NOT NULL,
	"quirk" text NOT NULL,
	"social_status" text NOT NULL,
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
	CONSTRAINT "npcs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "quest_hooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"hook_source_type" text NOT NULL,
	"site_id" integer,
	"faction_id" integer,
	"delivery_npc_id" integer,
	"hook_type" text NOT NULL,
	"presentation_style" text NOT NULL,
	"trust_required" text NOT NULL,
	"source" text NOT NULL,
	"npc_relationship_to_party" text NOT NULL,
	"dialogue_hint" text NOT NULL,
	"hook_content" text[] NOT NULL,
	"discovery_conditions" text[] NOT NULL,
	CONSTRAINT "quest_hooks_name_unique" UNIQUE("name"),
	CONSTRAINT "quest_hooks_quest_id_source_hook_type_unique" UNIQUE("quest_id","source","hook_type"),
	CONSTRAINT "chk_quest_hook_source_exclusive" CHECK (
			CASE "quest_hooks"."hook_source_type"
				WHEN 'site' THEN ("quest_hooks"."site_id" IS NOT NULL AND "quest_hooks"."faction_id" IS NULL AND "quest_hooks"."delivery_npc_id" IS NULL)
				WHEN 'faction' THEN ("quest_hooks"."site_id" IS NULL AND "quest_hooks"."faction_id" IS NOT NULL AND "quest_hooks"."delivery_npc_id" IS NULL)
				WHEN 'npc' THEN ("quest_hooks"."site_id" IS NULL AND "quest_hooks"."faction_id" IS NULL AND "quest_hooks"."delivery_npc_id" IS NOT NULL)
				ELSE FALSE
			END
			)
);
--> statement-breakpoint
CREATE TABLE "quest_participants" (
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
		("quest_participants"."npc_id" IS NOT NULL AND "quest_participants"."faction_id" IS NULL) OR
		("quest_participants"."npc_id" IS NULL AND "quest_participants"."faction_id" IS NOT NULL)
		)
);
--> statement-breakpoint
CREATE TABLE "quest_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_quest_id" integer NOT NULL,
	"target_quest_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	CONSTRAINT "quest_relations_source_quest_id_target_quest_id_unique" UNIQUE("source_quest_id","target_quest_id"),
	CONSTRAINT "no_self_relationship" CHECK ("quest_relations"."source_quest_id" != "quest_relations"."target_quest_id")
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
	"prerequisite_quest_id" integer,
	"other_unlock_conditions_notes" text,
	CONSTRAINT "quests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"region_id" integer NOT NULL,
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
	CONSTRAINT "areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "region_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"source_region_id" integer NOT NULL,
	"target_region_id" integer NOT NULL,
	"connection_type" text NOT NULL,
	"route_type" text NOT NULL,
	"travel_difficulty" text NOT NULL,
	"travel_time" text NOT NULL,
	"travel_hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	CONSTRAINT "region_connections_name_unique" UNIQUE("name"),
	CONSTRAINT "region_connections_source_region_id_target_region_id_connection_type_unique" UNIQUE("source_region_id","target_region_id","connection_type"),
	CONSTRAINT "chk_no_self_region_connection" CHECK ("region_connections"."source_region_id" != "region_connections"."target_region_id")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
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
	CONSTRAINT "regions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "site_encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"site_id" integer NOT NULL,
	"map_variant_id" integer NOT NULL,
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
	CONSTRAINT "site_encounters_name_unique" UNIQUE("name"),
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
	"source_site_id" integer NOT NULL,
	"target_site_id" integer NOT NULL,
	"link_type" text NOT NULL,
	CONSTRAINT "site_links_source_site_id_target_site_id_link_type_unique" UNIQUE("source_site_id","target_site_id","link_type"),
	CONSTRAINT "chk_no_self_site_link" CHECK ("site_links"."source_site_id" != "site_links"."target_site_id")
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
	"consequences" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"area_id" integer NOT NULL,
	"site_type" text NOT NULL,
	"intended_site_function" text NOT NULL,
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
	"map_group_id" integer NOT NULL,
	CONSTRAINT "sites_name_unique" UNIQUE("name"),
	CONSTRAINT "sites_map_group_id_unique" UNIQUE("map_group_id")
);
--> statement-breakpoint
CREATE TABLE "npc_quest_stage_involvement" (
	"id" serial PRIMARY KEY NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"npc_id" integer NOT NULL,
	"quest_stage_id" integer NOT NULL,
	"role_in_stage" text NOT NULL,
	"involvement_details" text[] NOT NULL,
	CONSTRAINT "npc_quest_stage_involvement_npc_id_quest_stage_id_unique" UNIQUE("npc_id","quest_stage_id")
);
--> statement-breakpoint
CREATE TABLE "quest_stage_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"quest_id" integer NOT NULL,
	"from_quest_stage_id" integer NOT NULL,
	"to_quest_stage_id" integer,
	"condition_type" text NOT NULL,
	"decision_type" text NOT NULL,
	"ambiguity_level" text NOT NULL,
	"options" text[] NOT NULL,
	"success_description" text[] NOT NULL,
	"failure_description" text[] NOT NULL,
	"narrative_transition" text[] NOT NULL,
	"potential_player_reactions" text[] NOT NULL,
	"condition_value" text NOT NULL,
	"failure_leads_to_retry" boolean DEFAULT false NOT NULL,
	"failure_lesson_learned" text,
	CONSTRAINT "quest_stage_decisions_name_unique" UNIQUE("name"),
	CONSTRAINT "quest_stage_decisions_quest_id_from_quest_stage_id_to_quest_stage_id_unique" UNIQUE("quest_id","from_quest_stage_id","to_quest_stage_id"),
	CONSTRAINT "chk_stage_decision_no_self_loop" CHECK (COALESCE("quest_stage_decisions"."from_quest_stage_id" != "quest_stage_decisions"."to_quest_stage_id", TRUE)),
	CONSTRAINT "chk_failure_retry_lesson" CHECK (("quest_stage_decisions"."failure_leads_to_retry" = FALSE) OR ("quest_stage_decisions"."failure_lesson_learned" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "quest_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"site_id" integer,
	"delivery_npc_id" integer,
	"quest_id" integer NOT NULL,
	"stage_order" integer NOT NULL,
	"dramatic_question" text NOT NULL,
	"stage_type" text NOT NULL,
	"intended_complexity_level" text NOT NULL,
	"stage_importance" text NOT NULL,
	"objectives" text[] NOT NULL,
	"completion_paths" text[] NOT NULL,
	"encounters" text[] NOT NULL,
	"dramatic_moments" text[] NOT NULL,
	"sensory_elements" text[] NOT NULL,
	CONSTRAINT "quest_stages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_conflict_id_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflicts" ADD CONSTRAINT "conflicts_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_agendas" ADD CONSTRAINT "faction_agendas_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_source_faction_id_factions_id_fk" FOREIGN KEY ("source_faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_target_faction_id_factions_id_fk" FOREIGN KEY ("target_faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_influence" ADD CONSTRAINT "faction_influence_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factions" ADD CONSTRAINT "factions_hq_site_id_sites_id_fk" FOREIGN KEY ("hq_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_notable_history" ADD CONSTRAINT "item_notable_history_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_notable_history" ADD CONSTRAINT "item_notable_history_key_npc_id_npcs_id_fk" FOREIGN KEY ("key_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_notable_history" ADD CONSTRAINT "item_notable_history_location_site_id_sites_id_fk" FOREIGN KEY ("location_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_source_item_id_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_links" ADD CONSTRAINT "lore_links_lore_id_lore_id_fk" FOREIGN KEY ("lore_id") REFERENCES "public"."lore"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_variants" ADD CONSTRAINT "map_variants_map_group_id_map_groups_id_fk" FOREIGN KEY ("map_group_id") REFERENCES "public"."map_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_variants" ADD CONSTRAINT "map_variants_map_file_id_map_files_id_fk" FOREIGN KEY ("map_file_id") REFERENCES "public"."map_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_outcomes" ADD CONSTRAINT "narrative_destination_outcomes_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_outcomes" ADD CONSTRAINT "narrative_destination_outcomes_consequence_id_consequences_id_fk" FOREIGN KEY ("consequence_id") REFERENCES "public"."consequences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" ADD CONSTRAINT "narrative_destination_participants_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" ADD CONSTRAINT "narrative_destination_participants_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_participants" ADD CONSTRAINT "narrative_destination_participants_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_quest_roles" ADD CONSTRAINT "narrative_destination_quest_roles_narrative_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("narrative_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_quest_roles" ADD CONSTRAINT "narrative_destination_quest_roles_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_relations" ADD CONSTRAINT "narrative_destination_relations_source_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("source_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destination_relations" ADD CONSTRAINT "narrative_destination_relations_target_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("target_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_conflict_id_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_triggering_stage_decision_id_quest_stage_decisions_id_fk" FOREIGN KEY ("triggering_stage_decision_id") REFERENCES "public"."quest_stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" ADD CONSTRAINT "npc_faction_memberships_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" ADD CONSTRAINT "npc_faction_memberships_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_relations" ADD CONSTRAINT "npc_relations_source_npc_id_npcs_id_fk" FOREIGN KEY ("source_npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_relations" ADD CONSTRAINT "npc_relations_target_npc_id_npcs_id_fk" FOREIGN KEY ("target_npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_site_associations" ADD CONSTRAINT "npc_site_associations_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_site_associations" ADD CONSTRAINT "npc_site_associations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hooks" ADD CONSTRAINT "quest_hooks_delivery_npc_id_npcs_id_fk" FOREIGN KEY ("delivery_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_participants" ADD CONSTRAINT "quest_participants_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_participants" ADD CONSTRAINT "quest_participants_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_participants" ADD CONSTRAINT "quest_participants_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_relations" ADD CONSTRAINT "quest_relations_source_quest_id_quests_id_fk" FOREIGN KEY ("source_quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_relations" ADD CONSTRAINT "quest_relations_target_quest_id_quests_id_fk" FOREIGN KEY ("target_quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_prerequisite_quest_id_quests_id_fk" FOREIGN KEY ("prerequisite_quest_id") REFERENCES "public"."quests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_source_region_id_regions_id_fk" FOREIGN KEY ("source_region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_target_region_id_regions_id_fk" FOREIGN KEY ("target_region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_map_variant_id_map_variants_id_fk" FOREIGN KEY ("map_variant_id") REFERENCES "public"."map_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_source_site_id_sites_id_fk" FOREIGN KEY ("source_site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_target_site_id_sites_id_fk" FOREIGN KEY ("target_site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_group_id_map_groups_id_fk" FOREIGN KEY ("map_group_id") REFERENCES "public"."map_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_stage_involvement" ADD CONSTRAINT "npc_quest_stage_involvement_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_stage_involvement" ADD CONSTRAINT "npc_quest_stage_involvement_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_from_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("from_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_to_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("to_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_delivery_npc_id_npcs_id_fk" FOREIGN KEY ("delivery_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_default_per_group_idx" ON "map_variants" USING btree ("map_group_id") WHERE "map_variants"."is_default" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_current_per_npc" ON "npc_site_associations" USING btree ("npc_id") WHERE "npc_site_associations"."is_current" = true;--> statement-breakpoint
CREATE VIEW "public"."conflict_search_data_view" AS (select "conflicts"."id", 'conflicts' as "source_table", to_jsonb("conflicts") as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'participant', to_jsonb("conflict_participants".*),
    'faction', CASE WHEN "conflict_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', "factions"."id", 'name', "factions"."name") END,
    'npc', CASE WHEN "conflict_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name") END
  )) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "participants", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_caused.id, 'description', c_caused.description)) FILTER (WHERE c_caused.id IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_affecting.id, 'description', c_affecting.description)) FILTER (WHERE c_affecting.id IS NOT NULL), '[]'::jsonb) as "affectedByConsequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name")) FILTER (WHERE "narrative_destinations"."id" IS NOT NULL), '[]'::jsonb) as "narrativeDestinations", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "itemRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "loreLinks" from "conflicts" left join "regions" on "conflicts"."region_id" = "regions"."id" left join "conflict_participants" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "factions" on "conflict_participants"."faction_id" = "factions"."id" left join "npcs" on "conflict_participants"."npc_id" = "npcs"."id" left join "consequences" AS c_caused on c_caused.trigger_entity_type = 'conflict' AND c_caused.trigger_entity_id = "conflicts"."id" left join "consequences" AS c_affecting on c_affecting.affected_entity_type = 'conflict' AND c_affecting.affected_entity_id = "conflicts"."id" left join "narrative_destinations" on "narrative_destinations"."conflict_id" = "conflicts"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'conflict' AND "foreshadowing"."target_entity_id" = "conflicts"."id" left join "item_relations" on "item_relations"."target_entity_type" = 'conflict' AND "item_relations"."target_entity_id" = "conflicts"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'conflict' AND "lore_links"."target_entity_id" = "conflicts"."id" group by "conflicts"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."faction_search_data_view" AS (select "factions"."id", 'factions' as "source_table", to_jsonb("factions") as "entity_main", COALESCE(jsonb_build_object('id', "sites"."id", 'name', "sites"."name"), '{}'::jsonb) as "primaryHqSite", COALESCE(jsonb_agg(DISTINCT to_jsonb("faction_agendas".*)) FILTER (WHERE "faction_agendas"."id" IS NOT NULL), '[]'::jsonb) as "agendas", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb("npc_faction_memberships".*), 'npc', jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"))) FILTER (WHERE "npc_faction_memberships"."id" IS NOT NULL), '[]'::jsonb) as "members", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content")) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "questHooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participation', to_jsonb(qp.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE qp.id IS NOT NULL), '[]'::jsonb) as "questParticipation", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'influence', to_jsonb("faction_influence".*),
      'region', CASE WHEN "faction_influence"."related_entity_type" = 'region' THEN jsonb_build_object('id', r.id, 'name', r.name) END,
      'area', CASE WHEN "faction_influence"."related_entity_type" = 'area' THEN jsonb_build_object('id', a.id, 'name', a.name) END,
      'site', CASE WHEN "faction_influence"."related_entity_type" = 'site' THEN jsonb_build_object('id', s.id, 'name', s.name) END
    )) FILTER (WHERE "faction_influence"."id" IS NOT NULL), '[]'::jsonb) as "influence", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb("conflict_participants".*), 'conflict', jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"))) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "conflicts", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("narrative_destination_participants".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "narrativeDestinationInvolvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "itemRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "loreLinks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_in.*), 'sourceFaction', jsonb_build_object('id', sf.id, 'name', sf.name))) FILTER (WHERE fd_in.id IS NOT NULL), '[]'::jsonb) as "incomingRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_out.*), 'targetFaction', jsonb_build_object('id', tf.id, 'name', tf.name))) FILTER (WHERE fd_out.id IS NOT NULL), '[]'::jsonb) as "outgoingRelations" from "factions" left join "sites" on "factions"."hq_site_id" = "sites"."id" left join "faction_agendas" on "faction_agendas"."faction_id" = "factions"."id" left join "npc_faction_memberships" on "npc_faction_memberships"."faction_id" = "factions"."id" left join "npcs" on "npc_faction_memberships"."npc_id" = "npcs"."id" left join "quest_hooks" on "quest_hooks"."faction_id" = "factions"."id" left join "quest_participants" AS qp on qp.faction_id = "factions"."id" left join "quests" AS q on qp.quest_id = q.id left join "faction_influence" on "faction_influence"."faction_id" = "factions"."id" left join "regions" AS r on "faction_influence"."related_entity_type" = 'region' AND "faction_influence"."related_entity_id" = r.id left join "areas" AS a on "faction_influence"."related_entity_type" = 'area' AND "faction_influence"."related_entity_id" = a.id left join "sites" AS s on "faction_influence"."related_entity_type" = 'site' AND "faction_influence"."related_entity_id" = s.id left join "conflict_participants" on "conflict_participants"."faction_id" = "factions"."id" left join "conflicts" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "consequences" on "consequences"."affected_entity_type" = 'faction' AND "consequences"."affected_entity_id" = "factions"."id" left join "narrative_destination_participants" on "narrative_destination_participants"."faction_id" = "factions"."id" left join "narrative_destinations" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'faction' AND "foreshadowing"."target_entity_id" = "factions"."id" left join "item_relations" on "item_relations"."target_entity_type" = 'faction' AND "item_relations"."target_entity_id" = "factions"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'faction' AND "lore_links"."target_entity_id" = "factions"."id" left join "faction_diplomacy" AS fd_in on fd_in.target_faction_id = "factions"."id" left join "factions" AS sf on fd_in.source_faction_id = sf.id left join "faction_diplomacy" AS fd_out on fd_out.source_faction_id = "factions"."id" left join "factions" AS tf on fd_out.target_faction_id = tf.id group by "factions"."id", "sites"."id");--> statement-breakpoint
CREATE VIEW "public"."foreshadowing_search_data_view" AS (select "foreshadowing"."id", 'foreshadowing' as "source_table", to_jsonb("foreshadowing") as "entity_main", COALESCE(jsonb_build_object('id', sq.id, 'name', sq.name), '{}'::jsonb) as "sourceQuest", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', sqs.id, 'name', sqs.name), 'quest', jsonb_build_object('id', sq_stage.id, 'name', sq_stage.name)), '{}'::jsonb) as "sourceQuestStage", COALESCE(jsonb_build_object('id', ss.id, 'name', ss.name), '{}'::jsonb) as "sourceSite", COALESCE(jsonb_build_object('id', sn.id, 'name', sn.name), '{}'::jsonb) as "sourceNpc", COALESCE(jsonb_build_object('id', sl.id, 'name', sl.name), '{}'::jsonb) as "sourceLore", COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb) as "targetQuest", COALESCE(jsonb_build_object('id', tn.id, 'name', tn.name), '{}'::jsonb) as "targetNpc", COALESCE(jsonb_build_object('id', tne.id, 'name', tne.name), '{}'::jsonb) as "targetNarrativeEvent", COALESCE(jsonb_build_object('id', tmc.id, 'name', tmc.name), '{}'::jsonb) as "targetConflict", COALESCE(jsonb_build_object('id', ti.id, 'name', ti.name), '{}'::jsonb) as "targetItem", COALESCE(jsonb_build_object('id', tnd.id, 'name', tnd.name), '{}'::jsonb) as "targetNarrativeDestination", COALESCE(jsonb_build_object('id', tl.id, 'name', tl.name), '{}'::jsonb) as "targetLore", COALESCE(jsonb_build_object('id', tf.id, 'name', tf.name), '{}'::jsonb) as "targetFaction", COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb) as "targetSite" from "foreshadowing" left join "quests" AS sq on "foreshadowing"."source_entity_type" = 'quest' AND "foreshadowing"."source_entity_id" = sq.id left join "quest_stages" AS sqs on "foreshadowing"."source_entity_type" = 'quest_stage' AND "foreshadowing"."source_entity_id" = sqs.id left join "quests" AS sq_stage on sqs.quest_id = sq_stage.id left join "sites" AS ss on "foreshadowing"."source_entity_type" = 'site' AND "foreshadowing"."source_entity_id" = ss.id left join "npcs" AS sn on "foreshadowing"."source_entity_type" = 'npc' AND "foreshadowing"."source_entity_id" = sn.id left join "lore" AS sl on "foreshadowing"."source_entity_type" = 'lore' AND "foreshadowing"."source_entity_id" = sl.id left join "quests" AS tq on "foreshadowing"."target_entity_type" = 'quest' AND "foreshadowing"."target_entity_id" = tq.id left join "npcs" AS tn on "foreshadowing"."target_entity_type" = 'npc' AND "foreshadowing"."target_entity_id" = tn.id left join "narrative_events" AS tne on "foreshadowing"."target_entity_type" = 'narrative_event' AND "foreshadowing"."target_entity_id" = tne.id left join "conflicts" AS tmc on "foreshadowing"."target_entity_type" = 'conflict' AND "foreshadowing"."target_entity_id" = tmc.id left join "items" AS ti on "foreshadowing"."target_entity_type" = 'item' AND "foreshadowing"."target_entity_id" = ti.id left join "narrative_destinations" AS tnd on "foreshadowing"."target_entity_type" = 'narrative_destination' AND "foreshadowing"."target_entity_id" = tnd.id left join "lore" AS tl on "foreshadowing"."target_entity_type" = 'lore' AND "foreshadowing"."target_entity_id" = tl.id left join "factions" AS tf on "foreshadowing"."target_entity_type" = 'faction' AND "foreshadowing"."target_entity_id" = tf.id left join "sites" AS ts on "foreshadowing"."target_entity_type" = 'site' AND "foreshadowing"."target_entity_id" = ts.id group by "foreshadowing"."id", sq.id, sqs.id, sq_stage.id, ss.id, sn.id, sl.id, tq.id, tn.id, tne.id, tmc.id, ti.id, tnd.id, tl.id, tf.id, ts.id);--> statement-breakpoint
CREATE VIEW "public"."item_search_data_view" AS (select "items"."id", 'items' as "source_table", to_jsonb("items") as "entity_main", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name"), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb) as "questStage", COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) as "quest", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb("item_relations".*),
    'targetItem', CASE WHEN "item_relations"."target_entity_type" = 'item' THEN jsonb_build_object('id', ti.id, 'name', ti.name) END,
    'targetNpc', CASE WHEN "item_relations"."target_entity_type" = 'npc' THEN jsonb_build_object('id', tn.id, 'name', tn.name) END,
    'targetFaction', CASE WHEN "item_relations"."target_entity_type" = 'faction' THEN jsonb_build_object('id', tf.id, 'name', tf.name) END,
    'targetSite', CASE WHEN "item_relations"."target_entity_type" = 'site' THEN jsonb_build_object('id', ts.id, 'name', ts.name) END,
    'targetQuest', CASE WHEN "item_relations"."target_entity_type" = 'quest' THEN jsonb_build_object('id', tq.id, 'name', tq.name) END,
    'targetConflict', CASE WHEN "item_relations"."target_entity_type" = 'conflict' THEN jsonb_build_object('id', tc.id, 'name', tc.name) END,
    'targetNarrativeDestination', CASE WHEN "item_relations"."target_entity_type" = 'narrative_destination' THEN jsonb_build_object('id', tnd.id, 'name', tnd.name) END,
    'targetLore', CASE WHEN "item_relations"."target_entity_type" = 'lore' THEN jsonb_build_object('id', tl.id, 'name', tl.name) END
  )) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_in.*),
    'sourceItem', jsonb_build_object('id', si.id, 'name', si.name)
  )) FILTER (WHERE ir_in.id IS NOT NULL), '[]'::jsonb) as "incomingRelations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'history', to_jsonb("item_notable_history".*),
    'keyNpc', CASE WHEN "item_notable_history"."key_npc_id" IS NOT NULL THEN jsonb_build_object('id', hn.id, 'name', hn.name) END,
    'locationSite', CASE WHEN "item_notable_history"."location_site_id" IS NOT NULL THEN jsonb_build_object('id', hs.id, 'name', hs.name) END
  )) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "notableHistory", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incomingForeshadowing" from "items" left join "quest_stages" on "items"."quest_stage_id" = "quest_stages"."id" left join "quests" AS sq on "quest_stages"."quest_id" = sq.id left join "quests" AS rq on "items"."quest_id" = rq.id left join "item_relations" on "item_relations"."source_item_id" = "items"."id" left join "items" AS ti on "item_relations"."target_entity_type" = 'item' AND "item_relations"."target_entity_id" = ti.id left join "npcs" AS tn on "item_relations"."target_entity_type" = 'npc' AND "item_relations"."target_entity_id" = tn.id left join "factions" AS tf on "item_relations"."target_entity_type" = 'faction' AND "item_relations"."target_entity_id" = tf.id left join "sites" AS ts on "item_relations"."target_entity_type" = 'site' AND "item_relations"."target_entity_id" = ts.id left join "quests" AS tq on "item_relations"."target_entity_type" = 'quest' AND "item_relations"."target_entity_id" = tq.id left join "conflicts" AS tc on "item_relations"."target_entity_type" = 'conflict' AND "item_relations"."target_entity_id" = tc.id left join "narrative_destinations" AS tnd on "item_relations"."target_entity_type" = 'narrative_destination' AND "item_relations"."target_entity_id" = tnd.id left join "lore" AS tl on "item_relations"."target_entity_type" = 'lore' AND "item_relations"."target_entity_id" = tl.id left join "item_relations" AS ir_in on ir_in.target_entity_type = 'item' AND ir_in.target_entity_id = "items"."id" left join "items" AS si on ir_in.source_item_id = si.id left join "item_notable_history" on "item_notable_history"."item_id" = "items"."id" left join "npcs" AS hn on "item_notable_history"."key_npc_id" = hn.id left join "sites" AS hs on "item_notable_history"."location_site_id" = hs.id left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'item' AND "foreshadowing"."target_entity_id" = "items"."id" group by "items"."id", "quest_stages"."id", sq.id, rq.id);--> statement-breakpoint
CREATE VIEW "public"."lore_search_data_view" AS (select "lore"."id", 'lore' as "source_table", to_jsonb("lore".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
					'link', to_jsonb("lore_links".*),
					'region', CASE WHEN "lore_links"."target_entity_type" = 'region' THEN jsonb_build_object('id', lr.id, 'name', lr.name) END,
					'faction', CASE WHEN "lore_links"."target_entity_type" = 'faction' THEN jsonb_build_object('id', lf.id, 'name', lf.name) END,
					'npc', CASE WHEN "lore_links"."target_entity_type" = 'npc' THEN jsonb_build_object('id', ln.id, 'name', ln.name) END,
					'conflict', CASE WHEN "lore_links"."target_entity_type" = 'conflict' THEN jsonb_build_object('id', lc.id, 'name', lc.name) END,
					'quest', CASE WHEN "lore_links"."target_entity_type" = 'quest' THEN jsonb_build_object('id', lq.id, 'name', lq.name) END,
					'lore', CASE WHEN "lore_links"."target_entity_type" = 'lore' THEN jsonb_build_object('id', ll.id, 'name', ll.name) END
				)) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "links", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing" from "lore" left join "lore_links" on "lore_links"."lore_id" = "lore"."id" left join "regions" AS lr on "lore_links"."target_entity_type" = 'region' AND "lore_links"."target_entity_id" = lr.id left join "factions" AS lf on "lore_links"."target_entity_type" = 'faction' AND "lore_links"."target_entity_id" = lf.id left join "npcs" AS ln on "lore_links"."target_entity_type" = 'npc' AND "lore_links"."target_entity_id" = ln.id left join "conflicts" AS lc on "lore_links"."target_entity_type" = 'conflict' AND "lore_links"."target_entity_id" = lc.id left join "quests" AS lq on "lore_links"."target_entity_type" = 'quest' AND "lore_links"."target_entity_id" = lq.id left join "lore" AS ll on "lore_links"."target_entity_type" = 'lore' AND "lore_links"."target_entity_id" = ll.id left join "item_relations" on "item_relations"."target_entity_type" = 'lore' AND "item_relations"."target_entity_id" = "lore"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'lore' AND "foreshadowing"."target_entity_id" = "lore"."id" group by "lore"."id");--> statement-breakpoint
CREATE VIEW "public"."narrative_destination_search_data_view" AS (select "narrative_destinations"."id", 'narrative_destinations' as "source_table", to_jsonb("narrative_destinations".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"), '{}'::jsonb) as "conflict", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb("narrative_destination_quest_roles".*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE "narrative_destination_quest_roles"."id" IS NOT NULL), '[]'::jsonb) as "quest_roles", COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'involvement', to_jsonb("narrative_destination_participants".*),
				'npc', CASE WHEN "narrative_destination_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', n.id, 'name', n.name) END,
				'faction', CASE WHEN "narrative_destination_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', f.id, 'name', f.name) END
			)) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "participant_involvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_out.*), 'relatedDestination', jsonb_build_object('id', rd_out.id, 'name', rd_out.name))) FILTER (WHERE dr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_in.*), 'sourceDestination', jsonb_build_object('id', sd_in.id, 'name', sd_in.name))) FILTER (WHERE dr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations" from "narrative_destinations" left join "regions" on "narrative_destinations"."region_id" = "regions"."id" left join "conflicts" on "narrative_destinations"."conflict_id" = "conflicts"."id" left join "narrative_destination_quest_roles" on "narrative_destination_quest_roles"."narrative_destination_id" = "narrative_destinations"."id" left join "quests" AS q on "narrative_destination_quest_roles"."quest_id" = q.id left join "narrative_destination_participants" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "npcs" AS n on "narrative_destination_participants"."npc_id" = n.id left join "factions" AS f on "narrative_destination_participants"."faction_id" = f.id left join "item_relations" on "item_relations"."target_entity_type" = 'narrative_destination' AND "item_relations"."target_entity_id" = "narrative_destinations"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'narrative_destination' AND "lore_links"."target_entity_id" = "narrative_destinations"."id" left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'narrative_destination' AND "foreshadowing"."target_entity_id" = "narrative_destinations"."id" left join "narrative_destination_relations" AS dr_out on dr_out.source_destination_id = "narrative_destinations"."id" left join "narrative_destinations" AS rd_out on dr_out.target_destination_id = rd_out.id left join "narrative_destination_relations" AS dr_in on dr_in.target_destination_id = "narrative_destinations"."id" left join "narrative_destinations" AS sd_in on dr_in.source_destination_id = sd_in.id group by "narrative_destinations"."id", "regions"."id", "conflicts"."id");--> statement-breakpoint
CREATE VIEW "public"."consequence_search_data_view" AS (select "consequences"."id", 'consequences' as "source_table", to_jsonb("consequences".*) as "entity_main", COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb) as "trigger_quest", COALESCE(jsonb_build_object('id', tc.id, 'name', tc.name), '{}'::jsonb) as "trigger_conflict", COALESCE(jsonb_build_object('id', af.id, 'name', af.name), '{}'::jsonb) as "affected_faction", COALESCE(jsonb_build_object('id', ar.id, 'name', ar.name), '{}'::jsonb) as "affected_region", COALESCE(jsonb_build_object('id', aa.id, 'name', aa.name), '{}'::jsonb) as "affected_area", COALESCE(jsonb_build_object('id', as_.id, 'name', as_.name), '{}'::jsonb) as "affected_site", COALESCE(jsonb_build_object('id', an.id, 'name', an.name), '{}'::jsonb) as "affected_npc", COALESCE(jsonb_build_object('id', and_.id, 'name', and_.name), '{}'::jsonb) as "affected_narrative_destination", COALESCE(jsonb_build_object('id', ac.id, 'name', ac.name), '{}'::jsonb) as "affected_conflict", COALESCE(jsonb_build_object('id', aq.id, 'name', aq.name), '{}'::jsonb) as "affected_quest" from "consequences" left join "quests" AS tq on "consequences"."trigger_entity_type" = 'quest' AND "consequences"."trigger_entity_id" = tq.id left join "conflicts" AS tc on "consequences"."trigger_entity_type" = 'conflict' AND "consequences"."trigger_entity_id" = tc.id left join "factions" AS af on "consequences"."affected_entity_type" = 'faction' AND "consequences"."affected_entity_id" = af.id left join "regions" AS ar on "consequences"."affected_entity_type" = 'region' AND "consequences"."affected_entity_id" = ar.id left join "areas" AS aa on "consequences"."affected_entity_type" = 'area' AND "consequences"."affected_entity_id" = aa.id left join "sites" AS as_ on "consequences"."affected_entity_type" = 'site' AND "consequences"."affected_entity_id" = as_.id left join "npcs" AS an on "consequences"."affected_entity_type" = 'npc' AND "consequences"."affected_entity_id" = an.id left join "narrative_destinations" AS and_ on "consequences"."affected_entity_type" = 'narrative_destination' AND "consequences"."affected_entity_id" = and_.id left join "conflicts" AS ac on "consequences"."affected_entity_type" = 'conflict' AND "consequences"."affected_entity_id" = ac.id left join "quests" AS aq on "consequences"."affected_entity_type" = 'quest' AND "consequences"."affected_entity_id" = aq.id group by "consequences"."id", tq.id, tc.id, af.id, ar.id, aa.id, as_.id, an.id, and_.id, ac.id, aq.id);--> statement-breakpoint
CREATE VIEW "public"."narrative_event_search_data_view" AS (select "narrative_events"."id", 'narrative_events' as "source_table", to_jsonb("narrative_events".*) as "entity_main", COALESCE(jsonb_build_object('stage', jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name"), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb) as "quest_stage", COALESCE(jsonb_build_object('id', "quest_stage_decisions"."id", 'name', "quest_stage_decisions"."name"), '{}'::jsonb) as "triggering_stage_decision", COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb) as "related_quest", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing" from "narrative_events" left join "quest_stages" on "narrative_events"."quest_stage_id" = "quest_stages"."id" left join "quests" AS sq on "quest_stages"."quest_id" = sq.id left join "quest_stage_decisions" on "narrative_events"."triggering_stage_decision_id" = "quest_stage_decisions"."id" left join "quests" AS rq on "narrative_events"."related_quest_id" = rq.id left join "foreshadowing" on "foreshadowing"."target_entity_type" = 'narrative_event' AND "foreshadowing"."target_entity_id" = "narrative_events"."id" group by "narrative_events"."id", "quest_stages"."id", sq.id, "quest_stage_decisions"."id", rq.id);--> statement-breakpoint
CREATE VIEW "public"."npc_search_data_view" AS (select "npcs"."id", 'npcs' as "source_table", to_jsonb("npcs".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb("npc_faction_memberships".*), 'faction', jsonb_build_object('id', "factions"."id", 'name', "factions"."name"))) FILTER (WHERE "npc_faction_memberships"."id" IS NOT NULL), '[]'::jsonb) as "faction_memberships", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb("npc_site_associations".*), 'site', jsonb_build_object('id', "sites"."id", 'name', "sites"."name", 'area', jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'region', jsonb_build_object('id', "regions"."id", 'name', "regions"."name"))))) FILTER (WHERE "npc_site_associations"."id" IS NOT NULL), '[]'::jsonb) as "site_associations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb("conflict_participants".*), 'conflict', jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name"))) FILTER (WHERE "conflict_participants"."id" IS NOT NULL), '[]'::jsonb) as "conflict_participation", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "affected_by_consequences", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_notable_history".*)) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "item_history", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("narrative_destination_participants".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_participants"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destination_involvement", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content", 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "quest_hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs_delivery.id, 'name', qs_delivery.name, 'quest', jsonb_build_object('id', q_stage_delivery.id, 'name', q_stage_delivery.name))) FILTER (WHERE qs_delivery.id IS NOT NULL), '[]'::jsonb) as "quest_stage_deliveries", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("npc_quest_stage_involvement".*), 'stage', jsonb_build_object('id', si.id, 'name', si.name), 'quest', jsonb_build_object('id', q_involvement.id, 'name', q_involvement.name))) FILTER (WHERE "npc_quest_stage_involvement"."id" IS NOT NULL), '[]'::jsonb) as "stage_involvement", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_out.*), 'relatedNpc', jsonb_build_object('id', rn_out.id, 'name', rn_out.name))) FILTER (WHERE nr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_in.*), 'sourceNpc', jsonb_build_object('id', sn_in.id, 'name', sn_in.name))) FILTER (WHERE nr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations" from "npcs" left join "npc_faction_memberships" on "npc_faction_memberships"."npc_id" = "npcs"."id" left join "factions" on "npc_faction_memberships"."faction_id" = "factions"."id" left join "npc_site_associations" on "npc_site_associations"."npc_id" = "npcs"."id" left join "sites" on "npc_site_associations"."site_id" = "sites"."id" left join "areas" on "sites"."area_id" = "areas"."id" left join "regions" on "areas"."region_id" = "regions"."id" left join "conflict_participants" on "conflict_participants"."npc_id" = "npcs"."id" left join "conflicts" on "conflict_participants"."conflict_id" = "conflicts"."id" left join "consequences" on "consequences"."affected_entity_type" = 'npc' AND "consequences"."affected_entity_id" = "npcs"."id" left join "foreshadowing" AS fs_out on fs_out.source_entity_type = 'npc' AND fs_out.source_entity_id = "npcs"."id" left join "foreshadowing" AS fs_in on fs_in.target_entity_type = 'npc' AND fs_in.target_entity_id = "npcs"."id" left join "item_notable_history" on "item_notable_history"."key_npc_id" = "npcs"."id" left join "item_relations" on "item_relations"."target_entity_type" = 'npc' AND "item_relations"."target_entity_id" = "npcs"."id" left join "narrative_destination_participants" on "narrative_destination_participants"."npc_id" = "npcs"."id" left join "narrative_destinations" on "narrative_destination_participants"."narrative_destination_id" = "narrative_destinations"."id" left join "quest_hooks" on "quest_hooks"."delivery_npc_id" = "npcs"."id" left join "quests" AS qh_quest on "quest_hooks"."quest_id" = qh_quest.id left join "quest_stages" AS qs_delivery on qs_delivery.delivery_npc_id = "npcs"."id" left join "quests" AS q_stage_delivery on qs_delivery.quest_id = q_stage_delivery.id left join "npc_quest_stage_involvement" on "npc_quest_stage_involvement"."npc_id" = "npcs"."id" left join "quest_stages" AS si on "npc_quest_stage_involvement"."quest_stage_id" = si.id left join "quests" AS q_involvement on si.quest_id = q_involvement.id left join "lore_links" on "lore_links"."target_entity_type" = 'npc' AND "lore_links"."target_entity_id" = "npcs"."id" left join "npc_relations" AS nr_out on nr_out.source_npc_id = "npcs"."id" left join "npcs" AS rn_out on nr_out.target_npc_id = rn_out.id left join "npc_relations" AS nr_in on nr_in.target_npc_id = "npcs"."id" left join "npcs" AS sn_in on nr_in.source_npc_id = sn_in.id group by "npcs"."id");--> statement-breakpoint
CREATE VIEW "public"."quest_search_data_view" AS (select "quests"."id", 'quests' as "source_table", to_jsonb("quests".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_out.*), 'targetQuest', jsonb_build_object('id', tq.id, 'name', tq.name))) FILTER (WHERE qr_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_in.*), 'sourceQuest', jsonb_build_object('id', sq.id, 'name', sq.name))) FILTER (WHERE qr_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name", 'stage_order', "quest_stages"."stage_order", 'stage_type', "quest_stages"."stage_type", 'deliveryNpc', CASE WHEN "quest_stages"."delivery_npc_id" IS NOT NULL THEN jsonb_build_object('id', dn.id, 'name', dn.name) END)) FILTER (WHERE "quest_stages"."id" IS NOT NULL), '[]'::jsonb) as "stages", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hook', to_jsonb("quest_hooks".*), 'site', CASE WHEN "quest_hooks"."site_id" IS NOT NULL THEN jsonb_build_object('id', h_s.id, 'name', h_s.name) END, 'faction', CASE WHEN "quest_hooks"."faction_id" IS NOT NULL THEN jsonb_build_object('id', h_f.id, 'name', h_f.name) END, 'deliveryNpc', CASE WHEN "quest_hooks"."delivery_npc_id" IS NOT NULL THEN jsonb_build_object('id', h_n.id, 'name', h_n.name) END)) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("quest_participants".*), 'npc', CASE WHEN "quest_participants"."npc_id" IS NOT NULL THEN jsonb_build_object('id', p_n.id, 'name', p_n.name) END, 'faction', CASE WHEN "quest_participants"."faction_id" IS NOT NULL THEN jsonb_build_object('id', p_f.id, 'name', p_f.name) END)) FILTER (WHERE "quest_participants"."id" IS NOT NULL), '[]'::jsonb) as "participants", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb("narrative_destination_quest_roles".*), 'destination', jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name"))) FILTER (WHERE "narrative_destination_quest_roles"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destination_contributions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "c_trig"."id", 'description', "c_trig"."description")) FILTER (WHERE "c_trig"."id" IS NOT NULL), '[]'::jsonb) as "triggered_consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "c_aff"."id", 'description', "c_aff"."description")) FILTER (WHERE "c_aff"."id" IS NOT NULL), '[]'::jsonb) as "affecting_consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "triggered_events", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_relations".*)) FILTER (WHERE "item_relations"."id" IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links" from "quests" left join "regions" on "quests"."region_id" = "regions"."id" left join "quest_relations" AS qr_out on qr_out.source_quest_id = "quests"."id" left join "quests" AS tq on qr_out.target_quest_id = tq.id left join "quest_relations" AS qr_in on qr_in.target_quest_id = "quests"."id" left join "quests" AS sq on qr_in.source_quest_id = sq.id left join "quest_stages" on "quest_stages"."quest_id" = "quests"."id" left join "npcs" AS dn on "quest_stages"."delivery_npc_id" = dn.id left join "quest_hooks" on "quest_hooks"."quest_id" = "quests"."id" left join "sites" AS h_s on "quest_hooks"."site_id" = h_s.id left join "factions" AS h_f on "quest_hooks"."faction_id" = h_f.id left join "npcs" AS h_n on "quest_hooks"."delivery_npc_id" = h_n.id left join "quest_participants" on "quest_participants"."quest_id" = "quests"."id" left join "npcs" AS p_n on "quest_participants"."npc_id" = p_n.id left join "factions" AS p_f on "quest_participants"."faction_id" = p_f.id left join "narrative_destination_quest_roles" on "narrative_destination_quest_roles"."quest_id" = "quests"."id" left join "narrative_destinations" on "narrative_destination_quest_roles"."narrative_destination_id" = "narrative_destinations"."id" left join "consequences" "c_trig" on "c_trig"."trigger_entity_type" = 'quest' AND "c_trig"."trigger_entity_id" = "quests"."id" left join "consequences" "c_aff" on "c_aff"."affected_entity_type" = 'quest' AND "c_aff"."affected_entity_id" = "quests"."id" left join "narrative_events" on "narrative_events"."related_quest_id" = "quests"."id" left join "foreshadowing" AS fs_out on fs_out.source_entity_type = 'quest' AND fs_out.source_entity_id = "quests"."id" left join "foreshadowing" AS fs_in on fs_in.target_entity_type = 'quest' AND fs_in.target_entity_id = "quests"."id" left join "item_relations" on "item_relations"."target_entity_type" = 'quest' AND "item_relations"."target_entity_id" = "quests"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'quest' AND "lore_links"."target_entity_id" = "quests"."id" group by "quests"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."area_search_data_view" AS (select "areas"."id", 'areas' as "source_table", to_jsonb("areas".*) as "entity_main", COALESCE(jsonb_build_object('id', "regions"."id", 'name', "regions"."name"), '{}'::jsonb) as "region", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "sites"."id", 'name', "sites"."name", 'description', "sites"."description")) FILTER (WHERE "sites"."id" IS NOT NULL), '[]'::jsonb) as "sites", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT to_jsonb("faction_influence".*)) FILTER (WHERE "faction_influence"."id" IS NOT NULL), '[]'::jsonb) as "faction_influence" from "areas" left join "regions" on "areas"."region_id" = "regions"."id" left join "sites" on "sites"."area_id" = "areas"."id" left join "consequences" on "consequences"."affected_entity_type" = 'area' AND "consequences"."affected_entity_id" = "areas"."id" left join "faction_influence" on "faction_influence"."related_entity_type" = 'area' AND "faction_influence"."related_entity_id" = "areas"."id" group by "areas"."id", "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."region_search_data_view" AS (select "regions"."id", 'regions' as "source_table", to_jsonb("regions".*) as "entity_main", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc_out.*), 'targetRegion', jsonb_build_object('id', tr.id, 'name', tr.name))) FILTER (WHERE rc_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('connection', to_jsonb(rc_in.*), 'sourceRegion', jsonb_build_object('id', sr.id, 'name', sr.name))) FILTER (WHERE rc_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'description', "areas"."description")) FILTER (WHERE "areas"."id" IS NOT NULL), '[]'::jsonb) as "areas", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quests"."id", 'name', "quests"."name")) FILTER (WHERE "quests"."id" IS NOT NULL), '[]'::jsonb) as "quests", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "conflicts"."id", 'name', "conflicts"."name")) FILTER (WHERE "conflicts"."id" IS NOT NULL), '[]'::jsonb) as "conflicts", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_destinations"."id", 'name', "narrative_destinations"."name")) FILTER (WHERE "narrative_destinations"."id" IS NOT NULL), '[]'::jsonb) as "narrative_destinations", COALESCE(jsonb_agg(DISTINCT to_jsonb("faction_influence".*)) FILTER (WHERE "faction_influence"."id" IS NOT NULL), '[]'::jsonb) as "faction_influence", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "lore_links"."id", 'lore_id', "lore_links"."lore_id")) FILTER (WHERE "lore_links"."id" IS NOT NULL), '[]'::jsonb) as "lore_links" from "regions" left join "region_connections" AS rc_out on rc_out.source_region_id = "regions"."id" left join "regions" AS tr on rc_out.target_region_id = tr.id left join "region_connections" AS rc_in on rc_in.target_region_id = "regions"."id" left join "regions" AS sr on rc_in.source_region_id = sr.id left join "areas" on "areas"."region_id" = "regions"."id" left join "quests" on "quests"."region_id" = "regions"."id" left join "conflicts" on "conflicts"."region_id" = "regions"."id" left join "consequences" on "consequences"."affected_entity_type" = 'region' AND "consequences"."affected_entity_id" = "regions"."id" left join "narrative_destinations" on "narrative_destinations"."region_id" = "regions"."id" left join "faction_influence" on "faction_influence"."related_entity_type" = 'region' AND "faction_influence"."related_entity_id" = "regions"."id" left join "lore_links" on "lore_links"."target_entity_type" = 'region' AND "lore_links"."target_entity_id" = "regions"."id" group by "regions"."id");--> statement-breakpoint
CREATE VIEW "public"."site_search_data_view" AS (select "sites"."id", 'sites' as "source_table", to_jsonb("sites".*) as "entity_main", COALESCE(jsonb_build_object('id', "areas"."id", 'name', "areas"."name", 'region', jsonb_build_object('id', "regions"."id", 'name', "regions"."name")), '{}'::jsonb) as "area", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_out.*), 'targetSite', jsonb_build_object('id', ts.id, 'name', ts.name))) FILTER (WHERE sl_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_relations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('link', to_jsonb(sl_in.*), 'sourceSite', jsonb_build_object('id', ss.id, 'name', ss.name))) FILTER (WHERE sl_in.id IS NOT NULL), '[]'::jsonb) as "incoming_relations", COALESCE(jsonb_agg(DISTINCT to_jsonb("site_encounters".*)) FILTER (WHERE "site_encounters"."id" IS NOT NULL), '[]'::jsonb) as "encounters", COALESCE(jsonb_agg(DISTINCT to_jsonb("site_secrets".*)) FILTER (WHERE "site_secrets"."id" IS NOT NULL), '[]'::jsonb) as "secrets", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb("npc_site_associations".*), 'npc', jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"))) FILTER (WHERE "npc_site_associations"."id" IS NOT NULL), '[]'::jsonb) as "npc_associations", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_stages"."id", 'name', "quest_stages"."name", 'quest', jsonb_build_object('id', qs_quest.id, 'name', qs_quest.name))) FILTER (WHERE "quest_stages"."id" IS NOT NULL), '[]'::jsonb) as "quest_stages", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "quest_hooks"."id", 'source', "quest_hooks"."source", 'hook_content', "quest_hooks"."hook_content", 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE "quest_hooks"."id" IS NOT NULL), '[]'::jsonb) as "quest_hooks", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', site_consequences.id, 'description', site_consequences.description)) FILTER (WHERE site_consequences.id IS NOT NULL), '[]'::jsonb) as "consequences", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "factions"."id", 'name', "factions"."name")) FILTER (WHERE "factions"."id" IS NOT NULL), '[]'::jsonb) as "faction_hqs", COALESCE(jsonb_agg(DISTINCT to_jsonb(site_faction_influence.*)) FILTER (WHERE site_faction_influence.id IS NOT NULL), '[]'::jsonb) as "faction_influence", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb) as "incoming_foreshadowing", COALESCE(jsonb_agg(DISTINCT to_jsonb("item_notable_history".*)) FILTER (WHERE "item_notable_history"."id" IS NOT NULL), '[]'::jsonb) as "item_history", COALESCE(jsonb_agg(DISTINCT to_jsonb(site_item_relations.*)) FILTER (WHERE site_item_relations.id IS NOT NULL), '[]'::jsonb) as "item_relations", COALESCE(jsonb_build_object('id', "map_groups"."id", 'name', "map_groups"."name"), '{}'::jsonb) as "map_group" from "sites" left join "areas" on "sites"."area_id" = "areas"."id" left join "regions" on "areas"."region_id" = "regions"."id" left join "site_links" AS sl_out on sl_out.source_site_id = "sites"."id" left join "sites" AS ts on sl_out.target_site_id = ts.id left join "site_links" AS sl_in on sl_in.target_site_id = "sites"."id" left join "sites" AS ss on sl_in.source_site_id = ss.id left join "site_encounters" on "site_encounters"."site_id" = "sites"."id" left join "site_secrets" on "site_secrets"."site_id" = "sites"."id" left join "npc_site_associations" on "npc_site_associations"."site_id" = "sites"."id" left join "npcs" on "npc_site_associations"."npc_id" = "npcs"."id" left join "quest_stages" on "quest_stages"."site_id" = "sites"."id" left join "quests" AS qs_quest on "quest_stages"."quest_id" = qs_quest.id left join "quest_hooks" on "quest_hooks"."site_id" = "sites"."id" left join "quests" AS qh_quest on "quest_hooks"."quest_id" = qh_quest.id left join "consequences" AS site_consequences on site_consequences.affected_entity_type = 'site' AND site_consequences.affected_entity_id = "sites"."id" left join "factions" on "factions"."hq_site_id" = "sites"."id" left join "faction_influence" AS site_faction_influence on site_faction_influence.related_entity_type = 'site' AND site_faction_influence.related_entity_id = "sites"."id" left join "foreshadowing" AS fs_out on fs_out.source_entity_type = 'site' AND fs_out.source_entity_id = "sites"."id" left join "foreshadowing" AS fs_in on fs_in.target_entity_type = 'site' AND fs_in.target_entity_id = "sites"."id" left join "item_notable_history" on "item_notable_history"."location_site_id" = "sites"."id" left join "item_relations" AS site_item_relations on site_item_relations.target_entity_type = 'site' AND site_item_relations.target_entity_id = "sites"."id" left join "map_groups" on "sites"."map_group_id" = "map_groups"."id" group by "sites"."id", "areas"."id", "regions"."id", "map_groups"."id");--> statement-breakpoint
CREATE VIEW "public"."quest_stage_decision_search_data_view" AS (select "quest_stage_decisions"."id", 'quest_stage_decisions' as "source_table", to_jsonb("quest_stage_decisions".*) as "entity_main", COALESCE(jsonb_build_object('id', "quests"."id", 'name', "quests"."name"), '{}'::jsonb) as "quest", COALESCE(jsonb_build_object('id', fs.id, 'name', fs.name), '{}'::jsonb) as "from_stage", COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb) as "to_stage", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "triggered_events", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "consequences"."id", 'description', "consequences"."description")) FILTER (WHERE "consequences"."id" IS NOT NULL), '[]'::jsonb) as "consequences" from "quest_stage_decisions" left join "quests" on "quest_stage_decisions"."quest_id" = "quests"."id" left join "quest_stages" AS fs on "quest_stage_decisions"."from_quest_stage_id" = fs.id left join "quest_stages" AS ts on "quest_stage_decisions"."to_quest_stage_id" = ts.id left join "narrative_events" on "narrative_events"."triggering_stage_decision_id" = "quest_stage_decisions"."id" left join "consequences" on "consequences"."trigger_entity_type" = 'quest_stage_decision' AND "consequences"."trigger_entity_id" = "quest_stage_decisions"."id" group by "quest_stage_decisions"."id", "quests"."id", fs.id, ts.id);--> statement-breakpoint
CREATE VIEW "public"."quest_stage_search_data_view" AS (select "quest_stages"."id", 'quest_stages' as "source_table", to_jsonb("quest_stages".*) as "entity_main", COALESCE(jsonb_build_object('id', "quests"."id", 'name', "quests"."name"), '{}'::jsonb) as "quest", COALESCE(jsonb_build_object('id', "sites"."id", 'name', "sites"."name"), '{}'::jsonb) as "site", COALESCE(jsonb_build_object('id', "npcs"."id", 'name', "npcs"."name"), '{}'::jsonb) as "delivery_npc", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('decision', to_jsonb(qsd_out.*), 'toStage', jsonb_build_object('id', ts_out.id, 'name', ts_out.name))) FILTER (WHERE qsd_out.id IS NOT NULL), '[]'::jsonb) as "outgoing_decisions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('decision', to_jsonb(qsd_in.*), 'fromStage', jsonb_build_object('id', ts_in.id, 'name', ts_in.name))) FILTER (WHERE qsd_in.id IS NOT NULL), '[]'::jsonb) as "incoming_decisions", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "items"."id", 'name', "items"."name")) FILTER (WHERE "items"."id" IS NOT NULL), '[]'::jsonb) as "items", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "narrative_events"."id", 'description', "narrative_events"."description")) FILTER (WHERE "narrative_events"."id" IS NOT NULL), '[]'::jsonb) as "narrative_events", COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb("npc_quest_stage_involvement".*), 'npc', jsonb_build_object('id', inv_npc.id, 'name', inv_npc.name))) FILTER (WHERE "npc_quest_stage_involvement"."id" IS NOT NULL), '[]'::jsonb) as "npc_involvement", COALESCE(jsonb_agg(DISTINCT to_jsonb("foreshadowing".*)) FILTER (WHERE "foreshadowing"."id" IS NOT NULL), '[]'::jsonb) as "outgoing_foreshadowing" from "quest_stages" left join "quests" on "quest_stages"."quest_id" = "quests"."id" left join "sites" on "quest_stages"."site_id" = "sites"."id" left join "npcs" on "quest_stages"."delivery_npc_id" = "npcs"."id" left join "quest_stage_decisions" AS qsd_out on qsd_out.from_quest_stage_id = "quest_stages"."id" left join "quest_stages" AS ts_out on qsd_out.to_quest_stage_id = ts_out.id left join "quest_stage_decisions" AS qsd_in on qsd_in.to_quest_stage_id = "quest_stages"."id" left join "quest_stages" AS ts_in on qsd_in.from_quest_stage_id = ts_in.id left join "items" on "items"."quest_stage_id" = "quest_stages"."id" left join "narrative_events" on "narrative_events"."quest_stage_id" = "quest_stages"."id" left join "npc_quest_stage_involvement" on "npc_quest_stage_involvement"."quest_stage_id" = "quest_stages"."id" left join "npcs" AS inv_npc on "npc_quest_stage_involvement"."npc_id" = inv_npc.id left join "foreshadowing" on "foreshadowing"."source_entity_type" = 'quest_stage' AND "foreshadowing"."source_entity_id" = "quest_stages"."id" group by "quest_stages"."id", "quests"."id", "sites"."id", "npcs"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."search_index" AS (((((((((((((((select "id"::text as "id", "source_table", jsonb_build_object(
        'region', "entity_main",
        'areas', "areas",
        'quests', "quests",
        'conflicts', "conflicts",
        'consequences', "consequences",
        'narrativeDestinations', "narrative_destinations",
        'factionInfluence', "faction_influence",
        'loreLinks', "lore_links",
        'connections', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values(jsonb_build_object(
        'areas', "areas",
        'quests', "quests",
        'conflicts', "conflicts"
      )) as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'areas', "areas",
          'quests', "quests"
        )
      ) as "content_tsv" from "region_search_data_view") union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'area', "entity_main",
        'region', "region",
        'sites', "sites",
        'consequences', "consequences",
        'factionInfluence', "faction_influence"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("sites") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'sites', "sites"
        )
      ) as "content_tsv" from "area_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'site', "entity_main",
        'area', "area",
        'encounters', "encounters",
        'secrets', "secrets",
        'npcAssociations', "npc_associations",
        'questStages', "quest_stages",
        'questHooks', "quest_hooks",
        'consequences', "consequences",
        'factionHqs', "faction_hqs",
        'factionInfluence', "faction_influence",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemHistory', "item_history",
        'itemRelations', "item_relations",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        ),
        'mapGroup', "map_group"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("area") || ' ' ||
      jsonb_deep_text_values("encounters") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'area', "area",
          'encounters', "encounters"
        )
      ) as "content_tsv" from "site_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'npc', "entity_main",
        'factionMemberships', "faction_memberships",
        'siteAssociations', "site_associations",
        'conflictParticipation', "conflict_participation",
        'consequences', "affected_by_consequences",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemHistory', "item_history",
        'itemRelations', "item_relations",
        'narrativeDestinationInvolvement', "narrative_destination_involvement",
        'questHooks', "quest_hooks",
        'questStageDeliveries', "quest_stage_deliveries",
        'stageInvolvement', "stage_involvement",
        'loreLinks', "lore_links",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("faction_memberships") || ' ' ||
      jsonb_deep_text_values("site_associations") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'factionMemberships', "faction_memberships",
          'siteAssociations', "site_associations"
        )
      ) as "content_tsv" from "npc_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'quest', "entity_main",
        'region', "region",
        'stages', "stages",
        'hooks', "hooks",
        'participants', "participants",
        'narrativeDestinationContributions', "narrative_destination_contributions",
        'affectingConsequences', "affecting_consequences",
        'triggeredConsequences', "triggered_consequences",
        'triggeredEvents', "triggered_events",
        'foreshadowing', jsonb_build_object(
          'outgoing', "outgoing_foreshadowing", 
          'incoming', "incoming_foreshadowing"
        ),
        'itemRelations', "item_relations",
        'loreLinks', "lore_links",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("stages") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'stages', "stages"
        )
      ) as "content_tsv" from "quest_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'faction', "entity_main",
        'primaryHqSite', "primaryHqSite",
        'agendas', "agendas",
        'members', "members",
        'questHooks', "questHooks",
        'questParticipation', "questParticipation",
        'influence', "influence",
        'conflicts', "conflicts",
        'consequences', "consequences",
        'narrativeDestinationInvolvement', "narrativeDestinationInvolvement",
        'foreshadowing', "incomingForeshadowing",
        'itemRelations', "itemRelations",
        'loreLinks', "loreLinks",
        'relations', jsonb_build_object(
          'incoming', "incomingRelations", 
          'outgoing', "outgoingRelations"
        )
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("agendas") || ' ' ||
      jsonb_deep_text_values("members") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'agendas', "agendas",
          'members', "members"
        )
      ) as "content_tsv" from "faction_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'conflict', "entity_main",
        'region', "region",
        'participants', "participants",
        'consequences', "consequences",
        'affectedByConsequences', "affectedByConsequences",
        'narrativeDestinations', "narrativeDestinations",
        'incomingForeshadowing', "incomingForeshadowing",
        'itemRelations', "itemRelations",
        'loreLinks', "loreLinks"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("participants") || ' ' ||
      jsonb_deep_text_values("consequences") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'participants', "participants",
          'consequences', "consequences"
        )
      ) as "content_tsv" from "conflict_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'item', "entity_main",
        'questStage', "questStage",
        'quest', "quest",
        'relations', jsonb_build_object(
          'outgoing', "relations", 
          'incoming', "incomingRelations"
        ),
        'notableHistory', "notableHistory",
        'incomingForeshadowing', "incomingForeshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("notableHistory") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'notableHistory', "notableHistory"
        )
      ) as "content_tsv" from "item_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'foreshadowing', "entity_main",
        'sourceQuest', "sourceQuest",
        'sourceQuestStage', "sourceQuestStage",
        'sourceSite', "sourceSite",
        'sourceNpc', "sourceNpc",
        'sourceLore', "sourceLore",
        'targetQuest', "targetQuest",
        'targetNpc', "targetNpc",
        'targetNarrativeEvent', "targetNarrativeEvent",
        'targetConflict', "targetConflict",
        'targetItem', "targetItem",
        'targetNarrativeDestination', "targetNarrativeDestination",
        'targetLore', "targetLore",
        'targetFaction', "targetFaction",
        'targetSite', "targetSite"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("sourceQuest") || ' ' ||
      jsonb_deep_text_values("targetQuest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'sourceQuest', "sourceQuest",
          'targetQuest', "targetQuest"
        )
      ) as "content_tsv" from "foreshadowing_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'lore', "entity_main",
        'links', "links",
        'itemRelations', "item_relations",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("links") as "content", weighted_search_vector(
        "entity_main",
        "links"
      ) as "content_tsv" from "lore_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'narrativeDestination', "entity_main",
        'region', "region",
        'conflict', "conflict",
        'questRoles', "quest_roles",
        'participantInvolvement', "participant_involvement",
        'itemRelations', "item_relations",
        'relations', jsonb_build_object(
          'outgoing', "outgoing_relations", 
          'incoming', "incoming_relations"
        ),
        'loreLinks', "lore_links",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("region") || ' ' ||
      jsonb_deep_text_values("conflict") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'region', "region",
          'conflict', "conflict"
        )
      ) as "content_tsv" from "narrative_destination_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'narrativeEvent', "entity_main",
        'questStage', "quest_stage",
        'triggeringStageDecision', "triggering_stage_decision",
        'relatedQuest', "related_quest",
        'incomingForeshadowing', "incoming_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest_stage") || ' ' ||
      jsonb_deep_text_values("related_quest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'questStage', "quest_stage",
          'relatedQuest', "related_quest"
        )
      ) as "content_tsv" from "narrative_event_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'consequence', "entity_main",
        'triggerQuest', "trigger_quest",
        'triggerConflict', "trigger_conflict",
        'affectedFaction', "affected_faction",
        'affectedRegion', "affected_region",
        'affectedArea', "affected_area",
        'affectedSite', "affected_site",
        'affectedNpc', "affected_npc",
        'affectedNarrativeDestination', "affected_narrative_destination",
        'affectedConflict', "affected_conflict",
        'affectedQuest', "affected_quest"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("trigger_quest") || ' ' ||
      jsonb_deep_text_values("trigger_conflict") || ' ' ||
      jsonb_deep_text_values("affected_faction") || ' ' ||
      jsonb_deep_text_values("affected_region") || ' ' ||
      jsonb_deep_text_values("affected_area") || ' ' ||
      jsonb_deep_text_values("affected_site") || ' ' ||
      jsonb_deep_text_values("affected_npc") || ' ' ||
      jsonb_deep_text_values("affected_narrative_destination") || ' ' ||
      jsonb_deep_text_values("affected_conflict") || ' ' ||
      jsonb_deep_text_values("affected_quest") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'triggerQuest', "trigger_quest",
          'triggerConflict', "trigger_conflict",
          'affectedFaction', "affected_faction",
          'affectedRegion', "affected_region",
          'affectedArea', "affected_area",
          'affectedSite', "affected_site",
          'affectedNpc', "affected_npc",
          'affectedNarrativeDestination', "affected_narrative_destination",
          'affectedConflict', "affected_conflict",
          'affectedQuest', "affected_quest"
        )
      ) as "content_tsv" from "consequence_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'questStage', "entity_main",
        'quest', "quest",
        'site', "site",
        'deliveryNpc', "delivery_npc",
        'outgoingDecisions', "outgoing_decisions",
        'incomingDecisions', "incoming_decisions",
        'items', "items",
        'narrativeEvents', "narrative_events",
        'npcInvolvement', "npc_involvement",
        'outgoingForeshadowing', "outgoing_foreshadowing"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("site") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'site', "site"
        )
      ) as "content_tsv" from "quest_stage_search_data_view")) union all (select "id"::text as "id", "source_table", jsonb_build_object(
        'questStageDecision', "entity_main",
        'quest', "quest",
        'fromStage', "from_stage",
        'toStage', "to_stage",
        'triggeredEvents', "triggered_events",
        'consequences', "consequences"
      ) as "raw_data", jsonb_deep_text_values("entity_main") || ' ' ||
      jsonb_deep_text_values("quest") || ' ' ||
      jsonb_deep_text_values("from_stage") as "content", weighted_search_vector(
        "entity_main",
        jsonb_build_object(
          'quest', "quest",
          'fromStage', "from_stage"
        )
      ) as "content_tsv" from "quest_stage_decision_search_data_view"));
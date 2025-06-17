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
CREATE TABLE "maps" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"map_image" "bytea" NOT NULL,
	"image_format" text NOT NULL,
	"image_size" integer NOT NULL,
	"image_width" integer NOT NULL,
	"image_height" integer NOT NULL,
	CONSTRAINT "maps_file_name_unique" UNIQUE("file_name")
);
--> statement-breakpoint
CREATE TABLE "map_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"map_id" integer NOT NULL,
	"cover_options" text[] NOT NULL,
	"elevation_features" text[] NOT NULL,
	"movement_routes" text[] NOT NULL,
	"difficult_terrain" text[] NOT NULL,
	"choke_points" text[] NOT NULL,
	"sight_lines" text[] NOT NULL,
	"tactical_positions" text[] NOT NULL,
	"interactive_elements" text[] NOT NULL,
	"environmental_hazards" text[] NOT NULL,
	CONSTRAINT "map_details_name_unique" UNIQUE("name")
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
	"npc_or_faction" text NOT NULL,
	"role_in_arc" text NOT NULL,
	"arc_importance" text NOT NULL,
	"involvement_details" text[] NOT NULL,
	CONSTRAINT "npc_or_faction_exclusive_participant" CHECK ( ("narrative_destination_participants"."npc_or_faction" = 'npc' AND "narrative_destination_participants"."npc_id" IS NOT NULL AND "narrative_destination_participants"."faction_id" IS NULL)
        OR ("narrative_destination_participants"."npc_or_faction" = 'faction' AND "narrative_destination_participants"."npc_id" IS NULL AND "narrative_destination_participants"."faction_id" IS NOT NULL)
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
	"role" text NOT NULL,
	"sequence_in_arc" integer,
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
	"related_conflict_id" integer,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"intended_emotional_arc_shape" text NOT NULL,
	"promise" text NOT NULL,
	"payoff" text NOT NULL,
	"stakes" text[] NOT NULL,
	"themes" text[] NOT NULL,
	"foreshadowing_elements" text[] NOT NULL,
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
	"map_id" integer NOT NULL,
	CONSTRAINT "sites_name_unique" UNIQUE("name"),
	CONSTRAINT "sites_map_id_unique" UNIQUE("map_id")
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
ALTER TABLE "map_details" ADD CONSTRAINT "map_details_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_related_conflict_id_conflicts_id_fk" FOREIGN KEY ("related_conflict_id") REFERENCES "public"."conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_source_site_id_sites_id_fk" FOREIGN KEY ("source_site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_target_site_id_sites_id_fk" FOREIGN KEY ("target_site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_stage_involvement" ADD CONSTRAINT "npc_quest_stage_involvement_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_stage_involvement" ADD CONSTRAINT "npc_quest_stage_involvement_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_from_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("from_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stage_decisions" ADD CONSTRAINT "quest_stage_decisions_to_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("to_quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_delivery_npc_id_npcs_id_fk" FOREIGN KEY ("delivery_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_current_per_npc" ON "npc_site_associations" USING btree ("npc_id") WHERE "npc_site_associations"."is_current" = true;
-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "clues" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_stage_id" integer NOT NULL,
	"faction_id" integer,
	"site_id" integer,
	"npc_id" integer,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"discovery_condition" text[] NOT NULL,
	"reveals" text[] NOT NULL,
	"embedding_id" integer
);
--> statement-breakpoint
CREATE TABLE "faction_quest_involvement" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer NOT NULL,
	"faction_id" integer,
	"role" text NOT NULL,
	"interest" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_quest_involvement_quest_id_faction_id_unique" UNIQUE("quest_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_territorial_control" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" integer NOT NULL,
	"region_id" integer,
	"area_id" integer,
	"site_id" integer,
	"influence_level" text NOT NULL,
	"presence" text[] NOT NULL,
	"priorities" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_territorial_control_faction_id_region_id_area_id_site_id_unique" UNIQUE("faction_id","region_id","area_id","site_id")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"npc_id" integer,
	"faction_id" integer,
	"site_id" integer,
	"quest_id" integer,
	"stage_id" integer,
	"type" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"significance" text NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "items_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "npc_quest_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" integer NOT NULL,
	"quest_id" integer,
	"role" text NOT NULL,
	"importance" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"dramatic_moments" text[] NOT NULL,
	"hidden_aspects" text[] NOT NULL,
	CONSTRAINT "npc_quest_roles_npc_id_quest_id_role_unique" UNIQUE("npc_id","quest_id","role")
);
--> statement-breakpoint
CREATE TABLE "quest_hook_npcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"hook_id" integer NOT NULL,
	"npc_id" integer NOT NULL,
	"relationship" text NOT NULL,
	"trust_required" text NOT NULL,
	"dialogue_hint" text NOT NULL,
	CONSTRAINT "quest_hook_npcs_hook_id_npc_id_unique" UNIQUE("hook_id","npc_id")
);
--> statement-breakpoint
CREATE TABLE "quest_introductions" (
	"id" serial PRIMARY KEY NOT NULL,
	"stage_id" integer NOT NULL,
	"site_id" integer,
	"faction_id" integer,
	"item_id" integer,
	"source" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"discovery_condition" text[] NOT NULL,
	"introduction_type" text NOT NULL,
	"presentation_style" text NOT NULL,
	"hook_content" text[] NOT NULL,
	CONSTRAINT "quest_introductions_stage_id_site_id_faction_id_item_id_unique" UNIQUE("stage_id","site_id","faction_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "region_connection_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"relation_id" integer NOT NULL,
	"route_type" text NOT NULL,
	"travel_difficulty" text NOT NULL,
	"travel_time" text NOT NULL,
	"controlling_faction" integer,
	"travel_hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "region_connection_details_relation_id_unique" UNIQUE("relation_id")
);
--> statement-breakpoint
CREATE TABLE "conflict_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"conflict_id" integer NOT NULL,
	"faction_id" integer NOT NULL,
	"role" text NOT NULL,
	"motivation" text NOT NULL,
	"public_stance" text NOT NULL,
	"secret_stance" text NOT NULL,
	"resources" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conflict_progression" (
	"id" serial PRIMARY KEY NOT NULL,
	"conflict_id" integer NOT NULL,
	"quest_id" integer NOT NULL,
	"impact" text DEFAULT 'no_change' NOT NULL,
	"notes" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major_conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"primary_region_id" integer,
	"name" text NOT NULL,
	"scope" text NOT NULL,
	"nature" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"cause" text NOT NULL,
	"description" text[] NOT NULL,
	"stakes" text[] NOT NULL,
	"moral_dilemma" text NOT NULL,
	"possible_outcomes" text[] NOT NULL,
	"hidden_truths" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "major_conflicts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" vector(3072) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "narrative_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"event_type" text NOT NULL,
	"quest_stage_id" integer,
	"triggering_decision_id" integer,
	"related_quest_id" integer,
	"description" text[] NOT NULL,
	"narrative_placement" text NOT NULL,
	"impact_severity" text NOT NULL,
	"complication_details" text NOT NULL,
	"escalation_details" text NOT NULL,
	"twist_reveal_details" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "narrative_events_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "faction_agendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" integer NOT NULL,
	"name" text NOT NULL,
	"agenda_type" text NOT NULL,
	"current_stage" text NOT NULL,
	"importance" text NOT NULL,
	"ultimate_aim" text NOT NULL,
	"moral_ambiguity" text NOT NULL,
	"description" text[] NOT NULL,
	"hidden_costs" text[] NOT NULL,
	"key_opponents" text[] NOT NULL,
	"internal_conflicts" text[] NOT NULL,
	"approach" text[] NOT NULL,
	"public_image" text[] NOT NULL,
	"personal_stakes" text[] NOT NULL,
	"story_hooks" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "faction_agendas_name_unique" UNIQUE("name"),
	CONSTRAINT "faction_agendas_faction_id_name_unique" UNIQUE("faction_id","name")
);
--> statement-breakpoint
CREATE TABLE "faction_culture" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" integer NOT NULL,
	"symbols" text[] NOT NULL,
	"rituals" text[] NOT NULL,
	"taboos" text[] NOT NULL,
	"aesthetics" text[] NOT NULL,
	"jargon" text[] NOT NULL,
	"recognition_signs" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "faction_culture_faction_id_unique" UNIQUE("faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_diplomacy" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" integer NOT NULL,
	"other_faction_id" integer NOT NULL,
	"strength" text NOT NULL,
	"diplomatic_status" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_diplomacy_faction_id_other_faction_id_unique" UNIQUE("faction_id","other_faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_headquarters" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" integer NOT NULL,
	"site_id" integer NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_headquarters_faction_id_site_id_unique" UNIQUE("faction_id","site_id")
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alignment" text NOT NULL,
	"size" text NOT NULL,
	"wealth" text NOT NULL,
	"reach" text NOT NULL,
	"type" text NOT NULL,
	"public_goal" text NOT NULL,
	"public_perception" text NOT NULL,
	"secret_goal" text,
	"description" text[] NOT NULL,
	"values" text[] NOT NULL,
	"history" text[] NOT NULL,
	"notes" text[] NOT NULL,
	"resources" text[] NOT NULL,
	"recruitment" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "factions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "narrative_foreshadowing" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_stage_id" integer,
	"site_id" integer,
	"npc_id" integer,
	"faction_id" integer,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text[] NOT NULL,
	"discovery_condition" text[] NOT NULL,
	"subtlety" text DEFAULT 'moderate' NOT NULL,
	"narrative_weight" text DEFAULT 'supporting' NOT NULL,
	"foreshadows_quest_id" integer,
	"foreshadows_event_id" integer,
	"foreshadows_npc_id" integer,
	"foreshadows_destination_id" integer,
	"foreshadows_element" text NOT NULL,
	"player_notes" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"embedding_id" integer
);
--> statement-breakpoint
CREATE TABLE "destination_contribution" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination_id" integer NOT NULL,
	"quest_id" integer NOT NULL,
	"role" text NOT NULL,
	"notes" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "narrative_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"promise" text NOT NULL,
	"payoff" text NOT NULL,
	"description" text[] NOT NULL,
	"themes" text[] NOT NULL,
	"foreshadowing_elements" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "narrative_destinations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "character_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" integer NOT NULL,
	"related_npc_id" integer,
	"type" text NOT NULL,
	"strength" text NOT NULL,
	"history" text[] NOT NULL,
	"description" text[] NOT NULL,
	"narrative_tensions" text[] NOT NULL,
	"shared_goals" text[] NOT NULL,
	"relationship_dynamics" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "character_relationships_npc_id_related_npc_id_unique" UNIQUE("npc_id","related_npc_id")
);
--> statement-breakpoint
CREATE TABLE "npc_factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" integer NOT NULL,
	"faction_id" integer,
	"loyalty" text NOT NULL,
	"justification" text NOT NULL,
	"role" text NOT NULL,
	"rank" text NOT NULL,
	"secrets" text[] NOT NULL,
	CONSTRAINT "npc_factions_npc_id_faction_id_unique" UNIQUE("npc_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "npc_sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" integer NOT NULL,
	"site_id" integer,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "npc_sites_npc_id_site_id_unique" UNIQUE("npc_id","site_id")
);
--> statement-breakpoint
CREATE TABLE "npcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alignment" text NOT NULL,
	"disposition" text NOT NULL,
	"gender" text NOT NULL,
	"race" text NOT NULL,
	"trust_level" text NOT NULL,
	"wealth" text NOT NULL,
	"adaptability" text NOT NULL,
	"age" text NOT NULL,
	"attitude" text NOT NULL,
	"occupation" text NOT NULL,
	"quirk" text NOT NULL,
	"social_status" text NOT NULL,
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
	"embedding_id" integer,
	"base_capability_score" integer,
	"base_proactivity_score" integer,
	"base_relatability_score" integer,
	CONSTRAINT "npcs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "decision_outcomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"decision_id" integer NOT NULL,
	"affected_stage_id" integer,
	"outcome_type" text NOT NULL,
	"severity" text NOT NULL,
	"visibility" text NOT NULL,
	"delay_factor" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "decision_outcomes_outcome_type_decision_id_unique" UNIQUE("outcome_type","decision_id")
);
--> statement-breakpoint
CREATE TABLE "quest_dependencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer NOT NULL,
	"related_quest_id" integer,
	"dependency_type" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "quest_dependencies_quest_id_related_quest_id_unique" UNIQUE("quest_id","related_quest_id")
);
--> statement-breakpoint
CREATE TABLE "quest_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer NOT NULL,
	"site_id" integer,
	"stage" integer NOT NULL,
	"name" text NOT NULL,
	"dramatic_question" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"objectives" text[] NOT NULL,
	"completion_paths" text[] NOT NULL,
	"encounters" text[] NOT NULL,
	"dramatic_moments" text[] NOT NULL,
	"sensory_elements" text[] NOT NULL,
	"importance" text DEFAULT 'standard' NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "quest_stages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "quest_unlock_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer NOT NULL,
	"condition_type" text NOT NULL,
	"condition_details" text NOT NULL,
	"importance" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"region_id" integer,
	"type" text NOT NULL,
	"urgency" text NOT NULL,
	"visibility" text NOT NULL,
	"mood" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"failure_outcomes" text[] NOT NULL,
	"success_outcomes" text[] NOT NULL,
	"objectives" text[] NOT NULL,
	"rewards" text[] NOT NULL,
	"themes" text[] NOT NULL,
	"inspirations" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "quests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "stage_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer NOT NULL,
	"from_stage_id" integer NOT NULL,
	"to_stage_id" integer,
	"condition_type" text NOT NULL,
	"decision_type" text NOT NULL,
	"name" text NOT NULL,
	"condition_value" text NOT NULL,
	"success_description" text[] NOT NULL,
	"failure_description" text[] NOT NULL,
	"narrative_transition" text[] NOT NULL,
	"potential_player_reactions" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"options" text[] NOT NULL,
	"failure_leads_to_retry" boolean DEFAULT false,
	"failure_lesson_learned" text NOT NULL,
	CONSTRAINT "stage_decisions_quest_id_from_stage_id_to_stage_id_unique" UNIQUE("quest_id","from_stage_id","to_stage_id")
);
--> statement-breakpoint
CREATE TABLE "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"danger_level" text NOT NULL,
	"leadership" text NOT NULL,
	"population" text NOT NULL,
	"primary_activity" text NOT NULL,
	"description" text[] NOT NULL,
	"cultural_notes" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	"rumors" text[] NOT NULL,
	"defenses" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "region_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_id" integer NOT NULL,
	"other_region_id" integer,
	"connection_type" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "region_connections_region_id_other_region_id_unique" UNIQUE("region_id","other_region_id")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"danger_level" text NOT NULL,
	"type" text NOT NULL,
	"economy" text NOT NULL,
	"history" text NOT NULL,
	"population" text NOT NULL,
	"cultural_notes" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
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
	"encounter_type" text NOT NULL,
	"danger_level" text NOT NULL,
	"difficulty" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"creatures" text[] NOT NULL,
	"treasure" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "site_encounters_name_unique" UNIQUE("name"),
	CONSTRAINT "site_encounters_site_id_name_unique" UNIQUE("site_id","name")
);
--> statement-breakpoint
CREATE TABLE "site_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"other_site_id" integer,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"link_type" text NOT NULL,
	CONSTRAINT "site_links_site_id_other_site_id_unique" UNIQUE("site_id","other_site_id")
);
--> statement-breakpoint
CREATE TABLE "site_secrets" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"secret_type" text NOT NULL,
	"difficulty" text NOT NULL,
	"discovery_method" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"consequences" text[] NOT NULL,
	"embedding_id" integer
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_id" integer NOT NULL,
	"site_type" text NOT NULL,
	"name" text NOT NULL,
	"terrain" text NOT NULL,
	"climate" text NOT NULL,
	"mood" text NOT NULL,
	"environment" text NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"creatures" text[] NOT NULL,
	"description" text[] NOT NULL,
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
CREATE TABLE "world_state_changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"change_type" text NOT NULL,
	"severity" text DEFAULT 'moderate' NOT NULL,
	"visibility" text DEFAULT 'obvious' NOT NULL,
	"timeframe" text DEFAULT 'immediate' NOT NULL,
	"source_type" text NOT NULL,
	"quest_id" integer,
	"decision_id" integer,
	"conflict_id" integer,
	"faction_id" integer,
	"region_id" integer,
	"area_id" integer,
	"site_id" integer,
	"npc_id" integer,
	"destination_id" integer,
	"future_quest_id" integer,
	"description" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"embedding_id" integer,
	CONSTRAINT "world_state_changes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ADD CONSTRAINT "faction_quest_involvement_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ADD CONSTRAINT "faction_quest_involvement_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_stage_id_quest_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ADD CONSTRAINT "npc_quest_roles_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ADD CONSTRAINT "npc_quest_roles_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ADD CONSTRAINT "quest_hook_npcs_hook_id_quest_introductions_id_fk" FOREIGN KEY ("hook_id") REFERENCES "public"."quest_introductions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ADD CONSTRAINT "quest_hook_npcs_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_stage_id_quest_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connection_details" ADD CONSTRAINT "region_connection_details_relation_id_region_connections_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."region_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connection_details" ADD CONSTRAINT "region_connection_details_controlling_faction_factions_id_fk" FOREIGN KEY ("controlling_faction") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_progression" ADD CONSTRAINT "conflict_progression_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_progression" ADD CONSTRAINT "conflict_progression_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_conflicts" ADD CONSTRAINT "major_conflicts_primary_region_id_regions_id_fk" FOREIGN KEY ("primary_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_conflicts" ADD CONSTRAINT "major_conflicts_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_triggering_decision_id_stage_decisions_id_fk" FOREIGN KEY ("triggering_decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_agendas" ADD CONSTRAINT "faction_agendas_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_agendas" ADD CONSTRAINT "faction_agendas_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_culture" ADD CONSTRAINT "faction_culture_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_culture" ADD CONSTRAINT "faction_culture_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_other_faction_id_factions_id_fk" FOREIGN KEY ("other_faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ADD CONSTRAINT "faction_headquarters_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ADD CONSTRAINT "faction_headquarters_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factions" ADD CONSTRAINT "factions_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_quest_id_quests_id_fk" FOREIGN KEY ("foreshadows_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_event_id_narrative_events_id_fk" FOREIGN KEY ("foreshadows_event_id") REFERENCES "public"."narrative_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_npc_id_npcs_id_fk" FOREIGN KEY ("foreshadows_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("foreshadows_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_contribution" ADD CONSTRAINT "destination_contribution_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_contribution" ADD CONSTRAINT "destination_contribution_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_related_npc_id_npcs_id_fk" FOREIGN KEY ("related_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_sites" ADD CONSTRAINT "npc_sites_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_decision_id_stage_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_affected_stage_id_quest_stages_id_fk" FOREIGN KEY ("affected_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ADD CONSTRAINT "quest_dependencies_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ADD CONSTRAINT "quest_dependencies_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_unlock_conditions" ADD CONSTRAINT "quest_unlock_conditions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_from_stage_id_quest_stages_id_fk" FOREIGN KEY ("from_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_to_stage_id_quest_stages_id_fk" FOREIGN KEY ("to_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_other_region_id_regions_id_fk" FOREIGN KEY ("other_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_other_site_id_sites_id_fk" FOREIGN KEY ("other_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_decision_id_stage_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_future_quest_id_quests_id_fk" FOREIGN KEY ("future_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;
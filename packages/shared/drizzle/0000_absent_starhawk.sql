CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "location_encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location_id" serial NOT NULL,
	"encounter_type" text,
	"danger_level" text,
	"difficulty" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"creatures" text[] NOT NULL,
	"treasure" text[] NOT NULL,
	"embedding" vector(768),
	CONSTRAINT "location_encounters_name_unique" UNIQUE("name"),
	CONSTRAINT "location_encounters_location_id_name_unique" UNIQUE("location_id","name")
);
--> statement-breakpoint
CREATE TABLE "location_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" serial NOT NULL,
	"other_location_id" serial NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"link_type" text,
	CONSTRAINT "location_links_location_id_other_location_id_unique" UNIQUE("location_id","other_location_id")
);
--> statement-breakpoint
CREATE TABLE "location_secrets" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" serial NOT NULL,
	"secret_type" text,
	"difficulty" text,
	"discovery_method" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"consequences" text[] NOT NULL,
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_id" serial NOT NULL,
	"location_type" text,
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
	"embedding" vector(768),
	CONSTRAINT "locations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "region_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_id" serial NOT NULL,
	"other_region_id" serial NOT NULL,
	"connection_type" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "region_connections_region_id_other_region_id_unique" UNIQUE("region_id","other_region_id")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"danger_level" text,
	"type" text,
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
	"embedding" vector(768),
	CONSTRAINT "regions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "faction_culture" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" serial NOT NULL,
	"symbols" text[] NOT NULL,
	"rituals" text[] NOT NULL,
	"taboos" text[] NOT NULL,
	"aesthetics" text[] NOT NULL,
	"jargon" text[] NOT NULL,
	"recognition_signs" text[] NOT NULL,
	"embedding" vector(768),
	CONSTRAINT "faction_culture_faction_id_unique" UNIQUE("faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_diplomacy" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" serial NOT NULL,
	"other_faction_id" serial NOT NULL,
	"strength" text,
	"diplomatic_status" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_diplomacy_faction_id_other_faction_id_unique" UNIQUE("faction_id","other_faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_headquarters" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_headquarters_faction_id_location_id_unique" UNIQUE("faction_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "faction_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" serial NOT NULL,
	"name" text NOT NULL,
	"type" text,
	"scale" text,
	"status" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"objectives" text[] NOT NULL,
	"locations" text[] NOT NULL,
	"involved_npcs" text[] NOT NULL,
	"priority" text,
	"embedding" vector(768),
	CONSTRAINT "faction_operations_name_unique" UNIQUE("name"),
	CONSTRAINT "faction_operations_faction_id_name_unique" UNIQUE("faction_id","name")
);
--> statement-breakpoint
CREATE TABLE "faction_regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" serial NOT NULL,
	"region_id" serial NOT NULL,
	"control_level" text,
	"presence" text[] NOT NULL,
	"priorities" text[] NOT NULL,
	CONSTRAINT "faction_regions_faction_id_region_id_unique" UNIQUE("faction_id","region_id")
);
--> statement-breakpoint
CREATE TABLE "factions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alignment" text,
	"size" text,
	"wealth" text,
	"reach" text,
	"type" text,
	"public_goal" text NOT NULL,
	"public_perception" text NOT NULL,
	"secret_goal" text,
	"description" text[] NOT NULL,
	"values" text[] NOT NULL,
	"history" text[] NOT NULL,
	"notes" text[] NOT NULL,
	"resources" text[] NOT NULL,
	"recruitment" text[] NOT NULL,
	"embedding" vector(768),
	CONSTRAINT "factions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "decision_outcomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"decision_id" serial NOT NULL,
	"affected_stage_id" serial NOT NULL,
	"outcome_type" text,
	"severity" text,
	"visibility" text,
	"delay_factor" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "decision_outcomes_outcome_type_decision_id_unique" UNIQUE("outcome_type","decision_id")
);
--> statement-breakpoint
CREATE TABLE "quest_dependencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"related_quest_id" serial NOT NULL,
	"dependency_type" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "quest_dependencies_quest_id_related_quest_id_unique" UNIQUE("quest_id","related_quest_id")
);
--> statement-breakpoint
CREATE TABLE "quest_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"location_id" serial NOT NULL,
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
	"embedding" vector(768),
	CONSTRAINT "quest_stages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "quest_twists" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"twist_type" text,
	"impact" text,
	"narrative_placement" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_unlock_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"condition_type" text,
	"condition_details" text NOT NULL,
	"importance" text
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"region_id" serial NOT NULL,
	"type" text,
	"urgency" text,
	"visibility" text,
	"mood" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"failure_outcomes" text[] NOT NULL,
	"success_outcomes" text[] NOT NULL,
	"objectives" text[] NOT NULL,
	"rewards" text[] NOT NULL,
	"themes" text[] NOT NULL,
	"inspirations" text[] NOT NULL,
	"embedding" vector(768),
	CONSTRAINT "quests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "stage_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"from_stage_id" serial NOT NULL,
	"to_stage_id" serial NOT NULL,
	"condition_type" text,
	"decision_type" text,
	"name" text NOT NULL,
	"condition_value" text NOT NULL,
	"success_description" text[] NOT NULL,
	"failure_description" text[] NOT NULL,
	"narrative_transition" text[] NOT NULL,
	"potential_player_reactions" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"options" text[] NOT NULL,
	CONSTRAINT "stage_decisions_quest_id_from_stage_id_to_stage_id_unique" UNIQUE("quest_id","from_stage_id","to_stage_id")
);
--> statement-breakpoint
CREATE TABLE "character_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" serial NOT NULL,
	"related_npc_id" serial NOT NULL,
	"type" text,
	"strength" text,
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
	"npc_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"loyalty" text,
	"justification" text NOT NULL,
	"role" text NOT NULL,
	"rank" text NOT NULL,
	"secrets" text[] NOT NULL,
	CONSTRAINT "npc_factions_npc_id_faction_id_unique" UNIQUE("npc_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "npc_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "npc_locations_npc_id_location_id_unique" UNIQUE("npc_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "npcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"alignment" text,
	"disposition" text NOT NULL,
	"gender" text,
	"race" text,
	"trust_level" text,
	"wealth" text,
	"adaptability" text,
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
	"embedding" vector(768),
	CONSTRAINT "npcs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "clues" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_stage_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"npc_id" serial NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"discovery_condition" text[] NOT NULL,
	"reveals" text[] NOT NULL,
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE TABLE "faction_quest_involvement" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"role" text,
	"interest" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "faction_quest_involvement_quest_id_faction_id_unique" UNIQUE("quest_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE "faction_regional_power" (
	"id" serial PRIMARY KEY NOT NULL,
	"faction_id" serial NOT NULL,
	"quest_id" serial NOT NULL,
	"region_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"power_level" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"npc_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"quest_id" serial NOT NULL,
	"stage_id" serial NOT NULL,
	"type" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"significance" text NOT NULL,
	"embedding" vector(768),
	CONSTRAINT "items_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "npc_quest_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"npc_id" serial NOT NULL,
	"quest_id" serial NOT NULL,
	"role" text,
	"importance" text,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"dramatic_moments" text[] NOT NULL,
	"hidden_aspects" text[] NOT NULL,
	CONSTRAINT "npc_quest_roles_npc_id_quest_id_role_unique" UNIQUE("npc_id","quest_id","role")
);
--> statement-breakpoint
CREATE TABLE "quest_hook_npcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"hook_id" serial NOT NULL,
	"npc_id" serial NOT NULL,
	"relationship" text NOT NULL,
	"trust_required" text,
	"dialogue_hint" text NOT NULL,
	CONSTRAINT "quest_hook_npcs_hook_id_npc_id_unique" UNIQUE("hook_id","npc_id")
);
--> statement-breakpoint
CREATE TABLE "quest_introductions" (
	"id" serial PRIMARY KEY NOT NULL,
	"stage_id" serial NOT NULL,
	"location_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"item_id" serial NOT NULL,
	"source" text NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	"discovery_condition" text[] NOT NULL,
	"introduction_type" text,
	"presentation_style" text,
	"hook_content" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region_connection_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"relation_id" serial NOT NULL,
	"route_type" text,
	"travel_difficulty" text,
	"travel_time" text NOT NULL,
	"controlling_faction" serial NOT NULL,
	"travel_hazards" text[] NOT NULL,
	"points_of_interest" text[] NOT NULL,
	"description" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "region_connection_details_relation_id_unique" UNIQUE("relation_id")
);
--> statement-breakpoint
ALTER TABLE "location_encounters" ADD CONSTRAINT "location_encounters_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_links" ADD CONSTRAINT "location_links_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_links" ADD CONSTRAINT "location_links_other_location_id_locations_id_fk" FOREIGN KEY ("other_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_secrets" ADD CONSTRAINT "location_secrets_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connections" ADD CONSTRAINT "region_connections_other_region_id_regions_id_fk" FOREIGN KEY ("other_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_culture" ADD CONSTRAINT "faction_culture_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_diplomacy" ADD CONSTRAINT "faction_diplomacy_other_faction_id_factions_id_fk" FOREIGN KEY ("other_faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ADD CONSTRAINT "faction_headquarters_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ADD CONSTRAINT "faction_headquarters_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_operations" ADD CONSTRAINT "faction_operations_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regions" ADD CONSTRAINT "faction_regions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regions" ADD CONSTRAINT "faction_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_decision_id_stage_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_affected_stage_id_quest_stages_id_fk" FOREIGN KEY ("affected_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ADD CONSTRAINT "quest_dependencies_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_dependencies" ADD CONSTRAINT "quest_dependencies_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_twists" ADD CONSTRAINT "quest_twists_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_unlock_conditions" ADD CONSTRAINT "quest_unlock_conditions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_from_stage_id_quest_stages_id_fk" FOREIGN KEY ("from_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD CONSTRAINT "stage_decisions_to_stage_id_quest_stages_id_fk" FOREIGN KEY ("to_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_related_npc_id_npcs_id_fk" FOREIGN KEY ("related_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_factions" ADD CONSTRAINT "npc_factions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_locations" ADD CONSTRAINT "npc_locations_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_locations" ADD CONSTRAINT "npc_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ADD CONSTRAINT "faction_quest_involvement_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_quest_involvement" ADD CONSTRAINT "faction_quest_involvement_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_stage_id_quest_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ADD CONSTRAINT "npc_quest_roles_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_quest_roles" ADD CONSTRAINT "npc_quest_roles_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ADD CONSTRAINT "quest_hook_npcs_hook_id_quest_introductions_id_fk" FOREIGN KEY ("hook_id") REFERENCES "public"."quest_introductions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_hook_npcs" ADD CONSTRAINT "quest_hook_npcs_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_stage_id_quest_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connection_details" ADD CONSTRAINT "region_connection_details_relation_id_region_connections_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."region_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_connection_details" ADD CONSTRAINT "region_connection_details_controlling_faction_factions_id_fk" FOREIGN KEY ("controlling_faction") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;
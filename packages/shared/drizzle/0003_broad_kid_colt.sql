CREATE TABLE "conflict_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"conflict_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"role" text NOT NULL,
	"motivation" text NOT NULL,
	"public_stance" text NOT NULL,
	"secret_stance" text NOT NULL,
	"resources" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conflict_progression" (
	"id" serial PRIMARY KEY NOT NULL,
	"conflict_id" serial NOT NULL,
	"quest_id" serial NOT NULL,
	"impact" text DEFAULT 'no_change' NOT NULL,
	"notes" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major_conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"scope" text NOT NULL,
	"nature" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"cause" text NOT NULL,
	"description" text[] NOT NULL,
	"stakes" text[] NOT NULL,
	"primary_region_id" serial NOT NULL,
	"moral_dilemma" text NOT NULL,
	"possible_outcomes" text[] NOT NULL,
	"hidden_truths" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "major_conflicts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "narrative_foreshadowing" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_stage_id" serial NOT NULL,
	"site_id" serial NOT NULL,
	"npc_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text[] NOT NULL,
	"discovery_condition" text[] NOT NULL,
	"subtlety" text DEFAULT 'moderate' NOT NULL,
	"narrative_weight" text DEFAULT 'supporting' NOT NULL,
	"foreshadows_quest_id" serial NOT NULL,
	"foreshadows_twist_id" serial NOT NULL,
	"foreshadows_npc_id" serial NOT NULL,
	"foreshadows_arc_id" serial NOT NULL,
	"foreshadows_element" text NOT NULL,
	"discovered" boolean DEFAULT false,
	"granted_to_players" timestamp,
	"player_notes" text[] NOT NULL,
	"gm_notes" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arc_membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"arc_id" serial NOT NULL,
	"quest_id" serial NOT NULL,
	"role" text NOT NULL,
	"notes" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "narrative_arcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"promise" text NOT NULL,
	"payoff" text NOT NULL,
	"description" text[] NOT NULL,
	"themes" text[] NOT NULL,
	"foreshadowing_elements" text[] NOT NULL,
	"creative_prompts" text[] NOT NULL,
	CONSTRAINT "narrative_arcs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "world_state_changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text[] NOT NULL,
	"change_type" text NOT NULL,
	"severity" text DEFAULT 'moderate' NOT NULL,
	"visibility" text DEFAULT 'obvious' NOT NULL,
	"timeframe" text DEFAULT 'immediate' NOT NULL,
	"source_type" text NOT NULL,
	"quest_id" serial NOT NULL,
	"decision_id" serial NOT NULL,
	"conflict_id" serial NOT NULL,
	"faction_id" serial NOT NULL,
	"region_id" serial NOT NULL,
	"area_id" serial NOT NULL,
	"site_id" serial NOT NULL,
	"npc_id" serial NOT NULL,
	"recorded_date" timestamp DEFAULT now(),
	"future_quest_id" serial NOT NULL,
	"is_resolved" boolean DEFAULT false,
	"creative_prompts" text[] NOT NULL,
	"gm_notes" text[] NOT NULL,
	CONSTRAINT "world_state_changes_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_participants" ADD CONSTRAINT "conflict_participants_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_progression" ADD CONSTRAINT "conflict_progression_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conflict_progression" ADD CONSTRAINT "conflict_progression_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_conflicts" ADD CONSTRAINT "major_conflicts_primary_region_id_regions_id_fk" FOREIGN KEY ("primary_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_quest_id_quests_id_fk" FOREIGN KEY ("foreshadows_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_twist_id_quest_twists_id_fk" FOREIGN KEY ("foreshadows_twist_id") REFERENCES "public"."quest_twists"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_npc_id_npcs_id_fk" FOREIGN KEY ("foreshadows_npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_arc_id_narrative_arcs_id_fk" FOREIGN KEY ("foreshadows_arc_id") REFERENCES "public"."narrative_arcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arc_membership" ADD CONSTRAINT "arc_membership_arc_id_narrative_arcs_id_fk" FOREIGN KEY ("arc_id") REFERENCES "public"."narrative_arcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arc_membership" ADD CONSTRAINT "arc_membership_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_decision_id_stage_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_conflict_id_major_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."major_conflicts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_future_quest_id_quests_id_fk" FOREIGN KEY ("future_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;
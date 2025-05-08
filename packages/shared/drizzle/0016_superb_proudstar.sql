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
	CONSTRAINT "narrative_events_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "quest_twists" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "quest_twists" CASCADE;--> statement-breakpoint
ALTER TABLE "arc_membership" RENAME TO "destination_contribution";--> statement-breakpoint
ALTER TABLE "narrative_arcs" RENAME TO "narrative_destinations";--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" RENAME COLUMN "foreshadows_twist_id" TO "foreshadows_event_id";--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" RENAME COLUMN "foreshadows_arc_id" TO "foreshadows_destination_id";--> statement-breakpoint
-- Set foreshadows_event_id and foreshadows_destination_id to NULL to avoid foreign key constraint violations
UPDATE "narrative_foreshadowing" SET "foreshadows_event_id" = NULL, "foreshadows_destination_id" = NULL;--> statement-breakpoint
ALTER TABLE "destination_contribution" RENAME COLUMN "arc_id" TO "destination_id";--> statement-breakpoint
ALTER TABLE "world_state_changes" RENAME COLUMN "arc_id" TO "destination_id";--> statement-breakpoint
ALTER TABLE "narrative_destinations" DROP CONSTRAINT "narrative_arcs_name_unique";--> statement-breakpoint
-- ALTER TABLE "narrative_foreshadowing" DROP CONSTRAINT "narrative_foreshadowing_foreshadows_twist_id_quest_twists_id_fk";
--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" DROP CONSTRAINT "narrative_foreshadowing_foreshadows_arc_id_narrative_arcs_id_fk";
--> statement-breakpoint
ALTER TABLE "destination_contribution" DROP CONSTRAINT "arc_membership_arc_id_narrative_arcs_id_fk";
--> statement-breakpoint
ALTER TABLE "destination_contribution" DROP CONSTRAINT "arc_membership_quest_id_quests_id_fk";
--> statement-breakpoint
ALTER TABLE "world_state_changes" DROP CONSTRAINT "world_state_changes_arc_id_narrative_arcs_id_fk";
--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "base_capability_score" integer;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "base_proactivity_score" integer;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "base_relatability_score" integer;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD COLUMN "importance" text DEFAULT 'standard' NOT NULL;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD COLUMN "failure_leads_to_retry" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "stage_decisions" ADD COLUMN "failure_lesson_learned" text DEFAULT 'Player must learn from this failure';--> statement-breakpoint
ALTER TABLE "stage_decisions" ALTER COLUMN "failure_lesson_learned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_quest_stage_id_quest_stages_id_fk" FOREIGN KEY ("quest_stage_id") REFERENCES "public"."quest_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_triggering_decision_id_stage_decisions_id_fk" FOREIGN KEY ("triggering_decision_id") REFERENCES "public"."stage_decisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_events" ADD CONSTRAINT "narrative_events_related_quest_id_quests_id_fk" FOREIGN KEY ("related_quest_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_event_id_narrative_events_id_fk" FOREIGN KEY ("foreshadows_event_id") REFERENCES "public"."narrative_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" ADD CONSTRAINT "narrative_foreshadowing_foreshadows_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("foreshadows_destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_contribution" ADD CONSTRAINT "destination_contribution_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destination_contribution" ADD CONSTRAINT "destination_contribution_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "world_state_changes" ADD CONSTRAINT "world_state_changes_destination_id_narrative_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."narrative_destinations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" DROP COLUMN "discovered";--> statement-breakpoint
ALTER TABLE "narrative_foreshadowing" DROP COLUMN "granted_to_players";--> statement-breakpoint
ALTER TABLE "narrative_destinations" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "world_state_changes" DROP COLUMN "recorded_date";--> statement-breakpoint
ALTER TABLE "world_state_changes" DROP COLUMN "is_resolved";--> statement-breakpoint
ALTER TABLE "narrative_destinations" ADD CONSTRAINT "narrative_destinations_name_unique" UNIQUE("name");
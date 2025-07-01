CREATE TABLE "npc_details" (
	"npc_id" integer PRIMARY KEY NOT NULL,
	"alignment" text NOT NULL,
	"wealth" text NOT NULL,
	"availability" text NOT NULL,
	"adaptability" text NOT NULL,
	"complexity" text NOT NULL,
	"goals_and_fears" text[] NOT NULL,
	"secrets_and_history" text[] NOT NULL,
	"capability" text NOT NULL,
	"proactivity" text NOT NULL,
	"relatability" text NOT NULL,
	"biases" text[] NOT NULL,
	"preferred_topics" text[] NOT NULL,
	"avoid_topics" text[] NOT NULL,
	"knowledge" text[] NOT NULL,
	"rumours" text[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "npc_site_associations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "npc_site_associations" CASCADE;--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" DROP CONSTRAINT "npc_faction_memberships_npc_id_faction_id_unique";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP CONSTRAINT "npc_relations_source_npc_id_target_npc_id_relationship_type_unique";--> statement-breakpoint
ALTER TABLE "npcs" ALTER COLUMN "voice_notes" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "npc_relations" ADD COLUMN "relationship" text NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_relations" ADD COLUMN "dynamics_and_history" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "summary" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "site_id" integer;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "social_status_and_reputation" text NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "roleplaying_guide" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "conversation_hooks" text NOT NULL;--> statement-breakpoint
ALTER TABLE "npc_details" ADD CONSTRAINT "npc_details_npc_id_npcs_id_fk" FOREIGN KEY ("npc_id") REFERENCES "public"."npcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "relationship_type";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "strength";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "history";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "narrative_tensions";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "shared_goals";--> statement-breakpoint
ALTER TABLE "npc_relations" DROP COLUMN "relationship_dynamics";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "creative_prompts";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "alignment";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "trust_level";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "wealth";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "adaptability";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "complexity_profile";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "player_perception_goal";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "availability";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "capability";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "proactivity";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "relatability";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "disposition";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "social_status";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "current_goals";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "avoid_topics";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "background";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "biases";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "dialogue";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "drives";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "fears";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "knowledge";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "mannerisms";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "personality_traits";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "preferred_topics";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "rumours";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "secrets";--> statement-breakpoint
ALTER TABLE "npc_faction_memberships" ADD CONSTRAINT "unique_npc_faction_membership" UNIQUE("npc_id","faction_id");--> statement-breakpoint
ALTER TABLE "npc_relations" ADD CONSTRAINT "unique_npc_relationship" UNIQUE("source_npc_id","target_npc_id");
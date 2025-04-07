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
	CONSTRAINT "faction_agendas_name_unique" UNIQUE("name"),
	CONSTRAINT "faction_agendas_faction_id_name_unique" UNIQUE("faction_id","name")
);
--> statement-breakpoint
DROP TABLE "faction_operations" CASCADE;--> statement-breakpoint
ALTER TABLE "faction_agendas" ADD CONSTRAINT "faction_agendas_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;
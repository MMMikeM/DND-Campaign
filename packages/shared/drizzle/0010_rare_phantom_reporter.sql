CREATE TABLE "embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"embedding" vector(3072) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clues" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "faction_culture" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "faction_operations" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "factions" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "npcs" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "areas" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "embedding_id" integer;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_culture" ADD CONSTRAINT "faction_culture_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_operations" ADD CONSTRAINT "faction_operations_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factions" ADD CONSTRAINT "factions_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npcs" ADD CONSTRAINT "npcs_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_embedding_id_embeddings_id_fk" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "faction_culture" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "faction_operations" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "factions" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "npcs" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "quest_stages" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "quests" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "embedding";
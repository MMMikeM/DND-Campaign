CREATE TABLE "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_id" serial NOT NULL,
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
	"embedding" vector(3072),
	CONSTRAINT "areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "location_encounters" RENAME TO "site_encounters";--> statement-breakpoint
ALTER TABLE "location_links" RENAME TO "site_links";--> statement-breakpoint
ALTER TABLE "location_secrets" RENAME TO "site_secrets";--> statement-breakpoint
ALTER TABLE "locations" RENAME TO "sites";--> statement-breakpoint
ALTER TABLE "site_encounters" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "site_links" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "site_links" RENAME COLUMN "other_location_id" TO "other_site_id";--> statement-breakpoint
ALTER TABLE "site_secrets" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "sites" RENAME COLUMN "location_type" TO "site_type";--> statement-breakpoint
ALTER TABLE "faction_headquarters" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "quest_stages" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "npc_locations" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "clues" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "faction_regional_power" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "quest_introductions" RENAME COLUMN "location_id" TO "site_id";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP CONSTRAINT "location_encounters_name_unique";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP CONSTRAINT "location_encounters_location_id_name_unique";--> statement-breakpoint
ALTER TABLE "site_links" DROP CONSTRAINT "location_links_location_id_other_location_id_unique";--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "locations_name_unique";--> statement-breakpoint
ALTER TABLE "faction_headquarters" DROP CONSTRAINT "faction_headquarters_faction_id_location_id_unique";--> statement-breakpoint
ALTER TABLE "npc_locations" DROP CONSTRAINT "npc_locations_npc_id_location_id_unique";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP CONSTRAINT "location_encounters_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "site_links" DROP CONSTRAINT "location_links_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "site_links" DROP CONSTRAINT "location_links_other_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "site_secrets" DROP CONSTRAINT "location_secrets_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "sites" DROP CONSTRAINT "locations_region_id_regions_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_headquarters" DROP CONSTRAINT "faction_headquarters_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "quest_stages" DROP CONSTRAINT "quest_stages_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "npc_locations" DROP CONSTRAINT "npc_locations_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "clues" DROP CONSTRAINT "clues_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_regional_power" DROP CONSTRAINT "faction_regional_power_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "quest_introductions" DROP CONSTRAINT "quest_introductions_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "area_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD COLUMN "area_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "site_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_other_site_id_sites_id_fk" FOREIGN KEY ("other_site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_secrets" ADD CONSTRAINT "site_secrets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_headquarters" ADD CONSTRAINT "faction_headquarters_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_stages" ADD CONSTRAINT "quest_stages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npc_locations" ADD CONSTRAINT "npc_locations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clues" ADD CONSTRAINT "clues_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_regional_power" ADD CONSTRAINT "faction_regional_power_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_introductions" ADD CONSTRAINT "quest_introductions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "region_id";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "site_encounters" ADD CONSTRAINT "site_encounters_site_id_name_unique" UNIQUE("site_id","name");--> statement-breakpoint
ALTER TABLE "site_links" ADD CONSTRAINT "site_links_site_id_other_site_id_unique" UNIQUE("site_id","other_site_id");--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "faction_headquarters" ADD CONSTRAINT "faction_headquarters_faction_id_site_id_unique" UNIQUE("faction_id","site_id");--> statement-breakpoint
ALTER TABLE "npc_locations" ADD CONSTRAINT "npc_locations_npc_id_site_id_unique" UNIQUE("npc_id","site_id");
ALTER TABLE "faction_regions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "faction_regions" CASCADE;--> statement-breakpoint
ALTER TABLE "faction_regional_power" RENAME TO "faction_territorial_control";--> statement-breakpoint
ALTER TABLE "faction_territorial_control" RENAME COLUMN "power_level" TO "influence_level";--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP CONSTRAINT "faction_regional_power_faction_id_quest_id_region_id_area_id_site_id_unique";--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP CONSTRAINT "faction_regional_power_faction_id_factions_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP CONSTRAINT "faction_regional_power_quest_id_quests_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP CONSTRAINT "faction_regional_power_region_id_regions_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP CONSTRAINT "faction_regional_power_area_id_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP CONSTRAINT "faction_regional_power_site_id_sites_id_fk";
--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD COLUMN "presence" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD COLUMN "priorities" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_territorial_control" DROP COLUMN "quest_id";--> statement-breakpoint
ALTER TABLE "faction_territorial_control" ADD CONSTRAINT "faction_territorial_control_faction_id_region_id_area_id_site_id_unique" UNIQUE("faction_id","region_id","area_id","site_id");
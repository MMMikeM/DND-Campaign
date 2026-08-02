ALTER TABLE "site_encounters" DROP CONSTRAINT "chk_timer_details_if_has_timer";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP CONSTRAINT "chk_no_timer_details_if_no_timer";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP CONSTRAINT "chk_objective_details_for_non_deathmatch";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP CONSTRAINT "chk_proficiency_bonus_range";--> statement-breakpoint
ALTER TABLE "site_encounters" ALTER COLUMN "objective_details" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "site_secrets" DROP CONSTRAINT IF EXISTS "site_secrets_pkey";--> statement-breakpoint
ALTER TABLE "site_secrets" ADD PRIMARY KEY ("site_id");--> statement-breakpoint
ALTER TABLE "map_variants" ADD COLUMN "atmosphere_and_sensory_details" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "map_variants" ADD COLUMN "tactical_features" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "areas" ADD COLUMN "culture_and_leadership" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "areas" ADD COLUMN "features_and_hazards" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "areas" ADD COLUMN "lore_and_secrets" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "atmosphere_and_culture" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "features_and_hazards" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "history_and_economy" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "lore_and_secrets" text[] NOT NULL DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "cover_options";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "elevation_features";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "movement_routes";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "difficult_terrain";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "choke_points";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "sight_lines";--> statement-breakpoint
ALTER TABLE "map_variants" DROP COLUMN "tactical_positions";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "creative_prompts";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "danger_level";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "atmosphere_type";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "revelation_layers_summary";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "leadership";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "population";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "primary_activity";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "cultural_notes";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "hazards";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "points_of_interest";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "rumors";--> statement-breakpoint
ALTER TABLE "areas" DROP COLUMN "defenses";--> statement-breakpoint
ALTER TABLE "region_connections" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "creative_prompts";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "atmosphere_type";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "revelation_layers_summary";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "economy";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "history";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "population";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "cultural_notes";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "hazards";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "points_of_interest";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "rumors";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "secrets";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "defenses";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "has_timer";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "timer_value";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "timer_unit";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "timer_consequence";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "core_enemy_groups";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "synergy_description";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "encounter_category";--> statement-breakpoint
ALTER TABLE "site_encounters" DROP COLUMN "recommended_proficiency_bonus";--> statement-breakpoint
ALTER TABLE "site_links" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "creative_prompts";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "site_secrets" DROP COLUMN "consequences";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "gm_notes";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "site_type";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "terrain";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "climate";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "mood";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "environment";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "creatures";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "features";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "treasures";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "lighting_description";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "soundscape";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "smells";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "weather";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "descriptors";--> statement-breakpoint
ALTER TABLE "map_variants" ADD CONSTRAINT "map_variants_name_unique" UNIQUE("name");
ALTER TABLE `faction_influence` ADD `region_id` integer REFERENCES regions(id);--> statement-breakpoint
ALTER TABLE `faction_influence` ADD `location_id` integer REFERENCES locations(id);
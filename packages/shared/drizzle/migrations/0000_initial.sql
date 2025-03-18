-- Create the main quests table
CREATE TABLE IF NOT EXISTS quests (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    description TEXT NOT NULL,
    adaptable INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    reward TEXT,
    giver_id TEXT,
    location_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the quest stages table
CREATE TABLE IF NOT EXISTS quest_stages (
    quest_id TEXT NOT NULL,
    stage INTEGER NOT NULL,
    title TEXT NOT NULL,
    PRIMARY KEY (quest_id, stage),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest objectives table
CREATE TABLE IF NOT EXISTS quest_objectives (
    quest_id TEXT NOT NULL,
    stage INTEGER NOT NULL,
    objective TEXT NOT NULL,
    PRIMARY KEY (quest_id, stage, objective),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest completion paths table
CREATE TABLE IF NOT EXISTS quest_completion_paths (
    quest_id TEXT NOT NULL,
    stage INTEGER NOT NULL,
    path_name TEXT NOT NULL,
    description TEXT NOT NULL,
    challenges TEXT NOT NULL,
    outcomes TEXT NOT NULL,
    PRIMARY KEY (quest_id, stage, path_name),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest decision points table
CREATE TABLE IF NOT EXISTS quest_decision_points (
    quest_id TEXT NOT NULL,
    stage INTEGER NOT NULL,
    decision TEXT NOT NULL,
    PRIMARY KEY (quest_id, stage, decision),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest decision choices table
CREATE TABLE IF NOT EXISTS quest_decision_choices (
    quest_id TEXT NOT NULL,
    stage INTEGER NOT NULL,
    decision TEXT NOT NULL,
    choice TEXT NOT NULL,
    consequences TEXT NOT NULL,
    PRIMARY KEY (quest_id, stage, decision, choice),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest twists table
CREATE TABLE IF NOT EXISTS quest_twists (
    quest_id TEXT NOT NULL,
    twist TEXT NOT NULL,
    PRIMARY KEY (quest_id, twist),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest rewards table
CREATE TABLE IF NOT EXISTS quest_rewards (
    quest_id TEXT NOT NULL,
    reward_path TEXT NOT NULL,
    reward TEXT NOT NULL,
    PRIMARY KEY (quest_id, reward_path, reward),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest follow-ups table
CREATE TABLE IF NOT EXISTS quest_follow_ups (
    quest_id TEXT NOT NULL,
    path TEXT NOT NULL,
    follow_up_id TEXT NOT NULL,
    PRIMARY KEY (quest_id, path, follow_up_id),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the related quests table
CREATE TABLE IF NOT EXISTS quest_related (
    quest_id TEXT NOT NULL,
    related_id TEXT NOT NULL,
    PRIMARY KEY (quest_id, related_id),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the quest associated NPCs table
CREATE TABLE IF NOT EXISTS quest_associated_npcs (
    quest_id TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    PRIMARY KEY (quest_id, npc_id),
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create the main NPCs table
CREATE TABLE IF NOT EXISTS npcs (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    race TEXT NOT NULL,
    gender TEXT NOT NULL,
    occupation TEXT NOT NULL,
    role TEXT,
    quirk TEXT,
    background TEXT NOT NULL,
    motivation TEXT NOT NULL,
    secret TEXT NOT NULL,
    stats TEXT NOT NULL
);

-- Create the NPC descriptions table
CREATE TABLE IF NOT EXISTS npc_descriptions (
    npc_id TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (npc_id, description),
    FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Create the NPC personality traits table
CREATE TABLE IF NOT EXISTS npc_personality_traits (
    npc_id TEXT NOT NULL,
    trait TEXT NOT NULL,
    PRIMARY KEY (npc_id, trait),
    FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Create the NPC quests table
CREATE TABLE IF NOT EXISTS npc_quests (
    npc_id TEXT NOT NULL,
    quest_id TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (npc_id, quest_id),
    FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Create the NPC relationships table
CREATE TABLE IF NOT EXISTS npc_relationships (
    npc_id TEXT NOT NULL,
    related_npc_id TEXT NOT NULL,
    relationship TEXT NOT NULL,
    PRIMARY KEY (npc_id, related_npc_id),
    FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Create the NPC locations table
CREATE TABLE IF NOT EXISTS npc_locations (
    npc_id TEXT NOT NULL,
    location_id TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (npc_id, location_id),
    FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Create the NPC inventory table
CREATE TABLE IF NOT EXISTS npc_inventory (
    npc_id TEXT NOT NULL,
    item TEXT NOT NULL,
    PRIMARY KEY (npc_id, item),
    FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE
);

-- Create the main factions table
CREATE TABLE IF NOT EXISTS factions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    alignment TEXT,
    description TEXT,
    public_goal TEXT,
    true_goal TEXT,
    headquarters TEXT,
    territory TEXT,
    history TEXT,
    notes TEXT
);

-- Create the faction resources table
CREATE TABLE IF NOT EXISTS faction_resources (
    faction_id TEXT NOT NULL,
    resource TEXT NOT NULL,
    PRIMARY KEY (faction_id, resource),
    FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
);

-- Create the faction leadership table
CREATE TABLE IF NOT EXISTS faction_leadership (
    faction_id TEXT NOT NULL,
    leader_id TEXT NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY (faction_id, leader_id),
    FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
);

-- Create the faction allies table
CREATE TABLE IF NOT EXISTS faction_allies (
    faction_id TEXT NOT NULL,
    ally_id TEXT NOT NULL,
    PRIMARY KEY (faction_id, ally_id),
    FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
);

-- Create the faction enemies table
CREATE TABLE IF NOT EXISTS faction_enemies (
    faction_id TEXT NOT NULL,
    enemy_id TEXT NOT NULL,
    PRIMARY KEY (faction_id, enemy_id),
    FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
);

-- Create the faction quests table
CREATE TABLE IF NOT EXISTS faction_quests (
    faction_id TEXT NOT NULL,
    quest_id TEXT NOT NULL,
    PRIMARY KEY (faction_id, quest_id),
    FOREIGN KEY (faction_id) REFERENCES factions(id) ON DELETE CASCADE
);

-- Create the main locations table
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    region TEXT,
    description TEXT NOT NULL,
    history TEXT,
    danger_level TEXT,
    faction_control TEXT
);

-- Create the location notable features table
CREATE TABLE IF NOT EXISTS location_notable_features (
    location_id TEXT NOT NULL,
    feature TEXT NOT NULL,
    PRIMARY KEY (location_id, feature),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the location NPCs table
CREATE TABLE IF NOT EXISTS location_npcs (
    location_id TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    PRIMARY KEY (location_id, npc_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the location factions table
CREATE TABLE IF NOT EXISTS location_factions (
    location_id TEXT NOT NULL,
    faction_id TEXT NOT NULL,
    PRIMARY KEY (location_id, faction_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the location points of interest table
CREATE TABLE IF NOT EXISTS location_points_of_interest (
    location_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (location_id, name),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the location connections table
CREATE TABLE IF NOT EXISTS location_connections (
    location_id TEXT NOT NULL,
    connected_location_id TEXT NOT NULL,
    PRIMARY KEY (location_id, connected_location_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the location districts table
CREATE TABLE IF NOT EXISTS location_districts (
    location_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (location_id, name),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the district features table
CREATE TABLE IF NOT EXISTS district_features (
    location_id TEXT NOT NULL,
    district_name TEXT NOT NULL,
    feature TEXT NOT NULL,
    PRIMARY KEY (location_id, district_name, feature),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the district NPCs table
CREATE TABLE IF NOT EXISTS district_npcs (
    location_id TEXT NOT NULL,
    district_name TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    PRIMARY KEY (location_id, district_name, npc_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the location areas table
CREATE TABLE IF NOT EXISTS location_areas (
    location_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    PRIMARY KEY (location_id, name),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the area features table
CREATE TABLE IF NOT EXISTS area_features (
    location_id TEXT NOT NULL,
    area_name TEXT NOT NULL,
    feature TEXT NOT NULL,
    PRIMARY KEY (location_id, area_name, feature),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the area encounters table
CREATE TABLE IF NOT EXISTS area_encounters (
    location_id TEXT NOT NULL,
    area_name TEXT NOT NULL,
    encounter TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    PRIMARY KEY (location_id, area_name, encounter),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the area treasures table
CREATE TABLE IF NOT EXISTS area_treasures (
    location_id TEXT NOT NULL,
    area_name TEXT NOT NULL,
    treasure TEXT NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY (location_id, area_name, treasure),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- Create the area NPCs table
CREATE TABLE IF NOT EXISTS area_npcs (
    location_id TEXT NOT NULL,
    area_name TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    PRIMARY KEY (location_id, area_name, npc_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
); 
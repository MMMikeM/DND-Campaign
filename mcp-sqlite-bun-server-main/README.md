# DND Campaign Manager - SQLite Backend

This server provides a SQLite-based backend for managing a Dungeons & Dragons campaign. It uses the Model Context Protocol (MCP) to expose a set of tools for managing quests, NPCs, factions, and locations.

## Features

- **Quests**: Create, retrieve, update, and delete quests, including stages, objectives, decision points, and rewards
- **NPCs**: Manage non-player characters, including their descriptions, relationships, and inventory
- **Factions**: Manage factions, including their leadership, members, resources, and relationships
- **Locations**: Manage locations, including points of interest, areas, districts, and features

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)

### Installation

1. Clone the repository
2. Install dependencies: `bun install`
3. Start the server: `bun start`

## API Usage

The server exposes the following tools via the Model Context Protocol:

### Quest Tools

- `create-quest`: Create a new quest
- `get-quest`: Get a quest by ID
- `update-quest`: Update an existing quest
- `delete-quest`: Delete a quest

### NPC Tools

- `create-npc`: Create a new NPC
- `get-npc`: Get an NPC by ID
- `update-npc`: Update an existing NPC
- `delete-npc`: Delete an NPC

### Faction Tools

- `create-faction`: Create a new faction
- `get-faction`: Get a faction by ID
- `update-faction`: Update an existing faction
- `delete-faction`: Delete a faction

### Location Tools

- `create-location`: Create a new location
- `get-location`: Get a location by ID
- `update-location`: Update an existing location
- `delete-location`: Delete a location

### SQL Tools

- `read-query`: Execute a read-only SQL query
- `write-query`: Execute a write SQL query
- `create-table`: Create a new table in the database
- `list-tables`: List all tables in the database
- `describe-table`: Get schema information for a table

## Data Schema

The data schema for this server is based on the [Tome Keeper](https://github.com/yourusername/tome-keeper) project. The schema includes:

- **Quests**: Main quests, side quests, and adventures
- **NPCs**: Characters, their descriptions, relationships, and inventory
- **Factions**: Organizations, their leadership, members, and relationships
- **Locations**: Places, their features, NPCs, and connections

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Shared Package for DND Campaign Manager

This package contains shared code and utilities used across the DND Campaign Manager application.

## Database Implementation

The database implementation uses:

- SQLite for storage through `better-sqlite3`
- Drizzle ORM for database operations
- Drizzle-Zod for schema validation and TypeScript type generation

### Schema Structure

The database is structured with the following entities:

- NPCs - Characters in the game world
- Quests - Adventures for the players
- Factions - Organizations and groups
- Locations - Places in the game world

### Migration Progress

- [x] NPCs migrated to Drizzle ORM
- [ ] Quests to be migrated
- [ ] Factions to be migrated
- [ ] Locations to be migrated

## Testing

Run all tests:
```
pnpm test
```

Run NPC-specific tests:
```
pnpm test:npc
```

Run Quest-specific tests:
```
pnpm test:quest
```

Run Faction-specific tests:
```
pnpm test:faction
```

Run Location-specific tests:
```
pnpm test:location
```

These tests will create a test database, insert sample data, and verify that all operations work correctly.

## Development

To build the package:

```
pnpm build
```

To watch for changes during development:

```
pnpm dev
``` 
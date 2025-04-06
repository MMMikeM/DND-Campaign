import { initializeDatabase } from "@tome-master/shared"

export const db = initializeDatabase("postgres://postgres:postgres@localhost:5432/dnd_campaign")

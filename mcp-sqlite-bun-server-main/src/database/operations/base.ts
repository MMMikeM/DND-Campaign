import { Database } from "bun:sqlite"
import type { SQLQueryBindings } from "bun:sqlite"
import type { DatabaseTransaction } from "./types"

/**
 * Base class for SQLite operations
 */
export class SQLiteBaseOperations {
  protected db: Database

  constructor(db: Database) {
    this.db = db
  }

  /**
   * Start a transaction
   */
  transaction(): DatabaseTransaction {
    this.db.exec("BEGIN TRANSACTION")
    
    return {
      commit: () => {
        this.db.exec("COMMIT")
      },
      rollback: () => {
        this.db.exec("ROLLBACK")
      },
    }
  }

  /**
   * Prepare a SQL statement
   */
  prepare<Params extends SQLQueryBindings, Result extends any[] = any[]>(sql: string) {
    return this.db.prepare<Params, Result>(sql)
  }

  /**
   * Execute a SQL command
   */
  exec(sql: string): void {
    this.db.exec(sql)
  }

  /**
   * Query for multiple rows
   */
  query<T = any>(sql: string): T[] {
    return this.db.query<T, any[]>(sql).all()
  }

  /**
   * Get a single record
   */
  get<T = any>(sql: string): T | null {
    return this.db.query<T, any[]>(sql).get() as T | null
  }
} 
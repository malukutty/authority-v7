import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

type UsageEventRow = {
  id: number;
  provider: "openai" | "anthropic";
  model: string;
  agent: string;
  task: string;
  route: string;
  user_id: string;
  request_id: string;
  parent_request_id: string | null;
  attempt: number;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  cost_usd: number;
  status: "ok" | "blocked" | "error";
  created_at: string;
};

type MemoryDb = {
  kind: "memory";
  rows: UsageEventRow[];
  nextId: number;
};

type SqliteDb = {
  kind: "sqlite";
  db: Database.Database;
};

export type AuthorityDb = MemoryDb | SqliteDb;

const storage = process.env.AUTHORITY_STORAGE ?? "sqlite";

function createSqliteDb(): SqliteDb {
  const authorityDir = path.resolve(process.cwd(), ".authority");
  const dbPath = path.join(authorityDir, "authority.db");

  if (!fs.existsSync(authorityDir)) {
    fs.mkdirSync(authorityDir, { recursive: true });
  }

  console.log("Authority DB mode: sqlite");
  console.log("Authority DB path:", dbPath);

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS usage_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      agent TEXT NOT NULL,
      task TEXT NOT NULL,
      route TEXT NOT NULL,
      user_id TEXT NOT NULL,
      request_id TEXT NOT NULL,
      parent_request_id TEXT,
      attempt INTEGER NOT NULL,
      input_tokens INTEGER NOT NULL,
      output_tokens INTEGER NOT NULL,
      latency_ms INTEGER NOT NULL,
      cost_usd REAL NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_usage_created_at ON usage_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_usage_agent ON usage_events(agent);
    CREATE INDEX IF NOT EXISTS idx_usage_task ON usage_events(task);
    CREATE INDEX IF NOT EXISTS idx_usage_model ON usage_events(model);
    CREATE INDEX IF NOT EXISTS idx_usage_request_id ON usage_events(request_id);
  `);

  return { kind: "sqlite", db };
}

function createMemoryDb(): MemoryDb {
  console.log("Authority DB mode: memory");
  return {
    kind: "memory",
    rows: [],
    nextId: 1
  };
}

export const authorityDb: AuthorityDb =
  storage === "memory" ? createMemoryDb() : createSqliteDb(); 

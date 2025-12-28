import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import { config } from "../../config/index.js";

let db: Database | null = null;

/**
 * データベース接続インスタンスを取得
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error("データベースが初期化されていません");
  }
  return db;
}

/**
 * データベースの初期化（テーブル作成）
 */
export async function initializeDatabase(): Promise<void> {
  const SQL = await initSqlJs();

  // 既存のDBファイルがあれば読み込む
  if (fs.existsSync(config.dbPath)) {
    const buffer = fs.readFileSync(config.dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  saveDatabase();
}

/**
 * データベースをファイルに保存
 */
export function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(config.dbPath, buffer);
}



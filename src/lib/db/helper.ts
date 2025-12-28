import { getDatabase, saveDatabase } from "./index.js";

/**
 * データベース操作のヘルパー関数
 *
 * 例:
 *   findAll<Note>("notes")  → Note型の配列を返す
 *   findAll<User>("users")  → User型の配列を返す
 */

/**
 * 全件取得
 *
 * @example
 *   const notes = findAll<Note>("notes");
 *   const notes = findAll<Note>("notes", "id DESC");
 */
export function findAll<T>(table: string, orderBy?: string): T[] {
  const db = getDatabase();
  const results: T[] = [];

  let sql = `SELECT * FROM ${table}`;
  if (orderBy) {
    sql += ` ORDER BY ${orderBy}`;
  }

  const stmt = db.prepare(sql);
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();

  return results;
}

/**
 * ID検索
 *
 * @example
 *   const note = findById<Note>("notes", 1);
 */
export function findById<T>(table: string, id: number): T | null {
  const db = getDatabase();

  const sql = `SELECT * FROM ${table} WHERE id = ${id}`;
  const stmt = db.prepare(sql);

  if (stmt.step()) {
    const row = stmt.getAsObject() as T;
    stmt.free();
    return row;
  }

  stmt.free();
  return null;
}

/**
 * 存在確認
 *
 * @example
 *   const exists = existsById("notes", 1);
 */
export function existsById(table: string, id: number): boolean {
  const db = getDatabase();

  const sql = `SELECT 1 FROM ${table} WHERE id = ${id}`;
  const stmt = db.prepare(sql);

  const exists = stmt.step();
  stmt.free();

  return exists;
}

/**
 * 作成（オブジェクトを渡すだけ）
 *
 * @example
 *   const id = insert("notes", { title: "タイトル", content: "内容" });
 */
export function insert<T extends object>(table: string, data: T): number {
  const db = getDatabase();

  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => "?").join(", ");

  const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`;
  db.run(sql, values);

  const lastId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
  saveDatabase();

  return lastId;
}

/**
 * 更新（オブジェクトを渡すだけ）
 *
 * @example
 *   update("notes", 1, { title: "新タイトル" });
 */
export function update<T extends object>(table: string, id: number, data: T): void {
  const db = getDatabase();

  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");

  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  db.run(sql, [...values, id]);
  saveDatabase();
}

/**
 * 削除
 *
 * @example
 *   destroy("notes", 1);
 */
export function destroy(table: string, id: number): void {
  const db = getDatabase();
  const sql = `DELETE FROM ${table} WHERE id = ${id}`;
  db.run(sql);
  saveDatabase();
}

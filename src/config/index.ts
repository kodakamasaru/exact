/**
 * アプリケーション設定
 */
export const config = {
  /** サーバーポート */
  port: Number(process.env.PORT) || 3000,

  /** データベースパス */
  dbPath: "./db.sqlite",
} as const;

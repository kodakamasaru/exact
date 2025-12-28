import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { registerRoutes } from "./app/route/index.js";
import { initializeDatabase } from "./lib/db/index.js";
import { config } from "./config/index.js";

/**
 * アプリケーション起動
 */
async function main(): Promise<void> {
  // データベース初期化
  await initializeDatabase();

  // アプリケーション作成
  const app = new Hono();
  registerRoutes(app);

  // サーバー起動
  serve({
    fetch: app.fetch,
    port: config.port,
  });

  console.log(`🚀 サーバー起動: http://localhost:${config.port}`);
}

main();

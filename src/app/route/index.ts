import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { noteRoutes } from "../note/route.js";

/**
 * ルート登録
 */
export function registerRoutes(app: Hono): void {
  // 静的ファイル配信
  app.use("/public/*", serveStatic({ root: "./" }));

  // ノート機能
  app.route("/", noteRoutes);
}

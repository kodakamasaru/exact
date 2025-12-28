import { Hono } from "hono";
import { NoteController } from "./controller.js";

/**
 * ノート関連のルート定義
 */
export const noteRoutes = new Hono();

// 一覧ページ
noteRoutes.get("/", NoteController.index);

// ノート作成
noteRoutes.post("/create", NoteController.create);

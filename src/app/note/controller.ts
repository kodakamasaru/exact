import type { Context } from "hono";
import { Note, NoteUrl, NoteTemplate } from "./model.js";
import { render } from "../shared/base.js";
import type { NoteIndexViewData } from "./model.js";

/**
 * ノートコントローラー
 */
export const NoteController = {
  /**
   * 一覧ページ
   * GET /
   */
  async index(ctx: Context): Promise<Response> {
    const n = Note.find_all();
    return render<NoteIndexViewData>(ctx, NoteTemplate.index, {
      notes: n,
      url: NoteUrl,
      formData: { title: "", content: "" },
    });
  },
};

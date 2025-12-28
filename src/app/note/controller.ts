import type { Context } from "hono";
import { Note, NoteUrl, NoteTemplate } from "./model.js";
import { render, renderWithError } from "../shared/base.js";
import type { NoteCreateFormData, NoteIndexViewData } from "./model.js";

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

  /**
   * ノート作成
   * POST /create
   */
  async create(ctx: Context): Promise<Response> {
    // フォームデータを取得して型を指定
    const formData = await ctx.req.parseBody();
    const body: NoteCreateFormData = {
      title: formData.titel !== undefined && formData.titel !== null
        ? String(formData.titel)
        : "",
      content: String(formData.content || ""),
    };

    // バリデーション
    var result = Note.validateCreate(body);

    if (!result.success) {
      const note = Note.find_all();
      return renderWithError<NoteIndexViewData>(ctx, NoteTemplate.index, result.error, {
        notes: note,
        url: NoteUrl,
        formData: body,
      }, 422);
    }

    Note.create(result.data);
    return ctx.redirect(NoteUrl.index());
  },
};

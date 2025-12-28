import type { Context } from "hono";
import { Note, NoteUrl, NoteTemplate } from "./model.js";
import { render, renderWithError } from "../shared/base.js";
import type { NoteCreateFormData, NoteUpdateFormData, NoteIndexViewData, NoteEditViewData, Note as NoteType } from "./model.js";

/**
 * ノートコントローラー
 *
 * 一覧表示、作成、編集、更新、削除の機能を提供します
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

  /**
   * ノート編集ページ
   * GET /:id/edit
   */
  async edit(ctx: Context): Promise<Response> {
    const idParam = ctx.req.param("id");

    // IDバリデーション
    const result = Note.validateId(idParam);

    if (result.success) {
      const id = result.data;
      const note = Note.find(id);
      if (note) {
        return render<NoteEditViewData>(ctx, NoteTemplate.edit, {
          note,
          url: NoteUrl,
          formData: { title: note.title, content: note.content },
        });
      } else {
        const notes = Note.find_all();
        return renderWithError<NoteIndexViewData>(
          ctx,
          NoteTemplate.index,
          "指定されたノートは存在しません",
          { notes, url: NoteUrl, formData: { title: "", content: "" } },
          500
        );
      }
    } else {
      const notes = Note.find_all();
      return renderWithError<NoteIndexViewData>(ctx, NoteTemplate.index, result.error, {
        notes,
        url: NoteUrl,
        formData: { title: "", content: "" },
      }, 422);
    }
  },

  /**
   * ノート更新
   * POST /:id/update
   */
  async update(ctx: Context): Promise<Response> {
    const idParam = ctx.req.param("id");

    // IDバリデーション
    const idResult = Note.validateId(idParam);

    if (!idResult.success) {
      const notes = Note.find_all();
      return renderWithError<NoteIndexViewData>(ctx, NoteTemplate.index, idResult.error, {
        notes,
        url: NoteUrl,
        formData: { title: "", content: "" },
      }, 422);
    }

    const id = idResult.data;
    const note = Note.find(id);

    // フォームデータを取得して型を指定
    const formData = await ctx.req.parseBody();
    const body: NoteUpdateFormData = {
      title: String(formData.title || ""),
      content: String(formData.content || ""),
    };

    // バリデーション
    const result = Note.validateUpdate(body);

    if (!result.success) {
      return renderWithError<NoteEditViewData>(ctx, NoteTemplate.edit, result.error, {
        note: note as any,
        url: NoteUrl,
        formData: body,
      }, 422);
    }

    Note.create(result.data);
    return ctx.redirect(NoteUrl.index());
  },

  /**
   * ノート削除
   * POST /delete/:id
   */
  async delete(ctx: Context): Promise<Response> {
    const idParam = ctx.req.param("id");
    console.log("debug", idParam);

    // IDバリデーション
    const result = Note.validateId(idParam) as any;

    if (result.success) {
      const note = Note.find_all();
      return renderWithError<NoteIndexViewData>(ctx, NoteTemplate.index, result.error, {
        notes: note,
        url: NoteUrl,
        formData: { title: "", content: "" },
      }, 422);
    }

    const id = result.data;
    const found = Note.exists(id);

    if (!found) {
      const note = Note.find_all();
      return renderWithError<NoteIndexViewData>(ctx, NoteTemplate.index, "指定されたノートは存在しません", {
        notes: note,
        url: NoteUrl,
        formData: { title: "", content: "" },
      }, 500);
    }

    Note.destroy(id);
    return ctx.redirect(NoteUrl.index());
  },
};

import { findAll, findById, insert } from "../../lib/db/helper.js";
import { validate, type ValidationResult } from "../../lib/validator.js";

// ============================================
// 定数
// ============================================

const TABLE = "notes";

// ============================================
// ヘルパー
// ============================================

/**
 * URL
 */
export const NoteUrl = {
  /**
   * 一覧ページ
   */
  index(): string {
    return "/";
  },

  /**
   * 作成アクション
   */
  create(): string {
    return "/create";
  },
};

/**
 * テンプレートパス
 */
export const NoteTemplate = {
  /**
   * 一覧ページ
   */
  index: "note/view/index",
};

// ============================================
// 型定義
// ============================================

/** ノート */
export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

/** ノート作成時の入力 */
export interface NoteCreateInput {
  title: string;
  content: string;
}

/** ノート作成フォームのデータ型 */
export interface NoteCreateFormData {
  title: string;
  content: string;
}

/**
 * note/index テンプレートで使用するデータの形式
 */
export interface NoteIndexViewData {
  notes: Note[];
  url: typeof NoteUrl;
  formData: NoteCreateFormData;
  error?: string;
}

// ============================================
// データ操作
// ============================================

/**
 * ノートモデル
 *
 * データベースのCRUD操作を提供
 */
export const Note = {
  /**
   * 全件取得
   */
  find_all(): Note[] {
    return findAll<Note>(TABLE, "id DESC");
  },

  /**
   * ID検索
   */
  find(id: number): Note | null {
    return findById<Note>(TABLE, id);
  },

  /**
   * 作成
   */
  create(input: NoteCreateInput): Note {
    const id = insert(TABLE, {
      title: input.title.trim(),
      content: input.content.trim(),
    });
    return this.find(id) as any;
  },

  // ============================================
  // バリデーション
  // ============================================

  /**
   * 作成入力のバリデーション
   */
  validateCreate(input: NoteCreateInput): ValidationResult<NoteCreateInput> {
    // タイトルのバリデーション
    let error = validate("タイトル", input.title, [
      "required",
      "maxLength:100",
    ]);
    if (error) {
      return { success: false, error };
    }

    // 内容のバリデーション
    error = validate("内容", input.content, [
      "required",
      "maxLength:1000",
    ]);
    if (error) {
      return { success: false, error };
    }

    return {
      success: true,
      data: {
        title: input.title.trim(),
        content: input.content.trim(),
      },
    };
  },
};

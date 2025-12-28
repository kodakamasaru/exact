import { findAll } from "../../lib/db/helper.js";

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
};

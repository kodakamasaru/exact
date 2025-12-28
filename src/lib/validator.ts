/**
 * 汎用バリデーションライブラリ
 *
 * 使用例:
 *   const error = validate("タイトル", input.title, ["required", "maxLength:100"]);
 */

/**
 * バリデーションルールの型
 *
 * 利用可能なルール:
 * - "required" : 必須チェック
 * - "maxLength:N" : 最大N文字
 * - "minLength:N" : 最小N文字
 * - "positiveInteger" : 正の整数
 * - "range:MIN:MAX" : 数値範囲
 */
export type ValidationRule =
  | "required"
  | `maxLength:${number}`
  | `minLength:${number}`
  | "positiveInteger"
  | `range:${number}:${number}`;

/**
 * バリデーション結果の型
 *
 * バリデーションが成功した場合は { success: true, data: 値 } の形
 * バリデーションが失敗した場合は { success: false, error: エラーメッセージ } の形
 *
 * 使用例:
 *   const result = Note.validateCreate(input);
 *   if (!result.success) {
 *     // エラーの場合: result.error が使える
 *     return showError(result.error);
 *   }
 *   // 成功の場合: result.data が使える
 *   Note.create(result.data);
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * バリデーションを実行
 *
 * @param fieldName - フィールド名（エラーメッセージに使用）
 * @param value - バリデーション対象の値
 * @param rules - バリデーションルールの配列
 * @returns エラーメッセージ（エラーがなければ null）
 *
 * @example
 *   const error = validate("タイトル", input.title, ["required", "maxLength:100"]);
 */
export function validate(
  fieldName: string,
  value: string,
  rules: ValidationRule[]
): string | null {
  const v = value || "";

  for (const rule of rules) {
    if (rule === "required") {
      if (v.trim() === "") {
        return `${fieldName}を入力してください`;
      }
    } else if (rule.startsWith("maxLength:")) {
      const max = parseInt(rule.split(":")[1]);
      if (v.length > max) {
        return `${fieldName}は${max}文字以内で入力してください`;
      }
    } else if (rule.startsWith("minLength:")) {
      const min = parseInt(rule.split(":")[1]);
      if (v.length < min) {
        return `${fieldName}は${min}文字以上で入力してください`;
      }
    } else if (rule === "positiveInteger") {
      const num = Number(v);
      if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
        return `${fieldName}は正の整数で入力してください`;
      }
    } else if (rule.startsWith("range:")) {
      const parts = rule.split(":");
      const min = parseInt(parts[1]);
      const max = parseInt(parts[2]);
      const num = Number(v);
      if (!isNaN(num)) {
        if (num < min || num > max) {
          return `${fieldName}は${min}から${max}の範囲で入力してください`;
        }
      }
    }
  }

  return null;
}

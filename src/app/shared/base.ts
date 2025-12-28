import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ViewRenderer } from "../../lib/renderer.js";

/**
 * コントローラーで使用するヘルパー関数
 */

/**
 * テンプレートを描画してレスポンスを返す
 *
 * @example
 *   return render(ctx, "note/index", { notes });
 *   return render(ctx, "note/index", { notes }, 404);
 */
export async function render<T extends object>(
  ctx: Context,
  template: string,
  data: T,
  status: ContentfulStatusCode = 200
): Promise<Response> {
  // テンプレート名に .ejs がなければ追加
  const templatePath = template.endsWith(".ejs") ? template : `${template}.ejs`;
  const html = await ViewRenderer.render(templatePath, data);
  return ctx.html(html, status);
}

/**
 * エラーレスポンス生成
 *
 * @example
 *   return renderWithError(ctx, "note/index", result.errors[0], { notes }, 422);
 *   return renderWithError(ctx, "note/index", "ノートが見つかりません", { notes }, 404);
 */
export async function renderWithError<T extends object>(
  ctx: Context,
  template: string,
  error: string,
  data: Omit<T, "error">,
  status: ContentfulStatusCode = 400
): Promise<Response> {
  return render(ctx, template, { ...data, error } as T, status);
}


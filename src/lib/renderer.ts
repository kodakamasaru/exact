import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// appディレクトリへのパス
const APP_DIR = path.join(__dirname, "../app");

/**
 * ビューレンダラー
 *
 * テンプレートファイル（.ejs）は src/app/ 配下の各機能フォルダにあります。
 */
export const ViewRenderer = {
  async render(templateName: string, data: ejs.Data = {}): Promise<string> {
    const templatePath = path.join(APP_DIR, templateName);
    const layoutPath = path.join(APP_DIR, "shared/view/layout.ejs");

    const body = await ejs.renderFile(templatePath, data);
    const html = await ejs.renderFile(layoutPath, { body });

    return html;
  },
};

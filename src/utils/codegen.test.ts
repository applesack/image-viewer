import { describe, test } from "vitest";

const cssVariables = `
      --files-bg: #fbfbfb; /* 默认背景色 */
      --files-b: #ececec; /* 主界面窄框线颜色 */
      --files-tab-ia: #e5e5e5; /* tab项未激活颜色 */
      --files-tab-bb: #d8d8d8; /* tab项下边框颜色 */
      --files-tab-bg: #dad9e1; /* tab栏背景 */
      --files-slider-bg: #f7f7f7; /* 侧边栏背景色 */

      --file-select: #f1f1f2; /* 文件项选中颜色，或者未选中文件的鼠标悬浮颜色 */
      --file-hover: #f4f4f5; /* 已选中文件的鼠标悬浮颜色 */

      --form-bt: #e9e9e9; /* 输入框上边框颜色 */
      --form-inner: #fdfdfd; /* 输入框输入区域颜色 */

      --form-bb: #cfcfcf; /* 输入框下边框颜色 */

      --image-bg: #f3f3f3; /* image-默认背景 used */
      --image-status-bar-bg: #f9f9f9; /* image-工具栏背景 */
      --image-logo-bg: #f4f4f5; /* image-logo颜色 used */
      --image-logo-a-bg: #ebebeb; /* image-logo悬浮颜色 used */
      --image-btn-hover: #eaeaeb; /* image-控制按钮鼠标悬浮颜色 used */
      --image-preview-item-bg: #eae9f0; /* image-预览窗项目背景 */
      --image-preview-item-hover-bg: #e1e1e8; /* image-预览窗项目鼠标悬浮背景 */

      --highlight: #1d6978; /* 高亮色 used */
      --highlight-hover: #137785; /* 高亮色2 used */

      --default: #1b1b1b; /* 默认文本色 used */
      --invert: #ffffff; /* 反色 used */
      --title: #757575; /* 表格表头加粗字体的颜色 */
      --inactive: #757575; /* tab未激活时文本色 */
      --icon-inactive: #ababab; /* 图标不可用时的颜色 used */

      --danger: #c42b1c; /* 危险色 used */
      
      color: var(--default);
  `;

function trimStart(word: string, ch: string): string {
  let breakIdx = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === ch) {
      breakIdx++;
    } else {
      break;
    }
  }
  return word.substring(breakIdx)
}

function themeCodeGen(text: string) {
  const lines = text.split("\n");
  const pureLines: string[] = [];
  for (const line of lines) {
    const rest = line.replace(/\/[*].*[*]\//, "").trim();
    if (rest.length > 0) {
      pureLines.push(rest);
    }
  }
  const keys: string[] = [];
  for (const line of pureLines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx < 0 || !line.startsWith('-')) {
      continue;
    }
    const key = line.substring(0, colonIdx).trim();
    keys.push(key)
  }
  for (const key of keys) {
    console.log(`"${trimStart(key, '-')}": "var(${key})",`)
  }
}

describe("codegen", () => {
  test("theme", () => {
    themeCodeGen(cssVariables);
  });
});

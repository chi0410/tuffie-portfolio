// My Edge 能力卡 icon 內嵌部署
// 依 design-tokens.md「icon 一律 inline SVG 佈署」規則：漸層與動畫（iconFloat）
// 只有在 SVG 直接寫進 DOM 時才會生效，用 <img> 引入會失效。
// 這裡用 Vite 的 ?raw 匯入語法讀原始 SVG 字串，再塞進對應的 [data-icon] 容器。

import aiPrototyping from '../icons/ai-prototyping.svg?raw';
import aiIdeation from '../icons/ai-ideation.svg?raw';
import designClarity from '../icons/design-clarity.svg?raw';

const ICONS = {
  'ai-prototyping': aiPrototyping,
  'ai-ideation': aiIdeation,
  'design-clarity': designClarity,
};

export function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const svg = ICONS[el.dataset.icon];
    if (svg) el.innerHTML = svg;
  });
}

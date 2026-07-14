# 金絲桃個人作品集網站 — Claude Code 交接包

交接日期：2026-07-14
交接來源：Claude.ai 設計迭代階段（IA → 文案 → Design Token → 視覺定案 → Prototype）
本包定位：**正式建站的唯一依據**。所有設計決策已收斂完畢，Claude Code 階段的任務是「照基準蓋房子」，不是重新設計。

---

## 0. 給 Claude Code 的第一條指令

> 讀完本 README 與 docs/ 內四份文件後再動工。`prototype/homepage-prototype.html` 是**視覺與互動基準**——正式版的首頁外觀、動效、行為以它為準重構，除非文件另有標注，不自行更動設計決策。有疑義先問金絲桃，不要擅自決定（協作規範見 tuffie-agent skill）。

---

## 1. 檔案清單

```
handoff/
├── README.md                 ← 本文件
├── docs/
│   ├── portfolio-spec.md     ← 需求規格書 v2.0 終版（架構、各頁需求、素材狀態、Backlog）
│   ├── design-tokens.md      ← Design Tokens v2.1 終版（色彩、字體、玻璃、織紋、動效全規則）
│   ├── homepage-copy-draft.md← 首頁文案終稿（中英雙語，i18n 資料來源）
│   └── about-page-copy-draft.md ← About 頁文案終稿（中英雙語）
├── prototype/
│   └── homepage-prototype.html ← 視覺基準（單檔、素材內嵌，直接開瀏覽器可看）
└── assets/
    ├── logo.svg              ← 金絲桃 Logo（黑色原檔；深底使用時染 #F4E1D5）
    ├── photo-cutout.png      ← 去背形象照（原始尺寸）
    ├── covers/               ← 3 張專案封面（透明底 PNG 成品，source of truth）
    └── icons/                ← 9 顆能力／價值 icon（90×90 彩色 SVG）
```

## 2. 建站範圍（本次）

- **首頁**（依 prototype）＋ **About 頁**（文案在 docs，版面延用首頁設計語言，需與金絲桃確認佈局）
- **i18n 中英雙語**：文案集中於結構化檔案（JSON），語言切換即換資料；文案以 docs 兩份 copy 文件為準
- **Header**：懸浮玻璃膠囊、錨點捲動、scroll spy；About 同分頁跳轉；Resume 依語言新開分頁連對應 PDF（Google Drive，⚠️ 上線前請金絲桃確認共用權限為「知道連結者可檢視」）
- **專案內頁 × 3**：本次**不做**，但路由與「進入內頁」的卡片行為要預留（暫以佔位頁或 toast 處理，與金絲桃確認）

## 3. 技術建議（待金絲桃確認後執行）

- 靜態站：Vite ＋（vanilla 或 React 擇一，以金絲桃既有 Claude Code + GitHub + Vercel 流程為準）
- 字體：Google Fonts（Noto Sans TC / Noto Serif TC / Cormorant Infant），注意 display=swap
- 內容與程式分離：文案進 i18n JSON；專案卡資料進結構化檔案

## 4. 建站時必做的素材處理

1. 封面 3 張 PNG → 壓縮轉 WebP（寬 ≤1600px、附 JPEG fallback 或 picture 標籤）
2. 形象照 → 縮圖轉 WebP
3. `icons/ai-ideation.svg` 含 Figma 匯出的 foreignObject 模糊層 → **移除該層**（prototype 內已有處理過的版本可對照）
4. icon 以 inline SVG 佈署（動畫與漸層才能生效），顯示尺寸 144–180px
5. 圖片全面 lazy load；SEO meta ＋ OG image；favicon（可用 logo.svg 衍生）

## 5. 已知未定／待辦（不要擅自補完，問金絲桃）

- ✍️ 專案卡說明文字：第三句結尾「解決方案」為 AI 補全，待確認；三句英文待校閱
- ✍️ 靛紫實色細節（Hero eyebrow 等處的淡紫用量）全尺寸驗收時可再微調
- 📦 Instagram 連結未提供（Footer icon 版位已留）
- 📦 Backlog：Contact 區塊、「社群參與、個人學習」內容（健檢老師點名項，日後補進 About 頁）
- 專案內頁內容與「深化設計闡述」寫作：最後階段進行

## 6. 品質底線（驗收標準）

- RWD：640 / 960 斷點行為照 prototype
- 無障礙：alt 文字、prefers-reduced-motion 全動效尊重（prototype 已示範）、文字對比照 design-tokens 規則（含已知承擔的 #EACBB8 例外）
- 效能：行動裝置避免大面積 backdrop-filter 疊加；織紋與噪點為 fixed 層各一，不重複鋪
- 展示語言規則：區塊標題統一英文（Selected Works／My Edge／Sense and Sensibility in Design），不自行添加中文對照

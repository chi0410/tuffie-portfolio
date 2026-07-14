# Tuffie Portfolio Website

金絲桃（Tuffie Chang）的個人作品集網站，回應履歷健檢回饋、強化求職競爭力。目標受眾是招募方（HR、Hiring Manager、設計主管），停留時間短，需求快速抓到重點。

## 專案狀態

設計已在 Claude.ai 完成完整迭代（IA → 文案 → Design Token → 視覺定案 → Prototype），2026-07-14 交接進 Claude Code 階段建站。**設計決策已收斂完畢，這個階段是照基準蓋房子，不是重新設計。**

## Single Source of Truth

- [handoff/README.md](handoff/README.md) — 交接總覽，第一次動工前必讀
- [handoff/docs/portfolio-spec.md](handoff/docs/portfolio-spec.md) — 需求規格書 v2.0（架構、各頁需求、素材狀態、Backlog）
- [handoff/docs/design-tokens.md](handoff/docs/design-tokens.md) — Design Tokens v2.1（色彩、字體、玻璃、織紋、動效全規則）
- [handoff/docs/homepage-copy-draft.md](handoff/docs/homepage-copy-draft.md) — 首頁文案終稿（中英，i18n 資料來源）
- [handoff/docs/about-page-copy-draft.md](handoff/docs/about-page-copy-draft.md) — About 頁文案終稿（中英）
- [handoff/prototype/homepage-prototype.html](handoff/prototype/homepage-prototype.html) — **視覺與互動基準**。正式版首頁外觀、動效、行為以此重構；除非文件另有標注，不自行更動設計決策

有疑義先問金絲桃，不要擅自決定視覺或內容。

## 本次建站範圍

- 首頁（依 prototype）＋ About 頁（文案在 docs，版面延用首頁設計語言，需與金絲桃確認佈局）
- i18n 中英雙語：文案集中於結構化檔案（JSON），語言切換即換資料
- Header：懸浮玻璃膠囊、錨點捲動、scroll spy；About 同分頁跳轉；Resume 依語言新開分頁連對應 PDF（Google Drive，上線前需確認共用權限）
- 專案內頁 × 3：**本次不做**，但路由與「進入內頁」的卡片行為要預留（暫以佔位頁或 toast 處理）

## 關鍵設計決策（不可自行更動）

- **視覺方向**：深暖底模式——暖陶暮色漸層 `#7E3D1C → #BE6E42` 為全站唯一固定底色；靛紫 `#676DAF` 僅作實色細節（線、小圖形），**禁止**做透明光暈或文字色（互補色透明疊加會混濁，已驗證）
- **字體**：Noto Sans TC（內文/UI）、Noto Serif TC（中文大字級）、Cormorant Infant（英文大字級）；襯線只用於 24px 以上，且永不用於整段長文
- **玻璃材質（Glass）白名單制**：只用於 sticky header、Works 專案卡；其他位置要先討論。My Edge 能力卡**無卡片容器**，icon＋文字直接置於背景
- **展示語言規則**：區塊標題統一英文（Selected Works／My Edge／Sense and Sensibility in Design），不自行加中文對照
- **i18n 模式**：文案 key 化（如 prototype 內 `data-k` + `T.zh` / `T.en` 物件），語言切換只換資料不換 DOM 結構
- **無障礙**：全動效尊重 `prefers-reduced-motion`；文字對比依 design-tokens 規則（含已知承擔的 `#EACBB8` 例外，屬金絲桃知情的美感取捨，不要「修正」它）
- **效能**：行動裝置避免大面積 `backdrop-filter` 疊加；織紋（knit）與噪點（grain）為 fixed 層各一，不重複鋪

## 已知未定／待辦（問金絲桃，不要擅自補完）

- 專案卡說明文字第三句英文校閱、中文「解決方案」是否為 AI 補全需確認
- 靛紫實色細節用量，全尺寸驗收時再微調
- Instagram 連結未提供，Footer icon 版位已留白
- Backlog：Contact 區塊、About 頁「社群參與、個人學習」內容
- 專案內頁內容與「深化設計闡述」寫作留到最後階段

## 建站時必做的素材處理

1. `handoff/assets/covers/` 3 張封面 PNG → 壓縮轉 WebP（寬 ≤1600px，附 fallback）
2. `handoff/assets/photo-cutout.png` 形象照 → 縮圖轉 WebP
3. `handoff/assets/icons/ai-ideation.svg` 含 Figma 匯出的 foreignObject 模糊層 → 移除（prototype 內已有處理過的版本可對照）
4. Icon 一律 inline SVG 佈署（漸層與動畫才會生效），顯示尺寸 144–180px
5. 圖片全面 lazy load；SEO meta ＋ OG image；favicon（可用 `logo.svg` 衍生）

## 協作規範（承襲 tuffie-agent skill）

- 金絲桃是 UIUX 產品設計師，不是工程師 — 用白話文＋比喻解釋，技術術語加中文備注
- 技術選型／架構決策先提方案討論，不自行決定
- 執行以下行動前先確認：刪除檔案、安裝新套件、修改超過 3 個檔案、任何部署或發布動作
- 小修改（改樣式、改文案、修小 bug）可直接執行
- 開發工具一律在 Claude 生態系內完成（Claude.ai、Claude Code）
- 一律使用繁體中文，語氣自然；中文與英文/數字之間加半形空格

## 安全

- API 金鑰與敏感資訊一律放 `.env`，並加入 `.gitignore`，絕不寫進程式碼或推上 GitHub

## Git 節奏

每完成一個建站階段就 commit 一次，保持可回溯的版本歷史。

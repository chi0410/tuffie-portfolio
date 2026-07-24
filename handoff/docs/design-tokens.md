# Design Tokens v1

版本：v2.1 終版（2026-07-14）
狀態：色彩與字體定案，標注「推測」的數值於實作時驗證
標注說明：✍️ 待金絲桃確認｜🔍 推測值，實作時驗證對比度

---

## 1. 色彩（Colors）

### 1.1 Primary（磚陶紅棕）✅ 2026-07-12 定案更換

| Token | 值 | 用途 |
|---|---|---|
| primary-10 | #FAF0EA | 區塊底色、Hero 暖底 |
| primary-20 | #F4E1D5 | hover 淡底、標籤底 |
| primary-40 | #EACBB8 | 裝飾 |
| primary-60 | #DDB297 | 裝飾 |
| primary-80 | #D29A76 | 裝飾、圖表 |
| primary-100 | #BE6E42 | 按鈕底、大色塊 ⚠️ 禁用於文字（對比約 3.4:1 🔍） |

### 1.2 Primary Mood（深陶棕）🔍 全組由主色衍生，實作時驗證

| Token | 值 | 用途 |
|---|---|---|
| primary-text | #96491F | 連結、文字強調（對比約 5.8:1 ✅ AA） |
| primary-deep-1 | #7E3D1C | hover 深化 |
| primary-deep-2 | #67321A | 深色裝飾、深底 |
| primary-vivid | #C9603A | 圖表、點綴 |

### 1.3 Secondary（藍紫）

| Token | 值 | 用途 |
|---|---|---|
| secondary-10 | #F0F0F7 | 淡底 |
| secondary-20 | #E1E2EF | 淡底、分隔 |
| secondary-40 | #C2C5DF | 裝飾 |
| secondary-60 | #A4A7CF | 裝飾 |
| secondary-80 | #858ABF | 裝飾 |
| secondary-100 | #676DAF | 輔助強調、圖表 |

### 1.4 Secondary Mood

| Token | 值 | 用途 |
|---|---|---|
| secondary-mood-1 | #B99FBF | 柔紫點綴 |
| secondary-mood-2 | ✍️ 待補 | 舊檔此格與上格重複（#B99FBF ×2），建議補一個深紫灰如 #7C7896 🔍 |
| secondary-warm-1 | #D27A73 | 暖粉點綴 |
| secondary-warm-2 | #E1ABA1 | 淡暖粉 |

### 1.5 Neutral（灰階）

#FFFFFF｜#EBEBEB｜#D6D6D6｜#C2C2C2｜#ADADAD｜#999999｜#858585｜#707070｜#5C5C5C｜#474747｜#333333｜#000000

### 1.6 語意化文字與底色（白底模式——用於白卡內部與淺色元件）

| Token | 值 | 規則 |
|---|---|---|
| text-primary | #333333 | 主文字（對比 10.9:1 ✅） |
| text-secondary | #5C5C5C | 次要文字（6.4:1 ✅） |
| text-muted | #858585 | 弱化說明，⚠️ 僅限 18px 以上或非關鍵資訊（3.5:1） |
| text-link | #96491F | 連結與強調 |
| bg-card | rgba(255,255,255,0.94) | 白卡（深底上的內容載體） |
| border | #D6D6D6 | 卡內邊框 |
| divider | #EBEBEB | 卡內分隔線 |

規則：#999999 及更淡的灰**禁止用於內文**；所有正文文字對比須達 WCAG AA（4.5:1）。

### 1.7 狀態色（Status）🔍 全組為建議值，由 Mood 色系衍生，實作時驗證

| Token | 值 | 用途 |
|---|---|---|
| success | #5B8A5E 🔍 | 成功、表單通過 |
| warning | #B7791F 🔍 | 警告（刻意避開主色橘，用深金） |
| error | #B94A3F 🔍 | 錯誤（自 #D27A73 加深至文字安全） |
| info | #676DAF | 資訊（借用 secondary-100） |

⚠️ 上表為白底版；深暖底上的狀態色需提亮另定（實作時衍生驗證）。

### 1.8 深暖底模式（Dark Warm）✅ 底色定案：絲絨暖光；靛紫細節待全尺寸驗收

#### 背景

| Token | 值 | 用途 |
|---|---|---|
| bg-gradient-main | linear-gradient(200deg, #BE6E42 0%, #8A4520 40%, #5E2D14 90%)，固定不隨捲動（fixed） | 全站唯一底色（2026-07-13：除 About Me 區塊容器外，全站共用、無區塊感） |
| bg-glow-light | radial-gradient(rgba(210,154,118, 0.55) → 透明) | 蜜色亮部（同族色，不混濁） |
| bg-glow-shadow | radial-gradient(rgba(103,50,26, 0.40) → 透明) | 深陶暗部（對角，做立體感） |
| bg-deep-zone | #7E3D1C 為主的深端 | 文字密集區的落點 |
| grain-overlay | SVG feTurbulence（fractalNoise, baseFrequency 0.85, numOctaves 2），opacity 0.16，mix-blend-mode: overlay | 全站噪點顆粒質感（2026-07-13 定案入冊） |
| knit-texture | SVG pattern 16×16：經緯 1px 虛線（dasharray 4 5），rgba(250,240,234,0.10)，全頁固定層 | 毛呢針織紋（2026-07-14 定案：A-1 虛線針目格） |
| knit-motion | stroke-dashoffset 位移，18s linear infinite（針目流動）；速度可調、移除即靜態；尊重 prefers-reduced-motion | 織紋動畫（2026-07-14 定案） |

⚠️ **禁止 #676DAF 靛紫做透明光暈**——互補色透明疊加會混濁（已驗證會產生泥色）。靛紫僅允許以**實色細節**出現：細分隔線、強調字 #E1E2EF、小型圖形（✍️ 是否採用待最終 prototype 全尺寸驗收）。

#### 深底文字色階（直接置於漸層上時）

| Token | 值 | 對比（vs 深端 #7E3D1C） | 規則 |
|---|---|---|---|
| ondark-text-1 | #FAF0EA | 7.2:1 ✅ | 標題與內文主色 |
| ondark-text-2 | #EACBB8 | 5.3:1 ✅ | 次要文字 |
| ondark-muted | rgba(250,240,234,0.65) | — | 弱化說明，僅限大字 |
| ondark-link | #E1E2EF | 6.3:1 ✅ | 連結／冷色強調（淡紫） |

#### 鐵律

1. **內文永遠壓在漸層深端**（#7E3D1C 附近）或置於白卡內——亮端 #BE6E42 上米白字僅 3.3:1，只允許 24px 以上大標題
2. **#676DAF 禁止在暖底上作文字或透明暈染**——僅作實色細節（線、小圖形）；冷色文字一律用 #E1E2EF
3. **專案封面置於玻璃卡內**（封面圖自帶淺色底，於玻璃上仍清晰）；形象照以淺色框承接
4. 全站共用單一固定背景；文字密集內容置於漸層深端（頁面下半）或容器／玻璃卡內；About Me 為唯一自帶底色的區塊容器

#### 元件深暖版

| Token | 值 |
|---|---|
| cta-glass（玻璃 CTA） | 底同 glass-dark-bg，預設細框 rgba(250,240,234,0.4)，文字 #FAF0EA；✅ hover 雙軌定案（2026-07-13）：主要 CTA（Hero View works）hover 為焦糖×藍紫漸層玻璃 linear-gradient(120deg, rgba(190,110,66,0.5), rgba(103,109,175,0.45))；次要 CTA hover 為焦糖玻璃 linear-gradient(145deg, rgba(190,110,66,0.55), rgba(190,110,66,0.15))；皆＋微上浮 |
| glass-dark-bg | linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.16) 25%, rgba(255,255,255,0.02) 100%)（2026-07-13 五修：白漆降至 0.20，模糊 16 不變、不增艷） |
| glass-dark-blur | backdrop-filter: blur(16px) |
| glass-dark-border | 1px solid rgba(255,255,255,0.32) |
| glass 上文字 | ondark-text-1／2 |
| divider-ondark | rgba(255,255,255,0.12) |

---

## 2. 字體（Typography）

### 2.1 字體家族

| Token | 字體堆疊 | 角色 |
|---|---|---|
| font-sans | "Noto Sans TC", -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif | 內文、UI、導覽、按鈕、表單（中英共用） |
| font-serif-zh | "Noto Serif TC", "PingFang TC", serif | 中文大字級襯線 |
| font-serif-en | "Cormorant Infant", "Noto Serif TC", serif | 英文大字級襯線 |

### 2.2 混用鐵律

1. 襯線只用於 **24px 以上**的字級；24px 以下一律黑體
2. 襯線永不用於整段長文
3. 內文、UI 元件、表單一律 font-sans

### 2.3 字級階層（沿用金絲桃舊版階層）

| Token | 字級 | 字體 | 字重 | 行高 | 字距 |
|---|---|---|---|---|---|
| display | 62 | serif | 600 | 1.2 | 0.02em |
| heading-1 | 32 | serif | 600 | 1.3 | 0.03em |
| heading-2 | 28 | serif | 500 | 1.35 | 0.03em |
| heading-2-bold | 24 | serif | 700 | 1.35 | 0.03em |
| title-l | 22 | sans | 500 | 1.4 | 0.02em |
| title-m | 20 | sans | 500 | 1.4 | 0.02em |
| title-s | 18 | sans | 500 | 1.5 | 0.02em |
| title-xs | 16 | sans | 500 | 1.5 | 0.02em |
| body-l | 16 | sans | 400／500 | 1.8 | 0.02em |
| body-m | 15 | sans | 400／500 | 1.8 | 0.02em |
| body-s | 13 | sans | 400／500 | 1.7 | 0.02em |
| note | 12 | sans | 300／400 | 1.6 | 0.02em |
| caption | 10 | sans | 300 | 1.5 | 0.03em |

備注：英文 Cormorant Infant 於 display 層字距設 0（它自帶古典字距）；中文內文行高 1.8 是閱讀舒適度的底線。

### 2.5 深底區塊標題層級（2026-07-13 定案）

| 層級 | 用於 | 樣式 |
|---|---|---|
| section-title | Selected Works／My Edge | serif（英文 Cormorant Infant）斜體 600，桌機約 40px，色 #FAF0EA |
| about-title | Sense and Sensibility in Design | serif 斜體 500，桌機約 28px，色 #F4E1D5（長句專用，2026-07-13 自 section-title 拆出） |
| group-title | AI × DESIGN／KIND WORDS | sans 600 全大寫，約 18px，字距 0.22em，色 #F4E1D5，右接蜜色細線 |
| 引言／導語 | 區塊標題下的說明句 | 維持內文尺寸（body-l），色 #EACBB8，不作標題處理 |

### 2.4 手機字級縮放 🔍 建議值

display 62 → 40｜heading-1 32 → 26｜heading-2 28 → 22（降級後改用 sans）｜其餘不變

---

## 3. 間距（Spacing）— 8px 網格

| Token | 值 | 常見用途 |
|---|---|---|
| space-1 | 4px | 微間距 |
| space-2 | 8px | 元件內距 |
| space-3 | 12px | 元件內距 |
| space-4 | 16px | 卡片內距 |
| space-6 | 24px | 卡片內距、元素間 |
| space-8 | 32px | 群組間 |
| space-12 | 48px | 小節間 |
| space-16 | 64px | 手機區塊間 |
| space-24 | 96px | 桌機區塊間 |
| space-32 | 128px | 大區塊呼吸 |

閱讀寬度：內文欄最大 720px（約 65–75 字元）；版心最大 1120px。

---

## 4. 形狀（Shape）

| Token | 值 |
|---|---|
| radius-s | 4px｜⚠️ 目前全站未使用（原標「標籤、小元件」，但標籤實際用 radius-full） |
| radius-m | 8px｜專案二「拆解需求」的 icon 佔位框（原標「按鈕、輸入框」，但站上按鈕實際是膠囊 radius-full） |
| radius-l | 12px｜首頁專案卡、推薦引言卡、內頁引言卡、內頁 Hero 視覺框、內頁圖表/佔位框、About 形象照圖 |
| radius-full | 999px｜標籤、語言切換鈕、toast、skip-link（膠囊） |
| border-width | 1px（一般）／0.5px（細分隔，Retina） |
| shadow-s | 0 1px 3px rgba(0,0,0,0.06) |
| shadow-m | 0 8px 24px rgba(0,0,0,0.08)（卡片 hover） |

> **圓角段落校正紀錄（2026-07-24）**：掃描全站 CSS 後，將上表 radius token 的用途描述改為實際使用對象，並補記未 token 化的硬寫值。此次僅更新文件、未改動 CSS。設計稿曾標卡片 16px，實作實際為 12px（`radius-l`），文件以實作為準；設計稿與實作的落差另案處理。

**未 token 化的硬寫圓角值**（實作中直接寫死、未對應任何 token）：

| 值 | 使用對象 |
|---|---|
| 11px | 首頁專案卡縮圖 `.card .cover` |
| 18px | 首頁 Hero 形象照框 `.pframe`、Key Outcomes 數據卡 `.cs-metric` |
| 24px | About 內容區塊 `.about-block` |
| 50% | 圓點（歷程時間軸 `.exp-dot`、Key Outcomes 條列圓點） |

**同類元件出現多種圓角值**（依交辦如實列出，暫不收斂 token，待設計端決定是否統一）：

- **卡片**：首頁專案卡／推薦引言卡／內頁引言卡 = 12px，但 Key Outcomes 數據卡 = 18px
- **圖片／形象照容器**：卡片縮圖 11px、內頁 Hero 視覺框 12px、About 形象照圖 12px、首頁 Hero 形象照框 18px

---

## 5. 斷點（Breakpoints）

| Token | 值 |
|---|---|
| sm | 640px |
| md | 768px（平板） |
| lg | 1024px（桌機） |
| xl | 1280px |

---

## 6. 動效（Motion）

| Token | 值 |
|---|---|
| duration-fast | 150ms（hover、按鈕） |
| duration-base | 250ms（一般過場） |
| duration-slow | 400ms（進場動效） |
| easing | cubic-bezier(0.4, 0, 0.2, 1) |
| 進場模式 | fade ＋ 向上位移 12px |
| 捲動 | scroll-behavior: smooth |

無障礙：尊重 prefers-reduced-motion（使用者系統關閉動畫時停用進場動效）。

---

## 7. Icon 規範 ✅ 2026-07-12 依實際檔案定案

- **風格**：彩色插畫式 icon（非單色 UI icon），畫布 90×90
- **用色**：取自 token 色盤——primary-40／80／100（磚陶系）＋ secondary-100（藍紫）點綴 ✅ 已與新主色對齊
- **顯示尺寸**：144–180px（2026-07-13 依金絲桃指示放大一倍），避免縮小於 64px（多色細節會糊）
- **佈署方式**：inline SVG（直接嵌入 HTML，讓漸層與 filter 正常運作，也方便微調）
- ⚠️ **AI Ideation 含 foreignObject 模糊**（Figma 匯出產物），網頁上可能失效；實作時移除該層，玻璃感改由第 8 節的 CSS glass token 統一實現
- **動畫（2026-07-14 定案）**：idle 呼吸漂浮——`animation: float 3.2s ease-in-out infinite`（translateY 0 → -7px → 0）；尊重 prefers-reduced-motion（系統關閉動畫時停用）；此為可逆設定，移除該規則即回復靜態
- 📦 專案封面 SVG（3 檔各 7–11MB，內嵌大型 PNG）**不可直接上線**：需改以 WebP／JPG 匯出，寬 ≤1600px、單檔 ≤300KB（建站時處理）

---

### 1.9 Hero 定案元件（2026-07-13）

- 排版：變體 A 問候式（置中）——斜體問候「this is Tuffie」→ 中文主標（兩句間置 Logo）→ Product Designer 粗黑體 → 玻璃 CTA
- 主標強調雙色：「理性結構」#E1E2EF（冷）／「感性理解」#EACBB8 淡焦糖（2026-07-14 更新；對比約 2.5:1，為金絲桃知情承擔的美感取捨，必要時可加淡字影補強）
- Logo：金絲桃 Logo.svg（25×25 原檔黑色），深底使用時染 #F4E1D5，無底無框直接置於句中

---

## 8. 玻璃材質（Glass）🔍 建議值，實作時視效果微調

| Token | 值 | 說明 |
|---|---|---|
| glass-bg | rgba(255, 255, 255, 0.6) | 玻璃底色 |
| glass-blur | backdrop-filter: blur(16px) | 模糊強度 |
| glass-border | 1px solid rgba(255, 255, 255, 0.5) | 玻璃邊緣高光 |
| glass-shadow | 0 4px 24px rgba(103, 50, 26, 0.06) | 帶主色調的柔影 |
| glass-fallback | rgba(255, 255, 255, 0.92) 實色 | 瀏覽器不支援 backdrop-filter 時的退路 |

**使用範圍（白名單制，避免濫用）：**
1. Sticky header 捲動後的底
2. Works 專案卡（2026-07-13 金絲桃指定）
3. 其他位置需先討論再用

※ My Edge 能力卡改為**無卡片容器**：icon（大尺寸）＋文字直接置於背景上（2026-07-13 金絲桃指定）

**限制**：行動裝置避免大面積玻璃（backdrop-filter 很吃效能）；玻璃上的文字對比一律以最差情境（底圖最花時）驗證 AA。

---

## 待辦清單

- [ ] secondary-mood-2 補值（舊檔重複）
- [ ] 靛紫實色細節（線＋強調字）是否採用——最終 prototype 全尺寸驗收時拍板
- [ ] 深暖底狀態色四值提亮衍生並驗證對比
- [ ] 專案封面 3 檔轉 WebP／JPG 壓縮（建站時處理）
- [ ] AI Ideation icon 移除 foreignObject 層（建站時處理）
- [ ] 玻璃深暖版與光暈強度實作時視效果微調
- [ ] 手機字級縮放實作時微調

# 專案一內頁文案正本｜跨裝置同步管理

版本：v1.0（2026-07-21）
來源：金絲桃提供之 wireframe PDF「Project_專案同步至裝置」
用途：i18n JSON 的文字來源，Claude Code 實作時以此為準
標記說明：✍️ = 待金絲桃確認／補寫　📦 = 待補圖素

---

## 0. 頁面 Meta

| 項目 | 中文 | English |
|---|---|---|
| 頁面標題（瀏覽器分頁） | 跨裝置同步管理體驗 — Tuffie Chang | Cross-device Sync Management — Tuffie Chang |
| 網址 | `/work-sync-management.html` | 同 |

---

## 1. 專案標題區

> 本頁不使用標籤（2026-07-21 定案，標籤僅出現在首頁卡片）

**主標題**
- 中：我如何重新梳理跨裝置、跨系統的同步管理體驗
- EN：How I rethought sync management across devices and systems

> ⚠️ PDF 內頁原寫「同步管理**概念**」，已統一為「**體驗**」以對齊首頁卡片與已上線文案。

**一句摘要（沿用首頁卡片說明文字）**
- 中：此專案展現我如何從表層回饋中挖掘真正的產品問題，重新梳理流程結構，並推動更符合使用者理解的體驗優化。
- EN ✍️ 待校閱：This project shows how I dug beneath surface-level feedback to uncover the real product problems — restructuring flows and driving experience improvements that match how users actually think.

**Meta 三欄**

| 欄位 | 中文 | English |
|---|---|---|
| 專案時程 | 2024/02 – 2024/05 | Feb 2024 – May 2024 |
| 團隊組成 | 專案經理 ×1、產品設計師 ×1、軟體工程師 ×3（前端、後端、AI） | PM ×1, Product Designer ×1, Engineers ×3 (Frontend, Backend, AI) |
| 我的角色 | 產品設計師 — 負責釐清問題、整合利害關係人回饋，並重構流程與介面優化 | Product Designer — defining the problem, synthesising stakeholder feedback, and restructuring the flow and interface |

📦 主視覺封面圖：沿用首頁 `cover-1-sync-management.png`（透明底 PNG）

---

## 2. 專案背景 Background

**區塊標題**
- 中：專案背景　／　EN：Background

**導言（襯線副標）**
- 中：從用戶回饋中拆解問題，推動產品從表層介面修補，轉向同步架構與流程的重新檢視
- EN：Digging beneath user feedback to re-examine the sync architecture and flow
- 備註：原譯過長（在版面上會斷成三行），2026-07-21 縮短定案。英文版**不套用中文的手動斷點**，由系統自然換行。

**內文第一段**
- 中：由於此功能需支援機器人與多個任務、團隊群組之間的同步、權限控管與內容更新，同時牽涉跨裝置的資訊呈現與任務狀態管理，因此實際問題比表面所見更加複雜，也不容易在產品初期被察覺。
- EN ✍️ 待校閱：Because the feature had to support syncing, permission control, and content updates across robots, multiple tasks, and team groups — while also handling cross-device information display and task state — the real problem ran deeper than it appeared, and was hard to spot in the product's early stages.

📦 情境示意圖（置於兩段內文之後）

**內文第二段**
- 中：因此產品上線約兩年後，隨著使用者與應用情境逐漸增加，原先隱藏的問題才陸續浮現。我在彙整大量使用者回饋與操作情境後，進一步釐清問題並非源自單一介面或個別功能，而是前期在同步架構與操作流程上的規劃不足。
- EN ✍️ 待校閱：About two years after launch, as users and use cases grew, the hidden issues began to surface. After gathering extensive user feedback and usage scenarios, I clarified that the problem didn't stem from a single screen or feature — it came from insufficient planning of the sync architecture and operational flow early on.

---

## 3. 整合多方觀點 Research

**區塊標題**
- 中：整合多方觀點　／　EN：Research

**導言**
- 中：我整合 RD、客服與用戶回饋，從矛盾訊號中釐清真正的 UX 痛點
- EN ✍️ 待校閱：I brought together feedback from RD, customer support, and users — finding the real UX pain points inside contradictory signals

> ⚠️ 原「補述段」已於 2026-07-21 移至第 2 節「專案背景」結尾（配情境示意圖），不屬於本節。

**（已移至專案背景）補述段**
- 中：這些底層邏輯未能透過介面清楚傳達，導致使用者無法正確理解機器人的當前狀態、任務之間的關聯，以及操作後可能產生的影響。當實際結果不符合使用者預期時，便容易被視為產品異常，進而降低使用者對系統的理解與信任。
- EN ✍️ 待校閱：The underlying logic was never clearly conveyed through the interface, leaving users unable to understand the robot's current state, how tasks related to one another, or what their actions would cause. When results didn't match expectations, it read as a product malfunction — eroding users' understanding of and trust in the system.

**三則角色引言卡**（沿用首頁 Kind Words 玻璃卡樣式）

| 角色 | 中文引言 | English ✍️ 待校閱 |
|---|---|---|
| RD | 經常花大量時間排查問題，但結果又跟客戶的說法有出入。 | We spend hours debugging, and the findings still don't match what the customer describes. |
| CS | 大量客人反應機器人大腦有異常，提交給相關部門後卻告知我們大腦正常。 | Customers keep reporting the robot's brain is faulty — but every time we escalate it, we're told the brain is fine. |
| Customer | 明明取消專案了，機器人怎麼還回話，讓客人接收到已過期的優惠價格。 | I cancelled the project, so why is the robot still replying — and quoting expired promotional prices to my customers? |

> ✅ 排列順序定案（2026-07-21）：**CS → RD → Customer**，讓三則引言讀起來像一組互相打架的訊號，呼應導言的「矛盾訊號」。

---

## 4. 核心痛點歸納 Problem

**區塊標題**
- 中：核心痛點歸納　／　EN：Problem

**導言**
- 中：我發現同步流程的系統邏輯，與用戶對操作結果的預期存在落差
- EN ✍️ 待校閱：I found a gap between the system logic of the sync flow and what users expected their actions to do

**三個痛點**

| # | 中文標題 | 中文說明 | English ✍️ 待校閱 |
|---|---|---|---|
| 1 | 同步範圍缺乏可見性 | 使用者無法在操作前確認同步會影響哪些任務與裝置，難以預測操作後的結果。 | **Sync scope wasn't visible** — Users couldn't confirm which tasks and devices a sync would affect before acting, making outcomes hard to predict. |
| 2 | 同步規則缺乏明確說明 | 系統未清楚說明同步條件與狀態變化，增加操作結果的不確定性，也降低使用者的操作信心。 | **Sync rules weren't explained** — The system never spelled out sync conditions or state changes, adding uncertainty and lowering users' confidence. |
| 3 | 取消同步後狀態不一致 | 前端操作與後端資料狀態未能一致更新，導致使用者誤以為同步失敗或機器人發生故障。 | **State drifted after cancelling** — Frontend actions and backend data didn't update in step, so users assumed the sync had failed or the robot was broken. |

📦 對照圖：預期操作流程 vs 實際操作體驗（兩欄並排的流程對照）
- 圖說中：預期操作流程　／　實際操作體驗
- 圖說 EN：Expected flow　／　Actual experience

---

## 5. 優化目標與策略 Strategy

**區塊標題**
- 中：優化目標與策略　／　EN：Strategy

**導言**
- 中：對齊系統邏輯與用戶預期，建立可信任的同步體驗
- EN：Aligning system logic with user expectations to build trust（2026-07-21 縮短）

**策略敘述**
- 中：我重新梳理產品流程與同步規則，釐清裝置、任務與團隊群組之間的系統關係，並對齊系統行為、用戶預期與介面回饋，讓操作結果清楚可預期，重建用戶對產品的信任。
- EN ✍️ 待校閱：I restructured the product flow and sync rules, clarified how devices, tasks, and team groups relate to one another, and aligned system behaviour, user expectations, and interface feedback — making outcomes predictable and rebuilding trust in the product.

**三個策略**

| # | 中文標題 | 中文說明 | English ✍️ 待校閱 |
|---|---|---|---|
| 1 | 優化操作流程 | 重構流程對齊 User 的操作預期，並視覺化同步狀態。 | **Rebuilt the flow** — Restructured the flow around users' expectations and made sync status visible. |
| 2 | 整合跨端資訊 | 整合不同裝置中的同步資訊呈現與任務狀態。 | **Unified cross-device data** — Consolidated how sync information and task status appear across devices.（標題 2026-07-21 縮短） |
| 3 | 定義後端規則 | 將同步取消後的規則從「遞補」改為「淨空」，避免不明干擾。 | **Redefined the backend rule** — Changed post-cancellation behaviour from "backfill" to "clear", removing unexplained interference. |

> ⚠️ 原稿「整合在不同裝置中的同步資訊**顯**呈現與任務狀態」疑為多一字，已修正為「呈現」。

---

## 6. 優化成果 Solution

**區塊標題**
- 中：優化成果　／　EN：Solution

**導言**（2026-07-21 定案）
- 中：讓每一次同步操作，都能被看見、被預期、被信任
- EN：Making every sync visible, predictable, and trustworthy（**不斷行**，自然換行）

**三組「畫面＋說明」**

> 🚧 **此區保留版位，內容待補**（2026-07-21）
> 金絲桃將另外製作流程圖來呈現優化成果，屆時再補上圖素與對應說明文字。
> 實作時請預留一個完整區塊的空間（建議：可容納 1–3 組「圖＋說明」的圖文交錯版位），
> 以佔位框標示，不要填入暫代內容。
>
> 參考素材（原 wireframe 內容，暫不使用，待流程圖完成後重新定義）：
> 開啟「同步至裝置」／點擊確認「同步」／機器人同步清單

## 7. 重點總結 Takeaways

**區塊標題**
- 中：重點總結　／　EN：Takeaways

**總結段**
- 中：此次產品優化的核心能力，是將**看不見的系統行為轉化為用戶能理解、能預期的回饋**。我建立起以系統視角進行 UX 規劃的方法，透過用戶回饋逐步釐清問題，並在跨裝置、多專案與機器人端的複雜情境中，將零散的操作痛點回推到規則層，解決真正的系統狀態與流程問題，進一步提升系統穩定性與用戶信任。
- EN ✍️ 待校閱：The core capability behind this optimisation was turning **invisible system behaviour into feedback users can understand and anticipate**. I built a way of approaching UX from a systems perspective — using user feedback to clarify the problem step by step, and tracing scattered pain points back to the rule layer across a complex landscape of devices, projects, and robot endpoints — resolving the underlying state and flow issues, and strengthening both system stability and user trust.

> ⚠️ 原稿「提升系統穩定性與**僧**用戶信任」為錯字，已修正為「與用戶信任」。

**三個成效**

| # | 中文標題 | 中文說明 | English ✍️ 待校閱 |
|---|---|---|---|
| 1 | 建立用戶操作預期 | 讓操作行為與預期一致，建立用戶信心，讓規則被看見。 | **Set clear expectations** — Actions now match outcomes, building confidence and making the rules visible. |
| 2 | 穩定後端系統 | 對齊使用者的操作預期，並重新定義後端對資料的處理方式。 | **Stabilised the backend** — Aligned with user expectations and redefined how the backend handles data. |
| 3 | 降低內部耗能 | 減少人工排查問題的時間，同時降低反覆的溝通成本。 | **Reduced internal cost** — Less time spent manually debugging, and fewer repeated rounds of communication. |

> ⚠️ 原稿「讓操作行為與預期 致」已修正為「一致」；「看見規則」語意不完整，已補為「讓規則被看見」。

---

## 8. Next Project

- 標題統一使用英文 **Next Project**（不做中文對照，2026-07-21 定案）
- 指向：專案二「不僅重構官網，而是完成企業轉型下的品牌敘事翻新」
- 專案二內頁尚未製作前，此按鈕先指回首頁 Works 區塊

---

## 待辦清單

| 項目 | 狀態 |
|---|---|
| 第 6 節「優化成果」三組畫面內容 | 🚧 金絲桃另製流程圖後補上，版位先預留 |
| 第 6 節導言 | ✅ 已定案 |
| 第 3 節引言排列順序 | ✅ 已定案 CS → RD → Customer |
| 全篇英文翻譯 | ✍️ 待校閱 |
| 預期 vs 實際流程對照圖 | 📦 待提供 |
| 三組介面截圖／示意圖 | 📦 待提供 |
| 主視覺封面圖 | ✅ 沿用首頁 cover-1-sync-management.png |

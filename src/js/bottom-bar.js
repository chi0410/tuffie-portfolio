// 手機底部 bar 的捲動縮放（follow IG 的體驗）
//   往下滑 → 縮小（看內容）
//   往上滑 → 放大（想操作）
//   點 bar 上任一項目 → 放大，原本的功能照常執行（跳頁／展開表單／切語言）
//   頁面載入時是大態
//
// 這支只負責「什麼時候該大、什麼時候該小」，縮放交給 CSS 的 .is-bar-small
// （定義在 components.css 的 ≤768 media query 裡）。所以桌機不受影響——
// 就算 class 被切換，桌機沒有任何規則會理會它。

const THRESHOLD = 8; // 位移超過這個距離才反應，避免太靈敏一直抖
const BOTTOM_SLACK = 4; // 判定「已捲到底」的容差

export function initBottomBar() {
  const bar = document.querySelector('header');
  if (!bar) return;

  let lastY = window.scrollY;

  const grow = () => bar.classList.remove('is-bar-small');
  const shrink = () => bar.classList.add('is-bar-small');

  addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;

      // 表單開啟時 body 被固定住（見 components.css 的 body.ct-open），
      // 捲動位置會被歸零，那不是使用者滑的，只同步基準點、不判斷方向
      if (document.body.classList.contains('ct-open')) {
        lastY = y;
        return;
      }

      // 邊界：捲到最頂維持大態、最底維持小態，
      // 免得 iOS 的回彈把方向判成相反、bar 在邊界忽大忽小
      if (y <= 0) {
        grow();
        lastY = y;
        return;
      }
      if (y + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_SLACK) {
        shrink();
        lastY = y;
        return;
      }

      const dy = y - lastY;
      if (Math.abs(dy) < THRESHOLD) return; // 沒過門檻，基準點也留著，才能累積到門檻
      if (dy > 0) shrink();
      else grow();
      lastY = y;
    },
    { passive: true }
  );

  // 關閉聯絡表單時，contact.js 會用 scrollTo 還原原本的捲動位置。
  // 那一下的大幅位移不是使用者滑的，會被誤判成「往下滑」而讓 bar 無故縮小。
  // 監看 body 的 class（ct-open 加或移除）就重設基準點：
  // MutationObserver 的回呼在該次工作結束時就跑，早於稍後才派送的 scroll 事件，
  // 等 scroll 進來時位移已經是 0，不會誤觸發。
  new MutationObserver(() => {
    lastY = window.scrollY;
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // 點 bar 上任一項目就放大。用捕獲階段、也不擋預設行為，
  // 所以子元素自己 stopPropagation 或 preventDefault 都不影響這裡。
  // pointerdown 讓手指一碰就有反應，click 則涵蓋鍵盤操作（Enter 不會產生 pointerdown）。
  bar.addEventListener('pointerdown', grow, true);
  bar.addEventListener('click', grow, true);
}

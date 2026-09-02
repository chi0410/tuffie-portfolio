// 報價頁的兩個互動元件：加值服務分頁（tabs）與手風琴（accordion）。
// 邏輯沿用重整前的版本，只是從 inline script 搬成模組。

// ---- 加值服務分頁 ----
// WAI-ARIA Tabs 慣例：roving tabindex（只有選中的分頁進得了 Tab 鍵順序），
// 左右／上下鍵在分頁間循環移動，Home／End 跳頭尾。
export function initTabs() {
  const list = document.querySelector('[data-vs-tabs]');
  if (!list) return;

  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
  if (tabs.length === 0) return;

  function select(i, moveFocus) {
    tabs.forEach((tab, n) => {
      const on = n === i;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (moveFocus) tabs[i].focus();
  }

  // 由腳本重新建立一次初始狀態，確保 aria 與 tabindex 一致
  // （JS 失效時三個面板全開，剛好是可接受的退路，也跟列印行為一致）
  select(0);

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });
  });
}

// ---- 手風琴 ----
// 通用元件：頁面上任何 [data-accordion] 都會被接管，可多組並存。
// 收合／展開的文案由 data-label-collapsed / data-label-expanded 決定，不寫死；
// 這兩個屬性的值由 proposal-i18n.js 依語言填入。
export function initAccordion() {
  document.querySelectorAll('[data-accordion]').forEach((acc) => {
    const btn = acc.querySelector('.acc-trigger');
    const content = acc.querySelector('.acc-content');
    const txt = acc.querySelector('.acc-txt');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      content.classList.toggle('open', open);
      if (txt) txt.textContent = open ? btn.dataset.labelExpanded : btn.dataset.labelCollapsed;
    });
  });
}

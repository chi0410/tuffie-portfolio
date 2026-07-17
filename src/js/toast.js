// Toast 提示——處理所有 [data-stub] 元素（目前為專案卡）的點擊
// 依 prototype 邏輯重製：阻止預設行為（不會連到 # 或空白頁），顯示對應語言的提示文字，
// 2.2 秒後自動收合。首頁與 About 頁共用這份邏輯，只是傳入的「目前語言文案」來源不同。

const STUB_KEY_MAP = {
  case: 'stubCase',
  about: 'stubAbout',
};

let hideTimer;

function showToast(message) {
  const toastEl = document.getElementById('toast');
  if (!toastEl || !message) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// getCopy: () => 回傳目前語言的文案物件（例如 currentLangCopy() / currentAboutLangCopy()）
export function initToast(getCopy) {
  document.querySelectorAll('[data-stub]').forEach((el) => {
    const trigger = (e) => {
      e.preventDefault();
      const dict = getCopy();
      const copyKey = STUB_KEY_MAP[el.dataset.stub];
      if (copyKey && dict[copyKey]) showToast(dict[copyKey]);
    };
    el.addEventListener('click', trigger);
    // 專案卡是 <article role="button">，原生不吃鍵盤操作，補上 Enter／Space 觸發
    // （<a> 連結本身鍵盤就能觸發 click，這裡多綁一次無副作用）
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') trigger(e);
    });
  });
}

// 語言偏好共用工具——用 localStorage 記住使用者選擇的語言，
// 讓首頁和 About 頁共用同一組 key，切換一次、全站（含重新整理）都維持該語言。

const KEY = 'tuffie-lang';

// 網址參數指定語言：?lang=en 顯示英文、?lang=tw（或 zh）顯示中文。
// 容錯：不分大小寫，也接受 en-US／zh-TW 這類寫法；無法辨識就回 null 交給後面的判斷。
function getLangFromUrl() {
  try {
    const raw = new URLSearchParams(window.location.search).get('lang');
    if (!raw) return null;
    const value = raw.trim().toLowerCase();
    if (value === 'en' || value.startsWith('en-')) return 'en';
    if (value === 'tw' || value === 'cn' || value === 'zh' || value.startsWith('zh')) return 'zh';
    return null;
  } catch {
    return null;
  }
}

// 判斷順序：網址參數 → localStorage 記憶 → 預設語言
export function getStoredLang(fallback = 'zh') {
  const fromUrl = getLangFromUrl();
  if (fromUrl) {
    // 一併記住：分享出去的連結只有該頁帶參數，記住才能讓後續頁面維持同一語言
    setStoredLang(fromUrl);
    return fromUrl;
  }
  try {
    const value = localStorage.getItem(KEY);
    return value === 'zh' || value === 'en' ? value : fallback;
  } catch {
    // 無痕模式等 localStorage 不可用的情況，靜默退回預設語言，不擋頁面運作
    return fallback;
  }
}

export function setStoredLang(lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // 同上，寫入失敗就當作沒記住，不影響當次切換的顯示結果
  }
}

// Resume PDF 依語言對應——中英文各一份檔案，放在 public/assets/ 下
export function resumeHrefFor(lang) {
  return lang === 'en' ? '/assets/resume-en.pdf' : '/assets/resume-zh.pdf';
}

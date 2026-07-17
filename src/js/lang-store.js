// 語言偏好共用工具——用 localStorage 記住使用者選擇的語言，
// 讓首頁和 About 頁共用同一組 key，切換一次、全站（含重新整理）都維持該語言。

const KEY = 'tuffie-lang';

export function getStoredLang(fallback = 'zh') {
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
